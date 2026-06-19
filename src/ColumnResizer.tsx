import React, { useRef, useCallback, useEffect } from 'react';
import { noop, addClassName, removeClassName } from './utils';

import type { ColumnResizerProps } from './types';

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

/**
 * ColumnResizer for BaseTable
 */
const ColumnResizer: React.FC<ColumnResizerProps> = React.memo(
  ({ style, column, onResizeStart = noop, onResize = noop, onResizeStop = noop, minWidth = 30, ...rest }) => {
    const handleRef = useRef<HTMLDivElement | null>(null);
    const isDraggingRef = useRef(false);
    const lastXRef = useRef<number | null>(INVALID_VALUE);
    const widthRef = useRef(0);

    // Refs to hold latest props for use in DOM event listeners
    const columnRef = useRef(column);
    columnRef.current = column;
    const onResizeRef = useRef(onResize);
    onResizeRef.current = onResize;
    const onResizeStopRef = useRef(onResizeStop);
    onResizeStopRef.current = onResizeStop;
    const minWidthRef = useRef(minWidth);
    minWidthRef.current = minWidth;

    const handleDrag = useCallback((e: any) => {
      let clientX = e.clientX;
      if (e.type === eventsFor.touch.move) {
        e.preventDefault();
        if (e.targetTouches && e.targetTouches[0]) clientX = e.targetTouches[0].clientX;
      }

      const { offsetParent } = handleRef.current!;
      const offsetParentRect = (offsetParent as HTMLElement).getBoundingClientRect();
      const x = clientX + (offsetParent as HTMLElement).scrollLeft - offsetParentRect.left;

      if (lastXRef.current === INVALID_VALUE) {
        lastXRef.current = x;
        return;
      }

      const col = columnRef.current!;
      const { width, maxWidth, minWidth: colMinWidth = minWidthRef.current } = col;
      const movedX = x - lastXRef.current!;
      if (!movedX) return;

      widthRef.current = widthRef.current + movedX;
      lastXRef.current = x;

      let newWidth = widthRef.current;
      if (maxWidth && newWidth > maxWidth) {
        newWidth = maxWidth;
      } else if (newWidth < colMinWidth!) {
        newWidth = colMinWidth!;
      }

      if (newWidth === width) return;
      onResizeRef.current!(col, newWidth);
    }, []);

    const handleDragStop = useCallback(
      (e: any) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        onResizeStopRef.current!(columnRef.current!);

        const { ownerDocument } = handleRef.current!;
        removeUserSelectStyles(ownerDocument);
        ownerDocument.removeEventListener(dragEventFor.move, handleDrag);
        ownerDocument.removeEventListener(dragEventFor.stop, handleDragStop);
      },
      [handleDrag],
    );

    const handleDragStart = useCallback(
      (e: any) => {
        if (typeof e.button === 'number' && e.button !== 0) return;

        isDraggingRef.current = true;
        lastXRef.current = INVALID_VALUE;
        widthRef.current = columnRef.current!.width;
        onResizeStart!(columnRef.current!);

        const { ownerDocument } = handleRef.current!;
        addUserSelectStyles(ownerDocument);
        ownerDocument.addEventListener(dragEventFor.move, handleDrag);
        ownerDocument.addEventListener(dragEventFor.stop, handleDragStop);
      },
      [onResizeStart, handleDrag, handleDragStop],
    );

    const handleClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        dragEventFor = eventsFor.mouse;
        handleDragStart(e as any);
      },
      [handleDragStart],
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent) => {
        dragEventFor = eventsFor.mouse;
        handleDragStop(e as any);
      },
      [handleDragStop],
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        dragEventFor = eventsFor.touch;
        handleDragStart(e as any);
      },
      [handleDragStart],
    );

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        dragEventFor = eventsFor.touch;
        handleDragStop(e as any);
      },
      [handleDragStop],
    );

    useEffect(() => {
      return () => {
        if (handleRef.current) {
          const { ownerDocument } = handleRef.current;
          ownerDocument.removeEventListener(eventsFor.mouse.move, handleDrag);
          ownerDocument.removeEventListener(eventsFor.mouse.stop, handleDragStop);
          ownerDocument.removeEventListener(eventsFor.touch.move, handleDrag);
          ownerDocument.removeEventListener(eventsFor.touch.stop, handleDragStop);
          removeUserSelectStyles(ownerDocument);
        }
      };
    }, [handleDrag, handleDragStop]);

    return (
      <div
        {...rest}
        ref={handleRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
  },
);

export default ColumnResizer;
