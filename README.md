# Sitio de prueba NCAS — Astro + Tailwind + Strapi

Sitio de prueba que implementa la stack recomendada para el rediseño de ncas.app:
**Astro + Tailwind CSS** en el frontend, y **Strapi** (CMS headless, self-hosted) para tres
módulos que el equipo de marketing puede administrar sin ayuda de desarrollo:

- **Posts** (blog)
- **Testimonios**
- **Proyectos**

No se instalaron dependencias pesadas en el entorno donde se generó este proyecto —
está listo para instalar y correr en tu propio computador.

## Requisitos

- Node.js 18, 20 o 22 (LTS). Verifica con `node -v`.
- npm 9+.

## 1. Backend (Strapi)

```bash
cd backend
cp .env.example .env
```

Antes de arrancar, genera secretos reales para el `.env` (no uses los valores de ejemplo):

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Reemplaza `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT` y `JWT_SECRET`
en `.env` con valores generados así (uno distinto por cada variable; `APP_KEYS` acepta varios
separados por coma).

```bash
npm install
npm run develop
```

Esto abre Strapi en modo desarrollo. La primera vez te va a pedir crear un usuario
administrador en `http://localhost:1337/admin` — hazlo desde el navegador.

Una vez creado el admin, con Strapi corriendo, en otra terminal siembra contenido de ejemplo:

```bash
npm run seed
```

Esto carga 2 testimonios, 3 proyectos y 2 posts de ejemplo para que el sitio no arranque vacío.
El primer arranque de Strapi (`bootstrap` en `src/index.js`) también habilita automáticamente el
permiso de lectura pública para estos tres módulos, que es lo que le permite al frontend leer el
contenido sin autenticación.

Desde `http://localhost:1337/admin` puedes editar, agregar o borrar posts, testimonios y
proyectos — ese es el panel autoadministrable pensado para marketing.

## 2. Frontend (Astro)

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:4321` y consume el contenido desde el
backend de Strapi (`http://localhost:1337`) definido en `PUBLIC_STRAPI_URL`.

## Estructura

```
ncas-demo/
├── backend/     # Strapi — CMS headless con los 3 módulos autoadministrables
│   └── src/api/{post,testimonio,proyecto}/
└── frontend/    # Astro + Tailwind — consume la API REST de Strapi
    └── src/pages/{index,proyectos,blog,contacto}.astro
```

## Notas

- La base de datos de Strapi es SQLite (`backend/.tmp/data.db`), ideal para pruebas locales.
  Para producción se recomienda Postgres.
- El formulario de contacto es una maqueta estática — en la propuesta original se conecta a un
  endpoint serverless protegido con Cloudflare Turnstile (ver documento de recomendación de
  stack), pendiente de implementar en esta demo.
- Este proyecto usa Strapi 5.x. Revisa `backend/package.json` y actualiza versiones si al
  momento de instalar ya existe una más reciente.
