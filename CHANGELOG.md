# CHANGELOG

## 0.3.7
*2020-04-19*

### Bug Fixes
* less `setState` calls when updating the default size.

## 0.3.6
*2020-04-19*

### BREAKING
* `estimatedRowHeight` is no longer in use. For tables with no specified `rowHeight`, the median of the rendered row heights is used as a default if the row had not been rendered before.

### Bug Fixes
* Uses memoization in more places.
* reduces row flicker issue when resizing.
