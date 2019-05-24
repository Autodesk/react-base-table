const data = [
  {
    id: 'c2afa007-290b-40b0-ab87-162fca68e98e',
    title: 'Example row 1',
  },
  {
    id: '45246109-dd25-4804-b4a1-1a389294b4f4',
    title: 'Example row 2',
  },
  {
    id: 'fea59a49-2656-4404-a1ba-c8c5808e8c14',
    title: 'Example row 3',
  },
  {
    id: 'dad5b51b-e10c-4501-b7c0-e8cac35e365c',
    title: 'Example row 4',
  },
  {
    id: '8498905e-35f1-40d6-8c98-239fce288973',
    title: 'Example row 5',
  },
]

const selectedRow = [
  'fea59a49-2656-4404-a1ba-c8c5808e8c14',
  'c2afa007-290b-40b0-ab87-162fca68e98e',
]

export default class asdas extends React.PureComponent {
  state = {
    selectedRows: [],
    checked: false,
  }

  selectAll = e => {
    if (e.target.checked) {
      this.setState({ selectedRows: data.map(item => item.id) })
    } else {
      this.setState({ selectedRows: [] })
    }
  }

  handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      this.setState({ selectedRows: [...this.state.selectedRows, id] })
    } else {
      this.setState({
        selectedRows: this.state.selectedRows.filter(x => x !== id),
      })
    }
  }

  render() {
    const columns = [
      {
        width: 50,
        key: `id`,
        dataKey: `id`,
        align: 'center',
        headerRenderer: () => {
          return <input type="checkbox" checked={this.state.selectedRows.length === data.length} onChange={e => this.selectAll(e)} />
        },
        cellRenderer: ({ rowData }) => {
          return (
            <input
              type="checkbox"
              checked={this.state.selectedRows.includes(rowData.id)}
              onChange={e => this.handleCheckboxChange(e, rowData.id)}
            />
          )
        },
      },
      {
        width: 250,
        key: `title`,
        dataKey: `title`,
        title: 'Title',
      },
    ]

    return (
      <React.Fragment>
        <Table
          onSelectChange={selectedRowKeys =>
            console.log('object', selectedRowKeys)
          }
          selectedRowKeys={this.state.selectedRows}
          height={250}
          columns={columns}
          data={data}
        />
      </React.Fragment>
    )
  }
}
