"use server";
import { kv } from "@vercel/kv";
import { zact } from "zact/server";
import { z } from "zod";

export const downloadFunction = zact(z.number())(async (downloads: number) => {
  await kv.set("downloads", (downloads ?? 0) + 1);

  return true;
});
