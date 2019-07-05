import React from 'react';
import PropTypes from 'prop-types';

import { noop, throttle } from './utils';

const INVALID_VALUE = null;
const MIN_WIDTH = 30;
const THROTTLE_WAIT = 50;

/**
 * ColumnResizer for BaseTable
 */
class ColumnResizer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.isDragging = false;
    this.lastX = INVALID_VALUE;
    this.width = 0;

    this._setHandleRef = this._setHandleRef.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleMouseMove = throttle(this._handleMouseMove.bind(this), THROTTLE_WAIT);
  }

  componentWillMount() {
    if (this.handleRef) {
      const { ownerDocument } = this.handleRef;
      ownerDocument.removeEventListener('mousemove', this._handleMouseMove);
      ownerDocument.addEventListener('mouseup', this._handleMouseUp);
    }
  }

  render() {
    const { style, column, onResizeStart, onResize, onResizeStop, ...rest } = this.props;

    return (
      <div
        {...rest}
        ref={this._setHandleRef}
        onClick={this._handleClick}
        onMouseDown={this._handleMouseDown}
        onMouseUp={this._handleMouseUp}
        style={{
          userSelect: 'none',
          touchAction: 'none',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          cursor: 'col-resize',
          ...style,
        }}
      />
    );
  }

  _setHandleRef(ref) {
    this.handleRef = ref;
  }

  _handleClick(e) {
    e.stopPropagation();
  }

  _handleMouseDown(e) {
    if (typeof e.button === 'number' && e.button !== 0) return;

    this.isDragging = true;
    this.lastX = INVALID_VALUE;
    this.width = this.props.column.width;
    this.props.onResizeStart(this.props.column);

    const { ownerDocument } = this.handleRef;
    ownerDocument.addEventListener('mousemove', this._handleMouseMove);
    ownerDocument.addEventListener('mouseup', this._handleMouseUp);
  }

  _handleMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.props.onResizeStop(this.props.column);

    const { ownerDocument } = this.handleRef;
    ownerDocument.removeEventListener('mousemove', this._handleMouseMove);
    ownerDocument.addEventListener('mouseup', this._handleMouseUp);
  }

  _handleMouseMove(e) {
    const { offsetParent } = this.handleRef;
    const offsetParentRect = offsetParent.getBoundingClientRect();
    const x = e.clientX + offsetParent.scrollLeft - offsetParentRect.left;

    if (this.lastX === INVALID_VALUE) {
      this.lastX = x;
      return;
    }

    const { column } = this.props;
    const { width, maxWidth, minWidth = MIN_WIDTH } = column;
    const movedX = x - this.lastX;
    if (!movedX) return;

    this.width = this.width + movedX;
    this.lastX = x;

    let newWidth = this.width;
    if (maxWidth && newWidth > maxWidth) {
      newWidth = maxWidth;
    } else if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    if (newWidth === width) return;
    this.props.onResize(column, newWidth);
  }
}

ColumnResizer.defaultProps = {
  onResizeStart: noop,
  onResize: noop,
  onResizeStop: noop,
};

ColumnResizer.propTypes = {
  /**
   * Custom style for the drag handler
   */
  style: PropTypes.object,
  /**
   * The column object to be dragged
   */
  column: PropTypes.object,
  /**
   * A callback function when resizing started
   * The callback is of the shape of `(column) => *`
   */
  onResizeStart: PropTypes.func,
  /**
   * A callback function when resizing the column
   * The callback is of the shape of `(column, width) => *`
   */
  onResize: PropTypes.func,
  /**
   * A callback function when resizing stopped
   * The callback is of the shape of `(column) => *`
   */
  onResizeStop: PropTypes.func,
};

export default ColumnResizer;
