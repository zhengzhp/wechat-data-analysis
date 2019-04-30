const path = require("path");
const fs = require("fs");
const url = require("url");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(servedUrl, needsSlash) {
  const hasSlash = servedUrl.endsWith("/");
  if (hasSlash && !needsSlash) {
    return servedUrl.substr(servedUrl, servedUrl.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${servedUrl}/`;
  }
  return servedUrl;
}

const getPublicUrl = appPackageJson =>
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  envPublicUrl || require(appPackageJson).homepage;
  /* eslint-enable global-require */
  /* eslint-enable import/no-dynamic-require */

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"),
  appBuild: resolveApp("client/build"),
  appPublic: resolveApp("client/public"),
  appHtml: resolveApp("client/public/index.html"),
  appIndexJs: resolveApp("client/src/index.js"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("client/src"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveApp("client/src/setupTests.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  servedPath: getServedPath(resolveApp("package.json"))
};
