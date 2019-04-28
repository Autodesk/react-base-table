import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { DraggableCore } from 'react-draggable';
import throttle from 'lodash/throttle';

import { noop } from './utils';

const INVALID_VALUE = null;
const MIN_WIDTH = 25;
const THROTTLE_WAIT = 50;

/**
 * ColumnResizer for BaseTable
 */
class ColumnResizer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.lastX = INVALID_VALUE;
    this.width = 0;

    this._handleDrag = throttle(this._handleDrag.bind(this), THROTTLE_WAIT);
    this._handleStart = this._handleStart.bind(this);
    this._handleStop = this._handleStop.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  render() {
    const { className, style, width, disabled } = this.props;

    const cls = cn('BaseTable__column-resizer', className);
    return (
      <DraggableCore
        axis="x"
        disabled={disabled}
        onStart={this._handleStart}
        onDrag={this._handleDrag}
        onStop={this._handleStop}
      >
        <div
          className={cls}
          onClick={this._handleClick}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            cursor: 'ew-resize',
            borderRightStyle: 'solid',
            ...style,
            borderRightWidth: width,
          }}
        />
      </DraggableCore>
    );
  }

  _handleDrag(e, data) {
    if (this.lastX === INVALID_VALUE) {
      this.lastX = data.lastX;
      return true;
    }

    const { column } = this.props;
    const { width, maxWidth, minWidth = MIN_WIDTH } = column;
    const movedX = data.x - this.lastX;
    if (!movedX) return true;

    this.width = this.width + movedX;
    this.lastX = data.x;

    let newWidth = this.width;
    if (maxWidth && newWidth > maxWidth) {
      newWidth = maxWidth;
    } else if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    if (newWidth === width) return true;
    return this.props.onResize(column, newWidth);
  }

  _handleStart(e, data) {
    this.lastX = INVALID_VALUE;
    this.width = this.props.column.width;
    return this.props.onResizeStart(this.props.column);
  }

  _handleStop(e, data) {
    return this.props.onResizeStop(this.props.column);
  }

  _handleClick(e) {
    e.stopPropagation();
  }
}

ColumnResizer.defaultProps = {
  width: 3,
  onResizeStart: noop,
  onResize: noop,
  onResizeStop: noop,
};

ColumnResizer.propTypes = {
  /**
   * Class name for the drag handler
   */
  className: PropTypes.string,
  /**
   * The column object to be dragged
   */
  column: PropTypes.object,
  /**
   * The width of the drag handler
   */
  width: PropTypes.number.isRequired,
  /**
   * Whether the resizing is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Custom style for the drag handler
   */
  style: PropTypes.object,
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
