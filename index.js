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
      let what;
      if (commit.message.toLowerCase().includes("release version canary")) {
        core.exportSecret(
          "PUBLISH_PACKAGE_CMD",
          (what = "npm run canaryrelease")
        );
      } else if (
        commit.message.toLowerCase().includes("release version patch")
      ) {
        core.exportSecret(
          "PUBLISH_PACKAGE_CMD",
          (what = "npm run release:patch")
        );
      } else if (
        commit.message.toLowerCase().includes("release version minor")
      ) {
        core.exportSecret(
          "PUBLISH_PACKAGE_CMD",
          (what = "npm run release:minor")
        );
      } else if (
        commit.message.toLowerCase().includes("release version major")
      ) {
        core.exportSecret(
          "PUBLISH_PACKAGE_CMD",
          (what = "npm run release:major")
        );
      }

      if (commit.message.toLowerCase().includes("release version")) {
        if (!what) {
          const err = `ambigous release commit message: should have the format "release version <canary|patch|minor|major>"`;
          console.log(err);
          core.setFailed(err);
          return;
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
              console.log("DONE writing .npmrc");
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
