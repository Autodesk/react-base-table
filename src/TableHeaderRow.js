import React from 'react';
import PropTypes from 'prop-types';

import { renderElement } from './utils';

/**
 * HeaderRow component for BaseTable
 */
const TableHeaderRow = ({
  className,
  style,
  columns,
  headerIndex,
  cellRenderer,
  headerRenderer,
  expandColumnKey,
  expandIcon: ExpandIcon,
  tagName: Tag,
  ...rest
}) => {
  let cells = columns.map((column, columnIndex) =>
    cellRenderer({
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
  headerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  expandColumnKey: PropTypes.string,
  expandIcon: PropTypes.func,
  tagName: PropTypes.elementType,
};

export default TableHeaderRow;
