import * as React from 'react';

export interface ITableHeaderProps {
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number;
  columns: any[];
  data: any[];
  frozenData?: any[];
  headerRenderer: (...args: any[]) => any;
  rowRenderer: (...args: any[]) => any;
}

export default class TableHeader extends React.PureComponent<ITableHeaderProps> {}
