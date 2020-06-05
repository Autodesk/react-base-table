import React from 'react';
import TableRow from './TableRow';
import { RowSizeContext } from './GridTable';
import PropTypes from 'prop-types';

class DynamicTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const height = this.ref.current.getBoundingClientRect().height;
    this.setSizeMap(this.props.rowIndex, height);
  }
  render() {
    return (
      <RowSizeContext.Consumer>
        {({ setSizeMap }) => {
          this.setSizeMap = setSizeMap;
          return <TableRow {...this.props} />;
        }}
      </RowSizeContext.Consumer>
    );
  }
}

DynamicTableRow.propTypes = {
  rowIndex: PropTypes.number.isRequired,
};

export default DynamicTableRow;
