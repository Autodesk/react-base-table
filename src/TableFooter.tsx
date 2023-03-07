import React from 'react';

interface TableFooterProps {
    className?: string;
    width: number;
    height: number;
    footerHeight: number | any[];
    rowWidth: number;
    rowHeight: number;
    columns: any[];
    data: any[];
    frozenData?: any[];
    headerRenderer?: any;
    rowRenderer: any;
    hoveredRowKey?: any;
}
interface TableFooterState {}

class TableFooter extends React.PureComponent<TableFooterProps, TableFooterState> {
    footerRef: any = null;
    constructor(props) {
        super(props);

        this.renderFrozenRow = this.renderFrozenRow.bind(this);
        this._setRef = this._setRef.bind(this);
    }

    scrollTo(offset) {
        requestAnimationFrame(() => {
            if (this.footerRef) this.footerRef.scrollLeft = offset;
        });
    }

    renderFrozenRow(rowData, index) {
        const { columns, rowHeight, rowRenderer } = this.props;
        const style = { width: '100%', height: rowHeight };
        // for frozen row the `rowIndex` is negative
        const rowIndex = -index - 1;
        return rowRenderer({ style, columns, rowData, rowIndex });
    }

    render() {
        const { className, width, height, rowWidth, frozenData } = this.props;
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

        // const rowHeights = Array.isArray(footerHeight) ? footerHeight : [footerHeight];
        return (
            <div role="grid" ref={this._setRef} className={className} style={style}>
                <div role="rowgroup" style={innerStyle}>
                    {frozenData.map(this.renderFrozenRow)}
                </div>
            </div>
        );
    }

    _setRef(ref) {
        this.footerRef = ref;
    }
}

// TableFooter.propTypes = {
//     className: PropTypes.string,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//     footerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
//     rowWidth: PropTypes.number.isRequired,
//     rowHeight: PropTypes.number.isRequired,
//     columns: PropTypes.arrayOf(PropTypes.object).isRequired,
//     data: PropTypes.array.isRequired,
//     frozenData: PropTypes.array,
//     rowRenderer: PropTypes.func.isRequired
// };

export default TableFooter;
