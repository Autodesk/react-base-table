const columns = generateColumns(10)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const Overlay = styled.div`
  background: lightgray;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 5px 15px;
  border-radius: 10px;
  color: white;
`

export default () => (
  <Table
    fixed
    columns={columns}
    data={data}
    overlayRenderer={
      <div>
        <Overlay>Custom Overlay</Overlay>
      </div>
    }
  />
)
