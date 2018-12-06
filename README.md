# markassin

Generate a static website from your mardown documentation.

[![Build Status](https://travis-ci.org/drouian-m/markassin.svg?branch=master)](https://travis-ci.org/drouian-m/markassin)
[![Coverage Status](https://coveralls.io/repos/github/drouian-m/markassin/badge.svg?branch=master)](https://coveralls.io/github/drouian-m/markassin?branch=master)

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

### Commands

* `markassin <source> <target>`  Generate website from markdown source

**/!\ Remove target dir if exist**

## Miscellaneous

Generator use Github markdown stylesheet to render html.

## Todo
 - Remove or rename target if already exist