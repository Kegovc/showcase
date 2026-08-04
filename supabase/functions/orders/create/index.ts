// supabase/functions/orders/create/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client } = createSupabaseClient(req);

  try {
    const body = await req.json();
    const { session_id, email, shipping_address, billing_address } = body;

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'session_id required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get cart with items
    const { data: cart } = await client
      .from('carts')
      .select('id, session_id')
      .eq('session_id', session_id)
      .single();

    if (!cart) {
      return new Response(
        JSON.stringify({ error: 'Cart not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const { data: items } = await client
      .from('cart_items')
      .select(`
        quantity, unit_price,
        products!inner (id, sku, name)
      `)
      .eq('cart_id', cart.id);

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart is empty' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const tax = subtotal * 0.16; // 16% IVA Mexico
    const shipping = subtotal > 999 ? 0 : 99; // Free shipping over $999
    const total = subtotal + tax + shipping;

    // Create order
    const { data: order, error: orderError } = await client
      .from('orders')
      .insert({
        session_id: session_id,
        company_id: 'sire',
        status: 'pending',
        subtotal,
        tax,
        shipping,
        total,
        currency: 'MXN',
        email,
        shipping_address,
        billing_address
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.products.id,
      product_name: item.products.name,
      product_sku: item.products.sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity
    }));

    const { error: itemsError } = await client
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear cart
    await client.from('cart_items').delete().eq('cart_id', cart.id);

    return new Response(
      JSON.stringify({ 
        id: order.id, 
        status: order.status, 
        total: order.total,
        mp_preference_id: order.mp_preference_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});