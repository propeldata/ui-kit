# @propeldata/ui-kit

## 0.12.5

### Patch Changes

- f9ce006: Improved DaraGrid resizing and borders
- 390feca: Enabled sub path imports

## 0.12.4

### Patch Changes

- 691fd76: Fix `Link` export

## 0.12.3

### Patch Changes

- 1dcb01a: - Remove `accentColor` deprecated tag for TimeSeries
  - Rename `accentColors` to `groupByColors` and deprecate `accentColors`

## 0.12.2

### Patch Changes

- f276508: - Fix types for radix exported components
  - Add export for radix Link component

## 0.12.1

### Patch Changes

- f688b6f: Fix type definitions defining interfaces as type

## 0.12.0

### Minor Changes

- ac3eb2b: Added new DataGrid component v1
- 00be816: Added GroupBy component

### Patch Changes

- 382dc2d: Fix unintentional export
- c8ff3a8: Added `defaultOpen` prop

## 0.11.2

### Patch Changes

- c8e6a75: Fix readme image URL
- bd82174: Fix chartConfigProps type definition for TimeSeries

## 0.11.1

### Patch Changes

- 6bee8d0: Remove unnecessary log

## 0.11.0

### Minor Changes

- 8de412c: added support for groupBy on TimeSeries component

### Patch Changes

- e6c6f43: Deprecated `accentColor` in favor of `accentColors`
- 8eda16a: Fix border radius inconsistent
- 1f90bfd: Added Card component to Tabs
- 9df643a: - Leaderboard not working with FilterProvider timeRange
  - PieChart legendPosition wrong type
  - Leaderboard `accentColors` prop

## 0.10.0

### Minor Changes

- 276602c: Added new TimeGrainPicker component

## 0.9.0

### Minor Changes

- 2a75332: Export colors

### Patch Changes

- fde5d2f: Wrap ThemeProvider for components

## 0.8.1

### Patch Changes

- 3aad817: Fix Container not being exported

## 0.8.0

### Minor Changes

- f871bb0: Expose radix components
- 1356f97: - Autocomplete component styles will be consistent with Select component
  - Autocomplete will be clearable and expose a `disableClearable` prop to disable the feature

## 0.7.0

### Minor Changes

- 9eb30cb: - TimeRangePicker will work along with FilterProvider
  - Components will be compatible with RSC and will be exported as client
  - Components will log props mismatch errors

## 0.6.0

### Minor Changes

- 6c2cac3: Migrate to radix colors/theme
- d91d97f: [Button, Divider, FormField, Input, Select, TimeRangePicker, Typography]: added new components

### Patch Changes

- 153289d: Provides a fix for missing Inter font
- aa54d0f: Added Design Tokens synchronization automation from Figma to UI Kit
- d91d97f: Sync all the UI components with new design tokens

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
