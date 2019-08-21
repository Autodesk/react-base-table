const columns = generateColumns(10)
const data = generateData(columns, 500)

const Button = styled.button`
  padding: 4px 8px;
  margin: 10px;
`

export default class App extends React.Component {
  setRef = ref => (this.table = ref)

  render() {
    return (
      <>
        <Button onClick={() => this.table.scrollToRow(100, 'auto')}>
          scrollToRow(100, 'auto')
        </Button>
        <Button onClick={() => this.table.scrollToRow(200, 'start')}>
          scrollToRow(200, 'start')
        </Button>
        <Button onClick={() => this.table.scrollToRow(300, 'center')}>
          scrollToRow(300, 'center')
        </Button>
        <Button onClick={() => this.table.scrollToRow(400, 'end')}>
          scrollToRow(400, 'end')
        </Button>
        <Button onClick={() => this.table.scrollToLeft(400)}>
          scrollToLeft(400)
        </Button>
        <Button onClick={() => this.table.scrollToTop(400)}>
          scrollToTop(400)
        </Button>
        <Button
          onClick={() =>
            this.table.scrollToPosition({ scrollLeft: 200, scrollTop: 2000 })
          }
        >
          {'scrollToPosition({ scrollLeft: 200, scrollTop: 2000 })'}
        </Button>
        <Table ref={this.setRef} fixed columns={columns} data={data} />
      </>
    )
  }
}
