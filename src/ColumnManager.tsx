import { FrozenDirection, IColumnProps } from './Column';
type anyFunction<T> = (...args: any[]) => T;
interface ICache {
  mainColumns?: IColumnProps[];
  visibleColumns?: IColumnProps[];
  hasFrozenColumns?: boolean;
  hasLeftFrozenColumns?: boolean;
  hasRightFrozenColumns?: boolean;
  leftFrozenColumns?: IColumnProps[];
  rightFrozenColumns?: IColumnProps[];  
  columnsWidth?: number;
  leftFrozenColumnsWidth?: number;
  rightFrozenColumnsWidth?: number;
}

export default class ColumnManager {

  private _cached: ICache = {};
  private _columns: IColumnProps[];
  private _origColumns: IColumnProps[];
  private _fixed: boolean;
  private _columnStyles: {[key: string]: React.CSSProperties};
  
  constructor(columns: IColumnProps[], fixed: boolean) {
    this._origColumns = [];
    this.reset(columns, fixed);
  }

  private _cache<K extends keyof ICache>(key: K, fn: anyFunction<ICache[K]>) {
    if (key in this._cached) return this._cached[key];
    this._cached[key] = fn();
    return this._cached[key];
  }

  public reset(columns: IColumnProps[], fixed: boolean) {
    this._columns = columns.map(column => {
      let width = column.width;
      if (column.resizable) {
        // don't reset column's `width` if `width` prop doesn't change
        const idx = this._origColumns.findIndex(x => x.key === column.key);
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

  public resetCache() {
    this._cached = {};
  }

  public getOriginalColumns() {
    return this._origColumns;
  }

  public getColumns() {
    return this._columns;
  }

  getVisibleColumns() {
    return this._cache('visibleColumns', () => {
      return this._columns.filter(column => !column.hidden);
    });
  }

  hasFrozenColumns() {
    return this._cache('hasFrozenColumns', () => {
      return this._fixed && this.getVisibleColumns().some((column: IColumnProps) => !!column.frozen);
    });
  }

  hasLeftFrozenColumns() {
    return this._cache('hasLeftFrozenColumns', () => {
      return (
        this._fixed &&
        this.getVisibleColumns().some((column: IColumnProps) => column.frozen === FrozenDirection.LEFT || column.frozen === true)
      );
    });
  }

  hasRightFrozenColumns() {
    return this._cache('hasRightFrozenColumns', () => {
      return this._fixed && this.getVisibleColumns().some((column: IColumnProps) => column.frozen === FrozenDirection.RIGHT);
    });
  }

  getMainColumns() {
    return this._cache('mainColumns', () => {
      const columns = this.getVisibleColumns();
      if (!this.hasFrozenColumns()) return columns;

      const mainColumns: IColumnProps[] = [];
      this.getLeftFrozenColumns().forEach((column: IColumnProps) => {
        //columns placeholder for the fixed table above them
        
        mainColumns.push({ ...column, [ColumnManager.PlaceholderKey]: true });
      });
      this.getVisibleColumns().forEach((column: IColumnProps) => {
        if (!column.frozen) mainColumns.push(column);
      });
      this.getRightFrozenColumns().forEach((column: IColumnProps) => {
        mainColumns.push({ ...column, [ColumnManager.PlaceholderKey]: true });
      });

      return mainColumns;
    });
  }

  getLeftFrozenColumns() {
    return this._cache('leftFrozenColumns', () => {
      if (!this._fixed) return [];
      return this.getVisibleColumns().filter(
        (column: IColumnProps) => column.frozen === FrozenDirection.LEFT || column.frozen === true
      );
    });
  }

  getRightFrozenColumns() {
    return this._cache('rightFrozenColumns', () => {
      if (!this._fixed) return [];
      return this.getVisibleColumns().filter((column: IColumnProps) => column.frozen === FrozenDirection.RIGHT);
    });
  }

  getColumn(key: IColumnProps['key']) {
    const idx = this._columns.findIndex(column => column.key === key);
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

  recomputeColumnsWidth(columns: IColumnProps[]) {
    return columns.reduce((width, column) => width + column.width, 0);
  }

  setColumnWidth(key: IColumnProps['key'], width: number) {
    const column = this.getColumn(key);
    column.width = width;
    this._cached = {};
    this._columnStyles[column.key] = this.recomputeColumnStyle(column);
  }

  getColumnStyle(key: React.Key) {
    return this._columnStyles[key];
  }

  getColumnStyles() {
    return this._columnStyles;
  }

  public recomputeColumnStyle(column: IColumnProps): React.CSSProperties {
    let flexGrow = 0;
    let flexShrink = 0;
    if (!this._fixed) {
      flexGrow = typeof column.flexGrow === 'number' ? column.flexGrow : 0;
      flexShrink = typeof column.flexShrink === 'number' ? column.flexShrink : 1;
    }
    // workaround for Flex bug on IE: https://github.com/philipwalton/flexbugs#flexbug-7
    const flexValue = `${flexGrow} ${flexShrink} auto`;

    const style = {
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

  recomputeColumnStyles(): {[key: string]: React.CSSProperties} {
    return this._columns.reduce((styles, column) => {
      styles[column.key] = this.recomputeColumnStyle(column);
      return styles;
    }, {} as {[key: string]: React.CSSProperties});
  }

  static PlaceholderKey: '__placeholder__' = '__placeholder__';
}


