import React from 'react';
import PropTypes from 'prop-types';

import { renderElement, fn } from './utils';

export interface TableHeaderRowProps<T = any> {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: T[];
  headerIndex?: number;
  cellRenderer?: fn;
  headerRenderer?: Parameters<typeof renderElement>[0];
  expandColumnKey?: string;
  expandIcon?: fn;
  tagName?: PropTypes.ReactComponentLike;
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
  expandIcon,
  tagName,
  ...rest
}) => {
  const ExpandIcon = expandIcon!;
  const Tag = tagName!;

  let cells: React.ReactNode = columns.map((column: { key: any }, columnIndex: any) =>
    cellRenderer!({
      columns,
      column,
      columnIndex,
      headerIndex,
      expandIcon: column.key === expandColumnKey && <ExpandIcon />,
    })
  );

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

TableHeaderRow.propTypes = {
  isScrolling: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerIndex: PropTypes.number,
  cellRenderer: PropTypes.func,
  headerRenderer: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  expandColumnKey: PropTypes.string,
  expandIcon: PropTypes.func,
  tagName: PropTypes.elementType,
};

export default TableHeaderRow;
