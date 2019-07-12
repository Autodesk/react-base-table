// import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
const { sortableContainer, sortableElement, sortableHandle } = ReactSortableHoc
const DraggableContainer = sortableContainer(({ children }) => children)
const DraggableElement = sortableElement(({ children }) => children)
const DraggableHandle = sortableHandle(({ children }) => children)

const Handle = styled.div`
  flex: none;
  width: 7.5px;
  height: 100%;
  background: #888;
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

  render() {
    return (
      <DraggableContainer
        useDragHandle
        getContainer={this.getContainer}
        helperContainer={this.getHelperContainer}
      >
        <Table {...this.props} fixed={false} rowProps={this.rowProps} />
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

export default () => (
  <>
    <Hint>Drag the gray handles, only works in flex mode(fixed=false)</Hint>
    <DraggableTable columns={columns} data={data} />
  </>
)
