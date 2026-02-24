/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'corp-azul': '#00557f',      // A cor forte dos botões/títulos
        'corp-verde': '#5fb0a5',     // A cor dos detalhes/logo
        'corp-fundo': '#f4f6f8',     // Um cinza bem clarinho para o fundo do site (padrão corporativo)
        'vidro-escuro': 'rgba(0, 85, 127, 0.8)', // Vidro baseado na cor azul
      },
      backgroundImage: {
        'brilho-suave': 'linear-gradient(180deg, hsla(0,0%,100%,0.15), hsla(0,0%,100%,0))', // O gradiente que você pediu
      }
    },
  },
  plugins: [],
}