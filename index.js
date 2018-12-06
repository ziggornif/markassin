#!/usr/bin/env node

const program = require('commander');
const { red } = require('colors');
const { run } = require('./core');
const { version } = require('./package.json');

program
  .version(version)
  .description('Contact management system');

program
  .description('Generate website from markdown source')
  .action(async (source, target) => {
    try {
      await run(source, target);
    } catch (error) {
      console.error(red(error.message));
    }
  });
program.parse(process.argv);
