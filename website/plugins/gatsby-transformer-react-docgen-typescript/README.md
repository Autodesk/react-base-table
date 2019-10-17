
# gatsby-transformer-react-docgen-typescript
Parses inline component-documentation using
[react-docgen](https://github.com/reactjs/react-docgen),
[react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript) and
[gatsby-transform-react-docgen](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-react-docgen)

## Usage

Add a plugin-entry to your `gatsby-config.js`

```js
module.exports = {
  plugins: [`gatsby-transformer-react-docgen-typescript`],
}
```

## How to query

An example _graphql_ query to get nodes:

```graphql
{
  allComponentMetadata {
    edges {
      node {
        displayName
        description
        props {
          name
          type
          required
        }
      }
    }
  }
}
```
