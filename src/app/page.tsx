import { kv } from "@vercel/kv";
import Download from "./Download";
import Footer from "./Footer";
import { getReleases } from "./releases/page";

export const revalidate = 60;

export default async function Home() {
  const downloads = await kv.get<number>("downloads");

  const [release] = await getReleases();

  return (
    <>
      <main className="flex min-h-screen items-center flex-col pt-16 px-8 text-center">
        <img
          src="/extension.png"
          className="max-w-[128px] mb-8 block"
          alt="Cafeteria Icon"
        />
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-4">
          Cafeteria
        </h1>
        <h2 className="text-lg md:text-2xl font-medium opacity-75 mb-24">
          All-in-one icon generator utility for developers
        </h2>
        <div className="flex gap-4 items-center flex-col">
          <Download release={release} downloads={downloads ?? 0} />
          <span className="text-md font-medium opacity-50">
            Version {release?.name} available for MacOS and Windows
          </span>
        </div>

        <video
          muted
          loop
          autoPlay
          playsInline
          className="max-w-[95vw] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg rounded-lg mt-32"
        >
          <source src="/video.mp4" type="video/mp4" />
          <source src="/video.webm" type="video/webm" />
        </video>
        <h2 className="mt-24 text-4xl font-bold">Main Features</h2>
        <ul className="max-w-screen-sm text-center mt-8 font-medium">
          <li className="mb-6 text-lg ">
            Generate icons <span className="font-bold">for all platforms</span>
            <p className="text-sm opacity-75 font-medium">
              Export all icons with a press of a button for all the common
              platforms like iOS, Android, Windows, macOS and Web - and more
              options coming soon
            </p>
          </li>
          <li className="mb-6 text-lg">
            <span className="font-bold">Customise</span> your icon
            <p className="text-sm opacity-75 font-medium">
              Choose from our presets or create a totally custom icon - the
              choice is yours
            </p>
          </li>
          <li className="mb-6 text-lg">
            <span className="font-bold">Icon variants</span>
            <p className="text-sm opacity-75 font-medium">
              Create multiple variants of the same icon
            </p>
          </li>
          <li className="mb-6 text-lg">
            All the options <span className="font-bold">You need</span>
            <p className="text-sm opacity-75 font-medium">
              Choose from our presets or create a totally custom icon - the
              choice is yours
            </p>
          </li>
          <li className="mb-6 text-lg">
            <span className="font-bold">Git</span> tracking out of the box
            <p className="text-sm opacity-75 font-medium">
              Track changes in your icons with GIT, and never worry about
              accidentally overwriting them
            </p>
          </li>
          <li className="mb-6 text-lg">
            <span className="font-bold">Intiutive</span> design
            <p className="text-sm opacity-75 font-medium">
              Easy to use, with a simple and clean design
            </p>
          </li>
        </ul>
        <img className="max-w-screen mt-32" src="/banner.png" />
      </main>
      <Footer />
    </>
  );
}
