import React from 'react';
import renderer from 'react-test-renderer';

import BaseTable, { IBaseTableProps } from './BaseTable';

type TRenderer = () => null;
const RENDERER: TRenderer = () => null;

const columns = [
  {
    key: 'code',
    title: 'code',
    dataKey: 'code',
    width: 50,
  },
  {
    key: 'name',
    title: 'name',
    dataKey: 'name',
    width: 50,
  },
];

const data = [
  {
    id: '1',
    code: '1',
    name: '1',
  },
  {
    id: '2',
    code: '2',
    name: '2',
  },
];

type DefaultPropsKeys = keyof typeof BaseTable.defaultProps;
interface TableProps extends Partial<typeof BaseTable.defaultProps> {}
interface MinusDefaultKeys extends Partial<Omit<IBaseTableProps<any>, DefaultPropsKeys>> {}

const Table: React.FunctionComponent<TableProps & MinusDefaultKeys> = ({
  width,
  height,
  ...restProps
}) => <BaseTable width={width} height={height} {...restProps} />;

Table.defaultProps = {
  width: 100,
  height: 100,
  data,
  columns,
};

describe('Table', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Table />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive className', () => {
    const tree = renderer.create(<Table className='custom-class' />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive style', () => {
    const tree = renderer.create(<Table style={{ color: 'red' }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive children', () => {
    const tree = renderer
      .create(
        <Table>
          <BaseTable.Column key='code' dataKey='code' width={30} />
          <BaseTable.Column key='name' dataKey='name' width={30} />
        </Table>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive empty data', () => {
    const tree = renderer.create(<Table data={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can specific a different rowKey', () => {
    const tree = renderer.create(<Table rowKey='code' />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive width', () => {
    const tree = renderer.create(<Table width={100} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive height', () => {
    const tree = renderer.create(<Table height={100} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive rowHeight', () => {
    const tree = renderer.create(<Table rowHeight={30} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive headerHeight', () => {
    const tree = renderer.create(<Table headerHeight={30} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can be set to fixed', () => {
    const tree = renderer.create(<Table fixed />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can be set to disabled', () => {
    const tree = renderer.create(<Table disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can hide the header', () => {
    const tree = renderer.create(<Table headerHeight={0} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can freeze rows', () => {
    const tree = renderer.create(<Table frozenData={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive an emptyRenderer callback', () => {
    const tree = renderer.create(<Table emptyRenderer={RENDERER} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive an headerRenderer callback', () => {
    const tree = renderer.create(<Table headerRenderer={RENDERER} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive an rowRenderer callback', () => {
    const tree = renderer.create(<Table rowRenderer={RENDERER} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive headerClassName', () => {
    const tree = renderer.create(<Table headerClassName='custom-class' />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive rowClassName', () => {
    const tree = renderer.create(<Table rowClassName='custom-class' />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive expandColumnKey', () => {
    const tree = renderer.create(<Table expandColumnKey='code' />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive defaultExpandedRowKeys', () => {
    const tree = renderer.create(<Table expandColumnKey='code' defaultExpandedRowKeys={['1']} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('table can receive expandedRowKeys', () => {
    const tree = renderer.create(<Table expandColumnKey='code' expandedRowKeys={['1']} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
