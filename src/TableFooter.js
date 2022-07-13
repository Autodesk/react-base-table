import React from 'react';
import PropTypes from 'prop-types';

class TableFooter extends React.PureComponent {
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
        const { columns, footerRenderer } = this.props;
        if (height <= 0) return null;

        const style = { width: '100%', height };
        return footerRenderer({ style, columns, headerIndex: index });
    }

    renderFrozenRow(rowData, index) {
        const { columns, rowHeight, rowRenderer } = this.props;
        const style = { width: '100%', height: rowHeight };
        // for frozen row the `rowIndex` is negative
        const rowIndex = -index - 1;
        return rowRenderer({ style, columns, rowData, rowIndex });
    }

    render() {
        const { className, width, height, rowWidth, footerHeight, frozenData } = this.props;
        if (height <= 0) return null;

        const style = {
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
        this.headerRef = ref;
    }
}

TableFooter.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    footerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    rowWidth: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.array.isRequired,
    frozenData: PropTypes.array,
    footerRenderer: PropTypes.func.isRequired,
    rowRenderer: PropTypes.func.isRequired
};

export default TableFooter;
