# Counter

The Counter component is designed to create Propel counter metric visualizations for your front-end applications. With one prop in Static mode, `value`, the Counter component provides a simple, no-frills way to display your data. If you opt for the Connected mode, the component will accept the query prop, which loads the data automatically based on [Propel specifications](https://studio.apollographql.com/graph/Propel-API/schema/reference/inputs/CounterInput?variant=production).

## Installation

To install the Counter component in your project, use your preferred package manager and run the following command:

With `yarn`:

```shell
yarn add @propeldata/react-counter
```

or `npm`:

```shell
npm install @propeldata/react-counter
```

This will add the component to your `node_modules` folder. You can then import the component in your `React` file and use it as shown in the following example:

```javascript
import { Counter } from '@propeldata/react-counter'

function MonthSalesCount() {
  const queryOptions = {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: 'salesCount',
    timeRange: {
      relative: 'PREVIOUS_MONTH'
    }
  }
  return <Counter query={queryOptions} />
}
```

This will generate a counter component as shown below:

<p align="center">
  <img src="../../../public/images/counter.png">
</p>

As you can see, the component comes unstyled. However, you can customize its styles to your liking. Here's how you can access the style props:

```javascript
function CustomCounter() {
  const styles = {
    font: {
      size: '2rem',
      style: 'italic',
      family: 'Arial',
      weight: 'bold'
    }
  }

  return <Counter styles={styles} />
}
```

<p align="center">
  <img src="../../../public/images/counter-custom.png">
</p>

In this example, we have built a simple span element that can be wrapped into any custom component of your preference. You can adjust these and other style properties to create a unique look for your Counter component.

Here's an example of how you can wrap the Counter component inside a Card to give it a unique look.

<p align="center">
  <img src="../../../public/images/counter-card.png">
</p>

Now let's look at what all you can do with the component. The next 2 topics will cover all the props and styles you can configure to have a nice chart experience.

## Props API

The following table describes the props available for the Counter component:

| **Name**    | **Type**                  | **Required**                                        | **Default**        | **Description**                                                     |
| ----------- | ------------------------- | --------------------------------------------------- | ------------------ | ------------------------------------------------------------------- |
| value       | `string`                  | **Yes** _If `query` is not provided_                | `undefined`        | If passed the component will ignore the built-in graphql operations |
| styles      | `ChartStyles`             | **No**                                              | _See next section_ | Check the styles table below for more information                   |
| prefixValue | `string`                  | **No**                                              | `undefined`        | Symbol to be shown before the value text                            |
| sufixValue  | `string`                  | **No**                                              | `undefined`        | Symbol to be shown after the value text                             |
| loading     | `boolean`                 | **No**                                              | `false`            | When true, shows a skeleton loader                                  |
| localize    | `boolean`                 | **No**                                              | `false`            | When true, formats value to locale string                           |
| query       | _check query table below_ | **Yes** _If `labels` and `values` are not provided_ | `undefined`        | Check the query sub props table below                               |

### `query` sub props

| **Name**    | **Type**                                                                                                                       | **Required** | **Default** | **Description**                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------- | ----------------------------------------- |
| accessToken | `string`                                                                                                                       | **Yes**      | `undefined` | You account's access token                |
| metric      | `string`                                                                                                                       | **Yes**      | `undefined` | Metric unique name                        |
| timeRange   | [TimeRangeInput](https://studio.apollographql.com/graph/Propel-API/schema/reference/inputs/TimeRangeInput?variant=production)  | **Yes**      | `undefined` | Time range that the chart will respond to |
| filters     | Array<[FilterInput](https://studio.apollographql.com/graph/Propel-API/schema/reference/inputs/FilterInput?variant=production)> | **No**       | `undefined` | Filters that the chart will respond to    |
| propeller   | [Propeller](https://studio.apollographql.com/graph/Propel-API/schema/reference/enums/Propeller?variant=production)             | **No**       | `undefined` | Propeller that the chart will respond to  |

## Styles API

The `styles` prop allows you to customize the appearance of the component. It accepts an object of style options, conforming to the `Styles` interface. Below is a table detailing the different options available:

| Prop Name | Type         | Description                               |
| --------- | ------------ | ----------------------------------------- |
| font      | `FontStyles` | Styles for the font used in the component |

### FontStyles

| Prop Name  | Type                                                             | Default   | Description                 |
| ---------- | ---------------------------------------------------------------- | --------- | --------------------------- |
| color      | `string`                                                         | `inherit` | The color of the font       |
| family     | `string`                                                         | `inherit` | The font family to use      |
| size       | `number`                                                         | `inherit` | The size of the font        |
| style      | `'normal'`, `'italic'`, `'oblique'`, `'initial'`, or `'inherit'` | `inherit` | The style of the font       |
| weight     | `string`                                                         | `inherit` | The weight of the font      |
| lineHeight | `number` or `string`                                             | `inherit` | The line height of the font |
