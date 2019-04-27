#!/usr/bin/env node

const program = require('commander');
const { red } = require('colors');
const { run } = require('./core');
const { version } = require('./package.json');

program
  .version(version)
  .description('Contact management system');

program
  .option('-t, --template <template file>', 'custom html template')
  .description('Generate website from markdown source')
  .action(async (source, target, args) => {
    try {
      await run(source, target, args.template);
    } catch (error) {
      console.error(red(error));
    }
  });
program.parse(process.argv);
