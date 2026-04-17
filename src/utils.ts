import React from 'react';

import type { ColumnShape, RowData } from './types';

export function renderElement(
  renderer: React.ReactElement | React.ComponentType<any> | null | undefined,
  props?: Record<string, any>,
): React.ReactNode {
  if (React.isValidElement(renderer)) {
    if (!props) return renderer;
    return React.cloneElement(renderer, props);
  } else if (typeof renderer === 'function') {
    if ((renderer as any).prototype && (renderer as any).prototype.isReactComponent) {
      return React.createElement(renderer as React.ComponentType<any>, props);
    } else if ((renderer as any).defaultProps) {
      return (renderer as Function)({ ...(renderer as any).defaultProps, ...props });
    }
    return (renderer as Function)(props);
  } else {
    return null;
  }
}

export function normalizeColumns(elements: React.ReactNode): ColumnShape[] {
  const columns: ColumnShape[] = [];
  React.Children.forEach(elements, (element) => {
    if (React.isValidElement(element) && element.key) {
      const column = { ...(element.props as Record<string, any>), key: element.key } as ColumnShape;
      columns.push(column);
    }
  });
  return columns;
}

export function isObjectEqual(objA: any, objB: any, ignoreFunction: boolean = true): boolean {
  if (objA === objB) return true;
  if (objA === null && objB === null) return true;
  if (objA === null || objB === null) return false;
  if (typeof objA !== 'object' || typeof objB !== 'object') return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];

    if (key === '_owner' && objA.$$typeof) {
      // React-specific: avoid traversing React elements' _owner.
      //  _owner contains circular references
      // and is not needed when comparing the actual elements (and not their owners)
      continue;
    }

    const valueA = objA[key];
    const valueB = objB[key];
    const valueAType = typeof valueA;

    if (valueAType !== typeof valueB) return false;
    if (valueAType === 'function' && ignoreFunction) continue;
    if (valueAType === 'object') {
      if (!isObjectEqual(valueA, valueB, ignoreFunction)) return false;
      else continue;
    }
    if (valueA !== valueB) return false;
  }
  return true;
}

export function callOrReturn<T>(funcOrValue: T | ((...args: any[]) => T), ...args: any[]): T {
  return typeof funcOrValue === 'function' ? (funcOrValue as Function)(...args) : funcOrValue;
}

export function hasChildren(data: RowData): boolean {
  return Array.isArray(data.children) && data.children.length > 0;
}

export function unflatten(
  array: RowData[],
  rootId: any = null,
  dataKey: string = 'id',
  parentKey: string = 'parentId',
): RowData[] {
  const tree: RowData[] = [];
  const childrenMap: Record<string, RowData[]> = {};

  const length = array.length;
  for (let i = 0; i < length; i++) {
    const item: RowData = { ...array[i] };
    const id = item[dataKey];
    const parentId = item[parentKey];

    if (Array.isArray(item.children)) {
      childrenMap[id] = item.children.concat(childrenMap[id] || []);
    } else if (!childrenMap[id]) {
      childrenMap[id] = [];
    }
    item.children = childrenMap[id];

    if (parentId !== undefined && parentId !== rootId) {
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
}

export function flattenOnKeys(
  tree: RowData[],
  keys: any[],
  depthMap: Record<string, number> = {},
  dataKey: string = 'id',
): RowData[] {
  if (!keys || !keys.length) return tree;

  const array: RowData[] = [];
  const keysSet = new Set<any>();
  keys.forEach((x) => keysSet.add(x));

  let stack = ([] as RowData[]).concat(tree);
  stack.forEach((x) => (depthMap[x[dataKey]] = 0));
  while (stack.length > 0) {
    const item = stack.shift()!;

    array.push(item);
    if (keysSet.has(item[dataKey]) && Array.isArray(item.children) && item.children.length > 0) {
      stack = ([] as RowData[]).concat(item.children, stack);
      item.children.forEach((x: RowData) => (depthMap[x[dataKey]] = depthMap[item[dataKey]] + 1));
    }
  }

  return array;
}

// Babel7 changed the behavior of @babel/plugin-transform-spread in https://github.com/babel/babel/pull/6763
// [...array] is transpiled to array.concat() while it was [].concat(array) before
// this change breaks immutable array(seamless-immutable), [...array] should always return mutable array
export function cloneArray<T>(array: T[]): T[] {
  if (!Array.isArray(array)) return [];
  return ([] as T[]).concat(array);
}

export function noop(): void {}

export function toString(value: any): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return typeof value.toString === 'function' ? value.toString() : '';
}

function getPathSegments(path: string): string[] {
  const pathArray = path.split('.');
  const parts: string[] = [];

  for (let i = 0; i < pathArray.length; i++) {
    let p = pathArray[i];

    while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
      p = p.slice(0, -1) + '.';
      p += pathArray[++i];
    }

    parts.push(p);
  }

  return parts;
}

// changed from https://github.com/sindresorhus/dot-prop/blob/master/index.js
export function getValue(object: any, path: string, defaultValue?: any): any {
  if (object === null || typeof object !== 'object' || typeof path !== 'string') {
    return defaultValue;
  }

  const pathArray = getPathSegments(path);

  for (let i = 0; i < pathArray.length; i++) {
    if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
      return defaultValue;
    }

    object = object[pathArray[i]];

    if (object === undefined || object === null) {
      if (i !== pathArray.length - 1) {
        return defaultValue;
      }

      break;
    }
  }

  return object;
}

// copied from https://www.30secondsofcode.org/js/s/debounce
export const debounce = (fn: (...args: any[]) => void, ms: number = 0) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// copied from https://www.30secondsofcode.org/js/s/throttle
export const throttle = (fn: (...args: any[]) => void, wait: number) => {
  let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args as any);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        function () {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args as any);
            lastTime = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0),
      );
    }
  };
};

// copied from https://github.com/react-bootstrap/dom-helpers
let scrollbarSize: number | undefined;
export function getScrollbarSize(recalculate?: boolean): number {
  if ((!scrollbarSize && scrollbarSize !== 0) || recalculate) {
    if (typeof window !== 'undefined' && window.document && typeof window.document.createElement === 'function') {
      let scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return scrollbarSize as number;
}

export function addClassName(el: HTMLElement, className: string): void {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
      el.className += ` ${className}`;
    }
  }
}

export function removeClassName(el: HTMLElement, className: string): void {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
  }
}

export function getEstimatedTotalRowsHeight(
  data: RowData[],
  estimatedRowHeight: number | ((args: { rowData: RowData; rowIndex: number }) => number),
): number {
  return typeof estimatedRowHeight === 'function'
    ? data.reduce((height, rowData, rowIndex) => height + estimatedRowHeight({ rowData, rowIndex }), 0)
    : data.length * estimatedRowHeight;
}
