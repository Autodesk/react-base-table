const columns = generateColumns(10)
const data = generateData(columns, 200)

const Row = styled.a`
  color: black;
  &:hover {
    color: red;
  }
`

const rowProps = {
  tagName: Row,
  href: 'https://www.google.com',
  target: '_blank',
}
const cellProps = ({ rowIndex, columnIndex }) =>
  rowIndex % 2 === 0 && {
    tagName: 'button',
    onClick: e => {
      e.preventDefault()
      e.stopPropagation()
      alert(`You clicked row ${rowIndex} column ${columnIndex}`)
    },
  }

export default () => (
  <Table
    columns={columns}
    data={data}
    rowProps={rowProps}
    cellProps={cellProps}
  />
)
