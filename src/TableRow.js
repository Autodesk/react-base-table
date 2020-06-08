import React from 'react';
import { RowHeightContext } from './GridTable';

import PropTypes from 'prop-types';

import { renderElement } from './utils';

/**
 * Row component for BaseTable
 */
class TableRow extends React.PureComponent {
  constructor(props) {
    super(props);

    this._handleExpand = this._handleExpand.bind(this);
    this.ref = React.createRef();
    this.mounted = false;
  }

  componentDidMount() {
    if (this.props.useDynamicRowHeight) {
      const { rowIndex } = this.props;
      const height = this.ref.current.getBoundingClientRect().height;
      this.context.setRowHeightMap(rowIndex, height);
    }
    this.mounted = true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.useDynamicRowHeight && prevProps.rowData !== this.props.rowData) {
      const { rowIndex } = this.props;
      const height = this.ref.current.getBoundingClientRect().height;
      this.context.setRowHeightMap(rowIndex, height);
    }
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      isScrolling,
      className,
      style,
      columns,
      rowIndex,
      rowData,
      expandColumnKey,
      depth,
      rowEventHandlers,
      rowRenderer,
      cellRenderer,
      expandIconRenderer,
      tagName: Tag,
      // omit the following from rest
      rowKey,
      onRowHover,
      onRowExpand,
      useDynamicRowHeight,
      ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const expandIcon = expandIconRenderer({ rowData, rowIndex, depth, onExpand: this._handleExpand });
    let cells = columns.map((column, columnIndex) =>
      cellRenderer({
        isScrolling,
        columns,
        column,
        columnIndex,
        rowData,
        rowIndex,
        expandIcon: column.key === expandColumnKey && expandIcon,
      })
    );

    if (rowRenderer) {
      cells = renderElement(rowRenderer, { isScrolling, cells, columns, rowData, rowIndex, depth });
    }

    const eventHandlers = this._getEventHandlers(rowEventHandlers);
    if (!useDynamicRowHeight) {
      return (
        <Tag {...rest} style={style} className={className} {...eventHandlers}>
          {cells}
        </Tag>
      );
    }
    const rowStyle = { height: '100%' };
    return (
      <RowHeightContext.Consumer>
        {context => {
          this.context = context;
          return (
            <Tag style={style}>
              <div
                {...rest}
                style={this.mounted ? rowStyle : null}
                className={className}
                {...eventHandlers}
                ref={this.ref}
              >
                {cells}
              </div>
            </Tag>
          );
        }}
      </RowHeightContext.Consumer>
    );
  }

  _handleExpand(expanded) {
    const { onRowExpand, rowData, rowIndex, rowKey } = this.props;
    onRowExpand && onRowExpand({ expanded, rowData, rowIndex, rowKey });
  }

  _getEventHandlers(handlers = {}) {
    const { rowData, rowIndex, rowKey, onRowHover } = this.props;
    const eventHandlers = {};
    Object.keys(handlers).forEach(eventKey => {
      const callback = handlers[eventKey];
      if (typeof callback === 'function') {
        eventHandlers[eventKey] = event => {
          callback({ rowData, rowIndex, rowKey, event });
        };
      }
    });

    if (onRowHover) {
      const mouseEnterHandler = eventHandlers['onMouseEnter'];
      eventHandlers['onMouseEnter'] = event => {
        onRowHover({
          hovered: true,
          rowData,
          rowIndex,
          rowKey,
          event,
        });
        mouseEnterHandler && mouseEnterHandler(event);
      };

      const mouseLeaveHandler = eventHandlers['onMouseLeave'];
      eventHandlers['onMouseLeave'] = event => {
        onRowHover({
          hovered: false,
          rowData,
          rowIndex,
          rowKey,
          event,
        });
        mouseLeaveHandler && mouseLeaveHandler(event);
      };
    }

    return eventHandlers;
  }
}

TableRow.defaultProps = {
  tagName: 'div',
};

TableRow.propTypes = {
  isScrolling: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowData: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  expandColumnKey: PropTypes.string,
  depth: PropTypes.number,
  rowEventHandlers: PropTypes.object,
  rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  cellRenderer: PropTypes.func,
  expandIconRenderer: PropTypes.func,
  onRowHover: PropTypes.func,
  onRowExpand: PropTypes.func,
  tagName: PropTypes.elementType,
  innerRef: PropTypes.object,
  useDynamicRowHeight: PropTypes.bool,
};

export default TableRow;
