import {
  appendErrors,
  get,
  set
} from "./chunk-RYGAS6AX.js";
import "./chunk-XCERESLX.js";
import "./chunk-J32WSRGE.js";

// node_modules/@hookform/resolvers/dist/resolvers.mjs
var t = function(e, t2, i2) {
  if (e && "reportValidity" in e) {
    var n2 = get(i2, t2);
    e.setCustomValidity(n2 && n2.message || ""), e.reportValidity();
  }
};
var i = function(r, e) {
  var i2 = function(i3) {
    var n3 = e.fields[i3];
    n3 && n3.ref && "reportValidity" in n3.ref ? t(n3.ref, i3, r) : n3.refs && n3.refs.forEach(function(e2) {
      return t(e2, i3, r);
    });
  };
  for (var n2 in e.fields)
    i2(n2);
};
var n = function(t2, n2) {
  n2.shouldUseNativeValidation && i(t2, n2);
  var f = {};
  for (var s in t2) {
    var u = get(n2.fields, s), c = Object.assign(t2[s] || {}, { ref: u && u.ref });
    if (a(n2.names || Object.keys(t2), s)) {
      var l = Object.assign({}, o(get(f, s)));
      set(l, "root", c), set(f, s, l);
    } else
      set(f, s, c);
  }
  return f;
};
var o = function(r) {
  return Array.isArray(r) ? r.filter(Boolean) : [];
};
var a = function(r, e) {
  return r.some(function(r2) {
    return r2.startsWith(e + ".");
  });
};

// node_modules/@hookform/resolvers/yup/dist/yup.mjs
function o2(o3, n2, a2) {
  return void 0 === n2 && (n2 = {}), void 0 === a2 && (a2 = {}), function(s, i2, c) {
    try {
      return Promise.resolve(function(t2, r) {
        try {
          var u = (n2.context && true && console.warn("You should not used the yup options context. Please, use the 'useForm' context object instead"), Promise.resolve(o3["sync" === a2.mode ? "validateSync" : "validate"](s, Object.assign({ abortEarly: false }, n2, { context: i2 }))).then(function(t3) {
            return c.shouldUseNativeValidation && i({}, c), { values: a2.raw ? s : t3, errors: {} };
          }));
        } catch (e) {
          return r(e);
        }
        return u && u.then ? u.then(void 0, r) : u;
      }(0, function(e) {
        if (!e.inner)
          throw e;
        return { values: {}, errors: n((o4 = e, n3 = !c.shouldUseNativeValidation && "all" === c.criteriaMode, (o4.inner || []).reduce(function(e2, t2) {
          if (e2[t2.path] || (e2[t2.path] = { message: t2.message, type: t2.type }), n3) {
            var o5 = e2[t2.path].types, a3 = o5 && o5[t2.type];
            e2[t2.path] = appendErrors(t2.path, n3, e2, t2.type, a3 ? [].concat(a3, t2.message) : t2.message);
          }
          return e2;
        }, {})), c) };
        var o4, n3;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export {
  o2 as yupResolver
};
//# sourceMappingURL=@hookform_resolvers_yup.js.map
