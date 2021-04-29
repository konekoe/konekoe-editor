# Konekoe online code editor

This project is an online code editor designed for remote online exams. After cloning the repository, you an install dependencies with

``npm install``

Unit tests can be run with:

``npm test``

Additionally, the project includes End-To-End test implemented with [cypress](https://www.cypress.io).

For the E2E test to function, the development server has to be running.

Run the development server with:

``npm start``

It will start in port 8080.

E2E tests can then be run with:

``npm run cypress:run``

By default the tests are run in Electron. To run the tests in a specific browser, a command line argument can be used:

``npm run cypress:run -- --browser chrome``

The above command will try to run the tests with a local install of chrome.

Additionally, E2E tests can be run with:

``npm run cypress:open``

This will open a GUI for controlling the execution.

The project is developed with TypeScript and has to be transpiled for usage outside of testing.

Build with webpack with:

``npm run build``

Notice that the project includes a submodule called *konekoe-editor-release*, which contains the latest build of the project.

## Table of contents
1. [Most important dependencies](#1-most-important-dependencies)
2. [Application architecture](#2-listing-of-.env-values)
3. [Structure of Redux store](#3-structure-of-redux-store)
4. [Descriptions of core components](#4-descriptions-of-core-components)
    1. [CodeEditor](#4-1-codeeditor)
    2. [CodeTerminal](#4-2-codeterminal)
    3. [InfoBox](#4-4-infobox)
5. [Server-Client interface](#5-server-client-interface)

## 1. Most important dependencies

The project is developed with [TypeScript](https://www.typescriptlang.org) and can be transpiled with [webpack](https://webpack.js.org). The *tsconfig.json* contains the project's TypeScript configuration and the *webpack.config.json* file the webpack configuration.

Unit tests are written with [Jest](https://jestjs.io). More specifically, the used preset is *ts-jest* and [ts-jest](https://www.npmjs.com/package/ts-jest) is utilized for preprocessing the tests. The *jest.config.json* file contains the project's jest configuration. Notice the *setupFilesAfterEnv* field which points to the file *setupTests.ts*. This file includes imports for
matchers and mocks utilized by the unit tests.

The UI elements are implemented as [React function components](https://reactjs.org/docs/getting-started.html). Some componentes have their own internal state handled with React hooks, but the entire application also has an internal store implemented with [Redux](https://redux.js.org). The React components utilize [React-Redux](https://react-redux.js.org) for interactions with the store. Additionally, the *web socket message handler* utilizes [Redux-Toolkt](https://redux-toolkit.js.org/usage/usage-with-typescript/).

For styling the UI, the project utilizes [Material-UI](https://material-ui.com).

## 2. Application 

![Diagram of application architecture](docs/img/architecture.png)

In the above diagram, the boxes with a headers are React components. The arrows indicate passing of input values to child elements. Notably, with the React components the input values are passed as React props. 



## 3. Structure of Redux store

## 4. Descriptions of core components

### 4.1. CodeEditor
### 4.2. CodeTerminal
### 4.1. InfoBox

## 5. Server-Client interface