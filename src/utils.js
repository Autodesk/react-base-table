import React from 'react';

export function renderElement(renderer, props) {
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

export function normalizeColumns(elements) {
  const columns = [];
  React.Children.forEach(elements, element => {
    if (React.isValidElement(element) && element.key) {
      const column = { ...element.props, key: element.key };
      columns.push(column);
    }
  });
  return columns;
}

export function isObjectEqual(objA, objB) {
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

export function callOrReturn(funcOrValue, ...args) {
  return typeof funcOrValue === 'function' ? funcOrValue(...args) : funcOrValue;
}

export function hasChildren(data) {
  return Array.isArray(data.children) && data.children.length > 0;
}

export function unflatten(array, parent = null, dataKey = 'id', parentKey = 'parentId') {
  // deep clone the array
  const tree = Array.prototype.filter.call(array, x => x[parentKey] === parent).map(x => ({ ...x }));

  tree.forEach(child => {
    const childTree = unflatten(array, child[dataKey], dataKey, parentKey);
    if (childTree.length > 0) child.children = childTree;
  });

  return tree;
}

export function flattenOnKeys(tree, keys, depthMap = {}, depth = 0, dataKey = 'id') {
  if (!keys || !keys.length) return tree;

  let array = [];
  tree.forEach(child => {
    array.push(child);
    if (keys.indexOf(child[dataKey]) >= 0) {
      depthMap[child[dataKey]] = depth;
      if (hasChildren(child)) {
        child.children.forEach(x => {
          depthMap[x[dataKey]] = depth + 1;
        });
        array = array.concat(flattenOnKeys(child.children, keys, depthMap, depth + 1, dataKey));
      }
    }
  });

  return array;
}

// Babel7 changed the behavior of @babel/plugin-transform-spread in https://github.com/babel/babel/pull/6763
// [...array] is transpiled to array.concat() while it was [].concat(array) before
// this change breaks immutable array(seamless-immutable), [...array] should always return mutable array
export function cloneArray(array) {
  if (!Array.isArray(array)) return [];
  return [].concat(array);
}

let size = -1;

export function getScrollbarSize(recalc) {
  if (size === -1 || recalc) {
    let scrollDiv = document.createElement('div');

    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';

    document.body.appendChild(scrollDiv);
    size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }

  return size;
}
