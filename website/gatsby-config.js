module.exports = {
  pathPrefix: '/react-base-table',
  siteMetadata: {
    title: 'BaseTable',
    description: 'BaseTable website',
    keywords: 'react, component, table, basetable',
    author: 'Neo Nie (nihgwu@live.com)',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-138491668-1',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'BaseTable',
        short_name: 'BaseTable',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'minimal-ui',
        icon: 'src/assets/favicon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: 'tomato',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-lodash',
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        displayName: false,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'examples',
        path: `${__dirname}/src/examples`,
      },
    },
    {
      resolve: 'gatsby-transformer-code',
      options: {
        name: 'examples',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: `${__dirname}/../docs`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'api',
        ignore: ['**/*.snap', '**/*.scss'],
        path: `${__dirname}/../src`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: ['gatsby-remark-copy-linked-files'],
      },
    },
    'gatsby-transformer-react-docgen',
  ],
}
