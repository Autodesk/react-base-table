import * as React from 'react';

export interface IGridTableProps {
  containerStyle?: React.CSSProperties;
  classPrefix?: string;
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  headerWidth: number;
  bodyWidth: number;
  rowHeight: number;
  columns: any[];
  data: any[];
  rowKey: string | number;
  frozenData?: any[];
  useIsScrolling?: boolean;
  overscanRowCount?: number;
  hoveredRowKey?: string | number | null;
  style?: React.CSSProperties;
  onScrollbarPresenceChange?: (...args: any) => any;
  onScroll?: (...args: any) => any;
  onRowsRendered?: (...args: any) => any;
  headerRenderer: (...args: any) => any;
  rowRenderer: (...args: any) => any;
}

/**
 * A wrapper of the Grid for internal only
 */
export default class GridTable extends React.PureComponent<IGridTableProps> {
  forceUpdateTable(): void;
  scrollToPosition(args: { scrollLeft: any }): void;
  scrollToTop(scrollTop: any): void;
  scrollToLeft(scrollLeft: any): void;
  scrollToRow(rowIndex?: number, align?: string): void;
  renderRow(args: { rowIndex: number }): any;
}
