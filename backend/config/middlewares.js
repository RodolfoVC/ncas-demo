module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // API publica de solo lectura (posts, testimonios, proyectos, equipo):
      // se permite cualquier origen para que el frontend en Cloudflare Pages
      // (y sus URLs de preview, que cambian en cada deploy) pueda consumirla
      // sin tener que mantener una lista de dominios exactos.
      origin: '*',
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
