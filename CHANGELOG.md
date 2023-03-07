# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/royue/react-context-table/compare/v1.0.0...v1.1.0) (2023-03-07)


### Features

* add ignoreFunctionInColumnCompare to solve closure problem in renderers ([#213](https://github.com/royue/react-context-table/issues/213)) ([7da845d](https://github.com/royue/react-context-table/commit/7da845d297425a47e5ec3f3b549cf5e257b1aa61))
* add support for dynamic row height ([#170](https://github.com/royue/react-context-table/issues/170)) ([784b475](https://github.com/royue/react-context-table/commit/784b4759a504349409256e4481d745b6c0a8b99e))
* add the ability to pass function in estimatedRowHeight to determine the initial height of rows ([#241](https://github.com/royue/react-context-table/issues/241)) ([8e657a4](https://github.com/royue/react-context-table/commit/8e657a4dbf424cf3c3cdac2287f26c5723021372))
* add type declarations ([#193](https://github.com/royue/react-context-table/issues/193)) ([4231399](https://github.com/royue/react-context-table/commit/42313999a522648588e6849f48026da96ccf7ac4))
* Added onColumnResizeEnd prop to BaseTable ([#95](https://github.com/royue/react-context-table/issues/95)) ([f0f8d56](https://github.com/royue/react-context-table/commit/f0f8d5621154341a9422abddec671ca8e2279785))
* cell render add render method ([1fcf85b](https://github.com/royue/react-context-table/commit/1fcf85bd66f764246db42328cb68db6d6a63a635))
* **expand detail:** 支持expand detail 不随x轴滚动 ([f6c8d43](https://github.com/royue/react-context-table/commit/f6c8d4344dc9c957920b6164aa8caf78e8b693b4))
* init ([f868225](https://github.com/royue/react-context-table/commit/f8682255a5ad8869222830f92361b2c36d87695a))
* **typescript:** ts转化 ([f4cfa58](https://github.com/royue/react-context-table/commit/f4cfa581f7a3c047c5131f3488b8883c84304368))
* width 为0的column隐藏显示列 ([a490cac](https://github.com/royue/react-context-table/commit/a490cacfb9bca2c34ee2942a89365cd97a3d0b90))
* 依赖版本升级，加入ts ([c279996](https://github.com/royue/react-context-table/commit/c279996cc2a3a062636ec2a96da58e6b751bc342))
* **列属性:** 新增gridHeadCellStyle、gridCellStyle ([70996a4](https://github.com/royue/react-context-table/commit/70996a4d13b8b1a74b2c1f4000812d55a5f27de8))
* 新增底部固定栏 ([7f2442c](https://github.com/royue/react-context-table/commit/7f2442c9e989d24c245e95cfdd33348333abf1c8))


### Bug Fixes

* add missing types for propTypes of BaseTable ([#219](https://github.com/royue/react-context-table/issues/219)) ([9a89e35](https://github.com/royue/react-context-table/commit/9a89e350f6a693fda0c4386363a2fc75cdcbcfe8))
* **baseIdx、isForceKey:** 字段支持 ([8014526](https://github.com/royue/react-context-table/commit/801452690900ad991f19fd28b65b32d2f4c5d894))
* bring back column resize on touch support ([#83](https://github.com/royue/react-context-table/issues/83)) ([8095e78](https://github.com/royue/react-context-table/commit/8095e78ce639d60423220e5615df942776597a59))
* change propTypes for BaseTable.components ([#274](https://github.com/royue/react-context-table/issues/274)) ([6c8b237](https://github.com/royue/react-context-table/commit/6c8b2372c8185c1c6d80a7c7bab7cc2f01e3e689))
* content been selected when dragging on IE/FF ([2261925](https://github.com/royue/react-context-table/commit/2261925993e285eee3f1e54d23efcd5126100920))
* **detail view:** 修复滚动问题 ([5e41a0a](https://github.com/royue/react-context-table/commit/5e41a0a03795fce4697b9a27ead88d28fe40690f))
* dynamic rowHeight is not updated when data/columns changed ([#181](https://github.com/royue/react-context-table/issues/181)) ([ba904fe](https://github.com/royue/react-context-table/commit/ba904feb1d58a0a0ed300bf13b9e71d504dd8970))
* dynamic rowHeight is not updated when resizing column ([#175](https://github.com/royue/react-context-table/issues/175)) ([0ff11a5](https://github.com/royue/react-context-table/commit/0ff11a523c524b430fe0d7de40f70e50b001b7f2))
* flattenOnKeys not works with immutable data ([1723769](https://github.com/royue/react-context-table/commit/1723769b4c597809d90de8cf1e054e2b125ea790))
* flicker on expanding in dynamic mode ([#188](https://github.com/royue/react-context-table/issues/188)) ([e6a98ff](https://github.com/royue/react-context-table/commit/e6a98ff58b41c1f558fd3d9a8a42e14669457b79))
* frozen data not shown with empty data ([#147](https://github.com/royue/react-context-table/issues/147)) ([c2ea383](https://github.com/royue/react-context-table/commit/c2ea3838f57302be07f8bb29292e0e002778b453))
* getTotalRowsHeight could be different before/after render in dynamic mode ([#201](https://github.com/royue/react-context-table/issues/201)) ([3576376](https://github.com/royue/react-context-table/commit/357637638d2bf0b2e9ca97d0bd593f179945c302))
* getTotalRowsHeight could be different before/after render in dynamic mode again ([#204](https://github.com/royue/react-context-table/issues/204)) ([7cc37cc](https://github.com/royue/react-context-table/commit/7cc37cc4e6019762995448c14e27cd77cd028fac))
* **headerProps:** header render headerProps 参数传递 ([b4d2d44](https://github.com/royue/react-context-table/commit/b4d2d446bb937ad1f5541fd3dae54f6ee2da867a))
* horizontal scrollbar in flex mode with dynamic row height ([#183](https://github.com/royue/react-context-table/issues/183)) ([a56ee2a](https://github.com/royue/react-context-table/commit/a56ee2a9cc5f6770bfbe14d7208ad1e43f500a31))
* infinite loading should work with maxHeight ([#57](https://github.com/royue/react-context-table/issues/57)) ([c63b052](https://github.com/royue/react-context-table/commit/c63b052e1f4b0413294a65070f821b20384a2efa))
* input loses focus on unmount ([#212](https://github.com/royue/react-context-table/issues/212)) ([b513ce0](https://github.com/royue/react-context-table/commit/b513ce0632c11875c1d624f28c230db7a75da64d))
* omit minWidth in ColumnResizer ([8be9d04](https://github.com/royue/react-context-table/commit/8be9d0460dc496a694cbd998b201f3e5d50b7df6))
* optimization render task performance ([#348](https://github.com/royue/react-context-table/issues/348)) ([38e8d12](https://github.com/royue/react-context-table/commit/38e8d1246d7599faeda44afcc3e38f0f5923a530))
* regression of expansion with frozen columns ([#180](https://github.com/royue/react-context-table/issues/180)) ([8960c71](https://github.com/royue/react-context-table/commit/8960c7161a2b82b5853ceb64074683ceea24bdae))
* remove propTypes for Column.key ([#222](https://github.com/royue/react-context-table/issues/222)) ([86bfb5e](https://github.com/royue/react-context-table/commit/86bfb5e55620438a4eff37ecc08f148a45508306))
* resizing line rendered incorrectly ([#51](https://github.com/royue/react-context-table/issues/51)) ([a4dc5f7](https://github.com/royue/react-context-table/commit/a4dc5f7280f2a28623c352fa6891ece4383b45e0))
* rowHeight is not calculated correctly with frozen columns ([#174](https://github.com/royue/react-context-table/issues/174)) ([10b5f29](https://github.com/royue/react-context-table/commit/10b5f29d51e81a16a1cf6cfd208861a9f2093247))
* scroll position would be reset to top if column becomes frozen ([#208](https://github.com/royue/react-context-table/issues/208)) ([e4d956b](https://github.com/royue/react-context-table/commit/e4d956b597d68f4ee628ee2ceff60da0797770f0))
* style value unset is not supported on IE ([e360fd5](https://github.com/royue/react-context-table/commit/e360fd5f8fc9be7b31e19299284d04c940a3eae8))
* support function component with hooks ([#80](https://github.com/royue/react-context-table/issues/80)) ([342bcf6](https://github.com/royue/react-context-table/commit/342bcf6581f6bc7851dac9184d99f178fd144c3b))
* table crash on setting scroll ([#374](https://github.com/royue/react-context-table/issues/374)) ([f5dd5bb](https://github.com/royue/react-context-table/commit/f5dd5bbde7b0030fad5d387fdf347991839055a4))
* undefined parentId should be considered as root item ([29f21d7](https://github.com/royue/react-context-table/commit/29f21d7dd66de8ff61415ae5ed4799de38708788))
* unflatten should not override the existing children ([#97](https://github.com/royue/react-context-table/issues/97)) ([480863e](https://github.com/royue/react-context-table/commit/480863e2c1302e559364473bd2b4ae1f821b46f8))
* wrong description for Column props ([#157](https://github.com/royue/react-context-table/issues/157)) ([34bff67](https://github.com/royue/react-context-table/commit/34bff6734837c967f0d3149fd93f26733e6bc79b))
* 修复key错误问题 ([5e3ce21](https://github.com/royue/react-context-table/commit/5e3ce214028f3dfc8ba240128b29a3212deb09de))
* **修复展开项:** 修改无法展开 ([54db15f](https://github.com/royue/react-context-table/commit/54db15f85cd62b39d22e0e4cea5c247acd2d3105))

# CHANGELOG

## NEXT VERSION

## v1.13.2 (2022-05-14)

- fix: error imported by optimization render task

## v1.13.1 (2022-05-14)

- fix: optimization render task performance

## v1.13.0 (2021-10-24)

- fix: change propTypes for `BaseTable.components`
- feat: add support for React 17

## v1.12.0 (2020-10-11)

- feat: add the ability to pass function in `estimatedRowHeight` to determine the initial height of rows

## v1.11.3 (2020-08-24)

- fix: remove propTypes for Column.key

## v1.11.2 (2020-08-18)

- fix: add missing types for propTypes of `BaseTable`

## v1.11.1 (2020-08-17)

- fix: add types folder into packages
- chore: mark `Column.key` as required

## v1.11.0 (2020-08-17)

- feat: add `ignoreFunctionInColumnCompare` to solve closure problem in renderers
- chore: skip unnecessary cloneElement in `renderElement`
- feat: add type declarations

## v1.10.9 (2020-08-13)

- fix: input loses focus on unmount

## v1.10.8 (2020-08-11)

- fix: scroll position would be reset to top if column becomes frozen

## v1.10.7 (2020-07-28)

- fix: `getTotalRowsHeight` could be different before/after render in dynamic mode on initial render

## v1.10.6 (2020-07-25)

- fix: `getTotalRowsHeight` could be different before/after render in dynamic mode

## v1.10.5 (2020-07-10)

- chore: do not clear row height cache automatically

## v1.10.4 (2020-07-02)

- fix: flicker on expanding in dynamic mode

## v1.10.3 (2020-06-30)

- fix: horizontal scrollbar in flex mode with dynamic row height
- chore: tweak row height measurement

## v1.10.2 (2020-06-26)

- fix: regression of expansion with frozen columns
- fix: dynamic rowHeight is not updated when `data` or `columns` changed

## v1.10.1 (2020-06-24)

- fix: dynamic rowHeight is not calculated correctly with frozen columns
- fix: dynamic rowHeight is not updated when resizing column

## v1.10.0 (2020-06-22)

- feat: add `estimatedRowHeight` to support dynamic row height

## v1.9.4 (2020-06-22)

- chore: loosen prop type check for `data`

## v1.9.3 (2020-05-26)

- fix: wrong description for Column props

## v1.9.2 (2020-04-22)

- fix: frozen data not shown with empty data

## v1.9.1 (2019-10-17)

- reverted #80, now custom renderer doesn't support top level hooks, see #109

## v1.9.0 (2019-09-24)

- feat: add `onColumnResizeEnd` prop to `BaseTable`

## v1.8.1 (2019-09-23)

- fix: `unflatten` should not override the existing children

## v1.8.0 (2019-08-30)

- feat: remove deprecated lifecycles for concurrent mode ready

## v1.7.3 (2019-08-27)

- fix: fix possible memory leak in `ColumnResizer`
- fix: bring back column resize on touch events support

## v1.7.2 (2019-08-26)

- ~~fix: custom renderers should support function component with hooks~~

## v1.7.1 (2019-08-22)

- fix: `scrollToRow` doesn't work regression introduced in #73

## v1.7.0 (2019-08-06)

- chore: remove the use of `Object.values`
- feat: add `getColumnManager` and `getDOMNode` methods

## v1.6.5 (2019-07-11)

- fix: style value `unset` is not supported on IE

## v1.6.4 (2019-07-09)

- fix: content been selected when dragging on IE/FF (regression from #56)

## v1.6.3 (2019-07-09)

- fix: `minWidth` is passed to dom node in `ColumnResizer` in #56

## v1.6.2 (2019-07-07)

- fix: `getValue` returns the object itself if the path is not valid string

## v1.6.1 (2019-07-06)

- feat: support infinite loading with `maxHeight`
- chore: remove unused `$table-border-radius` variable
- feat: add `sortState` to support multi sort

## v1.5.0 (2019-07-06)

- refactor: remove dependent on `react-draggable`
- fix: undefined parentId should be considered as root item
- fix: `flattenOnKeys` not works with immutable data (regression from #23)

## v1.4.0 (2019-07-01)

- refactor: remove dependent on `lodash`, and export `getValue`
- build: use `@babel/plugin-transform-runtime` to reduce bundle size

## v1.3.3 (2019-06-27)

- fix: use `PropTypes.elementType` for `tagName`'s type

## v1.3.2 (2019-06-14)

- fix: resizing line rendered incorrectly when resizing the right frozen column

## v1.3.1 (2019-06-06)

- chore: upgrade `react-window` to silence the deprecation

## v1.3.0 (2019-05-10)

- feat: allow `rowKey` to be `number`
- feat: add `getScrollbarSize` to `BaseTable` to custom scrollbar size measurement

## v1.2.2 (2019-05-03)

- perf: optimize `unflatten` and `flattenOnKeys` to not use recursion

## v1.2.1 (2019-05-01)

- fix: scrollbar size don't updated in SSR

## v1.2.0 (2019-04-29)

- chore: more accurate `onScrollbarPresenceChange`
- feat: replace `react-virtualized` with `react-window`
- feat: add scroll direction to `onScroll`
- feat: add `align` to `scrollToRow`

## v1.1.1 (2019-04-27)

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
