const columns = generateColumns(10)
const data = generateData(columns, 200)

export default () => (
  <Table data={data}>
    {columns.map(column => (
      <Column key={column.key} {...column} />
    ))}
  </Table>
)
