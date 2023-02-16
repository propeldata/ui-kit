# Propel UI Kit

> Building Better Data Visualizations with Ease

Propel UI Kit is a set of customer-facing components that are powered by Propel APIs. The aim of this project is to simplify the process of creating data visualizations for our customers, even for those who may not have much front-end development experience. This is particularly useful for teams that don't want to allocate resources to building user interfaces that will connect with Propel.

Each component in the Propel UI Kit is connected to one metric and can automatically fetch that metric's data, making it easy for users to create visualizations without having to write custom code. Additionally, the components come with a variety of props that can be used to configure queries based on our [Propel GraphQL API](https://propeldata.com/docs/api/about-the-graphql-api). This enables users to customize the components to suit their specific needs.

Another advantage of the Propel UI Kit is that users can apply their own styles and custom error messages, giving them complete control over the look and feel of their data visualizations.

The components in the Propel UI Kit are available in two modes: "dumb" and "smart". The "dumb" mode is a simpler version of the component, suitable for users who want to quickly build basic visualizations. The "smart" mode is a more advanced version of the component, which offers more flexibility and customization options for more complex visualizations.

Overall, the Propel UI Kit is a powerful tool for front-end developers who want to create engaging, user-friendly data visualizations with ease.

## Dumb Mode

In the "dumb" mode, the component will only display the data you provide and won't fetch any additional data in the background. Let's take our [@propeldata/react-time-series](link to time series readme) component as an example. If you want to fetch the data on your own instead of delegating it to the library, you can do so using the following JavaScript code:

```javascript
import { TimeSeries } from '@propeldata/react-time-series'

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

function MyComponent() {
  return <TimeSeries labels={labels} values={values} />
}
```

This approach makes the component simpler and more efficient, as it only displays the data you provide. You can still customize the component using your own styles.

## Smart Mode: The Power of Propel at one import away

In the "smart" mode, the component will fetch and render the Propel data for you. To use this mode, all you need to do is pass the query prop, which configures the metric query. Here is an example using our [@propeldata/react-time-series](https://github.com/propeldata/ui-kit/tree/main/packages/react/time-series) component:

```javascript
import { TimeSeries } from '@propeldata/react-time-series'

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

function MyComponent() {
  return <TimeSeries labels={labels} values={values} />
}
```

In this mode, our component will handle the loading and error states for you, making it even easier to use.

Wanna see more examples? Checkout our [Storybook](https://ui-kit-propeldata.vercel.app/)!

## Customization: Making It Your Own

The Propel UI Kit was designed to be highly customizable and easy to incorporate into your front-end applications. Here are some of the customization options available to you:

### Styles

You can apply your own custom styles to each component using the Styles interface. This interface includes a wide range of properties to customize your charts, such as font, canvas, tooltip, bar, line, and point. Here is a list of the available properties and their types in our Time Series component:

#### **`font` Property**

| Property   | Type                                                  | Description                                             |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------- |
| color      | string                                                | The color of the font.                                  |
| family     | string                                                | The font family.                                        |
| size       | number or 'inherit'                                   | The font size or 'inherit' to use the parent font size. |
| style      | 'normal', 'italic', 'oblique', 'initial' or 'inherit' | The font style.                                         |
| weight     | string                                                | The font weight.                                        |
| lineHeight | number or string                                      | The line height of the text.                            |

This table describes the **`font`** property, which is used to customize the font of the chart elements.

#### **`canvas` Property**

| Property        | Type                | Description                         |
| --------------- | ------------------- | ----------------------------------- |
| width           | number              | The width of the canvas.            |
| height          | number              | The height of the canvas.           |
| hideGridLines   | boolean             | Whether to hide the grid lines.     |
| backgroundColor | string              | The background color of the canvas. |
| padding         | ChartPaddingOptions | The padding of the canvas.          |
| borderRadius    | string              | The border radius of the canvas.    |

This table describes the **`canvas`** property, which is used to customize the appearance of the chart's canvas.

#### **`tooltip` Property**

| Property        | Type                        | Description                           |
| --------------- | --------------------------- | ------------------------------------- |
| display         | boolean                     | Whether to display the tooltip.       |
| backgroundColor | string                      | The background color of the tooltip.  |
| borderRadius    | number                      | The border radius of the tooltip.     |
| borderColor     | string                      | The border color of the tooltip.      |
| borderWidth     | number                      | The border width of the tooltip.      |
| color           | string                      | The color of the tooltip text.        |
| padding         | number                      | The padding of the tooltip.           |
| alignContent    | 'left', 'center' or 'right' | The alignment of the tooltip content. |
| caretSize       | number                      | The size of the tooltip caret.        |

This table describes the **`tooltip`** property, which is used to customize the appearance of the chart's tooltip.

#### **`bar` Property**

| Property             | Type   | Description                                     |
| -------------------- | ------ | ----------------------------------------------- |
| thickness            | number | The thickness of the bars.                      |
| borderWidth          | number | The border width of the bars.                   |
| borderRadius         | number | The border radius of the bars.                  |
| borderColor          | string | The border color of the bars.                   |
| hoverBorderColor     | string | The border color of the bars when hovering.     |
| backgroundColor      | string | The background color of the bars.               |
| hoverBackgroundColor | string | The background color of the bars when hovering. |

This table describes the **`bar`** property, which is used to customize the appearance of the bars in a bar chart.

#### **`line` Property**

| Property             | Type    | Description                                     |
| -------------------- | ------- | ----------------------------------------------- |
| tension              | number  | The tension of the line.                        |
| stepped              | boolean | Whether to use a stepped line.                  |
| borderWidth          | number  | The border width of the line.                   |
| borderRadius         | number  | The border radius of the line.                  |
| borderColor          | string  | The border color of the line.                   |
| hoverBorderColor     | string  | The border color of the line when hovering.     |
| backgroundColor      | string  | The background color of the line.               |
| hoverBackgroundColor | string  | The background color of the line when hovering. |

This table describes the **`line`** property, which is used to customize the appearance of the lines in a line chart.

#### **`point` Property**

| Property             | Type              | Description                                       |
| -------------------- | ----------------- | ------------------------------------------------- |
| style                | string or boolean | The style of the points.                          |
| radius               | number            | The radius of the points.                         |
| borderWidth          | number            | The border width of the points.                   |
| borderColor          | string            | The border color of the points.                   |
| hoverBorderColor     | string            | The border color of the points when hovering.     |
| backgroundColor      | string            | The background color of the points.               |
| hoverBackgroundColor | string            | The background color of the points when hovering. |

### Error

to be defined...

### Components

To leverage the full power of Propel, check out our currently supported metric components, available for `React` only:

- Time Series
- Counter
- Leaderboard

Built with :purple_heart: and [Chart.js](https://www.chartjs.org/).

## Licence

Propel license
