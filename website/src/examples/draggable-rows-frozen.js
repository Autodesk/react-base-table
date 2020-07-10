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

const Row = ({ key, index, children, ...rest }) => {
  // if the children's length is not equal the columns' length, then it's rendering row for frozen table
  if (children.length !== 10)
    return (
      <DraggableElement key={key} index={index}>
        <div {...rest}>
          <DraggableHandle>
            <Handle />
          </DraggableHandle>
          {children}
        </div>
      </DraggableElement>
    )

  return <div {...rest}>{children}</div>
}

const rowProps = ({ rowIndex }) => ({
  tagName: Row,
  index: rowIndex,
})

class DraggableTable extends React.PureComponent {
  state = {
    data: this.props.data,
  }

  table = React.createRef()

  getContainer = () => {
    // for fixed table with frozen columns, the drag handle is in the left frozen table
    return this.table.current
      .getDOMNode()
      .querySelector('.BaseTable__table-frozen-left .BaseTable__body')
  }

  getHelperContainer = () => {
    return this.table.current
      .getDOMNode()
      .querySelector('.BaseTable__table-frozen-left')
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
          ref={this.table}
          data={this.state.data}
          fixed={true}
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
columns[0].frozen = true

export default () => (
  <>
    <Hint>Drag the dots, only works in fixed mode(fixed=true)</Hint>
    <DraggableTable columns={columns} data={data} />
  </>
)
