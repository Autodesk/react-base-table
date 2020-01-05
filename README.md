# react-base-table

BaseTable is a react table component to display large datasets with high performance and flexibility

<a href="https://npm.im/react-base-table"><img src="https://badgen.net/npm/license/react-base-table"></a>
<a href="https://npm.im/react-base-table"><img src="https://badgen.net/npm/v/react-base-table"></a>
<a href="https://npm.im/react-base-table"><img src="https://badgen.net/npm/dm/react-base-table"></a>
<a href="https://bundlephobia.com/result?p=react-base-table"><img src="https://badgen.net/bundlephobia/minzip/react-base-table"></a>

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

Learn more at the [website](https://autodesk.github.io/react-base-table/)

**Make sure each item in `data` is unique by a key, the default key is `id`, you can customize it via `rowKey`**

**`key` is required for column definition or the column will be ignored**

**`width` and `height`(or `maxHeight`) are required to display the table properly**

In the [examples](https://autodesk.github.io/react-base-table/examples)
we are using a wrapper `const Table = props => <BaseTable width={700} height={400} {...props} />` to do that

If you want it responsive, you can use the [`AutoResizer`](https://autodesk.github.io/react-base-table/api/autoresizer) to make the table fill the container, checkout the [Auto Resize example](https://autodesk.github.io/react-base-table/examples/auto-resize)

## Browser Support

`BaseTable` is well tested on all modern browsers and IE11. _You have to polyfill `Array.prototype.findIndex` to make it works on IE_

**The [examples](https://autodesk.github.io/react-base-table/examples) don't work on IE as they are powered by [react-runner](https://github.com/nihgwu/react-runner) which is a `react-live` like library but only for modern browsers.**

## Advance

BaseTable is designed to be the base component to build your own complex table component

### Styling

The simplest way is overriding the default styles (assuming you are using `scss`)

```scss
// override default variables for BaseTable
$table-prefix: AdvanceTable;

$table-font-size: 13px;
$table-padding-left: 15px;
$table-padding-right: 15px;
$column-padding: 7.5px;
...
$show-frozen-rows-shadow: false;
$show-frozen-columns-shadow: true;

@import '~react-base-table/es/_BaseTable.scss';

.#{$table-prefix} {
  &:not(.#{$table-prefix}--show-left-shadow) {
    .#{$table-prefix}__table-frozen-left {
      box-shadow: none;
    }
  }

  &:not(.#{$table-prefix}--show-right-shadow) {
    .#{$table-prefix}__table-frozen-right {
      box-shadow: none;
    }
  }

  ...
}
```

You can write your own styles from scratch or use CSS-in-JS solutions to achieve that

### Custom components

```jsx
<BaseTable
  classPrefix="AdvanceTable"
  components={{
    TableCell: AdvanceTableCell,
    TableHeaderCell: AdvanceTableHeaderCell,
    ExpandIcon: AdvanceExpandIcon,
    SortIndicator: AdvanceSortIndicator,
  }}
  ...
/>
```

### Custom renderers & props

There are a lot of highly flexible props like `xxxRenderer` and `xxxProps` for you to build your own table component, please check the [api](https://autodesk.github.io/react-base-table/api) and [examples](https://autodesk.github.io/react-base-table/examples) for more details

### Example

We are using a advanced table component based on `BaseTable` internally, with much more features, including row selection, row grouping, data aggregation, column settings, column reordering, and column grouping, tooltip, inline editing.

![AdvanceTable](screenshots/advance-table.png)

[In real products](https://blogs.autodesk.com/bim360-release-notes/2019/11/18/bim-360-cost-management-update-november-2019/) 

## Contributing

Please check [guidelines](CONTRIBUTING.md) for more details
