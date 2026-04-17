import { FrozenDirection } from './Column';

import type { ColumnShape } from './types';

export default class ColumnManager {
  static PlaceholderKey = '__placeholder__';

  _origColumns: ColumnShape[];
  _columns: ColumnShape[];
  _fixed: boolean;
  _cached: Record<string, any>;
  _columnStyles: Record<string, React.CSSProperties>;

  constructor(columns: ColumnShape[], fixed: boolean) {
    this._origColumns = [];
    this._columns = [];
    this._fixed = false;
    this._cached = {};
    this._columnStyles = {};
    this.reset(columns, fixed);
  }

  _cache<T>(key: string, fn: () => T): T {
    if (key in this._cached) return this._cached[key];
    this._cached[key] = fn();
    return this._cached[key];
  }

  reset(columns: ColumnShape[], fixed: boolean): void {
    this._columns = columns.map((column) => {
      let width = column.width;
      if (column.resizable) {
        const idx = this._origColumns.findIndex((x) => x.key === column.key);
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

  resetCache(): void {
    this._cached = {};
  }

  getOriginalColumns(): ColumnShape[] {
    return this._origColumns;
  }

  getColumns(): ColumnShape[] {
    return this._columns;
  }

  getVisibleColumns(): ColumnShape[] {
    return this._cache('visibleColumns', () => {
      return this._columns.filter((column) => !column.hidden);
    });
  }

  hasFrozenColumns(): boolean {
    return this._cache('hasFrozenColumns', () => {
      return this._fixed && this.getVisibleColumns().some((column) => !!column.frozen);
    });
  }

  hasLeftFrozenColumns(): boolean {
    return this._cache('hasLeftFrozenColumns', () => {
      return (
        this._fixed &&
        this.getVisibleColumns().some((column) => column.frozen === FrozenDirection.LEFT || column.frozen === true)
      );
    });
  }

  hasRightFrozenColumns(): boolean {
    return this._cache('hasRightFrozenColumns', () => {
      return this._fixed && this.getVisibleColumns().some((column) => column.frozen === FrozenDirection.RIGHT);
    });
  }

  getMainColumns(): ColumnShape[] {
    return this._cache('mainColumns', () => {
      const columns = this.getVisibleColumns();
      if (!this.hasFrozenColumns()) return columns;

      const mainColumns: ColumnShape[] = [];
      this.getLeftFrozenColumns().forEach((column) => {
        mainColumns.push({ ...column, [ColumnManager.PlaceholderKey]: true });
      });
      this.getVisibleColumns().forEach((column) => {
        if (!column.frozen) mainColumns.push(column);
      });
      this.getRightFrozenColumns().forEach((column) => {
        mainColumns.push({ ...column, [ColumnManager.PlaceholderKey]: true });
      });

      return mainColumns;
    });
  }

  getLeftFrozenColumns(): ColumnShape[] {
    return this._cache('leftFrozenColumns', () => {
      if (!this._fixed) return [];
      return this.getVisibleColumns().filter(
        (column) => column.frozen === FrozenDirection.LEFT || column.frozen === true,
      );
    });
  }

  getRightFrozenColumns(): ColumnShape[] {
    return this._cache('rightFrozenColumns', () => {
      if (!this._fixed) return [];
      return this.getVisibleColumns().filter((column) => column.frozen === FrozenDirection.RIGHT);
    });
  }

  getColumn(key: string): ColumnShape {
    const idx = this._columns.findIndex((column) => column.key === key);
    return this._columns[idx];
  }

  getColumnsWidth(): number {
    return this._cache('columnsWidth', () => {
      return this.recomputeColumnsWidth(this.getVisibleColumns());
    });
  }

  getLeftFrozenColumnsWidth(): number {
    return this._cache('leftFrozenColumnsWidth', () => {
      return this.recomputeColumnsWidth(this.getLeftFrozenColumns());
    });
  }

  getRightFrozenColumnsWidth(): number {
    return this._cache('rightFrozenColumnsWidth', () => {
      return this.recomputeColumnsWidth(this.getRightFrozenColumns());
    });
  }

  recomputeColumnsWidth(columns: ColumnShape[]): number {
    return columns.reduce((width, column) => width + column.width, 0);
  }

  setColumnWidth(key: string, width: number): void {
    const column = this.getColumn(key);
    column.width = width;
    this._cached = {};
    this._columnStyles[column.key] = this.recomputeColumnStyle(column);
  }

  getColumnStyle(key: string): React.CSSProperties {
    return this._columnStyles[key];
  }

  getColumnStyles(): Record<string, React.CSSProperties> {
    return this._columnStyles;
  }

  recomputeColumnStyle(column: ColumnShape): React.CSSProperties {
    let flexGrow = 0;
    let flexShrink = 0;
    if (!this._fixed) {
      flexGrow = typeof column.flexGrow === 'number' ? column.flexGrow : 0;
      flexShrink = typeof column.flexShrink === 'number' ? column.flexShrink : 1;
    }
    // workaround for Flex bug on IE: https://github.com/philipwalton/flexbugs#flexbug-7
    const flexValue = `${flexGrow} ${flexShrink} auto`;

    const style: any = {
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

  recomputeColumnStyles(): Record<string, React.CSSProperties> {
    return this._columns.reduce(
      (styles, column) => {
        styles[column.key] = this.recomputeColumnStyle(column);
        return styles;
      },
      {} as Record<string, React.CSSProperties>,
    );
  }
}
