import React, { useRef, useCallback, useMemo, useImperativeHandle } from 'react';
import cn from 'classnames';
import { FixedSizeGrid, VariableSizeGrid } from 'react-window';
import memoize from 'memoize-one';

import Header from './TableHeader';
import { getEstimatedTotalRowsHeight } from './utils';

import type { GridTableProps, GridTableHandle, TableHeaderHandle } from './types';

/**
 * A wrapper of the Grid for internal only
 */
const InnerGridTable = React.forwardRef<GridTableHandle, GridTableProps>(
  (
    {
      containerStyle,
      classPrefix,
      className,
      data,
      frozenData,
      width,
      height,
      rowHeight,
      estimatedRowHeight,
      getRowHeight,
      headerWidth,
      bodyWidth,
      useIsScrolling,
      onScroll,
      hoveredRowKey,
      overscanRowCount,
      // omit from rest
      style,
      onScrollbarPresenceChange,
      ...rest
    },
    ref,
  ) => {
    const headerRef = useRef<TableHeaderHandle | null>(null);
    const bodyRef = useRef<InstanceType<typeof FixedSizeGrid> | InstanceType<typeof VariableSizeGrid> | null>(null);
    const innerRef = useRef<HTMLElement | null>(null);

    // Memoized helpers — stable across renders
    const resetColumnWidthCache = useMemo(
      () =>
        memoize((_bodyWidth: number) => {
          if (!estimatedRowHeight) return;
          bodyRef.current && (bodyRef.current as any).resetAfterColumnIndex(0, false);
        }),
      [estimatedRowHeight],
    );

    const getEstimatedTotalRowsHeightMemo = useMemo(() => memoize(getEstimatedTotalRowsHeight), []);

    const getHeaderHeight = useCallback((): number => {
      const { headerHeight } = rest;
      if (Array.isArray(headerHeight)) {
        return headerHeight.reduce((sum: number, h: number) => sum + h, 0);
      }
      return headerHeight;
    }, [rest.headerHeight]);

    const getBodyWidth = useCallback((): number => {
      return bodyWidth;
    }, [bodyWidth]);

    const itemKey = useCallback(
      ({ rowIndex }: { rowIndex: number }) => {
        return data[rowIndex][rest.rowKey as string];
      },
      [data, rest.rowKey],
    );

    const handleItemsRendered = useCallback(
      ({ overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex }: any) => {
        rest.onRowsRendered!({
          overscanStartIndex: overscanRowStartIndex,
          overscanStopIndex: overscanRowStopIndex,
          startIndex: visibleRowStartIndex,
          stopIndex: visibleRowStopIndex,
        });
      },
      [rest.onRowsRendered],
    );

    const renderRow = useCallback(
      (args: any) => {
        const rowData = data[args.rowIndex];
        return rest.rowRenderer({ ...args, columns: rest.columns, rowData });
      },
      [data, rest.columns, rest.rowRenderer],
    );

    useImperativeHandle(ref, () => ({
      resetAfterRowIndex(rowIndex: number = 0, shouldForceUpdate?: boolean) {
        if (!estimatedRowHeight) return;
        bodyRef.current && (bodyRef.current as any).resetAfterRowIndex(rowIndex, shouldForceUpdate);
      },
      forceUpdateTable() {
        headerRef.current && headerRef.current.forceUpdate();
        bodyRef.current && bodyRef.current.forceUpdate();
      },
      scrollToPosition(args: { scrollLeft?: number; scrollTop?: number }) {
        headerRef.current && headerRef.current.scrollTo(args.scrollLeft || 0);
        bodyRef.current && bodyRef.current.scrollTo(args as any);
      },
      scrollToTop(scrollTop: number) {
        bodyRef.current && bodyRef.current.scrollTo({ scrollTop } as any);
      },
      scrollToLeft(scrollLeft: number) {
        headerRef.current && headerRef.current.scrollTo(scrollLeft);
        bodyRef.current && (bodyRef.current as any).scrollToPosition({ scrollLeft });
      },
      scrollToRow(rowIndex: number = 0, align: string = 'auto') {
        bodyRef.current && (bodyRef.current as any).scrollToItem({ rowIndex, align });
      },
      getTotalRowsHeight(): number {
        if (estimatedRowHeight) {
          return (
            (innerRef.current && innerRef.current.clientHeight) ||
            getEstimatedTotalRowsHeightMemo(data, estimatedRowHeight)
          );
        }
        return data.length * rowHeight;
      },
    }));

    const headerHeight = getHeaderHeight();
    const frozenRowCount = frozenData ? frozenData.length : 0;
    const frozenRowsHeight = rowHeight * frozenRowCount;
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    const Grid: any = estimatedRowHeight ? VariableSizeGrid : FixedSizeGrid;

    resetColumnWidthCache(bodyWidth);
    return (
      <div role="table" className={cls} {...containerProps}>
        <Grid
          {...rest}
          className={`${classPrefix}__body`}
          ref={bodyRef}
          innerRef={innerRef}
          itemKey={itemKey}
          data={data}
          frozenData={frozenData}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          rowHeight={estimatedRowHeight ? getRowHeight! : rowHeight}
          estimatedRowHeight={typeof estimatedRowHeight === 'function' ? undefined : estimatedRowHeight}
          rowCount={data.length}
          overscanRowCount={overscanRowCount}
          columnWidth={estimatedRowHeight ? getBodyWidth : bodyWidth}
          columnCount={1}
          overscanColumnCount={0}
          useIsScrolling={useIsScrolling}
          hoveredRowKey={hoveredRowKey}
          onScroll={onScroll}
          onItemsRendered={handleItemsRendered}
          children={renderRow}
        />
        {headerHeight + frozenRowsHeight > 0 && (
          <Header
            {...rest}
            className={`${classPrefix}__header`}
            ref={headerRef}
            columns={rest.columns}
            data={data}
            frozenData={frozenData}
            width={width}
            height={Math.min(headerHeight + frozenRowsHeight, height)}
            rowWidth={headerWidth}
            rowHeight={rowHeight}
            headerHeight={rest.headerHeight}
            headerRenderer={rest.headerRenderer}
            rowRenderer={rest.rowRenderer}
            hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
          />
        )}
      </div>
    );
  },
);

const GridTable = React.memo(InnerGridTable);

export default GridTable;
