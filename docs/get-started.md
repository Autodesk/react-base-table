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

**Make sure each item in `data` is unique by a key, the default key is `id`, you can customize it via `rowKey`**

**`width` and `height` are required to display the table properly**

In the [examples](https://autodesk.github.io/react-base-table/examples)
we are using a wrapper `const Table = props => <BaseTable width={700} height={400} {...props} />` to do that

If you want it responsive, you can use the [`AutoResizer`](https://autodesk.github.io/react-base-table/api/autoresizer) to make the table fill the container, checkout the [Auto Resize example](https://autodesk.github.io/react-base-table/examples/auto-resize)

## Browser Support

`BaseTable` is well tested on all modern browsers and IE11. _You have to polyfill `Array.prototype.findIndex` to make it works on IE_

**The [examples](https://autodesk.github.io/react-base-table/examples) don't work on IE as they are powered by [react-runner](https://github.com/nihgwu/react-runner) which is a `react-live` like library but only for modern browsers.**

## Playground

```jsx live
const columns = generateColumns(10)
const data = generateData(columns, 200)

export default () => <Table columns={columns} data={data} />
```
