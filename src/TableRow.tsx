import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { renderElement } from './utils';

import type { TableRowProps } from './types';

/**
 * Row component for BaseTable
 */
const TableRow: React.FC<TableRowProps> = React.memo(
  ({
    isScrolling,
    className,
    style,
    columns,
    rowIndex,
    rowData,
    expandColumnKey,
    depth,
    rowEventHandlers,
    estimatedRowHeight,
    rowRenderer,
    cellRenderer,
    expandIconRenderer,
    tagName: Tag = 'div',
    // omit the following from rest
    rowKey,
    getIsResetting,
    onRowHover,
    onRowExpand,
    onRowHeightChange,
    ...rest
  }) => {
    const [measured, setMeasured] = useState(false);
    const ref = useRef<HTMLElement | null>(null);

    const measureHeight = useCallback(
      (initialMeasure?: boolean) => {
        if (!ref.current) return;

        const height = ref.current.getBoundingClientRect().height;
        setMeasured(true);
        if (initialMeasure || height !== (style as any)?.height)
          onRowHeightChange!(
            rowKey!,
            height,
            rowIndex,
            columns[0] && !(columns[0] as any).__placeholder__ && columns[0].frozen,
          );
      },
      [style, rowKey, onRowHeightChange, rowIndex, columns],
    );

    // componentDidMount: initial measurement
    useEffect(() => {
      if (estimatedRowHeight && rowIndex >= 0) {
        measureHeight(true);
      }
    }, []);

    // componentDidUpdate: re-measure when props change
    const prevMeasuredRef = useRef(false);
    useEffect(() => {
      const prevMeasured = prevMeasuredRef.current;
      prevMeasuredRef.current = measured;

      if (estimatedRowHeight && rowIndex >= 0 && !getIsResetting!() && measured && prevMeasured) {
        setMeasured(false);
      }
    });

    // When measured transitions to false, trigger re-measurement
    useEffect(() => {
      if (!measured && estimatedRowHeight && rowIndex >= 0) {
        measureHeight();
      }
    }, [measured, estimatedRowHeight, rowIndex, measureHeight]);

    const handleExpand = useCallback(
      (expanded: boolean) => {
        onRowExpand && onRowExpand({ expanded, rowData, rowIndex, rowKey: rowKey! });
      },
      [onRowExpand, rowData, rowIndex, rowKey],
    );

    const eventHandlers = useMemo(() => {
      const handlers: Record<string, any> = rowEventHandlers || {};
      const result: Record<string, (event: React.SyntheticEvent) => void> = {};
      Object.keys(handlers).forEach((eventKey) => {
        const callback = handlers[eventKey];
        if (typeof callback === 'function') {
          result[eventKey] = (event: React.SyntheticEvent) => {
            callback({ rowData, rowIndex, rowKey, event });
          };
        }
      });

      if (onRowHover) {
        const mouseEnterHandler = result['onMouseEnter'];
        result['onMouseEnter'] = (event: React.SyntheticEvent) => {
          onRowHover({
            hovered: true,
            rowData,
            rowIndex,
            rowKey: rowKey!,
            event,
          });
          mouseEnterHandler && mouseEnterHandler(event);
        };

        const mouseLeaveHandler = result['onMouseLeave'];
        result['onMouseLeave'] = (event: React.SyntheticEvent) => {
          onRowHover({
            hovered: false,
            rowData,
            rowIndex,
            rowKey: rowKey!,
            event,
          });
          mouseLeaveHandler && mouseLeaveHandler(event);
        };
      }

      return result;
    }, [rowEventHandlers, rowData, rowIndex, rowKey, onRowHover]);

    const expandIcon = expandIconRenderer!({ rowData, rowIndex, depth, onExpand: handleExpand });
    let cells: React.ReactNode = columns.map((column, columnIndex) =>
      cellRenderer!({
        isScrolling,
        columns,
        column,
        columnIndex,
        rowData,
        rowIndex,
        expandIcon: column.key === expandColumnKey && expandIcon,
      }),
    );

    if (rowRenderer) {
      cells = renderElement(rowRenderer as any, { isScrolling, cells, columns, rowData, rowIndex, depth });
    }

    if (estimatedRowHeight && rowIndex >= 0) {
      const { height, ...otherStyles } = style || ({} as any);
      return (
        <Tag
          {...rest}
          ref={ref}
          className={className}
          style={measured ? style : otherStyles}
          {...(measured && eventHandlers)}
        >
          {cells}
        </Tag>
      );
    }

    return (
      <Tag {...rest} className={className} style={style} {...eventHandlers}>
        {cells}
      </Tag>
    );
  },
);

export default TableRow;
