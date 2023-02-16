# Time Series

The Time Series component is designed to create Propel time series metric visualizations for your front-end applications. With two props in dumb mode, `labels` and `values`, the Time Series component provides a simple, no-frills way to display your data. If you opt for the smart mode, the component will accept the query prop, which loads the data automatically based on [Propel specifications]().

## Installation

To install the Time Series component in your project, use your preferred package manager and run the following command:

With `yarn`:

```shell
yarn add @propeldata/react-time-series
```

or `npm`:

```shell
npm install @propeldata/react-time-series
```

This will add the component to your `node_modules` folder. You can then import the component in your `React` file and use it as shown in the following example:

```javascript
import { TimeSeries } from '@propeldata/react-time-series'

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

function WeekSalesChart() {
  const queryOptions = {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: 'salesCount',
    timeRange: {
      relative: 'LAST_MONTH'
    },
    granularity: 'DAY'
  }
  return <TimeSeries query={queryOptions} />
}
```

This will generate a time series chart as shown below:

[image of the chart]

As you can see, the chart comes with a set of basic styles. However, you can customize it to your liking. Here's how you can access the style props:

```javascript
function CustomChart() {
  const styles = {
    bar: {
      backgroundColor: 'purple'
    },
    tooltip: {
      backgroundColor: 'orange'
    },
    point: {
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth: 2,
      size: 8
    }
  }

  return <TimeSeries styles={styles} />
}
```

[image of the chart]

In this example, we are changing the color of the bars to purple, the color of the tooltips to orange, and the color and size of the points to white and black, respectively. You can adjust these and other style properties to create a unique look for your time series chart.

Now let's look at what you can do with the component. The next 2 topics will cover all the props and styles you can configure to have a nice chart experience

## Props API

The following table describes the props available for the Time Series component:

| Prop Name | Type                                                                                                                                                                                   | Required | Description                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `ChartVariant`                                                                                                                                                                         | No       | The variant the chart will respond to, can be either `bar` or `line`                                                         |
| `styles`  | `Styles`                                                                                                                                                                               | No       | The styles attribute can be either `BarStyles` or `LineStyles`                                                               |
| `labels`  | `TimeSeriesData['labels']`                                                                                                                                                             | No       | If passed along with `values`, the component will ignore the built-in GraphQL operations                                     |
| `values`  | `TimeSeriesData['values']`                                                                                                                                                             | No       | If passed along with `labels`, the component will ignore the built-in GraphQL operations                                     |
| `loading` | `boolean`                                                                                                                                                                              | No       | When true, shows a skeleton loader                                                                                           |
| `query`   | `{ accessToken?: string, metric?: string, timeRange?: TimeRangeInput, granularity?: TimeSeriesGranularity, filters?: FilterInput[], propeller?: Propeller, timestampFormat?: string }` | No       | The object containing the parameters for fetching data. This should eventually be replaced by the customer's app credentials |
| `styles`  | `Styles`                                                                                                                                                                               | No       | The styles to apply to the component. See the `Styles` interface for available properties                                    |
| `error`   | `{ title: string, body: string }`                                                                                                                                                      | No       | The error message to display in case of technical issues                                                                     |

The Styles API contains the following properties that can be used to customize the Time Series component:

| Prop Name | Type            | Description                                                    |
| --------- | --------------- | -------------------------------------------------------------- |
| `font`    | `FontStyles`    | Styles for the font used in the component                      |
| `canvas`  | `CanvasStyles`  | Styles for the canvas used in the component                    |
| `tooltip` | `TooltipStyles` | Styles for the tooltip displayed on hover                      |
| `bar`     | `BarStyles`     | Styles for the bars in the chart (only used in `bar` variant)  |
| `line`    | `LineStyles`    | Styles for the line in the chart (only used in `line` variant) |
| `point`   | `PointStyles`   | Styles for the points in the chart                             |

## Styles API

The `styles` prop allows you to customize the appearance of the chart. It accepts an object of style options, conforming to the `Styles` interface. Below is a table detailing the different options available:

