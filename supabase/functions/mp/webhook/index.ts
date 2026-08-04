// supabase/functions/mp/webhook/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';
import { createHmac } from 'https://deno.land/std@0.177.0/crypto/hmac.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client } = createSupabaseClient(req);
  const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
  const webhookSecret = Deno.env.get('MP_WEBHOOK_SECRET');

  if (!mpAccessToken || !webhookSecret) {
    return new Response(
      JSON.stringify({ error: 'MP credentials not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  // Verify webhook signature
  const signature = req.headers.get('x-signature');
  const requestId = req.headers.get('x-request-id');
  
  if (signature && requestId && webhookSecret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    
    const data = `id=${requestId}`;
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const expectedSignature = 'sha256=' + Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    if (signature !== expectedSignature) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  }

  try {
    const body = await req.json();
    
    if (body.type !== 'payment') {
      return new Response('OK', { headers: corsHeaders, status: 200 });
    }

    // Get payment details from MP
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
      headers: { 'Authorization': `Bearer ${mpAccessToken}` },
    });
    
    if (!paymentRes.ok) {
      throw new Error('Failed to fetch payment from MP');
    }
    
    const payment = await paymentRes.json();

    // Idempotency check
    const { data: existing } = await client
      .from('payments')
      .select('id')
      .eq('mp_payment_id', payment.id)
      .single();

    if (existing) {
      return new Response('OK', { headers: corsHeaders, status: 200 });
    }

    // Find order by external_reference
    const orderId = payment.external_reference;
    const { data: order } = await client
      .from('orders')
      .select('id, company_id')
      .eq('id', orderId)
      .single();

    if (!order) {
      return new Response('Order not found', { headers: corsHeaders, status: 404 });
    }

    // Save payment
    await client.from('payments').insert({
      mp_payment_id: payment.id,
      mp_preference_id: payment.preference_id,
      order_id: orderId,
      status: payment.status,
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      payment_method_id: payment.payment_method_id,
      payment_type_id: payment.payment_type_id,
      raw_response: payment,
    });

    // Update order status
    const statusMap: Record<string, string> = {
      'approved': 'paid',
      'pending': 'pending',
      'rejected': 'rejected',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
    };

    await client
      .from('orders')
      .update({ 
        status: statusMap[payment.status] || 'pending',
        mp_payment_id: payment.id
      })
      .eq('id', orderId);

    // Clear cart if paid
    if (payment.status === 'approved') {
      await client.from('carts').delete().eq('session_id', order.session_id);
    }

    return new Response('OK', { headers: corsHeaders, status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});