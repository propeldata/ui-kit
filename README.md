<div align="center"><strong>Propel UI Kit</strong></div>
<div align="center">Building Better Data Visualizations with Ease.</div>
<br />

## Introduction

Propel UI Kit is a set of customer-facing components that are powered by Propel APIs. The aim of this project is to simplify the process of creating data visualizations for our customers, even for those who may not have much front-end development experience. This is particularly useful for teams that don't want to allocate resources to building user interfaces that will connect with Propel.

Each component in the Propel UI Kit is connected to one metric and can automatically fetch that metric's data, making it easy for users to create visualizations without having to write custom code. Additionally, the components come with a variety of props that can be used to configure queries based on our [Propel GraphQL API](https://propeldata.com/docs/api/about-the-graphql-api). This enables users to customize the components to suit their specific needs.

Another advantage of the Propel UI Kit is that users can apply their own styles and custom error messages, giving them complete control over the look and feel of their data visualizations.

## Getting Started

To leverage the full power of Propel, you'll need a Propel account and a metric to work with. If you don't have an account yet, you can follow the instructions in [this article](https://propeldata.com/docs/metrics) to get started.

Once you have your account set up, you'll need to provide your account's access token to use Propel APIs. You can authenticate and generate an access token by following the steps outlined in [this article](https://propeldata.com/docs/api/authentication#step-2-generate-an-access-token).

With your metric and access token in hand, it's time to start using Propel UI Kit. Currently, the UI Kit is available for React only and supports the following metric components:

- [Time Series](https://github.com/propeldata/ui-kit/tree/main/packages/react/time-series)
- [Counter](https://github.com/propeldata/ui-kit/tree/main/packages/react/counter)
- [Leaderboard](https://github.com/propeldata/ui-kit/tree/main/packages/react/leaderboard)

Now let's understand how you can integrate Propel UI Kit with your front-end application.

## Usage

The components in the Propel UI Kit are available in two modes: "Static" and "Connected". The "Static" mode is a simpler version of the component, suitable for users who want to quickly build basic visualizations or handle server data themselves. The "Connected" mode is a more advanced version of the component, which offers out-of-the-box integration with propel APIs. You don't need to configure a GraphQL client, handle loading and error states. You don't even need to know what the Propel API endpoint is.

Overall, the Propel UI Kit is a powerful tool for front-end developers who want to create engaging, user-friendly data visualizations with ease.

### Static Mode

In the "Static" mode, the component will only display the data you provide and won't fetch any additional data in the background. Let's take our [@propeldata/react-time-series](link to time series readme) component as an example. If you want to fetch the data on your own instead of delegating it to the library, you can do so using the following JavaScript code:

```javascript
import { TimeSeries } from '@propeldata/react-time-series'

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

function WeekSalesChart() {
  return <TimeSeries labels={labels} values={values} />
}
```

This approach makes the component simpler and more efficient, as it only displays the data you provide. You can still customize the component using your own styles.

<p align="center">
  <img src="https://storybook.propeldata.com/images/time-series.png">
</p>

### Connected Mode: The Power of Propel at one import away

In the "Connected" mode, the component will fetch and render the Propel data for you. To use this mode, all you need to do is pass the query prop, which configures the metric query. Here is an example using our [@propeldata/react-counter](https://github.com/propeldata/ui-kit/tree/main/packages/react/time-series) component:

```javascript
import { Counter } from '@propeldata/react-counter'

function SalesCountLabel() {
  const queryOptions = {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: 'salesCount',
    timeRange: {
      relative: 'PREVIOUS_WEEK'
    },
    granularity: 'DAY'
  }

  return (
    <p>
      We reached <Counter query={queryOptions} /> last week.
    </p>
  )
}
```

In this mode, our component will handle the loading and error states for you, making it even easier to use.

<p align="center">
  <img src="https://storybook.propeldata.com/images/counter.gif">
</p>

Wanna see more examples? Checkout our [Storybook](https://storybook.propeldata.com/)!

## Customization: Making It Your Own

The Propel UI Kit was designed to be highly customizable and easy to incorporate into your front-end applications. Here are some of the customization options available to you:

### Styles

You can apply your own custom styles to each component using the Styles interface. This interface includes a wide range of properties to customize your charts, such as font, canvas, tooltip, bar, line, and point.

For example, to change the color of the bars in your time series chart, you can use the following JavaScript code:

```javascript
function MyChart() {
  // source code

  const styles = {
    bar: {
      backgroundColor: '#532AB4'
    }
  }

  return <TimeSeries styles={styles} />
}
```

This will change the color of the bars to a shade of purple, as shown in the following image:

<p align="center">
  <img src="https://storybook.propeldata.com/images/time-series-purple.png">
</p>

### Errors

You can also provide your own custom error messages by using the error prop. This will enable you to provide more accurate feedback to your users in case of technical errors or other issues.

For example, to display a custom error message when the chart data cannot be loaded, you can use the following JavaScript code:

```javascript
function MyChart() {
  // source code

  const title = 'Unable to connect'
  const body = 'Sorry we are not able to connect at this time due to a technical error.'

  return <TimeSeries error={{ title, body }} />
}
```

This will display a custom error message with a title and body text, as shown in the following image:

<p align="center">
  <img src="https://storybook.propeldata.com/images/error.png">
</p>

By customizing your Propel UI Kit components in this way, you can create unique, user-friendly data visualizations that fit seamlessly into your front-end applications.

Made with :purple_heart: and [Chart.js](https://www.chartjs.org/). Powered by Propel! :rocket:

## Licence

Propel license
