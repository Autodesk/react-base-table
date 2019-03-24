const path = require('path')
const _ = require('lodash')

const siteConfig = require('./siteConfig')

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
  const config = getConfig()

  switch (stage) {
    case 'build-javascript':
      const app =
        typeof config.entry.app === 'string'
          ? [config.entry.app]
          : config.entry.app

      config.entry.app = ['core-js/modules/es6.symbol', ...app]
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    assets: path.resolve(__dirname, 'src/assets'),
    components: path.resolve(__dirname, 'src/components'),
    utils: path.resolve(__dirname, 'src/utils'),
    siteConfig: path.resolve(__dirname, 'siteConfig'),
    'react-base-table/package.json': path.resolve(__dirname, '../package.json'),
    'react-base-table/styles.css': path.resolve(__dirname, '../styles.css'),
    'react-base-table': path.resolve(__dirname, '../src'),
  }

  config.module.rules = config.module.rules.map(rule =>
    String(rule.test) !== String(/\.jsx?$/)
      ? rule
      : {
          ...rule,
          exclude: modulePath =>
            /node_modules/.test(modulePath) &&
            !/node_modules\/(react-inspector|acorn-jsx|regexpu-core|unicode-match-property-ecmascript|unicode-match-property-value-ecmascript)/.test(
              modulePath
            ),
        }
  )

  actions.replaceWebpackConfig(config)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId }) => {
  const { createNodeField, createNode, createParentChildLink } = actions

  if (node.internal.type === 'ComponentMetadata' && node.methods.length) {
    node.methods
      .filter(method => method.docblock)
      .map(method => {
        const methodNode = {
          id: createNodeId(`${node.id} >>> ${method.name}`),
          parent: node.id,
          children: [],
          name: method.name,
          params: method.params,
          description: method.description,
          internal: {
            type: `ComponentMethodExt`,
            mediaType: `text/markdown`,
            content: method.description,
            contentDigest: method.description,
          },
        }

        createNode(methodNode)
        createParentChildLink({ parent: node, child: methodNode })
      })
  }
}

exports.createPages = async ({ graphql, actions, getNode }) => {
  const { createPage, createRedirect } = actions

  siteConfig.redirects.forEach(item => createRedirect(item))

  const apiPage = path.resolve('src/templates/api.js')
  const examplePage = path.resolve('src/templates/example.js')

  const result = await graphql(
    `
      {
        allComponentMetadata {
          edges {
            node {
              parent {
                id
              }
              displayName
              docblock
            }
          }
        }
        allRawCode {
          edges {
            node {
              name
            }
          }
        }
      }
    `
  )
  if (result.errors) {
    throw new Error(result.errors)
  }

  result.data.allComponentMetadata.edges.forEach(edge => {
    const node = edge.node
    const fileNode = getNode(node.parent.id)
    if (fileNode.sourceInstanceName !== 'api') return
    const { displayName: name, docblock } = node
    if (!docblock) return
    createPage({
      path: `/api/${name.toLowerCase()}`,
      component: apiPage,
      context: {
        name,
      },
    })
  })

  result.data.allRawCode.edges.forEach(edge => {
    const name = edge.node.name
    createPage({
      path: `/examples/${name}`,
      component: examplePage,
      context: {
        name,
      },
    })
  })
}
