import React from 'react';

import { renderElement } from './utils';

import { TTagname } from './BaseTable';
import { ICellRendererCBParam, IColumnProps } from './Column';
import { IHeaderRendererParam } from './GridTable';

export interface ITableHeaderRowProps<T = any> {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: IColumnProps[];
  headerIndex?: number;
  cellRenderer?: React.ElementType<ICellRendererCBParam<T>>;
  headerRenderer?: React.ElementType<IHeaderRendererParam>;
  expandColumnKey?: string;
  expandIcon?: React.ElementType;
  tagName?: TTagname;
}

type TTableHeaderRow<T = any> = React.FunctionComponent<ITableHeaderRowProps<T>>;
/**
 * HeaderRow component for BaseTable
 */
const TableHeaderRow: TTableHeaderRow = ({
  className,
  style,
  columns,
  headerIndex,
  cellRenderer: CellRenderer,
  headerRenderer,
  expandColumnKey,
  expandIcon: ExpandIcon,
  tagName: Tag,
  ...rest
}) => {
  let cells: React.ReactNode = columns.map((column, columnIndex) => {
    const cellProps: ICellRendererCBParam = {
      columns,
      column,
      columnIndex,
      headerIndex,
      expandIcon: column.key === expandColumnKey && <ExpandIcon />,
    };
    return <CellRenderer {...cellProps} key={columnIndex} />;
  });

  if (headerRenderer) {
    cells = renderElement(headerRenderer, { cells, columns, headerIndex });
  }

  return (
    <Tag {...rest} className={className} style={style}>
      {cells}
    </Tag>
  );
};

TableHeaderRow.defaultProps = {
  tagName: 'div',
};

export default TableHeaderRow;
