require('dotenv').config();
const darkTheme = require('@ant-design/dark-theme');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');

if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}
module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  ...withLess(
    withSass({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: darkTheme.default,
      },
    })
  ),
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
});
