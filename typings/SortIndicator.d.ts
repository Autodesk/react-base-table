import React from 'react';
import { SortOrderValue } from './SortOrder';
export interface SortIndicatorProps {
    sortOrder?: SortOrderValue;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * default SortIndicator for BaseTable
 */
declare const SortIndicator: React.FC<SortIndicatorProps>;
export default SortIndicator;
