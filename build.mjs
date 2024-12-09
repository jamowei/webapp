import * as esbuild from 'esbuild';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';
import * as fs from 'fs';
import * as path from 'path';

const appJs = 'app.tsx';
const appDir = 'src/main';
const resDir = 'src/resources';
const outDir = 'out';
const serve = process.argv[2] === 'serve';

// esbuild config
const conf = {
  entryPoints: [`${appDir}/${appJs}`],
  bundle: true,
  minify: !serve,
  plugins: [tailwindPlugin()],
  outdir: outDir,
};

// serves the app (node build.mjs serve)
// or builds it for production (node build.mjs)
if (serve) {
  const ctx = await esbuild.context(conf);
  await ctx.watch();
  const { host, port } = await ctx.serve({
    port: 3000,
    servedir: conf.outdir,
  });
  console.log(`🚀 Serving at http://${host}:${port}/`);
} else {
  await esbuild.build(conf);
  await esbuild.stop();
}

// copy static resources to output dir
(function copyFiles(sourceDir, targetDir) {
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error('Error reading resource directory:', err);
      return;
    }
    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      fs.cpSync(sourceFile, targetFile, { recursive: true });
    });
  });
})(resDir, outDir);