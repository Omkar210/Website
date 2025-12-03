const random = require('random');
const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';
// The number of days in the past to create commits for.
const DAYS_IN_PAST = 365;
// The maximum number of commits to create per day.
const MAX_COMMITS_PER_DAY = 3;

const makeCommits = async (days, git) => {
  if (days === 0) return;

  // Iterate backwards from today for the specified number of days.
  for (let i = 0; i < days; i++) {
    const date = moment().subtract(i, 'days');
    const commitCount = random.int(1, MAX_COMMITS_PER_DAY);

    // Create a random number of commits for the current day.
    for (let j = 0; j < commitCount; j++) {
      const formattedDate = date.format();
      const data = { date: formattedDate };

      await jsonfile.writeFile(FILE_PATH, data);
      await git.add([FILE_PATH]).commit(`chore: commit for ${date.format('YYYY-MM-DD')}`, { '--date': formattedDate });
    }
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

    await makeCommits(DAYS_IN_PAST, git);

    console.log('Committing and pushing changes...');
    await git.push('origin', 'main', { '--force': null }); // Force push is required for rewriting history
    console.log('Changes have been committed and pushed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();