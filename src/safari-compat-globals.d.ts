/**
 * Ambient typings for ES2025 APIs that the project's ES2022 lib does not
 * declare. The runtime implementations live in
 * src/js/utils/safari-compat-polyfills.ts (main threads + the pdf.js worker)
 * and public/pdfjs-viewer/safari-compat-polyfills.js (vendored viewer).
 *
 * These declarations describe what the polyfills provide on every supported
 * browser, so application/test code can call the APIs directly.
 */

interface PromiseConstructor {
  try<T>(fn: (...args: unknown[]) => T, ...args: unknown[]): Promise<T>;
}

interface Uint8Array {
  toHex(): string;
  toBase64(options?: { alphabet?: 'base64' | 'base64url'; omitPadding?: boolean }): string;
}

interface Uint8ArrayConstructor {
  fromBase64(
    base64: string,
    options?: { alphabet?: 'base64' | 'base64url' }
  ): Uint8Array;
}
