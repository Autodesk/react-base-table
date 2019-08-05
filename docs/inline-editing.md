# Inline Editing

`Inline Editing` is a very common feature in a table, but it's highly coupled with specific ui libraries, so it won't be a part of `BaseTable` itself.

## The Problem

`Inline Editing` would be a bit tricky in `BaseTable` because of it's using the virtualization technology to render the rows, there is `overflow: hidden` for the table and rows and cells, so if your editing content is larger than the cell area, the content would be cut, you genius would find that you could override the `overflow: hidden` via style to prevent the content to be clipped, but **PLEASE DON'T DO THAT**, as there would be always problems with this solution, e.g. what would happens if it's in the last row?

## How

The recommended solution is using something like `Portal` to render the editing content out of the cell, then it won't be constrained in the cell. As `Portal` needs a container to attach the target to, most of the custom renderers provide a param `container` to be used in this case, the `container` is the table itself.

Internally we are using the `Overlay` component from [react-overlays](https://github.com/react-bootstrap/react-overlays) to do that, `react-overlays` is based on [Popper.js](https://github.com/FezVrasta/popper.js) which provides excellent positioning mechanism.

If you are using fixed mode(fixed=true) with frozen columns, there will be a problem with the `Popper.js`. As the default `boundariesElement` for `preventOverflow` is `scrollParent`, but there would be three tables internal tables to implement the frozen feature, and those tables are all scrollable, then the positioning could be not expected, you could change the `boundariesElement` to `viewport` or the `container` to fix that.

## API Design

`Column.editable: object | fun({ cellData, column, columnIndex, rowData, rowIndex })`

You can use `callOrReturn` exported from this package to get the result, the result could be a `boolean` to indicate the specific cell is editable or not, or an object which include the options like `{ disabled, ...editorProps }`, the result would be used in your custom `TableCell` component.

## Recipe

_The following is really a rough one, will improve it later_

```jsx
// import { Overlay } from 'react-overlays'
const { Overlay } = ReactOverlays;

const CellContainer = styled.div`
  display: flex;
  flex: 1 0 100%;
  align-items: center;
  height: 100%;
  overflow: hidden;
  margin: 0 -5px;
  padding: 5px;
  border: 1px dashed transparent;
`;

const GlobalStyle = createGlobalStyle`
  .BaseTable__row:hover,
  .BaseTable__row--hover {
    ${CellContainer} {
      border: 1px dashed #ccc;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  height: 30px;
  margin-top: 10px;
`;

class EditableCell extends React.PureComponent {
  state = {
    value: this.props.cellData,
    editing: false,
  };

  setTargetRef = ref => (this.targetRef = ref);

  getTargetRef = () => this.targetRef;

  handleClick = () => this.setState({ editing: true });

  handleHide = () => this.setState({ editing: false });

  handleChange = e =>
    this.setState({
      value: e.target.value,
      editing: false,
    });

  render() {
    const { container, rowIndex, columnIndex } = this.props;
    const { value, editing } = this.state;

    return (
      <CellContainer ref={this.setTargetRef} onClick={this.handleClick}>
        {!editing && value}
        {editing && this.targetRef && (
          <Overlay show flip rootClose container={container} target={this.getTargetRef} onHide={this.handleHide}>
            {({ props, placement }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  width: this.targetRef.offsetWidth,
                  top: placement === 'top' ? this.targetRef.offsetHeight : -this.targetRef.offsetHeight,
                }}
              >
                <Select value={value} onChange={this.handleChange}>
                  <option value="grapefruit">Grapefruit</option>
                  <option value="lime">Lime</option>
                  <option value="coconut">Coconut</option>
                  <option value="mango">Mango</option>
                </Select>
              </div>
            )}
          </Overlay>
        )}
      </CellContainer>
    );
  }
}

const columns = generateColumns(5);
const data = generateData(columns, 100);

columns[0].cellRenderer = EditableCell;
columns[0].width = 300;

export default () => (
  <>
    <GlobalStyle />
    <Table fixed columns={columns} data={data} />
  </>
);
```

## Example

Check the live example [here](https://autodesk.github.io/react-base-table/examples/inline-editing).
