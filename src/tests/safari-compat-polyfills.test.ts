import { describe, it, expect } from 'vitest';
import '../js/utils/safari-compat-polyfills.js';

/**
 * The polyfills only install when the host runtime lacks the native APIs
 * (Node < 22.13 / Safari <= 18.1 / Chrome < 133), so these tests exercise
 * exactly the fallback code paths that run on affected browsers.
 *
 * The ES2025 API typings come from src/safari-compat-globals.d.ts.
 */

describe('Promise.try polyfill', () => {
  it('resolves with the function result and forwards args', async () => {
    await expect(Promise.try((a: number, b: number) => a + b, 2, 3)).resolves.toBe(5);
  });

  it('converts a synchronous throw into a rejection', async () => {
    await expect(
      Promise.try(() => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');
  });

  it('unwraps thenables', async () => {
    await expect(Promise.try(() => Promise.resolve(7))).resolves.toBe(7);
  });
});

describe('Uint8Array.prototype.toHex polyfill', () => {
  it('encodes known vectors', () => {
    expect(new Uint8Array([0xde, 0xad, 0xbe, 0xef]).toHex()).toBe('deadbeef');
    expect(new Uint8Array([0x00, 0x0f, 0x10, 0xff]).toHex()).toBe('000f10ff');
    expect(new Uint8Array([0x61]).toHex()).toBe('61');
  });

  it('handles empty input and is lowercase', () => {
    expect(new Uint8Array([]).toHex()).toBe('');
    expect(new Uint8Array([0xab, 0xcd]).toHex()).toBe('abcd');
  });

  it('round-trips through the byte values', () => {
    const bytes = Array.from({ length: 256 }, (_, i) => i);
    const hex = new Uint8Array(bytes).toHex();
    expect(hex).toMatch(/^[0-9a-f]+$/);
    expect(hex.length).toBe(256 * 2);
  });
});

describe('Uint8Array.prototype.toBase64 polyfill', () => {
  it('matches Buffer base64 for a range of lengths', () => {
    for (let len = 0; len <= 20; len++) {
      const bytes = Array.from({ length: len }, (_, i) => (i * 37 + 11) % 256);
      const arr = new Uint8Array(bytes);
      const expected = Buffer.from(bytes).toString('base64');
      expect(arr.toBase64(), `length ${len}`).toBe(expected);
    }
  });

  it('known vectors including padding rules', () => {
    const a = new Uint8Array([0x61]); // "a"
    expect(a.toBase64()).toBe('YQ==');
    expect(a.toBase64({ omitPadding: true })).toBe('YQ');
    const hello = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
    expect(hello.toBase64()).toBe('aGVsbG8=');
  });

  it('base64url alphabet only swaps the character set, padding stays', () => {
    const bytes = new Uint8Array([0xfb, 0xff]); // std base64: "+/8="
    expect(bytes.toBase64({ alphabet: 'base64url' })).toBe('-_8=');
    expect(bytes.toBase64({ alphabet: 'base64url', omitPadding: true })).toBe('-_8');
    expect(bytes.toBase64()).toBe('+/8=');
  });
});

describe('Uint8Array.fromBase64 polyfill', () => {
  it('decodes standard padded base64', () => {
    expect(Uint8Array.fromBase64('YQ==')).toEqual(new Uint8Array([0x61]));
    expect(Uint8Array.fromBase64('aGVsbG8=')).toEqual(
      new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f])
    );
    expect(Uint8Array.fromBase64('')).toEqual(new Uint8Array([]));
  });

  it('tolerates missing padding and ASCII whitespace like the native API', () => {
    expect(Uint8Array.fromBase64('YQ')).toEqual(new Uint8Array([0x61]));
    expect(Uint8Array.fromBase64('Y Q==')).toEqual(new Uint8Array([0x61]));
    expect(Uint8Array.fromBase64('\nYQ==\t')).toEqual(new Uint8Array([0x61]));
  });

  it('supports the base64url alphabet', () => {
    expect(Uint8Array.fromBase64('-_8=', { alphabet: 'base64url' })).toEqual(
      new Uint8Array([0xfb, 0xff])
    );
  });

  it('throws SyntaxError on invalid input', () => {
    expect(() => Uint8Array.fromBase64('aGVsbG8===')).toThrow(SyntaxError);
    expect(() => Uint8Array.fromBase64('not base64!')).toThrow(SyntaxError);
    expect(() => Uint8Array.fromBase64('a=GV')).toThrow(SyntaxError);
  });

  it('round-trips with the toBase64 polyfill', () => {
    const original = new Uint8Array([0, 1, 2, 3, 250, 251, 252, 253, 254, 255]);
    const encoded = original.toBase64();
    expect(Uint8Array.fromBase64(encoded)).toEqual(original);
  });
});

type IterWith<T> = {
  map<U>(fn: (v: T) => U): IterWith<U>;
  filter(fn: (v: T) => unknown): IterWith<T>;
  take(n: number): IterWith<T>;
  drop(n: number): IterWith<T>;
  flatMap<U>(fn: (v: T) => Iterable<U>): IterWith<U>;
  some(fn: (v: T) => unknown): boolean;
  every(fn: (v: T) => unknown): boolean;
  find(fn: (v: T) => unknown): T | undefined;
  forEach(fn: (v: T) => void): void;
  toArray(): T[];
  reduce(fn: (acc: T, v: T) => T, init?: T): T;
  [Symbol.iterator](): IterableIterator<T>;
};
const iterWith = <T,>(it: Iterator<T>): IterWith<T> => it as unknown as IterWith<T>;

describe('Iterator helpers polyfill', () => {
  // The exact pattern the pdf.js viewer "Add signature" dialog uses.
  it('supports Map#keys().map(...) into a new Map', () => {
    const tabButtons = new Map([
      ['type', 'btnT'],
      ['draw', 'btnD'],
    ]);
    const mapped = new Map(iterWith(tabButtons.keys()).map((name) => [name, `x-${name}`]));
    expect(mapped.get('type')).toBe('x-type');
    expect(mapped.get('draw')).toBe('x-draw');
    expect(mapped.size).toBe(2);
  });

  it('chains helpers and stays iterable', () => {
    const result = iterWith([1, 2, 3, 4].values())
      .map((v) => v * 2)
      .filter((v) => v > 4)
      .take(2)
      .toArray();
    expect(result).toEqual([6, 8]);
    expect([...iterWith(new Set(['a', 'b']).keys()).map((k) => k.toUpperCase())]).toEqual(['A', 'B']);
  });

  it('implements the searching/consuming helpers', () => {
    const values = iterWith([5, 10, 15].values());
    expect(values.some((v) => v > 12)).toBe(true);
    expect(iterWith([1, 2, 3].values()).every((v) => v > 0)).toBe(true);
    expect(iterWith([1, 2, 3].values()).find((v) => v === 2)).toBe(2);
    expect(iterWith([1, 2, 3].values()).reduce((a, b) => a + b, 0)).toBe(6);
    expect(iterWith([1, 2, 3].values()).reduce((a, b) => a + b)).toBe(6);
    expect(iterWith([1, 2].values()).drop(1).toArray()).toEqual([2]);
    expect(
      iterWith([1, 2, 3].values()).flatMap((v) => [v, v * 10]).toArray()
    ).toEqual([1, 10, 2, 20, 3, 30]);
    const seen: number[] = [];
    iterWith([1, 2].values()).forEach((v) => seen.push(v));
    expect(seen).toEqual([1, 2]);
  });
});
