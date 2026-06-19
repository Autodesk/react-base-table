import React, { useCallback } from 'react';
import cn from 'classnames';

import type { ExpandIconProps } from './types';

/**
 * default ExpandIcon for BaseTable
 */
const ExpandIcon: React.FC<ExpandIconProps> = React.memo(
  ({ expandable, expanded, indentSize = 16, depth = 0, onExpand, ...rest }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onExpand!(!expanded);
      },
      [onExpand, expanded],
    );

    if (!expandable && indentSize === 0) return null;

    const cls = cn('BaseTable__expand-icon', {
      'BaseTable__expand-icon--expanded': expanded,
    });
    return (
      <div
        {...rest}
        className={cls}
        onClick={expandable && onExpand ? handleClick : undefined}
        style={{
          fontFamily: 'initial',
          cursor: 'pointer',
          userSelect: 'none',
          width: '16px',
          minWidth: '16px',
          height: '16px',
          lineHeight: '16px',
          fontSize: '16px',
          textAlign: 'center',
          transition: 'transform 0.15s ease-out',
          transform: `rotate(${expandable && expanded ? 90 : 0}deg)`,
          marginLeft: depth * indentSize,
        }}
      >
        {expandable && '\u25B8'}
      </div>
    );
  },
);

export default ExpandIcon;
