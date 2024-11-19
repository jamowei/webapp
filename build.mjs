import * as esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';

const serve = process.argv[2] === 'serve'

const conf = {
    entryPoints: ['src/app.tsx'],
    bundle: true,
    minify: !serve,
    plugins: [
        // https://www.npmjs.com/package/esbuild-plugin-tailwindcss
        tailwindPlugin(),
    ],
    outdir: 'dist',
}

if (serve) {
    // https://esbuild.github.io/api/#live-reload
    const ctx = await esbuild.context(conf)
    await ctx.watch()
    const { host, port } = await ctx.serve({
        servedir: conf.outdir,
    })
    console.log(`http://${host}:${port}/`)
} else {
    await esbuild.build(conf)
    await esbuild.stop()
}