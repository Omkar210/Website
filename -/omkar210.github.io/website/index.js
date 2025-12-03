const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

async function main() {
  try {
    const now = moment();
    const timestamp = now.format(); // ISO 8601 format string

    console.log(`Writing data to ${FILE_PATH}...`);
    await jsonfile.writeFile(FILE_PATH, { lastUpdated: timestamp });
    console.log('File written successfully.');

    console.log('Committing and pushing changes...');
    const git = simpleGit();
    const commitMessage = `Update data.json: ${timestamp}`;

    await git.add(FILE_PATH);
    await git.commit(commitMessage, { '--date': timestamp });
    await git.push();
    console.log('Changes have been committed and pushed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();