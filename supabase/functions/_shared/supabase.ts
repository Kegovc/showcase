// supabase/functions/_shared/supabase.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function createSupabaseClient(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  // Get company_id from header (set by middleware or passed by frontend)
  const companyId = req.headers.get('x-company-id') || 'sire';
  
  const client = createClient(supabaseUrl, serviceRoleKey, {
    global: {
      headers: {
        'x-company-id': companyId,
      },
    },
  });
  
  // Set the company_id in the session for RLS
  // This will be used by the current_company_id() function
  return { client, companyId };
}

export async function getCompanyId(req: Request): Promise<string> {
  const headerId = req.headers.get('x-company-id');
  if (headerId) return headerId;
  
  // Fallback to subdomain lookup if needed
  const host = req.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    // Could lookup from companies table by slug
    return 'sire'; // fallback
  }
  
  return 'sire'; // default
}