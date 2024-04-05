# @propeldata/ui-kit

## 0.5.5

### Patch Changes

- 903e63d: [Counter, TimeSeries, Leaderboard, PieChart]: fix renderEmpty update logic

## 0.5.4

### Patch Changes

- a7a8439: [Counter, Leaderboard, PieChart, TimeSeries]: pass `query.timeZone` when provided
- 6fdaf48: Provide `cardProps` to customize wrapper `Card` component
- e312913: [TimeSeries, Leaderboard, PieChart] Fix custom chart config logic
- 3952162: [PieChart] Fix chart rendering when Total is hidden
- 62de7e0: [Counter] Adjust the size of ErrorFallback component
- 5b59b82: Add `errorFallback` callback for Error state, `renderLoader` callback for Loading state, and `renderEmpty`
  callback for Empty state.

## 0.5.3

### Patch Changes

- ab2be35: - Fix PieChart empty state when no data is received from blank to a circle
  - Fix ErrorFallback icon color prop not being passed
- a0aec9b: Fixed bug in doughnut chart, where the total did not align correctly when the legend was rendered on the
  right.

## 0.5.2

### Patch Changes

- f358bd4: Added dark theme support for loader
- e7226f3: Fixed errorFallbackProps not being passed correctly
- 59cbf58: Fixed chartConfigProps not passing some props

## 0.5.1

### Patch Changes

- 0e0c645: Fixed query hooks passing object with empty values for timeRange when not passed
- 8eb5fc2: Fixed Pie Chart canvas height and add class to the label list

## 0.5.0

### Minor Changes

- 33eca9e: Add SQL query hook

### Patch Changes

- 30e01c3: Fixed font-family not applying to piechart
- 9797ad6: Refactored PieChart Dimension query prop on receive a single dimension
- 1ff7296: Fixed component and type exports

## 0.4.1

### Patch Changes

- 76537de: Export useDataGrid and useRecordsById

## 0.4.0

### Minor Changes

- f8041e7: Fixed static mode fetching data bug
- 84a9f9b: Add Records By Id query hook
- d12f0e1: Added SimpleFilter component and FilterProvider

### Patch Changes

- 70ad890: Added LIKE and NOT_LIKE filter operators

## 0.3.1

### Patch Changes

- 69273d1: Migrate to Changesets workflow
