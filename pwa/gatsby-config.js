require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  pathPrefix: "/commonground-gateway-frontend",
  plugins: [
    // {
    //   resolve: `gatsby-plugin-csp`,
    //   options: {
    //     disableOnDev: true,
    //     mergeScriptHashes: true,
    //     mergeStyleHashes: true,
    //     directives: {
    //       "script-src":
    //         "'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/ https://unpkg.com/@conductionnl/ https://unpkg.com/@utrecht/ https://unpkg.com/@nl-design-system-unstable/ 'unsafe-eval'",
    //       "style-src":
    //         "'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/ https://unpkg.com/@conductionnl/ https://unpkg.com/@utrecht/ https://unpkg.com/@nl-design-system-unstable/ 'sha256-cLHlYu9WwZQgD1K6YlWPqFYXJEuD9YpxdlDktBDedco='",
    //       "img-src": "'self' https://demodam.nl/ data:",
    //       "font-src":
    //         "'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/",
    //       "connect-src":
    //         "'self' https://admin.acc-vrijbrp-zoetermeer.commonground.nu/ http://admin.acc-vrijbrp-zoetermeer.commonground.nu/",
    //     },
    //   },
    // },
  ],
};
