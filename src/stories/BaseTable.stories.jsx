import React from 'react';
import BaseTable from '../BaseTable';
import '../../styles.css';

const generateColumns = (count = 10, prefix = 'column-', props) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }));

const generateData = (columns, count = 200, prefix = 'row-') =>
  new Array(count).fill(0).map((row, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    );
  });

const columns = generateColumns(10);
const data = generateData(columns);

export default {
  title: 'BaseTable',
  component: BaseTable,
};

const Template = args => <BaseTable {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  height: 1000,
  width: 1000,
  fixed: true,
  columns,
  data,
};
