import { kv } from "@vercel/kv";
import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

interface iDownloadProps {
  downloads: number;
}

const Download: FunctionComponent<iDownloadProps> = ({ downloads }) => {
  const _handleClick = async () => {
    "use server";
    await kv.set("downloads", (downloads ?? 0) + 1);
    redirect("/downloads/cafeteria-0.1.7.dmg");
  };
  return (
    <form action={_handleClick}>
      <span className="text-center block  font-medium mb-2 text-sm opacity-75">
        Join {(downloads ?? 0).toLocaleString()} caffeteria customers
      </span>
      <button
        className="hover:scale-105 active:scale-95 transition-all  px-8 py-3 flex flex-col items-center gap-0 cursor-pointer rounded-lg text-lg uppercase font-medium"
        style={{ background: "rgb(165, 68, 55)" }}
        type="submit"
      >
        <strong>Download for MacOS</strong>
      </button>
    </form>
  );
};

export default Download;
