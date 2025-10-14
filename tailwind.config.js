const withTW = require("@bsf/force-ui/withTW");

module.exports = withTW({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "button-primary": "#6B21A8",
        "button-primary-hover": "#7E22CE",
        "brand-800": "#6B21A8",
        "brand-50": "#FAF5FF",
        "border-interactive": "#6B21A8",
        focus: "#9333EA",
        "focus-border": "#D8B4FE",
        "toggle-on": "#6B21A8",
        "toggle-on-border": "#C084FC",
        "toggle-on-hover": "#A855F7",
      },
      fontSize: {
        xxs: "0.6875rem", // 11px
      },
      lineHeight: {
        2.6: "0.6875rem", // 11px
      },
      boxShadow: {
        "content-wrapper":
          "0px 1px 1px 0px #0000000F, 0px 1px 2px 0px #0000001A",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  important: ".sureconsent-styles",
});