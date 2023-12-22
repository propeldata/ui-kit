# Contributing

All contributions are welcome, whether they are technical in nature or not.

Feel free to open a new issue to ask questions, discuss issues or propose enhancements.

The rest of this document describes how to get started developing on this repository.

## What should I know before I get started?

### Propel API

To enable the "Connected" mode in our UI components, we rely on the Propel API. It is important for contributors to
understand the functionality of each Propel resource and how the GraphQL API operates. Detailed information about
Propel's API can be found in [Propel's documentation](https://www.propeldata.com/docs), which we highly recommend
reviewing before making contributions.

### Chart.js

The UI components rely on [Chart.js](https://www.chartjs.org/docs/latest/) for various types of charts, including the
Bar Chart and the Line Chart. Familiarity with Chart.js is a prerequisite for effectively working on and enhancing these
components.

## Contributing changes

### Preview component changes

There are two ways you can preview changes made to a component:

- Storybook
- React sample apps

#### Storybook

To run Storybook, navigate to the root of the project and execute the command `yarn storybook`. Within Storybook, you
will find dedicated stories for each component, allowing you to preview changes in real-time. Use the command `yarn dev`
in the component you are working on to observe the changes instantly.

#### React sample apps

The React sample apps are purpose-built UI applications designed for manual component testing. These apps allow you to
run a React application using versions 16.8.0, 17.0.0, or 18.0.0. To launch a specific app, navigate to its respective
folder and run the command `yarn start`. This will initiate the React application and enable you to explore and interact
with the components in the desired React version.

### Manual testing

To thoroughly test your feature or bug fix across different React versions (16.8.0, 17.0.0, and 18.0.0), utilize the
React sample apps. These apps are specifically designed for manual testing of components. It is crucial to ensure
compatibility with each React version. Keep in mind that using React 17 or React 18 specific features in the components
is not permitted, as it would cause compatibility issues with other versions. Maintaining cross-version support is
essential for maintaining the functionality of the components.

Feel free to customize the React sample apps according to your needs for testing specific features or bug fixes.
However, it is crucial to maintain synchronization of these modifications across all React versions.

### Release Procedure

The release process with [Changesets](https://github.com/changesets/changesets) is designed to automate versioning and
package publishing, streamlining the process for consistency and reliability. Here's how the release process works:

1. Include a changeset file with each pull request by running `npx changeset` or `yarn changeset`. This file describes
   the changes and suggests the appropriate version bump.
2. After merging a pull request, the `publish-release` GitHub Action will automatically create a new PR "Version
   Packages" with the versioning changes.
3. Review the changes in the "Version Packages" Pull Request, which includes the updated package versions and
   changelogs. Once you're satisfied, merge this pull request into the main branch.
4. After merging into the main branch, the `publish-release` GitHub Action will automatically run, triggering
   `npx changeset publish` which publishes the updated packages to NPM, and creates a git tag for the release, which
   will be used to create a GitHub Release.

#### Canary Builds

If you want to test changes before a final release, you can manually trigger the `publish-canary` GitHub Action to
publish a pre-release version, also known as a "canary". This will create a snapshot of your branch and publish it to
NPM under a unique pre-release tag.

1. Go to the Actions tab in GitHub
2. Click on the `publish-canary` workflow
3. Ckick the `Run workflow` button
4. Select the branch of the `publish-canary` action. If you didn't change this action in your branch select the main
   branch.
5. In the "Branch to create a snapshot from" text field enter the name of your branch.
6. Click the green `Run workflow` button
7. Wait for the workflow to complete and check the output for the NPM package name and version.
