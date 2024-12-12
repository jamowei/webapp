import * as esbuild from 'esbuild';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';
import * as fs from 'fs';
import * as path from 'path';
import * as proc from 'child_process';

/**
 * Main esbuild build-file.
 * Usage:
 * - build for production:      node build.mjs
 * - serve for development:     node build.mjs serve
 * - build kubernetes manifest: node build.mjs k8s
 */

const mainFile = 'app.tsx';
const mainDir = 'src/main';
const kubernetesFile = 'app.ts';
const kubernetesDir = 'src/kubernetes';
const resourceDir = 'src/resources';
const outputDir = 'out';
const serve = process.argv[2] === 'serve';
const kubernetes = process.argv[2] === 'k8s';

// esbuild main config
const mainConf = {
  entryPoints: [`${mainDir}/${mainFile}`],
  bundle: true,
  minify: !serve,
  sourcemap: serve,
  plugins: [tailwindPlugin()],
  outdir: outputDir,
};

// esbuild kubernetes config
const kubernetesConf = {
  entryPoints: [`${kubernetesDir}/${kubernetesFile}`],
  bundle: true,
  platform: 'node',
  packages: 'external',
  outfile: 'temp.k8.js',
};

if (serve) {
// serves the app (node build.mjs serve)
// or builds it for production (node build.mjs)
  const ctx = await esbuild.context(mainConf);
  await ctx.watch();
  const { host, port } = await ctx.serve({
    port: 3000,
    servedir: mainConf.outdir,
  });
  console.log(`🚀 Serving at http://${host}:${port}/`);
} else if(kubernetes) {
// builds the kubernetes manifest for deployment
  await esbuild.build(kubernetesConf);
  proc.fork(kubernetesConf.outfile).on('exit', (code) => {
    fs.unlinkSync(kubernetesConf.outfile);
  });
} else {
  await esbuild.build(mainConf);
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
})(resourceDir, outputDir);