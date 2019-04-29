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
  .option('-f, --force', 'force generation')
  .description('Generate website from markdown source')
  .action(async (source, target, args) => {
    try {
      await run({
        source, target, userTemplate: args.template, forceGeneration: args.force,
      });
    } catch (error) {
      console.error(red(error));
    }
  });
program.parse(process.argv);
