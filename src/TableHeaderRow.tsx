import React from 'react';
import PropTypes from 'prop-types';

import { renderElement } from './utils';

import type { ColumnShape } from './types';

export interface TableHeaderRowProps {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: ColumnShape[];
  headerIndex?: number;
  cellRenderer?: (args: any) => React.ReactNode;
  headerRenderer?: React.ComponentType<any> | React.ReactElement | ((props: any) => React.ReactNode);
  expandColumnKey?: string;
  expandIcon?: React.ComponentType<any>;
  tagName?: React.ElementType;
  [key: string]: any;
}

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

TableHeaderRow.propTypes = {
  isScrolling: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerIndex: PropTypes.number,
  cellRenderer: PropTypes.func,
  headerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  expandColumnKey: PropTypes.string,
  expandIcon: PropTypes.func,
  tagName: PropTypes.elementType,
};

export default TableHeaderRow;
