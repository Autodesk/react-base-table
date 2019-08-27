import cn from 'classnames';
import React from 'react';

import SortOrder from './SortOrder';

export interface SortIndicatorProps {
  sortOrder?: SortOrder.ASC | SortOrder.DESC;
  className?: string;
  style?: React.CSSProperties;
}

export type TSortIndicator = React.FunctionComponent<SortIndicatorProps>;

/**
 * default SortIndicator for BaseTable
 */
const SortIndicator: TSortIndicator = ({ sortOrder, className, style }) => {
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

export default SortIndicator;
