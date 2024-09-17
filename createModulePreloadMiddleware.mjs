// @ts-check

import path from "node:path";
import createResolveLinkRelations from "modulepreload-link-relations/createResolveLinkRelations.mjs";
import formatLinkHeaderRelations from "modulepreload-link-relations/formatLinkHeaderRelations.mjs";

/** @typedef {import('express').RequestHandler} RequestHandler **/
/** @typedef {import('modulepreload-link-relations/createResolveLinkRelations.mjs').AsyncMapLike} AsyncMapLike */

const defaultOptions = {
  extensions: ["mjs", "js"],
};

/**
 * Creates a middleware function that adds a Link header containing modulepreload link relationships to JavaScript module requests.
 * @param {string} appPath Path to the application root directory, eg "app".
 * @param {Object} [userOptions] The options object.
 * @param {Array<string>} [userOptions.extensions] The file extensions to consider for module scripts.
 * @param {string} [userOptions.importMap] Import map.
 * @param {AsyncMapLike} [userOptions.cache] A custom cache.
 * @returns {RequestHandler} The middleware function.
 */
export default function createModulePreloadMiddleware(
  appPath,
  userOptions = {},
) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  const resolveLinkRelations = createResolveLinkRelations(appPath, {
    importMap: options.importMap,
    cache: options.cache,
  });

  return async function modulePreloadMiddleware(req, res, next) {
    try {
      const url = req.url;
      const file = req.url?.slice(1);
      const fileExt = file && path.extname(file).slice(1);

      if (fileExt && options.extensions.includes(fileExt)) {
        const linkRelations = await resolveLinkRelations(url);

        if (linkRelations) {
          res.append("Link", formatLinkHeaderRelations(linkRelations));
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
