# spa-simple
Simple SPA using [esbuild](https://esbuild.github.io/), [jsx-dom](https://www.npmjs.com/package/jsx-dom) and [tailwindcss](https://www.npmjs.com/package/tailwindcss)

## Overview
All source-files for the app resides in `src` folder. 
Where the `app.jsx` file is your main entry point.
Any custom css goes into the `app.css` file. That's all.

## Getting Started
After installing the dependencies with
```
npm install
```
Run the app with
```
node esbuild.mjs
```
All output-files are inside the `dist` folder, which you can see in the browser by navigating to [http://0.0.0.0:8000/](http://0.0.0.0:8000/).
