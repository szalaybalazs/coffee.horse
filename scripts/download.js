const { Octokit } = require("@octokit/core");
const https = require("https");
const fs = require("fs");

// const url =
//   "https://github.com/actegon/cafeteria/releases/download/v0.1.9/cafeteria-0.1.9.dmg";

const authToken = process.env.GITHUB_TOKEN;

const options = {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  log: {
    debug: console.log,
    info: console.log,
    warn: console.log,
    error: console.log,
  },
});

const getReleases = async () => {
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/releases",
      {
        owner: "actegon",
        repo: "cafeteria",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const releases = data
      ?.filter((r) => !r.draft && !r.prerelease && !r.name?.startsWith("0.0"))
      .map((r) => ({
        name: r.name,
        content: r.body,
        url: r.url,
        published_at: r.published_at ?? "",
        macInstaller: r.assets.find((a) => a.name.endsWith("dmg"))
          ?.browser_download_url,
        winInstaller: r.assets.find((a) => a.name.endsWith("setup.exe"))
          ?.browser_download_url,
      }));

    return releases;
  } catch (error) {
    console.log(error);
    return [];
  }
};

function downloadFile(url, originalUrl) {
  https
    .get(url, options, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(
          "public/downloads/" + originalUrl?.split("/").pop()?.split("?")[0]
        );
        response.pipe(file);
        console.log("File downloaded successfully.");
      } else if (response.statusCode === 302) {
        const newUrl = response.headers.location;
        // console.log(`Redirecting to ${newUrl}`);
        downloadFile(newUrl, originalUrl ?? url);
      } else {
        console.log(
          `Failed to download file. Status code: ${response.statusCode}`
        );
      }
    })
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
}

getReleases().then(async (releases) => {
  await Promise.all(
    releases.map(async (release) => {
      if (release.macInstaller) {
        await downloadFile(release.macInstaller);
      }
      if (release.winInstaller) {
        await downloadFile(release.winInstaller);
      }
    })
  );

  process.exit(0);
});
