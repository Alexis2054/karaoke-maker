// Envía el audio subido a transcribir en AssemblyAI con marcas de tiempo por palabra.
// Usa Universal-3 Pro (mayor precisión) con fallback a Universal-2.
// Requiere la variable de entorno ASSEMBLYAI_API_KEY configurada en Netlify.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falta configurar ASSEMBLYAI_API_KEY en Netlify.' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    if (!payload.audio_url) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta audio_url.' }) };
    }

    // Universal-3 Pro es el modelo más preciso de AssemblyAI (junio 2026).
    // Hacemos fallback a Universal-2 si el primero no está disponible.
    const requestBody = {
      audio_url: payload.audio_url,
      speech_models: ['universal-3-pro', 'universal-2'],
      punctuate: true,
      format_text: true
    };

    if (payload.language_detection) {
      requestBody.language_detection = true;
    } else {
      requestBody.language_code = payload.language_code || 'es';
    }

    // Palabras clave opcionales para mejorar precisión en nombres propios / jerga
    if (Array.isArray(payload.keyterms) && payload.keyterms.length) {
      requestBody.keyterms_prompt = payload.keyterms.slice(0, 100);
    }

    const res = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: data.error || 'Error al enviar a transcribir.' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ id: data.id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
