const columns = generateColumns(10)
const data = generateData(columns, 200)

const Container = styled.div`
  width: calc(50vw + 220px);
  height: 50vh;
`

const Hint = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #336699;
  margin-bottom: 10px;
`

export default () => (
  <>
    <Hint>Resize your browser and see</Hint>
    <Container>
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable
            width={width}
            height={height}
            columns={columns}
            data={data}
          />
        )}
      </AutoResizer>
    </Container>
  </>
)
