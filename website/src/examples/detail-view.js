const columns = generateColumns(10)
const data = generateData(columns, 200)

data.forEach(x => {
  x.children = [
    {
      id: `${x.id}-detail`,
      content: faker.lorem.paragraphs(),
    },
  ]
})

const GlobalStyle = createGlobalStyle`
  .BaseTable__row--depth-0 {
    height: 50px;
  }

  .BaseTable__row--depth-0 .BaseTable__row-cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Row = styled.div`
  padding: 15px;
`
const rowRenderer = ({ rowData, cells }) => {
  if (rowData.content) return <Row>{rowData.content}</Row>
  return cells
}

export default () => (
  <>
    <GlobalStyle />
    <Table
      expandColumnKey={columns[0].key}
      estimatedRowHeight={50}
      columns={columns}
      data={data}
      rowRenderer={rowRenderer}
    />
  </>
)
