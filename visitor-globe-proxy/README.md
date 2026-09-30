# Visitor globe proxy (UmamiMaps)

This tiny serverless function is what makes the "visitors" globe on the
About page (https://duyhominhnguyen.github.io/) show real countries. It
exists because GitHub Pages only serves static files, but Umami's API
needs a login that can't be put in browser JavaScript -- so this function
runs on Vercel instead, holds the Umami credentials, and hands the widget
only the already-aggregated country counts.

Nothing here is built by Jekyll (it's excluded in `_config.yml`); it's a
separate, self-contained mini project meant to be deployed straight to
Vercel from this folder.

## What's already done for you

- `assets/js/visitor_globe.js` + the `visitors` section in
  `_layouts/about.liquid` -- the globe widget itself, already wired into
  the About page and styled to match the site's light/dark theme.
- `_includes/scripts/analytics.liquid` -- loads the Umami tracking script
  site-wide once you set `visitor_globe.umami_website_id` in `_config.yml`.
- The whole "visitors" section stays hidden until you flip
  `visitor_globe.enabled: true` in `_config.yml`, so there's nothing broken
  to see in the meantime.

## What you still need to do (about 20-30 minutes total)

### 1. Create a free Umami Cloud account and track the site

1. Sign up at https://cloud.umami.is/signup (verify your email, pick a data
   region).
2. In the Umami dashboard, add a new website for
   `duyhominhnguyen.github.io`.
3. Umami will show you a **Website ID** and a tracking snippet -- you only
   need the Website ID, copy it.
4. In your local copy of `_config.yml`, set:
   ```yaml
   visitor_globe:
     umami_website_id: "PASTE-YOUR-WEBSITE-ID-HERE"
   ```
   This alone turns on visitor tracking (the script in
   `analytics.liquid` starts loading site-wide). It's separate from the
   globe widget, so tracking can start collecting data right away even
   before the globe itself goes live.
5. In the Umami dashboard, go to your profile -> **Settings** -> **API
   keys** -> **Create key**, and copy the value immediately (it's only
   shown once).

### 2. Deploy this folder to Vercel

From this `visitor-globe-proxy/` folder:

```bash
cd visitor-globe-proxy
npm install -g vercel   # one-time, if you don't already have it
vercel login            # one-time
vercel                  # deploys this folder; accept the defaults
```

When it asks, link it to a **new** Vercel project (don't reuse an
unrelated one). After the first deploy finishes it prints a URL like
`https://visitor-globe-proxy-xxxx.vercel.app` -- that's your endpoint base.

Then add the environment variables it needs:

```bash
vercel env add UMAMI_API_URL production
# paste: https://api.umami.is

vercel env add UMAMI_WEBSITE_ID production
# paste the Website ID from step 1

vercel env add UMAMI_API_KEY production
# paste the API key from step 1
```

(`.env.example` in this folder lists all the variables, including the
self-hosted-Umami alternative of `UMAMI_USERNAME`/`UMAMI_PASSWORD` instead
of `UMAMI_API_KEY`.)

Redeploy so the new env vars take effect:

```bash
vercel --prod
```

Your live endpoint is then:
`https://<your-project>.vercel.app/api/visitor-globe`

You can sanity-check it directly in a browser or with `curl` -- it should
return JSON, not an error.

### 3. Point the site at your deployed endpoint

In `_config.yml`:

```yaml
visitor_globe:
  enabled: true
  endpoint: "https://<your-project>.vercel.app/api/visitor-globe"
```

Save, rebuild/redeploy the Jekyll site as usual, and the "visitors"
section will appear on the About page. It may look sparse at first since
Umami only has data from the moment tracking went live in step 1.

## If you'd rather revert all of this

A snapshot of the site from right before any of this was added is tagged
locally in git as `backup-before-umami-maps-20260930`. To go back to
exactly how the site looked before:

```bash
git checkout backup-before-umami-maps-20260930 -- .
git commit -m "Revert visitor globe widget"
```

(or `git reset --hard backup-before-umami-maps-20260930` to discard
everything since, including unrelated changes made after that point -- use
`checkout -- .` instead if you want to keep other work). The tag itself
doesn't touch anything until you use it.
