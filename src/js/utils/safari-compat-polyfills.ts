/**
 * Safari-compat polyfills for the modern APIs pdf.js v5.5 calls natively.
 *
 * pdf.js 5.5.207 dropped its guarded fallback utils (the vendored viewer in
 * public/pdfjs-viewer, 5.4.296, still has them) and relies on these, all of
 * which are missing in Safari <= 18.1:
 *
 * - `Promise.try`           (ES2025)  — pdf.js message handlers (main + worker)
 * - `Uint8Array#toHex`      (ES2025)  — document fingerprinting in the worker
 * - `Uint8Array#toBase64`   (ES2025)  — @font-face embedding, signature writing
 * - `Uint8Array.fromBase64` (ES2025)  — signature decompression
 * - Iterator helpers        (ES2025)  — pdf.js viewer "Add signature" dialog
 *   (`Map#keys().map(...)`), main thread only
 *
 * Chrome shipped them in 133/138, Safari only in 18.2. On Safari 18.1 and
 * older, getDocument() rejects with e.g. "TypeError: r.toHex is not a
 * function", which breaks Merge, Split, Sign and every other tool that loads
 * a PDF.
 *
 * This module is injected on every page (navbar partial, before the tool
 * bundles) and at the top of the pdf.js worker entry (pdf.worker.ts), so both
 * the main thread and the worker thread are covered.
 */

export {};

/* ------------------------------------------------------------------ */
/* Promise.try (ES2025)                                                */
/* ------------------------------------------------------------------ */

if (typeof (Promise as { try?: typeof Promise.try }).try !== 'function') {
  const promiseTry = function (
    fn: (...args: unknown[]) => unknown,
    ...args: unknown[]
  ): Promise<unknown> {
    return new Promise((resolve) => {
      resolve(fn(...args));
    });
  };
  Object.defineProperty(Promise, 'try', {
    configurable: true,
    writable: true,
    value: promiseTry,
  });
}

/* ------------------------------------------------------------------ */
/* Uint8Array.prototype.toHex / toBase64, Uint8Array.fromBase64        */
/* ------------------------------------------------------------------ */

const HEX_TABLE = Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, '0')
);

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64URL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

interface ToBase64Options {
  alphabet?: 'base64' | 'base64url';
  omitPadding?: boolean;
}

const proto = Uint8Array.prototype as Uint8Array & {
  toHex?: () => string;
  toBase64?: (options?: ToBase64Options) => string;
};

if (typeof proto.toHex !== 'function') {
  Object.defineProperty(proto, 'toHex', {
    configurable: true,
    writable: true,
    enumerable: false,
    value(this: Uint8Array): string {
      const out = new Array<string>(this.length);
      for (let i = 0; i < this.length; i++) {
        out[i] = HEX_TABLE[this[i] as number];
      }
      return out.join('');
    },
  });
}

if (typeof proto.toBase64 !== 'function') {
  Object.defineProperty(proto, 'toBase64', {
    configurable: true,
    writable: true,
    enumerable: false,
    value(this: Uint8Array, options?: ToBase64Options): string {
      const useUrlAlphabet = options?.alphabet === 'base64url';
      const chars = useUrlAlphabet ? BASE64URL_CHARS : BASE64_CHARS;
      const omitPadding = options?.omitPadding === true;
      let out = '';
      for (let i = 0; i < this.length; i += 3) {
        const b0 = this[i] as number;
        const b1 = i + 1 < this.length ? (this[i + 1] as number) : 0;
        const b2 = i + 2 < this.length ? (this[i + 2] as number) : 0;
        out +=
          chars[b0 >> 2] +
          chars[((b0 & 3) << 4) | (b1 >> 4)] +
          chars[((b1 & 15) << 2) | (b2 >> 6)] +
          chars[b2 & 63];
      }
      const remainder = this.length % 3;
      if (remainder > 0) {
        out = out.slice(0, out.length - (3 - remainder));
        if (!omitPadding) out += '='.repeat(3 - remainder);
      }
      return out;
    },
  });
}

