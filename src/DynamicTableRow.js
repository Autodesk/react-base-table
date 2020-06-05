import React from 'react';
import TableRow from './TableRow';
import { RowSizeContext } from './GridTable';
import PropTypes from 'prop-types';

class DynamicTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef({});
  }

  componentDidMount() {
    if (this.ref && this.setSizeMap) {
      const height = this.ref.current.getBoundingClientRect().height;
      // console.log('dynamic row height', height);
      this.setSizeMap(this.props.rowIndex, height);
    }
  }
  render() {
    // console.log('this.rowProps', this.props);
    return (
      <RowSizeContext.Consumer>
        {({ setSizeMap }) => {
          this.setSizeMap = setSizeMap;
          return <TableRow {...this.props} innerRef={this.ref} />;
        }}
      </RowSizeContext.Consumer>
    );
  }
}

DynamicTableRow.propTypes = {
  rowIndex: PropTypes.number.isRequired,
};

export default DynamicTableRow;
