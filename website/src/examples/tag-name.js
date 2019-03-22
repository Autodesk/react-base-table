const columns = generateColumns(10)
const data = generateData(columns, 200)

const InlineLoader = styled.div`
  background-color: 'red';
`

const CellLoader = styled(InlineLoader)`
  height: 16px !important;
`

const Cell = props => (
  <div {...props}>
    <CellLoader />
  </div>
)

const RowLoader = styled(InlineLoader)`
  height: 16px !important;
  margin: 0 15px;
`

const Row = props => (
  <div {...props}>
    <RowLoader />
  </div>
)

const cellProps = ({ rowIndex, columnIndex }) =>
  rowIndex % 3 === 1 && columnIndex > 0 && { tagName: Cell }

const rowProps = ({ rowIndex }) => rowIndex % 3 === 2 && { tagName: Row }

export default () => (
  <Table
    columns={columns}
    data={data}
    rowProps={rowProps}
    cellProps={cellProps}
  />
)
