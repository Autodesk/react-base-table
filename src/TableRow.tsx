import React from 'react';
import PropTypes from 'prop-types';

import { renderElement } from './utils';
import { fn, ReactElementType } from './type-utils';

export type RowKey = string | number;

export interface RowRendererProps<T = any> {
  isScrolling?: boolean;
  cells: any;
  columns: T[];
  rowData: any;
  rowIndex: number;
  depth?: number;
}

export interface TableRowProps<T = any> {
  columns: T[];
  rowData: any;
  rowIndex: number;
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  rowKey?: RowKey;
  expandColumnKey?: string;
  depth?: number;
  rowEventHandlers?: object;
  rowRenderer?: Parameters<typeof renderElement>[0];
  cellRenderer?: fn;
  expandIconRenderer?: fn;
  onRowHover?: fn;
  onRowExpand?: fn;
  tagName: ReactElementType;
}

/**
 * Row component for BaseTable
 */
class TableRow<T = any> extends React.PureComponent<TableRowProps<T>> {
  public static ofType<T = any>() {
    return TableRow as new (props: TableRowProps<T>) => TableRow<T>;
  }

  static defaultProps = {
    tagName: 'div',
  };

  static propTypes = {
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
  };

  constructor(props: Readonly<TableRowProps>) {
    super(props);
    this._handleExpand = this._handleExpand.bind(this);
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
      tagName,
      // omit the following from rest
      rowKey,
      onRowHover,
      onRowExpand,
      ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const Tag = tagName!;

    const expandIcon = expandIconRenderer!({ rowData, rowIndex, depth, onExpand: this._handleExpand });
    let cells: any = columns.map((column, columnIndex) =>
      cellRenderer!({
        isScrolling,
        columns,
        column,
        columnIndex,
        rowData,
        rowIndex,
        expandIcon: (column as any).key === expandColumnKey && expandIcon,
      })
    );

    if (rowRenderer) {
      cells = renderElement(rowRenderer, { isScrolling, cells, columns, rowData, rowIndex, depth });
    }

    const eventHandlers = this._getEventHandlers(rowEventHandlers);
    return (
      <Tag {...rest} className={className} style={style} {...eventHandlers}>
        {cells}
      </Tag>
    );
  }

  _handleExpand(expanded: any) {
    const { onRowExpand, rowData, rowIndex, rowKey } = this.props;
    onRowExpand && onRowExpand({ expanded, rowData, rowIndex, rowKey });
  }

  _getEventHandlers(handlers: any = {}) {
    const { rowData, rowIndex, rowKey, onRowHover } = this.props;
    const eventHandlers: any = {};
    Object.keys(handlers).forEach(eventKey => {
      const callback = handlers[eventKey];
      if (typeof callback === 'function') {
        eventHandlers[eventKey] = (event: any) => {
          callback({ rowData, rowIndex, rowKey, event });
        };
      }
    });

    if (onRowHover) {
      const mouseEnterHandler = eventHandlers['onMouseEnter'];
      eventHandlers['onMouseEnter'] = (event: any) => {
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
      eventHandlers['onMouseLeave'] = (event: any) => {
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

/**
 * Row component for BaseTable
 */
// class PrevTableRow<T = any> extends React.PureComponent<TableRowProps<T>> {}

// TableRow.defaultProps = {
//   tagName: 'div',
// };

// TableRow.propTypes = {
//   isScrolling: PropTypes.bool,
//   className: PropTypes.string,
//   style: PropTypes.object,
//   columns: PropTypes.arrayOf(PropTypes.object).isRequired,
//   rowData: PropTypes.object.isRequired,
//   rowIndex: PropTypes.number.isRequired,
//   rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   expandColumnKey: PropTypes.string,
//   depth: PropTypes.number,
//   rowEventHandlers: PropTypes.object,
//   rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
//   cellRenderer: PropTypes.func,
//   expandIconRenderer: PropTypes.func,
//   onRowHover: PropTypes.func,
//   onRowExpand: PropTypes.func,
//   tagName: PropTypes.elementType,
// };

export default TableRow;