| Prop Name | Type            | Default                               | Description                                                    |
| --------- | --------------- | ------------------------------------- | -------------------------------------------------------------- |
| `font`    | `FontStyles`    | See [default styles](#default-styles) | Styles for the font used in the component                      |
| `canvas`  | `CanvasStyles`  | See [default styles](#default-styles) | Styles for the canvas used in the component                    |
| `tooltip` | `TooltipStyles` | See [default styles](#default-styles) | Styles for the tooltip displayed on hover                      |
| `bar`     | `BarStyles`     | See [default styles](#default-styles) | Styles for the bars in the chart (only used in `bar` variant)  |
| `line`    | `LineStyles`    | See [default styles](#default-styles) | Styles for the line in the chart (only used in `line` variant) |
| `point`   | `PointStyles`   | See [default styles](#default-styles) | Styles for the points in the chart                             |

### FontStyles

| Prop Name    | Type                                                             | Default   | Description                 |
| ------------ | ---------------------------------------------------------------- | --------- | --------------------------- |
| `color`      | `string`                                                         | `inherit` | The color of the font       |
| `family`     | `string`                                                         | `inherit` | The font family to use      |
| `size`       | `number` or `inherit`                                            | `inherit` | The size of the font        |
| `style`      | `'normal'`, `'italic'`, `'oblique'`, `'initial'`, or `'inherit'` | `inherit` | The style of the font       |
| `weight`     | `string`                                                         | `inherit` | The weight of the font      |
| `lineHeight` | `number` or `string`                                             | `inherit` | The line height of the font |

### CanvasStyles

| Prop Name         | Type                  | Default     | Description                        |
| ----------------- | --------------------- | ----------- | ---------------------------------- |
| `width`           | `number`              | `undefined` | The width of the canvas            |
| `height`          | `number`              | `undefined` | The height of the canvas           |
| `hideGridLines`   | `boolean`             | `false`     | Whether to hide the grid lines     |
| `backgroundColor` | `string`              | `'#ffffff'` | The background color of the canvas |
| `padding`         | `ChartPaddingOptions` | `12`        | The padding of the canvas          |
| `borderRadius`    | `string`              | `'0px'`     | The border radius of the canvas    |

## Tooltip Styles

| Name              | Type    | Default            | Description                                                                             |
| ----------------- | ------- | ------------------ | --------------------------------------------------------------------------------------- |
| `display`         | boolean | `true`             | Whether to show the tooltip or not.                                                     |
| `backgroundColor` | string  | `"white"`          | Background color of the tooltip.                                                        |
| `borderRadius`    | number  | `6`                | Border radius of the tooltip.                                                           |
| `borderColor`     | string  | `"cornflowerblue"` | Border color of the tooltip.                                                            |
| `borderWidth`     | number  | `2`                | Border width of the tooltip.                                                            |
| `color`           | string  | `"cornflowerblue"` | Text color of the tooltip.                                                              |
| `padding`         | number  | `8`                | Padding of the tooltip.                                                                 |
| `alignContent`    | string  | `"left"`           | Alignment of the content inside the tooltip. Can be `"left"`, `"center"`, or `"right"`. |
| `caretSize`       | number  | `2`                | Size of the tooltip's caret.                                                            |

## Bar Styles

| Name                   | Type   | Default     | Description                            |
| ---------------------- | ------ | ----------- | -------------------------------------- |
| `thickness`            | number | `20`        | Thickness of the bars.                 |
| `borderWidth`          | number | `1`         | Border width of the bars.              |
| `borderRadius`         | number | `2`         | Border radius of the bars.             |
| `borderColor`          | string | `"#94A3B8"` | Border color of the bars.              |
| `hoverBorderColor`     | string | `"#64748B"` | Border color of the bars on hover.     |
| `backgroundColor`      | string | `"#CBD5E1"` | Background color of the bars.          |
| `hoverBackgroundColor` | string | `"#64748B"` | Background color of the bars on hover. |

## Line Styles

| Name          | Type    | Default  | Description                                |
| ------------- | ------- | -------- | ------------------------------------------ |
| `tension`     | number  | `0.4`    | Tension of the line.                       |
| `borderColor` | string  | `"#000"` | Border color of the line.                  |
| `borderWidth` | number  | `2`      | Border width of the line.                  |
| `stepped`     | boolean | `false`  | Whether the line should be stepped or not. |

## Point Styles

| Name                   | Type              | Default           | Description                                                                                                               |
| ---------------------- | ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `style`                | string or boolean | `"circle"`        | Shape of the point. Can be `"circle"`, `"cross"`, `"triangle"`, `"rect"`, `"rectRounded"`, or `false` to hide the points. |
| `radius`               | number            | `3`               | Radius of the point.                                                                                                      |
| `backgroundColor`      | string            | `"#ffffff"`       | Background color of the point.                                                                                            |
| `borderColor`          | string            | `"#000"`          | Border color of the point.                                                                                                |
| `borderWidth`          | number            | `1`               | Border width of the point.                                                                                                |
| `hoverBorderColor`     | string            | `"rgba(0,0,0,0)"` | Border color of the point on hover.                                                                                       |
| `hoverBackgroundColor` | string            | `"rgba(0,0,0,0)"` | Background color of the point on hover.                                                                                   |
