# react-base-table

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

Learn more at the [website](https://autodesk.github.io/react-base-table/)

**`width` and `height` are required to display the table properly**

In the [examples](https://autodesk.github.io/react-base-table/examples)
we are using a wrapper `const Table = props => <BaseTable width={720} height={400} {...props} />` to do that

You can use the [`AutoResizer`](https://autodesk.github.io/react-base-table/api/autoresizer) to make the table fill the container, take the [playground](https://autodesk.github.io/react-base-table/playground) for example

_You have to polyfil `Array.prototype.findIndex` to make it works on IE_

## Advance

BaseTable is designed to be the base component to build your own complex table component

### Styling

The simplest way is overriding the default styles (assuming you are using `scss`)

```scss
// override default variables for BaseTable
$table-prefix: AdvanceTable;

$table-font-size: $bim-font-size-small;
$table-border-radius: 4px;
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

## Contributing

Please check [guidelines](CONTRIBUTING.md) for more details
