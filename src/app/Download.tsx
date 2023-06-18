"use client";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useZact } from "zact/client";
import { downloadFunction } from "./actions";
import { iRelease } from "./releases/page";

interface iDownloadProps {
  downloads: number;
  release: iRelease;
}

const Download: FunctionComponent<iDownloadProps> = ({
  downloads,
  release,
}) => {
  const { mutate } = useZact(downloadFunction);
  const [platform, setPlatform] = useState<"mac" | "win" | "linux" | "other">(
    "other"
  );

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) setPlatform("win");
  }, []);

  const _handleDownload = async (event: any) => {
    await mutate(downloads);
  };

  const href = useMemo(() => {
    if (platform === "win") return release.winInstaller;
    return release.macInstaller;
  }, [release?.macInstaller, release?.winInstaller, platform]);

  return (
    <>
      <span className="text-center block  font-medium mb-2 text-sm opacity-75">
        Join {(downloads ?? 0).toLocaleString()} happy riders
      </span>
      <a
        href={`/downloads/${href?.split("/").pop()!}`}
        className="hover:scale-105 active:scale-95 transition-all  px-8 py-3 flex flex-col items-center gap-0 cursor-pointer rounded-lg text-lg uppercase font-medium"
        style={{ background: "rgb(165, 68, 55)" }}
        onClick={_handleDownload}
      >
        <strong>Download for {platform === "win" ? "Windows" : "MacOS"}</strong>
      </a>
    </>
  );
};

export default Download;
