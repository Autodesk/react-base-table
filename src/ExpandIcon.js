import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

/**
 * default ExpandIcon for BaseTable
 */
class ExpandIcon extends React.PureComponent {
  constructor(props) {
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
        onClick={expandable && onExpand ? this._handleClick : null}
        style={{
          display: 'inline-block',
          outline: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          width: '16px',
          height: '16px',
          lineHeight: '16px',
          fontSize: '16px',
          textAlign: 'center',
          marginLeft: depth * indentSize,
        }}
      >
        {expandable && (expanded ? '-' : '+')}
      </div>
    );
  }

  _handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const { onExpand, expanded } = this.props;
    onExpand(!expanded);
  }
}

ExpandIcon.defaultProps = {
  depth: 0,
  indentSize: 16,
};

ExpandIcon.propTypes = {
  expandable: PropTypes.bool,
  expanded: PropTypes.bool,
  indentSize: PropTypes.number,
  depth: PropTypes.number,
  onExpand: PropTypes.func,
};

export default ExpandIcon;
