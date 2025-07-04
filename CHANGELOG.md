# CHANGELOG

## 1.5.1

_2025-06-16_

### Bugfix

- added `hasMoreData` so users can have more control over when loading needs to occur

## 1.5.0

_2025-06-11_

### Features

- added `onLoadRows` prop, which enables infinite loading
- added `endComponent` prop, which enables a component to be displayed at the end of the table

## 1.4.3

_2025-05-09_

### Bugfix

- there should be slightly less renders when the window changes size

## 1.4.2

_2025-04-18_

### Bugfix

- revert `box-sizing`. This was causing an infinite loop in certain dialogs. Instead we multiply border height by two to fix vertical scroll bars appearing when borders are present and maxTableHeight is specified.

## 1.4.1

_2025-04-18_

### Bugfix

- set `box-sizing: content-box` on `.rft`. Should fix vertical scroll bars appearing when borders are present and maxTableHeight is specified.

## 1.4.0

_2025-04-18_

### Breaking

- removed `rowRenderer` functionality.
- removed `.rft-row-container`, `.rft-outer-container`, and `.rft-inner-container`. as css class names.

### Bugfix

- on certain devices, the background color of the row did not fill the table. This should be resolved.
- no need for `isHorizontalScroll` hack

## 1.3.0

_2025-04-01_

### Features

- added `estimatedRowHeight` back

### Bugix

- isHorizontalScroll uses a scroll bar heuristic of 17
- should handle maxTableHeight a bit better. There _should_ be less jitter

## 1.2.7

_2025-03-31_

### Bugix

- isHorizontalScroll is always false for now

## 1.2.6

_2025-03-31_

### Bugix

- move heuristic

## 1.2.5

_2025-03-31_

### Bugix

- on window resize, added padding to help with scroll flicker

## 1.2.4

_2025-03-19_

### Features

- no forcing rft-sizer height

## 1.2.3

_2025-03-19_

### Features

- bumps dependencies
- adds more class names, and makes the auto sizer fill to height 100%

## 1.2.2

_2024-12-19_

### Features

- explicit support for React 19
- fixes horizontal scroll bug on iOS
- fixes `footerComponent` regression

## 1.2.1

_2024-12-19_

### Features

- on initial render, the widths of the column are initialized correctly.
- small typescript changes to remove usage of `any`

## 1.2.0

_2024-12-18_

### Features

- **BREAKING:** instead of taking just the `index`, the following functions all also take in the row as well: `expandedRows`, `rowStyle`, and `rowClassname`.
- (docs) added `contentClassname`, `contentStyle`

## 1.1.0

_2024-12-13_

### Features

- **BREAKING:** `headerCellClassname` and `contentCellClassname` are renamed to `headerClassname` and `contentClassname`.
- For columns, added `headerStyle` and `contentStyle`
- (chore)Fix index.d.ts typos

## 1.0.3

_2024-12-12_

### Bugix

- fix `expandedRows` regression

## 1.0.2

_2024-12-12_

### Bugfix

- `rowHeight` is now respected (again)

## 1.0.1

_2024-12-12_

### Bugfix

- `rowHeight` is now respected
- when there is overflow-x, borders should remain

## 1.0.0

_2024-12-12_

### Features

- **BREAKING:** Removed the following props: `borders`, `rowContainerStyle`, `rowContainerClassname`, `forceReset`, `ref`.
- **BREAKING:** Renamed the following props: `tableStyle` -> `style`.
- no more need for `clearSizeCache` in CellProps or SubComponentProps
- `onExpandRow` now includes the mouse event as an optional parameter
- all jitter should be removed

## 0.6.4

_2024-12-09_

### Bugfix

- Force the sticky header to be the size of the rendered header
- Make sure footer width is 0 when not present

## 0.6.3

_2024-12-04_

### Bugfix

- if the header resizes, the list should re-render

## 0.6.2

_2024-06-19_

### Bugfix

- (Docs) updated types

## 0.6.1

_2024-06-17_

### Bugfix

- `headerHeight` is now passed down appropriately
- less opinionated header styles

## 0.6.0

_2024-06-74_

### Features

- **BREAKING:** `clearSizeCache` signature has changed. The second argument is now an optional object that takes a `forceUpdate` boolean and a `timeout`. Both are optional.
- For columns, added `headerCellClassname` and `contentCellClassname`
- when `headerHeight` is set, the header's height will actually be that height
- _DOCS:_ removed `styled-components` and `semantic`

