import React from 'react';
import PropTypes from 'prop-types';

import { renderElement, fn } from './utils';

export interface TableRowProps<T = any> {
  isScrolling?: boolean; // PropTypes.bool,
  className?: string; // PropTypes.string,
  style?: React.CSSProperties; // PropTypes.object,
  columns: T[]; // PropTypes.arrayOf(PropTypes.object).isRequired,
  rowData: any; // PropTypes.object.isRequired,
  rowIndex: number; // PropTypes.number.isRequired,
  rowKey?: string | number; // PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  expandColumnKey?: string; // PropTypes.string,
  depth?: number; // PropTypes.number,
  rowEventHandlers?: object; // PropTypes.object,
  rowRenderer?: Parameters<typeof renderElement>[0]; // PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  cellRenderer?: fn; // PropTypes.func,
  expandIconRenderer?: fn; // PropTypes.func,
  onRowHover?: fn; // PropTypes.func,
  onRowExpand?: fn; // PropTypes.func,
  tagName?: PropTypes.ReactComponentLike;
}

/**
 * Row component for BaseTable
 */
export default class TableRow extends React.PureComponent<TableRowProps> {
  static defaultProps = { tagName: 'div' };

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
    rowRenderer: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
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
      tagName: Tag,
      // omit the following from rest
      rowKey,
      onRowHover,
      onRowExpand,
      ...rest
    } = this.props as Required<TableRowProps>;

    const expandIcon = expandIconRenderer({ rowData, rowIndex, depth, onExpand: this._handleExpand });
    let cells: React.ReactNode = columns.map((column: { key: any }, columnIndex: any) =>
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
