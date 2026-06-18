// Consulta el estado de una transcripción en AssemblyAI.
// Requiere la variable de entorno ASSEMBLYAI_API_KEY configurada en Netlify.
exports.handler = async (event) => {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falta configurar ASSEMBLYAI_API_KEY en Netlify (Site settings > Environment variables).' }) };
  }

  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Falta id.' }) };
  }

  try {
    const res = await fetch('https://api.assemblyai.com/v2/transcript/' + encodeURIComponent(id), {
      headers: { 'Authorization': apiKey }
    });
    const data = await res.json();
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: data.error || 'Error al consultar el estado.' }) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: data.status,
        text: data.text,
        words: data.words,
        error: data.error
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
