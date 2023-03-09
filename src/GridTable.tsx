import React from 'react';
import cn from 'classnames';
import { FixedSizeGrid, VariableSizeGrid } from 'react-window';
import memoize from 'memoize-one';

import Header from './TableHeader';
import Footer from './TableFooter';
import { getEstimatedTotalRowsHeight, getRowKey } from './utils';

interface GridTableProps {
    estimatedRowHeight: any;
    data: any[];
    rowHeight: number;
    columns: any[];
    rowRenderer?: any;
    containerStyle?: React.CSSProperties;
    classPrefix?: string;
    className?: string;
    frozenData?: any[];
    frozenFooterData?: any[];
    width?: number;
    height?: number;
    getRowHeight?: (params: any) => number;
    headerWidth?: number;
    headerHeight?: number | number[];
    bodyWidth?: number;
    useIsScrolling?: boolean;
    onScroll?: any;
    hoveredRowKey?: string;
    overScanRowCount?: number;
    // omit from rest
    style?: React.CSSProperties;
    onScrollbarPresenceChange?: any;
    headerRenderer?: any;
    rowKey?: any;
    onRowsRendered?: any;
}

interface GridTableState {}

/**
 * A wrapper of the Grid for internal only
 */
class GridTable extends React.PureComponent<GridTableProps, GridTableState> {
    private _resetColumnWidthCache: (bodyWidth: any) => void;
    bodyRef: any;
    private _getEstimatedTotalRowsHeight: (data: any, estimatedRowHeight: any) => any;
    headerRef: any;
    footerRef: any;
    innerRef: any;
    constructor(props) {
        super(props);
        this._setHeaderRef = this._setHeaderRef.bind(this);
        this._setFooterRef = this._setFooterRef.bind(this);
        this._setBodyRef = this._setBodyRef.bind(this);
        this._setInnerRef = this._setInnerRef.bind(this);
        this._itemKey = this._itemKey.bind(this);
        this._getBodyWidth = this._getBodyWidth.bind(this);
        this._handleItemsRendered = this._handleItemsRendered.bind(this);
        this._resetColumnWidthCache = memoize(bodyWidth => {
            if (!this.props.estimatedRowHeight) return;
            this.bodyRef && this.bodyRef.resetAfterColumnIndex(0, false);
        });
        this._getEstimatedTotalRowsHeight = memoize(getEstimatedTotalRowsHeight);

        this.renderRow = this.renderRow.bind(this);
    }

    resetAfterRowIndex(rowIndex = 0, shouldForceUpdate) {
        if (!this.props.estimatedRowHeight) return;
        this.bodyRef && this.bodyRef.resetAfterRowIndex(rowIndex, shouldForceUpdate);
    }

    forceUpdateTable() {
        this.headerRef && this.headerRef.forceUpdate();
        this.footerRef && this.footerRef.forceUpdate();
        this.bodyRef && this.bodyRef.forceUpdate();
    }

    scrollToPosition(args) {
        this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
        this.footerRef && this.footerRef.scrollTo(args.scrollLeft);
        this.bodyRef && this.bodyRef.scrollTo(args);
    }

    scrollToTop(scrollTop) {
        this.bodyRef && this.bodyRef.scrollTo({ scrollTop });
    }

    scrollToLeft(scrollLeft) {
        this.headerRef && this.headerRef.scrollTo(scrollLeft);
        this.footerRef && this.footerRef.scrollTo(scrollLeft);
        this.bodyRef && this.bodyRef.scrollToPosition({ scrollLeft });
    }

    scrollToRow(rowIndex = 0, align = 'auto') {
        this.bodyRef && this.bodyRef.scrollToItem({ rowIndex, align });
    }

    getTotalRowsHeight() {
        const { data, rowHeight, estimatedRowHeight } = this.props;

        if (estimatedRowHeight) {
            return (
                (this.innerRef && this.innerRef.clientHeight) ||
                this._getEstimatedTotalRowsHeight(data, estimatedRowHeight)
            );
        }
        return data.length * rowHeight;
    }

    renderRow(args) {
        const { data, columns, rowRenderer } = this.props;
        const rowData = data[args.rowIndex];
        return rowRenderer({ ...args, columns, rowData });
    }

