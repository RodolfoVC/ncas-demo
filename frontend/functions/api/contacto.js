// Cloudflare Pages Function — se despliega automáticamente junto con el sitio
// estático. Corre en el servidor (edge de Cloudflare), no en el navegador, así
// que aquí sí es seguro usar secretos como TURNSTILE_SECRET_KEY y STRAPI_API_TOKEN.

export async function onRequestPost(context) {
  const { request, env } = context;
  const jsonHeaders = { 'Content-Type': 'application/json' };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo de la solicitud inválido.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const { nombre, email, mensaje, turnstileToken } = body || {};

  if (!nombre || !email || !mensaje || !turnstileToken) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  // 1. Verificar el token de Turnstile directamente con Cloudflare.
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  });
  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return new Response(
      JSON.stringify({ error: 'No se pudo verificar que eres una persona real. Intenta de nuevo.' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  // 2. Crear el mensaje en Strapi usando un token de API con permiso de
  // creación solamente — el rol "Public" de Strapi NO tiene permiso de crear
  // este contenido, así que nadie puede llegar directo a la API y saltarse Turnstile.
  const strapiRes = await fetch(`${env.PUBLIC_STRAPI_URL}/api/mensaje-contactos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: { nombre, email, mensaje } }),
  });

  if (!strapiRes.ok) {
    console.error('Error creando mensaje en Strapi:', strapiRes.status, await strapiRes.text());
    return new Response(
      JSON.stringify({ error: 'No se pudo guardar el mensaje. Intenta más tarde.' }),
      { status: 502, headers: jsonHeaders }
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
}
