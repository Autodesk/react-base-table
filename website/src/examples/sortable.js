const columns = generateColumns(10)
const data = generateData(columns, 200)

for (let i = 0; i < 3; i++) columns[i].sortable = true

const defaultSort = { key: 'column-0', order: SortOrder.ASC }

export default class App extends React.Component {
  state = {
    data,
    sortBy: defaultSort,
  }

  onColumnSort = sortBy => {
    this.setState({
      sortBy,
      data: this.state.data.reverse(),
    })
  }

  render() {
    return (
      <Table
        fixed
        columns={columns}
        data={data}
        sortBy={this.state.sortBy}
        onColumnSort={this.onColumnSort}
      />
    )
  }
}
