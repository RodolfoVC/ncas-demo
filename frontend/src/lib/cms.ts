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
}

export async function getEquipo(): Promise<Miembro[]> {
  const data = await fetchAPI('/equipos');
  return unwrap<Miembro>(data);
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