if (typeof (Uint8Array as { fromBase64?: Uint8ArrayConstructor['fromBase64'] }).fromBase64 !== 'function') {
  const fromBase64Compat = function (
    base64: string,
    options?: { alphabet?: 'base64' | 'base64url' }
  ): Uint8Array {
    const useUrlAlphabet = options?.alphabet === 'base64url';
    const chars = useUrlAlphabet ? BASE64URL_CHARS : BASE64_CHARS;
    const charIndex = new Int16Array(128).fill(-1);
    for (let i = 0; i < chars.length; i++) {
      charIndex[chars.charCodeAt(i)] = i;
    }
    // Native semantics: ASCII whitespace is ignored, trailing "=" is padding.
    let clean = base64.replace(/[\t\n\v\f\r ]/g, '');
    const padIndex = clean.indexOf('=');
    if (padIndex !== -1) {
      if (padIndex < clean.length - 2 || !/^=+$/.test(clean.slice(padIndex))) {
        throw new SyntaxError('Invalid base64 string');
      }
      clean = clean.slice(0, padIndex);
    }
    const validLength = clean.length;
    let out: number[] = [];
    for (let i = 0; i < validLength; i += 4) {
      const a = charIndex[clean.charCodeAt(i)] ?? -1;
      const b = i + 1 < validLength ? charIndex[clean.charCodeAt(i + 1)] ?? -1 : 0;
      const c = i + 2 < validLength ? charIndex[clean.charCodeAt(i + 2)] ?? -1 : 0;
      const d = i + 3 < validLength ? charIndex[clean.charCodeAt(i + 3)] ?? -1 : 0;
      if (a < 0 || b < 0 || c < 0 || d < 0) {
        throw new SyntaxError('Invalid base64 string');
      }
      const triple = (a << 18) | (b << 12) | (c << 6) | d;
      out.push((triple >> 16) & 255);
      if (i + 2 < validLength) out.push((triple >> 8) & 255);
      if (i + 3 < validLength) out.push(triple & 255);
    }
    return Uint8Array.from(out);
  };
  Object.defineProperty(Uint8Array, 'fromBase64', {
    configurable: true,
    writable: true,
    value: fromBase64Compat,
  });
}

/* ------------------------------------------------------------------ */
/* Iterator helpers (ES2025)                                           */
/* ------------------------------------------------------------------ */
/*
 * pdf.js's viewer builds a Map of signature-dialog tabs and then calls
 * `this.#tabButtons.keys().map(...)`. `Map#keys()` yields an iterator, so
 * `.map` resolves on %Iterator.prototype% — which Safari only provides from
 * 18.2 (Chrome from 122). Without the helpers the "Add signature" dialog
 * fails with "this.#tabButtons.keys().map is not a function".
 *
 * The full helper suite is installed on the shared iterator prototype, so
 * every iterator (Map/Set keys/values/entries, generators, ...) gets it,
 * matching the native semantics of the proposal.
 */

type IteratorRecord = {
  next(): { done: boolean; value?: unknown };
};

const iteratorProto = (() => {
  try {
    return Object.getPrototypeOf(
      Object.getPrototypeOf(([] as unknown[])[Symbol.iterator]())
    ) as IteratorRecord & Record<string, unknown> | null;
  } catch {
    return null;
  }
})();

function toIteratorRecord(this: unknown): IteratorRecord {
  const it = this as { next?: () => unknown };
  if (typeof it?.next !== 'function') {
    throw new TypeError('Iterator helpers can only be used on iterators');
  }
  const next = (): { done: boolean; value?: unknown } => {
    const r = it.next() as { done?: boolean; value?: unknown };
    if (r === null || typeof r !== 'object') {
      throw new TypeError('Iterator result is not an object');
    }
    return { done: !!r.done, value: r.value };
  };
  return { next };
};

const iteratorSymbol = (): unknown =>
  (typeof Symbol === 'function' ? Symbol.iterator : undefined) as unknown;

interface IteratorHelperDefs {
  map?: (fn: (value: unknown) => unknown) => unknown;
  filter?: (fn: (value: unknown) => unknown) => unknown;
  take?: (limit: number) => unknown;
  drop?: (limit: number) => unknown;
  flatMap?: (fn: (value: unknown) => unknown) => unknown;
  some?: (fn: (value: unknown) => unknown) => boolean;
  every?: (fn: (value: unknown) => unknown) => boolean;
  find?: (fn: (value: unknown) => unknown) => unknown;
  reduce?: (fn: (acc: unknown, value: unknown) => unknown, initial?: unknown) => unknown;
  forEach?: (fn: (value: unknown) => void) => void;
  toArray?: () => unknown[];
}

