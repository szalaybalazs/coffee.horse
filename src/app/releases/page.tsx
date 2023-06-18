import { Octokit } from "@octokit/core";
import { marked } from "marked";
import Link from "next/link";
import { FunctionComponent } from "react";
import Footer from "../Footer";
interface ipageProps {}

export const revalidate = 60;

export const metadata = {
  title: "Release notes | Cafeteria",
  description: "Release notes for Cafeteria - I am working on it, promise! 🤞",
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

export interface iRelease {
  name: string;
  content: string;
  url: string;
  published_at: string;
  macInstaller?: string;
  winInstaller?: string;
}

export const getReleases = async (): Promise<iRelease[]> => {
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
      }))
      .sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      );

    return releases as iRelease[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getLatestRelease = async (): Promise<iRelease | null> => {
  try {
    const { data }: { data: any } = await octokit.request(
      "GET /repos/{owner}/{repo}/releases/latest",
      {
        owner: "actegon",
        repo: "cafeteria",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return {
      name: data.name,
      content: data.body,
      url: data.url,
      published_at: data.published_at ?? "",
      macInstaller: data.assets.find((a: any) => a.name.endsWith("dmg"))
        ?.browser_download_url,
      winInstaller: data.assets.find((a: any) => a.name.endsWith("setup.exe"))
        ?.browser_download_url,
    };
  } catch (error) {
    return null;
  }
};

const buttonClasses =
  "px-4 py-2 hover:scale-105 active:scale-95 transition-all font-medium text-sm bg-[#a54437] rounded-md flex gap-2 items-center";
const page: FunctionComponent<ipageProps> = async () => {
  const releases = await getReleases();
  return (
    <>
      <main className="flex min-h-screen max-w-screen-md mx-auto items-center flex-col pt-16 px-8">
        <Link href="/">
          <img
            src="/extension.png"
            className="max-w-[128px] mb-8 block"
            alt="Cafeteria Icon"
          />
        </Link>
        <h1 className="text-2xl md:text-4xl font-black uppercase mb-4">
          Release Notes
        </h1>
        <h2 className="text-lg md:text-xl font-medium opacity-75 mb-24">
          What&apos;s new in Cafeteria?
        </h2>

        <ul>
          {releases.map((r, i, arr) => (
            <li key={r.name} className="py-4 relative">
              {i < arr.length - 1 && (
                <span className="absolute -left-4 top-8 bottom-0 h-full w-0.5 opacity-25 transform  bg-white text-sm font-medium" />
              )}

              <h2 className="text-lg font-bold mb-2 relative flex items-center">
                <span className="absolute -left-6 rounded-full w-4 h-4 transform bg-white text-sm font-medium" />
                {r.name}
              </h2>
              {r.content && (
                <div
                  className="markdown"
                  dangerouslySetInnerHTML={{ __html: marked.parse(r.content) }}
                />
              )}
              <div className="mt-4 flex gap-2">
                {r.macInstaller && (
                  <a
                    className={buttonClasses}
                    href={`/downloads/${r.macInstaller?.split("?").pop()!}`}
                  >
                     Download for Mac
                  </a>
                )}
                {r.winInstaller && (
                  <a
                    className={buttonClasses}
                    href={`/downloads/${r.winInstaller?.split("?").pop()!}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      version="1.1"
                      viewBox="0 0 48.746 48.746"
                    >
                      <g
                        transform="translate(71.22 -22.579)"
                        fill="currentColor"
                      >
                        <rect
                          x="-71.22"
                          y="22.579"
                          width="23.105"
                          height="23.105"
                        />
                        <rect
                          x="-45.58"
                          y="22.579"
                          width="23.105"
                          height="23.105"
                        />
                        <rect
                          x="-71.22"
                          y="48.221"
                          width="23.105"
                          height="23.105"
                        />
                        <rect
                          x="-45.58"
                          y="48.221"
                          width="23.105"
                          height="23.105"
                        />
                      </g>
                    </svg>
                    Download for Windows
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="block mt-12 text-xl font-medium hover:underline"
        >
          Back to Home
        </Link>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(releases, null, 2)}</pre> */}
        <img className="max-w-screen mt-32" src="/banner.png" />
      </main>
      <Footer />
    </>
  );
};

export default page;
