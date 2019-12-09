const core = require("@actions/core");
const fs = require("fs");

// const { GitHub, context } = require("@actions/github");
const { context } = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  try {
    // const github = new GitHub(process.env.GITHUB_TOKEN);

    core.debug(`context: (${JSON.stringify(context)})`);
    const { sha, payload } = context;

    const commit = payload.commits.filter(commit => commit.id === sha);

    if (commit && commit.message) {
      let cmd;
      if (commit.message.toLowerCase().includes("release version canary")) {
        cmd = "npm run canaryrelease";
      } else if (
        commit.message.toLowerCase().includes("release version patch")
      ) {
        cmd = "npm run release:patch";
      } else if (
        commit.message.toLowerCase().includes("release version minor")
      ) {
        cmd = "npm run release:minor";
      } else if (
        commit.message.toLowerCase().includes("release version major")
      ) {
        cmd = "npm run release:major";
      }

      if (commit.message.toLowerCase().includes("release version")) {
        if (!cmd) {
          const err = `ambigous release commit message: should have the format "release version <canary|patch|minor|major>"`;
          core.info(err);
          core.setFailed(err);
          return;
        } else {
          core.exportVariable("PUBLISH_PACKAGE_CMD", cmd);
          core.info("SET ENV VAR PUBLISH_PACKAGE_CMD = " + cmd);
        }
        const PRIVATE_REGISTRY_TOKEN = core.getInput("PRIVATE_REGISTRY_TOKEN");
        // core.setSecret(npmToken);
        // core.setSecret(npmToken);
        fs.writeFile(
          ".npmrc",

          `@adaptabletools:registry=https://registry.adaptabletools.com
//registry.adaptabletools.com/:_authToken=${PRIVATE_REGISTRY_TOKEN}`,
          error => {
            if (error) {
              core.setFailed(error.message);
            } else {
              core.info("DONE writing .npmrc");
            }
          }
        );
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
