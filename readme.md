# Vue 2.0 Server-Rendered Lazy Routes Error Demo

This repo demonstrates an issue with code splitting via webpack in a Vue 2.0
server-rendered app.

## Install & Run
To get started, `git clone` this repo, `cd` into it, then either run `npm install` or `yarn`. Then, run `npm start`.
Once that's done, navigate to http://localhost:5000.

> **Note**: There is no "development" mode as it is out of the scope of this demonstration.

## The Issue

Have a look at [src/router.js](src/router.js) - You'll notice a big block of comments.
These comments describe various ways of importing the top-level views for two routes: `/` (Home) & `/foo` (Foo)

The uncommented `import` statements work, but this is not code-splitting. The first three commented code snippets
are respective ways of enabling code-splitting, but they all trigger a `module not found` error when trying to locate
the respective lazy chunks.

The final code snippet involves checking a build-time variable to determine whether or not we're running on the server -
if we are running on the server, the modules are just `require`d in as normal with no code-splitting.
Otherwise if we're on the client, we trigger code splitting. This method works - it's able to find the modules just fine
without any errors on the server - however, Vue logs an error on the client side that claims that the DOM and VNode do not match,
notifying us that it has bailed hydration and instead re-rendered the entire application.
