import React from 'react';
import { IColumnProps } from './Column';

export function renderElement(renderer: React.ElementType | React.ReactElement, props?: any) {
  if (!renderer) {
    return null;
  }

  if (React.isValidElement(renderer)) {
    return React.cloneElement(renderer, props);
  } else {
    return React.createElement(renderer, props);
  }
}

export type GetProps<C> = C extends React.ElementType<infer P> ? P : never;

export function normalizeColumns(elements: Array<React.ReactElement<IColumnProps>>) {
  const columns: IColumnProps[] = [];
  React.Children.forEach<React.ReactElement<IColumnProps>>(elements, (element) => {
    if (React.isValidElement(element) && element.key) {
      const column: IColumnProps = { ...element.props, key: element.key };
      columns.push(column);
    }
  });
  return columns;
}

export function isObjectEqual(objA: any, objB: any) {
  if (objA === objB) {
    return true;
  }
  if (objA === null && objB === null) {
    return true;
  }
  if (objA === null || objB === null) {
    return false;
  }
  if (typeof objA !== 'object' || typeof objB !== 'object') {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  // tslint:disable-next-line
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    const valueA = objA[key];
    const valueB = objB[key];

    if (typeof valueA !== typeof valueB) {
      return false;
    }
    if (typeof valueA === 'function') {
      continue;
    }
    if (typeof valueA === 'object') {
      if (!isObjectEqual(valueA, valueB)) {
        return false;
      } else {
        continue;
      }
    }
    if (valueA !== valueB) {
      return false;
    }
  }
  return true;
}

export function callOrReturn(funcOrValue: any, ...args: any[]) {
  return typeof funcOrValue === 'function' ? funcOrValue(...args) : funcOrValue;
}

export function hasChildren(data: any) {
  return Array.isArray(data.children) && data.children.length > 0;
}

export function unflatten(array: any[], rootId: string = null, dataKey: string = 'id', parentKey: string = 'parentId') {
  const tree = [];
  const childrenMap: { [key: string]: any[] } = {};

  const length = array.length;
  for (let i = 0; i < length; i++) {
    const item = { ...array[i] };
    const id = item[dataKey];
    const parentId = item[parentKey];

    if (!childrenMap[id]) {
      childrenMap[id] = [];
    }
    item.children = childrenMap[id];

    if (parentId !== undefined && parentId !== rootId) {
      if (!childrenMap[parentId]) {
        childrenMap[parentId] = [];
      }
      childrenMap[parentId].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
}

export function flattenOnKeys(tree: any[], keys: string[], depthMap: { [key: string]: number } = {}, dataKey = 'id') {
  if (!keys || !keys.length) {
    return tree;
  }

  const array = [];
  const keysSet: Set<string> = new Set();
  keys.forEach((x) => keysSet.add(x));

  let stack: any[] = [].concat(tree);
  stack.forEach((x) => (depthMap[x[dataKey]] = 0));
  while (stack.length > 0) {
    const item = stack.shift();

    array.push(item);
    if (keysSet.has(item[dataKey]) && Array.isArray(item.children) && item.children.length > 0) {
      stack = [].concat(item.children, stack);
      item.children.forEach((x: any) => (depthMap[x[dataKey]] = depthMap[item[dataKey]] + 1));
    }
  }

  return array;
}

// Babel7 changed the behavior of @babel/plugin-transform-spread in https://github.com/babel/babel/pull/6763
// [...array] is transpiled to array.concat() while it was [].concat(array) before
// this change breaks immutable array(seamless-immutable), [...array] should always return mutable array
export function cloneArray(array: any[]) {
  if (!Array.isArray(array)) {
    return [];
  }
  return [].concat(array);
}

// tslint:disable-next-line:no-empty
export function noop() {}

export function toString(value: any) {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
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
export function getValue<T extends { [key: string]: any }>(object: T, path: string, defaultValue?: T) {
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
export function throttle(fn: (...args: any[]) => any, wait: number) {
  let inThrottle: boolean;
  let lastFn: number;
  let lastTime: number;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
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

export function addClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
      el.className += ` ${className}`;
    }
  }
}

export function removeClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
  }
}


export const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
};


export const isMouseEvent = (in_event: TouchEvent | MouseEvent): in_event is MouseEvent => {
  return in_event.type === eventsFor.mouse.start || in_event.type === eventsFor.mouse.move ||
    in_event.type === eventsFor.mouse.stop;
}

export const isTouchEvent = (in_event: TouchEvent | MouseEvent): in_event is TouchEvent => {
  return in_event.type === eventsFor.touch.start || in_event.type === eventsFor.touch.move ||
    in_event.type === eventsFor.touch.stop;
}