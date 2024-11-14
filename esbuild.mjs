import * as esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';

// https://esbuild.github.io/api/#live-reload
let ctx = await esbuild.context({
    entryPoints: ['src/app.tsx'],
    bundle: true,
    //   minify: true,
    //   sourcemap: true,
    plugins: [
        // https://www.npmjs.com/package/esbuild-plugin-tailwindcss
        tailwindPlugin(),
    ],
    outdir: 'dist',
})

await ctx.watch()

let { host, port } = await ctx.serve({
    servedir: 'dist',
})
console.log(`http://${host}:${port}/`)