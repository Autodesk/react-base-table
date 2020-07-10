import React from 'react';

import { fn, MaybeElement, ReactElementType } from './type-utils';

export function renderElement<P = any>(renderer: ReactElementType, props?: P): React.ReactElement | MaybeElement;
export function renderElement<P = any>(renderer: React.ReactElement, props?: P): React.ReactElement<P> | MaybeElement;
export function renderElement<P = any>(renderer: any, props?: P): React.ReactNode | undefined | null;
export function renderElement(renderer?: any, props?: any): React.ReactNode | undefined | null {
  if (React.isValidElement(renderer)) {
    return React.cloneElement(renderer, props);
  } else if (typeof renderer === 'function') {
    if (renderer.prototype && renderer.prototype.isReactComponent) {
      return React.createElement(renderer, props);
    } else if (renderer.defaultProps) {
      return renderer({ ...renderer.defaultProps, ...props });
    }
    return renderer(props);
  } else {
    return null;
  }
}

export function normalizeColumns<P = any>(elements: {} | React.ReactElement<P> | null | undefined) {
  const columns: any[] = [];
  React.Children.forEach(elements, element => {
    if (React.isValidElement(element) && element.key) {
      const column = { ...element.props, key: element.key };
      columns.push(column);
    }
  });

  return columns;
}

export function isObjectEqual(objA?: any, objB?: any) {
  if (objA === objB) return true;
  if (objA === null && objB === null) return true;
  if (objA === null || objB === null) return false;
  if (typeof objA !== 'object' || typeof objB !== 'object') return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    const valueA = objA[key];
    const valueB = objB[key];

    if (typeof valueA !== typeof valueB) return false;
    if (typeof valueA === 'function') continue;
    if (typeof valueA === 'object') {
      if (!isObjectEqual(valueA, valueB)) return false;
      else continue;
    }
    if (valueA !== valueB) return false;
  }
  return true;
}

export function callOrReturn<T extends fn>(funcOrValue: T, ...args: Parameters<T>): ReturnType<T>;
export function callOrReturn<T = {}>(funcOrValue: T, ...args: any): T;
export function callOrReturn(funcOrValue: any, ...args: any[]) {
  return typeof funcOrValue === 'function' ? funcOrValue(...args) : funcOrValue;
}

export function hasChildren(data: { children?: any[] }) {
  return Array.isArray(data.children) && data.children.length > 0;
}

export function unflatten(array: any[], rootId = null, dataKey = 'id', parentKey = 'parentId') {
  const tree = [];
  const childrenMap: Record<string, any> = {};

  const length = array.length;
  for (let i = 0; i < length; i++) {
    const item = { ...array[i] };
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

export function flattenOnKeys(tree: any, keys: any[], depthMap: Record<any, any> = {}, dataKey = 'id'): any[] {
  if (!keys || !keys.length) return tree;

  const array = [];
  const keysSet = new Set();
  keys.forEach((x: unknown) => keysSet.add(x));

  let stack = [...tree];
  stack.forEach(x => (depthMap[x[dataKey]] = 0));
  while (stack.length > 0) {
    const item = stack.shift();

    array.push(item);
    if (keysSet.has(item[dataKey]) && Array.isArray(item.children) && item.children.length > 0) {
      stack = [...item.children, ...stack];
      item.children.forEach(
        (x: { [x: string]: React.ReactText }) => (depthMap[x[dataKey]] = depthMap[item[dataKey]] + 1)
      );
    }
  }

  return array;
}

// Babel7 changed the behavior of @babel/plugin-transform-spread in https://github.com/babel/babel/pull/6763
// [...array] is transpiled to array.concat() while it was [].concat(array) before
// this change breaks immutable array(seamless-immutable), [...array] should always return mutable array
export function cloneArray<T>(array: T | T[]) {
  // TODO(ssk): double check this
  return Array.isArray(array) ? [...array] : [];
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function toString(value?: any): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return value.toString ? value.toString() : '';
}

function getPathSegments(path: string) {
  const pathArray = path.split('.');
  const parts = [];

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
export function getValue<T>(object: { [key: string]: any }, path: string): T | undefined;
export function getValue<T>(object: { [key: string]: any }, path: string, defaultValue: T): T;
export function getValue(object: any, path: string, defaultValue?: any) {
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
export function debounce<T extends fn>(fn: T, ms: number): T;
export function debounce<T extends fn>(fn: T, ms: number): (...args: Parameters<T>) => void;
export function debounce(fn: Function, ms: number = 0): Function {
  let timeoutId: number;
  return function(...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout((() => fn(...args)) as TimerHandler, ms);
  };
}

// copied from https://www.30secondsofcode.org/js/s/throttle
export function throttle<T extends fn>(fn: T, wait: number): T;
export function throttle<T extends fn>(fn: T, wait: number): (...args: Parameters<T>) => void;
export function throttle(fn: Function, wait: number): Function {
  let inThrottle = false;
  let lastFn: number;
  let lastTime: number;

  return function(...args: any) {
    if (!inThrottle) {
      fn(...args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        (() => {
          if (Date.now() - lastTime >= wait) {
            fn(...args);
            lastTime = Date.now();
          }
        }) as TimerHandler,
        Math.max(wait - (Date.now() - lastTime), 0)
      );
    }
  };
}

// copied from https://github.com/react-bootstrap/dom-helpers
let scrollbarSize: number;
export function getScrollbarSize(recalculate?: boolean) {
  if ((!scrollbarSize && scrollbarSize !== 0) || recalculate) {
    if (typeof window !== 'undefined' && window.document && window.document.createElement) {
      const scrollDiv = document.createElement('div');

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

  return scrollbarSize;
}

export function addClassName(el: Element, className: string) {
  if (el.classList) {
    el.classList.add(className);
  } else if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
    el.className += ` ${className}`;
  }
}

export function removeClassName(el: Element, className: string) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
  }
}
