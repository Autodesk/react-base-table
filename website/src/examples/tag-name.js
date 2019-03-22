const columns = generateColumns(10)
const data = generateData(columns, 200)

const move = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
`

const InlineLoader = styled.div`
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-position: left top;
    background-repeat: no-repeat;
    background-image: linear-gradient(to right, transparent, #ccc, transparent);
    animation: ${move} 1.5s linear infinite;
  }
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
