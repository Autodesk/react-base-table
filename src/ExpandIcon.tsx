import React from 'react';
import cn from 'classnames';

/**
 * default ExpandIcon for BaseTable
 */
class ExpandIcon extends React.PureComponent<IExpandIconProps> {
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
        onClick={expandable && onExpand ? this._handleClick : null}
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
  }

  private _handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    const { onExpand, expanded } = this.props;
    onExpand(!expanded);
  }
  public static defaultProps = {
    depth: 0,
    indentSize: 16,
  };
}


export interface IExpandIconProps {
  expandable?: boolean;
  expanded?: boolean;
  indentSize?: number;
  depth?: number;
  onExpand?: (param: boolean) => void;
}

export default ExpandIcon;
