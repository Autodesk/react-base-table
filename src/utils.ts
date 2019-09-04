import React from 'react';

type lit = string | number | boolean;
export type fn = (...args: any) => any;
export type Values<T> = T[keyof T];

type FirstArg<T extends (...args: any) => any> = Parameters<T>[0];

export function renderElement(
  renderer?: FirstArg<typeof React.cloneElement> | FirstArg<typeof React.createElement>,
  props?: any
) {
  if (!renderer) return null;

  if (React.isValidElement(renderer)) {
    return React.cloneElement(renderer, props);
  } else {
    return React.createElement(renderer, props);
  }
}

export function normalizeColumns(elements: any) {
  const columns: any[] = [];
  React.Children.forEach(elements, element => {
    if (React.isValidElement(element) && element.key) {
      const column = { ...element.props, key: element.key };
      columns.push(column);
    }
  });

  return columns;
}

export function isObjectEqual(objA: any, objB: any) {
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

export function callOrReturn<T extends lit | object>(funcOrValue: T, ...args: any[]): T;
export function callOrReturn<T extends fn>(funcOrValue: T, ...args: Parameters<T>): ReturnType<T>;
export function callOrReturn(funcOrValue: any, ...args: any[]) {
  return typeof funcOrValue === 'function' ? funcOrValue(...args) : funcOrValue;
}

export function hasChildren(data: { children: { length: number } }) {
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

    if (!childrenMap[id]) childrenMap[id] = [];
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

export function flattenOnKeys(tree: any, keys: any[], depthMap: Record<string, any> = {}, dataKey = 'id') {
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

export function noop() {}

export function toString(value: any) {
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

// copied from https://30secondsofcode.org/function#throttle
export function throttle<T extends fn>(fn: T, wait: number) {
  let inThrottle = false;
  let lastFn: number;
  let lastTime: number;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = window.setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn(args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
}

// copied from https://github.com/react-bootstrap/dom-helpers
let scrollbarSize: number;
export function getScrollbarSize(recalculate: any) {
  if ((!scrollbarSize && scrollbarSize !== 0) || recalculate) {
    if (typeof window !== 'undefined' && window.document && window.document.createElement) {
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
