# markassin

Generate a static website from your mardown documentation.

[![NPM Version](https://img.shields.io/npm/v/markassin.svg)](https://www.npmjs.com/package/markassin)
[![Build Status](https://travis-ci.org/drouian-m/markassin.svg?branch=master)](https://travis-ci.org/drouian-m/markassin)
[![Coverage Status](https://coveralls.io/repos/github/drouian-m/markassin/badge.svg?branch=master)](https://coveralls.io/github/drouian-m/markassin?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/drouian-m/markassin/badge.svg?targetFile=package.json)](https://snyk.io/test/github/drouian-m/markassin?targetFile=package.json)

## Installation

```bash
npm install -g markassin
```

## Use

```bash
markassin <source> <target>
```
![example](./example/example.gif)

### Options

* `-h, --help` output usage information
* `-V, --version` output the version number
* `-t --template` generate html with a custom template
* `-f --force` force generate (erase target dir if exists)

### Commands

* `markassin <source> <target>`  Generate website from markdown source

## Miscellaneous

Generator use Github markdown stylesheet to render html.

## Templating

To generate custom html, markassin accept input template with `--template` `t` param.

### Template format

```js
module.exports = content => `<!DOCTYPE html>
  <html>
  <head>
    head stuff here
  </head>
  <body class="markdown-body">
  ${content} // markdown transformed is injected here
  </body>
  </html>`;
`
```
