import {
  __commonJS
} from "./chunk-J32WSRGE.js";

// node_modules/text-mask-addons/dist/textMaskAddons.js
var require_textMaskAddons = __commonJS({
  "node_modules/text-mask-addons/dist/textMaskAddons.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.textMaskAddons = t() : e.textMaskAddons = t();
    }(exports, function() {
      return function(e) {
        function t(r) {
          if (n[r])
            return n[r].exports;
          var i = n[r] = { exports: {}, id: r, loaded: false };
          return e[r].call(i.exports, i, i.exports, t), i.loaded = true, i.exports;
        }
        var n = {};
        return t.m = e, t.c = n, t.p = "", t(0);
      }([function(e, t, n) {
        "use strict";
        function r(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var i = n(1);
        Object.defineProperty(t, "createAutoCorrectedDatePipe", { enumerable: true, get: function() {
          return r(i).default;
        } });
        var o = n(2);
        Object.defineProperty(t, "createNumberMask", { enumerable: true, get: function() {
          return r(o).default;
        } });
        var u = n(3);
        Object.defineProperty(t, "emailMask", { enumerable: true, get: function() {
          return r(u).default;
        } });
      }, function(e, t) {
        "use strict";
        function n() {
          var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "mm dd yyyy", t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n2 = t2.minYear, o = void 0 === n2 ? 1 : n2, u = t2.maxYear, a = void 0 === u ? 9999 : u, c = e2.split(/[^dmyHMS]+/).sort(function(e3, t3) {
            return i.indexOf(e3) - i.indexOf(t3);
          });
          return function(t3) {
            var n3 = [], i2 = { dd: 31, mm: 12, yy: 99, yyyy: a, HH: 23, MM: 59, SS: 59 }, u2 = { dd: 1, mm: 1, yy: 0, yyyy: o, HH: 0, MM: 0, SS: 0 }, l = t3.split("");
            c.forEach(function(t4) {
              var r2 = e2.indexOf(t4), o2 = parseInt(i2[t4].toString().substr(0, 1), 10);
              parseInt(l[r2], 10) > o2 && (l[r2 + 1] = l[r2], l[r2] = 0, n3.push(r2));
            });
            var s = 0, d = c.some(function(n4) {
              var c2 = e2.indexOf(n4), l2 = n4.length, d2 = t3.substr(c2, l2).replace(/\D/g, ""), f = parseInt(d2, 10);
              "mm" === n4 && (s = f || 0);
              var p = "dd" === n4 ? r[s] : i2[n4];
              if ("yyyy" === n4 && (1 !== o || 9999 !== a)) {
                var v = parseInt(i2[n4].toString().substring(0, d2.length), 10), y = parseInt(u2[n4].toString().substring(0, d2.length), 10);
                return f < y || f > v;
              }
              return f > p || d2.length === l2 && f < u2[n4];
            });
            return !d && { value: l.join(""), indexesOfPipedChars: n3 };
          };
        }
        Object.defineProperty(t, "__esModule", { value: true }), t.default = n;
        var r = [31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], i = ["yyyy", "yy", "mm", "dd", "HH", "MM", "SS"];
      }, function(e, t) {
        "use strict";
        function n() {
          function e2() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a, t3 = e3.length;
            if (e3 === a || e3[0] === g[0] && 1 === t3)
              return g.split(a).concat([v]).concat(h.split(a));
            if (e3 === P && _)
              return g.split(a).concat(["0", P, v]).concat(h.split(a));
            var n3 = e3[0] === s && D;
            n3 && (e3 = e3.toString().substr(1));
            var u2 = e3.lastIndexOf(P), c2 = u2 !== -1, l2 = void 0, m2 = void 0, b2 = void 0;
            if (e3.slice($ * -1) === h && (e3 = e3.slice(0, $ * -1)), c2 && (_ || I) ? (l2 = e3.slice(e3.slice(0, N) === g ? N : 0, u2), m2 = e3.slice(u2 + 1, t3), m2 = r(m2.replace(f, a))) : l2 = e3.slice(0, N) === g ? e3.slice(N) : e3, L && ("undefined" == typeof L ? "undefined" : o(L)) === p) {
              var O2 = "." === S ? "[.]" : "" + S, M2 = (l2.match(new RegExp(O2, "g")) || []).length;
              l2 = l2.slice(0, L + M2 * V);
            }
            return l2 = l2.replace(f, a), R || (l2 = l2.replace(/^0+(0$|[^0])/, "$1")), l2 = x ? i(l2, S) : l2, b2 = r(l2), (c2 && _ || I === true) && (e3[u2 - 1] !== P && b2.push(y), b2.push(P, y), m2 && (("undefined" == typeof C ? "undefined" : o(C)) === p && (m2 = m2.slice(0, C)), b2 = b2.concat(m2)), I === true && e3[u2 - 1] === P && b2.push(v)), N > 0 && (b2 = g.split(a).concat(b2)), n3 && (b2.length === N && b2.push(v), b2 = [d].concat(b2)), h.length > 0 && (b2 = b2.concat(h.split(a))), b2;
          }
          var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = t2.prefix, g = void 0 === n2 ? u : n2, m = t2.suffix, h = void 0 === m ? a : m, b = t2.includeThousandsSeparator, x = void 0 === b || b, O = t2.thousandsSeparatorSymbol, S = void 0 === O ? c : O, M = t2.allowDecimal, _ = void 0 !== M && M, j = t2.decimalSymbol, P = void 0 === j ? l : j, w = t2.decimalLimit, C = void 0 === w ? 2 : w, H = t2.requireDecimal, I = void 0 !== H && H, k = t2.allowNegative, D = void 0 !== k && k, E = t2.allowLeadingZeroes, R = void 0 !== E && E, A = t2.integerLimit, L = void 0 === A ? null : A, N = g && g.length || 0, $ = h && h.length || 0, V = S && S.length || 0;
          return e2.instanceOf = "createNumberMask", e2;
        }
        function r(e2) {
          return e2.split(a).map(function(e3) {
            return v.test(e3) ? v : e3;
          });
        }
        function i(e2, t2) {
          return e2.replace(/\B(?=(\d{3})+(?!\d))/g, t2);
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
          return typeof e2;
        } : function(e2) {
          return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
        };
        t.default = n;
        var u = "$", a = "", c = ",", l = ".", s = "-", d = /-/, f = /\D+/g, p = "number", v = /\d/, y = "[]";
      }, function(e, t, n) {
        "use strict";
        function r(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        function i(e2, t2) {
          e2 = e2.replace(O, v);
          var n2 = t2.placeholderChar, r2 = t2.currentCaretPosition, i2 = e2.indexOf(y), s2 = e2.lastIndexOf(p), d2 = s2 < i2 ? -1 : s2, f2 = o(e2, i2 + 1, y), g2 = o(e2, d2 - 1, p), m2 = u(e2, i2, n2), h2 = a(e2, i2, d2, n2), b2 = c(e2, d2, n2, r2);
          m2 = l(m2), h2 = l(h2), b2 = l(b2, true);
          var x2 = m2.concat(f2).concat(h2).concat(g2).concat(b2);
          return x2;
        }
        function o(e2, t2, n2) {
          var r2 = [];
          return e2[t2] === n2 ? r2.push(n2) : r2.push(g, n2), r2.push(g), r2;
        }
        function u(e2, t2) {
          return t2 === -1 ? e2 : e2.slice(0, t2);
        }
        function a(e2, t2, n2, r2) {
          var i2 = v;
          return t2 !== -1 && (i2 = n2 === -1 ? e2.slice(t2 + 1, e2.length) : e2.slice(t2 + 1, n2)), i2 = i2.replace(new RegExp("[\\s" + r2 + "]", h), v), i2 === y ? f : i2.length < 1 ? m : i2[i2.length - 1] === p ? i2.slice(0, i2.length - 1) : i2;
        }
        function c(e2, t2, n2, r2) {
          var i2 = v;
          return t2 !== -1 && (i2 = e2.slice(t2 + 1, e2.length)), i2 = i2.replace(new RegExp("[\\s" + n2 + ".]", h), v), 0 === i2.length ? e2[t2 - 1] === p && r2 !== e2.length ? f : v : i2;
        }
        function l(e2, t2) {
          return e2.split(v).map(function(e3) {
            return e3 === m ? e3 : t2 ? x : b;
          });
        }
        Object.defineProperty(t, "__esModule", { value: true });
        var s = n(4), d = r(s), f = "*", p = ".", v = "", y = "@", g = "[]", m = " ", h = "g", b = /[^\s]/, x = /[^.\s]/, O = /\s/g;
        t.default = { mask: i, pipe: d.default };
      }, function(e, t) {
        "use strict";
        function n(e2, t2) {
          var n2 = t2.currentCaretPosition, o2 = t2.rawValue, f = t2.previousConformedValue, p = t2.placeholderChar, v = e2;
          v = r(v);
          var y = v.indexOf(a), g = null === o2.match(new RegExp("[^@\\s." + p + "]"));
          if (g)
            return u;
          if (v.indexOf(l) !== -1 || y !== -1 && n2 !== y + 1 || o2.indexOf(i) === -1 && f !== u && o2.indexOf(c) !== -1)
            return false;
          var m = v.indexOf(i), h = v.slice(m + 1, v.length);
          return (h.match(d) || s).length > 1 && v.substr(-1) === c && n2 !== o2.length && (v = v.slice(0, v.length - 1)), v;
        }
        function r(e2) {
          var t2 = 0;
          return e2.replace(o, function() {
            return t2++, 1 === t2 ? i : u;
          });
        }
        Object.defineProperty(t, "__esModule", { value: true }), t.default = n;
        var i = "@", o = /@/g, u = "", a = "@.", c = ".", l = "..", s = [], d = /\./g;
      }]);
    });
  }
});
export default require_textMaskAddons();
//# sourceMappingURL=text-mask-addons.js.map
