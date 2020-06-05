const sizeContext = React.createContext({});

const columns = generateColumns(10)
const data = generateData(columns, 10000)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
});


export default () => <Table fixed columns={columns} data={data} useDynamicRowHeight_EXPERIMENTAL />
