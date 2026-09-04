'use strict';

/**
 * Siembra contenido de ejemplo en los tres módulos autoadministrables
 * (posts, testimonios, proyectos) para que el sitio de prueba no arranque vacío.
 *
 * Uso: primero corre `npm run develop` una vez y crea tu usuario admin desde
 * el navegador (http://localhost:1337/admin). Luego corre `npm run seed`.
 */

const { createStrapi } = require('@strapi/strapi');

const testimonios = [
  { nombre: 'Equipo de Operaciones', empresa: 'Tren Central', cita: 'NCAS entendió nuestro problema de integración de sistemas y entregó una solución robusta que seguimos usando hoy.' },
  { nombre: 'Jefatura de TI', empresa: 'Metro Valparaíso', cita: 'El soporte evolutivo de NCAS nos permitió escalar sin reescribir todo desde cero.' },
];

const proyectos = [
  { nombre: 'Plataforma de monitoreo biométrico', industria: 'Seguridad', descripcion: 'Integración de hardware biométrico con un backend a medida para control de acceso.' },
  { nombre: 'Sistema de trazabilidad logística', industria: 'Logística', descripcion: 'Aplicación web y móvil para seguimiento de carga en tiempo real.' },
  { nombre: 'Panel de gestión minera', industria: 'Minería', descripcion: 'Dashboard de indicadores operacionales conectado a sensores en terreno.' },
];

const posts = [
  {
    titulo: 'Por qué modernizar la stack de tu sitio institucional',
    slug: 'por-que-modernizar-tu-stack',
    resumen: 'Mantener librerías desactualizadas no es solo un problema estético: es un riesgo de seguridad.',
    contenido: 'Un sitio construido hace varios años acumula deuda técnica silenciosa. Actualizar a una arquitectura moderna mejora seguridad, velocidad y SEO al mismo tiempo.',
    fecha: '2026-07-01',
  },
  {
    titulo: 'Módulos autoadministrables: qué son y por qué importan',
    slug: 'modulos-autoadministrables',
    resumen: 'Un CMS headless le da autonomía al equipo de marketing para publicar sin depender de desarrollo.',
    contenido: 'Separar el contenido del código permite que quien redacta el blog o carga testimonios lo haga directamente desde un panel, sin abrir un ticket de desarrollo.',
    fecha: '2026-07-15',
  },
];

async function seed() {
  const app = await createStrapi().load();

  for (const t of testimonios) {
    const exists = await app.documents('api::testimonio.testimonio').findMany({
      filters: { nombre: t.nombre },
    });
    if (!exists.length) {
      await app.documents('api::testimonio.testimonio').create({ data: t, status: 'published' });
      console.log(`Testimonio creado: ${t.nombre}`);
    }
  }

  for (const p of proyectos) {
    const exists = await app.documents('api::proyecto.proyecto').findMany({
      filters: { nombre: p.nombre },
    });
    if (!exists.length) {
      await app.documents('api::proyecto.proyecto').create({ data: p, status: 'published' });
      console.log(`Proyecto creado: ${p.nombre}`);
    }
  }

  for (const post of posts) {
    const exists = await app.documents('api::post.post').findMany({
      filters: { slug: post.slug },
    });
    if (!exists.length) {
      await app.documents('api::post.post').create({ data: post, status: 'published' });
      console.log(`Post creado: ${post.titulo}`);
    }
  }

  console.log('Siembra completa.');
  await app.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
