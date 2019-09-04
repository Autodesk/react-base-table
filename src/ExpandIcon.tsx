import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { fn } from './utils';

export interface ExpandIconProps {
  expandable?: boolean;
  expanded?: boolean;
  indentSize?: number;
  depth?: number;
  onExpand?: fn;
}

/**
 * default ExpandIcon for BaseTable
 */
export default class ExpandIcon extends React.PureComponent<ExpandIconProps> {
  static defaultProps = {
    depth: 0,
    indentSize: 16,
  };

  static propTypes = {
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    indentSize: PropTypes.number,
    depth: PropTypes.number,
    onExpand: PropTypes.func,
  };

  constructor(props: Readonly<ExpandIconProps>) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  render() {
    const { expandable, expanded, indentSize, depth, onExpand, ...rest } = this.props;
    if (!expandable && indentSize === 0) return null;

    const cls = cn('BaseTable__expand-icon', {
      'BaseTable__expand-icon--expanded': expanded,
    });
    return (
      <div
        {...rest}
        className={cls}
        onClick={expandable && onExpand ? (this._handleClick as any) : null}
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
          marginLeft: depth! * indentSize!,
        }}
      >
        {expandable && '\u25B8'}
      </div>
    );
  }

  _handleClick(e: any) {
    e.stopPropagation();
    e.preventDefault();
    const { onExpand, expanded } = this.props;
    onExpand!(!expanded);
  }
}
