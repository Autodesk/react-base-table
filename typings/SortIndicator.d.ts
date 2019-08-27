import * as React from 'react';
import { SortOrderValue } from './SortOrder';

export interface ISortIndicatorProps {
  sortOrder?: SortOrderValue;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * default SortIndicator for BaseTable
 */
declare const SortIndicator: React.FC<ISortIndicatorProps>;
export default SortIndicator;
