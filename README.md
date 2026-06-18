# Karaoke Maker — guía de despliegue

## Qué cambió respecto a la versión de un solo archivo
Ahora el proyecto es una carpeta, no un solo HTML. La carpeta extra `netlify/functions`
esconde tu clave de AssemblyAI para que nadie pueda robarla desde el navegador.

**Importante:** el "arrastrar y soltar" en app.netlify.com/drop ya no sirve para este
proyecto porque no procesa las funciones. Necesitas una de estas dos opciones:

- **Opción A (recomendada): conectar un repositorio de GitHub.** Sube esta carpeta a un
  repo nuevo, luego en Netlify: "Add new project" → "Import an existing project" → elige
  el repo. Netlify detecta `netlify.toml` solo y despliega tanto el sitio como las funciones.
- **Opción B: Netlify CLI.** Instala con `npm install -g netlify-cli`, entra a esta carpeta
  en tu terminal y corre `netlify deploy --prod`. Funciona sin GitHub.

## 1. Crea tu cuenta de AssemblyAI
1. Ve a https://www.assemblyai.com/ y regístrate (incluye 50 USD de crédito gratis).
2. Copia tu API key desde el dashboard.

## 2. Configura la clave en Netlify
1. En el panel de tu sitio en Netlify: Project configuration → Environment variables.
2. Agrega una variable llamada `ASSEMBLYAI_API_KEY` con el valor de tu clave.
3. Vuelve a desplegar (Trigger deploy) para que la función la tome.

## 3. Cómo usar la pestaña "Generar con IA"
- Sube el audio principal de la canción (el que se escuchará en el video final).
- Si separaste la voz en Moisés, sube esa pista aislada en el campo opcional "Pista de
  voz aislada" — la transcripción será mucho más precisa que con la mezcla completa.
- Elige el idioma y toca "Transcribir con IA". El navegador comprime el audio
  automáticamente antes de enviarlo (esto es normal, evita límites de tamaño de Netlify).
- Revisa siempre el resultado en "Editar letra cruda" antes de exportar: la IA transcribe
  muy bien, pero el corte de líneas es una aproximación y puede necesitar ajustes.

## 4. Costo esperado
AssemblyAI cobra alrededor de $0.0025–0.0036 USD por minuto de audio. Una canción de
4 minutos cuesta unos centavos de dólar. Con los 50 USD de crédito gratis puedes
transcribir miles de minutos antes de que se te cobre algo.

## 5. Guardar y seguir editando después
Usa "Guardar proyecto" para descargar un archivo `.json` con la letra, los tiempos y el
estilo. Para continuar editando otro día, usa "Cargar proyecto" y vuelve a subir el
archivo de audio original (el audio no se guarda en el proyecto, solo se referencia).
