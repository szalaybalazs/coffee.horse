import { createHash } from "crypto";
import { createReadStream } from "fs";
import { ensureDir } from "fs-extra";
import { NextResponse } from "next/server";
import { join } from "path";

export const GET = async (request: Request) => {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) throw new Error("Missing url parameter");

  const assetResponse = await fetch(url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
  });

  const hash = createHash("sha256");
  hash.update(url);
  const hashed = hash.digest("hex");
  await ensureDir(join(process.cwd(), "temp", "asset"));

  const tempFilePath = join(process.cwd(), "temp", "asset", hashed);

  console.log(tempFilePath);
  const assetStream = createReadStream(tempFilePath);

  await new Promise((resolve, reject) => {
    if (!assetResponse.body) throw new Error("Asset not found");
    assetStream
      .on("error", (error) => reject(error))
      .on("close", () => resolve(true))
      .pipe(assetResponse.body as any);
  });

  // // Set the response headers
  // res.setHeader("Content-Type", "application/octet-stream");
  // res.setHeader(
  //   "Content-Disposition",
  //   `attachment; filename=${encodeURIComponent(assetFilename)}`
  // );

  // // Send the asset file as the response
  // const assetReadStream = createReadStream(tempFilePath);
  // assetReadStream.pipe(res);
  throw new Error("Not implemented");
};
