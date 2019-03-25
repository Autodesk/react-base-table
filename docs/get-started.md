## Get Started

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

**`width` and `height` are required to display the table properly**

In the [examples](https://autodesk.github.io/react-base-table/examples)
we are using a wrapper `const Table = props => <BaseTable width={720} height={400} {...props} />` to do that

You can use the [`AutoResizer`](https://autodesk.github.io/react-base-table/api/autoresizer) to make the table fill the container, take the [playground](https://autodesk.github.io/react-base-table/playground) for example

_You have to polyfil `Array.prototype.findIndex` to make it works on IE_
