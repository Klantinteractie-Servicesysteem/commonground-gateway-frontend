module.exports = {
  siteMetadata: {
    title: `Gateway admin ui`,
    description: `De gateway admin ui is a tool to configurate your gateway and view that configuration.`,
    author: `Conduction`,
    repositoryUrl: `https://github.com/ConductionNL/commonground-gateway-frontend`,
    slackUrl: null,
    languages: ['en' ,'nl'],
    defaultLanguage: 'nl'
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-check-links`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-images`,
        ]
      }
    },
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `demodam.org`,
        },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Demodam`,
        short_name: `demodam`,
        start_url: `/`,
        display: `standalone`,
        icon: `src/images/conduction_logo_blauw.svg`,
      },
    },
    `gatsby-plugin-i18n`,
    {
      resolve: `gatsby-plugin-i18n`,
      options: {
        langKeyDefault: 'nl',
        useLangKeyLayout: false,
        prefixDefault: false,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
