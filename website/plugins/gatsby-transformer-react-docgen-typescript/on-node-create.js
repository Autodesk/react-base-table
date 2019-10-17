const path = require('path')
var tsxParser = require('react-docgen-typescript')

try {
  tsxParser = tsxParser.withCustomConfig(
    path.resolve(__dirname, '../../../tsconfig.json'),
    {
      propFilter(prop) {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules')
        }
        return true
      },
    }
  )
} catch (err) {
  console.log('Error in initiating react-docgen-typescript: ', err)
}

var _interopRequireDefault = require(`@babel/runtime/helpers/interopRequireDefault`)

exports.__esModule = true
exports.default = onCreateNode

const _parse = _interopRequireDefault(
  require('gatsby-transformer-react-docgen/parse')
)

const propsId = (parentId, name) => `${parentId}--ComponentProp-${name}`

const descId = parentId => `${parentId}--ComponentDescription`

function canParse(node) {
  return (
    node &&
    (node.internal.mediaType === `application/javascript` ||
      // TypeScript doesn't really have a mime type and .ts files are a media file :/
      node.internal.mediaType === `application/typescript` ||
      node.internal.mediaType === `text/jsx` ||
      node.internal.mediaType === `text/tsx` ||
      node.extension === `tsx` ||
      node.extension === `ts`)
  )
}

function createDescriptionNode(
  node,
  entry,
  actions,
  createNodeId,
  createContentDigest
) {
  const { createNode } = actions
  delete node.description
  const descriptionNode = {
    id: createNodeId(descId(node.id)),
    parent: node.id,
    children: [],
    text: entry.description,
    internal: {
      type: `ComponentDescription`,
      mediaType: `text/markdown`,
      content: entry.description,
      contentDigest: createContentDigest(entry.description),
    },
  }
  node.description___NODE = descriptionNode.id
  node.children = node.children.concat([descriptionNode.id])
  createNode(descriptionNode)
  return node
}

function createPropNodes(
  node,
  component,
  actions,
  createNodeId,
  createContentDigest
) {
  const { createNode } = actions

  let children = new Array(component.props.length)

  let propNames
  let currentProps
  if (Array.isArray(component.props)) {
    currentProps = component.props
  } else {
    propNames = Object.keys(component.props)
    currentProps = propNames.map(propName => {
      return component.props[propName]
    })
  }

  currentProps.length > 0 &&
    currentProps.forEach((prop, i) => {
      let propNodeId = propsId(node.id, prop.name)
      let content = JSON.stringify(prop)
      let propNode = Object.assign({}, prop, {
        id: createNodeId(propNodeId),
        children: [],
        parent: node.id,
        parentType: prop.type,
        internal: {
          type: `ComponentProp`,
          contentDigest: createContentDigest(content),
        },
      })
      children[i] = propNode.id
      propNode = createDescriptionNode(
        propNode,
        prop,
        actions,
        createNodeId,
        createContentDigest
      )
      createNode(propNode)
    })
  node.props___NODE = children
  node.children = node.children.concat(children)
  return node
}

async function onCreateNode(
  {
    node,
    loadNodeContent,
    actions,
    createNodeId,
    reporter,
    createContentDigest,
  },
  pluginOptions
) {
  const { createNode, createParentChildLink } = actions

  if (!canParse(node)) return

  const content = await loadNodeContent(node)
  let components

  const filepath = path.resolve(node.absolutePath)
  try {
    if (
      !filepath.includes('examples') &&
      (filepath.includes('.ts') || filepath.includes('.tsx'))
    ) {
      console.log('parsing: ', filepath)
      components = tsxParser.parse(filepath)
    } else {
      components = (0, _parse.default)(content, node, pluginOptions)
    }
  } catch (err) {
    reporter.error(
      `There was a problem parsing component metadata for file: "${
        node.relativePath
      }"`,
      err
    )
    return
  }

  components.forEach(component => {
    const strContent = JSON.stringify(component)
    const contentDigest = createContentDigest(strContent)
    const nodeId = `${node.id}--${component.displayName}--ComponentMetadata`
    let metadataNode = Object.assign({}, component, {
      props: null,
      // handled by the prop node creation
      id: createNodeId(nodeId),
      children: [],
      parent: node.id,
      internal: {
        contentDigest,
        type: `ComponentMetadata`,
      },
    })
    createParentChildLink({
      parent: node,
      child: metadataNode,
    })
    metadataNode = createPropNodes(
      metadataNode,
      component,
      actions,
      createNodeId,
      createContentDigest
    )
    metadataNode = createDescriptionNode(
      metadataNode,
      component,
      actions,
      createNodeId,
      createContentDigest
    )

    if (metadataNode.children) {
      for (let i = 0; i < metadataNode.children.length; i++) {
        if (metadataNode.children[i] === undefined) {
          metadataNode.children.splice(i, 1)
        }
      }
    }
    createNode(metadataNode)
  })
}
