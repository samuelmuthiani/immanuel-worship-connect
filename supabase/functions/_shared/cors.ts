const allowedOrigins = [
    'https://id-preview--52b67a8b-d9f4-45de-9131-5069f3d1ec75.lovable.app',
    'https://immanuelworshipconnect.lovable.app',
    'http://localhost:5173',
    'http://localhost:3000',
];

export function getCorsHeaders(req?: Request): Record<string, string> {
    const origin = req?.headers?.get('origin') || '';
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
        'Access-Control-Allow-Credentials': 'true',
    };
}

// Keep backward compat export for functions that don't pass req
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};
