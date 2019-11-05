import { FrozenDirection, ColumnProps } from './Column';
import { RowKey } from './TableRow';

type ManagedColumn = Partial<ColumnProps> & { key: RowKey };

export default class ColumnManager {
  public static readonly PlaceholderKey = '__placeholder__';

  private _origColumns: ManagedColumn[];
  private _cached: any;
  private _columns: ManagedColumn[] = [];
  private _fixed: any;
  private _columnStyles: any;

  constructor(columns: any, fixed?: boolean) {
    this._origColumns = [];
    this.reset(columns, fixed);
  }

  _cache(key: string, fn: any) {
    if (key in this._cached) return this._cached[key];
    this._cached[key] = fn();
    return this._cached[key];
  }

  reset(columns: any[], fixed: boolean | undefined) {
    this._columns = columns.map<ManagedColumn>(column => {
      let width = column.width;
      if (column.resizable) {
        // don't reset column's `width` if `width` prop doesn't change
        const idx = this._origColumns.findIndex((x: { key: any }) => x.key === column.key);
        if (idx >= 0 && this._origColumns[idx].width === column.width) {
          width = this._columns[idx].width;
        }
      }
      return { ...column, width };
    });
    this._origColumns = columns;
    this._fixed = fixed;
    this._cached = {};
    this._columnStyles = this.recomputeColumnStyles();
  }

  resetCache() {
    this._cached = {};
  }

  getOriginalColumns() {
    return this._origColumns;
  }

  getColumns() {
    return this._columns;
  }

  getVisibleColumns() {
    return this._cache('visibleColumns', () => {
      return this._columns.filter(column => !column.hidden);
    });
  }

  hasFrozenColumns() {
    return this._cache('hasFrozenColumns', () => {
      return this._fixed && this.getVisibleColumns().some((column: { frozen: any }) => !!column.frozen);
    });
  }

  hasLeftFrozenColumns() {
    return this._cache('hasLeftFrozenColumns', () => {
      return (
        this._fixed &&
        this.getVisibleColumns().some(
          (column: { frozen: string | boolean }) => column.frozen === FrozenDirection.LEFT || column.frozen === true
        )
      );
    });
  }

  hasRightFrozenColumns() {
    return this._cache('hasRightFrozenColumns', () => {
      return (
        this._fixed &&
        this.getVisibleColumns().some((column: { frozen: string }) => column.frozen === FrozenDirection.RIGHT)
      );
    });
  }

  getMainColumns() {
    return this._cache('mainColumns', () => {
      const columns = this.getVisibleColumns();
      if (!this.hasFrozenColumns()) return columns;

      const mainColumns: any[] = [];
      this.getLeftFrozenColumns().forEach((column: any) => {
        //columns placeholder for the fixed table above them
        mainColumns.push({ ...column, [ColumnManager.PlaceholderKey]: true });
      });
      this.getVisibleColumns().forEach((column: { frozen: any }) => {
        if (!column.frozen) mainColumns.push(column);
      });
      this.getRightFrozenColumns().forEach((column: any) => {
        mainColumns.push({ ...column, [ColumnManager.PlaceholderKey]: true });
      });

      return mainColumns;
    });
  }

  getLeftFrozenColumns() {
    return this._cache('leftFrozenColumns', () => {
      if (!this._fixed) return [];
      return this.getVisibleColumns().filter(
        (column: { frozen: string | boolean }) => column.frozen === FrozenDirection.LEFT || column.frozen === true
      );
    });
  }

  getRightFrozenColumns() {
    return this._cache('rightFrozenColumns', () => {
      if (!this._fixed) return [];
      return this.getVisibleColumns().filter((column: { frozen: string }) => column.frozen === FrozenDirection.RIGHT);
    });
  }

  getColumn(key: null) {
    const idx = this._columns.findIndex((column: { key: any }) => column.key === key);
    return this._columns[idx];
  }

  getColumnsWidth() {
    return this._cache('columnsWidth', () => {
      return this.recomputeColumnsWidth(this.getVisibleColumns());
    });
  }

  getLeftFrozenColumnsWidth() {
    return this._cache('leftFrozenColumnsWidth', () => {
      return this.recomputeColumnsWidth(this.getLeftFrozenColumns());
    });
  }

  getRightFrozenColumnsWidth() {
    return this._cache('rightFrozenColumnsWidth', () => {
      return this.recomputeColumnsWidth(this.getRightFrozenColumns());
    });
  }

  recomputeColumnsWidth(columns: any[]) {
    return columns.reduce((width: any, column: { width: any }) => width + column.width, 0);
  }

  setColumnWidth(key: any, width: any) {
    const column = this.getColumn(key);
    column.width = width;
    this._cached = {};
    this._columnStyles[column.key] = this.recomputeColumnStyle(column);
  }

  getColumnStyle(key: string | number) {
    return this._columnStyles[key];
  }

  getColumnStyles() {
    return this._columnStyles;
  }

  recomputeColumnStyle(column: ManagedColumn) {
    let flexGrow = 0;
    let flexShrink = 0;
    if (!this._fixed) {
      flexGrow = typeof column.flexGrow === 'number' ? column.flexGrow : 0;
      flexShrink = typeof column.flexShrink === 'number' ? column.flexShrink : 1;
    }
    // workaround for Flex bug on IE: https://github.com/philipwalton/flexbugs#flexbug-7
    const flexValue = `${flexGrow} ${flexShrink} auto`;

    const style: React.CSSProperties = {
      ...column.style,
      flex: flexValue,
      msFlex: flexValue,
      WebkitFlex: flexValue,
      width: column.width,
      overflow: 'hidden',
    };

    if (!this._fixed && column.maxWidth) {
      style.maxWidth = column.maxWidth;
    }
    if (!this._fixed && column.minWidth) {
      style.minWidth = column.minWidth;
    }

    return style;
  }

  recomputeColumnStyles() {
    return this._columns.reduce((styles: { [x: string]: any }, column: { key: string | number }) => {
      styles[column.key] = this.recomputeColumnStyle(column);
      return styles;
    }, {});
  }
}
