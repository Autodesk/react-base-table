import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { SortOrder } from './SortOrder';

interface SortIndicatorProps {
    sortOrder: SortOrder;
    style?: React.CSSProperties;
    className?: string;
}

/**
 * default SortIndicator for BaseTable
 */
const SortIndicator = ({ sortOrder, className, style }: SortIndicatorProps) => {
    const cls = cn('BaseTable__sort-indicator', className, {
        'BaseTable__sort-indicator--descending': sortOrder === SortOrder.DESC
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
                ...style
            }}
        >
            {sortOrder === SortOrder.DESC ? '\u2193' : '\u2191'}
        </div>
    );
};

SortIndicator.propTypes = {
    sortOrder: PropTypes.oneOf([SortOrder.ASC, SortOrder.DESC]),
    className: PropTypes.string,
    style: PropTypes.object
};

export default SortIndicator;
