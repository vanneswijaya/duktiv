module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: ["hover", "focus"],
      colors: {
        biru: "#3d405b",
        birumuda: "#5FA8D3",
        krem: "#f2cc8f",
      },
    },
  },
  variants: {
    extend: {
      scale: ["hover", "group-hover"],
    },
  },
  plugins: [],
};
