// import Text from 'react-texty'
const Text = ReactTexty

const TableCell = ({ className, cellData }) => (
  <Text className={className}>{cellData}</Text>
)

const TableHeaderCell = ({ className, column }) => (
  <Text className={className}>{column.title}</Text>
)

const columns = generateColumns(10)
const data = generateData(columns, 200)
columns[3].title = 'No tooltip'
columns[3].minWidth = 150

export default () => (
  <Table
    columns={columns}
    data={data}
    components={{ TableCell, TableHeaderCell }}
  />
)