## 0.5.7

_2024-06-14_

### Bugfix

- `arrayMatch` is now null-safe

## 0.5.6

_2024-06-14_

### Bugfix

- Whenever `columns` changes, the `pixelWidths` are re-calculated

## 0.5.5

_2024-06-13_

### Features

- Update `onRowClick` signature to include the event in one argument

## 0.5.4

_2024-06-13_

### Features

- **BREAKING:** decouples the CSS. Now, at the top of your file, add this:

```jsx
import "react-fluid-table/dist/index.css";
```

## 0.5.3

_2024-06-13_

### Features

- adds `row` and `index` as properties when using `expander`
- adds `onExpandRow` to allow row expansion to be controlled
- adds ability to calculate `expanded` by using a function

## 0.5.2

_2024-05-30_

### Features

- adds `rowContainerStyle` and `rowContainerClassname`

## 0.5.1

_2023-10-04_

### Features

- adds the ability to freeze columns by adding the `frozen` property

## 0.5.0

_2023-10-02_

### Features

- uses a wrapper library to handle observing the table container for width/height changes
- initial flicker for variable-row-size tables should be mitigated
- more typescript specifications

## 0.4.10

_2023-09-30_

### Features

- added ability to specify the `footerHeight`
- removed some typescript warnings
- slight performance tweaks

## 0.4.7

_2023-09-28_

### Features

- added a `footer` prop to each `column` object in the `columns` array. allows the user to create footer cell columns.
- `footerComponent` will still provide a more customizable footer experience
- hopefully fix issues with the auto-calculation of tables when `minTableHeight` and/or `maxTableHeight` is used.
- slimmed down some of the opinionated CSS, giving the user more control over header and body styles

## 0.4.6

_2023-09-28_

### Features

- added `minTableHeight` and `maxTableHeight`
- added footer styling with `footerStyle` and `footerClassname`
- expose column widths to `footerComponent` to help expose widths

## 0.4.5

_2023-09-27_

### Features

- Added the ability to provide a footer using the `footerComponent` property
- If `footerComponent` is defined, can also provide a `stickyFooter` prop to make the footer sticky.
- Since the last deploy, upgraded all the dependencies to fix Dependabot alerts
- Can provide classNames to several different properties to make it more Tailwind friendly
- The example site is powered by Vite as opposed to create-react-app
- The example site is now in Typescript

## 0.4.2

_2020-09-07_

### Bugfix

- Moved the `RowContainer` to its own component. This should resolve the issue of the table cell re-rendering on resize.

## 0.4.1

_2020-09-06_

### Features

- Added the ability to pass in a `ref` to the component in order to access the `scrollTo` and `scrollToItem` functions.

## 0.4.0

_2020-05-05_

### BREAKING

A few changes were made in order to support increased customization, with more to come in future releases.

- The `cell` property in the columns array has been changed. `cell` now renders the entire cell, as opposed to just the contents inside of the cell. This is now an advanced feature.
- `cell` now expects a component that takes in the `style` prop as well. `style` will contain the correct widths of the cell.

```jsx
{
  key: 'id',
  header: 'ID',
  cell: ({ row, style }) => (
    <div style={style}>
      {row.id}
    </div>
  )
}
```

### Features

- Added the `content` property. This property functions exactly how `cell` used to function in previous releases. `content` renders a custom component inside of the default cell.

```jsx
{
  key: 'id',
  header: 'ID',
  content: ({ row }) => row.id
}
```

- For simplicity, added an `onRowClick` property that takes an event and the index of the row that was clicked.

```typescript
type onRowClick = (e: Event, { index }: { index: number }) => void;
```

- Added a `rowRenderer`, which also takes a `style` prop. This is useful if you want to customize the wrapper around the cells in a row.

## 0.3.8

_2020-04-26_

### Features

- added the props `rowStyle`, `tableStyle`, and `headerStyle` to allow for more customization options. Since the Table component does take a `className`, you can still do things using libraries such as `styled-components` if you prefer.

## 0.3.7

_2020-04-19_

### Bug Fixes

- less `setState` calls when updating the default size.

## 0.3.6

_2020-04-19_

### BREAKING

- `estimatedRowHeight` is no longer in use. For tables with no specified `rowHeight`, the median of the rendered row heights is used as a default if the row had not been rendered before.

### Bug Fixes

- Uses memoization in more places.
- reduces row flicker issue when resizing.
