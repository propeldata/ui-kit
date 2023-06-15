# Contributing

All contributions are welcome, whether they are technical in nature or not.

Feel free to open a new issue to ask questions, discuss issues or propose enhancements.

The rest of this document describes how to get started developing on this repository.

## What should I know before I get started?

### Propel API

To enable the "Connected" mode in our UI components, we rely on the Propel API. It is important for contributors to understand the functionality of each Propel resource and how the GraphQL API operates. Detailed information about Propel's API can be found in [Propel's documentation](https://www.propeldata.com/docs), which we highly recommend reviewing before making contributions.

### Chart.js

The UI components rely on [Chart.js](https://www.chartjs.org/docs/latest/) for various types of charts, including the Bar Chart and the Line Chart. Familiarity with Chart.js is a prerequisite for effectively working on and enhancing these components.

## Contributing changes

### Preview component changes

There are two ways you can preview changes made to a component:

- Storybook
- React sample apps

#### Storybook

To run Storybook, navigate to the root of the project and execute the command `yarn storybook`. Within Storybook, you will find dedicated stories for each component, allowing you to preview changes in real-time. Use the command `yarn dev` in the component you are working on to observe the changes instantly.

#### React sample apps

The React sample apps are purpose-built UI applications designed for manual component testing. These apps allow you to run a React application using versions 16.8.0, 17.0.0, or 18.0.0. To launch a specific app, navigate to its respective folder and run the command `yarn start`. This will initiate the React application and enable you to explore and interact with the components in the desired React version.

### Manual testing

To thoroughly test your feature or bug fix across different React versions (16.8.0, 17.0.0, and 18.0.0), utilize the React sample apps. These apps are specifically designed for manual testing of components. It is crucial to ensure compatibility with each React version. Keep in mind that using React 17 or React 18 specific features in the components is not permitted, as it would cause compatibility issues with other versions. Maintaining cross-version support is essential for maintaining the functionality of the components.

Feel free to customize the React sample apps according to your needs for testing specific features or bug fixes. However, it is crucial to maintain synchronization of these modifications across all React versions.

### Release Procedure

Every merge to main creates a new release candidate. For example, if we are currently developing 1.2.3, merging to main will create 1.2.3-rc.0. Merging another change to main will create 1.2.3-rc.1, and so on. These release candidates allow us to perform additional testing of the UI Kit in external applications. Once we are satisfied with a release candidate, we will create a proper release for it.

To create a proper release, first

1. **Draft a new Release in GitHub.** You can use [this link](https://github.com/propeldata/ui-kit/releases/new).
    1. Do not choose a tag yet.
    2. Set the title to the version of the UI Kit that will be released (for example, "1.2.3").
    3. Get the list of all pull requests merged since the last release. You can do this by comparing to the last release in GitHub. For example, if the last release was 1.2.2, the following URL will show all the pull requests merged since 1.2.2:
    
        ```
        https://github.com/propeldata/ui-kit/compare/%40propeldata/ui-kit%401.2.3...main
        ```

    4. Combine the release notes from each of the pull requests.
    5. Type them into the GitHub Release and click "Save draft".

2. **Manually trigger the "publish-release" workflow.** Go to the "Actions" tab, click on the "publish-release" workflow, and then click "Run workflow". This will release 1.2.3, publish it to NPM, and create its git tag.

3. **Go back to the GitHub Release, set its tag, and publish it.** The "publish-release" workflow will have created the tag "@propeldata/ui-kit@1.2.3". Choose this for the GitHub Release and click "Publish release".
