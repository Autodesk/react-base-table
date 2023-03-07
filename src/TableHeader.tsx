import React from 'react';

interface TableHeaderProps {
    className?: string;
    width: number;
    height: number;
    headerHeight: number | any[];
    rowWidth: number;
    rowHeight: number;
    columns: any[];
    data: any[];
    frozenData?: any[];
    headerRenderer?: any;
    rowRenderer: any;
    hoveredRowKey?: any;
}
interface TableHeaderState {}

class TableHeader extends React.PureComponent<TableHeaderProps, TableHeaderState> {
    headerRef: any = null;
    constructor(props) {
        super(props);

        this.renderHeaderRow = this.renderHeaderRow.bind(this);
        this.renderFrozenRow = this.renderFrozenRow.bind(this);
        this._setRef = this._setRef.bind(this);
    }

    scrollTo(offset) {
        requestAnimationFrame(() => {
            if (this.headerRef) this.headerRef.scrollLeft = offset;
        });
    }

    renderHeaderRow(height, index) {
        const { columns, headerRenderer } = this.props;
        if (height <= 0) return null;

        const style = { width: '100%', height };
        return headerRenderer({ style, columns, headerIndex: index });
    }

    renderFrozenRow(rowData, index) {
        const { columns, rowHeight, rowRenderer } = this.props;
        const style = { width: '100%', height: rowHeight };
        // for frozen row the `rowIndex` is negative
        const rowIndex = -index - 1;
        return rowRenderer({ style, columns, rowData, rowIndex });
    }

    render() {
        const { className, width, height, rowWidth, headerHeight, frozenData } = this.props;
        if (height <= 0) return null;

        const style: React.CSSProperties = {
            width,
            height: height,
            position: 'relative',
            overflow: 'hidden'
        };

        const innerStyle = {
            width: rowWidth,
            height
        };

        const rowHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
        return (
            <div role="grid" ref={this._setRef} className={className} style={style}>
                <div role="rowgroup" style={innerStyle}>
                    {rowHeights.filter(item => item.width !== 0).map(this.renderHeaderRow)}
                    {frozenData.filter(item => item.width !== 0).map(this.renderFrozenRow)}
                </div>
            </div>
        );
    }

    _setRef(ref) {
        this.headerRef = ref;
    }
}

export default TableHeader;
