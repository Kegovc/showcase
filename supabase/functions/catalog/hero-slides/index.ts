// supabase/functions/catalog/hero-slides/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../../_shared/cors.ts';
import { createSupabaseClient } from '../../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const { client, companyId } = createSupabaseClient(req);

  try {
    const { data, error } = await client
      .from('hero_slides')
      .select('id, image_url, subtitle, title, cta_label, href')
      .eq('company_id', companyId)
      .eq('active', true)
      .order('sort_order');

    if (error) throw error;

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});