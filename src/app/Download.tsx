"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { useZact } from "zact/client";
import { downloadFunction } from "./actions";

interface iDownloadProps {
  downloads: number;
}

const Download: FunctionComponent<iDownloadProps> = ({ downloads }) => {
  const { mutate } = useZact(downloadFunction);
  const [platform, setPlatform] = useState<"mac" | "win" | "linux" | "other">(
    "other"
  );

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) setPlatform("win");
  }, []);

  const _handleDownload = async () => {
    await mutate(downloads);
    let file = "cafeteria-0.1.7.dmg";

    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) file = "cafeteria-0.1.8-setup.exe";

    window.open(`https://coffee-horse.s3.eu-central-1.amazonaws.com/${file}`);
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
        <strong>Download for {platform === "win" ? "Windows" : "MacOS"}</strong>
      </button>
    </>
  );
};

export default Download;
