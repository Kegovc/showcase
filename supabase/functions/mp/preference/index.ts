// supabase/functions/mp/preference/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client, companyId } = createSupabaseClient(req);
  const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');

  if (!mpAccessToken) {
    return new Response(
      JSON.stringify({ error: 'MP_ACCESS_TOKEN not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { orderId, items, backUrls, payer } = body;

    if (!orderId || !items || !items.length) {
      return new Response(
        JSON.stringify({ error: 'orderId and items required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify order exists and belongs to company
    const { data: order } = await client
      .from('orders')
      .select('id, email')
      .eq('id', orderId)
      .eq('company_id', companyId)
      .single();

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Create Mercado Pago preference
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://kegovc.github.io/showcase';
    
    const preference = {
      items: items.map(item => ({
        title: item.title,
        unit_price: Number(item.unitPrice),
        quantity: item.quantity,
        currency_id: 'MXN',
      }),
      back_urls: backUrls || {
        success: `${frontendUrl}/payment/success`,
        failure: `${frontendUrl}/payment/failure`,
        pending: `${frontendUrl}/payment/pending`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mp/webhook`,
      payer: payer || { email: order.email },
      expires: false,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MP API error: ${error}`);
    }

    const data = await response.json();

    // Update order with preference ID
    await client
      .from('orders')
      .update({ mp_preference_id: data.id })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({ 
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
        preference_id: data.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});