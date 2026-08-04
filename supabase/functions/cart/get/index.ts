// supabase/functions/cart/get/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client, companyId } = createSupabaseClient(req);
  const sessionId = req.headers.get('x-session-id') || crypto.randomUUID();

  try {
    // Get or create cart
    let { data: cart, error } = await client
      .from('carts')
      .select('id, session_id, created_at, updated_at')
      .eq('session_id', sessionId)
      .eq('company_id', 'sire')
      .single();

    if (error && error.code === 'PGRST116') {
      // Create new cart
      const { data: newCart, error: createError } = await client
        .from('carts')
        .insert({ session_id: sessionId, company_id: 'sire' })
        .select()
        .single();
      
      if (createError) throw createError;
      cart = newCart;
    } else if (error) {
      throw error;
    }

    // Get cart items with product details
    const { data: items, error: itemsError } = await client
      .from('cart_items')
      .select(`
        id,
        quantity,
        unit_price,
        product_id,
        products!inner (
          id, sku, name, category_id, type_id, format_id, variant_id, price, image_url
        )
      `)
      .eq('cart_id', cart.id);

    if (itemsError) throw itemsError;

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
        items: formattedItems,
        created_at: cart.created_at,
        updated_at: cart.updated_at
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