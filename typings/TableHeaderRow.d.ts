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
declare const TableHeaderRow: React.FC<TableHeaderRowProps>;
export default TableHeaderRow;
