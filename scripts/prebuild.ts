import path from 'upath';
import fg from 'fast-glob';
import { build } from 'esbuild';

const patterns = process.argv.slice(2);

async function prebuild() {
  const files = await fg(patterns, {
    ignore: ['**/*.prebuilt.*'],
    absolute: true,
  });

  await Promise.all(
    files.map(async file => {
      const ext = path.extname(file);
      const outputPath = path.resolve(
        path.dirname(file),
        `${path.basename(file, ext)}.prebuilt.js`
      );

      await build({
        entryPoints: [file],
        bundle: true,
        write: true,
        format: 'iife',
        sourcemap: false,
        minify: true,
        target: 'es2015',
        outfile: outputPath,
      });
    })
  );
}

prebuild();
