const StyledTable = styled(BaseTable)`
  .row-selected {
    background-color: #e3e3e3;
  }
`

class SelectionCell extends React.PureComponent {
  _handleChange = e => {
    const { rowData, rowIndex, column } = this.props
    const { onChange } = column

    onChange({ selected: e.target.checked, rowData, rowIndex })
  }

  render() {
    const { rowData, column } = this.props
    const { selectedRowKeys, rowKey } = column
    const checked = selectedRowKeys.includes(rowData[rowKey])

    return (
      <input type="checkbox" checked={checked} onChange={this._handleChange} />
    )
  }
}

class SelectableTable extends React.PureComponent {
  constructor(props) {
    super(props)

    const {
      selectedRowKeys,
      defaultSelectedRowKeys,
      expandedRowKeys,
      defaultExpandedRowKeys,
    } = props
    this.state = {
      selectedRowKeys:
        (selectedRowKeys !== undefined
          ? selectedRowKeys
          : defaultSelectedRowKeys) || [],
      expandedRowKeys:
        (expandedRowKeys !== undefined
          ? expandedRowKeys
          : defaultExpandedRowKeys) || [],
    }
  }

  /**
   * Set `selectedRowKeys` manually.
   * This method is available only if `selectedRowKeys` is uncontrolled.
   *
   * @param {array} selectedRowKeys
   */
  setSelectedRowKeys(selectedRowKeys) {
    // if `selectedRowKeys` is controlled
    if (this.props.selectedRowKeys !== undefined) return

    this.setState({
      selectedRowKeys: cloneArray(selectedRowKeys),
    })
  }

  /**
   * See BaseTable#setExpandedRowKeys
   */
  setExpandedRowKeys(expandedRowKeys) {
    // if `expandedRowKeys` is controlled
    if (this.props.expandedRowKeys !== undefined) return

    this.setState({
      expandedRowKeys: cloneArray(expandedRowKeys),
    })
  }

  /* some other custom methods and proxy methods */

  /**
   * Remove rowKeys from inner state  manually, it's useful to purge dirty state after rows removed.
   * This method is available only if `selectedRowKeys` or `expandedRowKeys` is uncontrolled.
   *
   * @param {array} rowKeys
   */
  removeRowKeysFromState(rowKeys) {
    if (!Array.isArray(rowKeys)) return

    const state = {}
    if (
      this.props.selectedRowKeys === undefined &&
      this.state.selectedRowKeys.length > 0
    ) {
      state.selectedRowKeys = this.state.selectedRowKeys.filter(
        key => !rowKeys.includes(key)
      )
    }
    if (
      this.props.expandedRowKeys === undefined &&
      this.state.expandedRowKeys.length > 0
    ) {
      state.expandedRowKeys = this.state.expandedRowKeys.filter(
        key => !rowKeys.includes(key)
      )
    }
    if (state.selectedRowKeys || state.expandedRowKeys) {
      this.setState(state)
    }
  }

  _handleSelectChange = ({ selected, rowData, rowIndex }) => {
    const selectedRowKeys = [...this.state.selectedRowKeys]
    const key = rowData[this.props.rowKey]

    if (selected) {
      if (!selectedRowKeys.includes(key)) selectedRowKeys.push(key)
    } else {
      const index = selectedRowKeys.indexOf(key)
      if (index > -1) {
        selectedRowKeys.splice(index, 1)
      }
    }

    // if `selectedRowKeys` is uncontrolled, update internal state
    if (this.props.selectedRowKeys === undefined) {
      this.setState({ selectedRowKeys })
    }
    this.props.onRowSelect({ selected, rowData, rowIndex })
    this.props.onSelectedRowsChange(selectedRowKeys)
  }

  _rowClassName = ({ rowData, rowIndex }) => {
    const { rowClassName, rowKey } = this.props
    const { selectedRowKeys } = this.state

    const rowClass = rowClassName
      ? callOrReturn(rowClassName, { rowData, rowIndex })
      : ''
    const key = rowData[rowKey]

    return [rowClass, selectedRowKeys.includes(key) && 'row-selected']
      .filter(Boolean)
      .concat(' ')
  }

  render() {
    const {
      columns,
      children,
      selectable,
      selectionColumnProps,
      ...rest
    } = this.props
    const { selectedRowKeys } = this.state

    // you'd better memoize this operation
    let _columns = columns || normalizeColumns(children)
    if (selectable) {
      const selectionColumn = {
        width: 40,
        flexShrink: 0,
        resizable: false,
        frozen: Column.FrozenDirection.LEFT,
        cellRenderer: SelectionCell,
        ...selectionColumnProps,
        key: '__selection__',
        rowKey: this.props.rowKey,
        selectedRowKeys: selectedRowKeys,
        onChange: this._handleSelectChange,
      }
      _columns = [selectionColumn, ..._columns]
    }

    return (
      <StyledTable
        {...rest}
        columns={_columns}
        rowClassName={this._rowClassName}
      />
    )
  }
}

SelectableTable.defaultProps = {
  ...BaseTable.defaultProps,
  onRowSelect: noop,
  onSelectedRowsChange: noop,
}

// Use case
const columns = generateColumns(10)
const data = generateData(columns, 200)

export default () => (
  <SelectableTable
    width={700}
    height={400}
    selectable
    columns={columns}
    data={data}
    onRowSelect={action('onRowSelect')}
    onSelectedRowsChange={action('onSelectedRowsChange')}
  />
)
