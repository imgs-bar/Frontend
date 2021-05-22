require('dotenv').config();
const darkTheme = require('@ant-design/dark-theme');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const {BugsnagSourceMapUploaderPlugin} = require('webpack-bugsnag-plugins');

if (typeof require !== 'undefined') {
  // eslint-disable-next-line node/no-deprecated-api,no-unused-vars
  require.extensions['.less'] = file => {};
}
module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '💸💸💸 [hash:base62:5]💸💸💸 ',
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
  plugins: [
    new BugsnagSourceMapUploaderPlugin({
      apiKey: '6fc94a87a493f3f0b9f51cb084defc34',
      appVersion: '1.0',
    }),
  ],
  devtool: 'source-map',
});
