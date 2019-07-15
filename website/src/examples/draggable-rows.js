// import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
const { sortableContainer, sortableElement, sortableHandle } = ReactSortableHoc
const DraggableContainer = sortableContainer(({ children }) => children)
const DraggableElement = sortableElement(({ children }) => children)
const DraggableHandle = sortableHandle(({ children }) => children)

const Handle = styled.div`
  flex: none;
  width: 7.5px;
  height: 100%;

  &::before {
    content: '';
    border-left: 4px dotted #ccc;
    display: block;
    height: 20px;
    margin: 15px 3px;
  }

  &:hover::before {
    border-color: #888;
  }
`

const Row = ({ key, index, children, ...rest }) => (
  <DraggableElement key={key} index={index}>
    <div {...rest}>
      <DraggableHandle>
        <Handle />
      </DraggableHandle>
      {children}
    </div>
  </DraggableElement>
)

const rowProps = ({ rowIndex }) => ({
  tagName: Row,
  index: rowIndex,
})

class DraggableTable extends React.PureComponent {
  state = {
    data: this.props.data,
  }

  getContainer() {
    return document.querySelector('.BaseTable__body')
  }

  getHelperContainer() {
    return document.querySelector('.BaseTable__table')
  }

  rowProps = args => {
    // don't forget to passing the incoming rowProps
    const extraProps = callOrReturn(this.props.rowProps)
    return {
      ...extraProps,
      tagName: Row,
      index: args.rowIndex,
    }
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const data = [...this.state.data]
    const [removed] = data.splice(oldIndex, 1)
    data.splice(newIndex, 0, removed)
    this.setState({ data })
  }

  render() {
    return (
      <DraggableContainer
        useDragHandle
        getContainer={this.getContainer}
        helperContainer={this.getHelperContainer}
        onSortEnd={this.handleSortEnd}
      >
        <Table
          {...this.props}
          data={this.state.data}
          fixed={false}
          rowProps={this.rowProps}
        />
      </DraggableContainer>
    )
  }
}

const Hint = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #336699;
  margin-bottom: 10px;
`

const columns = generateColumns(10)
const data = generateData(columns, 200)
columns[0].minWidth = 150

export default () => (
  <>
    <Hint>Drag the dots, only works in flex mode(fixed=false)</Hint>
    <DraggableTable columns={columns} data={data} />
  </>
)
