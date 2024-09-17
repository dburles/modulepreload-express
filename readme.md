# modulepreload-express

Express middleware for generating [modulepreload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload) link relations for a [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) entity-header based on the requested JavaScript modules import graph. This will prevent request waterfalls for nested module imports. Supports import maps.

## Install

```sh
npm i modulepreload-express
```

## Usage example

```js
import express from "express";
import createModulePreloadMiddleware from "modulepreload-express/createModulePreloadMiddleware.mjs";

const app = express();

const APP_ROOT = "app";

app.use(createModulePreloadMiddleware(APP_ROOT));
app.use(express.static(APP_ROOT));

app.listen(3000);
```

## API

### `createModulePreloadMiddleware(path[, options])`

- `path` {string} Path to the application root directory, eg "app".
- `options` {Object}
  - `extensions` {Array&lt;string&gt;} The file extensions to consider for module scripts. Defaults to: `["mjs", "js"]`.
  - `importMap` {string} Import map string.
  - `cache` {Object} A custom (map-like) cache.
