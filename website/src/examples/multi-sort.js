const columns = generateColumns(10, undefined, { sortable: true })
const data = generateData(columns, 200)

const defaultSort = {
  'column-0': SortOrder.ASC,
  'column-1': SortOrder.DESC,
  'column-2': SortOrder.ASC,
}

export default class App extends React.Component {
  state = {
    data,
    sortState: defaultSort,
  }

  onColumnSort = ({ key, order }) => {
    const { data, sortState } = this.state
    this.setState({
      // clear the sort state if the previous order is desc
      sortState: {
        ...sortState,
        [key]: sortState[key] === SortOrder.DESC ? null : order,
      },
      data: this.state.data.reverse(),
    })
  }

  render() {
    return (
      <Table
        fixed
        columns={columns}
        data={data}
        sortState={this.state.sortState}
        onColumnSort={this.onColumnSort}
      />
    )
  }
}
