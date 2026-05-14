// netlify/functions/airtable.js
// ─────────────────────────────────────────────────────────────────
// Proxy seguro entre tu web y Airtable.
// El token NUNCA llega al navegador — vive en las variables de entorno de Netlify.
//
// Tu web llama a:  /.netlify/functions/airtable?table=Mangas
// Esta función llama a Airtable con el token y devuelve los datos.
// ─────────────────────────────────────────────────────────────────

exports.handler = async function(event) {
  const TOKEN   = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;

  // Headers CORS — permite que tu web (cualquier origen en Netlify) llame a esta función
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
  };

  // Preflight CORS (el navegador lo manda antes de cada request)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Parámetros que manda tu web
  const params  = event.queryStringParameters || {};
  const table   = params.table;      // ej: "Mangas", "Juegos", "Libros"
  const recordId = params.id;        // ej: "recXXXXXX" (para PATCH y DELETE)
  const method  = event.httpMethod;  // GET, POST, PATCH, DELETE

  if (!table) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Falta el parámetro "table"' })
    };
  }

  // Construir URL de Airtable
  let airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`;
  if (recordId) airtableUrl += `/${recordId}`;

  // Para GET: pasar parámetros de paginación, orden, etc.
  if (method === 'GET') {
    const queryParams = new URLSearchParams();
    if (params.pageSize)  queryParams.set('pageSize',  params.pageSize);
    if (params.offset)    queryParams.set('offset',    params.offset);
    if (params.sortField) {
      queryParams.set('sort[0][field]',     params.sortField);
      queryParams.set('sort[0][direction]', params.sortDir || 'asc');
    }
    const qs = queryParams.toString();
    if (qs) airtableUrl += `?${qs}`;
  }

  try {
    const response = await fetch(airtableUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      // Para POST y PATCH, reenviar el body que mandó tu web
      body: (method === 'POST' || method === 'PATCH') ? event.body : undefined
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
