const columns = generateColumns(10)
const data = generateData(columns, 200)

const Title = styled.h4`
  font-size: 16px;
  color: #819099;
  margin-top: 20px;
  margin-bottom: 10px;
`

const Row = styled.div`
  padding: 0 15px;
`

const rowRenderer = ({ rowData, ...rest }) => (
  <Row {...rest}>{Object.values(rowData).join(' | ')}</Row>
)

class RowComponent extends React.Component {
  render() {
    const { rowData, ...rest } = this.props
    return <Row {...rest}>{Object.values(rowData).join(' | ')}</Row>
  }
}

export default () => (
  <React.Fragment>
    <Title>Function as renderer</Title>
    <Table columns={columns} data={data} rowRenderer={rowRenderer} />
    <Title>Component as renderer</Title>
    <Table columns={columns} data={data} rowRenderer={RowComponent} />
    <Title>Element as renderer</Title>
    <Table columns={columns} data={data} rowRenderer={<RowComponent />} />
  </React.Fragment>
)
