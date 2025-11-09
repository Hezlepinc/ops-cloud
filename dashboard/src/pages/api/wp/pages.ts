import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ error: "Missing ?url" });
  try {
    const r = await fetch(url, { headers: { "User-Agent": "OpsCloud/1.0" } as any });
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "fetch failed" });
  }
}


