export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'authorization, x-client-info, apikey, content-type, x-tokenqo-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
        },
      });
    }

    const pathMap = {
      '/v1/design-tokens': '/functions/v1/get-design-tokens',
      '/v1/save-snapshot': '/functions/v1/save-snapshot',
      '/v1/upload-brand-asset': '/functions/v1/upload-brand-asset',
      '/v1/generate-json-config': '/functions/v1/generate-json-config',
    };

    const targetPath = pathMap[url.pathname];
    if (!targetPath) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const targetUrl = `https://xhnxfeqswchetpzebxtx.supabase.co${targetPath}${url.search}`;

    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    const response = await fetch(modifiedRequest);

    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Headers',
      'authorization, x-client-info, apikey, content-type, x-tokenqo-token');

    return newResponse;
  },
};
