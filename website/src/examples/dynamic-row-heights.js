const dataGenerator = () => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  gender: faker.random.boolean() ? 'male' : 'female',
  score: {
    math: faker.random.number(70) + 30,
  },
  birthday: faker.date.between(1995, 2005),
  attachments: faker.random.number(5),
  description: faker.lorem.sentence(),
  email: faker.internet.email(),
  country: faker.address.country(),
  address: {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    zipCode: faker.address.zipCode(),
  },
})

const GenderContainer = styled.div`
  background-color: ${props =>
    props.gender === 'male' ? 'lightblue' : 'pink'};
  color: white;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
`

const Gender = ({ gender }) => (
  <GenderContainer gender={gender}>
    {gender === 'male' ? '♂' : '♀'}
  </GenderContainer>
)

const Score = styled.span`
  color: ${props => (props.score >= 60 ? 'green' : 'red')};
`

const Attachment = styled.div`
  background-color: lightgray;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 4px;
  color: gray;
`

const defaultData = new Array(5000)
  .fill(0)
  .map(dataGenerator)
  .sort((a, b) => (a.name > b.name ? 1 : -1))

const defaultSort = { key: 'name', order: SortOrder.ASC }

export default class App extends React.Component {
  state = {
    data: defaultData,
    sortBy: defaultSort,
  }

  columns = [
    {
      key: 'name',
      title: 'Name',
      dataKey: 'name',
      width: 150,
      resizable: true,
      sortable: true,
      frozen: Column.FrozenDirection.LEFT,
    },
    {
      key: 'score',
      title: 'Score',
      dataKey: 'score.math',
      width: 60,
      align: Column.Alignment.CENTER,
      sortable: false,
    },
    {
      key: 'gender',
      title: '♂♀',
      dataKey: 'gender',
      cellRenderer: ({ cellData: gender }) => <Gender gender={gender} />,
      width: 60,
      align: Column.Alignment.CENTER,
      sortable: true,
    },
    {
      key: 'birthday',
      title: 'Birthday',
      dataKey: 'birthday',
      dataGetter: ({ column, rowData }) =>
        rowData[column.dataKey].toLocaleDateString(),
      width: 100,
      align: Column.Alignment.RIGHT,
      sortable: true,
    },
    {
      key: 'attachments',
      title: 'Attachments',
      dataKey: 'attachments',
      width: 60,
      align: Column.Alignment.CENTER,
      headerRenderer: () => <Attachment>?</Attachment>,
      cellRenderer: ({ cellData }) => <Attachment>{cellData}</Attachment>,
    },
    {
      key: 'description',
      title: 'Description',
      dataKey: 'description',
      width: 200,
      resizable: true,
      sortable: true,
    },
    {
      key: 'email',
      title: 'Email',
      dataKey: 'email',
      width: 200,
      resizable: true,
      sortable: true,
    },
    {
      key: 'country',
      title: 'Country',
      dataKey: 'country',
      width: 100,
      resizable: true,
      sortable: true,
    },
    {
      key: 'address',
      title: 'Address',
      dataKey: 'address.street',
      width: 200,
      resizable: true,
    },
    {
      key: 'action',
      width: 100,
      align: Column.Alignment.CENTER,
      frozen: Column.FrozenDirection.RIGHT,
      cellRenderer: ({ rowData }) => (
        <button
          onClick={() => {
            this.setState({
              data: this.state.data.filter(x => x.id !== rowData.id),
            })
          }}
        >
          Remove
        </button>
      ),
    },
  ]

  onColumnSort = sortBy => {
    const order = sortBy.order === SortOrder.ASC ? 1 : -1
    const data = [...this.state.data]
    data.sort((a, b) => (a[sortBy.key] > b[sortBy.key] ? order : -order))
    this.setState({
      sortBy,
      data,
    })
  }

  render() {
    const { data, sortBy } = this.state
    return (
      <>
        <button
          onClick={() => {
            this.setState({
              toggle: !this.state.toggle,
            })
          }}
        >
          Toggle columns
        </button>
        <button
          onClick={() => {
            this.setState({
              data: [dataGenerator(), ...data],
            })
          }}
        >
          Add item to top
        </button>
        <Table
          fixed
          columns={
            !!this.state.toggle ? this.columns.slice(0, 4) : this.columns
          }
          estimatedRowHeight={40}
          data={data}
          sortBy={sortBy}
          onColumnSort={this.onColumnSort}
        />
      </>
    )
  }
}
