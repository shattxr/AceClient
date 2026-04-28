# AceClient

Custom Starblast.io game client.

## Deployment

### 1. Deploy the WebSocket Proxy (required)

Starblast.io game servers reject WebSocket connections from non-starblast.io origins.
A WebSocket proxy is needed to relay connections.

**Using Cloudflare Workers (free):**

```bash
cd proxy
npm install
npx wrangler login        # authenticate with Cloudflare
npx wrangler deploy       # deploys to starblast-ws-proxy.<your-subdomain>.workers.dev
```

Copy the deployed Worker URL (e.g. `wss://starblast-ws-proxy.your-name.workers.dev`).

### 2. Configure the Proxy URL

In `index.html`, set your proxy URL:

```html
<script>
    window.STARBLAST_WS_PROXY = "wss://starblast-ws-proxy.your-name.workers.dev";
</script>
```

### 3. Deploy the Game Site

Static site — deploy to [Netlify](https://app.netlify.com):

1. Connect this repo to Netlify
2. Build command: *(leave empty)*
3. Publish directory: `.`
4. Deploy

## Structure

```
index.html            — Game HTML shell
css/styles.css        — Game UI styles
js/main.js            — Game engine (Three.js renderer, networking, logic)
proxy/worker.js       — Cloudflare Worker WebSocket proxy
proxy/wrangler.toml   — Worker deployment config
proxy/package.json    — Worker dependencies
netlify.toml          — Netlify config
```

All game assets (images, music, fonts) load from the official `starblast.data.neuronality.com` CDN.
Server discovery uses `starblast.io/simstatus.json`.
Game connections go through the WebSocket proxy to `*.starblast.io`.
