# Image conversion helper

This script converts common raster images to AVIF and updates references across the project.

Usage

1. Install dependency:

```bash
npm install sharp
```

2. Run the converter from the project root:

```bash
node tools/convert-images.js
```

Options:
- Pass directories to scan: `node tools/convert-images.js assets public images`

Notes
- The script writes `tools/avif-manifest.json` with mapping of original -> avif.
- It updates references by replacing relative paths and basenames in `*.php, *.html, *.js, *.css, *.ts` files.
- Review changes (use git diff) before committing.
