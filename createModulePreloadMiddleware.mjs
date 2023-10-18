// @ts-check

import path from "node:path";
import resolveLinkRelations from "modulepreload-link-relations/resolveLinkRelations.mjs";
import formatLinkHeaderRelations from "modulepreload-link-relations/formatLinkHeaderRelations.mjs";

/** @typedef {import('express').RequestHandler} RequestHandler **/

const defaultOptions = {
  extensions: ["mjs", "js"],
};

/**
 * Creates a middleware function that adds a Link header containing modulepreload link relationships to JavaScript module requests.
 * @param {string} appPath The relative path to the application root directory, eg "app".
 * @param {Object} [userOptions] The options object.
 * @param {Array<string>} [userOptions.extensions] The file extensions to consider for module scripts.
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

  return async function modulePreloadMiddleware(req, res, next) {
    const url = req.url;
    const file = req.url?.slice(1);
    const fileExt = file && path.extname(file).slice(1);

    if (fileExt && options.extensions.includes(fileExt)) {
      const linkRelations = await resolveLinkRelations({ appPath, url });

      if (linkRelations) {
        res.append("Link", formatLinkHeaderRelations(linkRelations));
      }
    }

    next();
  };
}
