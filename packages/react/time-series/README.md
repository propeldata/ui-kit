# Time Series

The Time Series component is designed to create Propel time series metric visualizations for your front-end applications. With two props in Static mode, `labels` and `values`, the Time Series component provides a simple way to display your data. If you opt for the Connected mode, the component will accept the query prop, which loads the data automatically based on [Propel specifications](https://studio.apollographql.com/graph/Propel-API/schema/reference/inputs/TimeSeriesInput?variant=production).

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

function MonthSalesChart() {
  const queryOptions = {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: 'salesCount',
    timeRange: {
      relative: 'PREVIOUS_MONTH'
    },
    granularity: 'DAY',
    timestampFormat: 'MM/dd'
  }
  return <TimeSeries query={queryOptions} variant="line" />
}
```

This will generate a time series chart as shown below:

<p align="center">
  <img src="https://ui-kit-propeldata.vercel.app/images/time-series-line.png">
</p>

As you can see, the chart comes with a set of basic styles. However, you can customize it to your liking. Let's build a totally different time series chart now. Here's how you can access the style props:

```javascript
function CustomChart() {
  const styles = {
    styles: {
      line: {
        tension: 0.1,
        borderColor: '#17B897',
        borderWidth: 3
      },
      point: {
        style: false
      },
      canvas: {
        width: 100,
        height: 45,
        backgroundColor: 'transparent',
        hideGridLines: true
      }
    }
  }

  return <TimeSeries styles={styles} variant="line" />
}
```

<p align="center">
  <img src="https://ui-kit-propeldata.vercel.app/images/time-series-custom.png">
</p>

In this example, we built a minimalistic chart where you could use on small viewports or in a mobile design maybe. Up to you! You can adjust these and other style properties to create a unique look for your time series chart.

Now let's look at what all you can do with the component. The next 2 topics will cover all the props and styles you can configure to have a nice chart experience

## Props API

The following table describes the props available for the Time Series component:

| **Name** | **Type**                  | **Required**                                        | **Default**        | **Description**                                                                         |
| -------- | ------------------------- | --------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| variant  | `ChartVariant`            | **No**                                              | `"bar"`            | The variant the chart will respond to, can be either `bar` or `line`                    |
| styles   | `Styles`                  | **No**                                              | _See next section_ | Check the styles table below for more information                                       |
| labels   | `Array<string>`           | **Yes** _If `query` is not provided_                | `undefined`        | If passed along with `values` the component will ignore the built-in graphql operations |
| values   | `Array<number>`           | **Yes** _If `query` is not provided_                | `undefined`        | If passed along with `labels` the component will ignore the built-in graphql operations |
| loading  | `boolean`                 | **No**                                              | `false`            | When true, shows a skeleton loader                                                      |
| query    | _check query table below_ | **Yes** _If `labels` and `values` are not provided_ | `undefined`        | Check the query sub props table below                                                   |

### `query` sub props

| **Name**        | **Type**                                                                                                                       | **Required** | **Default** | **Description**                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------- | --------------------------------------------------------------------------------------------------- |
| accessToken     | `string`                                                                                                                       | **Yes**      | `undefined` | You account's access token                                                                          |
| metric          | `string`                                                                                                                       | **Yes**      | `undefined` | Metric unique name                                                                                  |
| timeRange       | [TimeRangeInput](https://studio.apollographql.com/graph/Propel-API/schema/reference/inputs/TimeRangeInput?variant=production)  | **Yes**      | `undefined` | Time range that the chart will respond to                                                           |
| granularity     | `string`                                                                                                                       | **No**       | `undefined` | Granularity that the chart will respond to                                                          |
| filters         | Array<[FilterInput](https://studio.apollographql.com/graph/Propel-API/schema/reference/inputs/FilterInput?variant=production)> | **No**       | `undefined` | Filters that the chart will respond to                                                              |
| propeller       | [Propeller](https://studio.apollographql.com/graph/Propel-API/schema/reference/enums/Propeller?variant=production)             | **No**       | `undefined` | Propeller that the chart will respond to                                                            |
| timestampFormat | `ISO 8601`                                                                                                                     | **No**       | `"MM/dd"`   | A string representing the format of the timestamps in the data. Default value is ISO 8601 timestamp |

## Styles API

The `styles` prop allows you to customize the appearance of the chart. It accepts an object of style options, conforming to the `Styles` interface. Below is a table detailing the different options available:

| Prop Name | Type            | Description                                                    |
| --------- | --------------- | -------------------------------------------------------------- |
| font      | `FontStyles`    | Styles for the font used in the component                      |
| canvas    | `CanvasStyles`  | Styles for the canvas used in the component                    |
| tooltip   | `TooltipStyles` | Styles for the tooltip displayed on hover                      |
| bar       | `BarStyles`     | Styles for the bars in the chart (only used in `bar` variant)  |
| line      | `LineStyles`    | Styles for the line in the chart (only used in `line` variant) |
| point     | `PointStyles`   | Styles for the points in the chart                             |

### FontStyles

| Prop Name  | Type                                                             | Default   | Description                 |
| ---------- | ---------------------------------------------------------------- | --------- | --------------------------- |
| color      | `string`                                                         | `inherit` | The color of the font       |
| family     | `string`                                                         | `inherit` | The font family to use      |
| size       | `number`                                                         | `inherit` | The size of the font        |
| style      | `'normal'`, `'italic'`, `'oblique'`, `'initial'`, or `'inherit'` | `inherit` | The style of the font       |
| weight     | `string`                                                         | `inherit` | The weight of the font      |
| lineHeight | `number` or `string`                                             | `inherit` | The line height of the font |

### CanvasStyles

| Prop Name       | Type                  | Default                                                         | Description                             |
| --------------- | --------------------- | --------------------------------------------------------------- | --------------------------------------- |
| width           | `number`              | If `undefined` it will take `"100%"` of the parent element size | The width of the canvas in `px`         |
| height          | `number`              | `200`                                                           | The height of the canvas in `px`        |
| hideGridLines   | `boolean`             | `false`                                                         | Whether to hide the grid lines          |
| backgroundColor | `string`              | `"#ffffff"`                                                     | The background color of the canvas      |
| padding         | `ChartPaddingOptions` | `12`                                                            | The padding of the canvas in `px`       |
| borderRadius    | `string`              | `"0px"`                                                         | The border radius of the canvas in `px` |

## Tooltip Styles

| Name            | Type                               | Default     | Description                                  |
| --------------- | ---------------------------------- | ----------- | -------------------------------------------- |
| display         | `boolean`                          | `true`      | Whether to show the tooltip or not.          |
| backgroundColor | `string`                           | `"#ffffff"` | Background color of the tooltip.             |
| borderRadius    | `number`                           | `6`         | Border radius of the tooltip in `px`.        |
| borderColor     | `string`                           | `"#000"`    | Border color of the tooltip.                 |
| borderWidth     | `number`                           | `2`         | Border width of the tooltip in `px`.         |
| color           | `string`                           | `"#000"`    | Text color of the tooltip.                   |
| padding         | `number`                           | `8`         | Padding of the tooltip in `px`.              |
| alignContent    | `"left"`, `"center"`, or `"right"` | `"left"`    | Alignment of the content inside the tooltip. |
| caretSize       | `number`                           | `2`         | Size of the tooltip's caret in `px`.         |

## Bar Styles

| Name                 | Type     | Default     | Description                            |
| -------------------- | -------- | ----------- | -------------------------------------- |
| thickness            | `number` | `20`        | Thickness of the bars in `px`.         |
| borderWidth          | `number` | `1`         | Border width of the bars in `px`.      |
| borderRadius         | `number` | `2`         | Border radius of the bars in `px`.     |
| borderColor          | `string` | `"#94A3B8"` | Border color of the bars.              |
| hoverBorderColor     | `string` | `"#64748B"` | Border color of the bars on hover.     |
| backgroundColor      | `string` | `"#CBD5E1"` | Background color of the bars.          |
| hoverBackgroundColor | `string` | `"#64748B"` | Background color of the bars on hover. |

## Line Styles

| Name        | Type      | Default  | Description                                |
| ----------- | --------- | -------- | ------------------------------------------ |
| tension     | `number`  | `0.4`    | Tension of the line.                       |
| borderColor | `string`  | `"#000"` | Border color of the line.                  |
| borderWidth | `number`  | `2`      | Border width of the line in `px`.          |
| stepped     | `boolean` | `false`  | Whether the line should be stepped or not. |

## Point Styles

| Name                 | Type                                                                                          | Default     | Description                             |
| -------------------- | --------------------------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| style                | `"circle"`, `"cross"`, `"triangle"`, `"rect"`, `"rectRounded"`, or `false` to hide the points | `"circle"`  | Shape of the point.                     |
| radius               | `number`                                                                                      | `3`         | Radius of the point in `px`.            |
| backgroundColor      | `string`                                                                                      | `"#ffffff"` | Background color of the point.          |
| borderColor          | `string`                                                                                      | `"#000"`    | Border color of the point.              |
| borderWidth          | `number`                                                                                      | `1`         | Border width of the point in `px`.      |
| hoverBorderColor     | `string`                                                                                      | `"#000"`    | Border color of the point on hover.     |
| hoverBackgroundColor | `string`                                                                                      | `"#000"`    | Background color of the point on hover. |
