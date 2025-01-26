export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // All files in pages
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // All files in components
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // All files in app
    "./public/**/*.html", // Add if you use raw HTML files
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
