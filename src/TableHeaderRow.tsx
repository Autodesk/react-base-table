import React from 'react';
import PropTypes from 'prop-types';

import { renderElement } from './utils';

interface TableHeaderRowProps {
    isScrolling?: boolean;
    className?: string;
    style?: React.CSSProperties;
    columns: any[];
    headerIndex?: number;
    cellRenderer?: (params: any) => any;
    headerRenderer?: any;
    expandColumnKey?: string;
    expandIcon?: any;
    tagName?: HTMLElement;
    checkDisabled?: boolean;
    isForceKey?: boolean;
    [key: string]: any;
}

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
    isForceKey,
    expandIcon: ExpandIcon,
    tagName: Tag = 'div',
    checkDisabled,
    ...rest
}: any) => {
    let cells = columns.map((column, columnIndex) =>
        cellRenderer({
            columns,
            column,
            columnIndex,
            headerIndex,
            isForceKey,
            expandIcon: column.key === expandColumnKey && <ExpandIcon />
        })
    );

    if (headerRenderer) {
        cells = renderElement(headerRenderer, { cells, columns, headerIndex, checkDisabled, isForceKey });
    }

    return (
        <Tag {...rest} className={className} style={style}>
            {cells}
        </Tag>
    );
};

export default TableHeaderRow;
