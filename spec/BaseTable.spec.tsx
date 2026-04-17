import React from 'react';
import { render } from '@testing-library/react';

import BaseTable from '../src/BaseTable';

const RENDERER = () => null;

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

const Table = (props: any) => <BaseTable width={100} height={100} data={data} columns={columns} {...props} />;

function renderSnapshot(element: React.ReactElement) {
  const { container } = render(element);
  return container.firstChild;
}

describe('Table', function () {
  test('renders correctly', () => {
    const tree = renderSnapshot(<Table />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive className', () => {
    const tree = renderSnapshot(<Table className="custom-class" />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive style', () => {
    const tree = renderSnapshot(<Table style={{ color: 'red' }} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive children', () => {
    const tree = renderSnapshot(
      <Table>
        <BaseTable.Column key="code" dataKey="code" width={30} />
        <BaseTable.Column key="name" dataKey="name" width={30} />
      </Table>,
    );
    expect(tree).toMatchSnapshot();
  });

  test('table can receive empty data', () => {
    const tree = renderSnapshot(<Table data={[]} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can specific a different rowKey', () => {
    const tree = renderSnapshot(<Table rowKey="code" />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive width', () => {
    const tree = renderSnapshot(<Table width={100} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive height', () => {
    const tree = renderSnapshot(<Table height={100} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive rowHeight', () => {
    const tree = renderSnapshot(<Table rowHeight={30} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive headerHeight', () => {
    const tree = renderSnapshot(<Table headerHeight={30} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can be set to fixed', () => {
    const tree = renderSnapshot(<Table fixed />);
    expect(tree).toMatchSnapshot();
  });

  test('table can be set to disabled', () => {
    const tree = renderSnapshot(<Table disabled />);
    expect(tree).toMatchSnapshot();
  });

  test('table can hide the header', () => {
    const tree = renderSnapshot(<Table headerHeight={0} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can freeze rows', () => {
    const tree = renderSnapshot(<Table frozenData={data} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive an emptyRenderer callback', () => {
    const tree = renderSnapshot(<Table emptyRenderer={RENDERER} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive an headerRenderer callback', () => {
    const tree = renderSnapshot(<Table headerRenderer={RENDERER} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive an rowRenderer callback', () => {
    const tree = renderSnapshot(<Table rowRenderer={RENDERER} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive headerClassName', () => {
    const tree = renderSnapshot(<Table headerClassName="custom-class" />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive rowClassName', () => {
    const tree = renderSnapshot(<Table rowClassName="custom-class" />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive expandColumnKey', () => {
    const tree = renderSnapshot(<Table expandColumnKey="code" />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive defaultExpandedRowKeys', () => {
    const tree = renderSnapshot(<Table expandColumnKey="code" defaultExpandedRowKeys={['1']} />);
    expect(tree).toMatchSnapshot();
  });

  test('table can receive expandedRowKeys', () => {
    const tree = renderSnapshot(<Table expandColumnKey="code" expandedRowKeys={['1']} />);
    expect(tree).toMatchSnapshot();
  });
});
