import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/pizzip/node_modules/pako/dist/pako.es5.min.js
var require_pako_es5_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*! pako 2.2.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
	(function(t, e) {
		"object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).pako = {});
	})(exports, (function(t) {
		"use strict";
		function e(t) {
			for (var e = t.length; --e >= 0;) t[e] = 0;
		}
		var a = 256, n = 286, i = 30, r = 15, s = new Uint8Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			1,
			1,
			1,
			2,
			2,
			2,
			2,
			3,
			3,
			3,
			3,
			4,
			4,
			4,
			4,
			5,
			5,
			5,
			5,
			0
		]), o = new Uint8Array([
			0,
			0,
			0,
			0,
			1,
			1,
			2,
			2,
			3,
			3,
			4,
			4,
			5,
			5,
			6,
			6,
			7,
			7,
			8,
			8,
			9,
			9,
			10,
			10,
			11,
			11,
			12,
			12,
			13,
			13
		]), l = new Uint8Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			2,
			3,
			7
		]), h = new Uint8Array([
			16,
			17,
			18,
			0,
			8,
			7,
			9,
			6,
			10,
			5,
			11,
			4,
			12,
			3,
			13,
			2,
			14,
			1,
			15
		]), d = new Array(576);
		e(d);
		var _ = new Array(60);
		e(_);
		var f = new Array(512);
		e(f);
		var u = new Array(256);
		e(u);
		var c = new Array(29);
		e(c);
		var w, m, b, g = new Array(i);
		function p(t, e, a, n, i) {
			this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = n, this.max_length = i, this.has_stree = t && t.length;
		}
		function v(t, e) {
			this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;
		}
		e(g);
		var k = function(t) {
			return t < 256 ? f[t] : f[256 + (t >>> 7)];
		}, y = function(t, e) {
			t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;
		}, x = function(t, e, a) {
			t.bi_valid > 16 - a ? (t.bi_buf |= e << t.bi_valid & 65535, y(t, t.bi_buf), t.bi_buf = e >> 16 - t.bi_valid, t.bi_valid += a - 16) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a);
		}, z = function(t, e, a) {
			x(t, a[2 * e], a[2 * e + 1]);
		}, A = function(t, e) {
			var a = 0;
			do
				a |= 1 & t, t >>>= 1, a <<= 1;
			while (--e > 0);
			return a >>> 1;
		}, E = function(t, e, a) {
			var n, i, s = new Array(16), o = 0;
			for (n = 1; n <= r; n++) o = o + a[n - 1] << 1, s[n] = o;
			for (i = 0; i <= e; i++) {
				var l = t[2 * i + 1];
				0 !== l && (t[2 * i] = A(s[l]++, l));
			}
		}, R = function(t) {
			var e = 0;
			for (; e < n; e++) t.dyn_ltree[2 * e] = 0;
			for (e = 0; e < i; e++) t.dyn_dtree[2 * e] = 0;
			for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
			t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.sym_next = t.matches = 0;
		}, Z = function(t) {
			t.bi_valid > 8 ? y(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;
		}, S = function(t, e, a, n) {
			var i = 2 * e, r = 2 * a;
			return t[i] < t[r] || t[i] === t[r] && n[e] <= n[a];
		}, U = function(t, e, a) {
			for (var n = t.heap[a], i = a << 1; i <= t.heap_len && (i < t.heap_len && S(e, t.heap[i + 1], t.heap[i], t.depth) && i++, !S(e, n, t.heap[i], t.depth));) t.heap[a] = t.heap[i], a = i, i <<= 1;
			t.heap[a] = n;
		}, D = function(t, e, n) {
			var i, r, l, h, d = 0;
			if (0 !== t.sym_next) do
				i = 255 & t.pending_buf[t.sym_buf + d++], i += (255 & t.pending_buf[t.sym_buf + d++]) << 8, r = t.pending_buf[t.sym_buf + d++], 0 === i ? z(t, r, e) : (l = u[r], z(t, l + a + 1, e), 0 !== (h = s[l]) && (r -= c[l], x(t, r, h)), i--, l = k(i), z(t, l, n), 0 !== (h = o[l]) && (i -= g[l], x(t, i, h)));
			while (d < t.sym_next);
			z(t, 256, e);
		}, T = function(t, e) {
			var a, n, i, s = e.dyn_tree, o = e.stat_desc.static_tree, l = e.stat_desc.has_stree, h = e.stat_desc.elems, d = -1;
			for (t.heap_len = 0, t.heap_max = 573, a = 0; a < h; a++) 0 !== s[2 * a] ? (t.heap[++t.heap_len] = d = a, t.depth[a] = 0) : s[2 * a + 1] = 0;
			for (; t.heap_len < 2;) s[2 * (i = t.heap[++t.heap_len] = d < 2 ? ++d : 0)] = 1, t.depth[i] = 0, t.opt_len--, l && (t.static_len -= o[2 * i + 1]);
			for (e.max_code = d, a = t.heap_len >> 1; a >= 1; a--) U(t, s, a);
			i = h;
			do
				a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], U(t, s, 1), n = t.heap[1], t.heap[--t.heap_max] = a, t.heap[--t.heap_max] = n, s[2 * i] = s[2 * a] + s[2 * n], t.depth[i] = (t.depth[a] >= t.depth[n] ? t.depth[a] : t.depth[n]) + 1, s[2 * a + 1] = s[2 * n + 1] = i, t.heap[1] = i++, U(t, s, 1);
			while (t.heap_len >= 2);
			t.heap[--t.heap_max] = t.heap[1], function(t, e) {
				var a, n, i, s, o, l, h = e.dyn_tree, d = e.max_code, _ = e.stat_desc.static_tree, f = e.stat_desc.has_stree, u = e.stat_desc.extra_bits, c = e.stat_desc.extra_base, w = e.stat_desc.max_length, m = 0;
				for (s = 0; s <= r; s++) t.bl_count[s] = 0;
				for (h[2 * t.heap[t.heap_max] + 1] = 0, a = t.heap_max + 1; a < 573; a++) (s = h[2 * h[2 * (n = t.heap[a]) + 1] + 1] + 1) > w && (s = w, m++), h[2 * n + 1] = s, n > d || (t.bl_count[s]++, o = 0, n >= c && (o = u[n - c]), l = h[2 * n], t.opt_len += l * (s + o), f && (t.static_len += l * (_[2 * n + 1] + o)));
				if (0 !== m) {
					do {
						for (s = w - 1; 0 === t.bl_count[s];) s--;
						t.bl_count[s]--, t.bl_count[s + 1] += 2, t.bl_count[w]--, m -= 2;
					} while (m > 0);
					for (s = w; 0 !== s; s--) for (n = t.bl_count[s]; 0 !== n;) (i = t.heap[--a]) > d || (h[2 * i + 1] !== s && (t.opt_len += (s - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = s), n--);
				}
			}(t, e), E(s, d, t.bl_count);
		}, O = function(t, e, a) {
			var n, i, r = -1, s = e[1], o = 0, l = 7, h = 4;
			for (0 === s && (l = 138, h = 3), e[2 * (a + 1) + 1] = 65535, n = 0; n <= a; n++) i = s, s = e[2 * (n + 1) + 1], ++o < l && i === s || (o < h ? t.bl_tree[2 * i] += o : 0 !== i ? (i !== r && t.bl_tree[2 * i]++, t.bl_tree[32]++) : o <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, o = 0, r = i, 0 === s ? (l = 138, h = 3) : i === s ? (l = 6, h = 3) : (l = 7, h = 4));
		}, F = function(t, e, a) {
			var n, i, r = -1, s = e[1], o = 0, l = 7, h = 4;
			for (0 === s && (l = 138, h = 3), n = 0; n <= a; n++) if (i = s, s = e[2 * (n + 1) + 1], !(++o < l && i === s)) {
				if (o < h) do
					z(t, i, t.bl_tree);
				while (0 != --o);
				else 0 !== i ? (i !== r && (z(t, i, t.bl_tree), o--), z(t, 16, t.bl_tree), x(t, o - 3, 2)) : o <= 10 ? (z(t, 17, t.bl_tree), x(t, o - 3, 3)) : (z(t, 18, t.bl_tree), x(t, o - 11, 7));
				o = 0, r = i, 0 === s ? (l = 138, h = 3) : i === s ? (l = 6, h = 3) : (l = 7, h = 4);
			}
		}, I = !1, L = function(t, e, a, n) {
			x(t, 0 + (n ? 1 : 0), 3), Z(t), y(t, a), y(t, ~a), a && t.pending_buf.set(t.window.subarray(e, e + a), t.pending), t.pending += a;
		}, N = function(t, e, n, i) {
			var r, s, o = 0;
			t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = function(t) {
				var e, n = 4093624447;
				for (e = 0; e <= 31; e++, n >>>= 1) if (1 & n && 0 !== t.dyn_ltree[2 * e]) return 0;
				if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;
				for (e = 32; e < a; e++) if (0 !== t.dyn_ltree[2 * e]) return 1;
				return 0;
			}(t)), T(t, t.l_desc), T(t, t.d_desc), o = function(t) {
				var e;
				for (O(t, t.dyn_ltree, t.l_desc.max_code), O(t, t.dyn_dtree, t.d_desc.max_code), T(t, t.bl_desc), e = 18; e >= 3 && 0 === t.bl_tree[2 * h[e] + 1]; e--);
				return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
			}(t), r = t.opt_len + 3 + 7 >>> 3, (s = t.static_len + 3 + 7 >>> 3) <= r && (r = s)) : r = s = n + 5, n + 4 <= r && -1 !== e ? L(t, e, n, i) : 4 === t.strategy || s === r ? (x(t, 2 + (i ? 1 : 0), 3), D(t, d, _)) : (x(t, 4 + (i ? 1 : 0), 3), function(t, e, a, n) {
				var i;
				for (x(t, e - 257, 5), x(t, a - 1, 5), x(t, n - 4, 4), i = 0; i < n; i++) x(t, t.bl_tree[2 * h[i] + 1], 3);
				F(t, t.dyn_ltree, e - 1), F(t, t.dyn_dtree, a - 1);
			}(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, o + 1), D(t, t.dyn_ltree, t.dyn_dtree)), R(t), i && Z(t);
		}, B = {
			_tr_init: function(t) {
				I || (function() {
					var t, e, a, h, v, k = new Array(16);
					for (a = 0, h = 0; h < 28; h++) for (c[h] = a, t = 0; t < 1 << s[h]; t++) u[a++] = h;
					for (u[a - 1] = h, v = 0, h = 0; h < 16; h++) for (g[h] = v, t = 0; t < 1 << o[h]; t++) f[v++] = h;
					for (v >>= 7; h < i; h++) for (g[h] = v << 7, t = 0; t < 1 << o[h] - 7; t++) f[256 + v++] = h;
					for (e = 0; e <= r; e++) k[e] = 0;
					for (t = 0; t <= 143;) d[2 * t + 1] = 8, t++, k[8]++;
					for (; t <= 255;) d[2 * t + 1] = 9, t++, k[9]++;
					for (; t <= 279;) d[2 * t + 1] = 7, t++, k[7]++;
					for (; t <= 287;) d[2 * t + 1] = 8, t++, k[8]++;
					for (E(d, 287, k), t = 0; t < i; t++) _[2 * t + 1] = 5, _[2 * t] = A(t, 5);
					w = new p(d, s, 257, n, r), m = new p(_, o, 0, i, r), b = new p(new Array(0), l, 0, 19, 7);
				}(), I = !0), t.l_desc = new v(t.dyn_ltree, w), t.d_desc = new v(t.dyn_dtree, m), t.bl_desc = new v(t.bl_tree, b), t.bi_buf = 0, t.bi_valid = 0, R(t);
			},
			_tr_stored_block: L,
			_tr_flush_block: N,
			_tr_tally: function(t, e, n) {
				return t.pending_buf[t.sym_buf + t.sym_next++] = e, t.pending_buf[t.sym_buf + t.sym_next++] = e >> 8, t.pending_buf[t.sym_buf + t.sym_next++] = n, 0 === e ? t.dyn_ltree[2 * n]++ : (t.matches++, e--, t.dyn_ltree[2 * (u[n] + a + 1)]++, t.dyn_dtree[2 * k(e)]++), t.sym_next === t.sym_end;
			},
			_tr_align: function(t) {
				x(t, 2, 3), z(t, 256, d), function(t) {
					16 === t.bi_valid ? (y(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);
				}(t);
			}
		}, C = function(t, e, a, n) {
			for (var i = 65535 & t | 0, r = t >>> 16 & 65535 | 0, s = 0; 0 !== a;) {
				a -= s = a > 2e3 ? 2e3 : a;
				do
					r = r + (i = i + e[n++] | 0) | 0;
				while (--s);
				i %= 65521, r %= 65521;
			}
			return i | r << 16 | 0;
		}, H = new Uint32Array(function() {
			for (var t, e = [], a = 0; a < 256; a++) {
				t = a;
				for (var n = 0; n < 8; n++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
				e[a] = t;
			}
			return e;
		}()), M = function(t, e, a, n) {
			var i = H, r = n + a;
			t ^= -1;
			for (var s = n; s < r; s++) t = t >>> 8 ^ i[255 & (t ^ e[s])];
			return -1 ^ t;
		}, j = {
			2: "need dictionary",
			1: "stream end",
			0: "",
			"-1": "file error",
			"-2": "stream error",
			"-3": "data error",
			"-4": "insufficient memory",
			"-5": "buffer error",
			"-6": "incompatible version"
		}, K = {
			Z_NO_FLUSH: 0,
			Z_PARTIAL_FLUSH: 1,
			Z_SYNC_FLUSH: 2,
			Z_FULL_FLUSH: 3,
			Z_FINISH: 4,
			Z_BLOCK: 5,
			Z_TREES: 6,
			Z_OK: 0,
			Z_STREAM_END: 1,
			Z_NEED_DICT: 2,
			Z_ERRNO: -1,
			Z_STREAM_ERROR: -2,
			Z_DATA_ERROR: -3,
			Z_MEM_ERROR: -4,
			Z_BUF_ERROR: -5,
			Z_NO_COMPRESSION: 0,
			Z_BEST_SPEED: 1,
			Z_BEST_COMPRESSION: 9,
			Z_DEFAULT_COMPRESSION: -1,
			Z_FILTERED: 1,
			Z_HUFFMAN_ONLY: 2,
			Z_RLE: 3,
			Z_FIXED: 4,
			Z_DEFAULT_STRATEGY: 0,
			Z_BINARY: 0,
			Z_TEXT: 1,
			Z_UNKNOWN: 2,
			Z_DEFLATED: 8
		}, P = B._tr_init, Y = B._tr_stored_block, G = B._tr_flush_block, X = B._tr_tally, W = B._tr_align, q = K.Z_NO_FLUSH, J = K.Z_PARTIAL_FLUSH, Q = K.Z_FULL_FLUSH, V = K.Z_FINISH, $ = K.Z_BLOCK, tt = K.Z_OK, et = K.Z_STREAM_END, at = K.Z_STREAM_ERROR, nt = K.Z_DATA_ERROR, it = K.Z_BUF_ERROR, rt = K.Z_DEFAULT_COMPRESSION, st = K.Z_FILTERED, ot = K.Z_HUFFMAN_ONLY, lt = K.Z_RLE, ht = K.Z_FIXED, dt = K.Z_DEFAULT_STRATEGY, _t = K.Z_UNKNOWN, ft = K.Z_DEFLATED, ut = 258, ct = 262, wt = 42, mt = 113, bt = 666, gt = function(t, e) {
			return t.msg = j[e], e;
		}, pt = function(t) {
			return 2 * t - (t > 4 ? 9 : 0);
		}, vt = function(t) {
			for (var e = t.length; --e >= 0;) t[e] = 0;
		}, kt = function(t) {
			var e, a, n, i = t.w_size;
			n = e = t.hash_size;
			do
				a = t.head[--n], t.head[n] = a >= i ? a - i : 0;
			while (--e);
			n = e = i;
			do
				a = t.prev[--n], t.prev[n] = a >= i ? a - i : 0;
			while (--e);
		}, yt = function(t, e, a) {
			return (e << t.hash_shift ^ a) & t.hash_mask;
		}, xt = function(t, e) {
			var a;
			if (t.legacy_hash) a = t.ins_h = yt(t, t.ins_h, t.window[e + 3 - 1]);
			else {
				var n = t.window, i = n[e] | n[e + 1] << 8 | n[e + 2] << 16 | n[e + 3] << 24;
				a = t.ins_h = Math.imul(i, 66521) + 66521 >>> 16 & t.hash_mask;
			}
			var r = t.prev[e & t.w_mask] = t.head[a];
			return t.head[a] = e, r;
		}, zt = function(t) {
			var e = t.state, a = e.pending;
			a > t.avail_out && (a = t.avail_out), 0 !== a && (t.output.set(e.pending_buf.subarray(e.pending_out, e.pending_out + a), t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0));
		}, At = function(t, e) {
			G(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, zt(t.strm);
		}, Et = function(t, e) {
			t.pending_buf[t.pending++] = e;
		}, Rt = function(t, e) {
			t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;
		}, Zt = function(t, e, a, n) {
			var i = t.avail_in;
			return i > n && (i = n), 0 === i ? 0 : (t.avail_in -= i, e.set(t.input.subarray(t.next_in, t.next_in + i), a), 1 === t.state.wrap ? t.adler = C(t.adler, e, i, a) : 2 === t.state.wrap && (t.adler = M(t.adler, e, i, a)), t.next_in += i, t.total_in += i, i);
		}, St = function(t, e) {
			var a, n, i = t.max_chain_length, r = t.strstart, s = t.prev_length, o = t.nice_match, l = t.strstart > t.w_size - ct ? t.strstart - (t.w_size - ct) : 0, h = t.window, d = t.w_mask, _ = t.prev, f = t.strstart + ut, u = h[r + s - 1], c = h[r + s];
			t.prev_length >= t.good_match && (i >>= 2), o > t.lookahead && (o = t.lookahead);
			do
				if (h[(a = e) + s] === c && h[a + s - 1] === u && h[a] === h[r] && h[++a] === h[r + 1]) {
					r += 2, a++;
					do					;
while (h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && r < f);
					if (n = ut - (f - r), r = f - ut, n > s) {
						if (t.match_start = e, s = n, n >= o) break;
						u = h[r + s - 1], c = h[r + s];
					}
				}
			while ((e = _[e & d]) > l && 0 != --i);
			return s <= t.lookahead ? s : t.lookahead;
		}, Ut = function(t) {
			var e, a, n, i = t.w_size;
			do {
				if (a = t.window_size - t.lookahead - t.strstart, t.strstart >= i + (i - ct) && (t.window.set(t.window.subarray(i, i + i - a), 0), t.match_start -= i, t.strstart -= i, t.block_start -= i, t.insert > t.strstart && (t.insert = t.strstart), kt(t), a += i), 0 === t.strm.avail_in) break;
				if (e = Zt(t.strm, t.window, t.strstart + t.lookahead, a), t.lookahead += e, t.legacy_hash) {
					if (t.lookahead + t.insert >= 3) for (n = t.strstart - t.insert, t.ins_h = t.window[n], t.ins_h = yt(t, t.ins_h, t.window[n + 1]); t.insert && (xt(t, n), n++, t.insert--, !(t.lookahead + t.insert < 3)););
				} else if (t.lookahead + t.insert > 3) for (n = t.strstart - t.insert; t.insert && (xt(t, n), n++, t.insert--, !(t.lookahead + t.insert <= 3)););
			} while (t.lookahead < ct && 0 !== t.strm.avail_in);
		}, Dt = function(t, e) {
			var a, n, i, r = t.pending_buf_size - 5 > t.w_size ? t.w_size : t.pending_buf_size - 5, s = 0, o = t.strm.avail_in;
			do {
				if (a = 65535, i = t.bi_valid + 42 >> 3, t.strm.avail_out < i) break;
				if (i = t.strm.avail_out - i, a > (n = t.strstart - t.block_start) + t.strm.avail_in && (a = n + t.strm.avail_in), a > i && (a = i), a < r && (0 === a && e !== V || e === q || a !== n + t.strm.avail_in)) break;
				s = e === V && a === n + t.strm.avail_in ? 1 : 0, Y(t, 0, 0, s), t.pending_buf[t.pending - 4] = a, t.pending_buf[t.pending - 3] = a >> 8, t.pending_buf[t.pending - 2] = ~a, t.pending_buf[t.pending - 1] = ~a >> 8, zt(t.strm), n && (n > a && (n = a), t.strm.output.set(t.window.subarray(t.block_start, t.block_start + n), t.strm.next_out), t.strm.next_out += n, t.strm.avail_out -= n, t.strm.total_out += n, t.block_start += n, a -= n), a && (Zt(t.strm, t.strm.output, t.strm.next_out, a), t.strm.next_out += a, t.strm.avail_out -= a, t.strm.total_out += a);
			} while (0 === s);
			return (o -= t.strm.avail_in) && (o >= t.w_size ? (t.matches = 2, t.window.set(t.strm.input.subarray(t.strm.next_in - t.w_size, t.strm.next_in), 0), t.strstart = t.w_size, t.insert = t.strstart) : (t.window_size - t.strstart <= o && (t.strstart -= t.w_size, t.window.set(t.window.subarray(t.w_size, t.w_size + t.strstart), 0), t.matches < 2 && t.matches++, t.insert > t.strstart && (t.insert = t.strstart)), t.window.set(t.strm.input.subarray(t.strm.next_in - o, t.strm.next_in), t.strstart), t.strstart += o, t.insert += o > t.w_size - t.insert ? t.w_size - t.insert : o), t.block_start = t.strstart), t.high_water < t.strstart && (t.high_water = t.strstart), s ? 4 : e !== q && e !== V && 0 === t.strm.avail_in && t.strstart === t.block_start ? 2 : (i = t.window_size - t.strstart, t.strm.avail_in > i && t.block_start >= t.w_size && (t.block_start -= t.w_size, t.strstart -= t.w_size, t.window.set(t.window.subarray(t.w_size, t.w_size + t.strstart), 0), t.matches < 2 && t.matches++, i += t.w_size, t.insert > t.strstart && (t.insert = t.strstart)), i > t.strm.avail_in && (i = t.strm.avail_in), i && (Zt(t.strm, t.window, t.strstart, i), t.strstart += i, t.insert += i > t.w_size - t.insert ? t.w_size - t.insert : i), t.high_water < t.strstart && (t.high_water = t.strstart), i = t.bi_valid + 42 >> 3, r = (i = t.pending_buf_size - i > 65535 ? 65535 : t.pending_buf_size - i) > t.w_size ? t.w_size : i, ((n = t.strstart - t.block_start) >= r || (n || e === V) && e !== q && 0 === t.strm.avail_in && n <= i) && (a = n > i ? i : n, s = e === V && 0 === t.strm.avail_in && a === n ? 1 : 0, Y(t, t.block_start, a, s), t.block_start += a, zt(t.strm)), s ? 3 : 1);
		}, Tt = function(t, e) {
			for (var a, n;;) {
				if (t.lookahead < ct) {
					if (Ut(t), t.lookahead < ct && e === q) return 1;
					if (0 === t.lookahead) break;
				}
				if (a = 0, t.lookahead >= 3 && (a = xt(t, t.strstart)), 0 !== a && t.strstart - a <= t.w_size - ct && (t.match_length = St(t, a)), t.match_length >= 3) if (n = X(t, t.strstart - t.match_start, t.match_length - 3), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= 3) {
					t.match_length--;
					do
						t.strstart++, a = xt(t, t.strstart);
					while (0 != --t.match_length);
					t.strstart++;
				} else t.strstart += t.match_length, t.match_length = 0, t.legacy_hash && (t.ins_h = t.window[t.strstart], t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 1]));
				else n = X(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
				if (n && (At(t, !1), 0 === t.strm.avail_out)) return 1;
			}
			return t.insert = t.strstart < 2 ? t.strstart : 2, e === V ? (At(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (At(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
		}, Ot = function(t, e) {
			for (var a, n, i;;) {
				if (t.lookahead < ct) {
					if (Ut(t), t.lookahead < ct && e === q) return 1;
					if (0 === t.lookahead) break;
				}
				if (a = 0, t.lookahead >= 3 && (a = xt(t, t.strstart)), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = 2, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - ct && (t.match_length = St(t, a), t.match_length <= 5 && (t.strategy === st || 3 === t.match_length && t.strstart - t.match_start > 4096) && (t.match_length = 2)), t.prev_length >= 3 && t.match_length <= t.prev_length) {
					i = t.strstart + t.lookahead - 3, n = X(t, t.strstart - 1 - t.prev_match, t.prev_length - 3), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
					do
						++t.strstart <= i && (a = xt(t, t.strstart));
					while (0 != --t.prev_length);
					if (t.match_available = 0, t.match_length = 2, t.strstart++, n && (At(t, !1), 0 === t.strm.avail_out)) return 1;
				} else if (t.match_available) {
					if ((n = X(t, 0, t.window[t.strstart - 1])) && At(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1;
				} else t.match_available = 1, t.strstart++, t.lookahead--;
			}
			return t.match_available && (n = X(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < 2 ? t.strstart : 2, e === V ? (At(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (At(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
		};
		function Ft(t, e, a, n, i) {
			this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = n, this.func = i;
		}
		var It = [
			new Ft(0, 0, 0, 0, Dt),
			new Ft(4, 4, 8, 4, Tt),
			new Ft(4, 5, 16, 8, Tt),
			new Ft(4, 6, 32, 32, Tt),
			new Ft(4, 4, 16, 16, Ot),
			new Ft(8, 16, 32, 32, Ot),
			new Ft(8, 16, 128, 128, Ot),
			new Ft(8, 32, 128, 256, Ot),
			new Ft(32, 128, 258, 1024, Ot),
			new Ft(32, 258, 258, 4096, Ot)
		];
		function Lt() {
			this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = ft, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.legacy_hash = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = /* @__PURE__ */ new Uint16Array(1146), this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122), this.bl_tree = /* @__PURE__ */ new Uint16Array(78), vt(this.dyn_ltree), vt(this.dyn_dtree), vt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = /* @__PURE__ */ new Uint16Array(16), this.heap = /* @__PURE__ */ new Uint16Array(573), vt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = /* @__PURE__ */ new Uint16Array(573), vt(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
		}
		var Nt = function(t) {
			if (!t) return 1;
			var e = t.state;
			return !e || e.strm !== t || e.status !== wt && 57 !== e.status && 69 !== e.status && 73 !== e.status && 91 !== e.status && 103 !== e.status && e.status !== mt && e.status !== bt ? 1 : 0;
		}, Bt = function(t) {
			if (Nt(t)) return gt(t, at);
			t.total_in = t.total_out = 0, t.data_type = _t;
			var e = t.state;
			return e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = 2 === e.wrap ? 57 : e.wrap ? wt : mt, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = -2, P(e), tt;
		}, Ct = function(t) {
			var e, a = Bt(t);
			return a === tt && ((e = t.state).window_size = 2 * e.w_size, vt(e.head), e.max_lazy_match = It[e.level].max_lazy, e.good_match = It[e.level].good_length, e.nice_match = It[e.level].nice_length, e.max_chain_length = It[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0), a;
		}, Ht = function(t, e, a, n, i, r, s) {
			if (!t) return at;
			var o = 1;
			if (e === rt && (e = 6), n < 0 ? (o = 0, n = -n) : n > 15 && (o = 2, n -= 16), i < 1 || i > 9 || a !== ft || n < 8 || n > 15 || e < 0 || e > 9 || r < 0 || r > ht || 8 === n && 1 !== o) return gt(t, at);
			8 === n && (n = 9);
			var l = new Lt();
			return t.state = l, l.strm = t, l.status = wt, l.wrap = o, l.gzhead = null, l.w_bits = n, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.legacy_hash = s ? 1 : 0, l.hash_bits = i + 7, !l.legacy_hash && l.hash_bits < 15 && (l.hash_bits = 15), l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + 3 - 1) / 3), l.window = new Uint8Array(2 * l.w_size), l.head = new Uint16Array(l.hash_size), l.prev = new Uint16Array(l.w_size), l.lit_bufsize = 1 << i + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new Uint8Array(l.pending_buf_size), l.sym_buf = l.lit_bufsize, l.sym_end = 3 * (l.lit_bufsize - 1), l.level = e, l.strategy = r, l.method = a, Ct(t);
		}, Mt = {
			deflateInit: function(t, e) {
				return Ht(t, e, ft, 15, 8, dt);
			},
			deflateInit2: Ht,
			deflateReset: Ct,
			deflateResetKeep: Bt,
			deflateSetHeader: function(t, e) {
				return Nt(t) || 2 !== t.state.wrap ? at : (t.state.gzhead = e, tt);
			},
			deflate: function(t, e) {
				if (Nt(t) || e > $ || e < 0) return t ? gt(t, at) : at;
				var a = t.state;
				if (!t.output || 0 !== t.avail_in && !t.input || a.status === bt && e !== V) return gt(t, 0 === t.avail_out ? it : at);
				var n = a.last_flush;
				if (a.last_flush = e, 0 !== a.pending) {
					if (zt(t), 0 === t.avail_out) return a.last_flush = -1, tt;
				} else if (0 === t.avail_in && pt(e) <= pt(n) && e !== V) return gt(t, it);
				if (a.status === bt && 0 !== t.avail_in) return gt(t, it);
				if (a.status === wt && 0 === a.wrap && (a.status = mt), a.status === wt) {
					var i = ft + (a.w_bits - 8 << 4) << 8;
					if (i |= (a.strategy >= ot || a.level < 2 ? 0 : a.level < 6 ? 1 : 6 === a.level ? 2 : 3) << 6, 0 !== a.strstart && (i |= 32), Rt(a, i += 31 - i % 31), 0 !== a.strstart && (Rt(a, t.adler >>> 16), Rt(a, 65535 & t.adler)), t.adler = 1, a.status = mt, zt(t), 0 !== a.pending) return a.last_flush = -1, tt;
				}
				if (57 === a.status) {
					if (t.adler = 0, Et(a, 31), Et(a, 139), Et(a, 8), a.gzhead) Et(a, (a.gzhead.text ? 1 : 0) + (a.gzhead.hcrc ? 2 : 0) + (a.gzhead.extra ? 4 : 0) + (a.gzhead.name ? 8 : 0) + (a.gzhead.comment ? 16 : 0)), Et(a, 255 & a.gzhead.time), Et(a, a.gzhead.time >> 8 & 255), Et(a, a.gzhead.time >> 16 & 255), Et(a, a.gzhead.time >> 24 & 255), Et(a, 9 === a.level ? 2 : a.strategy >= ot || a.level < 2 ? 4 : 0), Et(a, 255 & a.gzhead.os), a.gzhead.extra && a.gzhead.extra.length && (Et(a, 255 & a.gzhead.extra.length), Et(a, a.gzhead.extra.length >> 8 & 255)), a.gzhead.hcrc && (t.adler = M(t.adler, a.pending_buf, a.pending, 0)), a.gzindex = 0, a.status = 69;
					else if (Et(a, 0), Et(a, 0), Et(a, 0), Et(a, 0), Et(a, 0), Et(a, 9 === a.level ? 2 : a.strategy >= ot || a.level < 2 ? 4 : 0), Et(a, 3), a.status = mt, zt(t), 0 !== a.pending) return a.last_flush = -1, tt;
				}
				if (69 === a.status) {
					if (a.gzhead.extra) {
						for (var r = a.pending, s = (65535 & a.gzhead.extra.length) - a.gzindex; a.pending + s > a.pending_buf_size;) {
							var o = a.pending_buf_size - a.pending;
							if (a.pending_buf.set(a.gzhead.extra.subarray(a.gzindex, a.gzindex + o), a.pending), a.pending = a.pending_buf_size, a.gzhead.hcrc && a.pending > r && (t.adler = M(t.adler, a.pending_buf, a.pending - r, r)), a.gzindex += o, zt(t), 0 !== a.pending) return a.last_flush = -1, tt;
							r = 0, s -= o;
						}
						var l = new Uint8Array(a.gzhead.extra);
						a.pending_buf.set(l.subarray(a.gzindex, a.gzindex + s), a.pending), a.pending += s, a.gzhead.hcrc && a.pending > r && (t.adler = M(t.adler, a.pending_buf, a.pending - r, r)), a.gzindex = 0;
					}
					a.status = 73;
				}
				if (73 === a.status) {
					if (a.gzhead.name) {
						var h, d = a.pending;
						do {
							if (a.pending === a.pending_buf_size) {
								if (a.gzhead.hcrc && a.pending > d && (t.adler = M(t.adler, a.pending_buf, a.pending - d, d)), zt(t), 0 !== a.pending) return a.last_flush = -1, tt;
								d = 0;
							}
							h = a.gzindex < a.gzhead.name.length ? 255 & a.gzhead.name.charCodeAt(a.gzindex++) : 0, Et(a, h);
						} while (0 !== h);
						a.gzhead.hcrc && a.pending > d && (t.adler = M(t.adler, a.pending_buf, a.pending - d, d)), a.gzindex = 0;
					}
					a.status = 91;
				}
				if (91 === a.status) {
					if (a.gzhead.comment) {
						var _, f = a.pending;
						do {
							if (a.pending === a.pending_buf_size) {
								if (a.gzhead.hcrc && a.pending > f && (t.adler = M(t.adler, a.pending_buf, a.pending - f, f)), zt(t), 0 !== a.pending) return a.last_flush = -1, tt;
								f = 0;
							}
							_ = a.gzindex < a.gzhead.comment.length ? 255 & a.gzhead.comment.charCodeAt(a.gzindex++) : 0, Et(a, _);
						} while (0 !== _);
						a.gzhead.hcrc && a.pending > f && (t.adler = M(t.adler, a.pending_buf, a.pending - f, f));
					}
					a.status = 103;
				}
				if (103 === a.status) {
					if (a.gzhead.hcrc) {
						if (a.pending + 2 > a.pending_buf_size && (zt(t), 0 !== a.pending)) return a.last_flush = -1, tt;
						Et(a, 255 & t.adler), Et(a, t.adler >> 8 & 255), t.adler = 0;
					}
					if (a.status = mt, zt(t), 0 !== a.pending) return a.last_flush = -1, tt;
				}
				if (0 !== t.avail_in || 0 !== a.lookahead || e !== q && a.status !== bt) {
					var u = 0 === a.level ? Dt(a, e) : a.strategy === ot ? function(t, e) {
						for (var a;;) {
							if (0 === t.lookahead && (Ut(t), 0 === t.lookahead)) {
								if (e === q) return 1;
								break;
							}
							if (t.match_length = 0, a = X(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (At(t, !1), 0 === t.strm.avail_out)) return 1;
						}
						return t.insert = 0, e === V ? (At(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (At(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
					}(a, e) : a.strategy === lt ? function(t, e) {
						for (var a, n, i, r, s = t.window;;) {
							if (t.lookahead <= ut) {
								if (Ut(t), t.lookahead <= ut && e === q) return 1;
								if (0 === t.lookahead) break;
							}
							if (t.match_length = 0, t.lookahead >= 3 && t.strstart > 0 && (n = s[i = t.strstart - 1]) === s[++i] && n === s[++i] && n === s[++i]) {
								r = t.strstart + ut;
								do								;
while (n === s[++i] && n === s[++i] && n === s[++i] && n === s[++i] && n === s[++i] && n === s[++i] && n === s[++i] && n === s[++i] && i < r);
								t.match_length = ut - (r - i), t.match_length > t.lookahead && (t.match_length = t.lookahead);
							}
							if (t.match_length >= 3 ? (a = X(t, 1, t.match_length - 3), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = X(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (At(t, !1), 0 === t.strm.avail_out)) return 1;
						}
						return t.insert = 0, e === V ? (At(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.sym_next && (At(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
					}(a, e) : It[a.level].func(a, e);
					if (3 !== u && 4 !== u || (a.status = bt), 1 === u || 3 === u) return 0 === t.avail_out && (a.last_flush = -1), tt;
					if (2 === u && (e === J ? W(a) : e !== $ && (Y(a, 0, 0, !1), e === Q && (vt(a.head), 0 === a.lookahead && (a.strstart = 0, a.block_start = 0, a.insert = 0))), zt(t), 0 === t.avail_out)) return a.last_flush = -1, tt;
				}
				return e !== V ? tt : a.wrap <= 0 ? et : (2 === a.wrap ? (Et(a, 255 & t.adler), Et(a, t.adler >> 8 & 255), Et(a, t.adler >> 16 & 255), Et(a, t.adler >> 24 & 255), Et(a, 255 & t.total_in), Et(a, t.total_in >> 8 & 255), Et(a, t.total_in >> 16 & 255), Et(a, t.total_in >> 24 & 255)) : (Rt(a, t.adler >>> 16), Rt(a, 65535 & t.adler)), zt(t), a.wrap > 0 && (a.wrap = -a.wrap), 0 !== a.pending ? tt : et);
			},
			deflateEnd: function(t) {
				if (Nt(t)) return at;
				var e = t.state.status;
				return t.state = null, e === mt ? gt(t, nt) : tt;
			},
			deflateSetDictionary: function(t, e) {
				var a = e.length;
				if (Nt(t)) return at;
				var n = t.state, i = n.wrap;
				if (2 === i || 1 === i && n.status !== wt || n.lookahead) return at;
				if (1 === i && (t.adler = C(t.adler, e, a, 0)), n.wrap = 0, a >= n.w_size) {
					0 === i && (vt(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0);
					var r = new Uint8Array(n.w_size);
					r.set(e.subarray(a - n.w_size, a), 0), e = r, a = n.w_size;
				}
				var s = t.avail_in, o = t.next_in, l = t.input;
				for (t.avail_in = a, t.next_in = 0, t.input = e, Ut(n); n.lookahead >= 3;) {
					var h = n.strstart, d = n.lookahead - 2;
					do
						xt(n, h), h++;
					while (--d);
					n.strstart = h, n.lookahead = 2, Ut(n);
				}
				return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = 2, n.match_available = 0, t.next_in = o, t.input = l, t.avail_in = s, n.wrap = i, tt;
			},
			deflateInfo: "pako deflate (from Nodeca project)"
		};
		function jt(t) {
			return jt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
				return typeof t;
			} : function(t) {
				return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
			}, jt(t);
		}
		var Kt = function(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e);
		}, Pt = function(t) {
			for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {
				var a = e.shift();
				if (a) {
					if ("object" !== jt(a)) throw new TypeError(a + "must be non-object");
					for (var n in a) Kt(a, n) && (t[n] = a[n]);
				}
			}
			return t;
		}, Yt = function(t) {
			for (var e = 0, a = 0, n = t.length; a < n; a++) e += t[a].length;
			for (var i = new Uint8Array(e), r = 0, s = 0, o = t.length; r < o; r++) {
				var l = t[r];
				i.set(l, s), s += l.length;
			}
			return i;
		}, Gt = !0;
		try {
			String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
		} catch (t) {
			Gt = !1;
		}
		for (var Xt = /* @__PURE__ */ new Uint8Array(256), Wt = 0; Wt < 256; Wt++) Xt[Wt] = Wt >= 252 ? 6 : Wt >= 248 ? 5 : Wt >= 240 ? 4 : Wt >= 224 ? 3 : Wt >= 192 ? 2 : 1;
		Xt[254] = Xt[255] = 1;
		var qt = function(t) {
			if ("function" == typeof TextEncoder && TextEncoder.prototype.encode) return new TextEncoder().encode(t);
			var e, a, n, i, r, s = t.length, o = 0;
			for (i = 0; i < s; i++) 55296 == (64512 & (a = t.charCodeAt(i))) && i + 1 < s && 56320 == (64512 & (n = t.charCodeAt(i + 1))) && (a = 65536 + (a - 55296 << 10) + (n - 56320), i++), o += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
			for (e = new Uint8Array(o), r = 0, i = 0; r < o; i++) 55296 == (64512 & (a = t.charCodeAt(i))) && i + 1 < s && 56320 == (64512 & (n = t.charCodeAt(i + 1))) && (a = 65536 + (a - 55296 << 10) + (n - 56320), i++), a < 128 ? e[r++] = a : a < 2048 ? (e[r++] = 192 | a >>> 6, e[r++] = 128 | 63 & a) : a < 65536 ? (e[r++] = 224 | a >>> 12, e[r++] = 128 | a >>> 6 & 63, e[r++] = 128 | 63 & a) : (e[r++] = 240 | a >>> 18, e[r++] = 128 | a >>> 12 & 63, e[r++] = 128 | a >>> 6 & 63, e[r++] = 128 | 63 & a);
			return e;
		}, Jt = function(t, e) {
			var a, n, i = e || t.length;
			if ("function" == typeof TextDecoder && TextDecoder.prototype.decode) return new TextDecoder().decode(t.subarray(0, e));
			var r = new Array(2 * i);
			for (n = 0, a = 0; a < i;) {
				var s = t[a++];
				if (s < 128) r[n++] = s;
				else {
					var o = Xt[s];
					if (o > 4) r[n++] = 65533, a += o - 1;
					else {
						for (s &= 2 === o ? 31 : 3 === o ? 15 : 7; o > 1 && a < i;) s = s << 6 | 63 & t[a++], o--;
						o > 1 ? r[n++] = 65533 : s < 65536 ? r[n++] = s : (s -= 65536, r[n++] = 55296 | s >> 10 & 1023, r[n++] = 56320 | 1023 & s);
					}
				}
			}
			return function(t, e) {
				if (e < 65534 && t.subarray && Gt) return String.fromCharCode.apply(null, t.length === e ? t : t.subarray(0, e));
				for (var a = "", n = 0; n < e; n++) a += String.fromCharCode(t[n]);
				return a;
			}(r, n);
		}, Qt = function(t, e) {
			(e = e || t.length) > t.length && (e = t.length);
			for (var a = e - 1; a >= 0 && 128 == (192 & t[a]);) a--;
			return a < 0 || 0 === a ? e : a + Xt[t[a]] > e ? a : e;
		};
		var Vt = function() {
			this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
		}, $t = Object.prototype.toString, te = K.Z_NO_FLUSH, ee = K.Z_SYNC_FLUSH, ae = K.Z_FULL_FLUSH, ne = K.Z_FINISH, ie = K.Z_OK, re = K.Z_STREAM_END, se = {
			level: K.Z_DEFAULT_COMPRESSION,
			method: K.Z_DEFLATED,
			chunkSize: 16384,
			windowBits: 15,
			memLevel: 8,
			strategy: K.Z_DEFAULT_STRATEGY,
			legacyHash: !0
		};
		function oe(t) {
			this.options = Pt({}, se, t || {});
			var e = this.options;
			e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Vt(), this.strm.avail_out = 0;
			var a = Mt.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy, e.legacyHash);
			if (a !== ie) throw new Error(j[a]);
			if (e.header && Mt.deflateSetHeader(this.strm, e.header), e.dictionary) {
				var n = "string" == typeof e.dictionary ? qt(e.dictionary) : "[object ArrayBuffer]" === $t.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary;
				if ((a = Mt.deflateSetDictionary(this.strm, n)) !== ie) throw new Error(j[a]);
				this._dict_set = !0;
			}
		}
		function le(t, e) {
			var a = new oe(e);
			if (a.push(t, !0), a.err) throw a.msg || j[a.err];
			return a.result;
		}
		oe.prototype.push = function(t, e) {
			var a, n, i = this.strm, r = this.options.chunkSize;
			if (this.ended) return !1;
			for (n = e === ~~e ? e : !0 === e ? ne : te, "string" == typeof t ? i.input = qt(t) : "[object ArrayBuffer]" === $t.call(t) ? i.input = new Uint8Array(t) : i.input = t, i.next_in = 0, i.avail_in = i.input.length;;) if (0 === i.avail_out && (i.output = new Uint8Array(r), i.next_out = 0, i.avail_out = r), (n === ee || n === ae) && i.avail_out <= 6) this.onData(i.output.subarray(0, i.next_out)), i.avail_out = 0;
			else {
				if ((a = Mt.deflate(i, n)) === re) return i.next_out > 0 && this.onData(i.output.subarray(0, i.next_out)), a = Mt.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === ie;
				if (0 !== i.avail_out) {
					if (n > 0 && i.next_out > 0) this.onData(i.output.subarray(0, i.next_out)), i.avail_out = 0;
					else if (0 === i.avail_in) break;
				} else this.onData(i.output);
			}
			return !0;
		}, oe.prototype.onData = function(t) {
			this.chunks.push(t);
		}, oe.prototype.onEnd = function(t) {
			t === ie && (this.result = Yt(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
		};
		var he = {
			Deflate: oe,
			deflate: le,
			deflateRaw: function(t, e) {
				return (e = e || {}).raw = !0, le(t, e);
			},
			gzip: function(t, e) {
				return (e = e || {}).gzip = !0, le(t, e);
			},
			constants: K
		}, de = 16209, _e = function(t, e) {
			var a, n, i, r, s, o, l, h, d, _, f, u, c, w, m, b, g, p, v, k, y, x, z, A, E = t.state;
			a = t.next_in, z = t.input, n = a + (t.avail_in - 5), i = t.next_out, A = t.output, r = i - (e - t.avail_out), s = i + (t.avail_out - 257), o = E.dmax, l = E.wsize, h = E.whave, d = E.wnext, _ = E.window, f = E.hold, u = E.bits, c = E.lencode, w = E.distcode, m = (1 << E.lenbits) - 1, b = (1 << E.distbits) - 1;
			t: do {
				u < 15 && (f += z[a++] << u, u += 8, f += z[a++] << u, u += 8), g = c[f & m];
				e: for (;;) {
					if (f >>>= p = g >>> 24, u -= p, 0 === (p = g >>> 16 & 255)) A[i++] = 65535 & g;
					else {
						if (!(16 & p)) {
							if (0 == (64 & p)) {
								g = c[(65535 & g) + (f & (1 << p) - 1)];
								continue e;
							}
							if (32 & p) {
								E.mode = 16191;
								break t;
							}
							t.msg = "invalid literal/length code", E.mode = de;
							break t;
						}
						v = 65535 & g, (p &= 15) && (u < p && (f += z[a++] << u, u += 8), v += f & (1 << p) - 1, f >>>= p, u -= p), u < 15 && (f += z[a++] << u, u += 8, f += z[a++] << u, u += 8), g = w[f & b];
						a: for (;;) {
							if (f >>>= p = g >>> 24, u -= p, !(16 & (p = g >>> 16 & 255))) {
								if (0 == (64 & p)) {
									g = w[(65535 & g) + (f & (1 << p) - 1)];
									continue a;
								}
								t.msg = "invalid distance code", E.mode = de;
								break t;
							}
							if (k = 65535 & g, u < (p &= 15) && (f += z[a++] << u, (u += 8) < p && (f += z[a++] << u, u += 8)), (k += f & (1 << p) - 1) > o) {
								t.msg = "invalid distance too far back", E.mode = de;
								break t;
							}
							if (f >>>= p, u -= p, k > (p = i - r)) {
								if ((p = k - p) > h && E.sane) {
									t.msg = "invalid distance too far back", E.mode = de;
									break t;
								}
								if (y = 0, x = _, 0 === d) {
									if (y += l - p, p < v) {
										v -= p;
										do
											A[i++] = _[y++];
										while (--p);
										y = i - k, x = A;
									}
								} else if (d < p) {
									if (y += l + d - p, (p -= d) < v) {
										v -= p;
										do
											A[i++] = _[y++];
										while (--p);
										if (y = 0, d < v) {
											v -= p = d;
											do
												A[i++] = _[y++];
											while (--p);
											y = i - k, x = A;
										}
									}
								} else if (y += d - p, p < v) {
									v -= p;
									do
										A[i++] = _[y++];
									while (--p);
									y = i - k, x = A;
								}
								for (; v > 2;) A[i++] = x[y++], A[i++] = x[y++], A[i++] = x[y++], v -= 3;
								v && (A[i++] = x[y++], v > 1 && (A[i++] = x[y++]));
							} else {
								y = i - k;
								do
									A[i++] = A[y++], A[i++] = A[y++], A[i++] = A[y++], v -= 3;
								while (v > 2);
								v && (A[i++] = A[y++], v > 1 && (A[i++] = A[y++]));
							}
							break;
						}
					}
					break;
				}
			} while (a < n && i < s);
			a -= v = u >> 3, f &= (1 << (u -= v << 3)) - 1, t.next_in = a, t.next_out = i, t.avail_in = a < n ? n - a + 5 : 5 - (a - n), t.avail_out = i < s ? s - i + 257 : 257 - (i - s), E.hold = f, E.bits = u;
		}, fe = 15, ue = new Uint16Array([
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			13,
			15,
			17,
			19,
			23,
			27,
			31,
			35,
			43,
			51,
			59,
			67,
			83,
			99,
			115,
			131,
			163,
			195,
			227,
			258,
			0,
			0
		]), ce = new Uint8Array([
			16,
			16,
			16,
			16,
			16,
			16,
			16,
			16,
			17,
			17,
			17,
			17,
			18,
			18,
			18,
			18,
			19,
			19,
			19,
			19,
			20,
			20,
			20,
			20,
			21,
			21,
			21,
			21,
			16,
			199,
			75
		]), we = new Uint16Array([
			1,
			2,
			3,
			4,
			5,
			7,
			9,
			13,
			17,
			25,
			33,
			49,
			65,
			97,
			129,
			193,
			257,
			385,
			513,
			769,
			1025,
			1537,
			2049,
			3073,
			4097,
			6145,
			8193,
			12289,
			16385,
			24577,
			0,
			0
		]), me = new Uint8Array([
			16,
			16,
			16,
			16,
			17,
			17,
			18,
			18,
			19,
			19,
			20,
			20,
			21,
			21,
			22,
			22,
			23,
			23,
			24,
			24,
			25,
			25,
			26,
			26,
			27,
			27,
			28,
			28,
			29,
			29,
			64,
			64
		]), be = function(t, e, a, n, i, r, s, o) {
			var l, h, d, _, f, u, c, w, m, b = o.bits, g = 0, p = 0, v = 0, k = 0, y = 0, x = 0, z = 0, A = 0, E = 0, R = 0, Z = null, S = /* @__PURE__ */ new Uint16Array(16), U = /* @__PURE__ */ new Uint16Array(16), D = null;
			for (g = 0; g <= fe; g++) S[g] = 0;
			for (p = 0; p < n; p++) S[e[a + p]]++;
			for (y = b, k = fe; k >= 1 && 0 === S[k]; k--);
			if (y > k && (y = k), 0 === k) return i[r++] = 20971520, i[r++] = 20971520, o.bits = 1, 0;
			for (v = 1; v < k && 0 === S[v]; v++);
			for (y < v && (y = v), A = 1, g = 1; g <= fe; g++) if (A <<= 1, (A -= S[g]) < 0) return -1;
			if (A > 0 && (0 === t || 1 !== k)) return -1;
			for (U[1] = 0, g = 1; g < fe; g++) U[g + 1] = U[g] + S[g];
			for (p = 0; p < n; p++) 0 !== e[a + p] && (s[U[e[a + p]]++] = p);
			if (0 === t ? (Z = D = s, u = 20) : 1 === t ? (Z = ue, D = ce, u = 257) : (Z = we, D = me, u = 0), R = 0, p = 0, g = v, f = r, x = y, z = 0, d = -1, _ = (E = 1 << y) - 1, 1 === t && E > 852 || 2 === t && E > 592) return 1;
			for (;;) {
				c = g - z, s[p] + 1 < u ? (w = 0, m = s[p]) : s[p] >= u ? (w = D[s[p] - u], m = Z[s[p] - u]) : (w = 96, m = 0), l = 1 << g - z, v = h = 1 << x;
				do
					i[f + (R >> z) + (h -= l)] = c << 24 | w << 16 | m | 0;
				while (0 !== h);
				for (l = 1 << g - 1; R & l;) l >>= 1;
				if (0 !== l ? (R &= l - 1, R += l) : R = 0, p++, 0 == --S[g]) {
					if (g === k) break;
					g = e[a + s[p]];
				}
				if (g > y && (R & _) !== d) {
					for (0 === z && (z = y), f += v, A = 1 << (x = g - z); x + z < k && !((A -= S[x + z]) <= 0);) x++, A <<= 1;
					if (E += 1 << x, 1 === t && E > 852 || 2 === t && E > 592) return 1;
					i[d = R & _] = y << 24 | x << 16 | f - r | 0;
				}
			}
			return 0 !== R && (i[f + R] = g - z << 24 | 4194304), o.bits = y, 0;
		}, ge = K.Z_FINISH, pe = K.Z_BLOCK, ve = K.Z_TREES, ke = K.Z_OK, ye = K.Z_STREAM_END, xe = K.Z_NEED_DICT, ze = K.Z_STREAM_ERROR, Ae = K.Z_DATA_ERROR, Ee = K.Z_MEM_ERROR, Re = K.Z_BUF_ERROR, Ze = K.Z_DEFLATED, Se = 16180, Ue = 16190, De = 16191, Te = 16192, Oe = 16194, Fe = 16199, Ie = 16200, Le = 16206, Ne = 16209, Be = function(t) {
			return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);
		};
		function Ce() {
			this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = /* @__PURE__ */ new Uint16Array(320), this.work = /* @__PURE__ */ new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
		}
		var He, Me, je = function(t) {
			if (!t) return 1;
			var e = t.state;
			return !e || e.strm !== t || e.mode < Se || e.mode > 16211 ? 1 : 0;
		}, Ke = function(t) {
			if (je(t)) return ze;
			var e = t.state;
			return t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = Se, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = /* @__PURE__ */ new Int32Array(852), e.distcode = e.distdyn = /* @__PURE__ */ new Int32Array(592), e.sane = 1, e.back = -1, ke;
		}, Pe = function(t) {
			if (je(t)) return ze;
			var e = t.state;
			return e.wsize = 0, e.whave = 0, e.wnext = 0, Ke(t);
		}, Ye = function(t, e) {
			var a;
			if (je(t)) return ze;
			var n = t.state;
			return e < 0 ? (a = 0, e = -e) : (a = 5 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? ze : (null !== n.window && n.wbits !== e && (n.window = null), n.wrap = a, n.wbits = e, Pe(t));
		}, Ge = function(t, e) {
			if (!t) return ze;
			var a = new Ce();
			t.state = a, a.strm = t, a.window = null, a.mode = Se;
			var n = Ye(t, e);
			return n !== ke && (t.state = null), n;
		}, Xe = !0, We = function(t) {
			if (Xe) {
				He = /* @__PURE__ */ new Int32Array(512), Me = /* @__PURE__ */ new Int32Array(32);
				for (var e = 0; e < 144;) t.lens[e++] = 8;
				for (; e < 256;) t.lens[e++] = 9;
				for (; e < 280;) t.lens[e++] = 7;
				for (; e < 288;) t.lens[e++] = 8;
				for (be(1, t.lens, 0, 288, He, 0, t.work, { bits: 9 }), e = 0; e < 32;) t.lens[e++] = 5;
				be(2, t.lens, 0, 32, Me, 0, t.work, { bits: 5 }), Xe = !1;
			}
			t.lencode = He, t.lenbits = 9, t.distcode = Me, t.distbits = 5;
		}, qe = function(t, e, a, n) {
			var i, r = t.state;
			return null === r.window && (r.window = new Uint8Array(1 << r.wbits)), 0 === r.wsize && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0), n >= r.wsize ? (r.window.set(e.subarray(a - r.wsize, a), 0), r.wnext = 0, r.whave = r.wsize) : ((i = r.wsize - r.wnext) > n && (i = n), r.window.set(e.subarray(a - n, a - n + i), r.wnext), (n -= i) ? (r.window.set(e.subarray(a - n, a), 0), r.wnext = n, r.whave = r.wsize) : (r.wnext += i, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += i))), 0;
		}, Je = {
			inflateReset: Pe,
			inflateReset2: Ye,
			inflateResetKeep: Ke,
			inflateInit: function(t) {
				return Ge(t, 15);
			},
			inflateInit2: Ge,
			inflate: function(t, e) {
				var a, n, i, r, s, o, l, h, d, _, f, u, c, w, m, b, g, p, v, k, y, x, z, A, E = 0, R = /* @__PURE__ */ new Uint8Array(4), Z = new Uint8Array([
					16,
					17,
					18,
					0,
					8,
					7,
					9,
					6,
					10,
					5,
					11,
					4,
					12,
					3,
					13,
					2,
					14,
					1,
					15
				]);
				if (je(t) || !t.output || !t.input && 0 !== t.avail_in) return ze;
				(a = t.state).mode === De && (a.mode = Te), s = t.next_out, i = t.output, l = t.avail_out, r = t.next_in, n = t.input, o = t.avail_in, h = a.hold, d = a.bits, _ = o, f = l, x = ke;
				t: for (;;) switch (a.mode) {
					case Se:
						if (0 === a.wrap) {
							a.mode = Te;
							break;
						}
						for (; d < 16;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						if (2 & a.wrap && 35615 === h) {
							0 === a.wbits && (a.wbits = 15), a.check = 0, R[0] = 255 & h, R[1] = h >>> 8 & 255, a.check = M(a.check, R, 2, 0), h = 0, d = 0, a.mode = 16181;
							break;
						}
						if (a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & h) << 8) + (h >> 8)) % 31) {
							t.msg = "incorrect header check", a.mode = Ne;
							break;
						}
						if ((15 & h) !== Ze) {
							t.msg = "unknown compression method", a.mode = Ne;
							break;
						}
						if (d -= 4, y = 8 + (15 & (h >>>= 4)), 0 === a.wbits && (a.wbits = y), y > 15 || y > a.wbits) {
							t.msg = "invalid window size", a.mode = Ne;
							break;
						}
						a.dmax = 1 << a.wbits, a.flags = 0, t.adler = a.check = 1, a.mode = 512 & h ? 16189 : De, h = 0, d = 0;
						break;
					case 16181:
						for (; d < 16;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						if (a.flags = h, (255 & a.flags) !== Ze) {
							t.msg = "unknown compression method", a.mode = Ne;
							break;
						}
						if (57344 & a.flags) {
							t.msg = "unknown header flags set", a.mode = Ne;
							break;
						}
						a.head && (a.head.text = h >> 8 & 1), 512 & a.flags && 4 & a.wrap && (R[0] = 255 & h, R[1] = h >>> 8 & 255, a.check = M(a.check, R, 2, 0)), h = 0, d = 0, a.mode = 16182;
					case 16182:
						for (; d < 32;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						a.head && (a.head.time = h), 512 & a.flags && 4 & a.wrap && (R[0] = 255 & h, R[1] = h >>> 8 & 255, R[2] = h >>> 16 & 255, R[3] = h >>> 24 & 255, a.check = M(a.check, R, 4, 0)), h = 0, d = 0, a.mode = 16183;
					case 16183:
						for (; d < 16;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						a.head && (a.head.xflags = 255 & h, a.head.os = h >> 8), 512 & a.flags && 4 & a.wrap && (R[0] = 255 & h, R[1] = h >>> 8 & 255, a.check = M(a.check, R, 2, 0)), h = 0, d = 0, a.mode = 16184;
					case 16184:
						if (1024 & a.flags) {
							for (; d < 16;) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							a.length = h, a.head && (a.head.extra_len = h), 512 & a.flags && 4 & a.wrap && (R[0] = 255 & h, R[1] = h >>> 8 & 255, a.check = M(a.check, R, 2, 0)), h = 0, d = 0;
						} else a.head && (a.head.extra = null);
						a.mode = 16185;
					case 16185:
						if (1024 & a.flags && ((u = a.length) > o && (u = o), u && (a.head && (y = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Uint8Array(a.head.extra_len)), a.head.extra.set(n.subarray(r, r + u), y)), 512 & a.flags && 4 & a.wrap && (a.check = M(a.check, n, u, r)), o -= u, r += u, a.length -= u), a.length)) break t;
						a.length = 0, a.mode = 16186;
					case 16186:
						if (2048 & a.flags) {
							if (0 === o) break t;
							u = 0;
							do
								y = n[r + u++], a.head && y && a.length < 65536 && (a.head.name += String.fromCharCode(y));
							while (y && u < o);
							if (512 & a.flags && 4 & a.wrap && (a.check = M(a.check, n, u, r)), o -= u, r += u, y) break t;
						} else a.head && (a.head.name = null);
						a.length = 0, a.mode = 16187;
					case 16187:
						if (4096 & a.flags) {
							if (0 === o) break t;
							u = 0;
							do
								y = n[r + u++], a.head && y && a.length < 65536 && (a.head.comment += String.fromCharCode(y));
							while (y && u < o);
							if (512 & a.flags && 4 & a.wrap && (a.check = M(a.check, n, u, r)), o -= u, r += u, y) break t;
						} else a.head && (a.head.comment = null);
						a.mode = 16188;
					case 16188:
						if (512 & a.flags) {
							for (; d < 16;) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							if (4 & a.wrap && h !== (65535 & a.check)) {
								t.msg = "header crc mismatch", a.mode = Ne;
								break;
							}
							h = 0, d = 0;
						}
						a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0), t.adler = a.check = 0, a.mode = De;
						break;
					case 16189:
						for (; d < 32;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						t.adler = a.check = Be(h), h = 0, d = 0, a.mode = Ue;
					case Ue:
						if (0 === a.havedict) return t.next_out = s, t.avail_out = l, t.next_in = r, t.avail_in = o, a.hold = h, a.bits = d, xe;
						t.adler = a.check = 1, a.mode = De;
					case De: if (e === pe || e === ve) break t;
					case Te:
						if (a.last) {
							h >>>= 7 & d, d -= 7 & d, a.mode = Le;
							break;
						}
						for (; d < 3;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						switch (a.last = 1 & h, d -= 1, 3 & (h >>>= 1)) {
							case 0:
								a.mode = 16193;
								break;
							case 1:
								if (We(a), a.mode = Fe, e === ve) {
									h >>>= 2, d -= 2;
									break t;
								}
								break;
							case 2:
								a.mode = 16196;
								break;
							case 3: t.msg = "invalid block type", a.mode = Ne;
						}
						h >>>= 2, d -= 2;
						break;
					case 16193:
						for (h >>>= 7 & d, d -= 7 & d; d < 32;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						if ((65535 & h) != (h >>> 16 ^ 65535)) {
							t.msg = "invalid stored block lengths", a.mode = Ne;
							break;
						}
						if (a.length = 65535 & h, h = 0, d = 0, a.mode = Oe, e === ve) break t;
					case Oe: a.mode = 16195;
					case 16195:
						if (u = a.length) {
							if (u > o && (u = o), u > l && (u = l), 0 === u) break t;
							i.set(n.subarray(r, r + u), s), o -= u, r += u, l -= u, s += u, a.length -= u;
							break;
						}
						a.mode = De;
						break;
					case 16196:
						for (; d < 14;) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						if (a.nlen = 257 + (31 & h), h >>>= 5, d -= 5, a.ndist = 1 + (31 & h), h >>>= 5, d -= 5, a.ncode = 4 + (15 & h), h >>>= 4, d -= 4, a.nlen > 286 || a.ndist > 30) {
							t.msg = "too many length or distance symbols", a.mode = Ne;
							break;
						}
						a.have = 0, a.mode = 16197;
					case 16197:
						for (; a.have < a.ncode;) {
							for (; d < 3;) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							a.lens[Z[a.have++]] = 7 & h, h >>>= 3, d -= 3;
						}
						for (; a.have < 19;) a.lens[Z[a.have++]] = 0;
						if (a.lencode = a.lendyn, a.lenbits = 7, z = { bits: a.lenbits }, x = be(0, a.lens, 0, 19, a.lencode, 0, a.work, z), a.lenbits = z.bits, x) {
							t.msg = "invalid code lengths set", a.mode = Ne;
							break;
						}
						a.have = 0, a.mode = 16198;
					case 16198:
						for (; a.have < a.nlen + a.ndist;) {
							for (; b = (E = a.lencode[h & (1 << a.lenbits) - 1]) >>> 16 & 255, g = 65535 & E, !((m = E >>> 24) <= d);) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							if (g < 16) h >>>= m, d -= m, a.lens[a.have++] = g;
							else {
								if (16 === g) {
									for (A = m + 2; d < A;) {
										if (0 === o) break t;
										o--, h += n[r++] << d, d += 8;
									}
									if (h >>>= m, d -= m, 0 === a.have) {
										t.msg = "invalid bit length repeat", a.mode = Ne;
										break;
									}
									y = a.lens[a.have - 1], u = 3 + (3 & h), h >>>= 2, d -= 2;
								} else if (17 === g) {
									for (A = m + 3; d < A;) {
										if (0 === o) break t;
										o--, h += n[r++] << d, d += 8;
									}
									d -= m, y = 0, u = 3 + (7 & (h >>>= m)), h >>>= 3, d -= 3;
								} else {
									for (A = m + 7; d < A;) {
										if (0 === o) break t;
										o--, h += n[r++] << d, d += 8;
									}
									d -= m, y = 0, u = 11 + (127 & (h >>>= m)), h >>>= 7, d -= 7;
								}
								if (a.have + u > a.nlen + a.ndist) {
									t.msg = "invalid bit length repeat", a.mode = Ne;
									break;
								}
								for (; u--;) a.lens[a.have++] = y;
							}
						}
						if (a.mode === Ne) break;
						if (0 === a.lens[256]) {
							t.msg = "invalid code -- missing end-of-block", a.mode = Ne;
							break;
						}
						if (a.lenbits = 9, z = { bits: a.lenbits }, x = be(1, a.lens, 0, a.nlen, a.lencode, 0, a.work, z), a.lenbits = z.bits, x) {
							t.msg = "invalid literal/lengths set", a.mode = Ne;
							break;
						}
						if (a.distbits = 6, a.distcode = a.distdyn, z = { bits: a.distbits }, x = be(2, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, z), a.distbits = z.bits, x) {
							t.msg = "invalid distances set", a.mode = Ne;
							break;
						}
						if (a.mode = Fe, e === ve) break t;
					case Fe: a.mode = Ie;
					case Ie:
						if (o >= 6 && l >= 258) {
							t.next_out = s, t.avail_out = l, t.next_in = r, t.avail_in = o, a.hold = h, a.bits = d, _e(t, f), s = t.next_out, i = t.output, l = t.avail_out, r = t.next_in, n = t.input, o = t.avail_in, h = a.hold, d = a.bits, a.mode === De && (a.back = -1);
							break;
						}
						for (a.back = 0; b = (E = a.lencode[h & (1 << a.lenbits) - 1]) >>> 16 & 255, g = 65535 & E, !((m = E >>> 24) <= d);) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						if (b && 0 == (240 & b)) {
							for (p = m, v = b, k = g; b = (E = a.lencode[k + ((h & (1 << p + v) - 1) >> p)]) >>> 16 & 255, g = 65535 & E, !(p + (m = E >>> 24) <= d);) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							h >>>= p, d -= p, a.back += p;
						}
						if (h >>>= m, d -= m, a.back += m, a.length = g, 0 === b) {
							a.mode = 16205;
							break;
						}
						if (32 & b) {
							a.back = -1, a.mode = De;
							break;
						}
						if (64 & b) {
							t.msg = "invalid literal/length code", a.mode = Ne;
							break;
						}
						a.extra = 15 & b, a.mode = 16201;
					case 16201:
						if (a.extra) {
							for (A = a.extra; d < A;) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							a.length += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra;
						}
						a.was = a.length, a.mode = 16202;
					case 16202:
						for (; b = (E = a.distcode[h & (1 << a.distbits) - 1]) >>> 16 & 255, g = 65535 & E, !((m = E >>> 24) <= d);) {
							if (0 === o) break t;
							o--, h += n[r++] << d, d += 8;
						}
						if (0 == (240 & b)) {
							for (p = m, v = b, k = g; b = (E = a.distcode[k + ((h & (1 << p + v) - 1) >> p)]) >>> 16 & 255, g = 65535 & E, !(p + (m = E >>> 24) <= d);) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							h >>>= p, d -= p, a.back += p;
						}
						if (h >>>= m, d -= m, a.back += m, 64 & b) {
							t.msg = "invalid distance code", a.mode = Ne;
							break;
						}
						a.offset = g, a.extra = 15 & b, a.mode = 16203;
					case 16203:
						if (a.extra) {
							for (A = a.extra; d < A;) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							a.offset += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra;
						}
						if (a.offset > a.dmax) {
							t.msg = "invalid distance too far back", a.mode = Ne;
							break;
						}
						a.mode = 16204;
					case 16204:
						if (0 === l) break t;
						if (u = f - l, a.offset > u) {
							if ((u = a.offset - u) > a.whave && a.sane) {
								t.msg = "invalid distance too far back", a.mode = Ne;
								break;
							}
							u > a.wnext ? (u -= a.wnext, c = a.wsize - u) : c = a.wnext - u, u > a.length && (u = a.length), w = a.window;
						} else w = i, c = s - a.offset, u = a.length;
						u > l && (u = l), l -= u, a.length -= u;
						do
							i[s++] = w[c++];
						while (--u);
						0 === a.length && (a.mode = Ie);
						break;
					case 16205:
						if (0 === l) break t;
						i[s++] = a.length, l--, a.mode = Ie;
						break;
					case Le:
						if (a.wrap) {
							for (; d < 32;) {
								if (0 === o) break t;
								o--, h |= n[r++] << d, d += 8;
							}
							if (f -= l, t.total_out += f, a.total += f, 4 & a.wrap && f && (t.adler = a.check = a.flags ? M(a.check, i, f, s - f) : C(a.check, i, f, s - f)), f = l, 4 & a.wrap && (a.flags ? h : Be(h)) !== a.check) {
								t.msg = "incorrect data check", a.mode = Ne;
								break;
							}
							h = 0, d = 0;
						}
						a.mode = 16207;
					case 16207:
						if (a.wrap && a.flags) {
							for (; d < 32;) {
								if (0 === o) break t;
								o--, h += n[r++] << d, d += 8;
							}
							if (4 & a.wrap && h !== (4294967295 & a.total)) {
								t.msg = "incorrect length check", a.mode = Ne;
								break;
							}
							h = 0, d = 0;
						}
						a.mode = 16208;
					case 16208:
						x = ye;
						break t;
					case Ne:
						x = Ae;
						break t;
					case 16210: return Ee;
					default: return ze;
				}
				return t.next_out = s, t.avail_out = l, t.next_in = r, t.avail_in = o, a.hold = h, a.bits = d, (a.wsize || f !== t.avail_out && a.mode < Ne && (a.mode < Le || e !== ge)) && qe(t, t.output, t.next_out, f - t.avail_out), _ -= t.avail_in, f -= t.avail_out, t.total_in += _, t.total_out += f, a.total += f, 4 & a.wrap && f && (t.adler = a.check = a.flags ? M(a.check, i, f, t.next_out - f) : C(a.check, i, f, t.next_out - f)), t.data_type = a.bits + (a.last ? 64 : 0) + (a.mode === De ? 128 : 0) + (a.mode === Fe || a.mode === Oe ? 256 : 0), (0 === _ && 0 === f || e === ge) && x === ke && (x = Re), x;
			},
			inflateEnd: function(t) {
				if (je(t)) return ze;
				var e = t.state;
				return e.window && (e.window = null), t.state = null, ke;
			},
			inflateGetHeader: function(t, e) {
				if (je(t)) return ze;
				var a = t.state;
				return 0 == (2 & a.wrap) ? ze : (a.head = e, e.done = !1, ke);
			},
			inflateSetDictionary: function(t, e) {
				var a, n = e.length;
				return je(t) || 0 !== (a = t.state).wrap && a.mode !== Ue ? ze : a.mode === Ue && C(1, e, n, 0) !== a.check ? Ae : qe(t, e, n, n) ? (a.mode = 16210, Ee) : (a.havedict = 1, ke);
			},
			inflateInfo: "pako inflate (from Nodeca project)"
		};
		var Qe = function() {
			this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
		}, Ve = Object.prototype.toString, $e = K.Z_NO_FLUSH, ta = K.Z_FINISH, ea = K.Z_OK, aa = K.Z_STREAM_END, na = K.Z_NEED_DICT, ia = K.Z_STREAM_ERROR, ra = K.Z_DATA_ERROR, sa = K.Z_MEM_ERROR, oa = K.Z_BUF_ERROR, la = {
			chunkSize: 65536,
			windowBits: 15,
			to: ""
		};
		function ha(t) {
			this.options = Pt({}, la, t || {});
			var e = this.options;
			e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Vt(), this.strm.avail_out = 0;
			var a = Je.inflateInit2(this.strm, e.windowBits);
			if (a !== ea) throw new Error(j[a]);
			if (this.header = new Qe(), Je.inflateGetHeader(this.strm, this.header), e.dictionary && ("string" == typeof e.dictionary ? e.dictionary = qt(e.dictionary) : "[object ArrayBuffer]" === Ve.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (a = Je.inflateSetDictionary(this.strm, e.dictionary)) !== ea)) throw new Error(j[a]);
		}
		function da(t, e) {
			var a = new ha(e);
			if (a.push(t, !0), a.err) throw a.msg || j[a.err];
			return a.result;
		}
		ha.prototype.push = function(t, e) {
			var a, n, i, r = this.strm, s = this.options.chunkSize, o = this.options.dictionary;
			if (this.ended) return !1;
			for (n = e === ~~e ? e : !0 === e ? ta : $e, "[object ArrayBuffer]" === Ve.call(t) ? r.input = new Uint8Array(t) : r.input = t, r.next_in = 0, r.avail_in = r.input.length;;) {
				for (0 === r.avail_out && (r.output = new Uint8Array(s), r.next_out = 0, r.avail_out = s), (a = Je.inflate(r, n)) === na && o && ((a = Je.inflateSetDictionary(r, o)) === ea ? a = Je.inflate(r, n) : a === ra && (a = na)); r.avail_in > 0 && a === aa && 2 & r.state.wrap && 0 !== r.state.flags && 0 !== r.input[r.next_in];) Je.inflateReset(r), a = Je.inflate(r, n);
				switch (a) {
					case ia:
					case ra:
					case na:
					case sa: return this.onEnd(a), this.ended = !0, !1;
				}
				if (i = r.avail_out, r.next_out && (0 === r.avail_out || a === aa || n > 0)) if ("string" === this.options.to) {
					var l = Qt(r.output, r.next_out), h = r.next_out - l, d = Jt(r.output, l);
					r.next_out = h, r.avail_out = s - h, h && r.output.set(r.output.subarray(l, l + h), 0), this.onData(d);
				} else this.onData(r.output.length === r.next_out ? r.output : r.output.subarray(0, r.next_out)), r.avail_out = 0, r.next_out = 0;
				if (a !== ea && a !== oa || 0 !== i) {
					if (a === aa) return a = Je.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
					if (0 === r.avail_in) {
						if (n === ta) return a = Je.inflateEnd(this.strm), this.onEnd(a === ea ? oa : a), this.ended = !0, !1;
						break;
					}
				}
			}
			return !0;
		}, ha.prototype.onData = function(t) {
			this.chunks.push(t);
		}, ha.prototype.onEnd = function(t) {
			t === ea && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = Yt(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
		};
		var _a = {
			Inflate: ha,
			inflate: da,
			inflateRaw: function(t, e) {
				return (e = e || {}).raw = !0, da(t, e);
			},
			ungzip: da,
			constants: K
		}, fa = he.Deflate, ua = he.deflate, ca = he.deflateRaw, wa = he.gzip, ma = _a.Inflate, ba = _a.inflate, ga = _a.inflateRaw, pa = _a.ungzip, va = K, ka = {
			Deflate: fa,
			deflate: ua,
			deflateRaw: ca,
			gzip: wa,
			Inflate: ma,
			inflate: ba,
			inflateRaw: ga,
			ungzip: pa,
			constants: va
		};
		t.Deflate = fa, t.Inflate = ma, t.constants = va, t.default = ka, t.deflate = ua, t.deflateRaw = ca, t.gzip = wa, t.inflate = ba, t.inflateRaw = ga, t.ungzip = pa, Object.defineProperty(t, "__esModule", { value: !0 });
	}));
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/trees.js
var require_trees = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Z_FIXED = 4;
	var Z_BINARY = 0;
	var Z_TEXT = 1;
	var Z_UNKNOWN = 2;
	function zero(buf) {
		let len = buf.length;
		while (--len >= 0) buf[len] = 0;
	}
	var LENGTH_CODES = 29;
	var LITERALS = 256;
	var L_CODES = 286;
	var D_CODES = 30;
	var BL_CODES = 19;
	var HEAP_SIZE = 573;
	var MAX_BITS = 15;
	var Buf_size = 16;
	var MAX_BL_BITS = 7;
	var END_BLOCK = 256;
	var REP_3_6 = 16;
	var REPZ_3_10 = 17;
	var REPZ_11_138 = 18;
	var extra_lbits = new Uint8Array([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		3,
		3,
		3,
		3,
		4,
		4,
		4,
		4,
		5,
		5,
		5,
		5,
		0
	]);
	var extra_dbits = new Uint8Array([
		0,
		0,
		0,
		0,
		1,
		1,
		2,
		2,
		3,
		3,
		4,
		4,
		5,
		5,
		6,
		6,
		7,
		7,
		8,
		8,
		9,
		9,
		10,
		10,
		11,
		11,
		12,
		12,
		13,
		13
	]);
	var extra_blbits = new Uint8Array([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		2,
		3,
		7
	]);
	var bl_order = new Uint8Array([
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	]);
	var DIST_CODE_LEN = 512;
	var static_ltree = new Array(576);
	zero(static_ltree);
	var static_dtree = new Array(60);
	zero(static_dtree);
	var _dist_code = new Array(DIST_CODE_LEN);
	zero(_dist_code);
	var _length_code = new Array(256);
	zero(_length_code);
	var base_length = new Array(LENGTH_CODES);
	zero(base_length);
	var base_dist = new Array(D_CODES);
	zero(base_dist);
	function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
		this.static_tree = static_tree;
		this.extra_bits = extra_bits;
		this.extra_base = extra_base;
		this.elems = elems;
		this.max_length = max_length;
		this.has_stree = static_tree && static_tree.length;
	}
	var static_l_desc;
	var static_d_desc;
	var static_bl_desc;
	function TreeDesc(dyn_tree, stat_desc) {
		this.dyn_tree = dyn_tree;
		this.max_code = 0;
		this.stat_desc = stat_desc;
	}
	var d_code = (dist) => {
		return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
	};
	var put_short = (s, w) => {
		s.pending_buf[s.pending++] = w & 255;
		s.pending_buf[s.pending++] = w >>> 8 & 255;
	};
	var send_bits = (s, value, length) => {
		if (s.bi_valid > Buf_size - length) {
			s.bi_buf |= value << s.bi_valid & 65535;
			put_short(s, s.bi_buf);
			s.bi_buf = value >> Buf_size - s.bi_valid;
			s.bi_valid += length - Buf_size;
		} else {
			s.bi_buf |= value << s.bi_valid & 65535;
			s.bi_valid += length;
		}
	};
	var send_code = (s, c, tree) => {
		send_bits(s, tree[c * 2], tree[c * 2 + 1]);
	};
	var bi_reverse = (code, len) => {
		let res = 0;
		do {
			res |= code & 1;
			code >>>= 1;
			res <<= 1;
		} while (--len > 0);
		return res >>> 1;
	};
	var bi_flush = (s) => {
		if (s.bi_valid === 16) {
			put_short(s, s.bi_buf);
			s.bi_buf = 0;
			s.bi_valid = 0;
		} else if (s.bi_valid >= 8) {
			s.pending_buf[s.pending++] = s.bi_buf & 255;
			s.bi_buf >>= 8;
			s.bi_valid -= 8;
		}
	};
	var gen_bitlen = (s, desc) => {
		const tree = desc.dyn_tree;
		const max_code = desc.max_code;
		const stree = desc.stat_desc.static_tree;
		const has_stree = desc.stat_desc.has_stree;
		const extra = desc.stat_desc.extra_bits;
		const base = desc.stat_desc.extra_base;
		const max_length = desc.stat_desc.max_length;
		let h;
		let n, m;
		let bits;
		let xbits;
		let f;
		let overflow = 0;
		for (bits = 0; bits <= MAX_BITS; bits++) s.bl_count[bits] = 0;
		tree[s.heap[s.heap_max] * 2 + 1] = 0;
		for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
			n = s.heap[h];
			bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
			if (bits > max_length) {
				bits = max_length;
				overflow++;
			}
			tree[n * 2 + 1] = bits;
			if (n > max_code) continue;
			s.bl_count[bits]++;
			xbits = 0;
			if (n >= base) xbits = extra[n - base];
			f = tree[n * 2];
			s.opt_len += f * (bits + xbits);
			if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
		}
		if (overflow === 0) return;
		do {
			bits = max_length - 1;
			while (s.bl_count[bits] === 0) bits--;
			s.bl_count[bits]--;
			s.bl_count[bits + 1] += 2;
			s.bl_count[max_length]--;
			overflow -= 2;
		} while (overflow > 0);
		for (bits = max_length; bits !== 0; bits--) {
			n = s.bl_count[bits];
			while (n !== 0) {
				m = s.heap[--h];
				if (m > max_code) continue;
				if (tree[m * 2 + 1] !== bits) {
					s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
					tree[m * 2 + 1] = bits;
				}
				n--;
			}
		}
	};
	var gen_codes = (tree, max_code, bl_count) => {
		const next_code = new Array(16);
		let code = 0;
		let bits;
		let n;
		for (bits = 1; bits <= MAX_BITS; bits++) {
			code = code + bl_count[bits - 1] << 1;
			next_code[bits] = code;
		}
		for (n = 0; n <= max_code; n++) {
			let len = tree[n * 2 + 1];
			if (len === 0) continue;
			tree[n * 2] = bi_reverse(next_code[len]++, len);
		}
	};
	var tr_static_init = () => {
		let n;
		let bits;
		let length;
		let code;
		let dist;
		const bl_count = new Array(16);
		length = 0;
		for (code = 0; code < 28; code++) {
			base_length[code] = length;
			for (n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
		}
		_length_code[length - 1] = code;
		dist = 0;
		for (code = 0; code < 16; code++) {
			base_dist[code] = dist;
			for (n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
		}
		dist >>= 7;
		for (; code < D_CODES; code++) {
			base_dist[code] = dist << 7;
			for (n = 0; n < 1 << extra_dbits[code] - 7; n++) _dist_code[256 + dist++] = code;
		}
		for (bits = 0; bits <= MAX_BITS; bits++) bl_count[bits] = 0;
		n = 0;
		while (n <= 143) {
			static_ltree[n * 2 + 1] = 8;
			n++;
			bl_count[8]++;
		}
		while (n <= 255) {
			static_ltree[n * 2 + 1] = 9;
			n++;
			bl_count[9]++;
		}
		while (n <= 279) {
			static_ltree[n * 2 + 1] = 7;
			n++;
			bl_count[7]++;
		}
		while (n <= 287) {
			static_ltree[n * 2 + 1] = 8;
			n++;
			bl_count[8]++;
		}
		gen_codes(static_ltree, 287, bl_count);
		for (n = 0; n < D_CODES; n++) {
			static_dtree[n * 2 + 1] = 5;
			static_dtree[n * 2] = bi_reverse(n, 5);
		}
		static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, 257, L_CODES, MAX_BITS);
		static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
		static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
	};
	var init_block = (s) => {
		let n = 0;
		for (; n < L_CODES; n++) s.dyn_ltree[n * 2] = 0;
		for (n = 0; n < D_CODES; n++) s.dyn_dtree[n * 2] = 0;
		for (n = 0; n < BL_CODES; n++) s.bl_tree[n * 2] = 0;
		s.dyn_ltree[END_BLOCK * 2] = 1;
		s.opt_len = s.static_len = 0;
		s.sym_next = s.matches = 0;
	};
	var bi_windup = (s) => {
		if (s.bi_valid > 8) put_short(s, s.bi_buf);
		else if (s.bi_valid > 0) s.pending_buf[s.pending++] = s.bi_buf;
		s.bi_buf = 0;
		s.bi_valid = 0;
	};
	var smaller = (tree, n, m, depth) => {
		const _n2 = n * 2;
		const _m2 = m * 2;
		return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
	};
	var pqdownheap = (s, tree, k) => {
		const v = s.heap[k];
		let j = k << 1;
		while (j <= s.heap_len) {
			if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
			if (smaller(tree, v, s.heap[j], s.depth)) break;
			s.heap[k] = s.heap[j];
			k = j;
			j <<= 1;
		}
		s.heap[k] = v;
	};
	var compress_block = (s, ltree, dtree) => {
		let dist;
		let lc;
		let sx = 0;
		let code;
		let extra;
		if (s.sym_next !== 0) do {
			dist = s.pending_buf[s.sym_buf + sx++] & 255;
			dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
			lc = s.pending_buf[s.sym_buf + sx++];
			if (dist === 0) send_code(s, lc, ltree);
			else {
				code = _length_code[lc];
				send_code(s, code + LITERALS + 1, ltree);
				extra = extra_lbits[code];
				if (extra !== 0) {
					lc -= base_length[code];
					send_bits(s, lc, extra);
				}
				dist--;
				code = d_code(dist);
				send_code(s, code, dtree);
				extra = extra_dbits[code];
				if (extra !== 0) {
					dist -= base_dist[code];
					send_bits(s, dist, extra);
				}
			}
		} while (sx < s.sym_next);
		send_code(s, END_BLOCK, ltree);
	};
	var build_tree = (s, desc) => {
		const tree = desc.dyn_tree;
		const stree = desc.stat_desc.static_tree;
		const has_stree = desc.stat_desc.has_stree;
		const elems = desc.stat_desc.elems;
		let n, m;
		let max_code = -1;
		let node;
		s.heap_len = 0;
		s.heap_max = HEAP_SIZE;
		for (n = 0; n < elems; n++) if (tree[n * 2] !== 0) {
			s.heap[++s.heap_len] = max_code = n;
			s.depth[n] = 0;
		} else tree[n * 2 + 1] = 0;
		while (s.heap_len < 2) {
			node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
			tree[node * 2] = 1;
			s.depth[node] = 0;
			s.opt_len--;
			if (has_stree) s.static_len -= stree[node * 2 + 1];
		}
		desc.max_code = max_code;
		for (n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);
		node = elems;
		do {
			/*** pqremove ***/
			n = s.heap[1];
			s.heap[1] = s.heap[s.heap_len--];
			pqdownheap(s, tree, 1);
			m = s.heap[1];
			s.heap[--s.heap_max] = n;
			s.heap[--s.heap_max] = m;
			tree[node * 2] = tree[n * 2] + tree[m * 2];
			s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
			tree[n * 2 + 1] = tree[m * 2 + 1] = node;
			s.heap[1] = node++;
			pqdownheap(s, tree, 1);
		} while (s.heap_len >= 2);
		s.heap[--s.heap_max] = s.heap[1];
		gen_bitlen(s, desc);
		gen_codes(tree, max_code, s.bl_count);
	};
	var scan_tree = (s, tree, max_code) => {
		let n;
		let prevlen = -1;
		let curlen;
		let nextlen = tree[1];
		let count = 0;
		let max_count = 7;
		let min_count = 4;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		}
		tree[(max_code + 1) * 2 + 1] = 65535;
		for (n = 0; n <= max_code; n++) {
			curlen = nextlen;
			nextlen = tree[(n + 1) * 2 + 1];
			if (++count < max_count && curlen === nextlen) continue;
			else if (count < min_count) s.bl_tree[curlen * 2] += count;
			else if (curlen !== 0) {
				if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
				s.bl_tree[32]++;
			} else if (count <= 10) s.bl_tree[34]++;
			else s.bl_tree[36]++;
			count = 0;
			prevlen = curlen;
			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			} else if (curlen === nextlen) {
				max_count = 6;
				min_count = 3;
			} else {
				max_count = 7;
				min_count = 4;
			}
		}
	};
	var send_tree = (s, tree, max_code) => {
		let n;
		let prevlen = -1;
		let curlen;
		let nextlen = tree[1];
		let count = 0;
		let max_count = 7;
		let min_count = 4;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		}
		for (n = 0; n <= max_code; n++) {
			curlen = nextlen;
			nextlen = tree[(n + 1) * 2 + 1];
			if (++count < max_count && curlen === nextlen) continue;
			else if (count < min_count) do
				send_code(s, curlen, s.bl_tree);
			while (--count !== 0);
			else if (curlen !== 0) {
				if (curlen !== prevlen) {
					send_code(s, curlen, s.bl_tree);
					count--;
				}
				send_code(s, REP_3_6, s.bl_tree);
				send_bits(s, count - 3, 2);
			} else if (count <= 10) {
				send_code(s, REPZ_3_10, s.bl_tree);
				send_bits(s, count - 3, 3);
			} else {
				send_code(s, REPZ_11_138, s.bl_tree);
				send_bits(s, count - 11, 7);
			}
			count = 0;
			prevlen = curlen;
			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			} else if (curlen === nextlen) {
				max_count = 6;
				min_count = 3;
			} else {
				max_count = 7;
				min_count = 4;
			}
		}
	};
	var build_bl_tree = (s) => {
		let max_blindex;
		scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
		scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
		build_tree(s, s.bl_desc);
		for (max_blindex = 18; max_blindex >= 3; max_blindex--) if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) break;
		s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
		return max_blindex;
	};
	var send_all_trees = (s, lcodes, dcodes, blcodes) => {
		let rank;
		send_bits(s, lcodes - 257, 5);
		send_bits(s, dcodes - 1, 5);
		send_bits(s, blcodes - 4, 4);
		for (rank = 0; rank < blcodes; rank++) send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
		send_tree(s, s.dyn_ltree, lcodes - 1);
		send_tree(s, s.dyn_dtree, dcodes - 1);
	};
	var detect_data_type = (s) => {
		let block_mask = 4093624447;
		let n = 0;
		for (; n <= 31; n++, block_mask >>>= 1) if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) return Z_BINARY;
		if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return Z_TEXT;
		for (n = 32; n < LITERALS; n++) if (s.dyn_ltree[n * 2] !== 0) return Z_TEXT;
		return Z_BINARY;
	};
	var static_init_done = false;
	var _tr_init = (s) => {
		if (!static_init_done) {
			tr_static_init();
			static_init_done = true;
		}
		s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
		s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
		s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
		s.bi_buf = 0;
		s.bi_valid = 0;
		init_block(s);
	};
	var _tr_stored_block = (s, buf, stored_len, last) => {
		send_bits(s, 0 + (last ? 1 : 0), 3);
		bi_windup(s);
		put_short(s, stored_len);
		put_short(s, ~stored_len);
		if (stored_len) s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
		s.pending += stored_len;
	};
	var _tr_align = (s) => {
		send_bits(s, 2, 3);
		send_code(s, END_BLOCK, static_ltree);
		bi_flush(s);
	};
	var _tr_flush_block = (s, buf, stored_len, last) => {
		let opt_lenb, static_lenb;
		let max_blindex = 0;
		if (s.level > 0) {
			if (s.strm.data_type === Z_UNKNOWN) s.strm.data_type = detect_data_type(s);
			build_tree(s, s.l_desc);
			build_tree(s, s.d_desc);
			max_blindex = build_bl_tree(s);
			opt_lenb = s.opt_len + 3 + 7 >>> 3;
			static_lenb = s.static_len + 3 + 7 >>> 3;
			if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
		} else opt_lenb = static_lenb = stored_len + 5;
		if (stored_len + 4 <= opt_lenb && buf !== -1) _tr_stored_block(s, buf, stored_len, last);
		else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
			send_bits(s, 2 + (last ? 1 : 0), 3);
			compress_block(s, static_ltree, static_dtree);
		} else {
			send_bits(s, 4 + (last ? 1 : 0), 3);
			send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
			compress_block(s, s.dyn_ltree, s.dyn_dtree);
		}
		init_block(s);
		if (last) bi_windup(s);
	};
	var _tr_tally = (s, dist, lc) => {
		s.pending_buf[s.sym_buf + s.sym_next++] = dist;
		s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
		s.pending_buf[s.sym_buf + s.sym_next++] = lc;
		if (dist === 0) s.dyn_ltree[lc * 2]++;
		else {
			s.matches++;
			dist--;
			s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
			s.dyn_dtree[d_code(dist) * 2]++;
		}
		return s.sym_next === s.sym_end;
	};
	module.exports._tr_init = _tr_init;
	module.exports._tr_stored_block = _tr_stored_block;
	module.exports._tr_flush_block = _tr_flush_block;
	module.exports._tr_tally = _tr_tally;
	module.exports._tr_align = _tr_align;
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/adler32.js
var require_adler32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var adler32 = (adler, buf, len, pos) => {
		let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
		while (len !== 0) {
			n = len > 2e3 ? 2e3 : len;
			len -= n;
			do {
				s1 = s1 + buf[pos++] | 0;
				s2 = s2 + s1 | 0;
			} while (--n);
			s1 %= 65521;
			s2 %= 65521;
		}
		return s1 | s2 << 16 | 0;
	};
	module.exports = adler32;
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/crc32.js
var require_crc32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var makeTable = () => {
		let c, table = [];
		for (var n = 0; n < 256; n++) {
			c = n;
			for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
			table[n] = c;
		}
		return table;
	};
	var crcTable = new Uint32Array(makeTable());
	var crc32 = (crc, buf, len, pos) => {
		const t = crcTable;
		const end = pos + len;
		crc ^= -1;
		for (let i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
		return crc ^ -1;
	};
	module.exports = crc32;
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/messages.js
var require_messages = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		2: "need dictionary",
		1: "stream end",
		0: "",
		"-1": "file error",
		"-2": "stream error",
		"-3": "data error",
		"-4": "insufficient memory",
		"-5": "buffer error",
		"-6": "incompatible version"
	};
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		Z_NO_FLUSH: 0,
		Z_PARTIAL_FLUSH: 1,
		Z_SYNC_FLUSH: 2,
		Z_FULL_FLUSH: 3,
		Z_FINISH: 4,
		Z_BLOCK: 5,
		Z_TREES: 6,
		Z_OK: 0,
		Z_STREAM_END: 1,
		Z_NEED_DICT: 2,
		Z_ERRNO: -1,
		Z_STREAM_ERROR: -2,
		Z_DATA_ERROR: -3,
		Z_MEM_ERROR: -4,
		Z_BUF_ERROR: -5,
		Z_NO_COMPRESSION: 0,
		Z_BEST_SPEED: 1,
		Z_BEST_COMPRESSION: 9,
		Z_DEFAULT_COMPRESSION: -1,
		Z_FILTERED: 1,
		Z_HUFFMAN_ONLY: 2,
		Z_RLE: 3,
		Z_FIXED: 4,
		Z_DEFAULT_STRATEGY: 0,
		Z_BINARY: 0,
		Z_TEXT: 1,
		Z_UNKNOWN: 2,
		Z_DEFLATED: 8
	};
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/deflate.js
var require_deflate$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = require_trees();
	var adler32 = require_adler32();
	var crc32 = require_crc32();
	var msg = require_messages();
	var { Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK, Z_OK, Z_STREAM_END, Z_STREAM_ERROR, Z_DATA_ERROR, Z_BUF_ERROR, Z_DEFAULT_COMPRESSION, Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY, Z_UNKNOWN, Z_DEFLATED } = require_constants();
	var MAX_MEM_LEVEL = 9;
	var MAX_WBITS = 15;
	var DEF_MEM_LEVEL = 8;
	var HEAP_SIZE = 573;
	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = 262;
	var PRESET_DICT = 32;
	var INIT_STATE = 42;
	var GZIP_STATE = 57;
	var EXTRA_STATE = 69;
	var NAME_STATE = 73;
	var COMMENT_STATE = 91;
	var HCRC_STATE = 103;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;
	var BS_NEED_MORE = 1;
	var BS_BLOCK_DONE = 2;
	var BS_FINISH_STARTED = 3;
	var BS_FINISH_DONE = 4;
	var OS_CODE = 3;
	var err = (strm, errorCode) => {
		strm.msg = msg[errorCode];
		return errorCode;
	};
	var rank = (f) => {
		return f * 2 - (f > 4 ? 9 : 0);
	};
	var zero = (buf) => {
		let len = buf.length;
		while (--len >= 0) buf[len] = 0;
	};
	var slide_hash = (s) => {
		let n, m;
		let p;
		let wsize = s.w_size;
		n = s.hash_size;
		p = n;
		do {
			m = s.head[--p];
			s.head[p] = m >= wsize ? m - wsize : 0;
		} while (--n);
		n = wsize;
		p = n;
		do {
			m = s.prev[--p];
			s.prev[p] = m >= wsize ? m - wsize : 0;
		} while (--n);
	};
	var HASH = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
	var INSERT_STRING = (s, str) => {
		let h;
		if (s.legacy_hash) h = s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
		else {
			const w = s.window;
			const value = w[str] | w[str + 1] << 8 | w[str + 2] << 16 | w[str + 3] << 24;
			h = s.ins_h = Math.imul(value, 66521) + 66521 >>> 16 & s.hash_mask;
		}
		const hash_head = s.prev[str & s.w_mask] = s.head[h];
		s.head[h] = str;
		return hash_head;
	};
	var flush_pending = (strm) => {
		const s = strm.state;
		let len = s.pending;
		if (len > strm.avail_out) len = strm.avail_out;
		if (len === 0) return;
		strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
		strm.next_out += len;
		s.pending_out += len;
		strm.total_out += len;
		strm.avail_out -= len;
		s.pending -= len;
		if (s.pending === 0) s.pending_out = 0;
	};
	var flush_block_only = (s, last) => {
		_tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
		s.block_start = s.strstart;
		flush_pending(s.strm);
	};
	var put_byte = (s, b) => {
		s.pending_buf[s.pending++] = b;
	};
	var putShortMSB = (s, b) => {
		s.pending_buf[s.pending++] = b >>> 8 & 255;
		s.pending_buf[s.pending++] = b & 255;
	};
	var read_buf = (strm, buf, start, size) => {
		let len = strm.avail_in;
		if (len > size) len = size;
		if (len === 0) return 0;
		strm.avail_in -= len;
		buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
		if (strm.state.wrap === 1) strm.adler = adler32(strm.adler, buf, len, start);
		else if (strm.state.wrap === 2) strm.adler = crc32(strm.adler, buf, len, start);
		strm.next_in += len;
		strm.total_in += len;
		return len;
	};
	var longest_match = (s, cur_match) => {
		let chain_length = s.max_chain_length;
		let scan = s.strstart;
		let match;
		let len;
		let best_len = s.prev_length;
		let nice_match = s.nice_match;
		const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
		const _win = s.window;
		const wmask = s.w_mask;
		const prev = s.prev;
		const strend = s.strstart + MAX_MATCH;
		let scan_end1 = _win[scan + best_len - 1];
		let scan_end = _win[scan + best_len];
		if (s.prev_length >= s.good_match) chain_length >>= 2;
		if (nice_match > s.lookahead) nice_match = s.lookahead;
		do {
			match = cur_match;
			if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
			scan += 2;
			match++;
			do			;
while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
			len = MAX_MATCH - (strend - scan);
			scan = strend - MAX_MATCH;
			if (len > best_len) {
				s.match_start = cur_match;
				best_len = len;
				if (len >= nice_match) break;
				scan_end1 = _win[scan + best_len - 1];
				scan_end = _win[scan + best_len];
			}
		} while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
		if (best_len <= s.lookahead) return best_len;
		return s.lookahead;
	};
	var fill_window = (s) => {
		const _w_size = s.w_size;
		let n, more, str;
		do {
			more = s.window_size - s.lookahead - s.strstart;
			if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
				s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
				s.match_start -= _w_size;
				s.strstart -= _w_size;
				s.block_start -= _w_size;
				if (s.insert > s.strstart) s.insert = s.strstart;
				slide_hash(s);
				more += _w_size;
			}
			if (s.strm.avail_in === 0) break;
			n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
			s.lookahead += n;
			if (!s.legacy_hash) {
				if (s.lookahead + s.insert > MIN_MATCH) {
					str = s.strstart - s.insert;
					while (s.insert) {
						INSERT_STRING(s, str);
						str++;
						s.insert--;
						if (s.lookahead + s.insert <= MIN_MATCH) break;
					}
				}
			} else if (s.lookahead + s.insert >= MIN_MATCH) {
				str = s.strstart - s.insert;
				s.ins_h = s.window[str];
				s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
				while (s.insert) {
					INSERT_STRING(s, str);
					str++;
					s.insert--;
					if (s.lookahead + s.insert < MIN_MATCH) break;
				}
			}
		} while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
	};
	var deflate_stored = (s, flush) => {
		let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
		let len, left, have, last = 0;
		let used = s.strm.avail_in;
		do {
			len = 65535;
			have = s.bi_valid + 42 >> 3;
			if (s.strm.avail_out < have) break;
			have = s.strm.avail_out - have;
			left = s.strstart - s.block_start;
			if (len > left + s.strm.avail_in) len = left + s.strm.avail_in;
			if (len > have) len = have;
			if (len < min_block && (len === 0 && flush !== Z_FINISH || flush === Z_NO_FLUSH || len !== left + s.strm.avail_in)) break;
			last = flush === Z_FINISH && len === left + s.strm.avail_in ? 1 : 0;
			_tr_stored_block(s, 0, 0, last);
			s.pending_buf[s.pending - 4] = len;
			s.pending_buf[s.pending - 3] = len >> 8;
			s.pending_buf[s.pending - 2] = ~len;
			s.pending_buf[s.pending - 1] = ~len >> 8;
			flush_pending(s.strm);
			if (left) {
				if (left > len) left = len;
				s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
				s.strm.next_out += left;
				s.strm.avail_out -= left;
				s.strm.total_out += left;
				s.block_start += left;
				len -= left;
			}
			if (len) {
				read_buf(s.strm, s.strm.output, s.strm.next_out, len);
				s.strm.next_out += len;
				s.strm.avail_out -= len;
				s.strm.total_out += len;
			}
		} while (last === 0);
		used -= s.strm.avail_in;
		if (used) {
			if (used >= s.w_size) {
				s.matches = 2;
				s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
				s.strstart = s.w_size;
				s.insert = s.strstart;
			} else {
				if (s.window_size - s.strstart <= used) {
					s.strstart -= s.w_size;
					s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
					if (s.matches < 2) s.matches++;
					if (s.insert > s.strstart) s.insert = s.strstart;
				}
				s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
				s.strstart += used;
				s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
			}
			s.block_start = s.strstart;
		}
		if (s.high_water < s.strstart) s.high_water = s.strstart;
		if (last) return BS_FINISH_DONE;
		if (flush !== Z_NO_FLUSH && flush !== Z_FINISH && s.strm.avail_in === 0 && s.strstart === s.block_start) return BS_BLOCK_DONE;
		have = s.window_size - s.strstart;
		if (s.strm.avail_in > have && s.block_start >= s.w_size) {
			s.block_start -= s.w_size;
			s.strstart -= s.w_size;
			s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
			if (s.matches < 2) s.matches++;
			have += s.w_size;
			if (s.insert > s.strstart) s.insert = s.strstart;
		}
		if (have > s.strm.avail_in) have = s.strm.avail_in;
		if (have) {
			read_buf(s.strm, s.window, s.strstart, have);
			s.strstart += have;
			s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
		}
		if (s.high_water < s.strstart) s.high_water = s.strstart;
		have = s.bi_valid + 42 >> 3;
		have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
		min_block = have > s.w_size ? s.w_size : have;
		left = s.strstart - s.block_start;
		if (left >= min_block || (left || flush === Z_FINISH) && flush !== Z_NO_FLUSH && s.strm.avail_in === 0 && left <= have) {
			len = left > have ? have : left;
			last = flush === Z_FINISH && s.strm.avail_in === 0 && len === left ? 1 : 0;
			_tr_stored_block(s, s.block_start, len, last);
			s.block_start += len;
			flush_pending(s.strm);
		}
		return last ? BS_FINISH_STARTED : BS_NEED_MORE;
	};
	var deflate_fast = (s, flush) => {
		let hash_head;
		let bflush;
		for (;;) {
			if (s.lookahead < MIN_LOOKAHEAD) {
				fill_window(s);
				if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			hash_head = 0;
			if (s.lookahead >= MIN_MATCH) hash_head = INSERT_STRING(s, s.strstart);
			if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) s.match_length = longest_match(s, hash_head);
			if (s.match_length >= MIN_MATCH) {
				/*** _tr_tally_dist(s, s.strstart - s.match_start,
				s.match_length - MIN_MATCH, bflush); ***/
				bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
				s.lookahead -= s.match_length;
				if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
					s.match_length--;
					do {
						s.strstart++;
						hash_head = INSERT_STRING(s, s.strstart);
					} while (--s.match_length !== 0);
					s.strstart++;
				} else {
					s.strstart += s.match_length;
					s.match_length = 0;
					if (s.legacy_hash) {
						s.ins_h = s.window[s.strstart];
						s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
					}
				}
			} else {
				/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
				bflush = _tr_tally(s, 0, s.window[s.strstart]);
				s.lookahead--;
				s.strstart++;
			}
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = s.strstart < 2 ? s.strstart : 2;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.sym_next) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	};
	var deflate_slow = (s, flush) => {
		let hash_head;
		let bflush;
		let max_insert;
		for (;;) {
			if (s.lookahead < MIN_LOOKAHEAD) {
				fill_window(s);
				if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			hash_head = 0;
			if (s.lookahead >= MIN_MATCH) hash_head = INSERT_STRING(s, s.strstart);
			s.prev_length = s.match_length;
			s.prev_match = s.match_start;
			s.match_length = 2;
			if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
				s.match_length = longest_match(s, hash_head);
				if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) s.match_length = 2;
			}
			if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
				max_insert = s.strstart + s.lookahead - MIN_MATCH;
				/***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
				s.prev_length - MIN_MATCH, bflush);***/
				bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
				s.lookahead -= s.prev_length - 1;
				s.prev_length -= 2;
				do
					if (++s.strstart <= max_insert) hash_head = INSERT_STRING(s, s.strstart);
				while (--s.prev_length !== 0);
				s.match_available = 0;
				s.match_length = 2;
				s.strstart++;
				if (bflush) {
					/*** FLUSH_BLOCK(s, 0); ***/
					flush_block_only(s, false);
					if (s.strm.avail_out === 0) return BS_NEED_MORE;
				}
			} else if (s.match_available) {
				/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
				bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
				if (bflush)
 /*** FLUSH_BLOCK_ONLY(s, 0) ***/
				flush_block_only(s, false);
				s.strstart++;
				s.lookahead--;
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			} else {
				s.match_available = 1;
				s.strstart++;
				s.lookahead--;
			}
		}
		if (s.match_available) {
			/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
			s.match_available = 0;
		}
		s.insert = s.strstart < 2 ? s.strstart : 2;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.sym_next) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	};
	var deflate_rle = (s, flush) => {
		let bflush;
		let prev;
		let scan, strend;
		const _win = s.window;
		for (;;) {
			if (s.lookahead <= MAX_MATCH) {
				fill_window(s);
				if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			s.match_length = 0;
			if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
				scan = s.strstart - 1;
				prev = _win[scan];
				if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
					strend = s.strstart + MAX_MATCH;
					do					;
while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
					s.match_length = MAX_MATCH - (strend - scan);
					if (s.match_length > s.lookahead) s.match_length = s.lookahead;
				}
			}
			if (s.match_length >= MIN_MATCH) {
				/*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
				bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
				s.lookahead -= s.match_length;
				s.strstart += s.match_length;
				s.match_length = 0;
			} else {
				/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
				bflush = _tr_tally(s, 0, s.window[s.strstart]);
				s.lookahead--;
				s.strstart++;
			}
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = 0;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.sym_next) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	};
	var deflate_huff = (s, flush) => {
		let bflush;
		for (;;) {
			if (s.lookahead === 0) {
				fill_window(s);
				if (s.lookahead === 0) {
					if (flush === Z_NO_FLUSH) return BS_NEED_MORE;
					break;
				}
			}
			s.match_length = 0;
			/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart]);
			s.lookahead--;
			s.strstart++;
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = 0;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.sym_next) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	};
	function Config(good_length, max_lazy, nice_length, max_chain, func) {
		this.good_length = good_length;
		this.max_lazy = max_lazy;
		this.nice_length = nice_length;
		this.max_chain = max_chain;
		this.func = func;
	}
	var configuration_table = [
		new Config(0, 0, 0, 0, deflate_stored),
		new Config(4, 4, 8, 4, deflate_fast),
		new Config(4, 5, 16, 8, deflate_fast),
		new Config(4, 6, 32, 32, deflate_fast),
		new Config(4, 4, 16, 16, deflate_slow),
		new Config(8, 16, 32, 32, deflate_slow),
		new Config(8, 16, 128, 128, deflate_slow),
		new Config(8, 32, 128, 256, deflate_slow),
		new Config(32, 128, 258, 1024, deflate_slow),
		new Config(32, 258, 258, 4096, deflate_slow)
	];
	var lm_init = (s) => {
		s.window_size = 2 * s.w_size;
		/*** CLEAR_HASH(s); ***/
		zero(s.head);
		s.max_lazy_match = configuration_table[s.level].max_lazy;
		s.good_match = configuration_table[s.level].good_length;
		s.nice_match = configuration_table[s.level].nice_length;
		s.max_chain_length = configuration_table[s.level].max_chain;
		s.strstart = 0;
		s.block_start = 0;
		s.lookahead = 0;
		s.insert = 0;
		s.match_length = s.prev_length = 2;
		s.match_available = 0;
		s.ins_h = 0;
	};
	function DeflateState() {
		this.strm = null;
		this.status = 0;
		this.pending_buf = null;
		this.pending_buf_size = 0;
		this.pending_out = 0;
		this.pending = 0;
		this.wrap = 0;
		this.gzhead = null;
		this.gzindex = 0;
		this.method = Z_DEFLATED;
		this.last_flush = -1;
		this.w_size = 0;
		this.w_bits = 0;
		this.w_mask = 0;
		this.window = null;
		this.window_size = 0;
		this.prev = null;
		this.head = null;
		this.ins_h = 0;
		this.legacy_hash = 0;
		this.hash_size = 0;
		this.hash_bits = 0;
		this.hash_mask = 0;
		this.hash_shift = 0;
		this.block_start = 0;
		this.match_length = 0;
		this.prev_match = 0;
		this.match_available = 0;
		this.strstart = 0;
		this.match_start = 0;
		this.lookahead = 0;
		this.prev_length = 0;
		this.max_chain_length = 0;
		this.max_lazy_match = 0;
		this.level = 0;
		this.strategy = 0;
		this.good_match = 0;
		this.nice_match = 0;
		this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
		this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122);
		this.bl_tree = /* @__PURE__ */ new Uint16Array(78);
		zero(this.dyn_ltree);
		zero(this.dyn_dtree);
		zero(this.bl_tree);
		this.l_desc = null;
		this.d_desc = null;
		this.bl_desc = null;
		this.bl_count = /* @__PURE__ */ new Uint16Array(16);
		this.heap = /* @__PURE__ */ new Uint16Array(573);
		zero(this.heap);
		this.heap_len = 0;
		this.heap_max = 0;
		this.depth = /* @__PURE__ */ new Uint16Array(573);
		zero(this.depth);
		this.sym_buf = 0;
		this.lit_bufsize = 0;
		this.sym_next = 0;
		this.sym_end = 0;
		this.opt_len = 0;
		this.static_len = 0;
		this.matches = 0;
		this.insert = 0;
		this.bi_buf = 0;
		this.bi_valid = 0;
	}
	var deflateStateCheck = (strm) => {
		if (!strm) return 1;
		const s = strm.state;
		if (!s || s.strm !== strm || s.status !== INIT_STATE && s.status !== GZIP_STATE && s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) return 1;
		return 0;
	};
	var deflateResetKeep = (strm) => {
		if (deflateStateCheck(strm)) return err(strm, Z_STREAM_ERROR);
		strm.total_in = strm.total_out = 0;
		strm.data_type = Z_UNKNOWN;
		const s = strm.state;
		s.pending = 0;
		s.pending_out = 0;
		if (s.wrap < 0) s.wrap = -s.wrap;
		s.status = s.wrap === 2 ? GZIP_STATE : s.wrap ? INIT_STATE : BUSY_STATE;
		strm.adler = s.wrap === 2 ? 0 : 1;
		s.last_flush = -2;
		_tr_init(s);
		return Z_OK;
	};
	var deflateReset = (strm) => {
		const ret = deflateResetKeep(strm);
		if (ret === Z_OK) lm_init(strm.state);
		return ret;
	};
	var deflateSetHeader = (strm, head) => {
		if (deflateStateCheck(strm) || strm.state.wrap !== 2) return Z_STREAM_ERROR;
		strm.state.gzhead = head;
		return Z_OK;
	};
	var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy, legacyHash) => {
		if (!strm) return Z_STREAM_ERROR;
		let wrap = 1;
		if (level === Z_DEFAULT_COMPRESSION) level = 6;
		if (windowBits < 0) {
			wrap = 0;
			windowBits = -windowBits;
		} else if (windowBits > 15) {
			wrap = 2;
			windowBits -= 16;
		}
		if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) return err(strm, Z_STREAM_ERROR);
		if (windowBits === 8) windowBits = 9;
		const s = new DeflateState();
		strm.state = s;
		s.strm = strm;
		s.status = INIT_STATE;
		s.wrap = wrap;
		s.gzhead = null;
		s.w_bits = windowBits;
		s.w_size = 1 << s.w_bits;
		s.w_mask = s.w_size - 1;
		s.legacy_hash = legacyHash ? 1 : 0;
		s.hash_bits = memLevel + 7;
		if (!s.legacy_hash && s.hash_bits < 15) s.hash_bits = 15;
		s.hash_size = 1 << s.hash_bits;
		s.hash_mask = s.hash_size - 1;
		s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
		s.window = new Uint8Array(s.w_size * 2);
		s.head = new Uint16Array(s.hash_size);
		s.prev = new Uint16Array(s.w_size);
		s.lit_bufsize = 1 << memLevel + 6;
		s.pending_buf_size = s.lit_bufsize * 4;
		s.pending_buf = new Uint8Array(s.pending_buf_size);
		s.sym_buf = s.lit_bufsize;
		s.sym_end = (s.lit_bufsize - 1) * 3;
		s.level = level;
		s.strategy = strategy;
		s.method = method;
		return deflateReset(strm);
	};
	var deflateInit = (strm, level) => {
		return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
	};
	var deflate = (strm, flush) => {
		if (deflateStateCheck(strm) || flush > Z_BLOCK || flush < 0) return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
		const s = strm.state;
		if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH) return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
		const old_flush = s.last_flush;
		s.last_flush = flush;
		if (s.pending !== 0) {
			flush_pending(strm);
			if (strm.avail_out === 0) {
				s.last_flush = -1;
				return Z_OK;
			}
		} else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) return err(strm, Z_BUF_ERROR);
		if (s.status === FINISH_STATE && strm.avail_in !== 0) return err(strm, Z_BUF_ERROR);
		if (s.status === INIT_STATE && s.wrap === 0) s.status = BUSY_STATE;
		if (s.status === INIT_STATE) {
			let header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
			let level_flags = -1;
			if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) level_flags = 0;
			else if (s.level < 6) level_flags = 1;
			else if (s.level === 6) level_flags = 2;
			else level_flags = 3;
			header |= level_flags << 6;
			if (s.strstart !== 0) header |= PRESET_DICT;
			header += 31 - header % 31;
			putShortMSB(s, header);
			if (s.strstart !== 0) {
				putShortMSB(s, strm.adler >>> 16);
				putShortMSB(s, strm.adler & 65535);
			}
			strm.adler = 1;
			s.status = BUSY_STATE;
			flush_pending(strm);
			if (s.pending !== 0) {
				s.last_flush = -1;
				return Z_OK;
			}
		}
		if (s.status === GZIP_STATE) {
			strm.adler = 0;
			put_byte(s, 31);
			put_byte(s, 139);
			put_byte(s, 8);
			if (!s.gzhead) {
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
				put_byte(s, OS_CODE);
				s.status = BUSY_STATE;
				flush_pending(strm);
				if (s.pending !== 0) {
					s.last_flush = -1;
					return Z_OK;
				}
			} else {
				put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
				put_byte(s, s.gzhead.time & 255);
				put_byte(s, s.gzhead.time >> 8 & 255);
				put_byte(s, s.gzhead.time >> 16 & 255);
				put_byte(s, s.gzhead.time >> 24 & 255);
				put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
				put_byte(s, s.gzhead.os & 255);
				if (s.gzhead.extra && s.gzhead.extra.length) {
					put_byte(s, s.gzhead.extra.length & 255);
					put_byte(s, s.gzhead.extra.length >> 8 & 255);
				}
				if (s.gzhead.hcrc) strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
				s.gzindex = 0;
				s.status = EXTRA_STATE;
			}
		}
		if (s.status === EXTRA_STATE) {
			if (s.gzhead.extra) {
				let beg = s.pending;
				let left = (s.gzhead.extra.length & 65535) - s.gzindex;
				while (s.pending + left > s.pending_buf_size) {
					let copy = s.pending_buf_size - s.pending;
					s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
					s.pending = s.pending_buf_size;
					if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
					s.gzindex += copy;
					flush_pending(strm);
					if (s.pending !== 0) {
						s.last_flush = -1;
						return Z_OK;
					}
					beg = 0;
					left -= copy;
				}
				let gzhead_extra = new Uint8Array(s.gzhead.extra);
				s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
				s.pending += left;
				if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
				s.gzindex = 0;
			}
			s.status = NAME_STATE;
		}
		if (s.status === NAME_STATE) {
			if (s.gzhead.name) {
				let beg = s.pending;
				let val;
				do {
					if (s.pending === s.pending_buf_size) {
						if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
						flush_pending(strm);
						if (s.pending !== 0) {
							s.last_flush = -1;
							return Z_OK;
						}
						beg = 0;
					}
					if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
					else val = 0;
					put_byte(s, val);
				} while (val !== 0);
				if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
				s.gzindex = 0;
			}
			s.status = COMMENT_STATE;
		}
		if (s.status === COMMENT_STATE) {
			if (s.gzhead.comment) {
				let beg = s.pending;
				let val;
				do {
					if (s.pending === s.pending_buf_size) {
						if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
						flush_pending(strm);
						if (s.pending !== 0) {
							s.last_flush = -1;
							return Z_OK;
						}
						beg = 0;
					}
					if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
					else val = 0;
					put_byte(s, val);
				} while (val !== 0);
				if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
			}
			s.status = HCRC_STATE;
		}
		if (s.status === HCRC_STATE) {
			if (s.gzhead.hcrc) {
				if (s.pending + 2 > s.pending_buf_size) {
					flush_pending(strm);
					if (s.pending !== 0) {
						s.last_flush = -1;
						return Z_OK;
					}
				}
				put_byte(s, strm.adler & 255);
				put_byte(s, strm.adler >> 8 & 255);
				strm.adler = 0;
			}
			s.status = BUSY_STATE;
			flush_pending(strm);
			if (s.pending !== 0) {
				s.last_flush = -1;
				return Z_OK;
			}
		}
		if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
			let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
			if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;
			if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
				if (strm.avail_out === 0) s.last_flush = -1;
				return Z_OK;
			}
			if (bstate === BS_BLOCK_DONE) {
				if (flush === Z_PARTIAL_FLUSH) _tr_align(s);
				else if (flush !== Z_BLOCK) {
					_tr_stored_block(s, 0, 0, false);
					if (flush === Z_FULL_FLUSH) {
						/*** CLEAR_HASH(s); ***/ zero(s.head);
						if (s.lookahead === 0) {
							s.strstart = 0;
							s.block_start = 0;
							s.insert = 0;
						}
					}
				}
				flush_pending(strm);
				if (strm.avail_out === 0) {
					s.last_flush = -1;
					return Z_OK;
				}
			}
		}
		if (flush !== Z_FINISH) return Z_OK;
		if (s.wrap <= 0) return Z_STREAM_END;
		if (s.wrap === 2) {
			put_byte(s, strm.adler & 255);
			put_byte(s, strm.adler >> 8 & 255);
			put_byte(s, strm.adler >> 16 & 255);
			put_byte(s, strm.adler >> 24 & 255);
			put_byte(s, strm.total_in & 255);
			put_byte(s, strm.total_in >> 8 & 255);
			put_byte(s, strm.total_in >> 16 & 255);
			put_byte(s, strm.total_in >> 24 & 255);
		} else {
			putShortMSB(s, strm.adler >>> 16);
			putShortMSB(s, strm.adler & 65535);
		}
		flush_pending(strm);
		if (s.wrap > 0) s.wrap = -s.wrap;
		return s.pending !== 0 ? Z_OK : Z_STREAM_END;
	};
	var deflateEnd = (strm) => {
		if (deflateStateCheck(strm)) return Z_STREAM_ERROR;
		const status = strm.state.status;
		strm.state = null;
		return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
	};
	var deflateSetDictionary = (strm, dictionary) => {
		let dictLength = dictionary.length;
		if (deflateStateCheck(strm)) return Z_STREAM_ERROR;
		const s = strm.state;
		const wrap = s.wrap;
		if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) return Z_STREAM_ERROR;
		if (wrap === 1) strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
		s.wrap = 0;
		if (dictLength >= s.w_size) {
			if (wrap === 0) {
				/*** CLEAR_HASH(s); ***/
				zero(s.head);
				s.strstart = 0;
				s.block_start = 0;
				s.insert = 0;
			}
			let tmpDict = new Uint8Array(s.w_size);
			tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
			dictionary = tmpDict;
			dictLength = s.w_size;
		}
		const avail = strm.avail_in;
		const next = strm.next_in;
		const input = strm.input;
		strm.avail_in = dictLength;
		strm.next_in = 0;
		strm.input = dictionary;
		fill_window(s);
		while (s.lookahead >= MIN_MATCH) {
			let str = s.strstart;
			let n = s.lookahead - 2;
			do {
				INSERT_STRING(s, str);
				str++;
			} while (--n);
			s.strstart = str;
			s.lookahead = 2;
			fill_window(s);
		}
		s.strstart += s.lookahead;
		s.block_start = s.strstart;
		s.insert = s.lookahead;
		s.lookahead = 0;
		s.match_length = s.prev_length = 2;
		s.match_available = 0;
		strm.next_in = next;
		strm.input = input;
		strm.avail_in = avail;
		s.wrap = wrap;
		return Z_OK;
	};
	module.exports.deflateInit = deflateInit;
	module.exports.deflateInit2 = deflateInit2;
	module.exports.deflateReset = deflateReset;
	module.exports.deflateResetKeep = deflateResetKeep;
	module.exports.deflateSetHeader = deflateSetHeader;
	module.exports.deflate = deflate;
	module.exports.deflateEnd = deflateEnd;
	module.exports.deflateSetDictionary = deflateSetDictionary;
	module.exports.deflateInfo = "pako deflate (from Nodeca project)";
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/utils/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _has = (obj, key) => {
		return Object.prototype.hasOwnProperty.call(obj, key);
	};
	module.exports.assign = function(obj) {
		const sources = Array.prototype.slice.call(arguments, 1);
		while (sources.length) {
			const source = sources.shift();
			if (!source) continue;
			if (typeof source !== "object") throw new TypeError(source + "must be non-object");
			for (const p in source) if (_has(source, p)) obj[p] = source[p];
		}
		return obj;
	};
	module.exports.flattenChunks = (chunks) => {
		let len = 0;
		for (let i = 0, l = chunks.length; i < l; i++) len += chunks[i].length;
		const result = new Uint8Array(len);
		for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
			let chunk = chunks[i];
			result.set(chunk, pos);
			pos += chunk.length;
		}
		return result;
	};
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/utils/strings.js
var require_strings = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var STR_APPLY_UIA_OK = true;
	try {
		String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
	} catch (__) {
		STR_APPLY_UIA_OK = false;
	}
	var _utf8len = /* @__PURE__ */ new Uint8Array(256);
	for (let q = 0; q < 256; q++) _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
	_utf8len[254] = _utf8len[255] = 1;
	module.exports.string2buf = (str) => {
		if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(str);
		let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
		for (m_pos = 0; m_pos < str_len; m_pos++) {
			c = str.charCodeAt(m_pos);
			if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
				c2 = str.charCodeAt(m_pos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					m_pos++;
				}
			}
			buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
		}
		buf = new Uint8Array(buf_len);
		for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
			c = str.charCodeAt(m_pos);
			if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
				c2 = str.charCodeAt(m_pos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					m_pos++;
				}
			}
			if (c < 128) buf[i++] = c;
			else if (c < 2048) {
				buf[i++] = 192 | c >>> 6;
				buf[i++] = 128 | c & 63;
			} else if (c < 65536) {
				buf[i++] = 224 | c >>> 12;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			} else {
				buf[i++] = 240 | c >>> 18;
				buf[i++] = 128 | c >>> 12 & 63;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			}
		}
		return buf;
	};
	var buf2binstring = (buf, len) => {
		if (len < 65534) {
			if (buf.subarray && STR_APPLY_UIA_OK) return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
		}
		let result = "";
		for (let i = 0; i < len; i++) result += String.fromCharCode(buf[i]);
		return result;
	};
	module.exports.buf2string = (buf, max) => {
		const len = max || buf.length;
		if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(buf.subarray(0, max));
		let i, out;
		const utf16buf = new Array(len * 2);
		for (out = 0, i = 0; i < len;) {
			let c = buf[i++];
			if (c < 128) {
				utf16buf[out++] = c;
				continue;
			}
			let c_len = _utf8len[c];
			if (c_len > 4) {
				utf16buf[out++] = 65533;
				i += c_len - 1;
				continue;
			}
			c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
			while (c_len > 1 && i < len) {
				c = c << 6 | buf[i++] & 63;
				c_len--;
			}
			if (c_len > 1) {
				utf16buf[out++] = 65533;
				continue;
			}
			if (c < 65536) utf16buf[out++] = c;
			else {
				c -= 65536;
				utf16buf[out++] = 55296 | c >> 10 & 1023;
				utf16buf[out++] = 56320 | c & 1023;
			}
		}
		return buf2binstring(utf16buf, out);
	};
	module.exports.utf8border = (buf, max) => {
		max = max || buf.length;
		if (max > buf.length) max = buf.length;
		let pos = max - 1;
		while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
		if (pos < 0) return max;
		if (pos === 0) return max;
		return pos + _utf8len[buf[pos]] > max ? pos : max;
	};
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/zstream.js
var require_zstream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function ZStream() {
		this.input = null;
		this.next_in = 0;
		this.avail_in = 0;
		this.total_in = 0;
		this.output = null;
		this.next_out = 0;
		this.avail_out = 0;
		this.total_out = 0;
		this.msg = "";
		this.state = null;
		this.data_type = 2;
		this.adler = 0;
	}
	module.exports = ZStream;
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/deflate.js
var require_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var zlib_deflate = require_deflate$1();
	var utils = require_common();
	var strings = require_strings();
	var msg = require_messages();
	var ZStream = require_zstream();
	var toString = Object.prototype.toString;
	var { Z_NO_FLUSH, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_OK, Z_STREAM_END, Z_DEFAULT_COMPRESSION, Z_DEFAULT_STRATEGY, Z_DEFLATED } = require_constants();
	var defaultOptions = {
		level: Z_DEFAULT_COMPRESSION,
		method: Z_DEFLATED,
		chunkSize: 16384,
		windowBits: 15,
		memLevel: 8,
		strategy: Z_DEFAULT_STRATEGY,
		legacyHash: true
	};
	/**
	* class Deflate
	*
	* Generic JS-style wrapper for zlib calls. If you don't need
	* streaming behaviour - use more simple functions: [[deflate]],
	* [[deflateRaw]] and [[gzip]].
	**/
	/**
	* Deflate.result -> Uint8Array
	*
	* Compressed result, generated by default [[Deflate#onData]]
	* and [[Deflate#onEnd]] handlers. Filled after you push last chunk
	* (call [[Deflate#push]] with `Z_FINISH` / `true` param).
	**/
	/**
	* Deflate.err -> Number
	*
	* Error code after deflate finished. 0 (Z_OK) on success.
	* You will not need it in real life, because deflate errors
	* are possible only on wrong options or bad `onData` / `onEnd`
	* custom handlers.
	**/
	/**
	* Deflate.msg -> String
	*
	* Error message, if [[Deflate.err]] != 0
	**/
	/**
	* new Deflate(options)
	* - options (Object): zlib deflate options.
	*
	* Creates new deflator instance with specified params. Throws exception
	* on bad params. Supported options:
	*
	* - `level`
	* - `windowBits`
	* - `memLevel`
	* - `strategy`
	* - `dictionary`
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information on these.
	*
	* - `legacyHash` (Boolean) - use the classic zlib hash (default), which matches
	*   canonical zlib output byte-for-byte. Set to `false` to use the faster
	*   ANZAC++ hash, which matches recent (chromium) node.js output instead.
	*
	* Additional options, for internal needs:
	*
	* - `chunkSize` - size of generated data chunks (16K by default)
	* - `raw` (Boolean) - do raw deflate
	* - `gzip` (Boolean) - create gzip wrapper
	* - `header` (Object) - custom header for gzip
	*   - `text` (Boolean) - true if compressed data believed to be text
	*   - `time` (Number) - modification time, unix timestamp
	*   - `os` (Number) - operation system code
	*   - `extra` (Array) - array of bytes with extra data (max 65536)
	*   - `name` (String) - file name (binary string)
	*   - `comment` (String) - comment (binary string)
	*   - `hcrc` (Boolean) - true if header crc should be added
	*
	* ##### Example:
	*
	* ```javascript
	* const pako = require('pako')
	*   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
	*   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	*
	* const deflate = new pako.Deflate({ level: 3});
	*
	* deflate.push(chunk1, false);
	* deflate.push(chunk2, true);  // true -> last chunk
	*
	* if (deflate.err) { throw new Error(deflate.err); }
	*
	* console.log(deflate.result);
	* ```
	**/
	function Deflate(options) {
		this.options = utils.assign({}, defaultOptions, options || {});
		let opt = this.options;
		if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
		else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
		this.err = 0;
		this.msg = "";
		this.ended = false;
		this.chunks = [];
		this.strm = new ZStream();
		this.strm.avail_out = 0;
		let status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy, opt.legacyHash);
		if (status !== Z_OK) throw new Error(msg[status]);
		if (opt.header) zlib_deflate.deflateSetHeader(this.strm, opt.header);
		if (opt.dictionary) {
			let dict;
			if (typeof opt.dictionary === "string") dict = strings.string2buf(opt.dictionary);
			else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") dict = new Uint8Array(opt.dictionary);
			else dict = opt.dictionary;
			status = zlib_deflate.deflateSetDictionary(this.strm, dict);
			if (status !== Z_OK) throw new Error(msg[status]);
			this._dict_set = true;
		}
	}
	/**
	* Deflate#push(data[, flush_mode]) -> Boolean
	* - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
	*   converted to utf8 byte sequence.
	* - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	*   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
	*
	* Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
	* new compressed chunks. Returns `true` on success. The last data block must
	* have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
	* buffers and call [[Deflate#onEnd]].
	*
	* On fail call [[Deflate#onEnd]] with error code and return false.
	*
	* ##### Example
	*
	* ```javascript
	* push(chunk, false); // push one of data chunks
	* ...
	* push(chunk, true);  // push last chunk
	* ```
	**/
	Deflate.prototype.push = function(data, flush_mode) {
		const strm = this.strm;
		const chunkSize = this.options.chunkSize;
		let status, _flush_mode;
		if (this.ended) return false;
		if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
		else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
		if (typeof data === "string") strm.input = strings.string2buf(data);
		else if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
		else strm.input = data;
		strm.next_in = 0;
		strm.avail_in = strm.input.length;
		for (;;) {
			if (strm.avail_out === 0) {
				strm.output = new Uint8Array(chunkSize);
				strm.next_out = 0;
				strm.avail_out = chunkSize;
			}
			if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
				this.onData(strm.output.subarray(0, strm.next_out));
				strm.avail_out = 0;
				continue;
			}
			status = zlib_deflate.deflate(strm, _flush_mode);
			if (status === Z_STREAM_END) {
				if (strm.next_out > 0) this.onData(strm.output.subarray(0, strm.next_out));
				status = zlib_deflate.deflateEnd(this.strm);
				this.onEnd(status);
				this.ended = true;
				return status === Z_OK;
			}
			if (strm.avail_out === 0) {
				this.onData(strm.output);
				continue;
			}
			if (_flush_mode > 0 && strm.next_out > 0) {
				this.onData(strm.output.subarray(0, strm.next_out));
				strm.avail_out = 0;
				continue;
			}
			if (strm.avail_in === 0) break;
		}
		return true;
	};
	/**
	* Deflate#onData(chunk) -> Void
	* - chunk (Uint8Array): output data.
	*
	* By default, stores data blocks in `chunks[]` property and glue
	* those in `onEnd`. Override this handler, if you need another behaviour.
	**/
	Deflate.prototype.onData = function(chunk) {
		this.chunks.push(chunk);
	};
	/**
	* Deflate#onEnd(status) -> Void
	* - status (Number): deflate status. 0 (Z_OK) on success,
	*   other if not.
	*
	* Called once after you tell deflate that the input stream is
	* complete (Z_FINISH). By default - join collected chunks,
	* free memory and fill `results` / `err` properties.
	**/
	Deflate.prototype.onEnd = function(status) {
		if (status === Z_OK) this.result = utils.flattenChunks(this.chunks);
		this.chunks = [];
		this.err = status;
		this.msg = this.strm.msg;
	};
	/**
	* deflate(data[, options]) -> Uint8Array
	* - data (Uint8Array|ArrayBuffer|String): input data to compress.
	* - options (Object): zlib deflate options.
	*
	* Compress `data` with deflate algorithm and `options`.
	*
	* Supported options are:
	*
	* - level
	* - windowBits
	* - memLevel
	* - strategy
	* - dictionary
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information on these.
	*
	* Sugar (options):
	*
	* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	*   negative windowBits implicitly.
	*
	* ##### Example:
	*
	* ```javascript
	* const pako = require('pako')
	* const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
	*
	* console.log(pako.deflate(data));
	* ```
	**/
	function deflate(input, options) {
		const deflator = new Deflate(options);
		deflator.push(input, true);
		if (deflator.err) throw deflator.msg || msg[deflator.err];
		return deflator.result;
	}
	/**
	* deflateRaw(data[, options]) -> Uint8Array
	* - data (Uint8Array|ArrayBuffer|String): input data to compress.
	* - options (Object): zlib deflate options.
	*
	* The same as [[deflate]], but creates raw data, without wrapper
	* (header and adler32 crc).
	**/
	function deflateRaw(input, options) {
		options = options || {};
		options.raw = true;
		return deflate(input, options);
	}
	/**
	* gzip(data[, options]) -> Uint8Array
	* - data (Uint8Array|ArrayBuffer|String): input data to compress.
	* - options (Object): zlib deflate options.
	*
	* The same as [[deflate]], but create gzip wrapper instead of
	* deflate one.
	**/
	function gzip(input, options) {
		options = options || {};
		options.gzip = true;
		return deflate(input, options);
	}
	module.exports.Deflate = Deflate;
	module.exports.deflate = deflate;
	module.exports.deflateRaw = deflateRaw;
	module.exports.gzip = gzip;
	module.exports.constants = require_constants();
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/inffast.js
var require_inffast = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BAD = 16209;
	var TYPE = 16191;
	module.exports = function inflate_fast(strm, start) {
		let _in;
		let last;
		let _out;
		let beg;
		let end;
		let dmax;
		let wsize;
		let whave;
		let wnext;
		let s_window;
		let hold;
		let bits;
		let lcode;
		let dcode;
		let lmask;
		let dmask;
		let here;
		let op;
		let len;
		let dist;
		let from;
		let from_source;
		let input, output;
		const state = strm.state;
		_in = strm.next_in;
		input = strm.input;
		last = _in + (strm.avail_in - 5);
		_out = strm.next_out;
		output = strm.output;
		beg = _out - (start - strm.avail_out);
		end = _out + (strm.avail_out - 257);
		dmax = state.dmax;
		wsize = state.wsize;
		whave = state.whave;
		wnext = state.wnext;
		s_window = state.window;
		hold = state.hold;
		bits = state.bits;
		lcode = state.lencode;
		dcode = state.distcode;
		lmask = (1 << state.lenbits) - 1;
		dmask = (1 << state.distbits) - 1;
		top: do {
			if (bits < 15) {
				hold += input[_in++] << bits;
				bits += 8;
				hold += input[_in++] << bits;
				bits += 8;
			}
			here = lcode[hold & lmask];
			dolen: for (;;) {
				op = here >>> 24;
				hold >>>= op;
				bits -= op;
				op = here >>> 16 & 255;
				if (op === 0) output[_out++] = here & 65535;
				else if (op & 16) {
					len = here & 65535;
					op &= 15;
					if (op) {
						if (bits < op) {
							hold += input[_in++] << bits;
							bits += 8;
						}
						len += hold & (1 << op) - 1;
						hold >>>= op;
						bits -= op;
					}
					if (bits < 15) {
						hold += input[_in++] << bits;
						bits += 8;
						hold += input[_in++] << bits;
						bits += 8;
					}
					here = dcode[hold & dmask];
					dodist: for (;;) {
						op = here >>> 24;
						hold >>>= op;
						bits -= op;
						op = here >>> 16 & 255;
						if (op & 16) {
							dist = here & 65535;
							op &= 15;
							if (bits < op) {
								hold += input[_in++] << bits;
								bits += 8;
								if (bits < op) {
									hold += input[_in++] << bits;
									bits += 8;
								}
							}
							dist += hold & (1 << op) - 1;
							if (dist > dmax) {
								strm.msg = "invalid distance too far back";
								state.mode = BAD;
								break top;
							}
							hold >>>= op;
							bits -= op;
							op = _out - beg;
							if (dist > op) {
								op = dist - op;
								if (op > whave) {
									if (state.sane) {
										strm.msg = "invalid distance too far back";
										state.mode = BAD;
										break top;
									}
								}
								from = 0;
								from_source = s_window;
								if (wnext === 0) {
									from += wsize - op;
									if (op < len) {
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = _out - dist;
										from_source = output;
									}
								} else if (wnext < op) {
									from += wsize + wnext - op;
									op -= wnext;
									if (op < len) {
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = 0;
										if (wnext < len) {
											op = wnext;
											len -= op;
											do
												output[_out++] = s_window[from++];
											while (--op);
											from = _out - dist;
											from_source = output;
										}
									}
								} else {
									from += wnext - op;
									if (op < len) {
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = _out - dist;
										from_source = output;
									}
								}
								while (len > 2) {
									output[_out++] = from_source[from++];
									output[_out++] = from_source[from++];
									output[_out++] = from_source[from++];
									len -= 3;
								}
								if (len) {
									output[_out++] = from_source[from++];
									if (len > 1) output[_out++] = from_source[from++];
								}
							} else {
								from = _out - dist;
								do {
									output[_out++] = output[from++];
									output[_out++] = output[from++];
									output[_out++] = output[from++];
									len -= 3;
								} while (len > 2);
								if (len) {
									output[_out++] = output[from++];
									if (len > 1) output[_out++] = output[from++];
								}
							}
						} else if ((op & 64) === 0) {
							here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
							continue dodist;
						} else {
							strm.msg = "invalid distance code";
							state.mode = BAD;
							break top;
						}
						break;
					}
				} else if ((op & 64) === 0) {
					here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
					continue dolen;
				} else if (op & 32) {
					state.mode = TYPE;
					break top;
				} else {
					strm.msg = "invalid literal/length code";
					state.mode = BAD;
					break top;
				}
				break;
			}
		} while (_in < last && _out < end);
		len = bits >> 3;
		_in -= len;
		bits -= len << 3;
		hold &= (1 << bits) - 1;
		strm.next_in = _in;
		strm.next_out = _out;
		strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
		strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
		state.hold = hold;
		state.bits = bits;
	};
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MAXBITS = 15;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;
	var lbase = new Uint16Array([
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		13,
		15,
		17,
		19,
		23,
		27,
		31,
		35,
		43,
		51,
		59,
		67,
		83,
		99,
		115,
		131,
		163,
		195,
		227,
		258,
		0,
		0
	]);
	var lext = new Uint8Array([
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		17,
		17,
		17,
		17,
		18,
		18,
		18,
		18,
		19,
		19,
		19,
		19,
		20,
		20,
		20,
		20,
		21,
		21,
		21,
		21,
		16,
		199,
		75
	]);
	var dbase = new Uint16Array([
		1,
		2,
		3,
		4,
		5,
		7,
		9,
		13,
		17,
		25,
		33,
		49,
		65,
		97,
		129,
		193,
		257,
		385,
		513,
		769,
		1025,
		1537,
		2049,
		3073,
		4097,
		6145,
		8193,
		12289,
		16385,
		24577,
		0,
		0
	]);
	var dext = new Uint8Array([
		16,
		16,
		16,
		16,
		17,
		17,
		18,
		18,
		19,
		19,
		20,
		20,
		21,
		21,
		22,
		22,
		23,
		23,
		24,
		24,
		25,
		25,
		26,
		26,
		27,
		27,
		28,
		28,
		29,
		29,
		64,
		64
	]);
	var inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
		const bits = opts.bits;
		let len = 0;
		let sym = 0;
		let min = 0, max = 0;
		let root = 0;
		let curr = 0;
		let drop = 0;
		let left = 0;
		let used = 0;
		let huff = 0;
		let incr;
		let fill;
		let low;
		let mask;
		let next;
		let base = null;
		let match;
		const count = /* @__PURE__ */ new Uint16Array(16);
		const offs = /* @__PURE__ */ new Uint16Array(16);
		let extra = null;
		let here_bits, here_op, here_val;
		for (len = 0; len <= MAXBITS; len++) count[len] = 0;
		for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;
		root = bits;
		for (max = MAXBITS; max >= 1; max--) if (count[max] !== 0) break;
		if (root > max) root = max;
		if (max === 0) {
			table[table_index++] = 20971520;
			table[table_index++] = 20971520;
			opts.bits = 1;
			return 0;
		}
		for (min = 1; min < max; min++) if (count[min] !== 0) break;
		if (root < min) root = min;
		left = 1;
		for (len = 1; len <= MAXBITS; len++) {
			left <<= 1;
			left -= count[len];
			if (left < 0) return -1;
		}
		if (left > 0 && (type === CODES || max !== 1)) return -1;
		offs[1] = 0;
		for (len = 1; len < MAXBITS; len++) offs[len + 1] = offs[len] + count[len];
		for (sym = 0; sym < codes; sym++) if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
		if (type === CODES) {
			base = extra = work;
			match = 20;
		} else if (type === LENS) {
			base = lbase;
			extra = lext;
			match = 257;
		} else {
			base = dbase;
			extra = dext;
			match = 0;
		}
		huff = 0;
		sym = 0;
		len = min;
		next = table_index;
		curr = root;
		drop = 0;
		low = -1;
		used = 1 << root;
		mask = used - 1;
		if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) return 1;
		for (;;) {
			here_bits = len - drop;
			if (work[sym] + 1 < match) {
				here_op = 0;
				here_val = work[sym];
			} else if (work[sym] >= match) {
				here_op = extra[work[sym] - match];
				here_val = base[work[sym] - match];
			} else {
				here_op = 96;
				here_val = 0;
			}
			incr = 1 << len - drop;
			fill = 1 << curr;
			min = fill;
			do {
				fill -= incr;
				table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
			} while (fill !== 0);
			incr = 1 << len - 1;
			while (huff & incr) incr >>= 1;
			if (incr !== 0) {
				huff &= incr - 1;
				huff += incr;
			} else huff = 0;
			sym++;
			if (--count[len] === 0) {
				if (len === max) break;
				len = lens[lens_index + work[sym]];
			}
			if (len > root && (huff & mask) !== low) {
				if (drop === 0) drop = root;
				next += min;
				curr = len - drop;
				left = 1 << curr;
				while (curr + drop < max) {
					left -= count[curr + drop];
					if (left <= 0) break;
					curr++;
					left <<= 1;
				}
				used += 1 << curr;
				if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) return 1;
				low = huff & mask;
				table[low] = root << 24 | curr << 16 | next - table_index | 0;
			}
		}
		if (huff !== 0) table[next + huff] = len - drop << 24 | 4194304;
		opts.bits = root;
		return 0;
	};
	module.exports = inflate_table;
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/inflate.js
var require_inflate$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var adler32 = require_adler32();
	var crc32 = require_crc32();
	var inflate_fast = require_inffast();
	var inflate_table = require_inftrees();
	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;
	var { Z_FINISH, Z_BLOCK, Z_TREES, Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR, Z_DEFLATED } = require_constants();
	var HEAD = 16180;
	var FLAGS = 16181;
	var TIME = 16182;
	var OS = 16183;
	var EXLEN = 16184;
	var EXTRA = 16185;
	var NAME = 16186;
	var COMMENT = 16187;
	var HCRC = 16188;
	var DICTID = 16189;
	var DICT = 16190;
	var TYPE = 16191;
	var TYPEDO = 16192;
	var STORED = 16193;
	var COPY_ = 16194;
	var COPY = 16195;
	var TABLE = 16196;
	var LENLENS = 16197;
	var CODELENS = 16198;
	var LEN_ = 16199;
	var LEN = 16200;
	var LENEXT = 16201;
	var DIST = 16202;
	var DISTEXT = 16203;
	var MATCH = 16204;
	var LIT = 16205;
	var CHECK = 16206;
	var LENGTH = 16207;
	var DONE = 16208;
	var BAD = 16209;
	var MEM = 16210;
	var SYNC = 16211;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	var DEF_WBITS = 15;
	var zswap32 = (q) => {
		return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
	};
	function InflateState() {
		this.strm = null;
		this.mode = 0;
		this.last = false;
		this.wrap = 0;
		this.havedict = false;
		this.flags = 0;
		this.dmax = 0;
		this.check = 0;
		this.total = 0;
		this.head = null;
		this.wbits = 0;
		this.wsize = 0;
		this.whave = 0;
		this.wnext = 0;
		this.window = null;
		this.hold = 0;
		this.bits = 0;
		this.length = 0;
		this.offset = 0;
		this.extra = 0;
		this.lencode = null;
		this.distcode = null;
		this.lenbits = 0;
		this.distbits = 0;
		this.ncode = 0;
		this.nlen = 0;
		this.ndist = 0;
		this.have = 0;
		this.next = null;
		this.lens = /* @__PURE__ */ new Uint16Array(320);
		this.work = /* @__PURE__ */ new Uint16Array(288);
		this.lendyn = null;
		this.distdyn = null;
		this.sane = 0;
		this.back = 0;
		this.was = 0;
	}
	var inflateStateCheck = (strm) => {
		if (!strm) return 1;
		const state = strm.state;
		if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) return 1;
		return 0;
	};
	var inflateResetKeep = (strm) => {
		if (inflateStateCheck(strm)) return Z_STREAM_ERROR;
		const state = strm.state;
		strm.total_in = strm.total_out = state.total = 0;
		strm.msg = "";
		if (state.wrap) strm.adler = state.wrap & 1;
		state.mode = HEAD;
		state.last = 0;
		state.havedict = 0;
		state.flags = -1;
		state.dmax = 32768;
		state.head = null;
		state.hold = 0;
		state.bits = 0;
		state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
		state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
		state.sane = 1;
		state.back = -1;
		return Z_OK;
	};
	var inflateReset = (strm) => {
		if (inflateStateCheck(strm)) return Z_STREAM_ERROR;
		const state = strm.state;
		state.wsize = 0;
		state.whave = 0;
		state.wnext = 0;
		return inflateResetKeep(strm);
	};
	var inflateReset2 = (strm, windowBits) => {
		let wrap;
		if (inflateStateCheck(strm)) return Z_STREAM_ERROR;
		const state = strm.state;
		if (windowBits < 0) {
			wrap = 0;
			windowBits = -windowBits;
		} else {
			wrap = (windowBits >> 4) + 5;
			if (windowBits < 48) windowBits &= 15;
		}
		if (windowBits && (windowBits < 8 || windowBits > 15)) return Z_STREAM_ERROR;
		if (state.window !== null && state.wbits !== windowBits) state.window = null;
		state.wrap = wrap;
		state.wbits = windowBits;
		return inflateReset(strm);
	};
	var inflateInit2 = (strm, windowBits) => {
		if (!strm) return Z_STREAM_ERROR;
		const state = new InflateState();
		strm.state = state;
		state.strm = strm;
		state.window = null;
		state.mode = HEAD;
		const ret = inflateReset2(strm, windowBits);
		if (ret !== Z_OK) strm.state = null;
		return ret;
	};
	var inflateInit = (strm) => {
		return inflateInit2(strm, DEF_WBITS);
	};
	var virgin = true;
	var lenfix;
	var distfix;
	var fixedtables = (state) => {
		if (virgin) {
			lenfix = /* @__PURE__ */ new Int32Array(512);
			distfix = /* @__PURE__ */ new Int32Array(32);
			let sym = 0;
			while (sym < 144) state.lens[sym++] = 8;
			while (sym < 256) state.lens[sym++] = 9;
			while (sym < 280) state.lens[sym++] = 7;
			while (sym < 288) state.lens[sym++] = 8;
			inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
			sym = 0;
			while (sym < 32) state.lens[sym++] = 5;
			inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
			virgin = false;
		}
		state.lencode = lenfix;
		state.lenbits = 9;
		state.distcode = distfix;
		state.distbits = 5;
	};
	var updatewindow = (strm, src, end, copy) => {
		let dist;
		const state = strm.state;
		if (state.window === null) state.window = new Uint8Array(1 << state.wbits);
		if (state.wsize === 0) {
			state.wsize = 1 << state.wbits;
			state.wnext = 0;
			state.whave = 0;
		}
		if (copy >= state.wsize) {
			state.window.set(src.subarray(end - state.wsize, end), 0);
			state.wnext = 0;
			state.whave = state.wsize;
		} else {
			dist = state.wsize - state.wnext;
			if (dist > copy) dist = copy;
			state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
			copy -= dist;
			if (copy) {
				state.window.set(src.subarray(end - copy, end), 0);
				state.wnext = copy;
				state.whave = state.wsize;
			} else {
				state.wnext += dist;
				if (state.wnext === state.wsize) state.wnext = 0;
				if (state.whave < state.wsize) state.whave += dist;
			}
		}
		return 0;
	};
	var inflate = (strm, flush) => {
		let state;
		let input, output;
		let next;
		let put;
		let have, left;
		let hold;
		let bits;
		let _in, _out;
		let copy;
		let from;
		let from_source;
		let here = 0;
		let here_bits, here_op, here_val;
		let last_bits, last_op, last_val;
		let len;
		let ret;
		const hbuf = /* @__PURE__ */ new Uint8Array(4);
		let opts;
		let n;
		const order = new Uint8Array([
			16,
			17,
			18,
			0,
			8,
			7,
			9,
			6,
			10,
			5,
			11,
			4,
			12,
			3,
			13,
			2,
			14,
			1,
			15
		]);
		if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) return Z_STREAM_ERROR;
		state = strm.state;
		if (state.mode === TYPE) state.mode = TYPEDO;
		put = strm.next_out;
		output = strm.output;
		left = strm.avail_out;
		next = strm.next_in;
		input = strm.input;
		have = strm.avail_in;
		hold = state.hold;
		bits = state.bits;
		_in = have;
		_out = left;
		ret = Z_OK;
		inf_leave: for (;;) switch (state.mode) {
			case HEAD:
				if (state.wrap === 0) {
					state.mode = TYPEDO;
					break;
				}
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.wrap & 2 && hold === 35615) {
					if (state.wbits === 0) state.wbits = 15;
					state.check = 0;
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32(state.check, hbuf, 2, 0);
					hold = 0;
					bits = 0;
					state.mode = FLAGS;
					break;
				}
				if (state.head) state.head.done = false;
				if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
					strm.msg = "incorrect header check";
					state.mode = BAD;
					break;
				}
				if ((hold & 15) !== Z_DEFLATED) {
					strm.msg = "unknown compression method";
					state.mode = BAD;
					break;
				}
				hold >>>= 4;
				bits -= 4;
				len = (hold & 15) + 8;
				if (state.wbits === 0) state.wbits = len;
				if (len > 15 || len > state.wbits) {
					strm.msg = "invalid window size";
					state.mode = BAD;
					break;
				}
				state.dmax = 1 << state.wbits;
				state.flags = 0;
				strm.adler = state.check = 1;
				state.mode = hold & 512 ? DICTID : TYPE;
				hold = 0;
				bits = 0;
				break;
			case FLAGS:
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.flags = hold;
				if ((state.flags & 255) !== Z_DEFLATED) {
					strm.msg = "unknown compression method";
					state.mode = BAD;
					break;
				}
				if (state.flags & 57344) {
					strm.msg = "unknown header flags set";
					state.mode = BAD;
					break;
				}
				if (state.head) state.head.text = hold >> 8 & 1;
				if (state.flags & 512 && state.wrap & 4) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32(state.check, hbuf, 2, 0);
				}
				hold = 0;
				bits = 0;
				state.mode = TIME;
			case TIME:
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.head) state.head.time = hold;
				if (state.flags & 512 && state.wrap & 4) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					hbuf[2] = hold >>> 16 & 255;
					hbuf[3] = hold >>> 24 & 255;
					state.check = crc32(state.check, hbuf, 4, 0);
				}
				hold = 0;
				bits = 0;
				state.mode = OS;
			case OS:
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.head) {
					state.head.xflags = hold & 255;
					state.head.os = hold >> 8;
				}
				if (state.flags & 512 && state.wrap & 4) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32(state.check, hbuf, 2, 0);
				}
				hold = 0;
				bits = 0;
				state.mode = EXLEN;
			case EXLEN:
				if (state.flags & 1024) {
					while (bits < 16) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.length = hold;
					if (state.head) state.head.extra_len = hold;
					if (state.flags & 512 && state.wrap & 4) {
						hbuf[0] = hold & 255;
						hbuf[1] = hold >>> 8 & 255;
						state.check = crc32(state.check, hbuf, 2, 0);
					}
					hold = 0;
					bits = 0;
				} else if (state.head) state.head.extra = null;
				state.mode = EXTRA;
			case EXTRA:
				if (state.flags & 1024) {
					copy = state.length;
					if (copy > have) copy = have;
					if (copy) {
						if (state.head) {
							len = state.head.extra_len - state.length;
							if (!state.head.extra) state.head.extra = new Uint8Array(state.head.extra_len);
							state.head.extra.set(input.subarray(next, next + copy), len);
						}
						if (state.flags & 512 && state.wrap & 4) state.check = crc32(state.check, input, copy, next);
						have -= copy;
						next += copy;
						state.length -= copy;
					}
					if (state.length) break inf_leave;
				}
				state.length = 0;
				state.mode = NAME;
			case NAME:
				if (state.flags & 2048) {
					if (have === 0) break inf_leave;
					copy = 0;
					do {
						len = input[next + copy++];
						if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
					} while (len && copy < have);
					if (state.flags & 512 && state.wrap & 4) state.check = crc32(state.check, input, copy, next);
					have -= copy;
					next += copy;
					if (len) break inf_leave;
				} else if (state.head) state.head.name = null;
				state.length = 0;
				state.mode = COMMENT;
			case COMMENT:
				if (state.flags & 4096) {
					if (have === 0) break inf_leave;
					copy = 0;
					do {
						len = input[next + copy++];
						if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
					} while (len && copy < have);
					if (state.flags & 512 && state.wrap & 4) state.check = crc32(state.check, input, copy, next);
					have -= copy;
					next += copy;
					if (len) break inf_leave;
				} else if (state.head) state.head.comment = null;
				state.mode = HCRC;
			case HCRC:
				if (state.flags & 512) {
					while (bits < 16) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (state.wrap & 4 && hold !== (state.check & 65535)) {
						strm.msg = "header crc mismatch";
						state.mode = BAD;
						break;
					}
					hold = 0;
					bits = 0;
				}
				if (state.head) {
					state.head.hcrc = state.flags >> 9 & 1;
					state.head.done = true;
				}
				strm.adler = state.check = 0;
				state.mode = TYPE;
				break;
			case DICTID:
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				strm.adler = state.check = zswap32(hold);
				hold = 0;
				bits = 0;
				state.mode = DICT;
			case DICT:
				if (state.havedict === 0) {
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					return Z_NEED_DICT;
				}
				strm.adler = state.check = 1;
				state.mode = TYPE;
			case TYPE: if (flush === Z_BLOCK || flush === Z_TREES) break inf_leave;
			case TYPEDO:
				if (state.last) {
					hold >>>= bits & 7;
					bits -= bits & 7;
					state.mode = CHECK;
					break;
				}
				while (bits < 3) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.last = hold & 1;
				hold >>>= 1;
				bits -= 1;
				switch (hold & 3) {
					case 0:
						state.mode = STORED;
						break;
					case 1:
						fixedtables(state);
						state.mode = LEN_;
						if (flush === Z_TREES) {
							hold >>>= 2;
							bits -= 2;
							break inf_leave;
						}
						break;
					case 2:
						state.mode = TABLE;
						break;
					case 3:
						strm.msg = "invalid block type";
						state.mode = BAD;
				}
				hold >>>= 2;
				bits -= 2;
				break;
			case STORED:
				hold >>>= bits & 7;
				bits -= bits & 7;
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
					strm.msg = "invalid stored block lengths";
					state.mode = BAD;
					break;
				}
				state.length = hold & 65535;
				hold = 0;
				bits = 0;
				state.mode = COPY_;
				if (flush === Z_TREES) break inf_leave;
			case COPY_: state.mode = COPY;
			case COPY:
				copy = state.length;
				if (copy) {
					if (copy > have) copy = have;
					if (copy > left) copy = left;
					if (copy === 0) break inf_leave;
					output.set(input.subarray(next, next + copy), put);
					have -= copy;
					next += copy;
					left -= copy;
					put += copy;
					state.length -= copy;
					break;
				}
				state.mode = TYPE;
				break;
			case TABLE:
				while (bits < 14) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.nlen = (hold & 31) + 257;
				hold >>>= 5;
				bits -= 5;
				state.ndist = (hold & 31) + 1;
				hold >>>= 5;
				bits -= 5;
				state.ncode = (hold & 15) + 4;
				hold >>>= 4;
				bits -= 4;
				if (state.nlen > 286 || state.ndist > 30) {
					strm.msg = "too many length or distance symbols";
					state.mode = BAD;
					break;
				}
				state.have = 0;
				state.mode = LENLENS;
			case LENLENS:
				while (state.have < state.ncode) {
					while (bits < 3) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.lens[order[state.have++]] = hold & 7;
					hold >>>= 3;
					bits -= 3;
				}
				while (state.have < 19) state.lens[order[state.have++]] = 0;
				state.lencode = state.lendyn;
				state.lenbits = 7;
				opts = { bits: state.lenbits };
				ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
				state.lenbits = opts.bits;
				if (ret) {
					strm.msg = "invalid code lengths set";
					state.mode = BAD;
					break;
				}
				state.have = 0;
				state.mode = CODELENS;
			case CODELENS:
				while (state.have < state.nlen + state.ndist) {
					for (;;) {
						here = state.lencode[hold & (1 << state.lenbits) - 1];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (here_bits <= bits) break;
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (here_val < 16) {
						hold >>>= here_bits;
						bits -= here_bits;
						state.lens[state.have++] = here_val;
					} else {
						if (here_val === 16) {
							n = here_bits + 2;
							while (bits < n) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							if (state.have === 0) {
								strm.msg = "invalid bit length repeat";
								state.mode = BAD;
								break;
							}
							len = state.lens[state.have - 1];
							copy = 3 + (hold & 3);
							hold >>>= 2;
							bits -= 2;
						} else if (here_val === 17) {
							n = here_bits + 3;
							while (bits < n) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							len = 0;
							copy = 3 + (hold & 7);
							hold >>>= 3;
							bits -= 3;
						} else {
							n = here_bits + 7;
							while (bits < n) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							len = 0;
							copy = 11 + (hold & 127);
							hold >>>= 7;
							bits -= 7;
						}
						if (state.have + copy > state.nlen + state.ndist) {
							strm.msg = "invalid bit length repeat";
							state.mode = BAD;
							break;
						}
						while (copy--) state.lens[state.have++] = len;
					}
				}
				if (state.mode === BAD) break;
				if (state.lens[256] === 0) {
					strm.msg = "invalid code -- missing end-of-block";
					state.mode = BAD;
					break;
				}
				state.lenbits = 9;
				opts = { bits: state.lenbits };
				ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
				state.lenbits = opts.bits;
				if (ret) {
					strm.msg = "invalid literal/lengths set";
					state.mode = BAD;
					break;
				}
				state.distbits = 6;
				state.distcode = state.distdyn;
				opts = { bits: state.distbits };
				ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
				state.distbits = opts.bits;
				if (ret) {
					strm.msg = "invalid distances set";
					state.mode = BAD;
					break;
				}
				state.mode = LEN_;
				if (flush === Z_TREES) break inf_leave;
			case LEN_: state.mode = LEN;
			case LEN:
				if (have >= 6 && left >= 258) {
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					inflate_fast(strm, _out);
					put = strm.next_out;
					output = strm.output;
					left = strm.avail_out;
					next = strm.next_in;
					input = strm.input;
					have = strm.avail_in;
					hold = state.hold;
					bits = state.bits;
					if (state.mode === TYPE) state.back = -1;
					break;
				}
				state.back = 0;
				for (;;) {
					here = state.lencode[hold & (1 << state.lenbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (here_op && (here_op & 240) === 0) {
					last_bits = here_bits;
					last_op = here_op;
					last_val = here_val;
					for (;;) {
						here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (last_bits + here_bits <= bits) break;
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					hold >>>= last_bits;
					bits -= last_bits;
					state.back += last_bits;
				}
				hold >>>= here_bits;
				bits -= here_bits;
				state.back += here_bits;
				state.length = here_val;
				if (here_op === 0) {
					state.mode = LIT;
					break;
				}
				if (here_op & 32) {
					state.back = -1;
					state.mode = TYPE;
					break;
				}
				if (here_op & 64) {
					strm.msg = "invalid literal/length code";
					state.mode = BAD;
					break;
				}
				state.extra = here_op & 15;
				state.mode = LENEXT;
			case LENEXT:
				if (state.extra) {
					n = state.extra;
					while (bits < n) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.length += hold & (1 << state.extra) - 1;
					hold >>>= state.extra;
					bits -= state.extra;
					state.back += state.extra;
				}
				state.was = state.length;
				state.mode = DIST;
			case DIST:
				for (;;) {
					here = state.distcode[hold & (1 << state.distbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if ((here_op & 240) === 0) {
					last_bits = here_bits;
					last_op = here_op;
					last_val = here_val;
					for (;;) {
						here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (last_bits + here_bits <= bits) break;
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					hold >>>= last_bits;
					bits -= last_bits;
					state.back += last_bits;
				}
				hold >>>= here_bits;
				bits -= here_bits;
				state.back += here_bits;
				if (here_op & 64) {
					strm.msg = "invalid distance code";
					state.mode = BAD;
					break;
				}
				state.offset = here_val;
				state.extra = here_op & 15;
				state.mode = DISTEXT;
			case DISTEXT:
				if (state.extra) {
					n = state.extra;
					while (bits < n) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.offset += hold & (1 << state.extra) - 1;
					hold >>>= state.extra;
					bits -= state.extra;
					state.back += state.extra;
				}
				if (state.offset > state.dmax) {
					strm.msg = "invalid distance too far back";
					state.mode = BAD;
					break;
				}
				state.mode = MATCH;
			case MATCH:
				if (left === 0) break inf_leave;
				copy = _out - left;
				if (state.offset > copy) {
					copy = state.offset - copy;
					if (copy > state.whave) {
						if (state.sane) {
							strm.msg = "invalid distance too far back";
							state.mode = BAD;
							break;
						}
					}
					if (copy > state.wnext) {
						copy -= state.wnext;
						from = state.wsize - copy;
					} else from = state.wnext - copy;
					if (copy > state.length) copy = state.length;
					from_source = state.window;
				} else {
					from_source = output;
					from = put - state.offset;
					copy = state.length;
				}
				if (copy > left) copy = left;
				left -= copy;
				state.length -= copy;
				do
					output[put++] = from_source[from++];
				while (--copy);
				if (state.length === 0) state.mode = LEN;
				break;
			case LIT:
				if (left === 0) break inf_leave;
				output[put++] = state.length;
				left--;
				state.mode = LEN;
				break;
			case CHECK:
				if (state.wrap) {
					while (bits < 32) {
						if (have === 0) break inf_leave;
						have--;
						hold |= input[next++] << bits;
						bits += 8;
					}
					_out -= left;
					strm.total_out += _out;
					state.total += _out;
					if (state.wrap & 4 && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
					_out = left;
					if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
						strm.msg = "incorrect data check";
						state.mode = BAD;
						break;
					}
					hold = 0;
					bits = 0;
				}
				state.mode = LENGTH;
			case LENGTH:
				if (state.wrap && state.flags) {
					while (bits < 32) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
						strm.msg = "incorrect length check";
						state.mode = BAD;
						break;
					}
					hold = 0;
					bits = 0;
				}
				state.mode = DONE;
			case DONE:
				ret = Z_STREAM_END;
				break inf_leave;
			case BAD:
				ret = Z_DATA_ERROR;
				break inf_leave;
			case MEM: return Z_MEM_ERROR;
			case SYNC:
			default: return Z_STREAM_ERROR;
		}
		strm.next_out = put;
		strm.avail_out = left;
		strm.next_in = next;
		strm.avail_in = have;
		state.hold = hold;
		state.bits = bits;
		if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
			if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
				state.mode = MEM;
				return Z_MEM_ERROR;
			}
		}
		_in -= strm.avail_in;
		_out -= strm.avail_out;
		strm.total_in += _in;
		strm.total_out += _out;
		state.total += _out;
		if (state.wrap & 4 && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
		strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
		if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) ret = Z_BUF_ERROR;
		return ret;
	};
	var inflateEnd = (strm) => {
		if (inflateStateCheck(strm)) return Z_STREAM_ERROR;
		let state = strm.state;
		if (state.window) state.window = null;
		strm.state = null;
		return Z_OK;
	};
	var inflateGetHeader = (strm, head) => {
		if (inflateStateCheck(strm)) return Z_STREAM_ERROR;
		const state = strm.state;
		if ((state.wrap & 2) === 0) return Z_STREAM_ERROR;
		state.head = head;
		head.done = false;
		return Z_OK;
	};
	var inflateSetDictionary = (strm, dictionary) => {
		const dictLength = dictionary.length;
		let state;
		let dictid;
		let ret;
		if (inflateStateCheck(strm)) return Z_STREAM_ERROR;
		state = strm.state;
		if (state.wrap !== 0 && state.mode !== DICT) return Z_STREAM_ERROR;
		if (state.mode === DICT) {
			dictid = 1;
			dictid = adler32(dictid, dictionary, dictLength, 0);
			if (dictid !== state.check) return Z_DATA_ERROR;
		}
		ret = updatewindow(strm, dictionary, dictLength, dictLength);
		if (ret) {
			state.mode = MEM;
			return Z_MEM_ERROR;
		}
		state.havedict = 1;
		return Z_OK;
	};
	module.exports.inflateReset = inflateReset;
	module.exports.inflateReset2 = inflateReset2;
	module.exports.inflateResetKeep = inflateResetKeep;
	module.exports.inflateInit = inflateInit;
	module.exports.inflateInit2 = inflateInit2;
	module.exports.inflate = inflate;
	module.exports.inflateEnd = inflateEnd;
	module.exports.inflateGetHeader = inflateGetHeader;
	module.exports.inflateSetDictionary = inflateSetDictionary;
	module.exports.inflateInfo = "pako inflate (from Nodeca project)";
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function GZheader() {
		this.text = 0;
		this.time = 0;
		this.xflags = 0;
		this.os = 0;
		this.extra = null;
		this.extra_len = 0;
		this.name = "";
		this.comment = "";
		this.hcrc = 0;
		this.done = false;
	}
	module.exports = GZheader;
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/lib/inflate.js
var require_inflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var zlib_inflate = require_inflate$1();
	var utils = require_common();
	var strings = require_strings();
	var msg = require_messages();
	var ZStream = require_zstream();
	var GZheader = require_gzheader();
	var toString = Object.prototype.toString;
	var { Z_NO_FLUSH, Z_FINISH, Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR } = require_constants();
	var defaultOptions = {
		chunkSize: 65536,
		windowBits: 15,
		to: ""
	};
	/**
	* class Inflate
	*
	* Generic JS-style wrapper for zlib calls. If you don't need
	* streaming behaviour - use more simple functions: [[inflate]]
	* and [[inflateRaw]].
	**/
	/**
	* Inflate.result -> Uint8Array|String
	*
	* Uncompressed result, generated by default [[Inflate#onData]]
	* and [[Inflate#onEnd]] handlers. Filled after you push last chunk
	* (call [[Inflate#push]] with `Z_FINISH` / `true` param).
	**/
	/**
	* Inflate.err -> Number
	*
	* Error code after inflate finished. 0 (Z_OK) on success.
	* Should be checked if broken data possible.
	**/
	/**
	* Inflate.msg -> String
	*
	* Error message, if [[Inflate.err]] != 0
	**/
	/**
	* new Inflate(options)
	* - options (Object): zlib inflate options.
	*
	* Creates new inflator instance with specified params. Throws exception
	* on bad params. Supported options:
	*
	* - `windowBits`
	* - `dictionary`
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information on these.
	*
	* Additional options, for internal needs:
	*
	* - `chunkSize` - size of generated data chunks (16K by default)
	* - `raw` (Boolean) - do raw inflate
	* - `to` (String) - if equal to 'string', then result will be converted
	*   from utf8 to utf16 (javascript) string. When string output requested,
	*   chunk length can differ from `chunkSize`, depending on content.
	*
	* By default, when no options set, autodetect deflate/gzip data format via
	* wrapper header.
	*
	* ##### Example:
	*
	* ```javascript
	* const pako = require('pako')
	* const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
	* const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	*
	* const inflate = new pako.Inflate({ level: 3});
	*
	* inflate.push(chunk1, false);
	* inflate.push(chunk2, true);  // true -> last chunk
	*
	* if (inflate.err) { throw new Error(inflate.err); }
	*
	* console.log(inflate.result);
	* ```
	**/
	function Inflate(options) {
		this.options = utils.assign({}, defaultOptions, options || {});
		const opt = this.options;
		if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
			opt.windowBits = -opt.windowBits;
			if (opt.windowBits === 0) opt.windowBits = -15;
		}
		if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) opt.windowBits += 32;
		if (opt.windowBits > 15 && opt.windowBits < 48) {
			if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
		}
		this.err = 0;
		this.msg = "";
		this.ended = false;
		this.chunks = [];
		this.strm = new ZStream();
		this.strm.avail_out = 0;
		let status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
		if (status !== Z_OK) throw new Error(msg[status]);
		this.header = new GZheader();
		zlib_inflate.inflateGetHeader(this.strm, this.header);
		if (opt.dictionary) {
			if (typeof opt.dictionary === "string") opt.dictionary = strings.string2buf(opt.dictionary);
			else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") opt.dictionary = new Uint8Array(opt.dictionary);
			if (opt.raw) {
				status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
				if (status !== Z_OK) throw new Error(msg[status]);
			}
		}
	}
	/**
	* Inflate#push(data[, flush_mode]) -> Boolean
	* - data (Uint8Array|ArrayBuffer): input data
	* - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
	*   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
	*   `true` means Z_FINISH.
	*
	* Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
	* new output chunks. Returns `true` on success. If end of stream detected,
	* [[Inflate#onEnd]] will be called.
	*
	* `flush_mode` is not needed for normal operation, because end of stream
	* detected automatically. You may try to use it for advanced things, but
	* this functionality was not tested.
	*
	* On fail call [[Inflate#onEnd]] with error code and return false.
	*
	* ##### Example
	*
	* ```javascript
	* push(chunk, false); // push one of data chunks
	* ...
	* push(chunk, true);  // push last chunk
	* ```
	**/
	Inflate.prototype.push = function(data, flush_mode) {
		const strm = this.strm;
		const chunkSize = this.options.chunkSize;
		const dictionary = this.options.dictionary;
		let status, _flush_mode, last_avail_out;
		if (this.ended) return false;
		if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
		else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
		if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
		else strm.input = data;
		strm.next_in = 0;
		strm.avail_in = strm.input.length;
		for (;;) {
			if (strm.avail_out === 0) {
				strm.output = new Uint8Array(chunkSize);
				strm.next_out = 0;
				strm.avail_out = chunkSize;
			}
			status = zlib_inflate.inflate(strm, _flush_mode);
			if (status === Z_NEED_DICT && dictionary) {
				status = zlib_inflate.inflateSetDictionary(strm, dictionary);
				if (status === Z_OK) status = zlib_inflate.inflate(strm, _flush_mode);
				else if (status === Z_DATA_ERROR) status = Z_NEED_DICT;
			}
			while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap & 2 && strm.state.flags !== 0 && strm.input[strm.next_in] !== 0) {
				zlib_inflate.inflateReset(strm);
				status = zlib_inflate.inflate(strm, _flush_mode);
			}
			switch (status) {
				case Z_STREAM_ERROR:
				case Z_DATA_ERROR:
				case Z_NEED_DICT:
				case Z_MEM_ERROR:
					this.onEnd(status);
					this.ended = true;
					return false;
			}
			last_avail_out = strm.avail_out;
			if (strm.next_out) {
				if (strm.avail_out === 0 || status === Z_STREAM_END || _flush_mode > 0) {
					if (this.options.to === "string") {
						let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
						let tail = strm.next_out - next_out_utf8;
						let utf8str = strings.buf2string(strm.output, next_out_utf8);
						strm.next_out = tail;
						strm.avail_out = chunkSize - tail;
						if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
						this.onData(utf8str);
					} else {
						this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
						strm.avail_out = 0;
						strm.next_out = 0;
					}
				}
			}
			if ((status === Z_OK || status === Z_BUF_ERROR) && last_avail_out === 0) continue;
			if (status === Z_STREAM_END) {
				status = zlib_inflate.inflateEnd(this.strm);
				this.onEnd(status);
				this.ended = true;
				return true;
			}
			if (strm.avail_in === 0) {
				if (_flush_mode === Z_FINISH) {
					status = zlib_inflate.inflateEnd(this.strm);
					this.onEnd(status === Z_OK ? Z_BUF_ERROR : status);
					this.ended = true;
					return false;
				}
				break;
			}
		}
		return true;
	};
	/**
	* Inflate#onData(chunk) -> Void
	* - chunk (Uint8Array|String): output data. When string output requested,
	*   each chunk will be string.
	*
	* By default, stores data blocks in `chunks[]` property and glue
	* those in `onEnd`. Override this handler, if you need another behaviour.
	**/
	Inflate.prototype.onData = function(chunk) {
		this.chunks.push(chunk);
	};
	/**
	* Inflate#onEnd(status) -> Void
	* - status (Number): inflate status. 0 (Z_OK) on success,
	*   other if not.
	*
	* Called either after you tell inflate that the input stream is
	* complete (Z_FINISH). By default - join collected chunks,
	* free memory and fill `results` / `err` properties.
	**/
	Inflate.prototype.onEnd = function(status) {
		if (status === Z_OK) {
			if (this.options.to === "string") this.result = this.chunks.join("");
			else this.result = utils.flattenChunks(this.chunks);
		}
		this.chunks = [];
		this.err = status;
		this.msg = this.strm.msg;
	};
	/**
	* inflate(data[, options]) -> Uint8Array|String
	* - data (Uint8Array|ArrayBuffer): input data to decompress.
	* - options (Object): zlib inflate options.
	*
	* Decompress `data` with inflate/ungzip and `options`. Autodetect
	* format via wrapper header by default. That's why we don't provide
	* separate `ungzip` method.
	*
	* Supported options are:
	*
	* - windowBits
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information.
	*
	* Sugar (options):
	*
	* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	*   negative windowBits implicitly.
	* - `to` (String) - if equal to 'string', then result will be converted
	*   from utf8 to utf16 (javascript) string. When string output requested,
	*   chunk length can differ from `chunkSize`, depending on content.
	*
	*
	* ##### Example:
	*
	* ```javascript
	* const pako = require('pako');
	* const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
	* let output;
	*
	* try {
	*   output = pako.inflate(input);
	* } catch (err) {
	*   console.log(err);
	* }
	* ```
	**/
	function inflate(input, options) {
		const inflator = new Inflate(options);
		inflator.push(input, true);
		if (inflator.err) throw inflator.msg || msg[inflator.err];
		return inflator.result;
	}
	/**
	* inflateRaw(data[, options]) -> Uint8Array|String
	* - data (Uint8Array|ArrayBuffer): input data to decompress.
	* - options (Object): zlib inflate options.
	*
	* The same as [[inflate]], but creates raw data, without wrapper
	* (header and adler32 crc).
	**/
	function inflateRaw(input, options) {
		options = options || {};
		options.raw = true;
		return inflate(input, options);
	}
	/**
	* ungzip(data[, options]) -> Uint8Array|String
	* - data (Uint8Array|ArrayBuffer): input data to decompress.
	* - options (Object): zlib inflate options.
	*
	* Just shortcut to [[inflate]], because it autodetects format
	* by header.content. Done for convenience.
	**/
	module.exports.Inflate = Inflate;
	module.exports.inflate = inflate;
	module.exports.inflateRaw = inflateRaw;
	module.exports.ungzip = inflate;
	module.exports.constants = require_constants();
}));
//#endregion
//#region node_modules/pizzip/node_modules/pako/index.js
var require_pako = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Deflate, deflate, deflateRaw, gzip } = require_deflate();
	var { Inflate, inflate, inflateRaw, ungzip } = require_inflate();
	var constants = require_constants();
	module.exports.Deflate = Deflate;
	module.exports.deflate = deflate;
	module.exports.deflateRaw = deflateRaw;
	module.exports.gzip = gzip;
	module.exports.Inflate = Inflate;
	module.exports.inflate = inflate;
	module.exports.inflateRaw = inflateRaw;
	module.exports.ungzip = ungzip;
	module.exports.constants = constants;
}));
//#endregion
export { require_pako_es5_min as n, require_pako as t };
