import React from 'react';

export type fn = (...args: any) => any;
export type Values<T> = T[keyof T];

/**
 * First parameter of `React.createElement`
 */
export type ReactElementType<P = any> = string | React.FunctionComponent<P> | React.ComponentClass<P, any>;
export type MaybeElement = JSX.Element | false | null | undefined;
