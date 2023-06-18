const { Octokit } = require("@octokit/core");
const fs = require("fs");

const authToken = process.env.GITHUB_TOKEN;

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
        macInstaller: r.assets.find((a) => a.name.endsWith("dmg")),
        winInstaller: r.assets.find((a) => a.name.endsWith("setup.exe")),
      }));

    return releases;
  } catch (error) {
    console.log(error);
    return [];
  }
};

console.log("Downloading releases...");
console.log("Auth token: ", authToken);
getReleases().then(async (releases) => {
  fs.mkdirSync("public/downloads", { recursive: true });
  const urls = releases
    .flatMap((release) => [release.macInstaller, release.winInstaller])
    .filter(Boolean);

  await Promise.all(
    urls.map(async ({ id, browser_download_url }) => {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/releases/assets/{asset_id}",
        {
          owner: "actegon",
          repo: "cafeteria",
          asset_id: id,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/octet-stream",
          },
        }
      );

      const buffer = Buffer.from(data);

      fs.writeFileSync(
        "public/downloads/" +
          browser_download_url?.split("/").pop()?.split("?")[0],
        buffer
      );
    })
  );

  process.exit(0);
});
