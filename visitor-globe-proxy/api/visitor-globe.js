// Vercel serverless function: GET /api/visitor-globe
//
// Proxies aggregated visitor-country counts from Umami to the public
// UmamiMaps widget embedded on the About page. Umami's API requires a
// login (API key or username/password), which must never be exposed to
// the browser -- this function holds those credentials server-side (as
// Vercel environment variables) and only ever returns the already-
// aggregated, non-identifying country counts that the globe needs.
//
// Setup: see ../README.md.

import { createUmamiMapsClient } from "umami-maps/server";

// Restrict who is allowed to call this endpoint from a browser. Update if
// you ever move the site to a different domain.
const ALLOWED_ORIGIN = "https://duyhominhnguyen.github.io";

const client = createUmamiMapsClient({
  umamiUrl: process.env.UMAMI_API_URL,
  websiteId: process.env.UMAMI_WEBSITE_ID,
  // Umami Cloud:
  apiKey: process.env.UMAMI_API_KEY,
  // Self-hosted Umami (use instead of UMAMI_API_KEY):
  username: process.env.UMAMI_USERNAME,
  password: process.env.UMAMI_PASSWORD,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const data = await client.getGlobeData();
    // Cache at Vercel's edge for 30 min so we don't hammer the Umami API on
    // every page view; browsers can keep using a stale copy for up to an
    // hour while a fresh one is fetched in the background.
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json(data);
  } catch (err) {
    console.error("visitor-globe proxy error:", err);
    res.status(502).json({ error: "Failed to fetch visitor globe data" });
  }
}
