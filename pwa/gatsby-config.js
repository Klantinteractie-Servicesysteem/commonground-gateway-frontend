require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  pathPrefix: "/commonground-gateway-frontend",
  plugins: [
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/common/layout.tsx`),
      },
    },
    {
      resolve: `gatsby-plugin-breadcrumb`,
      options: {
        useAutoGen: true,
        exclude: [
          `**/dev-404-page/**`,
          `**/404/**`,
          `**/404.html`,
          `**/offline-plugin-app-shell-fallback/**`,
        ],
        excludeOptions: {
          separator: ".",
        },
        autoGenHomeLabel: "Dashboard",
        crumbLabelUpdates: [
          {
            pathname: '/sources/[id]',
            crumbLabel: 'Source',
          },
          {
            pathname: '/entities',
            crumbLabel: 'Object Types',
          },
          {
            pathname: '/entities/[entityId]',
            crumbLabel: 'Object Type',
          },
          {
            pathname: '/entities/[entityId]/attributes/[attributeId]',
            crumbLabel: 'Attribute',
          },
          {
            pathname: '/entities/[entityId]/object_entities',
            crumbLabel: 'Object Entities',
          },
          {
            pathname: '/entities/[entityId]/object_entities/[objectId]',
            crumbLabel: 'Object Entity',
          },
          {
            pathname: '/entities/[entityId]/objects/[objectId]',
            crumbLabel: 'Object',
          },
          {
            pathname: '/endpoints/[endpointId]',
            crumbLabel: 'Endpoint',
          },
          {
            pathname: '/endpoints/[endpointId]/handlers/[handlerId]',
            crumbLabel: 'Handler',
          },
          {
            pathname: '/applications/[id]',
            crumbLabel: 'Application',
          },
          {
            pathname: '/translation-tables',
            crumbLabel: 'Translation Tables',
          },
          {
            pathname: '/translation-tables/[translationId]',
            crumbLabel: 'Translation Table',
          },
          {
            pathname: '/translation-tables/new',
            crumbLabel: 'Translation Table',
          },
          {
            pathname: '/translation-tables/[translationId]/translations/[id]',
            crumbLabel: 'Translation',
          },
        ],
      },
    },
  ],
};
