// Sube el audio (ya comprimido por el navegador) a AssemblyAI.
// Requiere la variable de entorno ASSEMBLYAI_API_KEY configurada en Netlify.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falta configurar ASSEMBLYAI_API_KEY en Netlify (Site settings > Environment variables).' }) };
  }

  try {
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '', 'binary');

    const res = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: bodyBuffer
    });

    const data = await res.json();
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: data.error || 'Error al subir el audio a AssemblyAI.' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ upload_url: data.upload_url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
