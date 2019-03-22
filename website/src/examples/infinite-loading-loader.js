const TOTAL_SIZE = 1005
const PAGE_SIZE = 50

const columns = generateColumns(10)
const DATA = generateData(columns, TOTAL_SIZE)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const Empty = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  display: inline-block;
  border-radius: 100%;
  margin: 2px;
  border: 2px solid #0696d7;
  border-bottom-color: transparent;
  margin: 2px;
  width: 22px;
  height: 22px;
  animation: ${rotate} 0.75s linear infinite;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export default class App extends React.Component {
  state = {
    data: [],
    loading: true,
    loadingMore: false,
    loadedAll: false,
  }

  fetchData(offset = 0, limit = PAGE_SIZE) {
    return delay(3000).then(() => {
      return DATA.slice(offset, offset + limit)
    })
  }

  loadData() {
    this.fetchData(0, Math.random() < 0.2 ? 0 : PAGE_SIZE).then(data => {
      if (!this._isMount) return
      this.setState({
        data,
        loading: false,
        loadedAll: data.length < PAGE_SIZE,
      })
    })
  }

  loadMore() {
    this.setState({ loadingMore: true })
    this.fetchData(this.state.data.length).then(data => {
      if (!this._isMount) return
      this.setState({
        data: [...this.state.data, ...data],
        loadingMore: false,
        loadedAll: data.length < PAGE_SIZE,
      })
    })
  }

  handleEndReached = args => {
    action('onEndReached')(args)
    const { loading, loadingMore, loadedAll } = this.state
    if (loading || loadingMore || loadedAll) return
    this.loadMore()
  }

  handleReload = () => {
    this.setState({
      data: [],
      loading: true,
    })
    this.loadData()
  }

  renderFooter = () => {
    if (!this.state.loadingMore) return null
    return (
      <Footer>
        <Loader />
      </Footer>
    )
  }

  renderEmpty = () => {
    if (this.state.loading)
      return (
        <Empty>
          <Loader />
        </Empty>
      )
    if (this.state.data.length === 0) return <Empty>No data available</Empty>
  }

  componentDidMount() {
    this._isMount = true
    this.loadData()
  }

  componentWillUnmount() {
    this._isMount = false
  }

  render() {
    const { data, loading, loadingMore, loadedAll } = this.state
    return (
      <>
        <Toolbar>
          <span>Loaded data length: {data.length}</span>
          <span>All data loaded: {loadedAll.toString()}</span>
          <button onClick={this.handleReload}>Regenerate</button>
        </Toolbar>
        <Table
          fixed
          columns={fixedColumns}
          data={data}
          disabled={loading}
          footerHeight={loadingMore ? 50 : 0}
          onEndReachedThreshold={300}
          onEndReached={this.handleEndReached}
          footerRenderer={this.renderFooter}
          emptyRenderer={this.renderEmpty}
        />
      </>
    )
  }
}
