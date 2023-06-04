"use client";
import { FunctionComponent } from "react";
import { redirect } from "next/navigation";
import { downloadFunction } from "./actions";
import { useZact } from "zact/client";

interface iDownloadProps {
  downloads: number;
}

const download = () => {
  "use client";
  console.log("alma");
};

const Download: FunctionComponent<iDownloadProps> = ({ downloads }) => {
  const { mutate } = useZact(downloadFunction);

  const _handleDownload = async () => {
    await mutate(downloads);
    window.open(
      "https://coffee-horse.s3.eu-central-1.amazonaws.com/cafeteria-0.1.7.dmg"
    );
  };

  return (
    <>
      <span className="text-center block  font-medium mb-2 text-sm opacity-75">
        Join {(downloads ?? 0).toLocaleString()} happy riders
      </span>
      <button
        className="hover:scale-105 active:scale-95 transition-all  px-8 py-3 flex flex-col items-center gap-0 cursor-pointer rounded-lg text-lg uppercase font-medium"
        style={{ background: "rgb(165, 68, 55)" }}
        onClick={_handleDownload}
      >
        <strong>Download for MacOS</strong>
      </button>
    </>
  );
};

export default Download;
