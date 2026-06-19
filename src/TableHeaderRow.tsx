import React from 'react';
import { renderElement } from './utils';

import type { TableHeaderRowProps } from './types';

/**
 * HeaderRow component for BaseTable
 */
const TableHeaderRow: React.FC<TableHeaderRowProps> = ({
  className,
  style,
  columns,
  headerIndex,
  cellRenderer,
  headerRenderer,
  expandColumnKey,
  expandIcon: ExpandIcon,
  tagName: Tag = 'div',
  ...rest
}) => {
  let cells: React.ReactNode = columns.map((column, columnIndex) =>
    cellRenderer!({
      columns,
      column,
      columnIndex,
      headerIndex,
      expandIcon: column.key === expandColumnKey && ExpandIcon && <ExpandIcon />,
    }),
  );

  if (headerRenderer) {
    cells = renderElement(headerRenderer as any, { cells, columns, headerIndex });
  }

  return (
    <Tag {...rest} className={className} style={style}>
      {cells}
    </Tag>
  );
};

export default TableHeaderRow;
