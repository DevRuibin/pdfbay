/**
 * PDFBay Worker — serves the static site assets and proxies the LibreOffice
 * WASM engine (Office -> PDF tools) from a GitHub Release, because Workers
 * static assets cap files at 25 MiB and the engine exceeds that.
 *
 * All other requests are served from the bundled static assets.
 */

const LO_SOURCE_BASE =
  'https://github.com/DevRuibin/pdfbay/releases/download/wasm-v1/';

// Files that the LibreOffice loader requests from the /lo/ base path.
const LO_ALLOWED = new Set([
  'soffice.data.gz',
  'soffice.wasm.gz',
  'soffice.js',
  'soffice.worker.js',
  'browser.worker.global.js',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/lo/')) {
      const name = url.pathname.slice('/lo/'.length);
      if (!LO_ALLOWED.has(name)) {
        return new Response('Not found', { status: 404 });
      }
      const source = LO_SOURCE_BASE + name;
      const headers = new Headers();
      const range = request.headers.get('Range');
      if (range) headers.set('Range', range);
      const upstream = await fetch(source, { headers });

      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Cache-Control', 'public, max-age=604800, immutable');
      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
