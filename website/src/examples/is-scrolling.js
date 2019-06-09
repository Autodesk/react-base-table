const columns = generateColumns(10)
const data = generateData(columns, 200)

const Loading = styled.div`
  padding-left: 15px;
  color: gray;
`

const rowRenderer = ({ isScrolling, cells }) => {
  if (isScrolling) return <Loading>Scrolling</Loading>
  return cells
}

export default () => (
  <Table
    columns={columns}
    data={data}
    useIsScrolling
    rowRenderer={rowRenderer}
  />
)
