# Get Started

BaseTable is a react table component to display large data set with high performance and flexibility

## Install

```bash
# npm
npm install react-base-table --save

# yarn
yarn add react-base-table
```

## Usage

```js
import BaseTable, { Column } from 'react-base-table'
import 'react-base-table/styles.css'

...
<BaseTable data={data} width={600} height={400}>
  <Column key="col0" dataKey="col0" width={100} />
  <Column key="col1" dataKey="col1" width={100} />
  ...
</BaseTable>
...
```

### unique key

`key` is required for column definition or the column will be ignored

Make sure each item in `data` is unique by a key, the default key is `id`, you can customize it via `rowKey`

### size

`width` is required for column definition, but in flex mode(`fixed={false}`), you can set `width={0}` and `flexGrow={1}` to achieve flexible column width, checkout the [Flex Column](https://autodesk.github.io/react-base-table/examples/flex-column) example

`width` and `height`(or `maxHeight`) are required to display the table properly

In the [examples](https://autodesk.github.io/react-base-table/examples)
we are using a wrapper `const Table = props => <BaseTable width={700} height={400} {...props} />` to do that

If you want it responsive, you can use the [`AutoResizer`](https://autodesk.github.io/react-base-table/api/autoresizer) to make the table fill the container, checkout the [Auto Resize](https://autodesk.github.io/react-base-table/examples/auto-resize) example

### closure problem in custom renderers

In practice we tend to write inline functions for custom renderers, which would make `shouldUpdateComponent` always true as the inline function will create a new instance on every re-render, to avoid "unnecessary" re-renders, **`BaseTable` ignores functions when comparing column definition by default**, it works well in most cases before, but if we use external data instead of reference state in custom renderers, we always get the staled initial value although the data has changed

It's recommended to inject the external data in column definition to solve the problem, like `<Column foo={foo} bar={bar} cellRenderer={({ column: { foo, bar }}) => { ... } } />`, the column definition will update on external data change, with this pattern we can easily move the custom renderers out of column definition for sharing, the downside is it would bloat the column definition and bug prone

Things getting worse with the introduction of React hooks, we use primitive state instead of `this.state`, so it's easy to encounter the closure problem, but with React hooks, we can easily memoize functions via `useCallback` or `useMemo`, so the implicit optimization could be replaced with user land optimization which is more intuitive, to turn off the implicit optimization, set `ignoreFunctionInColumnCompare` to `false` which is introduced since `v1.11.0`

Here is an [example](https://autodesk.github.io/react-base-table/playground#MYewdgzgLgBKA2BXAtpGBeGBzApmHATgIZQ4DCISqEAFAIwAMAlAFCiSwAmJRG2ehEjgAiPGghSQANDABMDZixY4AHgAcQBLjgBmRRPFg0mGAHwwA3ixhxw0GAG1QiMKQIyIOKBRduAunwASjhEwFAAdIieAMpQQjSKNuz2DgCWWGCaOABiLmGp4B5eAJIZWblg+eABmMGhEVE4sfFQBIg4rEl2sGlgAFY4YRRUYEVQxf2D3pSSNTB1YZExcaQ0evCenTAEXogEYDA01jYwADymxydnnKkAbjDQAJ7wOOgWFjBqRJw3YFgAXDAACwyG4QNTwIiPQEAch0LxUMJkfSiUFSOkeFFceCgsPBoRwAFoAEZeADuODwMJgAF8aRcrldTsTEFAoOAYOAyPBUsAANZvYxmB5eHzYgjiEC+QgwADUMDoTHpstOAHoWWzwAzGTZTpDSfBtTrdakwGpWZdjTYoI81K8AETAAAWgz5xJAKntlqtztdOE4b3SmR2FSqYBp3uNXKdRD+rwsOGFnnGZRDeTR4BoOHCcQIuAivv5-qVkauqqNxtKwcTOnTBQOptsI1syC+O1LZ1V+pwho7eqIBorOtOpvNUA7VxtdvQjpd-PdnonJ0LfP9gcmQxmqAjVqu0djuDeifQ5mTEwGm5GWZzRDzXnCK+LO935aX56mMFUrV43DiMHZTaSDAnC6KaqQZmAfZdgOPZDp2Ny3HBpwACoDi8MA6KkKj+sBPBvL+RA0jAQblHW4ATMMkgUK2t7xiRaaVBB9J9pRqBLhY4ScRI1AOAwfjPlaBEAOJeG4gomCetjSgQAnGs44rrhe0zNgA-FJ4owICLggZh+CcLJZZwbqrEHBxXFbpADh0PxMCvlapwmZYnEPhZEAOLINl2caDkWU55kjG5ADMnlGWcjlmS5AUOECIWRmqqHEi8FZqtqrARkAA) to demonstrate

## Browser Support

`BaseTable` is well tested on all modern browsers and IE11. _You have to polyfill `Array.prototype.findIndex` to make it works on IE_

**The [examples](https://autodesk.github.io/react-base-table/examples) don't work on IE as they are powered by [react-runner](https://github.com/nihgwu/react-runner) which is a `react-live` like library but only for modern browsers.**

## Playground

```jsx live
const columns = generateColumns(10);
const data = generateData(columns, 200);

export default () => <Table columns={columns} data={data} />;
```
