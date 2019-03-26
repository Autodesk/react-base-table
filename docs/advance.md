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
