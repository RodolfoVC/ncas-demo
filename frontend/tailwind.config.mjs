/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                night: '#0a0b0f', // fondo base
                panel: '#0d0e13', // franjas alternas
                card: '#14161c', // superficie de tarjetas
                ink: '#f5f4f2', // texto principal
                muted: '#9a9ba3', // texto secundario
                accent: '#EF5D2C', // naranja de marca
                accent2: '#2ABEEF', // celeste de marca
                ok: '#34d399', // verde de estado
                // alias de compatibilidad: si contacto.astro o el blog aún usan
                // bg-brand / text-brand-dark / bg-brand-light, quedan apuntando
                // a la nueva paleta en vez del azul viejo, sin tener que tocar
                // esos archivos ahora mismo.
                brand: {
                    DEFAULT: '#EF5D2C',
                    dark: '#c94a1e',
                    light: '#1a1510'
                }
            },
            fontFamily: {
                sans: ['"Nunito Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace']
            }
        }
    },
    plugins: []
};