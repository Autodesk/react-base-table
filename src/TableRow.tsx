import React from 'react';
import PropTypes from 'prop-types';

import { renderElement } from './utils';

import type { ColumnShape, RowData, RowKey, RowEventHandlers } from './types';

export interface TableRowProps {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: ColumnShape[];
  rowData: RowData;
  rowIndex: number;
  rowKey?: RowKey;
  expandColumnKey?: string;
  depth?: number;
  rowEventHandlers?: RowEventHandlers;
  rowRenderer?: React.ComponentType<any> | React.ReactElement | ((props: any) => React.ReactNode);
  cellRenderer?: (args: any) => React.ReactNode;
  expandIconRenderer?: (args: any) => React.ReactNode;
  estimatedRowHeight?: number | ((args: { rowData: RowData; rowIndex: number }) => number);
  getIsResetting?: () => boolean;
  onRowHover?: (args: {
    hovered: boolean;
    rowData: RowData;
    rowIndex: number;
    rowKey: RowKey;
    event: React.SyntheticEvent;
  }) => void;
  onRowExpand?: (args: { expanded: boolean; rowData: RowData; rowIndex: number; rowKey: RowKey }) => void;
  onRowHeightChange?: (rowKey: RowKey, height: number, rowIndex: number, frozen?: any) => void;
  tagName?: React.ElementType;
  [key: string]: any;
}

interface TableRowState {
  measured: boolean;
}

/**
 * Row component for BaseTable
 */
class TableRow extends React.PureComponent<TableRowProps, TableRowState> {
  ref: HTMLElement | null = null;

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
    estimatedRowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    getIsResetting: PropTypes.func,
    onRowHover: PropTypes.func,
    onRowExpand: PropTypes.func,
    onRowHeightChange: PropTypes.func,
    tagName: PropTypes.elementType,
  };

  constructor(props: TableRowProps) {
    super(props);

    this.state = {
      measured: false,
    };

    this._setRef = this._setRef.bind(this);
    this._handleExpand = this._handleExpand.bind(this);
  }

  componentDidMount() {
    this.props.estimatedRowHeight && this.props.rowIndex >= 0 && this._measureHeight(true);
  }

  componentDidUpdate(prevProps: TableRowProps, prevState: TableRowState) {
    if (
      this.props.estimatedRowHeight &&
      this.props.rowIndex >= 0 &&
      !this.props.getIsResetting!() &&
      this.state.measured &&
      prevState.measured
    ) {
      this.setState({ measured: false }, () => this._measureHeight());
    }
  }

  render() {
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
      estimatedRowHeight,
      rowRenderer,
      cellRenderer,
      expandIconRenderer,
      tagName: Tag = 'div',
      // omit the following from rest
      rowKey,
      getIsResetting,
      onRowHover,
      onRowExpand,
      onRowHeightChange,
      ...rest
    } = this.props;

    const expandIcon = expandIconRenderer!({ rowData, rowIndex, depth, onExpand: this._handleExpand });
    let cells: React.ReactNode = columns.map((column, columnIndex) =>
      cellRenderer!({
        isScrolling,
        columns,
        column,
        columnIndex,
        rowData,
        rowIndex,
        expandIcon: column.key === expandColumnKey && expandIcon,
      }),
    );

    if (rowRenderer) {
      cells = renderElement(rowRenderer as any, { isScrolling, cells, columns, rowData, rowIndex, depth });
    }

    const eventHandlers = this._getEventHandlers(rowEventHandlers);

    if (estimatedRowHeight && rowIndex >= 0) {
      const { height, ...otherStyles } = style || ({} as any);
      return (
        <Tag
          {...rest}
          ref={this._setRef}
          className={className}
          style={this.state.measured ? style : otherStyles}
          {...(this.state.measured && eventHandlers)}
        >
          {cells}
        </Tag>
      );
    }

    return (
      <Tag {...rest} className={className} style={style} {...eventHandlers}>
        {cells}
      </Tag>
    );
  }

  _setRef(ref: HTMLElement | null) {
    this.ref = ref;
  }

  _handleExpand(expanded: boolean) {
    const { onRowExpand, rowData, rowIndex, rowKey } = this.props;
    onRowExpand && onRowExpand({ expanded, rowData, rowIndex, rowKey: rowKey! });
  }

  _measureHeight(initialMeasure?: boolean) {
    if (!this.ref) return;

    const { style, rowKey, onRowHeightChange, rowIndex, columns } = this.props;
    const height = this.ref.getBoundingClientRect().height;
    this.setState({ measured: true }, () => {
      if (initialMeasure || height !== (style as any)?.height)
        onRowHeightChange!(
          rowKey!,
          height,
          rowIndex,
          columns[0] && !(columns[0] as any).__placeholder__ && columns[0].frozen,
        );
    });
  }

  _getEventHandlers(handlers: Record<string, any> = {}) {
    const { rowData, rowIndex, rowKey, onRowHover } = this.props;
    const eventHandlers: Record<string, (event: React.SyntheticEvent) => void> = {};
    Object.keys(handlers).forEach((eventKey) => {
      const callback = handlers[eventKey];
      if (typeof callback === 'function') {
        eventHandlers[eventKey] = (event: React.SyntheticEvent) => {
          callback({ rowData, rowIndex, rowKey, event });
        };
      }
    });

    if (onRowHover) {
      const mouseEnterHandler = eventHandlers['onMouseEnter'];
      eventHandlers['onMouseEnter'] = (event: React.SyntheticEvent) => {
        onRowHover({
          hovered: true,
          rowData,
          rowIndex,
          rowKey: rowKey!,
          event,
        });
        mouseEnterHandler && mouseEnterHandler(event);
      };

      const mouseLeaveHandler = eventHandlers['onMouseLeave'];
      eventHandlers['onMouseLeave'] = (event: React.SyntheticEvent) => {
        onRowHover({
          hovered: false,
          rowData,
          rowIndex,
          rowKey: rowKey!,
          event,
        });
        mouseLeaveHandler && mouseLeaveHandler(event);
      };
    }

    return eventHandlers;
  }
}

export default TableRow;