if (iteratorProto && typeof (iteratorProto as IteratorHelperDefs).map !== 'function') {
  const callable = (fn: unknown): ((value: unknown) => unknown) => {
    if (typeof fn !== 'function') throw new TypeError('Argument is not callable');
    return fn as (value: unknown) => unknown;
  };
  const iterator = Symbol.iterator as unknown as symbol;
  function makeIterator(
    next: () => { done: boolean; value?: unknown }
  ): IteratorRecord {
    const obj: IteratorRecord = { next };
    if (iteratorSymbol() !== undefined) {
      Object.defineProperty(obj, iterator, {
        configurable: true,
        writable: true,
        value: function (this: IteratorRecord): IteratorRecord {
          return this;
        },
      });
    }
    return obj;
  };

  Object.defineProperties(iteratorProto, {
    map: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => unknown): IteratorRecord {
        const mapper = callable(fn);
        const inner = toIteratorRecord.call(this);
        return makeIterator(() => {
          const r = inner.next();
          if (r.done) return { done: true };
          return { done: false, value: mapper(r.value) };
        });
      },
    },
    filter: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => unknown): IteratorRecord {
        const filterer = callable(fn);
        const inner = toIteratorRecord.call(this);
        return makeIterator(() => {
          for (;;) {
            const r = inner.next();
            if (r.done) return { done: true };
            if (filterer(r.value)) return { done: false, value: r.value };
          }
        });
      },
    },
    take: {
      configurable: true,
      writable: true,
      value: function (this: unknown, limit: number): IteratorRecord {
        const n = Number(limit);
        if (!Number.isInteger(n) || n < 0) throw new RangeError('limit must be a non-negative integer');
        let remaining = n;
        const inner = toIteratorRecord.call(this);
        return makeIterator(() => {
          if (remaining-- <= 0) return { done: true };
          const r = inner.next();
          if (r.done) return { done: true };
          return { done: false, value: r.value };
        });
      },
    },
    drop: {
      configurable: true,
      writable: true,
      value: function (this: unknown, limit: number): IteratorRecord {
        const n = Number(limit);
        if (!Number.isInteger(n) || n < 0) throw new RangeError('limit must be a non-negative integer');
        let remaining = n;
        const inner = toIteratorRecord.call(this);
        return makeIterator(() => {
          for (;;) {
            const r = inner.next();
            if (r.done) return { done: true };
            if (remaining > 0) {
              remaining--;
              continue;
            }
            return { done: false, value: r.value };
          }
        });
      },
    },
    flatMap: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => unknown): IteratorRecord {
        const mapper = callable(fn);
        const inner = toIteratorRecord.call(this);
        let current: { next(): { done: boolean; value?: unknown } } | null = null;
        return makeIterator(() => {
          for (;;) {
            if (current) {
              const c = current.next();
              if (!c.done) return c;
              current = null;
            }
            const r = inner.next();
            if (r.done) return { done: true };
            current = toIteratorRecord.call(mapper(r.value));
          }
        });
      },
    },
    some: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => unknown): boolean {
        const pred = callable(fn);
        const inner = toIteratorRecord.call(this);
        for (;;) {
          const r = inner.next();
          if (r.done) return false;
          if (pred(r.value)) return true;
        }
      },
    },
    every: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => unknown): boolean {
        const pred = callable(fn);
        const inner = toIteratorRecord.call(this);
        for (;;) {
          const r = inner.next();
          if (r.done) return true;
          if (!pred(r.value)) return false;
        }
      },
    },
    find: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => unknown): unknown {
        const pred = callable(fn);
        const inner = toIteratorRecord.call(this);
        for (;;) {
          const r = inner.next();
          if (r.done) return undefined;
          if (pred(r.value)) return r.value;
        }
      },
    },
    forEach: {
      configurable: true,
      writable: true,
      value: function (this: unknown, fn: (value: unknown) => void): void {
        const consumer = callable(fn);
        const inner = toIteratorRecord.call(this);
        for (;;) {
          const r = inner.next();
          if (r.done) return;
          consumer(r.value);
        }
      },
    },
    toArray: {
      configurable: true,
      writable: true,
      value: function (this: unknown): unknown[] {
        const out: unknown[] = [];
        const inner = toIteratorRecord.call(this);
        for (;;) {
          const r = inner.next();
          if (r.done) return out;
          out.push(r.value);
        }
      },
    },
    reduce: {
      configurable: true,
      writable: true,
      value: function (
        this: unknown,
        fn: (acc: unknown, value: unknown) => unknown,
        initial?: unknown
      ): unknown {
        const reducer = callable(fn) as (acc: unknown, value: unknown) => unknown;
        const inner = toIteratorRecord.call(this);
        let acc = initial;
        let hasAcc = arguments.length >= 2;
        for (;;) {
          const r = inner.next();
          if (r.done) {
            if (!hasAcc) throw new TypeError('Reduce of empty iterator with no initial value');
            return acc;
          }
          if (hasAcc) {
            acc = reducer(acc, r.value);
          } else {
            acc = r.value;
            hasAcc = true;
          }
        }
      },
    },
  });
}
