// supabase/functions/cart/update/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client } = createSupabaseClient(req);
  const url = new URL(req.url);
  const itemId = url.pathname.split('/').pop();

  try {
    const body = await req.json();
    const { quantity } = body;

    if (quantity < 1) {
      // Delete item
      const { error } = await client
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, deleted: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Update quantity
    const { error } = await client
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});