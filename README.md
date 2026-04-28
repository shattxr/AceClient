# AceClient

Custom Starblast.io game client.

## Deployment

Static site — deploy to [Netlify](https://app.netlify.com):

1. Connect this repo to Netlify
2. Build command: *(leave empty)*
3. Publish directory: `.`
4. Deploy

## Structure

```
index.html       — Game HTML shell
css/styles.css   — Game UI styles
js/main.js       — Game engine (Three.js renderer, networking, logic)
netlify.toml     — Netlify config
```

All game assets (images, music, fonts) load from the official `starblast.data.neuronality.com` CDN.
Game servers are connected via WebSocket to `*.starblast.io`.
