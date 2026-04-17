import React from 'react';
import PropTypes from 'prop-types';

import { noop, addClassName, removeClassName } from './utils';

import type { ColumnShape } from './types';

const INVALID_VALUE = null;

// copied from https://github.com/mzabriskie/react-draggable/blob/master/lib/utils/domFns.js
export function addUserSelectStyles(doc: Document) {
  if (!doc) return;
  let styleEl = doc.getElementById('react-draggable-style-el') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'react-draggable-style-el';
    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }
  if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
}

export function removeUserSelectStyles(doc: Document) {
  if (!doc) return;
  try {
    if (doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection');
    if ((doc as any).selection) {
      (doc as any).selection.empty();
    } else {
      const selection = (doc.defaultView || window).getSelection();
      if (selection && selection.type !== 'Caret') {
        selection.removeAllRanges();
      }
    }
  } catch (e) {
    // probably IE
  }
}

const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
};

let dragEventFor = eventsFor.mouse;

export interface ColumnResizerProps {
  style?: React.CSSProperties;
  column?: ColumnShape;
  onResizeStart?: (column: ColumnShape) => void;
  onResize?: (column: ColumnShape, width: number) => void;
  onResizeStop?: (column: ColumnShape) => void;
  minWidth?: number;
  className?: string;
  [key: string]: any;
}

/**
 * ColumnResizer for BaseTable
 */
class ColumnResizer extends React.PureComponent<ColumnResizerProps> {
  isDragging = false;
  lastX: number | null = INVALID_VALUE;
  width = 0;
  handleRef: HTMLDivElement | null = null;

  static defaultProps = {
    onResizeStart: noop,
    onResize: noop,
    onResizeStop: noop,
    minWidth: 30,
  };

  static propTypes = {
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
    /**
     * Minimum width of the column could be resized to if the column's `minWidth` is not set
     */
    minWidth: PropTypes.number,
  };

  constructor(props: ColumnResizerProps) {
    super(props);

    this._setHandleRef = this._setHandleRef.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragStop = this._handleDragStop.bind(this);
    this._handleDrag = this._handleDrag.bind(this);
  }

  componentWillUnmount() {
    if (this.handleRef) {
      const { ownerDocument } = this.handleRef;
      ownerDocument.removeEventListener(eventsFor.mouse.move, this._handleDrag);
      ownerDocument.removeEventListener(eventsFor.mouse.stop, this._handleDragStop);
      ownerDocument.removeEventListener(eventsFor.touch.move, this._handleDrag);
      ownerDocument.removeEventListener(eventsFor.touch.stop, this._handleDragStop);
      removeUserSelectStyles(ownerDocument);
    }
  }

  render() {
    const { style, column, onResizeStart, onResize, onResizeStop, minWidth, ...rest } = this.props;

    return (
      <div
        {...rest}
        ref={this._setHandleRef}
        onClick={this._handleClick}
        onMouseDown={this._handleMouseDown}
        onMouseUp={this._handleMouseUp}
        onTouchStart={this._handleTouchStart}
        onTouchEnd={this._handleTouchEnd}
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

  _setHandleRef(ref: HTMLDivElement | null) {
    this.handleRef = ref;
  }

  _handleClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  _handleMouseDown(e: React.MouseEvent) {
    dragEventFor = eventsFor.mouse;
    this._handleDragStart(e as any);
  }

  _handleMouseUp(e: React.MouseEvent) {
    dragEventFor = eventsFor.mouse;
    this._handleDragStop(e as any);
  }

  _handleTouchStart(e: React.TouchEvent) {
    dragEventFor = eventsFor.touch;
    this._handleDragStart(e as any);
  }

  _handleTouchEnd(e: React.TouchEvent) {
    dragEventFor = eventsFor.touch;
    this._handleDragStop(e as any);
  }

  _handleDragStart(e: any) {
    if (typeof e.button === 'number' && e.button !== 0) return;

    this.isDragging = true;
    this.lastX = INVALID_VALUE;
    this.width = this.props.column!.width;
    this.props.onResizeStart!(this.props.column!);

    const { ownerDocument } = this.handleRef!;
    addUserSelectStyles(ownerDocument);
    ownerDocument.addEventListener(dragEventFor.move, this._handleDrag);
    ownerDocument.addEventListener(dragEventFor.stop, this._handleDragStop);
  }

  _handleDragStop(e: any) {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.props.onResizeStop!(this.props.column!);

    const { ownerDocument } = this.handleRef!;
    removeUserSelectStyles(ownerDocument);
    ownerDocument.removeEventListener(dragEventFor.move, this._handleDrag);
    ownerDocument.removeEventListener(dragEventFor.stop, this._handleDragStop);
  }

  _handleDrag(e: any) {
    let clientX = e.clientX;
    if (e.type === eventsFor.touch.move) {
      e.preventDefault();
      if (e.targetTouches && e.targetTouches[0]) clientX = e.targetTouches[0].clientX;
    }

    const { offsetParent } = this.handleRef!;
    const offsetParentRect = (offsetParent as HTMLElement).getBoundingClientRect();
    const x = clientX + (offsetParent as HTMLElement).scrollLeft - offsetParentRect.left;

    if (this.lastX === INVALID_VALUE) {
      this.lastX = x;
      return;
    }

    const { column, minWidth: MIN_WIDTH } = this.props;
    const { width, maxWidth, minWidth = MIN_WIDTH } = column!;
    const movedX = x - this.lastX!;
    if (!movedX) return;

    this.width = this.width + movedX;
    this.lastX = x;

    let newWidth = this.width;
    if (maxWidth && newWidth > maxWidth) {
      newWidth = maxWidth;
    } else if (newWidth < minWidth!) {
      newWidth = minWidth!;
    }

    if (newWidth === width) return;
    this.props.onResize!(column!, newWidth);
  }
}

export default ColumnResizer;
