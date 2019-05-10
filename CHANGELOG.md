# CHANGELOG

## NEXT VERSION

# v1.3.0 (2019-05-10)

- feat: allow `rowKey` to be `number`
- feat: add `getScrollbarSize` to `BaseTable` to custom scrollbar size measurement

# v1.2.2 (2019-05-03)

- perf: optimize `unflatten` and `flattenOnKeys` to not use recursion

# v1.2.1 (2019-05-01)

- fix: scrollbar size don't updated in SSR

# v1.2.0 (2019-04-29)

- chore: more accurate `onScrollbarPresenceChange`
- feat: replace `react-virtualized` with `react-window`
- feat: add scroll direction to `onScroll`
- feat: add `align` to `scrollToRow`

# v1.1.1 (2019-04-27)

- fix: `flattenOnKeys` memoize is opt out because `this._depthMap` changes everytime
- fix: hover state is out of sync in frozen rows, regression introduced in #9

## v1.1.0 (2019-04-26)

- chore: stop using `Grid` for table's header
- chore: add `role` to table's elements
- chore: stop using `forceUpdate` to update the table
- fix: table's header is re-rendered unnecessarily on row hovered

## v1.0.2 (2019-04-03)

- fix: `onScroll` is called redundantly if there are frozen columns

## v1.0.1 (2019-03-28)

- fix: header row's height doesn't update on `headerHeight` change

## v1.0.0 (2019-03-26)

Initial public release
