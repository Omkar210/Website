const random = require('random');
const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';
// Set the number of historical commits to create
const COMMIT_COUNT = 10;

const makeCommits = async (n) => {
  if (n === 0) return;

  for (let i = 0; i < n; i++) {
    const git = simpleGit();
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();
    const data = { date };

    await jsonfile.writeFile(FILE_PATH, data);
    await git.add([FILE_PATH]).commit(`chore: historical commit ${i + 1}/${n}`, { '--date': date });
  }
};

async function main() {
  try {
    const git = simpleGit();
    const now = moment();
    const timestamp = now.format(); // ISO 8601 format string

    console.log(`Writing data to ${FILE_PATH}...`);
    await jsonfile.writeFile(FILE_PATH, { lastUpdated: timestamp });
    console.log('File written successfully.');
    await git.add(FILE_PATH);
    await git.commit(`Initial commit for this run: ${timestamp}`, { '--date': timestamp });

    await makeCommits(COMMIT_COUNT);

    console.log('Committing and pushing changes...');
    await git.push('origin', 'main', { '--force': null }); // Force push is required for rewriting history
    console.log('Changes have been committed and pushed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();