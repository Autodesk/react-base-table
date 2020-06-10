const columns = generateColumns(10)

const isEven = num => num % 2 === 0;
const randomBool = num => isEven(Math.floor(Math.random() * num));

const generateDynamicHeightData = (columns, count = 200, prefix = 'row-') =>
  new Array(count).fill(0).map((row, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        const val = `Row ${rowIndex} - Col ${columnIndex} Row ${rowIndex} - Col ${columnIndex}`;
        rowData[column.dataKey] = randomBool(rowIndex) ? val : randomBool(rowIndex) ? val.concat(val) : val.concat(val.concat(val));
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })
const data = generateDynamicHeightData(columns, 10000)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
});


export default () => <Table fixed columns={fixedColumns} data={data} estimatedRowHeight={60} />
