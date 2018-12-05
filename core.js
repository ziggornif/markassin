const util = require('util');
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const mime = require('mime-types');
const {green, red} = require('colors');
const template = require('./template');

const lstat = util.promisify(fs.lstat);
const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);


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
function applyTemplate(content) {
  return template(content);
}

/**
 * Transform markdown content to html
 * @param {string} content file content
 */
function transformMdToHtml(content) {
  let htmlContent = marked(content);
  htmlContent = applyTemplate(htmlContent);
  htmlContent = cleanLinks(htmlContent);
  return htmlContent;
}

/**
 * Generate website from markdown source
 * @param {string} source md source dir
 * @param {string} target html target dir
 */
async function generate(source, target) {
  try {
    const stat = await lstat(source);
    if (stat.isDirectory()) {
      await mkdir(target);
      const files = await readdir(source);
      const promises = [];
      files.forEach((file) => {
        let targetfile = file;
        if (path.parse(file).ext === '.md') {
          targetfile = `${path.parse(file).name}.html`;
        }
        return promises.push(generate(`${source}/${file}`, `${target}/${targetfile}`));
      });
      return Promise.all(promises);
    }
    if(mime.lookup(source) !== 'text/markdown') {
      return copyFile(source, target);
    }
    const fileContent = await readFile(source, 'utf8');
    const htmlContent = transformMdToHtml(fileContent);
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
 */
exports.run = async function run(source, target) {
  let sourceDir = source;
  let targetDir = target;
  if (!path.isAbsolute(source)) {
    sourceDir = path.join(process.cwd(), source);
  }

  if (!path.isAbsolute(target)) {
    targetDir = path.join(process.cwd(), target);
  }
  await generate(sourceDir, targetDir);
  console.log(green(`HTML content successfully generated in ${target}`));
};
