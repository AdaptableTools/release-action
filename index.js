const core = require("@actions/core");

const { context } = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  try {
    // const github = new GitHub(process.env.GITHUB_TOKEN);

    core.debug(`context: (${JSON.stringify(context)})`);
    // const { ref } = context;
    // const commit = await github.git.getCommit(ref);

    // core.debug(`commit: ${JSON.stringify(commit)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
