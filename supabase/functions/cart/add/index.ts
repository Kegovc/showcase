// supabase/functions/cart/add/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client, companyId } = createSupabaseClient(req);
  const sessionId = req.headers.get('x-session-id') || crypto.randomUUID();

  try {
    const body = await req.json();
    const { product_id, quantity = 1 } = body;

    if (!product_id) {
      return new Response(
        JSON.stringify({ error: 'product_id required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get product details
    const { data: product, error: productError } = await client
      .from('products')
      .select('id, sku, name, price, image_url, stock')
      .eq('id', product_id)
      .eq('company_id', 'sire')
      .eq('active', true)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (product.stock < quantity) {
      return new Response(
        JSON.stringify({ error: 'Insufficient stock' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get or create cart
    let { data: cart, error: cartError } = await client
      .from('carts')
      .select('id')
      .eq('session_id', req.headers.get('x-session-id') || crypto.randomUUID())
      .eq('company_id', 'sire')
      .single();

    if (cartError && cartError.code === 'PGRST116') {
      const { data: newCart, error: createError } = await client
        .from('carts')
        .insert({ session_id: req.headers.get('x-session-id') || crypto.randomUUID(), company_id: 'sire' })
        .select()
        .single();
      
      if (createError) throw createError;
      cart = newCart;
    } else if (cartError) {
      throw cartError;
    }

    // Add or update cart item
    const { data: existingItem } = await client
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', product.id)
      .single();

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return new Response(
          JSON.stringify({ error: 'Insufficient stock' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const { error: updateError } = await client
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);
      
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await client
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: product.id,
          quantity,
          unit_price: product.price
        });
      
      if (insertError) throw insertError;
    }

    // Return updated cart
    const { data: items } = await client
      .from('cart_items')
      .select(`
        id, quantity, unit_price, product_id,
        products!inner (id, sku, name, category_id, type_id, format_id, variant_id, price, image_url)
      `)
      .eq('cart_id', cart.id);

    const formattedItems = items?.map(item => ({
      id: item.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      product: item.products
    })) || [];

    return new Response(
      JSON.stringify({ 
        id: cart.id, 
        session_id: cart.session_id, 
        items: formattedItems
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