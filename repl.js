#!/usr/bin/env node

/* eslint import/no-extraneous-dependencies: 0, global-require: 0, import/no-unresolved: 0, no-console: 0, max-len: 0 */

require('source-map-support').install();
require('babel-polyfill');

const args = require('yargs').argv;

const repl = require('repl');

process.on('unhandledRejection', (err) => {
  console.log(err, err.stack);
});

let packageInfo;
let API;

if (args.local) {
  packageInfo = require('./package.json');
  API = require('./index');
} else {
  packageInfo = require('api/package.json');
  API = require('api');
}

console.log(`Starting ${packageInfo.name} v${packageInfo.version} repl`);
console.log('Enter `help()` for information.');

let api;

if (process.env.API_KEY) {
  api = new API(process.env.API_KEY);
} else {
  console.log([
    'Create an instance by using `api = new API(apikey)`, or restart',
    'the repl with an API_KEY environment variable.',
  ].join(' '));
}

const local = repl.start('$> ');

function help() {
  const helpText = [
    'To try out the API, use the available instance of `api` to make requests.',
    'For example, try writing: `api.Address.all();`',
    'Sample data is also available: toAddress, fromAddress.',
  ].join(' ');

  console.log(helpText);
}

local.context.API = API;
local.context.api = api;
local.context.help = help;