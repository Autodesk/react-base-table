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
    sortBy: defaultSort,
  }

  onColumnSort = ({ key, order }) => {
    const { data, sortBy } = this.state
    this.setState({
      // clear the sort state if the previous order is desc
      sortBy: {
        ...sortBy,
        [key]: sortBy[key] === SortOrder.DESC ? null : order,
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
        sortByMultiple={this.state.sortBy}
        onColumnSort={this.onColumnSort}
      />
    )
  }
}
