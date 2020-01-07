import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import SortOrder, { SortOrderValue } from './SortOrder';

export interface SortIndicatorProps {
  sortOrder?: SortOrderValue;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * default SortIndicator for BaseTable
 */
const SortIndicator: React.FC<SortIndicatorProps> = ({ sortOrder, className, style }) => {
  const cls = cn('BaseTable__sort-indicator', className, {
    'BaseTable__sort-indicator--descending': sortOrder === SortOrder.DESC,
  });
  return (
    <div
      className={cls}
      style={{
        userSelect: 'none',
        width: '16px',
        height: '16px',
        lineHeight: '16px',
        textAlign: 'center',
        ...style,
      }}
    >
      {sortOrder === SortOrder.DESC ? '\u2193' : '\u2191'}
    </div>
  );
};

SortIndicator.propTypes = {
  sortOrder: PropTypes.oneOf([SortOrder.ASC, SortOrder.DESC]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SortIndicator;
