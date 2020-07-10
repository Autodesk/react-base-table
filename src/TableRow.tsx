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
  style: React.CSSProperties;
  rowKey?: RowKey;
  expandColumnKey?: string;
  depth?: number;
  rowEventHandlers?: object;
  rowRenderer?: Parameters<typeof renderElement>[0];
  cellRenderer?: fn;
  expandIconRenderer?: fn;
  estimatedRowHeight?: number;
  getIsResetting: () => boolean;
  onRowHover?: fn;
  onRowExpand?: fn;
  onRowHeightChange?: fn;
  tagName: ReactElementType;
}

interface TableRowState {
  measured: boolean;
}

/**
 * Row component for BaseTable
 */
class TableRow<T = any> extends React.PureComponent<TableRowProps<T>, TableRowState> {
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

  ref: Element | null = null;

  constructor(props: Readonly<TableRowProps>) {
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

  componentDidUpdate(_: TableRowProps, prevState: TableRowState) {
    if (
      this.props.estimatedRowHeight &&
      this.props.rowIndex >= 0 &&
      // should not re-measure if it's updated after measured and reset
      !this.props.getIsResetting() &&
      this.state.measured &&
      prevState.measured
    ) {
      this.setState({ measured: false }, () => this._measureHeight());
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
      estimatedRowHeight,
      rowRenderer,
      cellRenderer,
      expandIconRenderer,
      tagName,
      // omit the following from rest
      rowKey,
      getIsResetting,
      onRowHover,
      onRowExpand,
      onRowHeightChange,
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

    if (estimatedRowHeight && rowIndex >= 0) {
      const { height, ...otherStyles } = style;
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

  _setRef(ref: Element | null) {
    this.ref = ref;
  }

  _handleExpand(expanded: boolean) {
    const { onRowExpand, rowData, rowIndex, rowKey } = this.props;
    onRowExpand && onRowExpand({ expanded, rowData, rowIndex, rowKey });
  }

  _measureHeight(initialMeasure?: boolean) {
    if (!this.ref) return;

    const { style, rowKey, onRowHeightChange, rowIndex, columns } = this.props;
    const height = this.ref.getBoundingClientRect().height;
    this.setState({ measured: true }, () => {
      if (initialMeasure || height !== style.height)
        onRowHeightChange &&
          // @ts-ignore
          onRowHeightChange(rowKey, height, rowIndex, columns[0] && !columns[0].__placeholder__ && columns[0].frozen);
    });
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

export default TableRow;
