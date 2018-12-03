#!/usr/bin/env node

const program = require('commander');
const { run } = require('./core');
const logger = require('./logger');
const {version} = require('./package.json');

program
  .version(version)
  .description('Contact management system');

program
  .command('generate <source> <target>')
  .alias('g')
  .description('Generate website from markdown source')
  .action(async (source, target) => {
    try {
      await run(source, target);
    } catch (error) {
      logger.error(error.message);
    }
  });

program.parse(process.argv);
