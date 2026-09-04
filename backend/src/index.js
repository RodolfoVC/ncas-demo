'use strict';

module.exports = {
  register() {},

  /**
   * Al arrancar, habilita automáticamente el permiso público de lectura
   * para los módulos autoadministrables (posts, testimonios, proyectos).
   * Esto es lo que le permite al frontend (Astro) leer el contenido sin
   * autenticación, tal como lo haría cualquier sitio público.
   */
  async bootstrap({ strapi }) {
    const PUBLIC_READ_APIS = ['api::post.post', 'api::testimonio.testimonio', 'api::proyecto.proyecto', 'api::servicio.servicio'];

    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    for (const uid of PUBLIC_READ_APIS) {
      for (const action of ['find', 'findOne']) {
        const actionName = `${uid}.${action}`;
        const existing = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { role: publicRole.id, action: actionName },
        });
        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action: actionName, role: publicRole.id },
          });
        }
      }
    }
  },
};
