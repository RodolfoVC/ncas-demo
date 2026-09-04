// Cliente mínimo para consumir la API REST de Strapi.
// STRAPI_URL se puede sobreescribir con la variable de entorno PUBLIC_STRAPI_URL.

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function fetchAPI(path: string) {
  const res = await fetch(`${STRAPI_URL}/api${path}`);
  if (!res.ok) {
    throw new Error(`Error al consultar Strapi (${res.status}): ${path}`);
  }
  const json = await res.json();
  return json.data;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: 'software' | 'hardware' | 'soporte' | 'integraciones';
  orden: number;
}

export interface Testimonio {
  id: number;
  nombre: string;
  empresa: string;
  cita: string;
}

export interface Proyecto {
  id: number;
  nombre: string;
  industria: string;
  descripcion: string;
}

export interface Post {
  id: number;
  documentId?: string;
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  fecha: string;
}

function unwrap<T>(items: any[]): T[] {
  // Strapi v4 anida los campos bajo "attributes"; Strapi v5 los deja planos.
  return items.map((item) => (item.attributes ? { id: item.id, ...item.attributes } : item));
}

// Convierte la URL relativa que devuelve Strapi para un archivo (ej. "/uploads/foto.png")
// en una URL absoluta apuntando al backend. Si ya viene absoluta (ej. un proveedor cloud
// tipo S3/Cloudinary), la deja tal cual.
function getMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

// Un campo de tipo "media" (single) puede venir plano (Strapi 5) o anidado bajo
// { data: { ...} } (formato heredado de Strapi 4) — se manejan ambos casos.
function extractMedia(field: any): { url: string; thumbnailUrl?: string } | null {
  const media = field?.data ?? field;
  if (!media) return null;
  const attrs = media.attributes ?? media;
  const url = getMediaUrl(attrs.url);
  if (!url) return null;
  const thumbnailUrl = getMediaUrl(attrs.formats?.thumbnail?.url) ?? url;
  return { url, thumbnailUrl };
}

export async function getServicios(): Promise<Servicio[]> {
  const data = await fetchAPI('/servicios?sort=orden:asc');
  return unwrap<Servicio>(data);
}

export async function getTestimonios(): Promise<Testimonio[]> {
  const data = await fetchAPI('/testimonios');
  return unwrap<Testimonio>(data);
}

export async function getProyectos(): Promise<Proyecto[]> {
  const data = await fetchAPI('/proyectos');
  return unwrap<Proyecto>(data);
}

export interface Miembro {
  id: number;
  nombre: string;
  cargo: string;
  fotoUrl: string | null;
  fotoThumbnailUrl: string | null;
}

export async function getEquipo(): Promise<Miembro[]> {
  const data = await fetchAPI('/equipos?populate=foto');
  return unwrap<any>(data).map((m: any) => {
    const foto = extractMedia(m.foto);
    return {
      id: m.id,
      nombre: m.nombre,
      cargo: m.cargo,
      fotoUrl: foto?.url ?? null,
      fotoThumbnailUrl: foto?.thumbnailUrl ?? null,
    };
  });
}

export async function getPosts(): Promise<Post[]> {
  const data = await fetchAPI('/posts?sort=fecha:desc');
  return unwrap<Post>(data);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await fetchAPI(`/posts?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  const posts = unwrap<Post>(data);
  return posts[0] ?? null;
}
