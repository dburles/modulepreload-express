# modulepreload-express

Express middleware for generating [modulepreload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload) link relations for a [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) entity-header based on the requested JavaScript modules import graph. This will prevent request waterfalls for nested module imports.

# Install

```sh
npm i modulepreload-express
```

## Usage Example

```js
import express from "express";
import createModulePreloadMiddleware from "modulepreload-express/createModulePreloadMiddleware.mjs";

const app = express();

const APP_ROOT = "app";

app.use(createModulePreloadMiddleware(APP_ROOT));
app.use(express.static(APP_ROOT));

app.listen(3000);
```
