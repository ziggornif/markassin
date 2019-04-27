const util = require('util');
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const mime = require('mime-types');
const { green, red } = require('colors');
const rimraf = require('rimraf');
const template = require('./template');

const lstat = util.promisify(fs.lstat);
const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);
const asyncRimraf = util.promisify(rimraf);

/**
 * Transform relative path to absolute
 * @param {*} filePath
 */
function transformPath(filePath) {
  if (!path.isAbsolute(filePath)) {
    return path.join(process.cwd(), filePath);
  }
  return filePath;
}

/**
 * Check if file or directory exists
 * @param {*} filePath
 */
function fileExists(filePath) {
  return new Promise((resolve) => {
    fs.access(filePath, fs.F_OK, error => resolve(!error));
  });
}

/**
 * Clean markdown file links to html file
 * @param {*} content file content
 */
function cleanLinks(content) {
  return content.replace(/.md/g, '.html');
}

/**
 * Apply html template
 * @param {*} content file content
 */
function applyTemplate(content, htmlTemplate) {
  if (htmlTemplate) {
    const customTemplate = require(htmlTemplate);
    return customTemplate(content);
  }
  return template(content);
}

/**
 * Transform markdown content to html
 * @param {string} content file content
 */
function transformMdToHtml(content, htmlTemplate) {
  let htmlContent = marked(content);
  htmlContent = applyTemplate(htmlContent, htmlTemplate);
  htmlContent = cleanLinks(htmlContent);
  return htmlContent;
}

/**
 * Generate website from markdown source
 * @param {string} source md source dir
 * @param {string} target html target dir
 */
async function generate(source, target, htmlTemplate) {
  try {
    const stat = await lstat(source);
    if (stat.isDirectory()) {
      await mkdir(target);
      const files = await readdir(source);
      for (const file of files) {
        let targetfile = file;
        if (path.parse(file).ext === '.md') {
          console.log(`${target}/${targetfile}`);
          targetfile = `${path.parse(file).name}.html`;
        }
        await generate(`${source}/${file}`, `${target}/${targetfile}`, htmlTemplate);
      }
    }
    if (mime.lookup(source) !== 'text/markdown') {
      return copyFile(source, target);
    }
    const fileContent = await readFile(source, 'utf8');
    const htmlContent = transformMdToHtml(fileContent, htmlTemplate);
    return writeFile(target, htmlContent);
  } catch (error) {
    console.error(red('Something wrong during generation', error));
    if (error.code === 'EEXIST') {
      throw new Error('Target already exist, please remove it before running.');
    }
    throw new Error('Fail to generate content from source.');
  }
}

/**
 * Run website generation
 * @param {string} source md source dir
 * @param {string} target html target dir
 * @param {string} customTemplate custom html template file
 */
exports.run = async function run(source, target, customTemplate, forceGeneration) {
  const sourceDir = transformPath(source);
  const targetDir = transformPath(target);

  if (await fileExists(targetDir) && !forceGeneration) {
    throw new Error('Target already exist, please remove it before running.');
  }

  if (forceGeneration) {
    await asyncRimraf(target);
  }

  let htmlTemplate;
  if (customTemplate) {
    htmlTemplate = transformPath(customTemplate);
  }
  await generate(sourceDir, targetDir, htmlTemplate);

  console.info(green(`HTML content successfully generated in ${target}`));
};
