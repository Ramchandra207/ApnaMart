export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#7c2d12", dark: "#431407", light: "#fed7aa" },
      },
      fontFamily: { display: ["Playfair Display", "serif"], sans: ["Inter", "sans-serif"] },
    },
  },
};
