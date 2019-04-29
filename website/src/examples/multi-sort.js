const columns = generateColumns(10)
const data = generateData(columns, 200)

const GlobalStyle = createGlobalStyle`
  .BaseTable__header-cell {
    &.header-sort {
      &-asc {
        .BaseTable__sort-indicator {
          display: block;
        }
      }

      &-desc {
        .BaseTable__sort-indicator {
          display: block;
          transform: rotate(180deg);
        }
      }
    }
  }
`

const sortState = {
  'column-0': 'asc',
  'column-1': 'desc',
  'column-2': 'asc',
}

export default () => (
  <>
    <GlobalStyle />
    <Table fixed data={data}>
      {columns.map(column => (
        <Column
          {...column}
          sortable
          headerClassName={`header-sort-${sortState[column.key] || 'none'}`}
        />
      ))}
    </Table>
  </>
)
