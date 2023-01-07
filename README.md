# Propel UI Kit

Customer facing components powered by propel APIs.

The idea behind this project is to enable our customers to achieve their data visualizations without much front-end development experience. This is helpful for teams that don't want to spend resources on building user interfaces that will connect with Propel.

## Tech Stack

- Turborepo (Project structure)
- Github Actions (CI/CD)
- Storybook (Live component documentation)
- React (Main UI library)
- Chart.js (Charts and graphs)
- react-query (Data fetching and cache revalidation)
- Graphql (Query language)
- graphql-codegen (Code/Type generation for graphql and typescript)
- Vercel (Hosting and Infrastructure)

## Installation

Clone the project in your prefered directory:

```bash
git clone git@github.com:propeldata/ui-kit.git
```

Once you are in root, run `yarn install` to install dependecies. After installing the packages you can run `yarn build` at the root level, `turborepo` will trigger build scripts in all packages. You can also opt for running the build script for a specific package like: `cd packages/react/time-series && yarn build` or by running in watch mode `yarn dev`.

This will build up the component, but to see them in runtime, you'll need to start `storybook`.

```bash
yarn storybook
```

Remeber to run `yarn build` first, so storybook can access the compiled code.

## Folder structure

## Type Generation

## Contributing