    render() {
        const {
            containerStyle,
            classPrefix,
            className,
            data,
            frozenData,
            frozenFooterData,
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
            overScanRowCount,
            // omit from rest
            style,
            onScrollbarPresenceChange,
            ...rest
        } = this.props;
        const headerHeight = this._getHeaderHeight();
        const frozenRowCount = frozenData.length;
        const frozenRowsHeight = rowHeight * frozenRowCount;
        const frozenFooterRowCount = frozenFooterData.length || 0;
        const frozenFooterRowsHeight = rowHeight * frozenFooterRowCount;
        const cls = cn(`${classPrefix}__table`, className);
        const containerProps = containerStyle ? { style: containerStyle } : null;
        const Grid = estimatedRowHeight ? VariableSizeGrid : FixedSizeGrid;

        this._resetColumnWidthCache(bodyWidth);
        // console.log(
        //     'frozenFooterRowsHeight > 0 && frozenFooterRowCount > 0',
        //     frozenFooterRowsHeight > 0 && frozenFooterRowCount > 0
        // );
        return (
            <div role="table" className={cls} {...containerProps}>
                {frozenFooterRowsHeight > 0 && frozenFooterRowCount > 0 && (
                    <Footer
                        {...rest}
                        className={`${classPrefix}__footer`}
                        ref={this._setFooterRef}
                        data={data}
                        frozenData={frozenFooterData}
                        width={width}
                        height={frozenFooterRowsHeight}
                        rowWidth={headerWidth}
                        rowHeight={rowHeight}
                        footerHeight={this.props.headerHeight}
                        rowRenderer={this.props.rowRenderer}
                        hoveredRowKey={frozenFooterRowCount > 0 ? hoveredRowKey : null}
                    />
                )}
                <Grid
                    {...rest}
                    className={`${classPrefix}__body`}
                    ref={this._setBodyRef}
                    innerRef={this._setInnerRef}
                    itemKey={this._itemKey}
                    data={data}
                    frozenData={frozenData}
                    width={width}
                    height={Math.max(height - headerHeight - frozenRowsHeight - frozenFooterRowsHeight, 0)}
                    rowHeight={estimatedRowHeight ? getRowHeight : rowHeight}
                    estimatedRowHeight={typeof estimatedRowHeight === 'function' ? undefined : estimatedRowHeight}
                    rowCount={data.length}
                    overScanRowCount={overScanRowCount}
                    columnWidth={estimatedRowHeight ? this._getBodyWidth : bodyWidth}
                    columnCount={1}
                    overscanColumnCount={0}
                    useIsScrolling={useIsScrolling}
                    hoveredRowKey={hoveredRowKey}
                    onScroll={onScroll}
                    onItemsRendered={this._handleItemsRendered}
                    children={this.renderRow}
                />
                {headerHeight + frozenRowsHeight > 0 && (
                    // put header after body and reverse the display order via css
                    // to prevent header's shadow being covered by body
                    <Header
                        {...rest}
                        className={`${classPrefix}__header`}
                        ref={this._setHeaderRef}
                        data={data}
                        frozenData={frozenData}
                        width={width}
                        height={Math.min(headerHeight + frozenRowsHeight, height)}
                        rowWidth={headerWidth}
                        rowHeight={rowHeight}
                        headerHeight={this.props.headerHeight}
                        headerRenderer={this.props.headerRenderer}
                        rowRenderer={this.props.rowRenderer}
                        hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
                    />
                )}
            </div>
        );
    }

    _setHeaderRef(ref) {
        this.headerRef = ref;
    }
    _setFooterRef(ref) {
        this.footerRef = ref;
    }

    _setBodyRef(ref) {
        this.bodyRef = ref;
    }

    _setInnerRef(ref) {
        this.innerRef = ref;
    }

    _itemKey({ rowIndex }) {
        const { data } = this.props;
        const rowKey = getRowKey({
            rowData: data[rowIndex],
            rowIndex,
            rowKey: this.props.rowKey
        });
        return rowKey;
    }

    _getHeaderHeight() {
        const { headerHeight } = this.props;
        if (Array.isArray(headerHeight)) {
            return headerHeight.reduce((sum, height) => sum + height, 0);
        }
        return headerHeight;
    }

    _getBodyWidth() {
        return this.props.bodyWidth;
    }

    _handleItemsRendered({ overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex }) {
        this.props.onRowsRendered({
            overscanStartIndex: overscanRowStartIndex,
            overScanStopIndex: overscanRowStopIndex,
            startIndex: visibleRowStartIndex,
            stopIndex: visibleRowStopIndex
        });
    }
}

export default GridTable;