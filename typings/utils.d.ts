import React from 'react';
declare type Literal = string | number | boolean;
export declare type fn = (...args: any) => any;
export declare type Values<T> = T[keyof T];
declare type FirstArg<T extends (...args: any) => any> = Parameters<T>[0];
export declare function renderElement(
  renderer?: FirstArg<typeof React.cloneElement> | FirstArg<typeof React.createElement>,
  props?: any
): React.ReactElement<
  unknown,
  | string
  | ((
      props: any
    ) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null)
  | (new (props: any) => React.Component<any, any, any>)
> | null;
export declare function normalizeColumns(elements: any): any[];
export declare function isObjectEqual(objA: any, objB: any): boolean;
export declare function callOrReturn<T extends Literal | object>(funcOrValue: T, ...args: any[]): T;
export declare function callOrReturn<T extends fn>(funcOrValue: T, ...args: Parameters<T>): ReturnType<T>;
export declare function hasChildren(data: {
  children: {
    length: number;
  };
}): boolean;
export declare function unflatten(array: any[], rootId?: null, dataKey?: string, parentKey?: string): any[];
export declare function flattenOnKeys(tree: any, keys: any[], depthMap?: Record<string, any>, dataKey?: string): any;
export declare function cloneArray<T>(array: T | T[]): T[];
export declare function noop(): void;
export declare function toString(value: any): any;
export declare function getValue(object: any, path: string, defaultValue?: any): any;
export declare function throttle<T extends fn>(fn: T, wait: number): (...args: Parameters<T>) => void;
export declare function getScrollbarSize(recalculate: any): number;
export declare function addClassName(el: Element, className: string): void;
export declare function removeClassName(el: Element, className: string): void;
export {};
