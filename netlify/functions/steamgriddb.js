// netlify/functions/steamgriddb.js
// Proxy para SteamGridDB — evita CORS y oculta la API key

exports.handler = async function(event) {
  const SGDB_KEY = process.env.SGDB_KEY;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  const { nombre } = event.queryStringParameters || {};
  if (!nombre) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Falta nombre' }) };
  }

  try {
    // Paso 1: buscar el juego por nombre
    const searchRes = await fetch(
      `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(nombre)}`,
      { headers: { 'Authorization': `Bearer ${SGDB_KEY}` } }
    );
    if (!searchRes.ok) throw new Error(`SGDB search error ${searchRes.status}`);
    const searchData = await searchRes.json();
    const gameId = searchData.data?.[0]?.id;

    if (!gameId) {
      return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: null }) };
    }

    // Paso 2: pedir portada vertical
    const gridRes = await fetch(
      `https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900,342x482&limit=1`,
      { headers: { 'Authorization': `Bearer ${SGDB_KEY}` } }
    );
    if (!gridRes.ok) throw new Error(`SGDB grid error ${gridRes.status}`);
    const gridData = await gridRes.json();
    const url = gridData.data?.[0]?.url || null;

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err.message })
    };
  }
};