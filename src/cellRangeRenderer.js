/**
 * Default implementation of cellRangeRenderer used by GridTable.
 * This renderer supports cell-caching while the user is scrolling.
 * Modified from https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/defaultCellRangeRenderer.js
 */
export default function cellRangeRenderer({
  cellCache,
  cellRenderer,
  columnSizeAndPositionManager,
  isScrolling,
  parent, // Table
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
  styleCache,
  verticalOffsetAdjustment,
}) {
  const renderedCells = [];

  // Browsers have native size limits for elements (eg Chrome 33M pixels, IE 1.5M pixes).
  // User cannot scroll beyond these size limitations.
  // In order to work around this, ScalingCellSizeAndPositionManager compresses offsets.
  // We should never cache styles for compressed offsets though as this can lead to bugs.
  // See issue #576 for more.
  const areOffsetsAdjusted =
    columnSizeAndPositionManager.areOffsetsAdjusted() || rowSizeAndPositionManager.areOffsetsAdjusted();

  const canCacheStyle = !isScrolling && !areOffsetsAdjusted;

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    const rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

    const columnIndex = 0;
    const columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);
    const key = `${rowIndex}-${columnIndex}`;
    let style;

    // Cache style objects so shallow-compare doesn't re-render unnecessarily.
    if (canCacheStyle && styleCache[key]) {
      style = styleCache[key];
    } else {
      style = {
        height: rowDatum.size,
        left: 0,
        position: 'absolute',
        top: rowDatum.offset + verticalOffsetAdjustment,
        width: columnDatum.size,
      };

      styleCache[key] = style;
    }

    const cellRendererParams = {
      isScrolling,
      key,
      parent,
      rowIndex,
      style,
    };

    let renderedCell;

    // Avoid re-creating cells while scrolling.
    // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
    // If a scroll is in progress- cache and reuse cells.
    // This cache will be thrown away once scrolling completes.
    // However if we are scaling scroll positions and sizes, we should also avoid caching.
    // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
    // For more info refer to issue #395
    if (isScrolling && !verticalOffsetAdjustment) {
      if (!cellCache[key]) {
        cellCache[key] = cellRenderer(cellRendererParams);
      }

      renderedCell = cellCache[key];
    } else {
      // If the user is no longer scrolling, don't cache cells.
      // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      renderedCell = cellRenderer(cellRendererParams);
    }

    if (renderedCell) {
      renderedCells.push(renderedCell);
    }
  }

  return renderedCells;
}
