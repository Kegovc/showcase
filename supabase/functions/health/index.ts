// supabase/functions/health/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getCompanyId } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const companyId = await getCompanyId(req);
  
  return new Response(
    JSON.stringify({ 
      ok: true, 
      company_id: companyId,
      timestamp: new Date().toISOString(),
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
});