const columns = generateColumns(10)
const data = generateData(columns, 200)

export default () => (
  <Table data={data}>
    <Column {...columns[0]} width={100} flexGrow={1} flexShrink={0} />
    <Column {...columns[1]} width={0} flexGrow={2} />
    <Column {...columns[2]} width={0} flexGrow={3} />
    <Column {...columns[3]} width={0} flexGrow={4} />
    <Column {...columns[4]} width={0} flexGrow={5} />
  </Table>
)
