require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  pathPrefix: "/pip-demodam",
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "pwa",
  },
  plugins: [
    `gatsby-plugin-ts`,
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        pathToEmotionCacheProps: `src/emotion-cache-props`,
      },
    },
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        disableOnDev: true,
        mergeScriptHashes: true,
        mergeStyleHashes: true,
        directives: {
          "script-src": "'self' 'unsafe-eval' https://unpkg.com/@conductionnl/ https://unpkg.com/@utrecht/ https://unpkg.com/@nl-design-system-unstable/",
          "style-src": "'self' 'nonce-true' https://unpkg.com/@conductionnl/ https://unpkg.com/@utrecht/ https://unpkg.com/@nl-design-system-unstable/",
          "img-src": "'self' https://demodam.nl/ data:"
        }
      }
    }
  ]
};
