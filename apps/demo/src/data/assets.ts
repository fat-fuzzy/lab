// Assets are only generated in client build, but the current markdown pipeline
// only references the assets in the server build. So no assets are emitted.
// This file is imported by +layout.svelte, which Vite will crawl in the client
// build and generate the assets.

// original src: https://github.com/bluwy/website/blob/f1aab96779efede611f91db93f9114f86c2cf105/src/data/assets.js

// ts-ignore
const pageImages = import.meta.glob('../assets/images/pages/*.{png,jpg, svg}')
