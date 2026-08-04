// supabase/functions/catalog/products/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client, companyId } = createSupabaseClient(req);
  const url = new URL(req.url);

  try {
    const category = url.searchParams.get('category');
    const type = url.searchParams.get('type');
    const format = url.searchParams.get('format');
    const variant = url.searchParams.get('variant');

    let query = client
      .from('products')
      .select('id, sku, name, category_id, type_id, format_id, variant_id, price, image_url, stock, active')
      .eq('company_id', companyId)
      .eq('active', true);

    if (category) query = query.eq('category_id', category);
    if (type) query = query.eq('type_id', type);
    if (format) query = query.eq('format_id', format);
    if (variant) query = query.eq('variant_id', variant);

    const { data, error } = await query.order('id');

    if (error) throw error;

    // Group by category for frontend compatibility
    const grouped: Record<string, any[]> = {};
    data?.forEach(p => {
      if (!grouped[p.category_id]) grouped[p.category_id] = [];
      grouped[p.category_id].push(p);
    });

    return new Response(
      JSON.stringify(grouped),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});