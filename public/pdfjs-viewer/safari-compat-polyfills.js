/**
 * Safari-compat polyfills (plain JS) for the vendored pdf.js viewer.
 *
 * pdf.js 5.x calls APIs that only ship in Safari 18.2+: `Promise.try`
 * (ES2025) in its message/stream handlers, the `Uint8Array` hex/base64
 * methods (from 5.5), and iterator helpers — the "Add signature" dialog
 * does `Map#keys().map(...)`. Safari 18.1 and older throw TypeError for
 * all of these, which leaves the viewer stuck on "initializing" and
 * breaks Sign / Form Fill / Stamps.
 *
 * This file is loaded by `viewer.html` (before pdf.mjs) and imported at
 * the top of `pdf.worker.mjs`, so both threads are covered. It must stay
 * dependency-free plain ES2017 — it is the very thing that makes old
 * Safari run the rest of the bundle.
 *
 * Keep the API surface in sync with src/js/utils/safari-compat-polyfills.ts
 * (which covers the app's own pdfjs-dist 5.5.207 bundle).
 */

(function () {
  'use strict';

  /* Promise.try (ES2025) */
  if (typeof Promise.try !== 'function') {
    Object.defineProperty(Promise, 'try', {
      configurable: true,
      writable: true,
      value: function promiseTry(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return new Promise(function (resolve) {
          resolve(fn.apply(undefined, args));
        });
      }
    });
  }

  /* Uint8Array.prototype.toHex (ES2025) */
  var HEX_TABLE = [];
  for (var i = 0; i < 256; i++) {
    HEX_TABLE.push(i.toString(16).padStart(2, '0'));
  }
  if (typeof Uint8Array.prototype.toHex !== 'function') {
    Object.defineProperty(Uint8Array.prototype, 'toHex', {
      configurable: true,
      writable: true,
      value: function toHex() {
        var out = new Array(this.length);
        for (var j = 0; j < this.length; j++) {
          out[j] = HEX_TABLE[this[j]];
        }
        return out.join('');
      }
    });
  }

  /* Uint8Array.prototype.toBase64 (ES2025) */
  if (typeof Uint8Array.prototype.toBase64 !== 'function') {
    var B64 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var B64URL =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    Object.defineProperty(Uint8Array.prototype, 'toBase64', {
      configurable: true,
      writable: true,
      value: function toBase64(options) {
        var url = !!(options && options.alphabet === 'base64url');
        var chars = url ? B64URL : B64;
        var omit = !!(options && options.omitPadding);
        var out = '';
        for (var k = 0; k < this.length; k += 3) {
          var b0 = this[k];
          var b1 = k + 1 < this.length ? this[k + 1] : 0;
          var b2 = k + 2 < this.length ? this[k + 2] : 0;
          out +=
            chars[b0 >> 2] +
            chars[((b0 & 3) << 4) | (b1 >> 4)] +
            chars[((b1 & 15) << 2) | (b2 >> 6)] +
            chars[b2 & 63];
        }
        var rem = this.length % 3;
        if (rem > 0) {
          out = out.slice(0, out.length - (3 - rem));
          if (!omit) out += '='.repeat(3 - rem);
        }
        return out;
      }
    });
  }

  /* Uint8Array.fromBase64 (ES2025) */
  if (typeof Uint8Array.fromBase64 !== 'function') {
    var fromBase64 = function fromBase64(str, options) {
      var url = !!(options && options.alphabet === 'base64url');
      var chars = url ? B64URL : B64;
      var idx = new Int16Array(128).fill(-1);
      for (var c = 0; c < chars.length; c++) {
        idx[chars.charCodeAt(c)] = c;
      }
      var clean = String(str).replace(/[\t\n\v\f\r ]/g, '');
      var pad = clean.indexOf('=');
      if (pad !== -1) {
        if (pad < clean.length - 2 || !/^=+$/.test(clean.slice(pad))) {
          throw new SyntaxError('Invalid base64 string');
        }
        clean = clean.slice(0, pad);
      }
      var len = clean.length;
      var bytes = [];
      var lookup = function (ch) {
        var v = ch < 128 ? idx[ch] : undefined;
        return v === undefined ? -1 : v;
      };
      for (var g = 0; g < len; g += 4) {
        var a = lookup(clean.charCodeAt(g));
        var b = g + 1 < len ? lookup(clean.charCodeAt(g + 1)) : 0;
        var e = g + 2 < len ? lookup(clean.charCodeAt(g + 2)) : 0;
        var d = g + 3 < len ? lookup(clean.charCodeAt(g + 3)) : 0;
        if (a < 0 || b < 0 || e < 0 || d < 0) {
          throw new SyntaxError('Invalid base64 string');
        }
        var triple = (a << 18) | (b << 12) | (e << 6) | d;
        bytes.push((triple >> 16) & 255);
        if (g + 2 < len) bytes.push((triple >> 8) & 255);
        if (g + 3 < len) bytes.push(triple & 255);
      }
      return Uint8Array.from(bytes);
    };
    Object.defineProperty(Uint8Array, 'fromBase64', {
      configurable: true,
      writable: true,
      value: fromBase64
    });
  }

  /* Iterator helpers (ES2025) — signature dialog uses Map#keys().map(...) */
  var iteratorProto = (function () {
    try {
      return Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
    } catch (e) {
      return null;
    }
  })();
  if (iteratorProto && typeof iteratorProto.map !== 'function') {
    function iteratorRecord(obj) {
      if (!obj || typeof obj.next !== 'function') {
        throw new TypeError('Iterator helpers can only be used on iterators');
      }
      return obj;
    }
    function chainable(nextFn) {
      var iter = { next: nextFn };
      if (typeof Symbol !== 'undefined') {
        iter[Symbol.iterator] = function () { return this; };
      }
      return iter;
    }
    function callable(fn) {
      if (typeof fn !== 'function') throw new TypeError('Argument is not callable');
      return fn;
    }
    function limitArg(n) {
      var v = Number(n);
      if (!isFinite(v) || Math.floor(v) !== v || v < 0) {
        throw new RangeError('limit must be a non-negative integer');
      }
      return v;
    }

    var defs = {};
    defs.map = function (fn) {
      var mapper = callable(fn);
      var inner = iteratorRecord(this);
      return chainable(function () {
        var r = inner.next();
        if (r.done) return { done: true };
        return { done: false, value: mapper(r.value) };
      });
    };
    defs.filter = function (fn) {
      var f = callable(fn);
      var inner = iteratorRecord(this);
      return chainable(function () {
        for (;;) {
          var r = inner.next();
          if (r.done) return { done: true };
          if (f(r.value)) return { done: false, value: r.value };
        }
      });
    };
    defs.take = function (n) {
      var remaining = limitArg(n);
      var inner = iteratorRecord(this);
      return chainable(function () {
        if (remaining <= 0) return { done: true };
        remaining--;
        var r = inner.next();
        if (r.done) return { done: true };
        return { done: false, value: r.value };
      });
    };
    defs.drop = function (n) {
      var remaining = limitArg(n);
      var inner = iteratorRecord(this);
      return chainable(function () {
        for (;;) {
          var r = inner.next();
          if (r.done) return { done: true };
          if (remaining > 0) { remaining--; continue; }
          return { done: false, value: r.value };
        }
      });
    };
    defs.flatMap = function (fn) {
      var mapper = callable(fn);
      var inner = iteratorRecord(this);
      var current = null;
      return chainable(function () {
        for (;;) {
          if (current) {
            var c = current.next();
            if (!c.done) return c;
            current = null;
          }
          var r = inner.next();
          if (r.done) return { done: true };
          current = iteratorRecord(mapper(r.value));
        }
      });
    };
    defs.some = function (fn) {
      var f = callable(fn);
      var inner = iteratorRecord(this);
      for (;;) {
        var r = inner.next();
        if (r.done) return false;
        if (f(r.value)) return true;
      }
    };
    defs.every = function (fn) {
      var f = callable(fn);
      var inner = iteratorRecord(this);
      for (;;) {
        var r = inner.next();
        if (r.done) return true;
        if (!f(r.value)) return false;
      }
    };
    defs.find = function (fn) {
      var f = callable(fn);
      var inner = iteratorRecord(this);
      for (;;) {
        var r = inner.next();
        if (r.done) return undefined;
        if (f(r.value)) return r.value;
      }
    };
    defs.forEach = function (fn) {
      var f = callable(fn);
      var inner = iteratorRecord(this);
      for (;;) {
        var r = inner.next();
        if (r.done) return;
        f(r.value);
      }
    };
    defs.toArray = function () {
      var out = [];
      var inner = iteratorRecord(this);
      for (;;) {
        var r = inner.next();
        if (r.done) return out;
        out.push(r.value);
      }
    };
    defs.reduce = function (fn, initial) {
      var f = callable(fn);
      var inner = iteratorRecord(this);
      var acc = initial;
      var has = arguments.length >= 2;
      for (;;) {
        var r = inner.next();
        if (r.done) {
          if (!has) throw new TypeError('Reduce of empty iterator with no initial value');
          return acc;
        }
        if (has) { acc = f(acc, r.value); }
        else { acc = r.value; has = true; }
      }
    };

    var props = {};
    for (var name in defs) {
      if (Object.prototype.hasOwnProperty.call(defs, name)) {
        props[name] = { configurable: true, writable: true, value: defs[name] };
      }
    }
    Object.defineProperties(iteratorProto, props);
  }
})();
