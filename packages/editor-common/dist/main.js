'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var classNames = require('classnames');
var shadow = require('rc-util/es/Dom/shadow');
var dynamicCSS = require('rc-util/lib/Dom/dynamicCSS');
var ref = require('rc-util/lib/ref');
var warn = require('rc-util/lib/warning');
var jsxRuntime = require('react/jsx-runtime');
var Tippy = require('@tippyjs/react');
require('tippy.js/dist/tippy.css');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n["default"] = e;
	return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var classNames__default = /*#__PURE__*/_interopDefaultLegacy(classNames);
var warn__default = /*#__PURE__*/_interopDefaultLegacy(warn);
var Tippy__default = /*#__PURE__*/_interopDefaultLegacy(Tippy);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var defineProperty$5 = {exports: {}};

var es_object_defineProperty = {};

var globalThis_1$1;
var hasRequiredGlobalThis$1;

function requireGlobalThis$1 () {
	if (hasRequiredGlobalThis$1) return globalThis_1$1;
	hasRequiredGlobalThis$1 = 1;
	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	globalThis_1$1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  check(typeof globalThis_1$1 == 'object' && globalThis_1$1) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();
	return globalThis_1$1;
}

var fails$1;
var hasRequiredFails$1;

function requireFails$1 () {
	if (hasRequiredFails$1) return fails$1;
	hasRequiredFails$1 = 1;
	fails$1 = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};
	return fails$1;
}

var functionBindNative$1;
var hasRequiredFunctionBindNative$1;

function requireFunctionBindNative$1 () {
	if (hasRequiredFunctionBindNative$1) return functionBindNative$1;
	hasRequiredFunctionBindNative$1 = 1;
	var fails = /*@__PURE__*/ requireFails$1();

	functionBindNative$1 = !fails(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});
	return functionBindNative$1;
}

var functionApply$1;
var hasRequiredFunctionApply$1;

function requireFunctionApply$1 () {
	if (hasRequiredFunctionApply$1) return functionApply$1;
	hasRequiredFunctionApply$1 = 1;
	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative$1();

	var FunctionPrototype = Function.prototype;
	var apply = FunctionPrototype.apply;
	var call = FunctionPrototype.call;

	// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
	functionApply$1 = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
	  return call.apply(apply, arguments);
	});
	return functionApply$1;
}

var functionUncurryThis$1;
var hasRequiredFunctionUncurryThis$1;

function requireFunctionUncurryThis$1 () {
	if (hasRequiredFunctionUncurryThis$1) return functionUncurryThis$1;
	hasRequiredFunctionUncurryThis$1 = 1;
	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative$1();

	var FunctionPrototype = Function.prototype;
	var call = FunctionPrototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

	functionUncurryThis$1 = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call.apply(fn, arguments);
	  };
	};
	return functionUncurryThis$1;
}

var classofRaw$1;
var hasRequiredClassofRaw$1;

function requireClassofRaw$1 () {
	if (hasRequiredClassofRaw$1) return classofRaw$1;
	hasRequiredClassofRaw$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	var toString = uncurryThis({}.toString);
	var stringSlice = uncurryThis(''.slice);

	classofRaw$1 = function (it) {
	  return stringSlice(toString(it), 8, -1);
	};
	return classofRaw$1;
}

var functionUncurryThisClause;
var hasRequiredFunctionUncurryThisClause;

function requireFunctionUncurryThisClause () {
	if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
	hasRequiredFunctionUncurryThisClause = 1;
	var classofRaw = /*@__PURE__*/ requireClassofRaw$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	functionUncurryThisClause = function (fn) {
	  // Nashorn bug:
	  //   https://github.com/zloirock/core-js/issues/1128
	  //   https://github.com/zloirock/core-js/issues/1130
	  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
	};
	return functionUncurryThisClause;
}

var isCallable$1;
var hasRequiredIsCallable$1;

function requireIsCallable$1 () {
	if (hasRequiredIsCallable$1) return isCallable$1;
	hasRequiredIsCallable$1 = 1;
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	isCallable$1 = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
	  return typeof argument == 'function';
	};
	return isCallable$1;
}

var objectGetOwnPropertyDescriptor$1 = {};

var descriptors$1;
var hasRequiredDescriptors$1;

function requireDescriptors$1 () {
	if (hasRequiredDescriptors$1) return descriptors$1;
	hasRequiredDescriptors$1 = 1;
	var fails = /*@__PURE__*/ requireFails$1();

	// Detect IE8's incomplete defineProperty implementation
	descriptors$1 = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
	});
	return descriptors$1;
}

var functionCall$1;
var hasRequiredFunctionCall$1;

function requireFunctionCall$1 () {
	if (hasRequiredFunctionCall$1) return functionCall$1;
	hasRequiredFunctionCall$1 = 1;
	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative$1();

	var call = Function.prototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	functionCall$1 = NATIVE_BIND ? call.bind(call) : function () {
	  return call.apply(call, arguments);
	};
	return functionCall$1;
}

var objectPropertyIsEnumerable$1 = {};

var hasRequiredObjectPropertyIsEnumerable$1;

function requireObjectPropertyIsEnumerable$1 () {
	if (hasRequiredObjectPropertyIsEnumerable$1) return objectPropertyIsEnumerable$1;
	hasRequiredObjectPropertyIsEnumerable$1 = 1;
	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable$1.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;
	return objectPropertyIsEnumerable$1;
}

var createPropertyDescriptor$1;
var hasRequiredCreatePropertyDescriptor$1;

function requireCreatePropertyDescriptor$1 () {
	if (hasRequiredCreatePropertyDescriptor$1) return createPropertyDescriptor$1;
	hasRequiredCreatePropertyDescriptor$1 = 1;
	createPropertyDescriptor$1 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};
	return createPropertyDescriptor$1;
}

var indexedObject$1;
var hasRequiredIndexedObject$1;

function requireIndexedObject$1 () {
	if (hasRequiredIndexedObject$1) return indexedObject$1;
	hasRequiredIndexedObject$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var classof = /*@__PURE__*/ requireClassofRaw$1();

	var $Object = Object;
	var split = uncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	indexedObject$1 = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof(it) === 'String' ? split(it, '') : $Object(it);
	} : $Object;
	return indexedObject$1;
}

var isNullOrUndefined$1;
var hasRequiredIsNullOrUndefined$1;

function requireIsNullOrUndefined$1 () {
	if (hasRequiredIsNullOrUndefined$1) return isNullOrUndefined$1;
	hasRequiredIsNullOrUndefined$1 = 1;
	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	isNullOrUndefined$1 = function (it) {
	  return it === null || it === undefined;
	};
	return isNullOrUndefined$1;
}

var requireObjectCoercible$1;
var hasRequiredRequireObjectCoercible$1;

function requireRequireObjectCoercible$1 () {
	if (hasRequiredRequireObjectCoercible$1) return requireObjectCoercible$1;
	hasRequiredRequireObjectCoercible$1 = 1;
	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined$1();

	var $TypeError = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	requireObjectCoercible$1 = function (it) {
	  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
	  return it;
	};
	return requireObjectCoercible$1;
}

var toIndexedObject$1;
var hasRequiredToIndexedObject$1;

function requireToIndexedObject$1 () {
	if (hasRequiredToIndexedObject$1) return toIndexedObject$1;
	hasRequiredToIndexedObject$1 = 1;
	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = /*@__PURE__*/ requireIndexedObject$1();
	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible$1();

	toIndexedObject$1 = function (it) {
	  return IndexedObject(requireObjectCoercible(it));
	};
	return toIndexedObject$1;
}

var isObject$1;
var hasRequiredIsObject$1;

function requireIsObject$1 () {
	if (hasRequiredIsObject$1) return isObject$1;
	hasRequiredIsObject$1 = 1;
	var isCallable = /*@__PURE__*/ requireIsCallable$1();

	isObject$1 = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};
	return isObject$1;
}

var path;
var hasRequiredPath;

function requirePath () {
	if (hasRequiredPath) return path;
	hasRequiredPath = 1;
	path = {};
	return path;
}

var getBuiltIn$1;
var hasRequiredGetBuiltIn$1;

function requireGetBuiltIn$1 () {
	if (hasRequiredGetBuiltIn$1) return getBuiltIn$1;
	hasRequiredGetBuiltIn$1 = 1;
	var path = /*@__PURE__*/ requirePath();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();

	var aFunction = function (variable) {
	  return isCallable(variable) ? variable : undefined;
	};

	getBuiltIn$1 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis[namespace])
	    : path[namespace] && path[namespace][method] || globalThis[namespace] && globalThis[namespace][method];
	};
	return getBuiltIn$1;
}

var objectIsPrototypeOf$1;
var hasRequiredObjectIsPrototypeOf$1;

function requireObjectIsPrototypeOf$1 () {
	if (hasRequiredObjectIsPrototypeOf$1) return objectIsPrototypeOf$1;
	hasRequiredObjectIsPrototypeOf$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	objectIsPrototypeOf$1 = uncurryThis({}.isPrototypeOf);
	return objectIsPrototypeOf$1;
}

var environmentUserAgent$1;
var hasRequiredEnvironmentUserAgent$1;

function requireEnvironmentUserAgent$1 () {
	if (hasRequiredEnvironmentUserAgent$1) return environmentUserAgent$1;
	hasRequiredEnvironmentUserAgent$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();

	var navigator = globalThis.navigator;
	var userAgent = navigator && navigator.userAgent;

	environmentUserAgent$1 = userAgent ? String(userAgent) : '';
	return environmentUserAgent$1;
}

var environmentV8Version$1;
var hasRequiredEnvironmentV8Version$1;

function requireEnvironmentV8Version$1 () {
	if (hasRequiredEnvironmentV8Version$1) return environmentV8Version$1;
	hasRequiredEnvironmentV8Version$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var userAgent = /*@__PURE__*/ requireEnvironmentUserAgent$1();

	var process = globalThis.process;
	var Deno = globalThis.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	environmentV8Version$1 = version;
	return environmentV8Version$1;
}

var symbolConstructorDetection$1;
var hasRequiredSymbolConstructorDetection$1;

function requireSymbolConstructorDetection$1 () {
	if (hasRequiredSymbolConstructorDetection$1) return symbolConstructorDetection$1;
	hasRequiredSymbolConstructorDetection$1 = 1;
	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION = /*@__PURE__*/ requireEnvironmentV8Version$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();

	var $String = globalThis.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	symbolConstructorDetection$1 = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});
	return symbolConstructorDetection$1;
}

var useSymbolAsUid$1;
var hasRequiredUseSymbolAsUid$1;

function requireUseSymbolAsUid$1 () {
	if (hasRequiredUseSymbolAsUid$1) return useSymbolAsUid$1;
	hasRequiredUseSymbolAsUid$1 = 1;
	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection$1();

	useSymbolAsUid$1 = NATIVE_SYMBOL &&
	  !Symbol.sham &&
	  typeof Symbol.iterator == 'symbol';
	return useSymbolAsUid$1;
}

var isSymbol$1;
var hasRequiredIsSymbol$1;

function requireIsSymbol$1 () {
	if (hasRequiredIsSymbol$1) return isSymbol$1;
	hasRequiredIsSymbol$1 = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var USE_SYMBOL_AS_UID = /*@__PURE__*/ requireUseSymbolAsUid$1();

	var $Object = Object;

	isSymbol$1 = USE_SYMBOL_AS_UID ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
	};
	return isSymbol$1;
}

var tryToString$1;
var hasRequiredTryToString$1;

function requireTryToString$1 () {
	if (hasRequiredTryToString$1) return tryToString$1;
	hasRequiredTryToString$1 = 1;
	var $String = String;

	tryToString$1 = function (argument) {
	  try {
	    return $String(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};
	return tryToString$1;
}

var aCallable$1;
var hasRequiredACallable$1;

function requireACallable$1 () {
	if (hasRequiredACallable$1) return aCallable$1;
	hasRequiredACallable$1 = 1;
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var tryToString = /*@__PURE__*/ requireTryToString$1();

	var $TypeError = TypeError;

	// `Assert: IsCallable(argument) is true`
	aCallable$1 = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw new $TypeError(tryToString(argument) + ' is not a function');
	};
	return aCallable$1;
}

var getMethod$1;
var hasRequiredGetMethod$1;

function requireGetMethod$1 () {
	if (hasRequiredGetMethod$1) return getMethod$1;
	hasRequiredGetMethod$1 = 1;
	var aCallable = /*@__PURE__*/ requireACallable$1();
	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined$1();

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	getMethod$1 = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined(func) ? undefined : aCallable(func);
	};
	return getMethod$1;
}

var ordinaryToPrimitive$1;
var hasRequiredOrdinaryToPrimitive$1;

function requireOrdinaryToPrimitive$1 () {
	if (hasRequiredOrdinaryToPrimitive$1) return ordinaryToPrimitive$1;
	hasRequiredOrdinaryToPrimitive$1 = 1;
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();

	var $TypeError = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	  throw new $TypeError("Can't convert object to primitive value");
	};
	return ordinaryToPrimitive$1;
}

var sharedStore$1 = {exports: {}};

var isPure$1;
var hasRequiredIsPure$1;

function requireIsPure$1 () {
	if (hasRequiredIsPure$1) return isPure$1;
	hasRequiredIsPure$1 = 1;
	isPure$1 = true;
	return isPure$1;
}

var defineGlobalProperty$1;
var hasRequiredDefineGlobalProperty$1;

function requireDefineGlobalProperty$1 () {
	if (hasRequiredDefineGlobalProperty$1) return defineGlobalProperty$1;
	hasRequiredDefineGlobalProperty$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;

	defineGlobalProperty$1 = function (key, value) {
	  try {
	    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    globalThis[key] = value;
	  } return value;
	};
	return defineGlobalProperty$1;
}

var hasRequiredSharedStore$1;

function requireSharedStore$1 () {
	if (hasRequiredSharedStore$1) return sharedStore$1.exports;
	hasRequiredSharedStore$1 = 1;
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var defineGlobalProperty = /*@__PURE__*/ requireDefineGlobalProperty$1();

	var SHARED = '__core-js_shared__';
	var store = sharedStore$1.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

	(store.versions || (store.versions = [])).push({
	  version: '3.40.0',
	  mode: IS_PURE ? 'pure' : 'global',
	  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	return sharedStore$1.exports;
}

var shared$1;
var hasRequiredShared$1;

function requireShared$1 () {
	if (hasRequiredShared$1) return shared$1;
	hasRequiredShared$1 = 1;
	var store = /*@__PURE__*/ requireSharedStore$1();

	shared$1 = function (key, value) {
	  return store[key] || (store[key] = value || {});
	};
	return shared$1;
}

var toObject$1;
var hasRequiredToObject$1;

function requireToObject$1 () {
	if (hasRequiredToObject$1) return toObject$1;
	hasRequiredToObject$1 = 1;
	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible$1();

	var $Object = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	toObject$1 = function (argument) {
	  return $Object(requireObjectCoercible(argument));
	};
	return toObject$1;
}

var hasOwnProperty_1$1;
var hasRequiredHasOwnProperty$1;

function requireHasOwnProperty$1 () {
	if (hasRequiredHasOwnProperty$1) return hasOwnProperty_1$1;
	hasRequiredHasOwnProperty$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var toObject = /*@__PURE__*/ requireToObject$1();

	var hasOwnProperty = uncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	hasOwnProperty_1$1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};
	return hasOwnProperty_1$1;
}

var uid$1;
var hasRequiredUid$1;

function requireUid$1 () {
	if (hasRequiredUid$1) return uid$1;
	hasRequiredUid$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	var id = 0;
	var postfix = Math.random();
	var toString = uncurryThis(1.0.toString);

	uid$1 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
	};
	return uid$1;
}

var wellKnownSymbol$1;
var hasRequiredWellKnownSymbol$1;

function requireWellKnownSymbol$1 () {
	if (hasRequiredWellKnownSymbol$1) return wellKnownSymbol$1;
	hasRequiredWellKnownSymbol$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var shared = /*@__PURE__*/ requireShared$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var uid = /*@__PURE__*/ requireUid$1();
	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection$1();
	var USE_SYMBOL_AS_UID = /*@__PURE__*/ requireUseSymbolAsUid$1();

	var Symbol = globalThis.Symbol;
	var WellKnownSymbolsStore = shared('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

	wellKnownSymbol$1 = function (name) {
	  if (!hasOwn(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
	      ? Symbol[name]
	      : createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};
	return wellKnownSymbol$1;
}

var toPrimitive$7;
var hasRequiredToPrimitive$6;

function requireToPrimitive$6 () {
	if (hasRequiredToPrimitive$6) return toPrimitive$7;
	hasRequiredToPrimitive$6 = 1;
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var isSymbol = /*@__PURE__*/ requireIsSymbol$1();
	var getMethod = /*@__PURE__*/ requireGetMethod$1();
	var ordinaryToPrimitive = /*@__PURE__*/ requireOrdinaryToPrimitive$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var $TypeError = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	toPrimitive$7 = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw new $TypeError("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};
	return toPrimitive$7;
}

var toPropertyKey$2;
var hasRequiredToPropertyKey$1;

function requireToPropertyKey$1 () {
	if (hasRequiredToPropertyKey$1) return toPropertyKey$2;
	hasRequiredToPropertyKey$1 = 1;
	var toPrimitive = /*@__PURE__*/ requireToPrimitive$6();
	var isSymbol = /*@__PURE__*/ requireIsSymbol$1();

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	toPropertyKey$2 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};
	return toPropertyKey$2;
}

var documentCreateElement$1;
var hasRequiredDocumentCreateElement$1;

function requireDocumentCreateElement$1 () {
	if (hasRequiredDocumentCreateElement$1) return documentCreateElement$1;
	hasRequiredDocumentCreateElement$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();

	var document = globalThis.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document) && isObject(document.createElement);

	documentCreateElement$1 = function (it) {
	  return EXISTS ? document.createElement(it) : {};
	};
	return documentCreateElement$1;
}

var ie8DomDefine$1;
var hasRequiredIe8DomDefine$1;

function requireIe8DomDefine$1 () {
	if (hasRequiredIe8DomDefine$1) return ie8DomDefine$1;
	hasRequiredIe8DomDefine$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var createElement = /*@__PURE__*/ requireDocumentCreateElement$1();

	// Thanks to IE8 for its funny defineProperty
	ie8DomDefine$1 = !DESCRIPTORS && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a !== 7;
	});
	return ie8DomDefine$1;
}

var hasRequiredObjectGetOwnPropertyDescriptor$1;

function requireObjectGetOwnPropertyDescriptor$1 () {
	if (hasRequiredObjectGetOwnPropertyDescriptor$1) return objectGetOwnPropertyDescriptor$1;
	hasRequiredObjectGetOwnPropertyDescriptor$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var propertyIsEnumerableModule = /*@__PURE__*/ requireObjectPropertyIsEnumerable$1();
	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var toPropertyKey = /*@__PURE__*/ requireToPropertyKey$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var IE8_DOM_DEFINE = /*@__PURE__*/ requireIe8DomDefine$1();

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor$1.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (IE8_DOM_DEFINE) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
	};
	return objectGetOwnPropertyDescriptor$1;
}

var isForced_1$1;
var hasRequiredIsForced$1;

function requireIsForced$1 () {
	if (hasRequiredIsForced$1) return isForced_1$1;
	hasRequiredIsForced$1 = 1;
	var fails = /*@__PURE__*/ requireFails$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value === POLYFILL ? true
	    : value === NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	isForced_1$1 = isForced;
	return isForced_1$1;
}

var functionBindContext;
var hasRequiredFunctionBindContext;

function requireFunctionBindContext () {
	if (hasRequiredFunctionBindContext) return functionBindContext;
	hasRequiredFunctionBindContext = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThisClause();
	var aCallable = /*@__PURE__*/ requireACallable$1();
	var NATIVE_BIND = /*@__PURE__*/ requireFunctionBindNative$1();

	var bind = uncurryThis(uncurryThis.bind);

	// optional / simple context binding
	functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};
	return functionBindContext;
}

var objectDefineProperty$1 = {};

var v8PrototypeDefineBug$1;
var hasRequiredV8PrototypeDefineBug$1;

function requireV8PrototypeDefineBug$1 () {
	if (hasRequiredV8PrototypeDefineBug$1) return v8PrototypeDefineBug$1;
	hasRequiredV8PrototypeDefineBug$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var fails = /*@__PURE__*/ requireFails$1();

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	v8PrototypeDefineBug$1 = DESCRIPTORS && fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});
	return v8PrototypeDefineBug$1;
}

var anObject$1;
var hasRequiredAnObject$1;

function requireAnObject$1 () {
	if (hasRequiredAnObject$1) return anObject$1;
	hasRequiredAnObject$1 = 1;
	var isObject = /*@__PURE__*/ requireIsObject$1();

	var $String = String;
	var $TypeError = TypeError;

	// `Assert: Type(argument) is Object`
	anObject$1 = function (argument) {
	  if (isObject(argument)) return argument;
	  throw new $TypeError($String(argument) + ' is not an object');
	};
	return anObject$1;
}

var hasRequiredObjectDefineProperty$1;

function requireObjectDefineProperty$1 () {
	if (hasRequiredObjectDefineProperty$1) return objectDefineProperty$1;
	hasRequiredObjectDefineProperty$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var IE8_DOM_DEFINE = /*@__PURE__*/ requireIe8DomDefine$1();
	var V8_PROTOTYPE_DEFINE_BUG = /*@__PURE__*/ requireV8PrototypeDefineBug$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var toPropertyKey = /*@__PURE__*/ requireToPropertyKey$1();

	var $TypeError = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty$1.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	return objectDefineProperty$1;
}

var createNonEnumerableProperty$1;
var hasRequiredCreateNonEnumerableProperty$1;

function requireCreateNonEnumerableProperty$1 () {
	if (hasRequiredCreateNonEnumerableProperty$1) return createNonEnumerableProperty$1;
	hasRequiredCreateNonEnumerableProperty$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty$1();
	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor$1();

	createNonEnumerableProperty$1 = DESCRIPTORS ? function (object, key, value) {
	  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};
	return createNonEnumerableProperty$1;
}

var _export$1;
var hasRequired_export$1;

function require_export$1 () {
	if (hasRequired_export$1) return _export$1;
	hasRequired_export$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var apply = /*@__PURE__*/ requireFunctionApply$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThisClause();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var getOwnPropertyDescriptor =  requireObjectGetOwnPropertyDescriptor$1().f;
	var isForced = /*@__PURE__*/ requireIsForced$1();
	var path = /*@__PURE__*/ requirePath();
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();

	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof Wrapper) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return apply(NativeConstructor, this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	_export$1 = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? globalThis : STATIC ? globalThis[TARGET] : globalThis[TARGET] && globalThis[TARGET].prototype;

	  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;

	    // bind methods to global for calling from export context
	    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis);
	    // wrap global constructors for prevent changes in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    createNonEnumerableProperty(target, key, resultProperty);

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
	      // export real prototype methods
	      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};
	return _export$1;
}

var hasRequiredEs_object_defineProperty;

function requireEs_object_defineProperty () {
	if (hasRequiredEs_object_defineProperty) return es_object_defineProperty;
	hasRequiredEs_object_defineProperty = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var defineProperty =  requireObjectDefineProperty$1().f;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	$({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty, sham: !DESCRIPTORS }, {
	  defineProperty: defineProperty
	});
	return es_object_defineProperty;
}

var hasRequiredDefineProperty$5;

function requireDefineProperty$5 () {
	if (hasRequiredDefineProperty$5) return defineProperty$5.exports;
	hasRequiredDefineProperty$5 = 1;
	requireEs_object_defineProperty();
	var path = /*@__PURE__*/ requirePath();

	var Object = path.Object;

	var defineProperty = defineProperty$5.exports = function defineProperty(it, key, desc) {
	  return Object.defineProperty(it, key, desc);
	};

	if (Object.defineProperty.sham) defineProperty.sham = true;
	return defineProperty$5.exports;
}

var defineProperty$4;
var hasRequiredDefineProperty$4;

function requireDefineProperty$4 () {
	if (hasRequiredDefineProperty$4) return defineProperty$4;
	hasRequiredDefineProperty$4 = 1;
	var parent = /*@__PURE__*/ requireDefineProperty$5();

	defineProperty$4 = parent;
	return defineProperty$4;
}

var defineProperty$3;
var hasRequiredDefineProperty$3;

function requireDefineProperty$3 () {
	if (hasRequiredDefineProperty$3) return defineProperty$3;
	hasRequiredDefineProperty$3 = 1;
	var parent = /*@__PURE__*/ requireDefineProperty$4();

	defineProperty$3 = parent;
	return defineProperty$3;
}

var defineProperty$2;
var hasRequiredDefineProperty$2;

function requireDefineProperty$2 () {
	if (hasRequiredDefineProperty$2) return defineProperty$2;
	hasRequiredDefineProperty$2 = 1;
	var parent = /*@__PURE__*/ requireDefineProperty$3();

	defineProperty$2 = parent;
	return defineProperty$2;
}

var defineProperty$1;
var hasRequiredDefineProperty$1;

function requireDefineProperty$1 () {
	if (hasRequiredDefineProperty$1) return defineProperty$1;
	hasRequiredDefineProperty$1 = 1;
	defineProperty$1 = /*@__PURE__*/ requireDefineProperty$2();
	return defineProperty$1;
}

var definePropertyExports$1 = /*@__PURE__*/ requireDefineProperty$1();
var _Object$defineProperty$1 = /*@__PURE__*/getDefaultExportFromCjs(definePropertyExports$1);

var es_array_concat = {};

var isArray$3;
var hasRequiredIsArray$3;

function requireIsArray$3 () {
	if (hasRequiredIsArray$3) return isArray$3;
	hasRequiredIsArray$3 = 1;
	var classof = /*@__PURE__*/ requireClassofRaw$1();

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	isArray$3 = Array.isArray || function isArray(argument) {
	  return classof(argument) === 'Array';
	};
	return isArray$3;
}

var mathTrunc$1;
var hasRequiredMathTrunc$1;

function requireMathTrunc$1 () {
	if (hasRequiredMathTrunc$1) return mathTrunc$1;
	hasRequiredMathTrunc$1 = 1;
	var ceil = Math.ceil;
	var floor = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	mathTrunc$1 = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor : ceil)(n);
	};
	return mathTrunc$1;
}

var toIntegerOrInfinity$1;
var hasRequiredToIntegerOrInfinity$1;

function requireToIntegerOrInfinity$1 () {
	if (hasRequiredToIntegerOrInfinity$1) return toIntegerOrInfinity$1;
	hasRequiredToIntegerOrInfinity$1 = 1;
	var trunc = /*@__PURE__*/ requireMathTrunc$1();

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	toIntegerOrInfinity$1 = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : trunc(number);
	};
	return toIntegerOrInfinity$1;
}

var toLength$1;
var hasRequiredToLength$1;

function requireToLength$1 () {
	if (hasRequiredToLength$1) return toLength$1;
	hasRequiredToLength$1 = 1;
	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity$1();

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	toLength$1 = function (argument) {
	  var len = toIntegerOrInfinity(argument);
	  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};
	return toLength$1;
}

var lengthOfArrayLike$1;
var hasRequiredLengthOfArrayLike$1;

function requireLengthOfArrayLike$1 () {
	if (hasRequiredLengthOfArrayLike$1) return lengthOfArrayLike$1;
	hasRequiredLengthOfArrayLike$1 = 1;
	var toLength = /*@__PURE__*/ requireToLength$1();

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	lengthOfArrayLike$1 = function (obj) {
	  return toLength(obj.length);
	};
	return lengthOfArrayLike$1;
}

var doesNotExceedSafeInteger;
var hasRequiredDoesNotExceedSafeInteger;

function requireDoesNotExceedSafeInteger () {
	if (hasRequiredDoesNotExceedSafeInteger) return doesNotExceedSafeInteger;
	hasRequiredDoesNotExceedSafeInteger = 1;
	var $TypeError = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	doesNotExceedSafeInteger = function (it) {
	  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
	  return it;
	};
	return doesNotExceedSafeInteger;
}

var createProperty;
var hasRequiredCreateProperty;

function requireCreateProperty () {
	if (hasRequiredCreateProperty) return createProperty;
	hasRequiredCreateProperty = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty$1();
	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor$1();

	createProperty = function (object, key, value) {
	  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
	  else object[key] = value;
	};
	return createProperty;
}

var toStringTagSupport$1;
var hasRequiredToStringTagSupport$1;

function requireToStringTagSupport$1 () {
	if (hasRequiredToStringTagSupport$1) return toStringTagSupport$1;
	hasRequiredToStringTagSupport$1 = 1;
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	toStringTagSupport$1 = String(test) === '[object z]';
	return toStringTagSupport$1;
}

var classof$1;
var hasRequiredClassof$1;

function requireClassof$1 () {
	if (hasRequiredClassof$1) return classof$1;
	hasRequiredClassof$1 = 1;
	var TO_STRING_TAG_SUPPORT = /*@__PURE__*/ requireToStringTagSupport$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var classofRaw = /*@__PURE__*/ requireClassofRaw$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var $Object = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};
	return classof$1;
}

var inspectSource$1;
var hasRequiredInspectSource$1;

function requireInspectSource$1 () {
	if (hasRequiredInspectSource$1) return inspectSource$1;
	hasRequiredInspectSource$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var store = /*@__PURE__*/ requireSharedStore$1();

	var functionToString = uncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(store.inspectSource)) {
	  store.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	inspectSource$1 = store.inspectSource;
	return inspectSource$1;
}

var isConstructor;
var hasRequiredIsConstructor;

function requireIsConstructor () {
	if (hasRequiredIsConstructor) return isConstructor;
	hasRequiredIsConstructor = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var classof = /*@__PURE__*/ requireClassof$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var inspectSource = /*@__PURE__*/ requireInspectSource$1();

	var noop = function () { /* empty */ };
	var construct = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec = uncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  try {
	    construct(noop, [], argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	isConstructor = !construct || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;
	return isConstructor;
}

var arraySpeciesConstructor;
var hasRequiredArraySpeciesConstructor;

function requireArraySpeciesConstructor () {
	if (hasRequiredArraySpeciesConstructor) return arraySpeciesConstructor;
	hasRequiredArraySpeciesConstructor = 1;
	var isArray = /*@__PURE__*/ requireIsArray$3();
	var isConstructor = /*@__PURE__*/ requireIsConstructor();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var SPECIES = wellKnownSymbol('species');
	var $Array = Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? $Array : C;
	};
	return arraySpeciesConstructor;
}

var arraySpeciesCreate;
var hasRequiredArraySpeciesCreate;

function requireArraySpeciesCreate () {
	if (hasRequiredArraySpeciesCreate) return arraySpeciesCreate;
	hasRequiredArraySpeciesCreate = 1;
	var arraySpeciesConstructor = /*@__PURE__*/ requireArraySpeciesConstructor();

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};
	return arraySpeciesCreate;
}

var arrayMethodHasSpeciesSupport;
var hasRequiredArrayMethodHasSpeciesSupport;

function requireArrayMethodHasSpeciesSupport () {
	if (hasRequiredArrayMethodHasSpeciesSupport) return arrayMethodHasSpeciesSupport;
	hasRequiredArrayMethodHasSpeciesSupport = 1;
	var fails = /*@__PURE__*/ requireFails$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var V8_VERSION = /*@__PURE__*/ requireEnvironmentV8Version$1();

	var SPECIES = wellKnownSymbol('species');

	arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};
	return arrayMethodHasSpeciesSupport;
}

var hasRequiredEs_array_concat;

function requireEs_array_concat () {
	if (hasRequiredEs_array_concat) return es_array_concat;
	hasRequiredEs_array_concat = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var isArray = /*@__PURE__*/ requireIsArray$3();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var toObject = /*@__PURE__*/ requireToObject$1();
	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike$1();
	var doesNotExceedSafeInteger = /*@__PURE__*/ requireDoesNotExceedSafeInteger();
	var createProperty = /*@__PURE__*/ requireCreateProperty();
	var arraySpeciesCreate = /*@__PURE__*/ requireArraySpeciesCreate();
	var arrayMethodHasSpeciesSupport = /*@__PURE__*/ requireArrayMethodHasSpeciesSupport();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var V8_VERSION = /*@__PURE__*/ requireEnvironmentV8Version$1();

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        doesNotExceedSafeInteger(n + len);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        doesNotExceedSafeInteger(n + 1);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});
	return es_array_concat;
}

var es_symbol = {};

var es_symbol_constructor = {};

var toString$1;
var hasRequiredToString$1;

function requireToString$1 () {
	if (hasRequiredToString$1) return toString$1;
	hasRequiredToString$1 = 1;
	var classof = /*@__PURE__*/ requireClassof$1();

	var $String = String;

	toString$1 = function (argument) {
	  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
	  return $String(argument);
	};
	return toString$1;
}

var objectDefineProperties$1 = {};

var toAbsoluteIndex$1;
var hasRequiredToAbsoluteIndex$1;

function requireToAbsoluteIndex$1 () {
	if (hasRequiredToAbsoluteIndex$1) return toAbsoluteIndex$1;
	hasRequiredToAbsoluteIndex$1 = 1;
	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity$1();

	var max = Math.max;
	var min = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
	};
	return toAbsoluteIndex$1;
}

var arrayIncludes$1;
var hasRequiredArrayIncludes$1;

function requireArrayIncludes$1 () {
	if (hasRequiredArrayIncludes$1) return arrayIncludes$1;
	hasRequiredArrayIncludes$1 = 1;
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var toAbsoluteIndex = /*@__PURE__*/ requireToAbsoluteIndex$1();
	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike$1();

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    if (length === 0) return !IS_INCLUDES && -1;
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el !== el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value !== value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	arrayIncludes$1 = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};
	return arrayIncludes$1;
}

var hiddenKeys$1;
var hasRequiredHiddenKeys$1;

function requireHiddenKeys$1 () {
	if (hasRequiredHiddenKeys$1) return hiddenKeys$1;
	hasRequiredHiddenKeys$1 = 1;
	hiddenKeys$1 = {};
	return hiddenKeys$1;
}

var objectKeysInternal$1;
var hasRequiredObjectKeysInternal$1;

function requireObjectKeysInternal$1 () {
	if (hasRequiredObjectKeysInternal$1) return objectKeysInternal$1;
	hasRequiredObjectKeysInternal$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var indexOf =  requireArrayIncludes$1().indexOf;
	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys$1();

	var push = uncurryThis([].push);

	objectKeysInternal$1 = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn(O, key = names[i++])) {
	    ~indexOf(result, key) || push(result, key);
	  }
	  return result;
	};
	return objectKeysInternal$1;
}

var enumBugKeys$1;
var hasRequiredEnumBugKeys$1;

function requireEnumBugKeys$1 () {
	if (hasRequiredEnumBugKeys$1) return enumBugKeys$1;
	hasRequiredEnumBugKeys$1 = 1;
	// IE8- don't enum bug keys
	enumBugKeys$1 = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];
	return enumBugKeys$1;
}

var objectKeys$1;
var hasRequiredObjectKeys$1;

function requireObjectKeys$1 () {
	if (hasRequiredObjectKeys$1) return objectKeys$1;
	hasRequiredObjectKeys$1 = 1;
	var internalObjectKeys = /*@__PURE__*/ requireObjectKeysInternal$1();
	var enumBugKeys = /*@__PURE__*/ requireEnumBugKeys$1();

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys);
	};
	return objectKeys$1;
}

var hasRequiredObjectDefineProperties$1;

function requireObjectDefineProperties$1 () {
	if (hasRequiredObjectDefineProperties$1) return objectDefineProperties$1;
	hasRequiredObjectDefineProperties$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var V8_PROTOTYPE_DEFINE_BUG = /*@__PURE__*/ requireV8PrototypeDefineBug$1();
	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var objectKeys = /*@__PURE__*/ requireObjectKeys$1();

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	objectDefineProperties$1.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
	  return O;
	};
	return objectDefineProperties$1;
}

var html$1;
var hasRequiredHtml$1;

function requireHtml$1 () {
	if (hasRequiredHtml$1) return html$1;
	hasRequiredHtml$1 = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();

	html$1 = getBuiltIn('document', 'documentElement');
	return html$1;
}

var sharedKey$1;
var hasRequiredSharedKey$1;

function requireSharedKey$1 () {
	if (hasRequiredSharedKey$1) return sharedKey$1;
	hasRequiredSharedKey$1 = 1;
	var shared = /*@__PURE__*/ requireShared$1();
	var uid = /*@__PURE__*/ requireUid$1();

	var keys = shared('keys');

	sharedKey$1 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};
	return sharedKey$1;
}

var objectCreate$1;
var hasRequiredObjectCreate$1;

function requireObjectCreate$1 () {
	if (hasRequiredObjectCreate$1) return objectCreate$1;
	hasRequiredObjectCreate$1 = 1;
	/* global ActiveXObject -- old IE, WSH */
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var definePropertiesModule = /*@__PURE__*/ requireObjectDefineProperties$1();
	var enumBugKeys = /*@__PURE__*/ requireEnumBugKeys$1();
	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys$1();
	var html = /*@__PURE__*/ requireHtml$1();
	var documentCreateElement = /*@__PURE__*/ requireDocumentCreateElement$1();
	var sharedKey = /*@__PURE__*/ requireSharedKey$1();

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
	  activeXDocument = null;
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	objectCreate$1 = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	};
	return objectCreate$1;
}

var objectGetOwnPropertyNames$1 = {};

var hasRequiredObjectGetOwnPropertyNames$1;

function requireObjectGetOwnPropertyNames$1 () {
	if (hasRequiredObjectGetOwnPropertyNames$1) return objectGetOwnPropertyNames$1;
	hasRequiredObjectGetOwnPropertyNames$1 = 1;
	var internalObjectKeys = /*@__PURE__*/ requireObjectKeysInternal$1();
	var enumBugKeys = /*@__PURE__*/ requireEnumBugKeys$1();

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames$1.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys(O, hiddenKeys);
	};
	return objectGetOwnPropertyNames$1;
}

var objectGetOwnPropertyNamesExternal = {};

var arraySlice;
var hasRequiredArraySlice;

function requireArraySlice () {
	if (hasRequiredArraySlice) return arraySlice;
	hasRequiredArraySlice = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	arraySlice = uncurryThis([].slice);
	return arraySlice;
}

var hasRequiredObjectGetOwnPropertyNamesExternal;

function requireObjectGetOwnPropertyNamesExternal () {
	if (hasRequiredObjectGetOwnPropertyNamesExternal) return objectGetOwnPropertyNamesExternal;
	hasRequiredObjectGetOwnPropertyNamesExternal = 1;
	/* eslint-disable es/no-object-getownpropertynames -- safe */
	var classof = /*@__PURE__*/ requireClassofRaw$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var $getOwnPropertyNames =  requireObjectGetOwnPropertyNames$1().f;
	var arraySlice = /*@__PURE__*/ requireArraySlice();

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames(it);
	  } catch (error) {
	    return arraySlice(windowNames);
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
	  return windowNames && classof(it) === 'Window'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames(toIndexedObject(it));
	};
	return objectGetOwnPropertyNamesExternal;
}

var objectGetOwnPropertySymbols$1 = {};

var hasRequiredObjectGetOwnPropertySymbols$1;

function requireObjectGetOwnPropertySymbols$1 () {
	if (hasRequiredObjectGetOwnPropertySymbols$1) return objectGetOwnPropertySymbols$1;
	hasRequiredObjectGetOwnPropertySymbols$1 = 1;
	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols$1.f = Object.getOwnPropertySymbols;
	return objectGetOwnPropertySymbols$1;
}

var defineBuiltIn$1;
var hasRequiredDefineBuiltIn$1;

function requireDefineBuiltIn$1 () {
	if (hasRequiredDefineBuiltIn$1) return defineBuiltIn$1;
	hasRequiredDefineBuiltIn$1 = 1;
	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty$1();

	defineBuiltIn$1 = function (target, key, value, options) {
	  if (options && options.enumerable) target[key] = value;
	  else createNonEnumerableProperty(target, key, value);
	  return target;
	};
	return defineBuiltIn$1;
}

var defineBuiltInAccessor;
var hasRequiredDefineBuiltInAccessor;

function requireDefineBuiltInAccessor () {
	if (hasRequiredDefineBuiltInAccessor) return defineBuiltInAccessor;
	hasRequiredDefineBuiltInAccessor = 1;
	var defineProperty = /*@__PURE__*/ requireObjectDefineProperty$1();

	defineBuiltInAccessor = function (target, name, descriptor) {
	  return defineProperty.f(target, name, descriptor);
	};
	return defineBuiltInAccessor;
}

var wellKnownSymbolWrapped = {};

var hasRequiredWellKnownSymbolWrapped;

function requireWellKnownSymbolWrapped () {
	if (hasRequiredWellKnownSymbolWrapped) return wellKnownSymbolWrapped;
	hasRequiredWellKnownSymbolWrapped = 1;
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	wellKnownSymbolWrapped.f = wellKnownSymbol;
	return wellKnownSymbolWrapped;
}

var wellKnownSymbolDefine;
var hasRequiredWellKnownSymbolDefine;

function requireWellKnownSymbolDefine () {
	if (hasRequiredWellKnownSymbolDefine) return wellKnownSymbolDefine;
	hasRequiredWellKnownSymbolDefine = 1;
	var path = /*@__PURE__*/ requirePath();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var wrappedWellKnownSymbolModule = /*@__PURE__*/ requireWellKnownSymbolWrapped();
	var defineProperty =  requireObjectDefineProperty$1().f;

	wellKnownSymbolDefine = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wrappedWellKnownSymbolModule.f(NAME)
	  });
	};
	return wellKnownSymbolDefine;
}

var symbolDefineToPrimitive;
var hasRequiredSymbolDefineToPrimitive;

function requireSymbolDefineToPrimitive () {
	if (hasRequiredSymbolDefineToPrimitive) return symbolDefineToPrimitive;
	hasRequiredSymbolDefineToPrimitive = 1;
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();

	symbolDefineToPrimitive = function () {
	  var Symbol = getBuiltIn('Symbol');
	  var SymbolPrototype = Symbol && Symbol.prototype;
	  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
	  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
	    // `Symbol.prototype[@@toPrimitive]` method
	    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	    // eslint-disable-next-line no-unused-vars -- required for .length
	    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
	      return call(valueOf, this);
	    }, { arity: 1 });
	  }
	};
	return symbolDefineToPrimitive;
}

var objectToString;
var hasRequiredObjectToString;

function requireObjectToString () {
	if (hasRequiredObjectToString) return objectToString;
	hasRequiredObjectToString = 1;
	var TO_STRING_TAG_SUPPORT = /*@__PURE__*/ requireToStringTagSupport$1();
	var classof = /*@__PURE__*/ requireClassof$1();

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	objectToString = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};
	return objectToString;
}

var setToStringTag;
var hasRequiredSetToStringTag;

function requireSetToStringTag () {
	if (hasRequiredSetToStringTag) return setToStringTag;
	hasRequiredSetToStringTag = 1;
	var TO_STRING_TAG_SUPPORT = /*@__PURE__*/ requireToStringTagSupport$1();
	var defineProperty =  requireObjectDefineProperty$1().f;
	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var toString = /*@__PURE__*/ requireObjectToString();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
	  var target = STATIC ? it : it && it.prototype;
	  if (target) {
	    if (!hasOwn(target, TO_STRING_TAG)) {
	      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
	    }
	    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
	      createNonEnumerableProperty(target, 'toString', toString);
	    }
	  }
	};
	return setToStringTag;
}

var weakMapBasicDetection$1;
var hasRequiredWeakMapBasicDetection$1;

function requireWeakMapBasicDetection$1 () {
	if (hasRequiredWeakMapBasicDetection$1) return weakMapBasicDetection$1;
	hasRequiredWeakMapBasicDetection$1 = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();

	var WeakMap = globalThis.WeakMap;

	weakMapBasicDetection$1 = isCallable(WeakMap) && /native code/.test(String(WeakMap));
	return weakMapBasicDetection$1;
}

var internalState$1;
var hasRequiredInternalState$1;

function requireInternalState$1 () {
	if (hasRequiredInternalState$1) return internalState$1;
	hasRequiredInternalState$1 = 1;
	var NATIVE_WEAK_MAP = /*@__PURE__*/ requireWeakMapBasicDetection$1();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var shared = /*@__PURE__*/ requireSharedStore$1();
	var sharedKey = /*@__PURE__*/ requireSharedKey$1();
	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys$1();

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError = globalThis.TypeError;
	var WeakMap = globalThis.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set = function (it, metadata) {
	    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store.get(it) || {};
	  };
	  has = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwn(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn(it, STATE);
	  };
	}

	internalState$1 = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};
	return internalState$1;
}

var arrayIteration;
var hasRequiredArrayIteration;

function requireArrayIteration () {
	if (hasRequiredArrayIteration) return arrayIteration;
	hasRequiredArrayIteration = 1;
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var IndexedObject = /*@__PURE__*/ requireIndexedObject$1();
	var toObject = /*@__PURE__*/ requireToObject$1();
	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike$1();
	var arraySpeciesCreate = /*@__PURE__*/ requireArraySpeciesCreate();

	var push = uncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod = function (TYPE) {
	  var IS_MAP = TYPE === 1;
	  var IS_FILTER = TYPE === 2;
	  var IS_SOME = TYPE === 3;
	  var IS_EVERY = TYPE === 4;
	  var IS_FIND_INDEX = TYPE === 6;
	  var IS_FILTER_REJECT = TYPE === 7;
	  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = IndexedObject(O);
	    var length = lengthOfArrayLike(self);
	    var boundFunction = bind(callbackfn, that);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod(7)
	};
	return arrayIteration;
}

var hasRequiredEs_symbol_constructor;

function requireEs_symbol_constructor () {
	if (hasRequiredEs_symbol_constructor) return es_symbol_constructor;
	hasRequiredEs_symbol_constructor = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var toPropertyKey = /*@__PURE__*/ requireToPropertyKey$1();
	var $toString = /*@__PURE__*/ requireToString$1();
	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor$1();
	var nativeObjectCreate = /*@__PURE__*/ requireObjectCreate$1();
	var objectKeys = /*@__PURE__*/ requireObjectKeys$1();
	var getOwnPropertyNamesModule = /*@__PURE__*/ requireObjectGetOwnPropertyNames$1();
	var getOwnPropertyNamesExternal = /*@__PURE__*/ requireObjectGetOwnPropertyNamesExternal();
	var getOwnPropertySymbolsModule = /*@__PURE__*/ requireObjectGetOwnPropertySymbols$1();
	var getOwnPropertyDescriptorModule = /*@__PURE__*/ requireObjectGetOwnPropertyDescriptor$1();
	var definePropertyModule = /*@__PURE__*/ requireObjectDefineProperty$1();
	var definePropertiesModule = /*@__PURE__*/ requireObjectDefineProperties$1();
	var propertyIsEnumerableModule = /*@__PURE__*/ requireObjectPropertyIsEnumerable$1();
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();
	var defineBuiltInAccessor = /*@__PURE__*/ requireDefineBuiltInAccessor();
	var shared = /*@__PURE__*/ requireShared$1();
	var sharedKey = /*@__PURE__*/ requireSharedKey$1();
	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys$1();
	var uid = /*@__PURE__*/ requireUid$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var wrappedWellKnownSymbolModule = /*@__PURE__*/ requireWellKnownSymbolWrapped();
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();
	var defineSymbolToPrimitive = /*@__PURE__*/ requireSymbolDefineToPrimitive();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();
	var $forEach =  requireArrayIteration().forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE = 'prototype';

	var setInternalState = InternalStateModule.set;
	var getInternalState = InternalStateModule.getterFor(SYMBOL);

	var ObjectPrototype = Object[PROTOTYPE];
	var $Symbol = globalThis.Symbol;
	var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
	var RangeError = globalThis.RangeError;
	var TypeError = globalThis.TypeError;
	var QObject = globalThis.QObject;
	var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	var nativeDefineProperty = definePropertyModule.f;
	var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
	var push = uncurryThis([].push);

	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var WellKnownSymbolsStore = shared('wks');

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var fallbackDefineProperty = function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	};

	var setSymbolDescriptor = DESCRIPTORS && fails(function () {
	  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
	    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
	  })).a !== 7;
	}) ? fallbackDefineProperty : nativeDefineProperty;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!DESCRIPTORS) symbol.description = description;
	  return symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPropertyKey(P);
	  anObject(Attributes);
	  if (hasOwn(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, nativeObjectCreate(null)));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPropertyKey(V);
	  var enumerable = call(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPropertyKey(P);
	  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
	  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function (O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
	      push(result, AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!NATIVE_SYMBOL) {
	  $Symbol = function Symbol() {
	    if (isPrototypeOf(SymbolPrototype, this)) throw new TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      var $this = this === undefined ? globalThis : this;
	      if ($this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
	      if (hasOwn($this, HIDDEN) && hasOwn($this[HIDDEN], tag)) $this[HIDDEN][tag] = false;
	      var descriptor = createPropertyDescriptor(1, value);
	      try {
	        setSymbolDescriptor($this, tag, descriptor);
	      } catch (error) {
	        if (!(error instanceof RangeError)) throw error;
	        fallbackDefineProperty($this, tag, descriptor);
	      }
	    };
	    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  SymbolPrototype = $Symbol[PROTOTYPE];

	  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  propertyIsEnumerableModule.f = $propertyIsEnumerable;
	  definePropertyModule.f = $defineProperty;
	  definePropertiesModule.f = $defineProperties;
	  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
	  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

	  wrappedWellKnownSymbolModule.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (DESCRIPTORS) {
	    // https://github.com/tc39/proposal-Symbol-description
	    defineBuiltInAccessor(SymbolPrototype, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    if (!IS_PURE) {
	      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol(name);
	});

	$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	defineSymbolToPrimitive();

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;
	return es_symbol_constructor;
}

var es_symbol_for = {};

var symbolRegistryDetection;
var hasRequiredSymbolRegistryDetection;

function requireSymbolRegistryDetection () {
	if (hasRequiredSymbolRegistryDetection) return symbolRegistryDetection;
	hasRequiredSymbolRegistryDetection = 1;
	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection$1();

	/* eslint-disable es/no-symbol -- safe */
	symbolRegistryDetection = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;
	return symbolRegistryDetection;
}

var hasRequiredEs_symbol_for;

function requireEs_symbol_for () {
	if (hasRequiredEs_symbol_for) return es_symbol_for;
	hasRequiredEs_symbol_for = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var toString = /*@__PURE__*/ requireToString$1();
	var shared = /*@__PURE__*/ requireShared$1();
	var NATIVE_SYMBOL_REGISTRY = /*@__PURE__*/ requireSymbolRegistryDetection();

	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');

	// `Symbol.for` method
	// https://tc39.es/ecma262/#sec-symbol.for
	$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
	  'for': function (key) {
	    var string = toString(key);
	    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = getBuiltIn('Symbol')(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  }
	});
	return es_symbol_for;
}

var es_symbol_keyFor = {};

var hasRequiredEs_symbol_keyFor;

function requireEs_symbol_keyFor () {
	if (hasRequiredEs_symbol_keyFor) return es_symbol_keyFor;
	hasRequiredEs_symbol_keyFor = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var isSymbol = /*@__PURE__*/ requireIsSymbol$1();
	var tryToString = /*@__PURE__*/ requireTryToString$1();
	var shared = /*@__PURE__*/ requireShared$1();
	var NATIVE_SYMBOL_REGISTRY = /*@__PURE__*/ requireSymbolRegistryDetection();

	var SymbolToStringRegistry = shared('symbol-to-string-registry');

	// `Symbol.keyFor` method
	// https://tc39.es/ecma262/#sec-symbol.keyfor
	$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw new TypeError(tryToString(sym) + ' is not a symbol');
	    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  }
	});
	return es_symbol_keyFor;
}

var es_json_stringify = {};

var getJsonReplacerFunction;
var hasRequiredGetJsonReplacerFunction;

function requireGetJsonReplacerFunction () {
	if (hasRequiredGetJsonReplacerFunction) return getJsonReplacerFunction;
	hasRequiredGetJsonReplacerFunction = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var isArray = /*@__PURE__*/ requireIsArray$3();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var classof = /*@__PURE__*/ requireClassofRaw$1();
	var toString = /*@__PURE__*/ requireToString$1();

	var push = uncurryThis([].push);

	getJsonReplacerFunction = function (replacer) {
	  if (isCallable(replacer)) return replacer;
	  if (!isArray(replacer)) return;
	  var rawLength = replacer.length;
	  var keys = [];
	  for (var i = 0; i < rawLength; i++) {
	    var element = replacer[i];
	    if (typeof element == 'string') push(keys, element);
	    else if (typeof element == 'number' || classof(element) === 'Number' || classof(element) === 'String') push(keys, toString(element));
	  }
	  var keysLength = keys.length;
	  var root = true;
	  return function (key, value) {
	    if (root) {
	      root = false;
	      return value;
	    }
	    if (isArray(this)) return value;
	    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
	  };
	};
	return getJsonReplacerFunction;
}

var hasRequiredEs_json_stringify;

function requireEs_json_stringify () {
	if (hasRequiredEs_json_stringify) return es_json_stringify;
	hasRequiredEs_json_stringify = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var apply = /*@__PURE__*/ requireFunctionApply$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var isSymbol = /*@__PURE__*/ requireIsSymbol$1();
	var arraySlice = /*@__PURE__*/ requireArraySlice();
	var getReplacerFunction = /*@__PURE__*/ requireGetJsonReplacerFunction();
	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection$1();

	var $String = String;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var exec = uncurryThis(/./.exec);
	var charAt = uncurryThis(''.charAt);
	var charCodeAt = uncurryThis(''.charCodeAt);
	var replace = uncurryThis(''.replace);
	var numberToString = uncurryThis(1.0.toString);

	var tester = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
	  var symbol = getBuiltIn('Symbol')('stringify detection');
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) !== '[null]'
	    // WebKit converts symbol values to JSON as null
	    || $stringify({ a: symbol }) !== '{}'
	    // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) !== '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	var stringifyWithSymbolsFix = function (it, replacer) {
	  var args = arraySlice(arguments);
	  var $replacer = getReplacerFunction(replacer);
	  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
	  args[1] = function (key, value) {
	    // some old implementations (like WebKit) could pass numbers as keys
	    if (isCallable($replacer)) value = call($replacer, this, $String(key), value);
	    if (!isSymbol(value)) return value;
	  };
	  return apply($stringify, null, args);
	};

	var fixIllFormed = function (match, offset, string) {
	  var prev = charAt(string, offset - 1);
	  var next = charAt(string, offset + 1);
	  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
	    return '\\u' + numberToString(charCodeAt(match, 0), 16);
	  } return match;
	};

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice(arguments);
	      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
	      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
	    }
	  });
	}
	return es_json_stringify;
}

var es_object_getOwnPropertySymbols = {};

var hasRequiredEs_object_getOwnPropertySymbols;

function requireEs_object_getOwnPropertySymbols () {
	if (hasRequiredEs_object_getOwnPropertySymbols) return es_object_getOwnPropertySymbols;
	hasRequiredEs_object_getOwnPropertySymbols = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var NATIVE_SYMBOL = /*@__PURE__*/ requireSymbolConstructorDetection$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var getOwnPropertySymbolsModule = /*@__PURE__*/ requireObjectGetOwnPropertySymbols$1();
	var toObject = /*@__PURE__*/ requireToObject$1();

	// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

	// `Object.getOwnPropertySymbols` method
	// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	$({ target: 'Object', stat: true, forced: FORCED }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
	  }
	});
	return es_object_getOwnPropertySymbols;
}

var hasRequiredEs_symbol;

function requireEs_symbol () {
	if (hasRequiredEs_symbol) return es_symbol;
	hasRequiredEs_symbol = 1;
	// TODO: Remove this module from `core-js@4` since it's split to modules listed below
	requireEs_symbol_constructor();
	requireEs_symbol_for();
	requireEs_symbol_keyFor();
	requireEs_json_stringify();
	requireEs_object_getOwnPropertySymbols();
	return es_symbol;
}

var es_symbol_asyncIterator = {};

var hasRequiredEs_symbol_asyncIterator;

function requireEs_symbol_asyncIterator () {
	if (hasRequiredEs_symbol_asyncIterator) return es_symbol_asyncIterator;
	hasRequiredEs_symbol_asyncIterator = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol('asyncIterator');
	return es_symbol_asyncIterator;
}

var es_symbol_hasInstance = {};

var hasRequiredEs_symbol_hasInstance;

function requireEs_symbol_hasInstance () {
	if (hasRequiredEs_symbol_hasInstance) return es_symbol_hasInstance;
	hasRequiredEs_symbol_hasInstance = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol('hasInstance');
	return es_symbol_hasInstance;
}

var es_symbol_isConcatSpreadable = {};

var hasRequiredEs_symbol_isConcatSpreadable;

function requireEs_symbol_isConcatSpreadable () {
	if (hasRequiredEs_symbol_isConcatSpreadable) return es_symbol_isConcatSpreadable;
	hasRequiredEs_symbol_isConcatSpreadable = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol('isConcatSpreadable');
	return es_symbol_isConcatSpreadable;
}

var es_symbol_iterator = {};

var hasRequiredEs_symbol_iterator;

function requireEs_symbol_iterator () {
	if (hasRequiredEs_symbol_iterator) return es_symbol_iterator;
	hasRequiredEs_symbol_iterator = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');
	return es_symbol_iterator;
}

var es_symbol_match = {};

var hasRequiredEs_symbol_match;

function requireEs_symbol_match () {
	if (hasRequiredEs_symbol_match) return es_symbol_match;
	hasRequiredEs_symbol_match = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.match` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.match
	defineWellKnownSymbol('match');
	return es_symbol_match;
}

var es_symbol_matchAll = {};

var hasRequiredEs_symbol_matchAll;

function requireEs_symbol_matchAll () {
	if (hasRequiredEs_symbol_matchAll) return es_symbol_matchAll;
	hasRequiredEs_symbol_matchAll = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.matchAll` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.matchall
	defineWellKnownSymbol('matchAll');
	return es_symbol_matchAll;
}

var es_symbol_replace = {};

var hasRequiredEs_symbol_replace;

function requireEs_symbol_replace () {
	if (hasRequiredEs_symbol_replace) return es_symbol_replace;
	hasRequiredEs_symbol_replace = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.replace` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.replace
	defineWellKnownSymbol('replace');
	return es_symbol_replace;
}

var es_symbol_search = {};

var hasRequiredEs_symbol_search;

function requireEs_symbol_search () {
	if (hasRequiredEs_symbol_search) return es_symbol_search;
	hasRequiredEs_symbol_search = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.search` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.search
	defineWellKnownSymbol('search');
	return es_symbol_search;
}

var es_symbol_species = {};

var hasRequiredEs_symbol_species;

function requireEs_symbol_species () {
	if (hasRequiredEs_symbol_species) return es_symbol_species;
	hasRequiredEs_symbol_species = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.species` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.species
	defineWellKnownSymbol('species');
	return es_symbol_species;
}

var es_symbol_split = {};

var hasRequiredEs_symbol_split;

function requireEs_symbol_split () {
	if (hasRequiredEs_symbol_split) return es_symbol_split;
	hasRequiredEs_symbol_split = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.split` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.split
	defineWellKnownSymbol('split');
	return es_symbol_split;
}

var es_symbol_toPrimitive = {};

var hasRequiredEs_symbol_toPrimitive;

function requireEs_symbol_toPrimitive () {
	if (hasRequiredEs_symbol_toPrimitive) return es_symbol_toPrimitive;
	hasRequiredEs_symbol_toPrimitive = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();
	var defineSymbolToPrimitive = /*@__PURE__*/ requireSymbolDefineToPrimitive();

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol('toPrimitive');

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	defineSymbolToPrimitive();
	return es_symbol_toPrimitive;
}

var es_symbol_toStringTag = {};

var hasRequiredEs_symbol_toStringTag;

function requireEs_symbol_toStringTag () {
	if (hasRequiredEs_symbol_toStringTag) return es_symbol_toStringTag;
	hasRequiredEs_symbol_toStringTag = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol('toStringTag');

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag(getBuiltIn('Symbol'), 'Symbol');
	return es_symbol_toStringTag;
}

var es_symbol_unscopables = {};

var hasRequiredEs_symbol_unscopables;

function requireEs_symbol_unscopables () {
	if (hasRequiredEs_symbol_unscopables) return es_symbol_unscopables;
	hasRequiredEs_symbol_unscopables = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.unscopables` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');
	return es_symbol_unscopables;
}

var es_json_toStringTag = {};

var hasRequiredEs_json_toStringTag;

function requireEs_json_toStringTag () {
	if (hasRequiredEs_json_toStringTag) return es_json_toStringTag;
	hasRequiredEs_json_toStringTag = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();

	// JSON[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-json-@@tostringtag
	setToStringTag(globalThis.JSON, 'JSON', true);
	return es_json_toStringTag;
}

var symbol$4;
var hasRequiredSymbol$4;

function requireSymbol$4 () {
	if (hasRequiredSymbol$4) return symbol$4;
	hasRequiredSymbol$4 = 1;
	requireEs_array_concat();
	requireEs_symbol();
	requireEs_symbol_asyncIterator();
	requireEs_symbol_hasInstance();
	requireEs_symbol_isConcatSpreadable();
	requireEs_symbol_iterator();
	requireEs_symbol_match();
	requireEs_symbol_matchAll();
	requireEs_symbol_replace();
	requireEs_symbol_search();
	requireEs_symbol_species();
	requireEs_symbol_split();
	requireEs_symbol_toPrimitive();
	requireEs_symbol_toStringTag();
	requireEs_symbol_unscopables();
	requireEs_json_toStringTag();
	var path = /*@__PURE__*/ requirePath();

	symbol$4 = path.Symbol;
	return symbol$4;
}

var web_domCollections_iterator = {};

var addToUnscopables;
var hasRequiredAddToUnscopables;

function requireAddToUnscopables () {
	if (hasRequiredAddToUnscopables) return addToUnscopables;
	hasRequiredAddToUnscopables = 1;
	addToUnscopables = function () { /* empty */ };
	return addToUnscopables;
}

var iterators;
var hasRequiredIterators;

function requireIterators () {
	if (hasRequiredIterators) return iterators;
	hasRequiredIterators = 1;
	iterators = {};
	return iterators;
}

var functionName$1;
var hasRequiredFunctionName$1;

function requireFunctionName$1 () {
	if (hasRequiredFunctionName$1) return functionName$1;
	hasRequiredFunctionName$1 = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();

	var FunctionPrototype = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn(FunctionPrototype, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

	functionName$1 = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};
	return functionName$1;
}

var correctPrototypeGetter;
var hasRequiredCorrectPrototypeGetter;

function requireCorrectPrototypeGetter () {
	if (hasRequiredCorrectPrototypeGetter) return correctPrototypeGetter;
	hasRequiredCorrectPrototypeGetter = 1;
	var fails = /*@__PURE__*/ requireFails$1();

	correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});
	return correctPrototypeGetter;
}

var objectGetPrototypeOf;
var hasRequiredObjectGetPrototypeOf;

function requireObjectGetPrototypeOf () {
	if (hasRequiredObjectGetPrototypeOf) return objectGetPrototypeOf;
	hasRequiredObjectGetPrototypeOf = 1;
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var toObject = /*@__PURE__*/ requireToObject$1();
	var sharedKey = /*@__PURE__*/ requireSharedKey$1();
	var CORRECT_PROTOTYPE_GETTER = /*@__PURE__*/ requireCorrectPrototypeGetter();

	var IE_PROTO = sharedKey('IE_PROTO');
	var $Object = Object;
	var ObjectPrototype = $Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof $Object ? ObjectPrototype : null;
	};
	return objectGetPrototypeOf;
}

var iteratorsCore;
var hasRequiredIteratorsCore;

function requireIteratorsCore () {
	if (hasRequiredIteratorsCore) return iteratorsCore;
	hasRequiredIteratorsCore = 1;
	var fails = /*@__PURE__*/ requireFails$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var create = /*@__PURE__*/ requireObjectCreate$1();
	var getPrototypeOf = /*@__PURE__*/ requireObjectGetPrototypeOf();
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype[ITERATOR].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
	else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype[ITERATOR])) {
	  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
	    return this;
	  });
	}

	iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};
	return iteratorsCore;
}

var iteratorCreateConstructor;
var hasRequiredIteratorCreateConstructor;

function requireIteratorCreateConstructor () {
	if (hasRequiredIteratorCreateConstructor) return iteratorCreateConstructor;
	hasRequiredIteratorCreateConstructor = 1;
	var IteratorPrototype =  requireIteratorsCore().IteratorPrototype;
	var create = /*@__PURE__*/ requireObjectCreate$1();
	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor$1();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var Iterators = /*@__PURE__*/ requireIterators();

	var returnThis = function () { return this; };

	iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
	  Iterators[TO_STRING_TAG] = returnThis;
	  return IteratorConstructor;
	};
	return iteratorCreateConstructor;
}

var functionUncurryThisAccessor;
var hasRequiredFunctionUncurryThisAccessor;

function requireFunctionUncurryThisAccessor () {
	if (hasRequiredFunctionUncurryThisAccessor) return functionUncurryThisAccessor;
	hasRequiredFunctionUncurryThisAccessor = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var aCallable = /*@__PURE__*/ requireACallable$1();

	functionUncurryThisAccessor = function (object, key, method) {
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
	  } catch (error) { /* empty */ }
	};
	return functionUncurryThisAccessor;
}

var isPossiblePrototype;
var hasRequiredIsPossiblePrototype;

function requireIsPossiblePrototype () {
	if (hasRequiredIsPossiblePrototype) return isPossiblePrototype;
	hasRequiredIsPossiblePrototype = 1;
	var isObject = /*@__PURE__*/ requireIsObject$1();

	isPossiblePrototype = function (argument) {
	  return isObject(argument) || argument === null;
	};
	return isPossiblePrototype;
}

var aPossiblePrototype;
var hasRequiredAPossiblePrototype;

function requireAPossiblePrototype () {
	if (hasRequiredAPossiblePrototype) return aPossiblePrototype;
	hasRequiredAPossiblePrototype = 1;
	var isPossiblePrototype = /*@__PURE__*/ requireIsPossiblePrototype();

	var $String = String;
	var $TypeError = TypeError;

	aPossiblePrototype = function (argument) {
	  if (isPossiblePrototype(argument)) return argument;
	  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
	};
	return aPossiblePrototype;
}

var objectSetPrototypeOf;
var hasRequiredObjectSetPrototypeOf;

function requireObjectSetPrototypeOf () {
	if (hasRequiredObjectSetPrototypeOf) return objectSetPrototypeOf;
	hasRequiredObjectSetPrototypeOf = 1;
	/* eslint-disable no-proto -- safe */
	var uncurryThisAccessor = /*@__PURE__*/ requireFunctionUncurryThisAccessor();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible$1();
	var aPossiblePrototype = /*@__PURE__*/ requireAPossiblePrototype();

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    requireObjectCoercible(O);
	    aPossiblePrototype(proto);
	    if (!isObject(O)) return O;
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);
	return objectSetPrototypeOf;
}

var iteratorDefine;
var hasRequiredIteratorDefine;

function requireIteratorDefine () {
	if (hasRequiredIteratorDefine) return iteratorDefine;
	hasRequiredIteratorDefine = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();
	var FunctionName = /*@__PURE__*/ requireFunctionName$1();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var createIteratorConstructor = /*@__PURE__*/ requireIteratorCreateConstructor();
	var getPrototypeOf = /*@__PURE__*/ requireObjectGetPrototypeOf();
	var setPrototypeOf = /*@__PURE__*/ requireObjectSetPrototypeOf();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty$1();
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var Iterators = /*@__PURE__*/ requireIterators();
	var IteratorsCore = /*@__PURE__*/ requireIteratorsCore();

	var PROPER_FUNCTION_NAME = FunctionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
	var IteratorPrototype = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    }

	    return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (setPrototypeOf) {
	          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
	          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
	      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return call(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
	    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
	  }
	  Iterators[NAME] = defaultIterator;

	  return methods;
	};
	return iteratorDefine;
}

var createIterResultObject;
var hasRequiredCreateIterResultObject;

function requireCreateIterResultObject () {
	if (hasRequiredCreateIterResultObject) return createIterResultObject;
	hasRequiredCreateIterResultObject = 1;
	// `CreateIterResultObject` abstract operation
	// https://tc39.es/ecma262/#sec-createiterresultobject
	createIterResultObject = function (value, done) {
	  return { value: value, done: done };
	};
	return createIterResultObject;
}

var es_array_iterator;
var hasRequiredEs_array_iterator;

function requireEs_array_iterator () {
	if (hasRequiredEs_array_iterator) return es_array_iterator;
	hasRequiredEs_array_iterator = 1;
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var addToUnscopables = /*@__PURE__*/ requireAddToUnscopables();
	var Iterators = /*@__PURE__*/ requireIterators();
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();
	var defineProperty =  requireObjectDefineProperty$1().f;
	var defineIterator = /*@__PURE__*/ requireIteratorDefine();
	var createIterResultObject = /*@__PURE__*/ requireCreateIterResultObject();
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = InternalStateModule.set;
	var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = null;
	    return createIterResultObject(undefined, true);
	  }
	  switch (state.kind) {
	    case 'keys': return createIterResultObject(index, false);
	    case 'values': return createIterResultObject(target[index], false);
	  } return createIterResultObject([index, target[index]], false);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = Iterators.Arguments = Iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	// V8 ~ Chrome 45- bug
	if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
	  defineProperty(values, 'name', { value: 'values' });
	} catch (error) { /* empty */ }
	return es_array_iterator;
}

var domIterables;
var hasRequiredDomIterables;

function requireDomIterables () {
	if (hasRequiredDomIterables) return domIterables;
	hasRequiredDomIterables = 1;
	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};
	return domIterables;
}

var hasRequiredWeb_domCollections_iterator;

function requireWeb_domCollections_iterator () {
	if (hasRequiredWeb_domCollections_iterator) return web_domCollections_iterator;
	hasRequiredWeb_domCollections_iterator = 1;
	requireEs_array_iterator();
	var DOMIterables = /*@__PURE__*/ requireDomIterables();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var Iterators = /*@__PURE__*/ requireIterators();

	for (var COLLECTION_NAME in DOMIterables) {
	  setToStringTag(globalThis[COLLECTION_NAME], COLLECTION_NAME);
	  Iterators[COLLECTION_NAME] = Iterators.Array;
	}
	return web_domCollections_iterator;
}

var symbol$3;
var hasRequiredSymbol$3;

function requireSymbol$3 () {
	if (hasRequiredSymbol$3) return symbol$3;
	hasRequiredSymbol$3 = 1;
	var parent = /*@__PURE__*/ requireSymbol$4();
	requireWeb_domCollections_iterator();

	symbol$3 = parent;
	return symbol$3;
}

var esnext_function_metadata = {};

var hasRequiredEsnext_function_metadata;

function requireEsnext_function_metadata () {
	if (hasRequiredEsnext_function_metadata) return esnext_function_metadata;
	hasRequiredEsnext_function_metadata = 1;
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var defineProperty =  requireObjectDefineProperty$1().f;

	var METADATA = wellKnownSymbol('metadata');
	var FunctionPrototype = Function.prototype;

	// Function.prototype[@@metadata]
	// https://github.com/tc39/proposal-decorator-metadata
	if (FunctionPrototype[METADATA] === undefined) {
	  defineProperty(FunctionPrototype, METADATA, {
	    value: null
	  });
	}
	return esnext_function_metadata;
}

var esnext_symbol_asyncDispose = {};

var hasRequiredEsnext_symbol_asyncDispose;

function requireEsnext_symbol_asyncDispose () {
	if (hasRequiredEsnext_symbol_asyncDispose) return esnext_symbol_asyncDispose;
	hasRequiredEsnext_symbol_asyncDispose = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.asyncDispose` well-known symbol
	// https://github.com/tc39/proposal-async-explicit-resource-management
	defineWellKnownSymbol('asyncDispose');
	return esnext_symbol_asyncDispose;
}

var esnext_symbol_dispose = {};

var hasRequiredEsnext_symbol_dispose;

function requireEsnext_symbol_dispose () {
	if (hasRequiredEsnext_symbol_dispose) return esnext_symbol_dispose;
	hasRequiredEsnext_symbol_dispose = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.dispose` well-known symbol
	// https://github.com/tc39/proposal-explicit-resource-management
	defineWellKnownSymbol('dispose');
	return esnext_symbol_dispose;
}

var esnext_symbol_metadata = {};

var hasRequiredEsnext_symbol_metadata;

function requireEsnext_symbol_metadata () {
	if (hasRequiredEsnext_symbol_metadata) return esnext_symbol_metadata;
	hasRequiredEsnext_symbol_metadata = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.metadata` well-known symbol
	// https://github.com/tc39/proposal-decorators
	defineWellKnownSymbol('metadata');
	return esnext_symbol_metadata;
}

var symbol$2;
var hasRequiredSymbol$2;

function requireSymbol$2 () {
	if (hasRequiredSymbol$2) return symbol$2;
	hasRequiredSymbol$2 = 1;
	var parent = /*@__PURE__*/ requireSymbol$3();

	requireEsnext_function_metadata();
	requireEsnext_symbol_asyncDispose();
	requireEsnext_symbol_dispose();
	requireEsnext_symbol_metadata();

	symbol$2 = parent;
	return symbol$2;
}

var esnext_symbol_isRegisteredSymbol = {};

var symbolIsRegistered;
var hasRequiredSymbolIsRegistered;

function requireSymbolIsRegistered () {
	if (hasRequiredSymbolIsRegistered) return symbolIsRegistered;
	hasRequiredSymbolIsRegistered = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	var Symbol = getBuiltIn('Symbol');
	var keyFor = Symbol.keyFor;
	var thisSymbolValue = uncurryThis(Symbol.prototype.valueOf);

	// `Symbol.isRegisteredSymbol` method
	// https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregisteredsymbol
	symbolIsRegistered = Symbol.isRegisteredSymbol || function isRegisteredSymbol(value) {
	  try {
	    return keyFor(thisSymbolValue(value)) !== undefined;
	  } catch (error) {
	    return false;
	  }
	};
	return symbolIsRegistered;
}

var hasRequiredEsnext_symbol_isRegisteredSymbol;

function requireEsnext_symbol_isRegisteredSymbol () {
	if (hasRequiredEsnext_symbol_isRegisteredSymbol) return esnext_symbol_isRegisteredSymbol;
	hasRequiredEsnext_symbol_isRegisteredSymbol = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isRegisteredSymbol = /*@__PURE__*/ requireSymbolIsRegistered();

	// `Symbol.isRegisteredSymbol` method
	// https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregisteredsymbol
	$({ target: 'Symbol', stat: true }, {
	  isRegisteredSymbol: isRegisteredSymbol
	});
	return esnext_symbol_isRegisteredSymbol;
}

var esnext_symbol_isWellKnownSymbol = {};

var symbolIsWellKnown;
var hasRequiredSymbolIsWellKnown;

function requireSymbolIsWellKnown () {
	if (hasRequiredSymbolIsWellKnown) return symbolIsWellKnown;
	hasRequiredSymbolIsWellKnown = 1;
	var shared = /*@__PURE__*/ requireShared$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var isSymbol = /*@__PURE__*/ requireIsSymbol$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var Symbol = getBuiltIn('Symbol');
	var $isWellKnownSymbol = Symbol.isWellKnownSymbol;
	var getOwnPropertyNames = getBuiltIn('Object', 'getOwnPropertyNames');
	var thisSymbolValue = uncurryThis(Symbol.prototype.valueOf);
	var WellKnownSymbolsStore = shared('wks');

	for (var i = 0, symbolKeys = getOwnPropertyNames(Symbol), symbolKeysLength = symbolKeys.length; i < symbolKeysLength; i++) {
	  // some old engines throws on access to some keys like `arguments` or `caller`
	  try {
	    var symbolKey = symbolKeys[i];
	    if (isSymbol(Symbol[symbolKey])) wellKnownSymbol(symbolKey);
	  } catch (error) { /* empty */ }
	}

	// `Symbol.isWellKnownSymbol` method
	// https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknownsymbol
	// We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
	symbolIsWellKnown = function isWellKnownSymbol(value) {
	  if ($isWellKnownSymbol && $isWellKnownSymbol(value)) return true;
	  try {
	    var symbol = thisSymbolValue(value);
	    for (var j = 0, keys = getOwnPropertyNames(WellKnownSymbolsStore), keysLength = keys.length; j < keysLength; j++) {
	      // eslint-disable-next-line eqeqeq -- polyfilled symbols case
	      if (WellKnownSymbolsStore[keys[j]] == symbol) return true;
	    }
	  } catch (error) { /* empty */ }
	  return false;
	};
	return symbolIsWellKnown;
}

var hasRequiredEsnext_symbol_isWellKnownSymbol;

function requireEsnext_symbol_isWellKnownSymbol () {
	if (hasRequiredEsnext_symbol_isWellKnownSymbol) return esnext_symbol_isWellKnownSymbol;
	hasRequiredEsnext_symbol_isWellKnownSymbol = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isWellKnownSymbol = /*@__PURE__*/ requireSymbolIsWellKnown();

	// `Symbol.isWellKnownSymbol` method
	// https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknownsymbol
	// We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
	$({ target: 'Symbol', stat: true, forced: true }, {
	  isWellKnownSymbol: isWellKnownSymbol
	});
	return esnext_symbol_isWellKnownSymbol;
}

var esnext_symbol_customMatcher = {};

var hasRequiredEsnext_symbol_customMatcher;

function requireEsnext_symbol_customMatcher () {
	if (hasRequiredEsnext_symbol_customMatcher) return esnext_symbol_customMatcher;
	hasRequiredEsnext_symbol_customMatcher = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.customMatcher` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('customMatcher');
	return esnext_symbol_customMatcher;
}

var esnext_symbol_observable = {};

var hasRequiredEsnext_symbol_observable;

function requireEsnext_symbol_observable () {
	if (hasRequiredEsnext_symbol_observable) return esnext_symbol_observable;
	hasRequiredEsnext_symbol_observable = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.observable` well-known symbol
	// https://github.com/tc39/proposal-observable
	defineWellKnownSymbol('observable');
	return esnext_symbol_observable;
}

var esnext_symbol_isRegistered = {};

var hasRequiredEsnext_symbol_isRegistered;

function requireEsnext_symbol_isRegistered () {
	if (hasRequiredEsnext_symbol_isRegistered) return esnext_symbol_isRegistered;
	hasRequiredEsnext_symbol_isRegistered = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isRegisteredSymbol = /*@__PURE__*/ requireSymbolIsRegistered();

	// `Symbol.isRegistered` method
	// obsolete version of https://tc39.es/proposal-symbol-predicates/#sec-symbol-isregisteredsymbol
	$({ target: 'Symbol', stat: true, name: 'isRegisteredSymbol' }, {
	  isRegistered: isRegisteredSymbol
	});
	return esnext_symbol_isRegistered;
}

var esnext_symbol_isWellKnown = {};

var hasRequiredEsnext_symbol_isWellKnown;

function requireEsnext_symbol_isWellKnown () {
	if (hasRequiredEsnext_symbol_isWellKnown) return esnext_symbol_isWellKnown;
	hasRequiredEsnext_symbol_isWellKnown = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isWellKnownSymbol = /*@__PURE__*/ requireSymbolIsWellKnown();

	// `Symbol.isWellKnown` method
	// obsolete version of https://tc39.es/proposal-symbol-predicates/#sec-symbol-iswellknownsymbol
	// We should patch it for newly added well-known symbols. If it's not required, this module just will not be injected
	$({ target: 'Symbol', stat: true, name: 'isWellKnownSymbol', forced: true }, {
	  isWellKnown: isWellKnownSymbol
	});
	return esnext_symbol_isWellKnown;
}

var esnext_symbol_matcher = {};

var hasRequiredEsnext_symbol_matcher;

function requireEsnext_symbol_matcher () {
	if (hasRequiredEsnext_symbol_matcher) return esnext_symbol_matcher;
	hasRequiredEsnext_symbol_matcher = 1;
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.matcher` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('matcher');
	return esnext_symbol_matcher;
}

var esnext_symbol_metadataKey = {};

var hasRequiredEsnext_symbol_metadataKey;

function requireEsnext_symbol_metadataKey () {
	if (hasRequiredEsnext_symbol_metadataKey) return esnext_symbol_metadataKey;
	hasRequiredEsnext_symbol_metadataKey = 1;
	// TODO: Remove from `core-js@4`
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.metadataKey` well-known symbol
	// https://github.com/tc39/proposal-decorator-metadata
	defineWellKnownSymbol('metadataKey');
	return esnext_symbol_metadataKey;
}

var esnext_symbol_patternMatch = {};

var hasRequiredEsnext_symbol_patternMatch;

function requireEsnext_symbol_patternMatch () {
	if (hasRequiredEsnext_symbol_patternMatch) return esnext_symbol_patternMatch;
	hasRequiredEsnext_symbol_patternMatch = 1;
	// TODO: remove from `core-js@4`
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	// `Symbol.patternMatch` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('patternMatch');
	return esnext_symbol_patternMatch;
}

var esnext_symbol_replaceAll = {};

var hasRequiredEsnext_symbol_replaceAll;

function requireEsnext_symbol_replaceAll () {
	if (hasRequiredEsnext_symbol_replaceAll) return esnext_symbol_replaceAll;
	hasRequiredEsnext_symbol_replaceAll = 1;
	// TODO: remove from `core-js@4`
	var defineWellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbolDefine();

	defineWellKnownSymbol('replaceAll');
	return esnext_symbol_replaceAll;
}

var symbol$1;
var hasRequiredSymbol$1;

function requireSymbol$1 () {
	if (hasRequiredSymbol$1) return symbol$1;
	hasRequiredSymbol$1 = 1;
	var parent = /*@__PURE__*/ requireSymbol$2();
	requireEsnext_symbol_isRegisteredSymbol();
	requireEsnext_symbol_isWellKnownSymbol();
	requireEsnext_symbol_customMatcher();
	requireEsnext_symbol_observable();
	// TODO: Remove from `core-js@4`
	requireEsnext_symbol_isRegistered();
	requireEsnext_symbol_isWellKnown();
	requireEsnext_symbol_matcher();
	requireEsnext_symbol_metadataKey();
	requireEsnext_symbol_patternMatch();
	requireEsnext_symbol_replaceAll();

	symbol$1 = parent;
	return symbol$1;
}

var symbol;
var hasRequiredSymbol;

function requireSymbol () {
	if (hasRequiredSymbol) return symbol;
	hasRequiredSymbol = 1;
	symbol = /*@__PURE__*/ requireSymbol$1();
	return symbol;
}

var symbolExports = /*@__PURE__*/ requireSymbol();
var _Symbol = /*@__PURE__*/getDefaultExportFromCjs(symbolExports);

var es_string_iterator = {};

var stringMultibyte$1;
var hasRequiredStringMultibyte$1;

function requireStringMultibyte$1 () {
	if (hasRequiredStringMultibyte$1) return stringMultibyte$1;
	hasRequiredStringMultibyte$1 = 1;
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity$1();
	var toString = /*@__PURE__*/ requireToString$1();
	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible$1();

	var charAt = uncurryThis(''.charAt);
	var charCodeAt = uncurryThis(''.charCodeAt);
	var stringSlice = uncurryThis(''.slice);

	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	stringMultibyte$1 = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};
	return stringMultibyte$1;
}

var hasRequiredEs_string_iterator;

function requireEs_string_iterator () {
	if (hasRequiredEs_string_iterator) return es_string_iterator;
	hasRequiredEs_string_iterator = 1;
	var charAt =  requireStringMultibyte$1().charAt;
	var toString = /*@__PURE__*/ requireToString$1();
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();
	var defineIterator = /*@__PURE__*/ requireIteratorDefine();
	var createIterResultObject = /*@__PURE__*/ requireCreateIterResultObject();

	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = InternalStateModule.set;
	var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: toString(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return createIterResultObject(undefined, true);
	  point = charAt(string, index);
	  state.index += point.length;
	  return createIterResultObject(point, false);
	});
	return es_string_iterator;
}

var iterator$4;
var hasRequiredIterator$4;

function requireIterator$4 () {
	if (hasRequiredIterator$4) return iterator$4;
	hasRequiredIterator$4 = 1;
	requireEs_array_iterator();
	requireEs_string_iterator();
	requireEs_symbol_iterator();
	var WrappedWellKnownSymbolModule = /*@__PURE__*/ requireWellKnownSymbolWrapped();

	iterator$4 = WrappedWellKnownSymbolModule.f('iterator');
	return iterator$4;
}

var iterator$3;
var hasRequiredIterator$3;

function requireIterator$3 () {
	if (hasRequiredIterator$3) return iterator$3;
	hasRequiredIterator$3 = 1;
	var parent = /*@__PURE__*/ requireIterator$4();
	requireWeb_domCollections_iterator();

	iterator$3 = parent;
	return iterator$3;
}

var iterator$2;
var hasRequiredIterator$2;

function requireIterator$2 () {
	if (hasRequiredIterator$2) return iterator$2;
	hasRequiredIterator$2 = 1;
	var parent = /*@__PURE__*/ requireIterator$3();

	iterator$2 = parent;
	return iterator$2;
}

var iterator$1;
var hasRequiredIterator$1;

function requireIterator$1 () {
	if (hasRequiredIterator$1) return iterator$1;
	hasRequiredIterator$1 = 1;
	var parent = /*@__PURE__*/ requireIterator$2();

	iterator$1 = parent;
	return iterator$1;
}

var iterator;
var hasRequiredIterator;

function requireIterator () {
	if (hasRequiredIterator) return iterator;
	hasRequiredIterator = 1;
	iterator = /*@__PURE__*/ requireIterator$1();
	return iterator;
}

var iteratorExports = /*@__PURE__*/ requireIterator();
var _Symbol$iterator = /*@__PURE__*/getDefaultExportFromCjs(iteratorExports);

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof _Symbol && "symbol" == typeof _Symbol$iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof _Symbol && o.constructor === _Symbol && o !== _Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

var toPrimitive$6;
var hasRequiredToPrimitive$5;

function requireToPrimitive$5 () {
	if (hasRequiredToPrimitive$5) return toPrimitive$6;
	hasRequiredToPrimitive$5 = 1;
	requireEs_symbol_toPrimitive();
	var WrappedWellKnownSymbolModule = /*@__PURE__*/ requireWellKnownSymbolWrapped();

	toPrimitive$6 = WrappedWellKnownSymbolModule.f('toPrimitive');
	return toPrimitive$6;
}

var toPrimitive$5;
var hasRequiredToPrimitive$4;

function requireToPrimitive$4 () {
	if (hasRequiredToPrimitive$4) return toPrimitive$5;
	hasRequiredToPrimitive$4 = 1;
	var parent = /*@__PURE__*/ requireToPrimitive$5();

	toPrimitive$5 = parent;
	return toPrimitive$5;
}

var toPrimitive$4;
var hasRequiredToPrimitive$3;

function requireToPrimitive$3 () {
	if (hasRequiredToPrimitive$3) return toPrimitive$4;
	hasRequiredToPrimitive$3 = 1;
	var parent = /*@__PURE__*/ requireToPrimitive$4();

	toPrimitive$4 = parent;
	return toPrimitive$4;
}

var toPrimitive$3;
var hasRequiredToPrimitive$2;

function requireToPrimitive$2 () {
	if (hasRequiredToPrimitive$2) return toPrimitive$3;
	hasRequiredToPrimitive$2 = 1;
	var parent = /*@__PURE__*/ requireToPrimitive$3();

	toPrimitive$3 = parent;
	return toPrimitive$3;
}

var toPrimitive$2;
var hasRequiredToPrimitive$1;

function requireToPrimitive$1 () {
	if (hasRequiredToPrimitive$1) return toPrimitive$2;
	hasRequiredToPrimitive$1 = 1;
	toPrimitive$2 = /*@__PURE__*/ requireToPrimitive$2();
	return toPrimitive$2;
}

var toPrimitiveExports = /*@__PURE__*/ requireToPrimitive$1();
var _Symbol$toPrimitive = /*@__PURE__*/getDefaultExportFromCjs(toPrimitiveExports);

function toPrimitive$1(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[_Symbol$toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

function toPropertyKey$1(t) {
  var i = toPrimitive$1(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

function _defineProperty(e, r, t) {
  return (r = toPropertyKey$1(r)) in e ? _Object$defineProperty$1(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

var es_string_fromCodePoint = {};

var hasRequiredEs_string_fromCodePoint;

function requireEs_string_fromCodePoint () {
	if (hasRequiredEs_string_fromCodePoint) return es_string_fromCodePoint;
	hasRequiredEs_string_fromCodePoint = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var toAbsoluteIndex = /*@__PURE__*/ requireToAbsoluteIndex$1();

	var $RangeError = RangeError;
	var fromCharCode = String.fromCharCode;
	// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
	var $fromCodePoint = String.fromCodePoint;
	var join = uncurryThis([].join);

	// length should be 1, old FF problem
	var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length !== 1;

	// `String.fromCodePoint` method
	// https://tc39.es/ecma262/#sec-string.fromcodepoint
	$({ target: 'String', stat: true, arity: 1, forced: INCORRECT_LENGTH }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  fromCodePoint: function fromCodePoint(x) {
	    var elements = [];
	    var length = arguments.length;
	    var i = 0;
	    var code;
	    while (length > i) {
	      code = +arguments[i++];
	      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw new $RangeError(code + ' is not a valid code point');
	      elements[i] = code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
	    } return join(elements, '');
	  }
	});
	return es_string_fromCodePoint;
}

var safeGetBuiltIn;
var hasRequiredSafeGetBuiltIn;

function requireSafeGetBuiltIn () {
	if (hasRequiredSafeGetBuiltIn) return safeGetBuiltIn;
	hasRequiredSafeGetBuiltIn = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Avoid NodeJS experimental warning
	safeGetBuiltIn = function (name) {
	  if (!DESCRIPTORS) return globalThis[name];
	  var descriptor = getOwnPropertyDescriptor(globalThis, name);
	  return descriptor && descriptor.value;
	};
	return safeGetBuiltIn;
}

var urlConstructorDetection;
var hasRequiredUrlConstructorDetection;

function requireUrlConstructorDetection () {
	if (hasRequiredUrlConstructorDetection) return urlConstructorDetection;
	hasRequiredUrlConstructorDetection = 1;
	var fails = /*@__PURE__*/ requireFails$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();

	var ITERATOR = wellKnownSymbol('iterator');

	urlConstructorDetection = !fails(function () {
	  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
	  var url = new URL('b?a=1&b=2&c=3', 'https://a');
	  var params = url.searchParams;
	  var params2 = new URLSearchParams('a=1&a=2&b=3');
	  var result = '';
	  url.pathname = 'c%20d';
	  params.forEach(function (value, key) {
	    params['delete']('b');
	    result += key + value;
	  });
	  params2['delete']('a', 2);
	  // `undefined` case is a Chromium 117 bug
	  // https://bugs.chromium.org/p/v8/issues/detail?id=14222
	  params2['delete']('b', undefined);
	  return (IS_PURE && (!url.toJSON || !params2.has('a', 1) || params2.has('a', 2) || !params2.has('a', undefined) || params2.has('b')))
	    || (!params.size && (IS_PURE || !DESCRIPTORS))
	    || !params.sort
	    || url.href !== 'https://a/c%20d?a=1&c=3'
	    || params.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !params[ITERATOR]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('https://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('https://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('https://x', undefined).host !== 'x';
	});
	return urlConstructorDetection;
}

var defineBuiltIns;
var hasRequiredDefineBuiltIns;

function requireDefineBuiltIns () {
	if (hasRequiredDefineBuiltIns) return defineBuiltIns;
	hasRequiredDefineBuiltIns = 1;
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();

	defineBuiltIns = function (target, src, options) {
	  for (var key in src) {
	    if (options && options.unsafe && target[key]) target[key] = src[key];
	    else defineBuiltIn(target, key, src[key], options);
	  } return target;
	};
	return defineBuiltIns;
}

var anInstance;
var hasRequiredAnInstance;

function requireAnInstance () {
	if (hasRequiredAnInstance) return anInstance;
	hasRequiredAnInstance = 1;
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();

	var $TypeError = TypeError;

	anInstance = function (it, Prototype) {
	  if (isPrototypeOf(Prototype, it)) return it;
	  throw new $TypeError('Incorrect invocation');
	};
	return anInstance;
}

var getIteratorMethod;
var hasRequiredGetIteratorMethod;

function requireGetIteratorMethod () {
	if (hasRequiredGetIteratorMethod) return getIteratorMethod;
	hasRequiredGetIteratorMethod = 1;
	var classof = /*@__PURE__*/ requireClassof$1();
	var getMethod = /*@__PURE__*/ requireGetMethod$1();
	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined$1();
	var Iterators = /*@__PURE__*/ requireIterators();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var ITERATOR = wellKnownSymbol('iterator');

	getIteratorMethod = function (it) {
	  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
	    || getMethod(it, '@@iterator')
	    || Iterators[classof(it)];
	};
	return getIteratorMethod;
}

var getIterator;
var hasRequiredGetIterator;

function requireGetIterator () {
	if (hasRequiredGetIterator) return getIterator;
	hasRequiredGetIterator = 1;
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var aCallable = /*@__PURE__*/ requireACallable$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var tryToString = /*@__PURE__*/ requireTryToString$1();
	var getIteratorMethod = /*@__PURE__*/ requireGetIteratorMethod();

	var $TypeError = TypeError;

	getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
	  throw new $TypeError(tryToString(argument) + ' is not iterable');
	};
	return getIterator;
}

var validateArgumentsLength;
var hasRequiredValidateArgumentsLength;

function requireValidateArgumentsLength () {
	if (hasRequiredValidateArgumentsLength) return validateArgumentsLength;
	hasRequiredValidateArgumentsLength = 1;
	var $TypeError = TypeError;

	validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw new $TypeError('Not enough arguments');
	  return passed;
	};
	return validateArgumentsLength;
}

var arraySort;
var hasRequiredArraySort;

function requireArraySort () {
	if (hasRequiredArraySort) return arraySort;
	hasRequiredArraySort = 1;
	var arraySlice = /*@__PURE__*/ requireArraySlice();

	var floor = Math.floor;

	var sort = function (array, comparefn) {
	  var length = array.length;

	  if (length < 8) {
	    // insertion sort
	    var i = 1;
	    var element, j;

	    while (i < length) {
	      j = i;
	      element = array[i];
	      while (j && comparefn(array[j - 1], element) > 0) {
	        array[j] = array[--j];
	      }
	      if (j !== i++) array[j] = element;
	    }
	  } else {
	    // merge sort
	    var middle = floor(length / 2);
	    var left = sort(arraySlice(array, 0, middle), comparefn);
	    var right = sort(arraySlice(array, middle), comparefn);
	    var llength = left.length;
	    var rlength = right.length;
	    var lindex = 0;
	    var rindex = 0;

	    while (lindex < llength || rindex < rlength) {
	      array[lindex + rindex] = (lindex < llength && rindex < rlength)
	        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
	        : lindex < llength ? left[lindex++] : right[rindex++];
	    }
	  }

	  return array;
	};

	arraySort = sort;
	return arraySort;
}

var web_urlSearchParams_constructor;
var hasRequiredWeb_urlSearchParams_constructor;

function requireWeb_urlSearchParams_constructor () {
	if (hasRequiredWeb_urlSearchParams_constructor) return web_urlSearchParams_constructor;
	hasRequiredWeb_urlSearchParams_constructor = 1;
	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
	requireEs_array_iterator();
	requireEs_string_fromCodePoint();
	var $ = /*@__PURE__*/ require_export$1();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var safeGetBuiltIn = /*@__PURE__*/ requireSafeGetBuiltIn();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var USE_NATIVE_URL = /*@__PURE__*/ requireUrlConstructorDetection();
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();
	var defineBuiltInAccessor = /*@__PURE__*/ requireDefineBuiltInAccessor();
	var defineBuiltIns = /*@__PURE__*/ requireDefineBuiltIns();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var createIteratorConstructor = /*@__PURE__*/ requireIteratorCreateConstructor();
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();
	var anInstance = /*@__PURE__*/ requireAnInstance();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var classof = /*@__PURE__*/ requireClassof$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var $toString = /*@__PURE__*/ requireToString$1();
	var create = /*@__PURE__*/ requireObjectCreate$1();
	var createPropertyDescriptor = /*@__PURE__*/ requireCreatePropertyDescriptor$1();
	var getIterator = /*@__PURE__*/ requireGetIterator();
	var getIteratorMethod = /*@__PURE__*/ requireGetIteratorMethod();
	var createIterResultObject = /*@__PURE__*/ requireCreateIterResultObject();
	var validateArgumentsLength = /*@__PURE__*/ requireValidateArgumentsLength();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var arraySort = /*@__PURE__*/ requireArraySort();

	var ITERATOR = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState = InternalStateModule.set;
	var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

	var nativeFetch = safeGetBuiltIn('fetch');
	var NativeRequest = safeGetBuiltIn('Request');
	var Headers = safeGetBuiltIn('Headers');
	var RequestPrototype = NativeRequest && NativeRequest.prototype;
	var HeadersPrototype = Headers && Headers.prototype;
	var TypeError = globalThis.TypeError;
	var encodeURIComponent = globalThis.encodeURIComponent;
	var fromCharCode = String.fromCharCode;
	var fromCodePoint = getBuiltIn('String', 'fromCodePoint');
	var $parseInt = parseInt;
	var charAt = uncurryThis(''.charAt);
	var join = uncurryThis([].join);
	var push = uncurryThis([].push);
	var replace = uncurryThis(''.replace);
	var shift = uncurryThis([].shift);
	var splice = uncurryThis([].splice);
	var split = uncurryThis(''.split);
	var stringSlice = uncurryThis(''.slice);
	var exec = uncurryThis(/./.exec);

	var plus = /\+/g;
	var FALLBACK_REPLACER = '\uFFFD';
	var VALID_HEX = /^[0-9a-f]+$/i;

	var parseHexOctet = function (string, start) {
	  var substr = stringSlice(string, start, start + 2);
	  if (!exec(VALID_HEX, substr)) return NaN;

	  return $parseInt(substr, 16);
	};

	var getLeadingOnes = function (octet) {
	  var count = 0;
	  for (var mask = 0x80; mask > 0 && (octet & mask) !== 0; mask >>= 1) {
	    count++;
	  }
	  return count;
	};

	var utf8Decode = function (octets) {
	  var codePoint = null;

	  switch (octets.length) {
	    case 1:
	      codePoint = octets[0];
	      break;
	    case 2:
	      codePoint = (octets[0] & 0x1F) << 6 | (octets[1] & 0x3F);
	      break;
	    case 3:
	      codePoint = (octets[0] & 0x0F) << 12 | (octets[1] & 0x3F) << 6 | (octets[2] & 0x3F);
	      break;
	    case 4:
	      codePoint = (octets[0] & 0x07) << 18 | (octets[1] & 0x3F) << 12 | (octets[2] & 0x3F) << 6 | (octets[3] & 0x3F);
	      break;
	  }

	  return codePoint > 0x10FFFF ? null : codePoint;
	};

	var decode = function (input) {
	  input = replace(input, plus, ' ');
	  var length = input.length;
	  var result = '';
	  var i = 0;

	  while (i < length) {
	    var decodedChar = charAt(input, i);

	    if (decodedChar === '%') {
	      if (charAt(input, i + 1) === '%' || i + 3 > length) {
	        result += '%';
	        i++;
	        continue;
	      }

	      var octet = parseHexOctet(input, i + 1);

	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (octet !== octet) {
	        result += decodedChar;
	        i++;
	        continue;
	      }

	      i += 2;
	      var byteSequenceLength = getLeadingOnes(octet);

	      if (byteSequenceLength === 0) {
	        decodedChar = fromCharCode(octet);
	      } else {
	        if (byteSequenceLength === 1 || byteSequenceLength > 4) {
	          result += FALLBACK_REPLACER;
	          i++;
	          continue;
	        }

	        var octets = [octet];
	        var sequenceIndex = 1;

	        while (sequenceIndex < byteSequenceLength) {
	          i++;
	          if (i + 3 > length || charAt(input, i) !== '%') break;

	          var nextByte = parseHexOctet(input, i + 1);

	          // eslint-disable-next-line no-self-compare -- NaN check
	          if (nextByte !== nextByte) {
	            i += 3;
	            break;
	          }
	          if (nextByte > 191 || nextByte < 128) break;

	          push(octets, nextByte);
	          i += 2;
	          sequenceIndex++;
	        }

	        if (octets.length !== byteSequenceLength) {
	          result += FALLBACK_REPLACER;
	          continue;
	        }

	        var codePoint = utf8Decode(octets);
	        if (codePoint === null) {
	          result += FALLBACK_REPLACER;
	        } else {
	          decodedChar = fromCodePoint(codePoint);
	        }
	      }
	    }

	    result += decodedChar;
	    i++;
	  }

	  return result;
	};

	var find = /[!'()~]|%20/g;

	var replacements = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replacements[match];
	};

	var serialize = function (it) {
	  return replace(encodeURIComponent(it), find, replacer);
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    target: getInternalParamsState(params).entries,
	    index: 0,
	    kind: kind
	  });
	}, URL_SEARCH_PARAMS, function next() {
	  var state = getInternalIteratorState(this);
	  var target = state.target;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = null;
	    return createIterResultObject(undefined, true);
	  }
	  var entry = target[index];
	  switch (state.kind) {
	    case 'keys': return createIterResultObject(entry.key, false);
	    case 'values': return createIterResultObject(entry.value, false);
	  } return createIterResultObject([entry.key, entry.value], false);
	}, true);

	var URLSearchParamsState = function (init) {
	  this.entries = [];
	  this.url = null;

	  if (init !== undefined) {
	    if (isObject(init)) this.parseObject(init);
	    else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init));
	  }
	};

	URLSearchParamsState.prototype = {
	  type: URL_SEARCH_PARAMS,
	  bindURL: function (url) {
	    this.url = url;
	    this.update();
	  },
	  parseObject: function (object) {
	    var entries = this.entries;
	    var iteratorMethod = getIteratorMethod(object);
	    var iterator, next, step, entryIterator, entryNext, first, second;

	    if (iteratorMethod) {
	      iterator = getIterator(object, iteratorMethod);
	      next = iterator.next;
	      while (!(step = call(next, iterator)).done) {
	        entryIterator = getIterator(anObject(step.value));
	        entryNext = entryIterator.next;
	        if (
	          (first = call(entryNext, entryIterator)).done ||
	          (second = call(entryNext, entryIterator)).done ||
	          !call(entryNext, entryIterator).done
	        ) throw new TypeError('Expected sequence with length 2');
	        push(entries, { key: $toString(first.value), value: $toString(second.value) });
	      }
	    } else for (var key in object) if (hasOwn(object, key)) {
	      push(entries, { key: key, value: $toString(object[key]) });
	    }
	  },
	  parseQuery: function (query) {
	    if (query) {
	      var entries = this.entries;
	      var attributes = split(query, '&');
	      var index = 0;
	      var attribute, entry;
	      while (index < attributes.length) {
	        attribute = attributes[index++];
	        if (attribute.length) {
	          entry = split(attribute, '=');
	          push(entries, {
	            key: decode(shift(entry)),
	            value: decode(join(entry, '='))
	          });
	        }
	      }
	    }
	  },
	  serialize: function () {
	    var entries = this.entries;
	    var result = [];
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      push(result, serialize(entry.key) + '=' + serialize(entry.value));
	    } return join(result, '&');
	  },
	  update: function () {
	    this.entries.length = 0;
	    this.parseQuery(this.url.query);
	  },
	  updateURL: function () {
	    if (this.url) this.url.update();
	  }
	};

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance(this, URLSearchParamsPrototype);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  var state = setInternalState(this, new URLSearchParamsState(init));
	  if (!DESCRIPTORS) this.size = state.entries.length;
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	defineBuiltIns(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.append` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    var state = getInternalParamsState(this);
	    validateArgumentsLength(arguments.length, 2);
	    push(state.entries, { key: $toString(name), value: $toString(value) });
	    if (!DESCRIPTORS) this.length++;
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name /* , value */) {
	    var state = getInternalParamsState(this);
	    var length = validateArgumentsLength(arguments.length, 1);
	    var entries = state.entries;
	    var key = $toString(name);
	    var $value = length < 2 ? undefined : arguments[1];
	    var value = $value === undefined ? $value : $toString($value);
	    var index = 0;
	    while (index < entries.length) {
	      var entry = entries[index];
	      if (entry.key === key && (value === undefined || entry.value === value)) {
	        splice(entries, index, 1);
	        if (value !== undefined) break;
	      } else index++;
	    }
	    if (!DESCRIPTORS) this.size = entries.length;
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    var entries = getInternalParamsState(this).entries;
	    validateArgumentsLength(arguments.length, 1);
	    var key = $toString(name);
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    var entries = getInternalParamsState(this).entries;
	    validateArgumentsLength(arguments.length, 1);
	    var key = $toString(name);
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) push(result, entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name /* , value */) {
	    var entries = getInternalParamsState(this).entries;
	    var length = validateArgumentsLength(arguments.length, 1);
	    var key = $toString(name);
	    var $value = length < 2 ? undefined : arguments[1];
	    var value = $value === undefined ? $value : $toString($value);
	    var index = 0;
	    while (index < entries.length) {
	      var entry = entries[index++];
	      if (entry.key === key && (value === undefined || entry.value === value)) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    var state = getInternalParamsState(this);
	    validateArgumentsLength(arguments.length, 1);
	    var entries = state.entries;
	    var found = false;
	    var key = $toString(name);
	    var val = $toString(value);
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) splice(entries, index--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) push(entries, { key: key, value: val });
	    if (!DESCRIPTORS) this.size = entries.length;
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    arraySort(state.entries, function (a, b) {
	      return a.key > b.key ? 1 : -1;
	    });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
	  return getInternalParamsState(this).serialize();
	}, { enumerable: true });

	// `URLSearchParams.prototype.size` getter
	// https://github.com/whatwg/url/pull/734
	if (DESCRIPTORS) defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
	  get: function size() {
	    return getInternalParamsState(this).entries.length;
	  },
	  configurable: true,
	  enumerable: true
	});

	setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	$({ global: true, constructor: true, forced: !USE_NATIVE_URL }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
	if (!USE_NATIVE_URL && isCallable(Headers)) {
	  var headersHas = uncurryThis(HeadersPrototype.has);
	  var headersSet = uncurryThis(HeadersPrototype.set);

	  var wrapRequestOptions = function (init) {
	    if (isObject(init)) {
	      var body = init.body;
	      var headers;
	      if (classof(body) === URL_SEARCH_PARAMS) {
	        headers = init.headers ? new Headers(init.headers) : new Headers();
	        if (!headersHas(headers, 'content-type')) {
	          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	        return create(init, {
	          body: createPropertyDescriptor(0, $toString(body)),
	          headers: createPropertyDescriptor(0, headers)
	        });
	      }
	    } return init;
	  };

	  if (isCallable(nativeFetch)) {
	    $({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
	      fetch: function fetch(input /* , init */) {
	        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	      }
	    });
	  }

	  if (isCallable(NativeRequest)) {
	    var RequestConstructor = function Request(input /* , init */) {
	      anInstance(this, RequestPrototype);
	      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	    };

	    RequestPrototype.constructor = RequestConstructor;
	    RequestConstructor.prototype = RequestPrototype;

	    $({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
	      Request: RequestConstructor
	    });
	  }
	}

	web_urlSearchParams_constructor = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};
	return web_urlSearchParams_constructor;
}

var web_url = {};

var web_url_constructor = {};

var objectAssign;
var hasRequiredObjectAssign;

function requireObjectAssign () {
	if (hasRequiredObjectAssign) return objectAssign;
	hasRequiredObjectAssign = 1;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var objectKeys = /*@__PURE__*/ requireObjectKeys$1();
	var getOwnPropertySymbolsModule = /*@__PURE__*/ requireObjectGetOwnPropertySymbols$1();
	var propertyIsEnumerableModule = /*@__PURE__*/ requireObjectPropertyIsEnumerable$1();
	var toObject = /*@__PURE__*/ requireToObject$1();
	var IndexedObject = /*@__PURE__*/ requireIndexedObject$1();

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty = Object.defineProperty;
	var concat = uncurryThis([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol('assign detection');
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;
	  while (argumentsLength > index) {
	    var S = IndexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;
	return objectAssign;
}

var iteratorClose;
var hasRequiredIteratorClose;

function requireIteratorClose () {
	if (hasRequiredIteratorClose) return iteratorClose;
	hasRequiredIteratorClose = 1;
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var getMethod = /*@__PURE__*/ requireGetMethod$1();

	iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = call(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject(innerResult);
	  return value;
	};
	return iteratorClose;
}

var callWithSafeIterationClosing;
var hasRequiredCallWithSafeIterationClosing;

function requireCallWithSafeIterationClosing () {
	if (hasRequiredCallWithSafeIterationClosing) return callWithSafeIterationClosing;
	hasRequiredCallWithSafeIterationClosing = 1;
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var iteratorClose = /*@__PURE__*/ requireIteratorClose();

	// call something on iterator step with safe closing on error
	callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};
	return callWithSafeIterationClosing;
}

var isArrayIteratorMethod;
var hasRequiredIsArrayIteratorMethod;

function requireIsArrayIteratorMethod () {
	if (hasRequiredIsArrayIteratorMethod) return isArrayIteratorMethod;
	hasRequiredIsArrayIteratorMethod = 1;
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var Iterators = /*@__PURE__*/ requireIterators();

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	isArrayIteratorMethod = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
	};
	return isArrayIteratorMethod;
}

var arrayFrom;
var hasRequiredArrayFrom;

function requireArrayFrom () {
	if (hasRequiredArrayFrom) return arrayFrom;
	hasRequiredArrayFrom = 1;
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var toObject = /*@__PURE__*/ requireToObject$1();
	var callWithSafeIterationClosing = /*@__PURE__*/ requireCallWithSafeIterationClosing();
	var isArrayIteratorMethod = /*@__PURE__*/ requireIsArrayIteratorMethod();
	var isConstructor = /*@__PURE__*/ requireIsConstructor();
	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike$1();
	var createProperty = /*@__PURE__*/ requireCreateProperty();
	var getIterator = /*@__PURE__*/ requireGetIterator();
	var getIteratorMethod = /*@__PURE__*/ requireGetIteratorMethod();

	var $Array = Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
	    result = IS_CONSTRUCTOR ? new this() : [];
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    for (;!(step = call(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike(O);
	    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};
	return arrayFrom;
}

var stringPunycodeToAscii;
var hasRequiredStringPunycodeToAscii;

function requireStringPunycodeToAscii () {
	if (hasRequiredStringPunycodeToAscii) return stringPunycodeToAscii;
	hasRequiredStringPunycodeToAscii = 1;
	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();

	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;

	var $RangeError = RangeError;
	var exec = uncurryThis(regexSeparators.exec);
	var floor = Math.floor;
	var fromCharCode = String.fromCharCode;
	var charCodeAt = uncurryThis(''.charCodeAt);
	var join = uncurryThis([].join);
	var push = uncurryThis([].push);
	var replace = uncurryThis(''.replace);
	var split = uncurryThis(''.split);
	var toLowerCase = uncurryThis(''.toLowerCase);

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = charCodeAt(string, counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = charCodeAt(string, counter++);
	      if ((extra & 0xFC00) === 0xDC00) { // Low surrogate.
	        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        push(output, value);
	        counter--;
	      }
	    } else {
	      push(output, value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor(delta / damp) : delta >> 1;
	  delta += floor(delta / numPoints);
	  while (delta > baseMinusTMin * tMax >> 1) {
	    delta = floor(delta / baseMinusTMin);
	    k += base;
	  }
	  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      push(output, fromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    push(output, delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
	      throw new $RangeError(OVERFLOW_ERROR);
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw new $RangeError(OVERFLOW_ERROR);
	      }
	      if (currentValue === n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        var k = base;
	        while (true) {
	          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
	          if (q < t) break;
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor(qMinusT / baseMinusT);
	          k += base;
	        }

	        push(output, fromCharCode(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
	        delta = 0;
	        handledCPCount++;
	      }
	    }

	    delta++;
	    n++;
	  }
	  return join(output, '');
	};

	stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = split(replace(toLowerCase(input), regexSeparators, '\u002E'), '.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
	  }
	  return join(encoded, '.');
	};
	return stringPunycodeToAscii;
}

var hasRequiredWeb_url_constructor;

function requireWeb_url_constructor () {
	if (hasRequiredWeb_url_constructor) return web_url_constructor;
	hasRequiredWeb_url_constructor = 1;
	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
	requireEs_string_iterator();
	var $ = /*@__PURE__*/ require_export$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var USE_NATIVE_URL = /*@__PURE__*/ requireUrlConstructorDetection();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var defineBuiltIn = /*@__PURE__*/ requireDefineBuiltIn$1();
	var defineBuiltInAccessor = /*@__PURE__*/ requireDefineBuiltInAccessor();
	var anInstance = /*@__PURE__*/ requireAnInstance();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var assign = /*@__PURE__*/ requireObjectAssign();
	var arrayFrom = /*@__PURE__*/ requireArrayFrom();
	var arraySlice = /*@__PURE__*/ requireArraySlice();
	var codeAt =  requireStringMultibyte$1().codeAt;
	var toASCII = /*@__PURE__*/ requireStringPunycodeToAscii();
	var $toString = /*@__PURE__*/ requireToString$1();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var validateArgumentsLength = /*@__PURE__*/ requireValidateArgumentsLength();
	var URLSearchParamsModule = requireWeb_urlSearchParams_constructor();
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();

	var setInternalState = InternalStateModule.set;
	var getInternalURLState = InternalStateModule.getterFor('URL');
	var URLSearchParams = URLSearchParamsModule.URLSearchParams;
	var getInternalSearchParamsState = URLSearchParamsModule.getState;

	var NativeURL = globalThis.URL;
	var TypeError = globalThis.TypeError;
	var parseInt = globalThis.parseInt;
	var floor = Math.floor;
	var pow = Math.pow;
	var charAt = uncurryThis(''.charAt);
	var exec = uncurryThis(/./.exec);
	var join = uncurryThis([].join);
	var numberToString = uncurryThis(1.0.toString);
	var pop = uncurryThis([].pop);
	var push = uncurryThis([].push);
	var replace = uncurryThis(''.replace);
	var shift = uncurryThis([].shift);
	var split = uncurryThis(''.split);
	var stringSlice = uncurryThis(''.slice);
	var toLowerCase = uncurryThis(''.toLowerCase);
	var unshift = uncurryThis([].unshift);

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[a-z]/i;
	// eslint-disable-next-line regexp/no-obscure-range -- safe
	var ALPHANUMERIC = /[\d+-.a-z]/i;
	var DIGIT = /\d/;
	var HEX_START = /^0x/i;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\da-f]+$/i;
	/* eslint-disable regexp/no-control-character -- safe */
	var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
	var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
	var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
	var TAB_AND_NEW_LINE = /[\t\n\r]/g;
	/* eslint-enable regexp/no-control-character -- safe */
	var EOF;

	// https://url.spec.whatwg.org/#ipv4-number-parser
	var parseIPv4 = function (input) {
	  var parts = split(input, '.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] === '') {
	    parts.length--;
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part === '') return input;
	    radix = 10;
	    if (part.length > 1 && charAt(part, 0) === '0') {
	      radix = exec(HEX_START, part) ? 16 : 8;
	      part = stringSlice(part, radix === 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!exec(radix === 10 ? DEC : radix === 8 ? OCT : HEX, part)) return input;
	      number = parseInt(part, radix);
	    }
	    push(numbers, number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index === partsLength - 1) {
	      if (number >= pow(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = pop(numbers);
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow(256, 3 - index);
	  }
	  return ipv4;
	};

	// https://url.spec.whatwg.org/#concept-ipv6-parser
	// eslint-disable-next-line max-statements -- TODO
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

	  var chr = function () {
	    return charAt(input, pointer);
	  };

	  if (chr() === ':') {
	    if (charAt(input, 1) !== ':') return;
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (chr()) {
	    if (pieceIndex === 8) return;
	    if (chr() === ':') {
	      if (compress !== null) return;
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && exec(HEX, chr())) {
	      value = value * 16 + parseInt(chr(), 16);
	      pointer++;
	      length++;
	    }
	    if (chr() === '.') {
	      if (length === 0) return;
	      pointer -= length;
	      if (pieceIndex > 6) return;
	      numbersSeen = 0;
	      while (chr()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (chr() === '.' && numbersSeen < 4) pointer++;
	          else return;
	        }
	        if (!exec(DIGIT, chr())) return;
	        while (exec(DIGIT, chr())) {
	          number = parseInt(chr(), 10);
	          if (ipv4Piece === null) ipv4Piece = number;
	          else if (ipv4Piece === 0) return;
	          else ipv4Piece = ipv4Piece * 10 + number;
	          if (ipv4Piece > 255) return;
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen === 2 || numbersSeen === 4) pieceIndex++;
	      }
	      if (numbersSeen !== 4) return;
	      break;
	    } else if (chr() === ':') {
	      pointer++;
	      if (!chr()) return;
	    } else if (chr()) return;
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex !== 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex !== 8) return;
	  return address;
	};

	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = index;
	      ++currLength;
	    }
	  }
	  return currLength > maxLength ? currStart : maxIndex;
	};

	// https://url.spec.whatwg.org/#host-serializing
	var serializeHost = function (host) {
	  var result, index, compress, ignore0;

	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      unshift(result, host % 256);
	      host = floor(host / 256);
	    }
	    return join(result, '.');
	  }

	  // ipv6
	  if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += numberToString(host[index], 16);
	        if (index < 7) result += ':';
	      }
	    }
	    return '[' + result + ']';
	  }

	  return host;
	};

	var C0ControlPercentEncodeSet = {};
	var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
	  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
	});
	var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
	  '#': 1, '?': 1, '{': 1, '}': 1
	});
	var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
	  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
	});

	var percentEncode = function (chr, set) {
	  var code = codeAt(chr, 0);
	  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
	};

	// https://url.spec.whatwg.org/#special-scheme
	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	// https://url.spec.whatwg.org/#windows-drive-letter
	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length === 2 && exec(ALPHA, charAt(string, 0))
	    && ((second = charAt(string, 1)) === ':' || (!normalized && second === '|'));
	};

	// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
	    string.length === 2 ||
	    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
	  );
	};

	// https://url.spec.whatwg.org/#single-dot-path-segment
	var isSingleDot = function (segment) {
	  return segment === '.' || toLowerCase(segment) === '%2e';
	};

	// https://url.spec.whatwg.org/#double-dot-path-segment
	var isDoubleDot = function (segment) {
	  segment = toLowerCase(segment);
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};

	var URLState = function (url, isBase, base) {
	  var urlString = $toString(url);
	  var baseState, failure, searchParams;
	  if (isBase) {
	    failure = this.parse(urlString);
	    if (failure) throw new TypeError(failure);
	    this.searchParams = null;
	  } else {
	    if (base !== undefined) baseState = new URLState(base, true);
	    failure = this.parse(urlString, null, baseState);
	    if (failure) throw new TypeError(failure);
	    searchParams = getInternalSearchParamsState(new URLSearchParams());
	    searchParams.bindURL(this);
	    this.searchParams = searchParams;
	  }
	};

	URLState.prototype = {
	  type: 'URL',
	  // https://url.spec.whatwg.org/#url-parsing
	  // eslint-disable-next-line max-statements -- TODO
	  parse: function (input, stateOverride, base) {
	    var url = this;
	    var state = stateOverride || SCHEME_START;
	    var pointer = 0;
	    var buffer = '';
	    var seenAt = false;
	    var seenBracket = false;
	    var seenPasswordToken = false;
	    var codePoints, chr, bufferCodePoints, failure;

	    input = $toString(input);

	    if (!stateOverride) {
	      url.scheme = '';
	      url.username = '';
	      url.password = '';
	      url.host = null;
	      url.port = null;
	      url.path = [];
	      url.query = null;
	      url.fragment = null;
	      url.cannotBeABaseURL = false;
	      input = replace(input, LEADING_C0_CONTROL_OR_SPACE, '');
	      input = replace(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
	    }

	    input = replace(input, TAB_AND_NEW_LINE, '');

	    codePoints = arrayFrom(input);

	    while (pointer <= codePoints.length) {
	      chr = codePoints[pointer];
	      switch (state) {
	        case SCHEME_START:
	          if (chr && exec(ALPHA, chr)) {
	            buffer += toLowerCase(chr);
	            state = SCHEME;
	          } else if (!stateOverride) {
	            state = NO_SCHEME;
	            continue;
	          } else return INVALID_SCHEME;
	          break;

	        case SCHEME:
	          if (chr && (exec(ALPHANUMERIC, chr) || chr === '+' || chr === '-' || chr === '.')) {
	            buffer += toLowerCase(chr);
	          } else if (chr === ':') {
	            if (stateOverride && (
	              (url.isSpecial() !== hasOwn(specialSchemes, buffer)) ||
	              (buffer === 'file' && (url.includesCredentials() || url.port !== null)) ||
	              (url.scheme === 'file' && !url.host)
	            )) return;
	            url.scheme = buffer;
	            if (stateOverride) {
	              if (url.isSpecial() && specialSchemes[url.scheme] === url.port) url.port = null;
	              return;
	            }
	            buffer = '';
	            if (url.scheme === 'file') {
	              state = FILE;
	            } else if (url.isSpecial() && base && base.scheme === url.scheme) {
	              state = SPECIAL_RELATIVE_OR_AUTHORITY;
	            } else if (url.isSpecial()) {
	              state = SPECIAL_AUTHORITY_SLASHES;
	            } else if (codePoints[pointer + 1] === '/') {
	              state = PATH_OR_AUTHORITY;
	              pointer++;
	            } else {
	              url.cannotBeABaseURL = true;
	              push(url.path, '');
	              state = CANNOT_BE_A_BASE_URL_PATH;
	            }
	          } else if (!stateOverride) {
	            buffer = '';
	            state = NO_SCHEME;
	            pointer = 0;
	            continue;
	          } else return INVALID_SCHEME;
	          break;

	        case NO_SCHEME:
	          if (!base || (base.cannotBeABaseURL && chr !== '#')) return INVALID_SCHEME;
	          if (base.cannotBeABaseURL && chr === '#') {
	            url.scheme = base.scheme;
	            url.path = arraySlice(base.path);
	            url.query = base.query;
	            url.fragment = '';
	            url.cannotBeABaseURL = true;
	            state = FRAGMENT;
	            break;
	          }
	          state = base.scheme === 'file' ? FILE : RELATIVE;
	          continue;

	        case SPECIAL_RELATIVE_OR_AUTHORITY:
	          if (chr === '/' && codePoints[pointer + 1] === '/') {
	            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	            pointer++;
	          } else {
	            state = RELATIVE;
	            continue;
	          } break;

	        case PATH_OR_AUTHORITY:
	          if (chr === '/') {
	            state = AUTHORITY;
	            break;
	          } else {
	            state = PATH;
	            continue;
	          }

	        case RELATIVE:
	          url.scheme = base.scheme;
	          if (chr === EOF) {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.query = base.query;
	          } else if (chr === '/' || (chr === '\\' && url.isSpecial())) {
	            state = RELATIVE_SLASH;
	          } else if (chr === '?') {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.query = '';
	            state = QUERY;
	          } else if (chr === '#') {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.path.length--;
	            state = PATH;
	            continue;
	          } break;

	        case RELATIVE_SLASH:
	          if (url.isSpecial() && (chr === '/' || chr === '\\')) {
	            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          } else if (chr === '/') {
	            state = AUTHORITY;
	          } else {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            state = PATH;
	            continue;
	          } break;

	        case SPECIAL_AUTHORITY_SLASHES:
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          if (chr !== '/' || charAt(buffer, pointer + 1) !== '/') continue;
	          pointer++;
	          break;

	        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	          if (chr !== '/' && chr !== '\\') {
	            state = AUTHORITY;
	            continue;
	          } break;

	        case AUTHORITY:
	          if (chr === '@') {
	            if (seenAt) buffer = '%40' + buffer;
	            seenAt = true;
	            bufferCodePoints = arrayFrom(buffer);
	            for (var i = 0; i < bufferCodePoints.length; i++) {
	              var codePoint = bufferCodePoints[i];
	              if (codePoint === ':' && !seenPasswordToken) {
	                seenPasswordToken = true;
	                continue;
	              }
	              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	              if (seenPasswordToken) url.password += encodedCodePoints;
	              else url.username += encodedCodePoints;
	            }
	            buffer = '';
	          } else if (
	            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
	            (chr === '\\' && url.isSpecial())
	          ) {
	            if (seenAt && buffer === '') return INVALID_AUTHORITY;
	            pointer -= arrayFrom(buffer).length + 1;
	            buffer = '';
	            state = HOST;
	          } else buffer += chr;
	          break;

	        case HOST:
	        case HOSTNAME:
	          if (stateOverride && url.scheme === 'file') {
	            state = FILE_HOST;
	            continue;
	          } else if (chr === ':' && !seenBracket) {
	            if (buffer === '') return INVALID_HOST;
	            failure = url.parseHost(buffer);
	            if (failure) return failure;
	            buffer = '';
	            state = PORT;
	            if (stateOverride === HOSTNAME) return;
	          } else if (
	            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
	            (chr === '\\' && url.isSpecial())
	          ) {
	            if (url.isSpecial() && buffer === '') return INVALID_HOST;
	            if (stateOverride && buffer === '' && (url.includesCredentials() || url.port !== null)) return;
	            failure = url.parseHost(buffer);
	            if (failure) return failure;
	            buffer = '';
	            state = PATH_START;
	            if (stateOverride) return;
	            continue;
	          } else {
	            if (chr === '[') seenBracket = true;
	            else if (chr === ']') seenBracket = false;
	            buffer += chr;
	          } break;

	        case PORT:
	          if (exec(DIGIT, chr)) {
	            buffer += chr;
	          } else if (
	            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
	            (chr === '\\' && url.isSpecial()) ||
	            stateOverride
	          ) {
	            if (buffer !== '') {
	              var port = parseInt(buffer, 10);
	              if (port > 0xFFFF) return INVALID_PORT;
	              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
	              buffer = '';
	            }
	            if (stateOverride) return;
	            state = PATH_START;
	            continue;
	          } else return INVALID_PORT;
	          break;

	        case FILE:
	          url.scheme = 'file';
	          if (chr === '/' || chr === '\\') state = FILE_SLASH;
	          else if (base && base.scheme === 'file') {
	            switch (chr) {
	              case EOF:
	                url.host = base.host;
	                url.path = arraySlice(base.path);
	                url.query = base.query;
	                break;
	              case '?':
	                url.host = base.host;
	                url.path = arraySlice(base.path);
	                url.query = '';
	                state = QUERY;
	                break;
	              case '#':
	                url.host = base.host;
	                url.path = arraySlice(base.path);
	                url.query = base.query;
	                url.fragment = '';
	                state = FRAGMENT;
	                break;
	              default:
	                if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
	                  url.host = base.host;
	                  url.path = arraySlice(base.path);
	                  url.shortenPath();
	                }
	                state = PATH;
	                continue;
	            }
	          } else {
	            state = PATH;
	            continue;
	          } break;

	        case FILE_SLASH:
	          if (chr === '/' || chr === '\\') {
	            state = FILE_HOST;
	            break;
	          }
	          if (base && base.scheme === 'file' && !startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
	            if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
	            else url.host = base.host;
	          }
	          state = PATH;
	          continue;

	        case FILE_HOST:
	          if (chr === EOF || chr === '/' || chr === '\\' || chr === '?' || chr === '#') {
	            if (!stateOverride && isWindowsDriveLetter(buffer)) {
	              state = PATH;
	            } else if (buffer === '') {
	              url.host = '';
	              if (stateOverride) return;
	              state = PATH_START;
	            } else {
	              failure = url.parseHost(buffer);
	              if (failure) return failure;
	              if (url.host === 'localhost') url.host = '';
	              if (stateOverride) return;
	              buffer = '';
	              state = PATH_START;
	            } continue;
	          } else buffer += chr;
	          break;

	        case PATH_START:
	          if (url.isSpecial()) {
	            state = PATH;
	            if (chr !== '/' && chr !== '\\') continue;
	          } else if (!stateOverride && chr === '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (!stateOverride && chr === '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr !== EOF) {
	            state = PATH;
	            if (chr !== '/') continue;
	          } break;

	        case PATH:
	          if (
	            chr === EOF || chr === '/' ||
	            (chr === '\\' && url.isSpecial()) ||
	            (!stateOverride && (chr === '?' || chr === '#'))
	          ) {
	            if (isDoubleDot(buffer)) {
	              url.shortenPath();
	              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
	                push(url.path, '');
	              }
	            } else if (isSingleDot(buffer)) {
	              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
	                push(url.path, '');
	              }
	            } else {
	              if (url.scheme === 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	                if (url.host) url.host = '';
	                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
	              }
	              push(url.path, buffer);
	            }
	            buffer = '';
	            if (url.scheme === 'file' && (chr === EOF || chr === '?' || chr === '#')) {
	              while (url.path.length > 1 && url.path[0] === '') {
	                shift(url.path);
	              }
	            }
	            if (chr === '?') {
	              url.query = '';
	              state = QUERY;
	            } else if (chr === '#') {
	              url.fragment = '';
	              state = FRAGMENT;
	            }
	          } else {
	            buffer += percentEncode(chr, pathPercentEncodeSet);
	          } break;

	        case CANNOT_BE_A_BASE_URL_PATH:
	          if (chr === '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (chr === '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr !== EOF) {
	            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
	          } break;

	        case QUERY:
	          if (!stateOverride && chr === '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr !== EOF) {
	            if (chr === "'" && url.isSpecial()) url.query += '%27';
	            else if (chr === '#') url.query += '%23';
	            else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
	          } break;

	        case FRAGMENT:
	          if (chr !== EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
	          break;
	      }

	      pointer++;
	    }
	  },
	  // https://url.spec.whatwg.org/#host-parsing
	  parseHost: function (input) {
	    var result, codePoints, index;
	    if (charAt(input, 0) === '[') {
	      if (charAt(input, input.length - 1) !== ']') return INVALID_HOST;
	      result = parseIPv6(stringSlice(input, 1, -1));
	      if (!result) return INVALID_HOST;
	      this.host = result;
	    // opaque host
	    } else if (!this.isSpecial()) {
	      if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
	      result = '';
	      codePoints = arrayFrom(input);
	      for (index = 0; index < codePoints.length; index++) {
	        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	      }
	      this.host = result;
	    } else {
	      input = toASCII(input);
	      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
	      result = parseIPv4(input);
	      if (result === null) return INVALID_HOST;
	      this.host = result;
	    }
	  },
	  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
	  cannotHaveUsernamePasswordPort: function () {
	    return !this.host || this.cannotBeABaseURL || this.scheme === 'file';
	  },
	  // https://url.spec.whatwg.org/#include-credentials
	  includesCredentials: function () {
	    return this.username !== '' || this.password !== '';
	  },
	  // https://url.spec.whatwg.org/#is-special
	  isSpecial: function () {
	    return hasOwn(specialSchemes, this.scheme);
	  },
	  // https://url.spec.whatwg.org/#shorten-a-urls-path
	  shortenPath: function () {
	    var path = this.path;
	    var pathSize = path.length;
	    if (pathSize && (this.scheme !== 'file' || pathSize !== 1 || !isWindowsDriveLetter(path[0], true))) {
	      path.length--;
	    }
	  },
	  // https://url.spec.whatwg.org/#concept-url-serializer
	  serialize: function () {
	    var url = this;
	    var scheme = url.scheme;
	    var username = url.username;
	    var password = url.password;
	    var host = url.host;
	    var port = url.port;
	    var path = url.path;
	    var query = url.query;
	    var fragment = url.fragment;
	    var output = scheme + ':';
	    if (host !== null) {
	      output += '//';
	      if (url.includesCredentials()) {
	        output += username + (password ? ':' + password : '') + '@';
	      }
	      output += serializeHost(host);
	      if (port !== null) output += ':' + port;
	    } else if (scheme === 'file') output += '//';
	    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
	    if (query !== null) output += '?' + query;
	    if (fragment !== null) output += '#' + fragment;
	    return output;
	  },
	  // https://url.spec.whatwg.org/#dom-url-href
	  setHref: function (href) {
	    var failure = this.parse(href);
	    if (failure) throw new TypeError(failure);
	    this.searchParams.update();
	  },
	  // https://url.spec.whatwg.org/#dom-url-origin
	  getOrigin: function () {
	    var scheme = this.scheme;
	    var port = this.port;
	    if (scheme === 'blob') try {
	      return new URLConstructor(scheme.path[0]).origin;
	    } catch (error) {
	      return 'null';
	    }
	    if (scheme === 'file' || !this.isSpecial()) return 'null';
	    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
	  },
	  // https://url.spec.whatwg.org/#dom-url-protocol
	  getProtocol: function () {
	    return this.scheme + ':';
	  },
	  setProtocol: function (protocol) {
	    this.parse($toString(protocol) + ':', SCHEME_START);
	  },
	  // https://url.spec.whatwg.org/#dom-url-username
	  getUsername: function () {
	    return this.username;
	  },
	  setUsername: function (username) {
	    var codePoints = arrayFrom($toString(username));
	    if (this.cannotHaveUsernamePasswordPort()) return;
	    this.username = '';
	    for (var i = 0; i < codePoints.length; i++) {
	      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	    }
	  },
	  // https://url.spec.whatwg.org/#dom-url-password
	  getPassword: function () {
	    return this.password;
	  },
	  setPassword: function (password) {
	    var codePoints = arrayFrom($toString(password));
	    if (this.cannotHaveUsernamePasswordPort()) return;
	    this.password = '';
	    for (var i = 0; i < codePoints.length; i++) {
	      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	    }
	  },
	  // https://url.spec.whatwg.org/#dom-url-host
	  getHost: function () {
	    var host = this.host;
	    var port = this.port;
	    return host === null ? ''
	      : port === null ? serializeHost(host)
	      : serializeHost(host) + ':' + port;
	  },
	  setHost: function (host) {
	    if (this.cannotBeABaseURL) return;
	    this.parse(host, HOST);
	  },
	  // https://url.spec.whatwg.org/#dom-url-hostname
	  getHostname: function () {
	    var host = this.host;
	    return host === null ? '' : serializeHost(host);
	  },
	  setHostname: function (hostname) {
	    if (this.cannotBeABaseURL) return;
	    this.parse(hostname, HOSTNAME);
	  },
	  // https://url.spec.whatwg.org/#dom-url-port
	  getPort: function () {
	    var port = this.port;
	    return port === null ? '' : $toString(port);
	  },
	  setPort: function (port) {
	    if (this.cannotHaveUsernamePasswordPort()) return;
	    port = $toString(port);
	    if (port === '') this.port = null;
	    else this.parse(port, PORT);
	  },
	  // https://url.spec.whatwg.org/#dom-url-pathname
	  getPathname: function () {
	    var path = this.path;
	    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
	  },
	  setPathname: function (pathname) {
	    if (this.cannotBeABaseURL) return;
	    this.path = [];
	    this.parse(pathname, PATH_START);
	  },
	  // https://url.spec.whatwg.org/#dom-url-search
	  getSearch: function () {
	    var query = this.query;
	    return query ? '?' + query : '';
	  },
	  setSearch: function (search) {
	    search = $toString(search);
	    if (search === '') {
	      this.query = null;
	    } else {
	      if (charAt(search, 0) === '?') search = stringSlice(search, 1);
	      this.query = '';
	      this.parse(search, QUERY);
	    }
	    this.searchParams.update();
	  },
	  // https://url.spec.whatwg.org/#dom-url-searchparams
	  getSearchParams: function () {
	    return this.searchParams.facade;
	  },
	  // https://url.spec.whatwg.org/#dom-url-hash
	  getHash: function () {
	    var fragment = this.fragment;
	    return fragment ? '#' + fragment : '';
	  },
	  setHash: function (hash) {
	    hash = $toString(hash);
	    if (hash === '') {
	      this.fragment = null;
	      return;
	    }
	    if (charAt(hash, 0) === '#') hash = stringSlice(hash, 1);
	    this.fragment = '';
	    this.parse(hash, FRAGMENT);
	  },
	  update: function () {
	    this.query = this.searchParams.serialize() || null;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLPrototype);
	  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
	  var state = setInternalState(that, new URLState(url, false, base));
	  if (!DESCRIPTORS) {
	    that.href = state.serialize();
	    that.origin = state.getOrigin();
	    that.protocol = state.getProtocol();
	    that.username = state.getUsername();
	    that.password = state.getPassword();
	    that.host = state.getHost();
	    that.hostname = state.getHostname();
	    that.port = state.getPort();
	    that.pathname = state.getPathname();
	    that.search = state.getSearch();
	    that.searchParams = state.getSearchParams();
	    that.hash = state.getHash();
	  }
	};

	var URLPrototype = URLConstructor.prototype;

	var accessorDescriptor = function (getter, setter) {
	  return {
	    get: function () {
	      return getInternalURLState(this)[getter]();
	    },
	    set: setter && function (value) {
	      return getInternalURLState(this)[setter](value);
	    },
	    configurable: true,
	    enumerable: true
	  };
	};

	if (DESCRIPTORS) {
	  // `URL.prototype.href` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-href
	  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
	  // `URL.prototype.origin` getter
	  // https://url.spec.whatwg.org/#dom-url-origin
	  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
	  // `URL.prototype.protocol` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-protocol
	  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
	  // `URL.prototype.username` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-username
	  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
	  // `URL.prototype.password` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-password
	  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
	  // `URL.prototype.host` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-host
	  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
	  // `URL.prototype.hostname` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-hostname
	  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
	  // `URL.prototype.port` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-port
	  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
	  // `URL.prototype.pathname` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-pathname
	  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
	  // `URL.prototype.search` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-search
	  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
	  // `URL.prototype.searchParams` getter
	  // https://url.spec.whatwg.org/#dom-url-searchparams
	  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
	  // `URL.prototype.hash` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-hash
	  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
	  return getInternalURLState(this).serialize();
	}, { enumerable: true });

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	defineBuiltIn(URLPrototype, 'toString', function toString() {
	  return getInternalURLState(this).serialize();
	}, { enumerable: true });

	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
	}

	setToStringTag(URLConstructor, 'URL');

	$({ global: true, constructor: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
	  URL: URLConstructor
	});
	return web_url_constructor;
}

var hasRequiredWeb_url;

function requireWeb_url () {
	if (hasRequiredWeb_url) return web_url;
	hasRequiredWeb_url = 1;
	// TODO: Remove this module from `core-js@4` since it's replaced to module below
	requireWeb_url_constructor();
	return web_url;
}

var web_url_canParse = {};

var hasRequiredWeb_url_canParse;

function requireWeb_url_canParse () {
	if (hasRequiredWeb_url_canParse) return web_url_canParse;
	hasRequiredWeb_url_canParse = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var validateArgumentsLength = /*@__PURE__*/ requireValidateArgumentsLength();
	var toString = /*@__PURE__*/ requireToString$1();
	var USE_NATIVE_URL = /*@__PURE__*/ requireUrlConstructorDetection();

	var URL = getBuiltIn('URL');

	// https://github.com/nodejs/node/issues/47505
	// https://github.com/denoland/deno/issues/18893
	var THROWS_WITHOUT_ARGUMENTS = USE_NATIVE_URL && fails(function () {
	  URL.canParse();
	});

	// Bun ~ 1.0.30 bug
	// https://github.com/oven-sh/bun/issues/9250
	var WRONG_ARITY = fails(function () {
	  return URL.canParse.length !== 1;
	});

	// `URL.canParse` method
	// https://url.spec.whatwg.org/#dom-url-canparse
	$({ target: 'URL', stat: true, forced: !THROWS_WITHOUT_ARGUMENTS || WRONG_ARITY }, {
	  canParse: function canParse(url) {
	    var length = validateArgumentsLength(arguments.length, 1);
	    var urlString = toString(url);
	    var base = length < 2 || arguments[1] === undefined ? undefined : toString(arguments[1]);
	    try {
	      return !!new URL(urlString, base);
	    } catch (error) {
	      return false;
	    }
	  }
	});
	return web_url_canParse;
}

var web_url_parse = {};

var hasRequiredWeb_url_parse;

function requireWeb_url_parse () {
	if (hasRequiredWeb_url_parse) return web_url_parse;
	hasRequiredWeb_url_parse = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var validateArgumentsLength = /*@__PURE__*/ requireValidateArgumentsLength();
	var toString = /*@__PURE__*/ requireToString$1();
	var USE_NATIVE_URL = /*@__PURE__*/ requireUrlConstructorDetection();

	var URL = getBuiltIn('URL');

	// `URL.parse` method
	// https://url.spec.whatwg.org/#dom-url-canparse
	$({ target: 'URL', stat: true, forced: !USE_NATIVE_URL }, {
	  parse: function parse(url) {
	    var length = validateArgumentsLength(arguments.length, 1);
	    var urlString = toString(url);
	    var base = length < 2 || arguments[1] === undefined ? undefined : toString(arguments[1]);
	    try {
	      return new URL(urlString, base);
	    } catch (error) {
	      return null;
	    }
	  }
	});
	return web_url_parse;
}

var url$2;
var hasRequiredUrl$2;

function requireUrl$2 () {
	if (hasRequiredUrl$2) return url$2;
	hasRequiredUrl$2 = 1;
	requireWeb_url();
	requireWeb_url_canParse();
	requireWeb_url_parse();
	var path = /*@__PURE__*/ requirePath();

	url$2 = path.URL;
	return url$2;
}

var url$1;
var hasRequiredUrl$1;

function requireUrl$1 () {
	if (hasRequiredUrl$1) return url$1;
	hasRequiredUrl$1 = 1;
	var parent = /*@__PURE__*/ requireUrl$2();

	url$1 = parent;
	return url$1;
}

var url;
var hasRequiredUrl;

function requireUrl () {
	if (hasRequiredUrl) return url;
	hasRequiredUrl = 1;
	url = /*@__PURE__*/ requireUrl$1();
	return url;
}

var urlExports = requireUrl();
var _URL = /*@__PURE__*/getDefaultExportFromCjs(urlExports);

var es_string_startsWith = {};

var isRegexp;
var hasRequiredIsRegexp;

function requireIsRegexp () {
	if (hasRequiredIsRegexp) return isRegexp;
	hasRequiredIsRegexp = 1;
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var classof = /*@__PURE__*/ requireClassofRaw$1();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
	};
	return isRegexp;
}

var notARegexp;
var hasRequiredNotARegexp;

function requireNotARegexp () {
	if (hasRequiredNotARegexp) return notARegexp;
	hasRequiredNotARegexp = 1;
	var isRegExp = /*@__PURE__*/ requireIsRegexp();

	var $TypeError = TypeError;

	notARegexp = function (it) {
	  if (isRegExp(it)) {
	    throw new $TypeError("The method doesn't accept regular expressions");
	  } return it;
	};
	return notARegexp;
}

var correctIsRegexpLogic;
var hasRequiredCorrectIsRegexpLogic;

function requireCorrectIsRegexpLogic () {
	if (hasRequiredCorrectIsRegexpLogic) return correctIsRegexpLogic;
	hasRequiredCorrectIsRegexpLogic = 1;
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();

	var MATCH = wellKnownSymbol('match');

	correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};
	return correctIsRegexpLogic;
}

var hasRequiredEs_string_startsWith;

function requireEs_string_startsWith () {
	if (hasRequiredEs_string_startsWith) return es_string_startsWith;
	hasRequiredEs_string_startsWith = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThisClause();
	var getOwnPropertyDescriptor =  requireObjectGetOwnPropertyDescriptor$1().f;
	var toLength = /*@__PURE__*/ requireToLength$1();
	var toString = /*@__PURE__*/ requireToString$1();
	var notARegExp = /*@__PURE__*/ requireNotARegexp();
	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible$1();
	var correctIsRegExpLogic = /*@__PURE__*/ requireCorrectIsRegexpLogic();
	var IS_PURE = /*@__PURE__*/ requireIsPure$1();

	var stringSlice = uncurryThis(''.slice);
	var min = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.startswith
	$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = toString(requireObjectCoercible(this));
	    notARegExp(searchString);
	    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = toString(searchString);
	    return stringSlice(that, index, index + search.length) === search;
	  }
	});
	return es_string_startsWith;
}

var getBuiltInPrototypeMethod;
var hasRequiredGetBuiltInPrototypeMethod;

function requireGetBuiltInPrototypeMethod () {
	if (hasRequiredGetBuiltInPrototypeMethod) return getBuiltInPrototypeMethod;
	hasRequiredGetBuiltInPrototypeMethod = 1;
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var path = /*@__PURE__*/ requirePath();

	getBuiltInPrototypeMethod = function (CONSTRUCTOR, METHOD) {
	  var Namespace = path[CONSTRUCTOR + 'Prototype'];
	  var pureMethod = Namespace && Namespace[METHOD];
	  if (pureMethod) return pureMethod;
	  var NativeConstructor = globalThis[CONSTRUCTOR];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  return NativePrototype && NativePrototype[METHOD];
	};
	return getBuiltInPrototypeMethod;
}

var startsWith$3;
var hasRequiredStartsWith$3;

function requireStartsWith$3 () {
	if (hasRequiredStartsWith$3) return startsWith$3;
	hasRequiredStartsWith$3 = 1;
	requireEs_string_startsWith();
	var getBuiltInPrototypeMethod = /*@__PURE__*/ requireGetBuiltInPrototypeMethod();

	startsWith$3 = getBuiltInPrototypeMethod('String', 'startsWith');
	return startsWith$3;
}

var startsWith$2;
var hasRequiredStartsWith$2;

function requireStartsWith$2 () {
	if (hasRequiredStartsWith$2) return startsWith$2;
	hasRequiredStartsWith$2 = 1;
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var method = /*@__PURE__*/ requireStartsWith$3();

	var StringPrototype = String.prototype;

	startsWith$2 = function (it) {
	  var own = it.startsWith;
	  return typeof it == 'string' || it === StringPrototype
	    || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.startsWith) ? method : own;
	};
	return startsWith$2;
}

var startsWith$1;
var hasRequiredStartsWith$1;

function requireStartsWith$1 () {
	if (hasRequiredStartsWith$1) return startsWith$1;
	hasRequiredStartsWith$1 = 1;
	var parent = /*@__PURE__*/ requireStartsWith$2();

	startsWith$1 = parent;
	return startsWith$1;
}

var startsWith;
var hasRequiredStartsWith;

function requireStartsWith () {
	if (hasRequiredStartsWith) return startsWith;
	hasRequiredStartsWith = 1;
	startsWith = /*@__PURE__*/ requireStartsWith$1();
	return startsWith;
}

var startsWithExports = requireStartsWith();
var _startsWithInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(startsWithExports);

var es_object_keys = {};

var hasRequiredEs_object_keys;

function requireEs_object_keys () {
	if (hasRequiredEs_object_keys) return es_object_keys;
	hasRequiredEs_object_keys = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var toObject = /*@__PURE__*/ requireToObject$1();
	var nativeKeys = /*@__PURE__*/ requireObjectKeys$1();
	var fails = /*@__PURE__*/ requireFails$1();

	var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return nativeKeys(toObject(it));
	  }
	});
	return es_object_keys;
}

var keys$2;
var hasRequiredKeys$2;

function requireKeys$2 () {
	if (hasRequiredKeys$2) return keys$2;
	hasRequiredKeys$2 = 1;
	requireEs_object_keys();
	var path = /*@__PURE__*/ requirePath();

	keys$2 = path.Object.keys;
	return keys$2;
}

var keys$1;
var hasRequiredKeys$1;

function requireKeys$1 () {
	if (hasRequiredKeys$1) return keys$1;
	hasRequiredKeys$1 = 1;
	var parent = /*@__PURE__*/ requireKeys$2();

	keys$1 = parent;
	return keys$1;
}

var keys;
var hasRequiredKeys;

function requireKeys () {
	if (hasRequiredKeys) return keys;
	hasRequiredKeys = 1;
	keys = /*@__PURE__*/ requireKeys$1();
	return keys;
}

var keysExports = requireKeys();
var _Object$keys = /*@__PURE__*/getDefaultExportFromCjs(keysExports);

var getOwnPropertySymbols$5;
var hasRequiredGetOwnPropertySymbols$5;

function requireGetOwnPropertySymbols$5 () {
	if (hasRequiredGetOwnPropertySymbols$5) return getOwnPropertySymbols$5;
	hasRequiredGetOwnPropertySymbols$5 = 1;
	requireEs_symbol();
	var path = /*@__PURE__*/ requirePath();

	getOwnPropertySymbols$5 = path.Object.getOwnPropertySymbols;
	return getOwnPropertySymbols$5;
}

var getOwnPropertySymbols$4;
var hasRequiredGetOwnPropertySymbols$4;

function requireGetOwnPropertySymbols$4 () {
	if (hasRequiredGetOwnPropertySymbols$4) return getOwnPropertySymbols$4;
	hasRequiredGetOwnPropertySymbols$4 = 1;
	var parent = /*@__PURE__*/ requireGetOwnPropertySymbols$5();

	getOwnPropertySymbols$4 = parent;
	return getOwnPropertySymbols$4;
}

var getOwnPropertySymbols$3;
var hasRequiredGetOwnPropertySymbols$3;

function requireGetOwnPropertySymbols$3 () {
	if (hasRequiredGetOwnPropertySymbols$3) return getOwnPropertySymbols$3;
	hasRequiredGetOwnPropertySymbols$3 = 1;
	getOwnPropertySymbols$3 = /*@__PURE__*/ requireGetOwnPropertySymbols$4();
	return getOwnPropertySymbols$3;
}

var getOwnPropertySymbolsExports$1 = requireGetOwnPropertySymbols$3();
var _Object$getOwnPropertySymbols$1 = /*@__PURE__*/getDefaultExportFromCjs(getOwnPropertySymbolsExports$1);

var es_array_filter = {};

var hasRequiredEs_array_filter;

function requireEs_array_filter () {
	if (hasRequiredEs_array_filter) return es_array_filter;
	hasRequiredEs_array_filter = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var $filter =  requireArrayIteration().filter;
	var arrayMethodHasSpeciesSupport = /*@__PURE__*/ requireArrayMethodHasSpeciesSupport();

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	return es_array_filter;
}

var filter$3;
var hasRequiredFilter$3;

function requireFilter$3 () {
	if (hasRequiredFilter$3) return filter$3;
	hasRequiredFilter$3 = 1;
	requireEs_array_filter();
	var getBuiltInPrototypeMethod = /*@__PURE__*/ requireGetBuiltInPrototypeMethod();

	filter$3 = getBuiltInPrototypeMethod('Array', 'filter');
	return filter$3;
}

var filter$2;
var hasRequiredFilter$2;

function requireFilter$2 () {
	if (hasRequiredFilter$2) return filter$2;
	hasRequiredFilter$2 = 1;
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var method = /*@__PURE__*/ requireFilter$3();

	var ArrayPrototype = Array.prototype;

	filter$2 = function (it) {
	  var own = it.filter;
	  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.filter) ? method : own;
	};
	return filter$2;
}

var filter$1;
var hasRequiredFilter$1;

function requireFilter$1 () {
	if (hasRequiredFilter$1) return filter$1;
	hasRequiredFilter$1 = 1;
	var parent = /*@__PURE__*/ requireFilter$2();

	filter$1 = parent;
	return filter$1;
}

var filter;
var hasRequiredFilter;

function requireFilter () {
	if (hasRequiredFilter) return filter;
	hasRequiredFilter = 1;
	filter = /*@__PURE__*/ requireFilter$1();
	return filter;
}

var filterExports = requireFilter();
var _filterInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(filterExports);

var getOwnPropertyDescriptor$2 = {exports: {}};

var es_object_getOwnPropertyDescriptor = {};

var hasRequiredEs_object_getOwnPropertyDescriptor;

function requireEs_object_getOwnPropertyDescriptor () {
	if (hasRequiredEs_object_getOwnPropertyDescriptor) return es_object_getOwnPropertyDescriptor;
	hasRequiredEs_object_getOwnPropertyDescriptor = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var nativeGetOwnPropertyDescriptor =  requireObjectGetOwnPropertyDescriptor$1().f;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();

	var FORCED = !DESCRIPTORS || fails(function () { nativeGetOwnPropertyDescriptor(1); });

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
	  }
	});
	return es_object_getOwnPropertyDescriptor;
}

var hasRequiredGetOwnPropertyDescriptor$2;

function requireGetOwnPropertyDescriptor$2 () {
	if (hasRequiredGetOwnPropertyDescriptor$2) return getOwnPropertyDescriptor$2.exports;
	hasRequiredGetOwnPropertyDescriptor$2 = 1;
	requireEs_object_getOwnPropertyDescriptor();
	var path = /*@__PURE__*/ requirePath();

	var Object = path.Object;

	var getOwnPropertyDescriptor = getOwnPropertyDescriptor$2.exports = function getOwnPropertyDescriptor(it, key) {
	  return Object.getOwnPropertyDescriptor(it, key);
	};

	if (Object.getOwnPropertyDescriptor.sham) getOwnPropertyDescriptor.sham = true;
	return getOwnPropertyDescriptor$2.exports;
}

var getOwnPropertyDescriptor$1;
var hasRequiredGetOwnPropertyDescriptor$1;

function requireGetOwnPropertyDescriptor$1 () {
	if (hasRequiredGetOwnPropertyDescriptor$1) return getOwnPropertyDescriptor$1;
	hasRequiredGetOwnPropertyDescriptor$1 = 1;
	var parent = /*@__PURE__*/ requireGetOwnPropertyDescriptor$2();

	getOwnPropertyDescriptor$1 = parent;
	return getOwnPropertyDescriptor$1;
}

var getOwnPropertyDescriptor;
var hasRequiredGetOwnPropertyDescriptor;

function requireGetOwnPropertyDescriptor () {
	if (hasRequiredGetOwnPropertyDescriptor) return getOwnPropertyDescriptor;
	hasRequiredGetOwnPropertyDescriptor = 1;
	getOwnPropertyDescriptor = /*@__PURE__*/ requireGetOwnPropertyDescriptor$1();
	return getOwnPropertyDescriptor;
}

var getOwnPropertyDescriptorExports = requireGetOwnPropertyDescriptor();
var _Object$getOwnPropertyDescriptor = /*@__PURE__*/getDefaultExportFromCjs(getOwnPropertyDescriptorExports);

var es_array_forEach = {};

var arrayMethodIsStrict;
var hasRequiredArrayMethodIsStrict;

function requireArrayMethodIsStrict () {
	if (hasRequiredArrayMethodIsStrict) return arrayMethodIsStrict;
	hasRequiredArrayMethodIsStrict = 1;
	var fails = /*@__PURE__*/ requireFails$1();

	arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () { return 1; }, 1);
	  });
	};
	return arrayMethodIsStrict;
}

var arrayForEach;
var hasRequiredArrayForEach;

function requireArrayForEach () {
	if (hasRequiredArrayForEach) return arrayForEach;
	hasRequiredArrayForEach = 1;
	var $forEach =  requireArrayIteration().forEach;
	var arrayMethodIsStrict = /*@__PURE__*/ requireArrayMethodIsStrict();

	var STRICT_METHOD = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;
	return arrayForEach;
}

var hasRequiredEs_array_forEach;

function requireEs_array_forEach () {
	if (hasRequiredEs_array_forEach) return es_array_forEach;
	hasRequiredEs_array_forEach = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var forEach = /*@__PURE__*/ requireArrayForEach();

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	$({ target: 'Array', proto: true, forced: [].forEach !== forEach }, {
	  forEach: forEach
	});
	return es_array_forEach;
}

var forEach$3;
var hasRequiredForEach$3;

function requireForEach$3 () {
	if (hasRequiredForEach$3) return forEach$3;
	hasRequiredForEach$3 = 1;
	requireEs_array_forEach();
	var getBuiltInPrototypeMethod = /*@__PURE__*/ requireGetBuiltInPrototypeMethod();

	forEach$3 = getBuiltInPrototypeMethod('Array', 'forEach');
	return forEach$3;
}

var forEach$2;
var hasRequiredForEach$2;

function requireForEach$2 () {
	if (hasRequiredForEach$2) return forEach$2;
	hasRequiredForEach$2 = 1;
	var parent = /*@__PURE__*/ requireForEach$3();

	forEach$2 = parent;
	return forEach$2;
}

var forEach$1;
var hasRequiredForEach$1;

function requireForEach$1 () {
	if (hasRequiredForEach$1) return forEach$1;
	hasRequiredForEach$1 = 1;
	var classof = /*@__PURE__*/ requireClassof$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var method = /*@__PURE__*/ requireForEach$2();

	var ArrayPrototype = Array.prototype;

	var DOMIterables = {
	  DOMTokenList: true,
	  NodeList: true
	};

	forEach$1 = function (it) {
	  var own = it.forEach;
	  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.forEach)
	    || hasOwn(DOMIterables, classof(it)) ? method : own;
	};
	return forEach$1;
}

var forEach;
var hasRequiredForEach;

function requireForEach () {
	if (hasRequiredForEach) return forEach;
	hasRequiredForEach = 1;
	forEach = /*@__PURE__*/ requireForEach$1();
	return forEach;
}

var forEachExports = requireForEach();
var _forEachInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(forEachExports);

var es_object_getOwnPropertyDescriptors = {};

var ownKeys$5;
var hasRequiredOwnKeys$1;

function requireOwnKeys$1 () {
	if (hasRequiredOwnKeys$1) return ownKeys$5;
	hasRequiredOwnKeys$1 = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var getOwnPropertyNamesModule = /*@__PURE__*/ requireObjectGetOwnPropertyNames$1();
	var getOwnPropertySymbolsModule = /*@__PURE__*/ requireObjectGetOwnPropertySymbols$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();

	var concat = uncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	ownKeys$5 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};
	return ownKeys$5;
}

var hasRequiredEs_object_getOwnPropertyDescriptors;

function requireEs_object_getOwnPropertyDescriptors () {
	if (hasRequiredEs_object_getOwnPropertyDescriptors) return es_object_getOwnPropertyDescriptors;
	hasRequiredEs_object_getOwnPropertyDescriptors = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var ownKeys = /*@__PURE__*/ requireOwnKeys$1();
	var toIndexedObject = /*@__PURE__*/ requireToIndexedObject$1();
	var getOwnPropertyDescriptorModule = /*@__PURE__*/ requireObjectGetOwnPropertyDescriptor$1();
	var createProperty = /*@__PURE__*/ requireCreateProperty();

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject(object);
	    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	    var keys = ownKeys(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty(result, key, descriptor);
	    }
	    return result;
	  }
	});
	return es_object_getOwnPropertyDescriptors;
}

var getOwnPropertyDescriptors$2;
var hasRequiredGetOwnPropertyDescriptors$2;

function requireGetOwnPropertyDescriptors$2 () {
	if (hasRequiredGetOwnPropertyDescriptors$2) return getOwnPropertyDescriptors$2;
	hasRequiredGetOwnPropertyDescriptors$2 = 1;
	requireEs_object_getOwnPropertyDescriptors();
	var path = /*@__PURE__*/ requirePath();

	getOwnPropertyDescriptors$2 = path.Object.getOwnPropertyDescriptors;
	return getOwnPropertyDescriptors$2;
}

var getOwnPropertyDescriptors$1;
var hasRequiredGetOwnPropertyDescriptors$1;

function requireGetOwnPropertyDescriptors$1 () {
	if (hasRequiredGetOwnPropertyDescriptors$1) return getOwnPropertyDescriptors$1;
	hasRequiredGetOwnPropertyDescriptors$1 = 1;
	var parent = /*@__PURE__*/ requireGetOwnPropertyDescriptors$2();

	getOwnPropertyDescriptors$1 = parent;
	return getOwnPropertyDescriptors$1;
}

var getOwnPropertyDescriptors;
var hasRequiredGetOwnPropertyDescriptors;

function requireGetOwnPropertyDescriptors () {
	if (hasRequiredGetOwnPropertyDescriptors) return getOwnPropertyDescriptors;
	hasRequiredGetOwnPropertyDescriptors = 1;
	getOwnPropertyDescriptors = /*@__PURE__*/ requireGetOwnPropertyDescriptors$1();
	return getOwnPropertyDescriptors;
}

var getOwnPropertyDescriptorsExports = requireGetOwnPropertyDescriptors();
var _Object$getOwnPropertyDescriptors = /*@__PURE__*/getDefaultExportFromCjs(getOwnPropertyDescriptorsExports);

var defineProperties$2 = {exports: {}};

var es_object_defineProperties = {};

var hasRequiredEs_object_defineProperties;

function requireEs_object_defineProperties () {
	if (hasRequiredEs_object_defineProperties) return es_object_defineProperties;
	hasRequiredEs_object_defineProperties = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var defineProperties =  requireObjectDefineProperties$1().f;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	$({ target: 'Object', stat: true, forced: Object.defineProperties !== defineProperties, sham: !DESCRIPTORS }, {
	  defineProperties: defineProperties
	});
	return es_object_defineProperties;
}

var hasRequiredDefineProperties$2;

function requireDefineProperties$2 () {
	if (hasRequiredDefineProperties$2) return defineProperties$2.exports;
	hasRequiredDefineProperties$2 = 1;
	requireEs_object_defineProperties();
	var path = /*@__PURE__*/ requirePath();

	var Object = path.Object;

	var defineProperties = defineProperties$2.exports = function defineProperties(T, D) {
	  return Object.defineProperties(T, D);
	};

	if (Object.defineProperties.sham) defineProperties.sham = true;
	return defineProperties$2.exports;
}

var defineProperties$1;
var hasRequiredDefineProperties$1;

function requireDefineProperties$1 () {
	if (hasRequiredDefineProperties$1) return defineProperties$1;
	hasRequiredDefineProperties$1 = 1;
	var parent = /*@__PURE__*/ requireDefineProperties$2();

	defineProperties$1 = parent;
	return defineProperties$1;
}

var defineProperties;
var hasRequiredDefineProperties;

function requireDefineProperties () {
	if (hasRequiredDefineProperties) return defineProperties;
	hasRequiredDefineProperties = 1;
	defineProperties = /*@__PURE__*/ requireDefineProperties$1();
	return defineProperties;
}

var definePropertiesExports = requireDefineProperties();
var _Object$defineProperties = /*@__PURE__*/getDefaultExportFromCjs(definePropertiesExports);

var defineProperty;
var hasRequiredDefineProperty;

function requireDefineProperty () {
	if (hasRequiredDefineProperty) return defineProperty;
	hasRequiredDefineProperty = 1;
	defineProperty = /*@__PURE__*/ requireDefineProperty$4();
	return defineProperty;
}

var definePropertyExports = requireDefineProperty();
var _Object$defineProperty = /*@__PURE__*/getDefaultExportFromCjs(definePropertyExports);

var getOwnPropertySymbols$2;
var hasRequiredGetOwnPropertySymbols$2;

function requireGetOwnPropertySymbols$2 () {
	if (hasRequiredGetOwnPropertySymbols$2) return getOwnPropertySymbols$2;
	hasRequiredGetOwnPropertySymbols$2 = 1;
	var parent = /*@__PURE__*/ requireGetOwnPropertySymbols$4();

	getOwnPropertySymbols$2 = parent;
	return getOwnPropertySymbols$2;
}

var getOwnPropertySymbols$1;
var hasRequiredGetOwnPropertySymbols$1;

function requireGetOwnPropertySymbols$1 () {
	if (hasRequiredGetOwnPropertySymbols$1) return getOwnPropertySymbols$1;
	hasRequiredGetOwnPropertySymbols$1 = 1;
	var parent = /*@__PURE__*/ requireGetOwnPropertySymbols$2();

	getOwnPropertySymbols$1 = parent;
	return getOwnPropertySymbols$1;
}

var getOwnPropertySymbols;
var hasRequiredGetOwnPropertySymbols;

function requireGetOwnPropertySymbols () {
	if (hasRequiredGetOwnPropertySymbols) return getOwnPropertySymbols;
	hasRequiredGetOwnPropertySymbols = 1;
	getOwnPropertySymbols = /*@__PURE__*/ requireGetOwnPropertySymbols$1();
	return getOwnPropertySymbols;
}

var getOwnPropertySymbolsExports = /*@__PURE__*/ requireGetOwnPropertySymbols();
var _Object$getOwnPropertySymbols = /*@__PURE__*/getDefaultExportFromCjs(getOwnPropertySymbolsExports);

var es_array_includes = {};

var hasRequiredEs_array_includes;

function requireEs_array_includes () {
	if (hasRequiredEs_array_includes) return es_array_includes;
	hasRequiredEs_array_includes = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var $includes =  requireArrayIncludes$1().includes;
	var fails = /*@__PURE__*/ requireFails$1();
	var addToUnscopables = /*@__PURE__*/ requireAddToUnscopables();

	// FF99+ bug
	var BROKEN_ON_SPARSE = fails(function () {
	  // eslint-disable-next-line es/no-array-prototype-includes -- detection
	  return !Array(1).includes();
	});

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');
	return es_array_includes;
}

var includes$6;
var hasRequiredIncludes$6;

function requireIncludes$6 () {
	if (hasRequiredIncludes$6) return includes$6;
	hasRequiredIncludes$6 = 1;
	requireEs_array_includes();
	var getBuiltInPrototypeMethod = /*@__PURE__*/ requireGetBuiltInPrototypeMethod();

	includes$6 = getBuiltInPrototypeMethod('Array', 'includes');
	return includes$6;
}

var es_string_includes = {};

var hasRequiredEs_string_includes;

function requireEs_string_includes () {
	if (hasRequiredEs_string_includes) return es_string_includes;
	hasRequiredEs_string_includes = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var notARegExp = /*@__PURE__*/ requireNotARegexp();
	var requireObjectCoercible = /*@__PURE__*/ requireRequireObjectCoercible$1();
	var toString = /*@__PURE__*/ requireToString$1();
	var correctIsRegExpLogic = /*@__PURE__*/ requireCorrectIsRegexpLogic();

	var stringIndexOf = uncurryThis(''.indexOf);

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~stringIndexOf(
	      toString(requireObjectCoercible(this)),
	      toString(notARegExp(searchString)),
	      arguments.length > 1 ? arguments[1] : undefined
	    );
	  }
	});
	return es_string_includes;
}

var includes$5;
var hasRequiredIncludes$5;

function requireIncludes$5 () {
	if (hasRequiredIncludes$5) return includes$5;
	hasRequiredIncludes$5 = 1;
	requireEs_string_includes();
	var getBuiltInPrototypeMethod = /*@__PURE__*/ requireGetBuiltInPrototypeMethod();

	includes$5 = getBuiltInPrototypeMethod('String', 'includes');
	return includes$5;
}

var includes$4;
var hasRequiredIncludes$4;

function requireIncludes$4 () {
	if (hasRequiredIncludes$4) return includes$4;
	hasRequiredIncludes$4 = 1;
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var arrayMethod = /*@__PURE__*/ requireIncludes$6();
	var stringMethod = /*@__PURE__*/ requireIncludes$5();

	var ArrayPrototype = Array.prototype;
	var StringPrototype = String.prototype;

	includes$4 = function (it) {
	  var own = it.includes;
	  if (it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.includes)) return arrayMethod;
	  if (typeof it == 'string' || it === StringPrototype || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.includes)) {
	    return stringMethod;
	  } return own;
	};
	return includes$4;
}

var includes$3;
var hasRequiredIncludes$3;

function requireIncludes$3 () {
	if (hasRequiredIncludes$3) return includes$3;
	hasRequiredIncludes$3 = 1;
	var parent = /*@__PURE__*/ requireIncludes$4();

	includes$3 = parent;
	return includes$3;
}

var includes$2;
var hasRequiredIncludes$2;

function requireIncludes$2 () {
	if (hasRequiredIncludes$2) return includes$2;
	hasRequiredIncludes$2 = 1;
	var parent = /*@__PURE__*/ requireIncludes$3();

	includes$2 = parent;
	return includes$2;
}

var includes$1;
var hasRequiredIncludes$1;

function requireIncludes$1 () {
	if (hasRequiredIncludes$1) return includes$1;
	hasRequiredIncludes$1 = 1;
	var parent = /*@__PURE__*/ requireIncludes$2();

	includes$1 = parent;
	return includes$1;
}

var includes;
var hasRequiredIncludes;

function requireIncludes () {
	if (hasRequiredIncludes) return includes;
	hasRequiredIncludes = 1;
	includes = /*@__PURE__*/ requireIncludes$1();
	return includes;
}

var includesExports = /*@__PURE__*/ requireIncludes();
var _includesInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(includesExports);

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (_includesInstanceProperty(e).call(e, n)) continue;
    t[n] = r[n];
  }
  return t;
}

function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (_Object$getOwnPropertySymbols) {
    var s = _Object$getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], _includesInstanceProperty(t).call(t, o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}

var es_set = {};

var es_set_constructor = {};

var internalMetadata = {exports: {}};

var arrayBufferNonExtensible;
var hasRequiredArrayBufferNonExtensible;

function requireArrayBufferNonExtensible () {
	if (hasRequiredArrayBufferNonExtensible) return arrayBufferNonExtensible;
	hasRequiredArrayBufferNonExtensible = 1;
	// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
	var fails = /*@__PURE__*/ requireFails$1();

	arrayBufferNonExtensible = fails(function () {
	  if (typeof ArrayBuffer == 'function') {
	    var buffer = new ArrayBuffer(8);
	    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
	    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
	  }
	});
	return arrayBufferNonExtensible;
}

var objectIsExtensible;
var hasRequiredObjectIsExtensible;

function requireObjectIsExtensible () {
	if (hasRequiredObjectIsExtensible) return objectIsExtensible;
	hasRequiredObjectIsExtensible = 1;
	var fails = /*@__PURE__*/ requireFails$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var classof = /*@__PURE__*/ requireClassofRaw$1();
	var ARRAY_BUFFER_NON_EXTENSIBLE = /*@__PURE__*/ requireArrayBufferNonExtensible();

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES = fails(function () { });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	objectIsExtensible = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
	  if (!isObject(it)) return false;
	  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === 'ArrayBuffer') return false;
	  return $isExtensible ? $isExtensible(it) : true;
	} : $isExtensible;
	return objectIsExtensible;
}

var freezing;
var hasRequiredFreezing;

function requireFreezing () {
	if (hasRequiredFreezing) return freezing;
	hasRequiredFreezing = 1;
	var fails = /*@__PURE__*/ requireFails$1();

	freezing = !fails(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});
	return freezing;
}

var hasRequiredInternalMetadata;

function requireInternalMetadata () {
	if (hasRequiredInternalMetadata) return internalMetadata.exports;
	hasRequiredInternalMetadata = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var hiddenKeys = /*@__PURE__*/ requireHiddenKeys$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var hasOwn = /*@__PURE__*/ requireHasOwnProperty$1();
	var defineProperty =  requireObjectDefineProperty$1().f;
	var getOwnPropertyNamesModule = /*@__PURE__*/ requireObjectGetOwnPropertyNames$1();
	var getOwnPropertyNamesExternalModule = /*@__PURE__*/ requireObjectGetOwnPropertyNamesExternal();
	var isExtensible = /*@__PURE__*/ requireObjectIsExtensible();
	var uid = /*@__PURE__*/ requireUid$1();
	var FREEZING = /*@__PURE__*/ requireFreezing();

	var REQUIRED = false;
	var METADATA = uid('meta');
	var id = 0;

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + id++, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!hasOwn(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!hasOwn(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
	  return it;
	};

	var enable = function () {
	  meta.enable = function () { /* empty */ };
	  REQUIRED = true;
	  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
	  var splice = uncurryThis([].splice);
	  var test = {};
	  test[METADATA] = 1;

	  // prevent exposing of metadata key
	  if (getOwnPropertyNames(test).length) {
	    getOwnPropertyNamesModule.f = function (it) {
	      var result = getOwnPropertyNames(it);
	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice(result, i, 1);
	          break;
	        }
	      } return result;
	    };

	    $({ target: 'Object', stat: true, forced: true }, {
	      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
	    });
	  }
	};

	var meta = internalMetadata.exports = {
	  enable: enable,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	return internalMetadata.exports;
}

var iterate;
var hasRequiredIterate;

function requireIterate () {
	if (hasRequiredIterate) return iterate;
	hasRequiredIterate = 1;
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var tryToString = /*@__PURE__*/ requireTryToString$1();
	var isArrayIteratorMethod = /*@__PURE__*/ requireIsArrayIteratorMethod();
	var lengthOfArrayLike = /*@__PURE__*/ requireLengthOfArrayLike$1();
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var getIterator = /*@__PURE__*/ requireGetIterator();
	var getIteratorMethod = /*@__PURE__*/ requireGetIteratorMethod();
	var iteratorClose = /*@__PURE__*/ requireIteratorClose();

	var $TypeError = TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = call(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
	  } return new Result(false);
	};
	return iterate;
}

var collection;
var hasRequiredCollection;

function requireCollection () {
	if (hasRequiredCollection) return collection;
	hasRequiredCollection = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var globalThis = /*@__PURE__*/ requireGlobalThis$1();
	var InternalMetadataModule = /*@__PURE__*/ requireInternalMetadata();
	var fails = /*@__PURE__*/ requireFails$1();
	var createNonEnumerableProperty = /*@__PURE__*/ requireCreateNonEnumerableProperty$1();
	var iterate = /*@__PURE__*/ requireIterate();
	var anInstance = /*@__PURE__*/ requireAnInstance();
	var isCallable = /*@__PURE__*/ requireIsCallable$1();
	var isObject = /*@__PURE__*/ requireIsObject$1();
	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined$1();
	var setToStringTag = /*@__PURE__*/ requireSetToStringTag();
	var defineProperty =  requireObjectDefineProperty$1().f;
	var forEach =  requireArrayIteration().forEach;
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();

	var setInternalState = InternalStateModule.set;
	var internalStateGetterFor = InternalStateModule.getterFor;

	collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = globalThis[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var exported = {};
	  var Constructor;

	  if (!DESCRIPTORS || !isCallable(NativeConstructor)
	    || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
	  ) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    InternalMetadataModule.enable();
	  } else {
	    Constructor = wrapper(function (target, iterable) {
	      setInternalState(anInstance(target, Prototype), {
	        type: CONSTRUCTOR_NAME,
	        collection: new NativeConstructor()
	      });
	      if (!isNullOrUndefined(iterable)) iterate(iterable, target[ADDER], { that: target, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    forEach(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
	      var IS_ADDER = KEY === 'add' || KEY === 'set';
	      if (KEY in NativePrototype && !(IS_WEAK && KEY === 'clear')) {
	        createNonEnumerableProperty(Prototype, KEY, function (a, b) {
	          var collection = getInternalState(this).collection;
	          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY === 'get' ? undefined : false;
	          var result = collection[KEY](a === 0 ? 0 : a, b);
	          return IS_ADDER ? this : result;
	        });
	      }
	    });

	    IS_WEAK || defineProperty(Prototype, 'size', {
	      configurable: true,
	      get: function () {
	        return getInternalState(this).collection.size;
	      }
	    });
	  }

	  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  $({ global: true, forced: true }, exported);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};
	return collection;
}

var setSpecies;
var hasRequiredSetSpecies;

function requireSetSpecies () {
	if (hasRequiredSetSpecies) return setSpecies;
	hasRequiredSetSpecies = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var defineBuiltInAccessor = /*@__PURE__*/ requireDefineBuiltInAccessor();
	var wellKnownSymbol = /*@__PURE__*/ requireWellKnownSymbol$1();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();

	var SPECIES = wellKnownSymbol('species');

	setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

	  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
	    defineBuiltInAccessor(Constructor, SPECIES, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};
	return setSpecies;
}

var collectionStrong;
var hasRequiredCollectionStrong;

function requireCollectionStrong () {
	if (hasRequiredCollectionStrong) return collectionStrong;
	hasRequiredCollectionStrong = 1;
	var create = /*@__PURE__*/ requireObjectCreate$1();
	var defineBuiltInAccessor = /*@__PURE__*/ requireDefineBuiltInAccessor();
	var defineBuiltIns = /*@__PURE__*/ requireDefineBuiltIns();
	var bind = /*@__PURE__*/ requireFunctionBindContext();
	var anInstance = /*@__PURE__*/ requireAnInstance();
	var isNullOrUndefined = /*@__PURE__*/ requireIsNullOrUndefined$1();
	var iterate = /*@__PURE__*/ requireIterate();
	var defineIterator = /*@__PURE__*/ requireIteratorDefine();
	var createIterResultObject = /*@__PURE__*/ requireCreateIterResultObject();
	var setSpecies = /*@__PURE__*/ requireSetSpecies();
	var DESCRIPTORS = /*@__PURE__*/ requireDescriptors$1();
	var fastKey =  requireInternalMetadata().fastKey;
	var InternalStateModule = /*@__PURE__*/ requireInternalState$1();

	var setInternalState = InternalStateModule.set;
	var internalStateGetterFor = InternalStateModule.getterFor;

	collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance(that, Prototype);
	      setInternalState(that, {
	        type: CONSTRUCTOR_NAME,
	        index: create(null),
	        first: null,
	        last: null,
	        size: 0
	      });
	      if (!DESCRIPTORS) that.size = 0;
	      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: null,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (DESCRIPTORS) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key === key) return entry;
	      }
	    };

	    defineBuiltIns(Prototype, {
	      // `{ Map, Set }.prototype.clear()` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.clear
	      // https://tc39.es/ecma262/#sec-set.prototype.clear
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = null;
	          entry = entry.next;
	        }
	        state.first = state.last = null;
	        state.index = create(null);
	        if (DESCRIPTORS) state.size = 0;
	        else that.size = 0;
	      },
	      // `{ Map, Set }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.delete
	      // https://tc39.es/ecma262/#sec-set.prototype.delete
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first === entry) state.first = next;
	          if (state.last === entry) state.last = prev;
	          if (DESCRIPTORS) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.foreach
	      // https://tc39.es/ecma262/#sec-set.prototype.foreach
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // `{ Map, Set}.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.has
	      // https://tc39.es/ecma262/#sec-set.prototype.has
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    defineBuiltIns(Prototype, IS_MAP ? {
	      // `Map.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.get
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // `Map.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.set
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // `Set.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-set.prototype.add
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (DESCRIPTORS) defineBuiltInAccessor(Prototype, 'size', {
	      configurable: true,
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return Constructor;
	  },
	  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
	    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
	    // https://tc39.es/ecma262/#sec-map.prototype.entries
	    // https://tc39.es/ecma262/#sec-map.prototype.keys
	    // https://tc39.es/ecma262/#sec-map.prototype.values
	    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
	    // https://tc39.es/ecma262/#sec-set.prototype.entries
	    // https://tc39.es/ecma262/#sec-set.prototype.keys
	    // https://tc39.es/ecma262/#sec-set.prototype.values
	    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
	    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: null
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = null;
	        return createIterResultObject(undefined, true);
	      }
	      // return step by kind
	      if (kind === 'keys') return createIterResultObject(entry.key, false);
	      if (kind === 'values') return createIterResultObject(entry.value, false);
	      return createIterResultObject([entry.key, entry.value], false);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // `{ Map, Set }.prototype[@@species]` accessors
	    // https://tc39.es/ecma262/#sec-get-map-@@species
	    // https://tc39.es/ecma262/#sec-get-set-@@species
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};
	return collectionStrong;
}

var hasRequiredEs_set_constructor;

function requireEs_set_constructor () {
	if (hasRequiredEs_set_constructor) return es_set_constructor;
	hasRequiredEs_set_constructor = 1;
	var collection = /*@__PURE__*/ requireCollection();
	var collectionStrong = /*@__PURE__*/ requireCollectionStrong();

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);
	return es_set_constructor;
}

var hasRequiredEs_set;

function requireEs_set () {
	if (hasRequiredEs_set) return es_set;
	hasRequiredEs_set = 1;
	// TODO: Remove this module from `core-js@4` since it's replaced to module below
	requireEs_set_constructor();
	return es_set;
}

var es_set_difference_v2 = {};

var aSet;
var hasRequiredASet;

function requireASet () {
	if (hasRequiredASet) return aSet;
	hasRequiredASet = 1;
	var tryToString = /*@__PURE__*/ requireTryToString$1();

	var $TypeError = TypeError;

	// Perform ? RequireInternalSlot(M, [[SetData]])
	aSet = function (it) {
	  if (typeof it == 'object' && 'size' in it && 'has' in it && 'add' in it && 'delete' in it && 'keys' in it) return it;
	  throw new $TypeError(tryToString(it) + ' is not a set');
	};
	return aSet;
}

var caller;
var hasRequiredCaller;

function requireCaller () {
	if (hasRequiredCaller) return caller;
	hasRequiredCaller = 1;
	caller = function (methodName, numArgs) {
	  return numArgs === 1 ? function (object, arg) {
	    return object[methodName](arg);
	  } : function (object, arg1, arg2) {
	    return object[methodName](arg1, arg2);
	  };
	};
	return caller;
}

var setHelpers;
var hasRequiredSetHelpers;

function requireSetHelpers () {
	if (hasRequiredSetHelpers) return setHelpers;
	hasRequiredSetHelpers = 1;
	var getBuiltIn = /*@__PURE__*/ requireGetBuiltIn$1();
	var caller = /*@__PURE__*/ requireCaller();

	var Set = getBuiltIn('Set');
	var SetPrototype = Set.prototype;

	setHelpers = {
	  Set: Set,
	  add: caller('add', 1),
	  has: caller('has', 1),
	  remove: caller('delete', 1),
	  proto: SetPrototype
	};
	return setHelpers;
}

var iterateSimple;
var hasRequiredIterateSimple;

function requireIterateSimple () {
	if (hasRequiredIterateSimple) return iterateSimple;
	hasRequiredIterateSimple = 1;
	var call = /*@__PURE__*/ requireFunctionCall$1();

	iterateSimple = function (record, fn, ITERATOR_INSTEAD_OF_RECORD) {
	  var iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator;
	  var next = record.next;
	  var step, result;
	  while (!(step = call(next, iterator)).done) {
	    result = fn(step.value);
	    if (result !== undefined) return result;
	  }
	};
	return iterateSimple;
}

var setIterate;
var hasRequiredSetIterate;

function requireSetIterate () {
	if (hasRequiredSetIterate) return setIterate;
	hasRequiredSetIterate = 1;
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();

	setIterate = function (set, fn, interruptible) {
	  return interruptible ? iterateSimple(set.keys(), fn, true) : set.forEach(fn);
	};
	return setIterate;
}

var setClone;
var hasRequiredSetClone;

function requireSetClone () {
	if (hasRequiredSetClone) return setClone;
	hasRequiredSetClone = 1;
	var SetHelpers = /*@__PURE__*/ requireSetHelpers();
	var iterate = /*@__PURE__*/ requireSetIterate();

	var Set = SetHelpers.Set;
	var add = SetHelpers.add;

	setClone = function (set) {
	  var result = new Set();
	  iterate(set, function (it) {
	    add(result, it);
	  });
	  return result;
	};
	return setClone;
}

var setSize;
var hasRequiredSetSize;

function requireSetSize () {
	if (hasRequiredSetSize) return setSize;
	hasRequiredSetSize = 1;
	setSize = function (set) {
	  return set.size;
	};
	return setSize;
}

var getIteratorDirect;
var hasRequiredGetIteratorDirect;

function requireGetIteratorDirect () {
	if (hasRequiredGetIteratorDirect) return getIteratorDirect;
	hasRequiredGetIteratorDirect = 1;
	// `GetIteratorDirect(obj)` abstract operation
	// https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
	getIteratorDirect = function (obj) {
	  return {
	    iterator: obj,
	    next: obj.next,
	    done: false
	  };
	};
	return getIteratorDirect;
}

var getSetRecord;
var hasRequiredGetSetRecord;

function requireGetSetRecord () {
	if (hasRequiredGetSetRecord) return getSetRecord;
	hasRequiredGetSetRecord = 1;
	var aCallable = /*@__PURE__*/ requireACallable$1();
	var anObject = /*@__PURE__*/ requireAnObject$1();
	var call = /*@__PURE__*/ requireFunctionCall$1();
	var toIntegerOrInfinity = /*@__PURE__*/ requireToIntegerOrInfinity$1();
	var getIteratorDirect = /*@__PURE__*/ requireGetIteratorDirect();

	var INVALID_SIZE = 'Invalid size';
	var $RangeError = RangeError;
	var $TypeError = TypeError;
	var max = Math.max;

	var SetRecord = function (set, intSize) {
	  this.set = set;
	  this.size = max(intSize, 0);
	  this.has = aCallable(set.has);
	  this.keys = aCallable(set.keys);
	};

	SetRecord.prototype = {
	  getIterator: function () {
	    return getIteratorDirect(anObject(call(this.keys, this.set)));
	  },
	  includes: function (it) {
	    return call(this.has, this.set, it);
	  }
	};

	// `GetSetRecord` abstract operation
	// https://tc39.es/proposal-set-methods/#sec-getsetrecord
	getSetRecord = function (obj) {
	  anObject(obj);
	  var numSize = +obj.size;
	  // NOTE: If size is undefined, then numSize will be NaN
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (numSize !== numSize) throw new $TypeError(INVALID_SIZE);
	  var intSize = toIntegerOrInfinity(numSize);
	  if (intSize < 0) throw new $RangeError(INVALID_SIZE);
	  return new SetRecord(obj, intSize);
	};
	return getSetRecord;
}

var setDifference;
var hasRequiredSetDifference;

function requireSetDifference () {
	if (hasRequiredSetDifference) return setDifference;
	hasRequiredSetDifference = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var SetHelpers = /*@__PURE__*/ requireSetHelpers();
	var clone = /*@__PURE__*/ requireSetClone();
	var size = /*@__PURE__*/ requireSetSize();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();
	var iterateSet = /*@__PURE__*/ requireSetIterate();
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();

	var has = SetHelpers.has;
	var remove = SetHelpers.remove;

	// `Set.prototype.difference` method
	// https://github.com/tc39/proposal-set-methods
	setDifference = function difference(other) {
	  var O = aSet(this);
	  var otherRec = getSetRecord(other);
	  var result = clone(O);
	  if (size(O) <= otherRec.size) iterateSet(O, function (e) {
	    if (otherRec.includes(e)) remove(result, e);
	  });
	  else iterateSimple(otherRec.getIterator(), function (e) {
	    if (has(O, e)) remove(result, e);
	  });
	  return result;
	};
	return setDifference;
}

var setMethodAcceptSetLike;
var hasRequiredSetMethodAcceptSetLike;

function requireSetMethodAcceptSetLike () {
	if (hasRequiredSetMethodAcceptSetLike) return setMethodAcceptSetLike;
	hasRequiredSetMethodAcceptSetLike = 1;
	setMethodAcceptSetLike = function () {
	  return false;
	};
	return setMethodAcceptSetLike;
}

var hasRequiredEs_set_difference_v2;

function requireEs_set_difference_v2 () {
	if (hasRequiredEs_set_difference_v2) return es_set_difference_v2;
	hasRequiredEs_set_difference_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var difference = /*@__PURE__*/ requireSetDifference();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	var INCORRECT = !setMethodAcceptSetLike('difference', function (result) {
	  return result.size === 0;
	});

	// `Set.prototype.difference` method
	// https://tc39.es/ecma262/#sec-set.prototype.difference
	$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
	  difference: difference
	});
	return es_set_difference_v2;
}

var es_set_intersection_v2 = {};

var setIntersection;
var hasRequiredSetIntersection;

function requireSetIntersection () {
	if (hasRequiredSetIntersection) return setIntersection;
	hasRequiredSetIntersection = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var SetHelpers = /*@__PURE__*/ requireSetHelpers();
	var size = /*@__PURE__*/ requireSetSize();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();
	var iterateSet = /*@__PURE__*/ requireSetIterate();
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();

	var Set = SetHelpers.Set;
	var add = SetHelpers.add;
	var has = SetHelpers.has;

	// `Set.prototype.intersection` method
	// https://github.com/tc39/proposal-set-methods
	setIntersection = function intersection(other) {
	  var O = aSet(this);
	  var otherRec = getSetRecord(other);
	  var result = new Set();

	  if (size(O) > otherRec.size) {
	    iterateSimple(otherRec.getIterator(), function (e) {
	      if (has(O, e)) add(result, e);
	    });
	  } else {
	    iterateSet(O, function (e) {
	      if (otherRec.includes(e)) add(result, e);
	    });
	  }

	  return result;
	};
	return setIntersection;
}

var hasRequiredEs_set_intersection_v2;

function requireEs_set_intersection_v2 () {
	if (hasRequiredEs_set_intersection_v2) return es_set_intersection_v2;
	hasRequiredEs_set_intersection_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var fails = /*@__PURE__*/ requireFails$1();
	var intersection = /*@__PURE__*/ requireSetIntersection();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	var INCORRECT = !setMethodAcceptSetLike('intersection', function (result) {
	  return result.size === 2 && result.has(1) && result.has(2);
	}) || fails(function () {
	  // eslint-disable-next-line es/no-array-from, es/no-set, es/no-set-prototype-intersection -- testing
	  return String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2])))) !== '3,2';
	});

	// `Set.prototype.intersection` method
	// https://tc39.es/ecma262/#sec-set.prototype.intersection
	$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
	  intersection: intersection
	});
	return es_set_intersection_v2;
}

var es_set_isDisjointFrom_v2 = {};

var setIsDisjointFrom;
var hasRequiredSetIsDisjointFrom;

function requireSetIsDisjointFrom () {
	if (hasRequiredSetIsDisjointFrom) return setIsDisjointFrom;
	hasRequiredSetIsDisjointFrom = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var has =  requireSetHelpers().has;
	var size = /*@__PURE__*/ requireSetSize();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();
	var iterateSet = /*@__PURE__*/ requireSetIterate();
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();
	var iteratorClose = /*@__PURE__*/ requireIteratorClose();

	// `Set.prototype.isDisjointFrom` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
	setIsDisjointFrom = function isDisjointFrom(other) {
	  var O = aSet(this);
	  var otherRec = getSetRecord(other);
	  if (size(O) <= otherRec.size) return iterateSet(O, function (e) {
	    if (otherRec.includes(e)) return false;
	  }, true) !== false;
	  var iterator = otherRec.getIterator();
	  return iterateSimple(iterator, function (e) {
	    if (has(O, e)) return iteratorClose(iterator, 'normal', false);
	  }) !== false;
	};
	return setIsDisjointFrom;
}

var hasRequiredEs_set_isDisjointFrom_v2;

function requireEs_set_isDisjointFrom_v2 () {
	if (hasRequiredEs_set_isDisjointFrom_v2) return es_set_isDisjointFrom_v2;
	hasRequiredEs_set_isDisjointFrom_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isDisjointFrom = /*@__PURE__*/ requireSetIsDisjointFrom();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	var INCORRECT = !setMethodAcceptSetLike('isDisjointFrom', function (result) {
	  return !result;
	});

	// `Set.prototype.isDisjointFrom` method
	// https://tc39.es/ecma262/#sec-set.prototype.isdisjointfrom
	$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
	  isDisjointFrom: isDisjointFrom
	});
	return es_set_isDisjointFrom_v2;
}

var es_set_isSubsetOf_v2 = {};

var setIsSubsetOf;
var hasRequiredSetIsSubsetOf;

function requireSetIsSubsetOf () {
	if (hasRequiredSetIsSubsetOf) return setIsSubsetOf;
	hasRequiredSetIsSubsetOf = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var size = /*@__PURE__*/ requireSetSize();
	var iterate = /*@__PURE__*/ requireSetIterate();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();

	// `Set.prototype.isSubsetOf` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
	setIsSubsetOf = function isSubsetOf(other) {
	  var O = aSet(this);
	  var otherRec = getSetRecord(other);
	  if (size(O) > otherRec.size) return false;
	  return iterate(O, function (e) {
	    if (!otherRec.includes(e)) return false;
	  }, true) !== false;
	};
	return setIsSubsetOf;
}

var hasRequiredEs_set_isSubsetOf_v2;

function requireEs_set_isSubsetOf_v2 () {
	if (hasRequiredEs_set_isSubsetOf_v2) return es_set_isSubsetOf_v2;
	hasRequiredEs_set_isSubsetOf_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isSubsetOf = /*@__PURE__*/ requireSetIsSubsetOf();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	var INCORRECT = !setMethodAcceptSetLike('isSubsetOf', function (result) {
	  return result;
	});

	// `Set.prototype.isSubsetOf` method
	// https://tc39.es/ecma262/#sec-set.prototype.issubsetof
	$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
	  isSubsetOf: isSubsetOf
	});
	return es_set_isSubsetOf_v2;
}

var es_set_isSupersetOf_v2 = {};

var setIsSupersetOf;
var hasRequiredSetIsSupersetOf;

function requireSetIsSupersetOf () {
	if (hasRequiredSetIsSupersetOf) return setIsSupersetOf;
	hasRequiredSetIsSupersetOf = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var has =  requireSetHelpers().has;
	var size = /*@__PURE__*/ requireSetSize();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();
	var iteratorClose = /*@__PURE__*/ requireIteratorClose();

	// `Set.prototype.isSupersetOf` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
	setIsSupersetOf = function isSupersetOf(other) {
	  var O = aSet(this);
	  var otherRec = getSetRecord(other);
	  if (size(O) < otherRec.size) return false;
	  var iterator = otherRec.getIterator();
	  return iterateSimple(iterator, function (e) {
	    if (!has(O, e)) return iteratorClose(iterator, 'normal', false);
	  }) !== false;
	};
	return setIsSupersetOf;
}

var hasRequiredEs_set_isSupersetOf_v2;

function requireEs_set_isSupersetOf_v2 () {
	if (hasRequiredEs_set_isSupersetOf_v2) return es_set_isSupersetOf_v2;
	hasRequiredEs_set_isSupersetOf_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isSupersetOf = /*@__PURE__*/ requireSetIsSupersetOf();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	var INCORRECT = !setMethodAcceptSetLike('isSupersetOf', function (result) {
	  return !result;
	});

	// `Set.prototype.isSupersetOf` method
	// https://tc39.es/ecma262/#sec-set.prototype.issupersetof
	$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
	  isSupersetOf: isSupersetOf
	});
	return es_set_isSupersetOf_v2;
}

var es_set_symmetricDifference_v2 = {};

var setSymmetricDifference;
var hasRequiredSetSymmetricDifference;

function requireSetSymmetricDifference () {
	if (hasRequiredSetSymmetricDifference) return setSymmetricDifference;
	hasRequiredSetSymmetricDifference = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var SetHelpers = /*@__PURE__*/ requireSetHelpers();
	var clone = /*@__PURE__*/ requireSetClone();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();

	var add = SetHelpers.add;
	var has = SetHelpers.has;
	var remove = SetHelpers.remove;

	// `Set.prototype.symmetricDifference` method
	// https://github.com/tc39/proposal-set-methods
	setSymmetricDifference = function symmetricDifference(other) {
	  var O = aSet(this);
	  var keysIter = getSetRecord(other).getIterator();
	  var result = clone(O);
	  iterateSimple(keysIter, function (e) {
	    if (has(O, e)) remove(result, e);
	    else add(result, e);
	  });
	  return result;
	};
	return setSymmetricDifference;
}

var hasRequiredEs_set_symmetricDifference_v2;

function requireEs_set_symmetricDifference_v2 () {
	if (hasRequiredEs_set_symmetricDifference_v2) return es_set_symmetricDifference_v2;
	hasRequiredEs_set_symmetricDifference_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var symmetricDifference = /*@__PURE__*/ requireSetSymmetricDifference();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	// `Set.prototype.symmetricDifference` method
	// https://tc39.es/ecma262/#sec-set.prototype.symmetricdifference
	$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('symmetricDifference') }, {
	  symmetricDifference: symmetricDifference
	});
	return es_set_symmetricDifference_v2;
}

var es_set_union_v2 = {};

var setUnion;
var hasRequiredSetUnion;

function requireSetUnion () {
	if (hasRequiredSetUnion) return setUnion;
	hasRequiredSetUnion = 1;
	var aSet = /*@__PURE__*/ requireASet();
	var add =  requireSetHelpers().add;
	var clone = /*@__PURE__*/ requireSetClone();
	var getSetRecord = /*@__PURE__*/ requireGetSetRecord();
	var iterateSimple = /*@__PURE__*/ requireIterateSimple();

	// `Set.prototype.union` method
	// https://github.com/tc39/proposal-set-methods
	setUnion = function union(other) {
	  var O = aSet(this);
	  var keysIter = getSetRecord(other).getIterator();
	  var result = clone(O);
	  iterateSimple(keysIter, function (it) {
	    add(result, it);
	  });
	  return result;
	};
	return setUnion;
}

var hasRequiredEs_set_union_v2;

function requireEs_set_union_v2 () {
	if (hasRequiredEs_set_union_v2) return es_set_union_v2;
	hasRequiredEs_set_union_v2 = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var union = /*@__PURE__*/ requireSetUnion();
	var setMethodAcceptSetLike = /*@__PURE__*/ requireSetMethodAcceptSetLike();

	// `Set.prototype.union` method
	// https://tc39.es/ecma262/#sec-set.prototype.union
	$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('union') }, {
	  union: union
	});
	return es_set_union_v2;
}

var set$2;
var hasRequiredSet$2;

function requireSet$2 () {
	if (hasRequiredSet$2) return set$2;
	hasRequiredSet$2 = 1;
	requireEs_array_iterator();
	requireEs_set();
	requireEs_set_difference_v2();
	requireEs_set_intersection_v2();
	requireEs_set_isDisjointFrom_v2();
	requireEs_set_isSubsetOf_v2();
	requireEs_set_isSupersetOf_v2();
	requireEs_set_symmetricDifference_v2();
	requireEs_set_union_v2();
	requireEs_string_iterator();
	var path = /*@__PURE__*/ requirePath();

	set$2 = path.Set;
	return set$2;
}

var set$1;
var hasRequiredSet$1;

function requireSet$1 () {
	if (hasRequiredSet$1) return set$1;
	hasRequiredSet$1 = 1;
	var parent = /*@__PURE__*/ requireSet$2();
	requireWeb_domCollections_iterator();

	set$1 = parent;
	return set$1;
}

var set;
var hasRequiredSet;

function requireSet () {
	if (hasRequiredSet) return set;
	hasRequiredSet = 1;
	set = /*@__PURE__*/ requireSet$1();
	return set;
}

var setExports = requireSet();
var _Set = /*@__PURE__*/getDefaultExportFromCjs(setExports);

var es_array_isArray = {};

var hasRequiredEs_array_isArray;

function requireEs_array_isArray () {
	if (hasRequiredEs_array_isArray) return es_array_isArray;
	hasRequiredEs_array_isArray = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var isArray = /*@__PURE__*/ requireIsArray$3();

	// `Array.isArray` method
	// https://tc39.es/ecma262/#sec-array.isarray
	$({ target: 'Array', stat: true }, {
	  isArray: isArray
	});
	return es_array_isArray;
}

var isArray$2;
var hasRequiredIsArray$2;

function requireIsArray$2 () {
	if (hasRequiredIsArray$2) return isArray$2;
	hasRequiredIsArray$2 = 1;
	requireEs_array_isArray();
	var path = /*@__PURE__*/ requirePath();

	isArray$2 = path.Array.isArray;
	return isArray$2;
}

var isArray$1;
var hasRequiredIsArray$1;

function requireIsArray$1 () {
	if (hasRequiredIsArray$1) return isArray$1;
	hasRequiredIsArray$1 = 1;
	var parent = /*@__PURE__*/ requireIsArray$2();

	isArray$1 = parent;
	return isArray$1;
}

var isArray;
var hasRequiredIsArray;

function requireIsArray () {
	if (hasRequiredIsArray) return isArray;
	hasRequiredIsArray = 1;
	isArray = /*@__PURE__*/ requireIsArray$1();
	return isArray;
}

var isArrayExports = requireIsArray();
var _Array$isArray = /*@__PURE__*/getDefaultExportFromCjs(isArrayExports);

var es_array_reverse = {};

var hasRequiredEs_array_reverse;

function requireEs_array_reverse () {
	if (hasRequiredEs_array_reverse) return es_array_reverse;
	hasRequiredEs_array_reverse = 1;
	var $ = /*@__PURE__*/ require_export$1();
	var uncurryThis = /*@__PURE__*/ requireFunctionUncurryThis$1();
	var isArray = /*@__PURE__*/ requireIsArray$3();

	var nativeReverse = uncurryThis([].reverse);
	var test = [1, 2];

	// `Array.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794
	$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign -- dirty hack
	    if (isArray(this)) this.length = this.length;
	    return nativeReverse(this);
	  }
	});
	return es_array_reverse;
}

var reverse$3;
var hasRequiredReverse$3;

function requireReverse$3 () {
	if (hasRequiredReverse$3) return reverse$3;
	hasRequiredReverse$3 = 1;
	requireEs_array_reverse();
	var getBuiltInPrototypeMethod = /*@__PURE__*/ requireGetBuiltInPrototypeMethod();

	reverse$3 = getBuiltInPrototypeMethod('Array', 'reverse');
	return reverse$3;
}

var reverse$2;
var hasRequiredReverse$2;

function requireReverse$2 () {
	if (hasRequiredReverse$2) return reverse$2;
	hasRequiredReverse$2 = 1;
	var isPrototypeOf = /*@__PURE__*/ requireObjectIsPrototypeOf$1();
	var method = /*@__PURE__*/ requireReverse$3();

	var ArrayPrototype = Array.prototype;

	reverse$2 = function (it) {
	  var own = it.reverse;
	  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.reverse) ? method : own;
	};
	return reverse$2;
}

var reverse$1;
var hasRequiredReverse$1;

function requireReverse$1 () {
	if (hasRequiredReverse$1) return reverse$1;
	hasRequiredReverse$1 = 1;
	var parent = /*@__PURE__*/ requireReverse$2();

	reverse$1 = parent;
	return reverse$1;
}

var reverse;
var hasRequiredReverse;

function requireReverse () {
	if (hasRequiredReverse) return reverse;
	hasRequiredReverse = 1;
	reverse = /*@__PURE__*/ requireReverse$1();
	return reverse;
}

var reverseExports = requireReverse();
var _reverseInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(reverseExports);

var es_regexp_exec = {};

var globalThis_1;
var hasRequiredGlobalThis;

function requireGlobalThis () {
	if (hasRequiredGlobalThis) return globalThis_1;
	hasRequiredGlobalThis = 1;
	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	globalThis_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  check(typeof globalThis_1 == 'object' && globalThis_1) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();
	return globalThis_1;
}

var objectGetOwnPropertyDescriptor = {};

var fails;
var hasRequiredFails;

function requireFails () {
	if (hasRequiredFails) return fails;
	hasRequiredFails = 1;
	fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};
	return fails;
}

var descriptors;
var hasRequiredDescriptors;

function requireDescriptors () {
	if (hasRequiredDescriptors) return descriptors;
	hasRequiredDescriptors = 1;
	var fails = requireFails();

	// Detect IE8's incomplete defineProperty implementation
	descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
	});
	return descriptors;
}

var functionBindNative;
var hasRequiredFunctionBindNative;

function requireFunctionBindNative () {
	if (hasRequiredFunctionBindNative) return functionBindNative;
	hasRequiredFunctionBindNative = 1;
	var fails = requireFails();

	functionBindNative = !fails(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});
	return functionBindNative;
}

var functionCall;
var hasRequiredFunctionCall;

function requireFunctionCall () {
	if (hasRequiredFunctionCall) return functionCall;
	hasRequiredFunctionCall = 1;
	var NATIVE_BIND = requireFunctionBindNative();

	var call = Function.prototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	functionCall = NATIVE_BIND ? call.bind(call) : function () {
	  return call.apply(call, arguments);
	};
	return functionCall;
}

var objectPropertyIsEnumerable = {};

var hasRequiredObjectPropertyIsEnumerable;

function requireObjectPropertyIsEnumerable () {
	if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
	hasRequiredObjectPropertyIsEnumerable = 1;
	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;
	return objectPropertyIsEnumerable;
}

var createPropertyDescriptor;
var hasRequiredCreatePropertyDescriptor;

function requireCreatePropertyDescriptor () {
	if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
	hasRequiredCreatePropertyDescriptor = 1;
	createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};
	return createPropertyDescriptor;
}

var functionUncurryThis;
var hasRequiredFunctionUncurryThis;

function requireFunctionUncurryThis () {
	if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
	hasRequiredFunctionUncurryThis = 1;
	var NATIVE_BIND = requireFunctionBindNative();

	var FunctionPrototype = Function.prototype;
	var call = FunctionPrototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

	functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call.apply(fn, arguments);
	  };
	};
	return functionUncurryThis;
}

var classofRaw;
var hasRequiredClassofRaw;

function requireClassofRaw () {
	if (hasRequiredClassofRaw) return classofRaw;
	hasRequiredClassofRaw = 1;
	var uncurryThis = requireFunctionUncurryThis();

	var toString = uncurryThis({}.toString);
	var stringSlice = uncurryThis(''.slice);

	classofRaw = function (it) {
	  return stringSlice(toString(it), 8, -1);
	};
	return classofRaw;
}

var indexedObject;
var hasRequiredIndexedObject;

function requireIndexedObject () {
	if (hasRequiredIndexedObject) return indexedObject;
	hasRequiredIndexedObject = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var fails = requireFails();
	var classof = requireClassofRaw();

	var $Object = Object;
	var split = uncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof(it) === 'String' ? split(it, '') : $Object(it);
	} : $Object;
	return indexedObject;
}

var isNullOrUndefined;
var hasRequiredIsNullOrUndefined;

function requireIsNullOrUndefined () {
	if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
	hasRequiredIsNullOrUndefined = 1;
	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	isNullOrUndefined = function (it) {
	  return it === null || it === undefined;
	};
	return isNullOrUndefined;
}

var requireObjectCoercible;
var hasRequiredRequireObjectCoercible;

function requireRequireObjectCoercible () {
	if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
	hasRequiredRequireObjectCoercible = 1;
	var isNullOrUndefined = requireIsNullOrUndefined();

	var $TypeError = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	requireObjectCoercible = function (it) {
	  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
	  return it;
	};
	return requireObjectCoercible;
}

var toIndexedObject;
var hasRequiredToIndexedObject;

function requireToIndexedObject () {
	if (hasRequiredToIndexedObject) return toIndexedObject;
	hasRequiredToIndexedObject = 1;
	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = requireIndexedObject();
	var requireObjectCoercible = requireRequireObjectCoercible();

	toIndexedObject = function (it) {
	  return IndexedObject(requireObjectCoercible(it));
	};
	return toIndexedObject;
}

var isCallable;
var hasRequiredIsCallable;

function requireIsCallable () {
	if (hasRequiredIsCallable) return isCallable;
	hasRequiredIsCallable = 1;
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
	  return typeof argument == 'function';
	};
	return isCallable;
}

var isObject;
var hasRequiredIsObject;

function requireIsObject () {
	if (hasRequiredIsObject) return isObject;
	hasRequiredIsObject = 1;
	var isCallable = requireIsCallable();

	isObject = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};
	return isObject;
}

var getBuiltIn;
var hasRequiredGetBuiltIn;

function requireGetBuiltIn () {
	if (hasRequiredGetBuiltIn) return getBuiltIn;
	hasRequiredGetBuiltIn = 1;
	var globalThis = requireGlobalThis();
	var isCallable = requireIsCallable();

	var aFunction = function (argument) {
	  return isCallable(argument) ? argument : undefined;
	};

	getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
	};
	return getBuiltIn;
}

var objectIsPrototypeOf;
var hasRequiredObjectIsPrototypeOf;

function requireObjectIsPrototypeOf () {
	if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
	hasRequiredObjectIsPrototypeOf = 1;
	var uncurryThis = requireFunctionUncurryThis();

	objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
	return objectIsPrototypeOf;
}

var environmentUserAgent;
var hasRequiredEnvironmentUserAgent;

function requireEnvironmentUserAgent () {
	if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
	hasRequiredEnvironmentUserAgent = 1;
	var globalThis = requireGlobalThis();

	var navigator = globalThis.navigator;
	var userAgent = navigator && navigator.userAgent;

	environmentUserAgent = userAgent ? String(userAgent) : '';
	return environmentUserAgent;
}

var environmentV8Version;
var hasRequiredEnvironmentV8Version;

function requireEnvironmentV8Version () {
	if (hasRequiredEnvironmentV8Version) return environmentV8Version;
	hasRequiredEnvironmentV8Version = 1;
	var globalThis = requireGlobalThis();
	var userAgent = requireEnvironmentUserAgent();

	var process = globalThis.process;
	var Deno = globalThis.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	environmentV8Version = version;
	return environmentV8Version;
}

var symbolConstructorDetection;
var hasRequiredSymbolConstructorDetection;

function requireSymbolConstructorDetection () {
	if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
	hasRequiredSymbolConstructorDetection = 1;
	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION = requireEnvironmentV8Version();
	var fails = requireFails();
	var globalThis = requireGlobalThis();

	var $String = globalThis.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});
	return symbolConstructorDetection;
}

var useSymbolAsUid;
var hasRequiredUseSymbolAsUid;

function requireUseSymbolAsUid () {
	if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
	hasRequiredUseSymbolAsUid = 1;
	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL = requireSymbolConstructorDetection();

	useSymbolAsUid = NATIVE_SYMBOL &&
	  !Symbol.sham &&
	  typeof Symbol.iterator == 'symbol';
	return useSymbolAsUid;
}

var isSymbol;
var hasRequiredIsSymbol;

function requireIsSymbol () {
	if (hasRequiredIsSymbol) return isSymbol;
	hasRequiredIsSymbol = 1;
	var getBuiltIn = requireGetBuiltIn();
	var isCallable = requireIsCallable();
	var isPrototypeOf = requireObjectIsPrototypeOf();
	var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

	var $Object = Object;

	isSymbol = USE_SYMBOL_AS_UID ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
	};
	return isSymbol;
}

var tryToString;
var hasRequiredTryToString;

function requireTryToString () {
	if (hasRequiredTryToString) return tryToString;
	hasRequiredTryToString = 1;
	var $String = String;

	tryToString = function (argument) {
	  try {
	    return $String(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};
	return tryToString;
}

var aCallable;
var hasRequiredACallable;

function requireACallable () {
	if (hasRequiredACallable) return aCallable;
	hasRequiredACallable = 1;
	var isCallable = requireIsCallable();
	var tryToString = requireTryToString();

	var $TypeError = TypeError;

	// `Assert: IsCallable(argument) is true`
	aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw new $TypeError(tryToString(argument) + ' is not a function');
	};
	return aCallable;
}

var getMethod;
var hasRequiredGetMethod;

function requireGetMethod () {
	if (hasRequiredGetMethod) return getMethod;
	hasRequiredGetMethod = 1;
	var aCallable = requireACallable();
	var isNullOrUndefined = requireIsNullOrUndefined();

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	getMethod = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined(func) ? undefined : aCallable(func);
	};
	return getMethod;
}

var ordinaryToPrimitive;
var hasRequiredOrdinaryToPrimitive;

function requireOrdinaryToPrimitive () {
	if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
	hasRequiredOrdinaryToPrimitive = 1;
	var call = requireFunctionCall();
	var isCallable = requireIsCallable();
	var isObject = requireIsObject();

	var $TypeError = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	  throw new $TypeError("Can't convert object to primitive value");
	};
	return ordinaryToPrimitive;
}

var sharedStore = {exports: {}};

var isPure;
var hasRequiredIsPure;

function requireIsPure () {
	if (hasRequiredIsPure) return isPure;
	hasRequiredIsPure = 1;
	isPure = false;
	return isPure;
}

var defineGlobalProperty;
var hasRequiredDefineGlobalProperty;

function requireDefineGlobalProperty () {
	if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
	hasRequiredDefineGlobalProperty = 1;
	var globalThis = requireGlobalThis();

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;

	defineGlobalProperty = function (key, value) {
	  try {
	    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    globalThis[key] = value;
	  } return value;
	};
	return defineGlobalProperty;
}

var hasRequiredSharedStore;

function requireSharedStore () {
	if (hasRequiredSharedStore) return sharedStore.exports;
	hasRequiredSharedStore = 1;
	var IS_PURE = requireIsPure();
	var globalThis = requireGlobalThis();
	var defineGlobalProperty = requireDefineGlobalProperty();

	var SHARED = '__core-js_shared__';
	var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

	(store.versions || (store.versions = [])).push({
	  version: '3.40.0',
	  mode: IS_PURE ? 'pure' : 'global',
	  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	return sharedStore.exports;
}

var shared;
var hasRequiredShared;

function requireShared () {
	if (hasRequiredShared) return shared;
	hasRequiredShared = 1;
	var store = requireSharedStore();

	shared = function (key, value) {
	  return store[key] || (store[key] = value || {});
	};
	return shared;
}

var toObject;
var hasRequiredToObject;

function requireToObject () {
	if (hasRequiredToObject) return toObject;
	hasRequiredToObject = 1;
	var requireObjectCoercible = requireRequireObjectCoercible();

	var $Object = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	toObject = function (argument) {
	  return $Object(requireObjectCoercible(argument));
	};
	return toObject;
}

var hasOwnProperty_1;
var hasRequiredHasOwnProperty;

function requireHasOwnProperty () {
	if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
	hasRequiredHasOwnProperty = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var toObject = requireToObject();

	var hasOwnProperty = uncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};
	return hasOwnProperty_1;
}

var uid;
var hasRequiredUid;

function requireUid () {
	if (hasRequiredUid) return uid;
	hasRequiredUid = 1;
	var uncurryThis = requireFunctionUncurryThis();

	var id = 0;
	var postfix = Math.random();
	var toString = uncurryThis(1.0.toString);

	uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
	};
	return uid;
}

var wellKnownSymbol;
var hasRequiredWellKnownSymbol;

function requireWellKnownSymbol () {
	if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
	hasRequiredWellKnownSymbol = 1;
	var globalThis = requireGlobalThis();
	var shared = requireShared();
	var hasOwn = requireHasOwnProperty();
	var uid = requireUid();
	var NATIVE_SYMBOL = requireSymbolConstructorDetection();
	var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

	var Symbol = globalThis.Symbol;
	var WellKnownSymbolsStore = shared('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

	wellKnownSymbol = function (name) {
	  if (!hasOwn(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
	      ? Symbol[name]
	      : createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};
	return wellKnownSymbol;
}

var toPrimitive;
var hasRequiredToPrimitive;

function requireToPrimitive () {
	if (hasRequiredToPrimitive) return toPrimitive;
	hasRequiredToPrimitive = 1;
	var call = requireFunctionCall();
	var isObject = requireIsObject();
	var isSymbol = requireIsSymbol();
	var getMethod = requireGetMethod();
	var ordinaryToPrimitive = requireOrdinaryToPrimitive();
	var wellKnownSymbol = requireWellKnownSymbol();

	var $TypeError = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw new $TypeError("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};
	return toPrimitive;
}

var toPropertyKey;
var hasRequiredToPropertyKey;

function requireToPropertyKey () {
	if (hasRequiredToPropertyKey) return toPropertyKey;
	hasRequiredToPropertyKey = 1;
	var toPrimitive = requireToPrimitive();
	var isSymbol = requireIsSymbol();

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};
	return toPropertyKey;
}

var documentCreateElement;
var hasRequiredDocumentCreateElement;

function requireDocumentCreateElement () {
	if (hasRequiredDocumentCreateElement) return documentCreateElement;
	hasRequiredDocumentCreateElement = 1;
	var globalThis = requireGlobalThis();
	var isObject = requireIsObject();

	var document = globalThis.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document) && isObject(document.createElement);

	documentCreateElement = function (it) {
	  return EXISTS ? document.createElement(it) : {};
	};
	return documentCreateElement;
}

var ie8DomDefine;
var hasRequiredIe8DomDefine;

function requireIe8DomDefine () {
	if (hasRequiredIe8DomDefine) return ie8DomDefine;
	hasRequiredIe8DomDefine = 1;
	var DESCRIPTORS = requireDescriptors();
	var fails = requireFails();
	var createElement = requireDocumentCreateElement();

	// Thanks to IE8 for its funny defineProperty
	ie8DomDefine = !DESCRIPTORS && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a !== 7;
	});
	return ie8DomDefine;
}

var hasRequiredObjectGetOwnPropertyDescriptor;

function requireObjectGetOwnPropertyDescriptor () {
	if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
	hasRequiredObjectGetOwnPropertyDescriptor = 1;
	var DESCRIPTORS = requireDescriptors();
	var call = requireFunctionCall();
	var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
	var createPropertyDescriptor = requireCreatePropertyDescriptor();
	var toIndexedObject = requireToIndexedObject();
	var toPropertyKey = requireToPropertyKey();
	var hasOwn = requireHasOwnProperty();
	var IE8_DOM_DEFINE = requireIe8DomDefine();

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (IE8_DOM_DEFINE) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
	};
	return objectGetOwnPropertyDescriptor;
}

var objectDefineProperty = {};

var v8PrototypeDefineBug;
var hasRequiredV8PrototypeDefineBug;

function requireV8PrototypeDefineBug () {
	if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
	hasRequiredV8PrototypeDefineBug = 1;
	var DESCRIPTORS = requireDescriptors();
	var fails = requireFails();

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});
	return v8PrototypeDefineBug;
}

var anObject;
var hasRequiredAnObject;

function requireAnObject () {
	if (hasRequiredAnObject) return anObject;
	hasRequiredAnObject = 1;
	var isObject = requireIsObject();

	var $String = String;
	var $TypeError = TypeError;

	// `Assert: Type(argument) is Object`
	anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw new $TypeError($String(argument) + ' is not an object');
	};
	return anObject;
}

var hasRequiredObjectDefineProperty;

function requireObjectDefineProperty () {
	if (hasRequiredObjectDefineProperty) return objectDefineProperty;
	hasRequiredObjectDefineProperty = 1;
	var DESCRIPTORS = requireDescriptors();
	var IE8_DOM_DEFINE = requireIe8DomDefine();
	var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
	var anObject = requireAnObject();
	var toPropertyKey = requireToPropertyKey();

	var $TypeError = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	return objectDefineProperty;
}

var createNonEnumerableProperty;
var hasRequiredCreateNonEnumerableProperty;

function requireCreateNonEnumerableProperty () {
	if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
	hasRequiredCreateNonEnumerableProperty = 1;
	var DESCRIPTORS = requireDescriptors();
	var definePropertyModule = requireObjectDefineProperty();
	var createPropertyDescriptor = requireCreatePropertyDescriptor();

	createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
	  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};
	return createNonEnumerableProperty;
}

var makeBuiltIn = {exports: {}};

var functionName;
var hasRequiredFunctionName;

function requireFunctionName () {
	if (hasRequiredFunctionName) return functionName;
	hasRequiredFunctionName = 1;
	var DESCRIPTORS = requireDescriptors();
	var hasOwn = requireHasOwnProperty();

	var FunctionPrototype = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn(FunctionPrototype, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

	functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};
	return functionName;
}

var inspectSource;
var hasRequiredInspectSource;

function requireInspectSource () {
	if (hasRequiredInspectSource) return inspectSource;
	hasRequiredInspectSource = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var isCallable = requireIsCallable();
	var store = requireSharedStore();

	var functionToString = uncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(store.inspectSource)) {
	  store.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	inspectSource = store.inspectSource;
	return inspectSource;
}

var weakMapBasicDetection;
var hasRequiredWeakMapBasicDetection;

function requireWeakMapBasicDetection () {
	if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
	hasRequiredWeakMapBasicDetection = 1;
	var globalThis = requireGlobalThis();
	var isCallable = requireIsCallable();

	var WeakMap = globalThis.WeakMap;

	weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
	return weakMapBasicDetection;
}

var sharedKey;
var hasRequiredSharedKey;

function requireSharedKey () {
	if (hasRequiredSharedKey) return sharedKey;
	hasRequiredSharedKey = 1;
	var shared = requireShared();
	var uid = requireUid();

	var keys = shared('keys');

	sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};
	return sharedKey;
}

var hiddenKeys;
var hasRequiredHiddenKeys;

function requireHiddenKeys () {
	if (hasRequiredHiddenKeys) return hiddenKeys;
	hasRequiredHiddenKeys = 1;
	hiddenKeys = {};
	return hiddenKeys;
}

var internalState;
var hasRequiredInternalState;

function requireInternalState () {
	if (hasRequiredInternalState) return internalState;
	hasRequiredInternalState = 1;
	var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
	var globalThis = requireGlobalThis();
	var isObject = requireIsObject();
	var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	var hasOwn = requireHasOwnProperty();
	var shared = requireSharedStore();
	var sharedKey = requireSharedKey();
	var hiddenKeys = requireHiddenKeys();

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError = globalThis.TypeError;
	var WeakMap = globalThis.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set = function (it, metadata) {
	    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store.get(it) || {};
	  };
	  has = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwn(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn(it, STATE);
	  };
	}

	internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};
	return internalState;
}

var hasRequiredMakeBuiltIn;

function requireMakeBuiltIn () {
	if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
	hasRequiredMakeBuiltIn = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var fails = requireFails();
	var isCallable = requireIsCallable();
	var hasOwn = requireHasOwnProperty();
	var DESCRIPTORS = requireDescriptors();
	var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
	var inspectSource = requireInspectSource();
	var InternalStateModule = requireInternalState();

	var enforceInternalState = InternalStateModule.enforce;
	var getInternalState = InternalStateModule.get;
	var $String = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;
	var stringSlice = uncurryThis(''.slice);
	var replace = uncurryThis(''.replace);
	var join = uncurryThis([].join);

	var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
	  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn$1 = makeBuiltIn.exports = function (value, name, options) {
	  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
	    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
	    else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
	    defineProperty(value, 'length', { value: options.arity });
	  }
	  try {
	    if (options && hasOwn(options, 'constructor') && options.constructor) {
	      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
	    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) { /* empty */ }
	  var state = enforceInternalState(value);
	  if (!hasOwn(state, 'source')) {
	    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
	  } return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$1(function toString() {
	  return isCallable(this) && getInternalState(this).source || inspectSource(this);
	}, 'toString');
	return makeBuiltIn.exports;
}

var defineBuiltIn;
var hasRequiredDefineBuiltIn;

function requireDefineBuiltIn () {
	if (hasRequiredDefineBuiltIn) return defineBuiltIn;
	hasRequiredDefineBuiltIn = 1;
	var isCallable = requireIsCallable();
	var definePropertyModule = requireObjectDefineProperty();
	var makeBuiltIn = requireMakeBuiltIn();
	var defineGlobalProperty = requireDefineGlobalProperty();

	defineBuiltIn = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable(value)) makeBuiltIn(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;
	    else defineGlobalProperty(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];
	      else if (O[key]) simple = true;
	    } catch (error) { /* empty */ }
	    if (simple) O[key] = value;
	    else definePropertyModule.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  } return O;
	};
	return defineBuiltIn;
}

var objectGetOwnPropertyNames = {};

var mathTrunc;
var hasRequiredMathTrunc;

function requireMathTrunc () {
	if (hasRequiredMathTrunc) return mathTrunc;
	hasRequiredMathTrunc = 1;
	var ceil = Math.ceil;
	var floor = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor : ceil)(n);
	};
	return mathTrunc;
}

var toIntegerOrInfinity;
var hasRequiredToIntegerOrInfinity;

function requireToIntegerOrInfinity () {
	if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
	hasRequiredToIntegerOrInfinity = 1;
	var trunc = requireMathTrunc();

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : trunc(number);
	};
	return toIntegerOrInfinity;
}

var toAbsoluteIndex;
var hasRequiredToAbsoluteIndex;

function requireToAbsoluteIndex () {
	if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
	hasRequiredToAbsoluteIndex = 1;
	var toIntegerOrInfinity = requireToIntegerOrInfinity();

	var max = Math.max;
	var min = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
	};
	return toAbsoluteIndex;
}

var toLength;
var hasRequiredToLength;

function requireToLength () {
	if (hasRequiredToLength) return toLength;
	hasRequiredToLength = 1;
	var toIntegerOrInfinity = requireToIntegerOrInfinity();

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	toLength = function (argument) {
	  var len = toIntegerOrInfinity(argument);
	  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};
	return toLength;
}

var lengthOfArrayLike;
var hasRequiredLengthOfArrayLike;

function requireLengthOfArrayLike () {
	if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
	hasRequiredLengthOfArrayLike = 1;
	var toLength = requireToLength();

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};
	return lengthOfArrayLike;
}

var arrayIncludes;
var hasRequiredArrayIncludes;

function requireArrayIncludes () {
	if (hasRequiredArrayIncludes) return arrayIncludes;
	hasRequiredArrayIncludes = 1;
	var toIndexedObject = requireToIndexedObject();
	var toAbsoluteIndex = requireToAbsoluteIndex();
	var lengthOfArrayLike = requireLengthOfArrayLike();

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    if (length === 0) return !IS_INCLUDES && -1;
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el !== el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value !== value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};
	return arrayIncludes;
}

var objectKeysInternal;
var hasRequiredObjectKeysInternal;

function requireObjectKeysInternal () {
	if (hasRequiredObjectKeysInternal) return objectKeysInternal;
	hasRequiredObjectKeysInternal = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var hasOwn = requireHasOwnProperty();
	var toIndexedObject = requireToIndexedObject();
	var indexOf = requireArrayIncludes().indexOf;
	var hiddenKeys = requireHiddenKeys();

	var push = uncurryThis([].push);

	objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn(O, key = names[i++])) {
	    ~indexOf(result, key) || push(result, key);
	  }
	  return result;
	};
	return objectKeysInternal;
}

var enumBugKeys;
var hasRequiredEnumBugKeys;

function requireEnumBugKeys () {
	if (hasRequiredEnumBugKeys) return enumBugKeys;
	hasRequiredEnumBugKeys = 1;
	// IE8- don't enum bug keys
	enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];
	return enumBugKeys;
}

var hasRequiredObjectGetOwnPropertyNames;

function requireObjectGetOwnPropertyNames () {
	if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
	hasRequiredObjectGetOwnPropertyNames = 1;
	var internalObjectKeys = requireObjectKeysInternal();
	var enumBugKeys = requireEnumBugKeys();

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys(O, hiddenKeys);
	};
	return objectGetOwnPropertyNames;
}

var objectGetOwnPropertySymbols = {};

var hasRequiredObjectGetOwnPropertySymbols;

function requireObjectGetOwnPropertySymbols () {
	if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
	hasRequiredObjectGetOwnPropertySymbols = 1;
	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
	return objectGetOwnPropertySymbols;
}

var ownKeys$4;
var hasRequiredOwnKeys;

function requireOwnKeys () {
	if (hasRequiredOwnKeys) return ownKeys$4;
	hasRequiredOwnKeys = 1;
	var getBuiltIn = requireGetBuiltIn();
	var uncurryThis = requireFunctionUncurryThis();
	var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
	var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
	var anObject = requireAnObject();

	var concat = uncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	ownKeys$4 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};
	return ownKeys$4;
}

var copyConstructorProperties;
var hasRequiredCopyConstructorProperties;

function requireCopyConstructorProperties () {
	if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
	hasRequiredCopyConstructorProperties = 1;
	var hasOwn = requireHasOwnProperty();
	var ownKeys = requireOwnKeys();
	var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
	var definePropertyModule = requireObjectDefineProperty();

	copyConstructorProperties = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};
	return copyConstructorProperties;
}

var isForced_1;
var hasRequiredIsForced;

function requireIsForced () {
	if (hasRequiredIsForced) return isForced_1;
	hasRequiredIsForced = 1;
	var fails = requireFails();
	var isCallable = requireIsCallable();

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value === POLYFILL ? true
	    : value === NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	isForced_1 = isForced;
	return isForced_1;
}

var _export;
var hasRequired_export;

function require_export () {
	if (hasRequired_export) return _export;
	hasRequired_export = 1;
	var globalThis = requireGlobalThis();
	var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
	var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	var defineBuiltIn = requireDefineBuiltIn();
	var defineGlobalProperty = requireDefineGlobalProperty();
	var copyConstructorProperties = requireCopyConstructorProperties();
	var isForced = requireIsForced();

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	_export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = globalThis;
	  } else if (STATIC) {
	    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = globalThis[TARGET] && globalThis[TARGET].prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn(target, key, sourceProperty, options);
	  }
	};
	return _export;
}

var toStringTagSupport;
var hasRequiredToStringTagSupport;

function requireToStringTagSupport () {
	if (hasRequiredToStringTagSupport) return toStringTagSupport;
	hasRequiredToStringTagSupport = 1;
	var wellKnownSymbol = requireWellKnownSymbol();

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	toStringTagSupport = String(test) === '[object z]';
	return toStringTagSupport;
}

var classof;
var hasRequiredClassof;

function requireClassof () {
	if (hasRequiredClassof) return classof;
	hasRequiredClassof = 1;
	var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
	var isCallable = requireIsCallable();
	var classofRaw = requireClassofRaw();
	var wellKnownSymbol = requireWellKnownSymbol();

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var $Object = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	classof = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};
	return classof;
}

var toString;
var hasRequiredToString;

function requireToString () {
	if (hasRequiredToString) return toString;
	hasRequiredToString = 1;
	var classof = requireClassof();

	var $String = String;

	toString = function (argument) {
	  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
	  return $String(argument);
	};
	return toString;
}

var regexpFlags;
var hasRequiredRegexpFlags;

function requireRegexpFlags () {
	if (hasRequiredRegexpFlags) return regexpFlags;
	hasRequiredRegexpFlags = 1;
	var anObject = requireAnObject();

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.hasIndices) result += 'd';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.unicodeSets) result += 'v';
	  if (that.sticky) result += 'y';
	  return result;
	};
	return regexpFlags;
}

var regexpStickyHelpers;
var hasRequiredRegexpStickyHelpers;

function requireRegexpStickyHelpers () {
	if (hasRequiredRegexpStickyHelpers) return regexpStickyHelpers;
	hasRequiredRegexpStickyHelpers = 1;
	var fails = requireFails();
	var globalThis = requireGlobalThis();

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp = globalThis.RegExp;

	var UNSUPPORTED_Y = fails(function () {
	  var re = $RegExp('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') !== null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
	  return !$RegExp('a', 'y').sticky;
	});

	var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') !== null;
	});

	regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY,
	  UNSUPPORTED_Y: UNSUPPORTED_Y
	};
	return regexpStickyHelpers;
}

var objectDefineProperties = {};

var objectKeys;
var hasRequiredObjectKeys;

function requireObjectKeys () {
	if (hasRequiredObjectKeys) return objectKeys;
	hasRequiredObjectKeys = 1;
	var internalObjectKeys = requireObjectKeysInternal();
	var enumBugKeys = requireEnumBugKeys();

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	objectKeys = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys);
	};
	return objectKeys;
}

var hasRequiredObjectDefineProperties;

function requireObjectDefineProperties () {
	if (hasRequiredObjectDefineProperties) return objectDefineProperties;
	hasRequiredObjectDefineProperties = 1;
	var DESCRIPTORS = requireDescriptors();
	var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
	var definePropertyModule = requireObjectDefineProperty();
	var anObject = requireAnObject();
	var toIndexedObject = requireToIndexedObject();
	var objectKeys = requireObjectKeys();

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
	  return O;
	};
	return objectDefineProperties;
}

var html;
var hasRequiredHtml;

function requireHtml () {
	if (hasRequiredHtml) return html;
	hasRequiredHtml = 1;
	var getBuiltIn = requireGetBuiltIn();

	html = getBuiltIn('document', 'documentElement');
	return html;
}

var objectCreate;
var hasRequiredObjectCreate;

function requireObjectCreate () {
	if (hasRequiredObjectCreate) return objectCreate;
	hasRequiredObjectCreate = 1;
	/* global ActiveXObject -- old IE, WSH */
	var anObject = requireAnObject();
	var definePropertiesModule = requireObjectDefineProperties();
	var enumBugKeys = requireEnumBugKeys();
	var hiddenKeys = requireHiddenKeys();
	var html = requireHtml();
	var documentCreateElement = requireDocumentCreateElement();
	var sharedKey = requireSharedKey();

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
	  activeXDocument = null;
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	};
	return objectCreate;
}

var regexpUnsupportedDotAll;
var hasRequiredRegexpUnsupportedDotAll;

function requireRegexpUnsupportedDotAll () {
	if (hasRequiredRegexpUnsupportedDotAll) return regexpUnsupportedDotAll;
	hasRequiredRegexpUnsupportedDotAll = 1;
	var fails = requireFails();
	var globalThis = requireGlobalThis();

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp = globalThis.RegExp;

	regexpUnsupportedDotAll = fails(function () {
	  var re = $RegExp('.', 's');
	  return !(re.dotAll && re.test('\n') && re.flags === 's');
	});
	return regexpUnsupportedDotAll;
}

var regexpUnsupportedNcg;
var hasRequiredRegexpUnsupportedNcg;

function requireRegexpUnsupportedNcg () {
	if (hasRequiredRegexpUnsupportedNcg) return regexpUnsupportedNcg;
	hasRequiredRegexpUnsupportedNcg = 1;
	var fails = requireFails();
	var globalThis = requireGlobalThis();

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = globalThis.RegExp;

	regexpUnsupportedNcg = fails(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});
	return regexpUnsupportedNcg;
}

var regexpExec;
var hasRequiredRegexpExec;

function requireRegexpExec () {
	if (hasRequiredRegexpExec) return regexpExec;
	hasRequiredRegexpExec = 1;
	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */
	var call = requireFunctionCall();
	var uncurryThis = requireFunctionUncurryThis();
	var toString = requireToString();
	var regexpFlags = requireRegexpFlags();
	var stickyHelpers = requireRegexpStickyHelpers();
	var shared = requireShared();
	var create = requireObjectCreate();
	var getInternalState = requireInternalState().get;
	var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
	var UNSUPPORTED_NCG = requireRegexpUnsupportedNcg();

	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt = uncurryThis(''.charAt);
	var indexOf = uncurryThis(''.indexOf);
	var replace = uncurryThis(''.replace);
	var stringSlice = uncurryThis(''.slice);

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  call(nativeExec, re1, 'a');
	  call(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState(re);
	    var str = toString(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = call(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y && re.sticky;
	    var flags = call(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace(flags, 'y', '');
	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = call(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice(match.input, charsAdded);
	        match[0] = stringSlice(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
	      call(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = create(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	regexpExec = patchedExec;
	return regexpExec;
}

var hasRequiredEs_regexp_exec;

function requireEs_regexp_exec () {
	if (hasRequiredEs_regexp_exec) return es_regexp_exec;
	hasRequiredEs_regexp_exec = 1;
	var $ = require_export();
	var exec = requireRegexpExec();

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
	  exec: exec
	});
	return es_regexp_exec;
}

requireEs_regexp_exec();

var es_string_replace = {};

var functionApply;
var hasRequiredFunctionApply;

function requireFunctionApply () {
	if (hasRequiredFunctionApply) return functionApply;
	hasRequiredFunctionApply = 1;
	var NATIVE_BIND = requireFunctionBindNative();

	var FunctionPrototype = Function.prototype;
	var apply = FunctionPrototype.apply;
	var call = FunctionPrototype.call;

	// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
	functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
	  return call.apply(apply, arguments);
	});
	return functionApply;
}

var fixRegexpWellKnownSymbolLogic;
var hasRequiredFixRegexpWellKnownSymbolLogic;

function requireFixRegexpWellKnownSymbolLogic () {
	if (hasRequiredFixRegexpWellKnownSymbolLogic) return fixRegexpWellKnownSymbolLogic;
	hasRequiredFixRegexpWellKnownSymbolLogic = 1;
	// TODO: Remove from `core-js@4` since it's moved to entry points
	requireEs_regexp_exec();
	var call = requireFunctionCall();
	var defineBuiltIn = requireDefineBuiltIn();
	var regexpExec = requireRegexpExec();
	var fails = requireFails();
	var wellKnownSymbol = requireWellKnownSymbol();
	var createNonEnumerableProperty = requireCreateNonEnumerableProperty();

	var SPECIES = wellKnownSymbol('species');
	var RegExpPrototype = RegExp.prototype;

	fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegExp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) !== 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var $exec = regexp.exec;
	      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: call(nativeRegExpMethod, regexp, str, arg2) };
	        }
	        return { done: true, value: call(nativeMethod, str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    defineBuiltIn(String.prototype, KEY, methods[0]);
	    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};
	return fixRegexpWellKnownSymbolLogic;
}

var stringMultibyte;
var hasRequiredStringMultibyte;

function requireStringMultibyte () {
	if (hasRequiredStringMultibyte) return stringMultibyte;
	hasRequiredStringMultibyte = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var toIntegerOrInfinity = requireToIntegerOrInfinity();
	var toString = requireToString();
	var requireObjectCoercible = requireRequireObjectCoercible();

	var charAt = uncurryThis(''.charAt);
	var charCodeAt = uncurryThis(''.charCodeAt);
	var stringSlice = uncurryThis(''.slice);

	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};
	return stringMultibyte;
}

var advanceStringIndex;
var hasRequiredAdvanceStringIndex;

function requireAdvanceStringIndex () {
	if (hasRequiredAdvanceStringIndex) return advanceStringIndex;
	hasRequiredAdvanceStringIndex = 1;
	var charAt = requireStringMultibyte().charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};
	return advanceStringIndex;
}

var getSubstitution;
var hasRequiredGetSubstitution;

function requireGetSubstitution () {
	if (hasRequiredGetSubstitution) return getSubstitution;
	hasRequiredGetSubstitution = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var toObject = requireToObject();

	var floor = Math.floor;
	var charAt = uncurryThis(''.charAt);
	var replace = uncurryThis(''.replace);
	var stringSlice = uncurryThis(''.slice);
	// eslint-disable-next-line redos/no-vulnerable -- safe
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (charAt(ch, 0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return stringSlice(str, 0, position);
	      case "'": return stringSlice(str, tailPos);
	      case '<':
	        capture = namedCaptures[stringSlice(ch, 1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};
	return getSubstitution;
}

var regexpExecAbstract;
var hasRequiredRegexpExecAbstract;

function requireRegexpExecAbstract () {
	if (hasRequiredRegexpExecAbstract) return regexpExecAbstract;
	hasRequiredRegexpExecAbstract = 1;
	var call = requireFunctionCall();
	var anObject = requireAnObject();
	var isCallable = requireIsCallable();
	var classof = requireClassofRaw();
	var regexpExec = requireRegexpExec();

	var $TypeError = TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable(exec)) {
	    var result = call(exec, R, S);
	    if (result !== null) anObject(result);
	    return result;
	  }
	  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
	  throw new $TypeError('RegExp#exec called on incompatible receiver');
	};
	return regexpExecAbstract;
}

var hasRequiredEs_string_replace;

function requireEs_string_replace () {
	if (hasRequiredEs_string_replace) return es_string_replace;
	hasRequiredEs_string_replace = 1;
	var apply = requireFunctionApply();
	var call = requireFunctionCall();
	var uncurryThis = requireFunctionUncurryThis();
	var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
	var fails = requireFails();
	var anObject = requireAnObject();
	var isCallable = requireIsCallable();
	var isNullOrUndefined = requireIsNullOrUndefined();
	var toIntegerOrInfinity = requireToIntegerOrInfinity();
	var toLength = requireToLength();
	var toString = requireToString();
	var requireObjectCoercible = requireRequireObjectCoercible();
	var advanceStringIndex = requireAdvanceStringIndex();
	var getMethod = requireGetMethod();
	var getSubstitution = requireGetSubstitution();
	var regExpExec = requireRegexpExecAbstract();
	var wellKnownSymbol = requireWellKnownSymbol();

	var REPLACE = wellKnownSymbol('replace');
	var max = Math.max;
	var min = Math.min;
	var concat = uncurryThis([].concat);
	var push = uncurryThis([].push);
	var stringIndexOf = uncurryThis(''.indexOf);
	var stringSlice = uncurryThis(''.slice);

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
	  return ''.replace(re, '$<a>') !== '7';
	});

	// @@replace logic
	fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.es/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = isNullOrUndefined(searchValue) ? undefined : getMethod(searchValue, REPLACE);
	      return replacer
	        ? call(replacer, searchValue, O, replaceValue)
	        : call(nativeReplace, toString(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (string, replaceValue) {
	      var rx = anObject(this);
	      var S = toString(string);

	      if (
	        typeof replaceValue == 'string' &&
	        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
	        stringIndexOf(replaceValue, '$<') === -1
	      ) {
	        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	        if (res.done) return res.value;
	      }

	      var functionalReplace = isCallable(replaceValue);
	      if (!functionalReplace) replaceValue = toString(replaceValue);

	      var global = rx.global;
	      var fullUnicode;
	      if (global) {
	        fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }

	      var results = [];
	      var result;
	      while (true) {
	        result = regExpExec(rx, S);
	        if (result === null) break;

	        push(results, result);
	        if (!global) break;

	        var matchStr = toString(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = toString(result[0]);
	        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
	        var captures = [];
	        var replacement;
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = concat([matched], captures, position, S);
	          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
	          replacement = toString(apply(replaceValue, undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }

	      return accumulatedResult + stringSlice(S, nextSourcePosition);
	    }
	  ];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
	return es_string_replace;
}

requireEs_string_replace();

var IconContext = /*#__PURE__*/React.createContext({});

var _excluded$2 = ["className", "component", "viewBox", "spin", "rotate", "tabIndex", "onClick", "children"];
function ownKeys$3(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols$1) { var o = _Object$getOwnPropertySymbols$1(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var _context, _context2; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context = ownKeys$3(Object(t), !0)).call(_context, function (r) { _defineProperty(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context2 = ownKeys$3(Object(t))).call(_context2, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
function warning(valid, message) {
  warn__default["default"](valid, "[@ant-design/icons] ".concat(message));
}
var iconStyles = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
var useInsertStyles = function useInsertStyles(eleRef) {
  var _useContext = React.useContext(IconContext),
    csp = _useContext.csp,
    prefixCls = _useContext.prefixCls;
  var mergedStyleStr = iconStyles;
  if (prefixCls) {
    mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
  }
  React.useEffect(function () {
    var ele = eleRef.current;
    if (ele) {
      var shadowRoot = shadow.getShadowRoot(ele);
      dynamicCSS.updateCSS(mergedStyleStr, '@ant-design-icons', {
        prepend: true,
        csp: csp,
        attachTo: shadowRoot
      });
    }
  }, []);
};
var svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false'
};
var Icon = /*#__PURE__*/React__namespace.forwardRef(function (props, ref$1) {
  var prefixCls = 'anticon';
  var className = props.className,
    Component = props.component,
    viewBox = props.viewBox,
    spin = props.spin,
    rotate = props.rotate,
    tabIndex = props.tabIndex,
    onClick = props.onClick,
    children = props.children,
    restProps = _objectWithoutProperties(props, _excluded$2);
  var iconRef = React.useRef();
  var mergedRef = ref.useComposeRef(iconRef, ref$1);
  warning(Boolean(Component || children), 'Should have `component` prop or `children`.');
  useInsertStyles(iconRef);
  var classString = classNames__default["default"](prefixCls, _defineProperty({}, "".concat(prefixCls, "-spin"), !!spin && !!Component), className);
  var svgClassString = classNames__default["default"](_defineProperty({}, "".concat(prefixCls, "-spin"), !!spin));
  var svgStyle = rotate ? {
    msTransform: "rotate(".concat(rotate, "deg)"),
    transform: "rotate(".concat(rotate, "deg)")
  } : undefined;
  var innerSvgProps = _objectSpread$3(_objectSpread$3({}, svgBaseProps), {}, {
    className: svgClassString,
    style: svgStyle,
    viewBox: viewBox
  });
  if (!viewBox) {
    delete innerSvgProps.viewBox;
  }

  // component > children
  var renderInnerNode = function renderInnerNode() {
    if (Component) {
      return /*#__PURE__*/jsxRuntime.jsx(Component, _objectSpread$3(_objectSpread$3({}, innerSvgProps), {}, {
        children: children
      }));
    }
    if (children) {
      warning(Boolean(viewBox) || React__namespace.Children.count(children) === 1 && /*#__PURE__*/React__namespace.isValidElement(children) && React__namespace.Children.only(children).type === 'use', 'Make sure that you provide correct `viewBox`' + ' prop (default `0 0 1024 1024`) to the icon.');
      return /*#__PURE__*/jsxRuntime.jsx("svg", _objectSpread$3(_objectSpread$3({}, innerSvgProps), {}, {
        viewBox: viewBox,
        children: children
      }));
    }
    return null;
  };
  var iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }
  return /*#__PURE__*/jsxRuntime.jsx("span", _objectSpread$3(_objectSpread$3({
    role: "img"
  }, restProps), {}, {
    ref: mergedRef,
    tabIndex: iconTabIndex,
    onClick: onClick,
    className: classString,
    children: renderInnerNode()
  }));
});
Icon.displayName = 'AntdIcon';

var _excluded$1 = ["type", "children"];
function ownKeys$2(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols$1) { var o = _Object$getOwnPropertySymbols$1(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var _context, _context2; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context = ownKeys$2(Object(t), !0)).call(_context, function (r) { _defineProperty(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context2 = ownKeys$2(Object(t))).call(_context2, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
var customCache = new _Set();
function isValidCustomScriptUrl(scriptUrl) {
  return Boolean(typeof scriptUrl === 'string' && scriptUrl.length && !customCache.has(scriptUrl));
}
function createScriptUrlElements(scriptUrls) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var currentScriptUrl = scriptUrls[index];
  if (isValidCustomScriptUrl(currentScriptUrl)) {
    var script = document.createElement('script');
    script.setAttribute('src', currentScriptUrl);
    script.setAttribute('data-namespace', currentScriptUrl);
    if (scriptUrls.length > index + 1) {
      script.onload = function () {
        createScriptUrlElements(scriptUrls, index + 1);
      };
      script.onerror = function () {
        createScriptUrlElements(scriptUrls, index + 1);
      };
    }
    customCache.add(currentScriptUrl);
    document.body.appendChild(script);
  }
}
function createIconFont() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var scriptUrl = options.scriptUrl,
    _options$extraCommonP = options.extraCommonProps,
    extraCommonProps = _options$extraCommonP === void 0 ? {} : _options$extraCommonP;

  /**
   * DOM API required.
   * Make sure in browser environment.
   * The Custom Icon will create a <script/>
   * that loads SVG symbols and insert the SVG Element into the document body.
   */
  if (scriptUrl && typeof document !== 'undefined' && typeof window !== 'undefined' && typeof document.createElement === 'function') {
    if (_Array$isArray(scriptUrl)) {
      // 因为iconfont资源会把svg插入before，所以前加载相同type会覆盖后加载，为了数组覆盖顺序，倒叙插入
      createScriptUrlElements(_reverseInstanceProperty(scriptUrl).call(scriptUrl));
    } else {
      createScriptUrlElements([scriptUrl]);
    }
  }
  var Iconfont = /*#__PURE__*/React__default["default"].forwardRef(function (props, ref) {
    var type = props.type,
      children = props.children,
      restProps = _objectWithoutProperties(props, _excluded$1);

    // children > type
    var content = null;
    if (props.type) {
      content = /*#__PURE__*/jsxRuntime.jsx("use", {
        xlinkHref: "#".concat(type)
      });
    }
    if (children) {
      content = children;
    }
    return /*#__PURE__*/jsxRuntime.jsx(Icon, _objectSpread$2(_objectSpread$2(_objectSpread$2({}, extraCommonProps), restProps), {}, {
      ref: ref,
      children: content
    }));
  });
  Iconfont.displayName = 'Iconfont';
  return Iconfont;
}

function ownKeys$1(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols$1) { var o = _Object$getOwnPropertySymbols$1(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var _context, _context2; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context = ownKeys$1(Object(t), !0)).call(_context, function (r) { _defineProperty(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context2 = ownKeys$1(Object(t))).call(_context2, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
var createFontIcon = function createFontIcon() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _URL('./iconfont.js', (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('main.js', document.baseURI).href))).href;
  return createIconFont({
    scriptUrl: [url]
  });
};
var IconFont = function IconFont(props) {
  var url = props.url;
  var OnlineFontIcon = createFontIcon(url);
  var type = props.type || '';
  if (!_startsWithInstanceProperty(type).call(type, 'icon-')) {
    type = "icon-".concat(type);
  }
  return /*#__PURE__*/jsxRuntime.jsx(OnlineFontIcon, _objectSpread$1(_objectSpread$1({}, props), {}, {
    type: type
  }));
};

var _excluded = ["text", "content", "children"];
function ownKeys(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols$1) { var o = _Object$getOwnPropertySymbols$1(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context, _context2; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(t), !0)).call(_context, function (r) { _defineProperty(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context2 = ownKeys(Object(t))).call(_context2, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
var Tooltip = function Tooltip(_ref) {
  var text = _ref.text,
    content = _ref.content,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/jsxRuntime.jsx(Tippy__default["default"], _objectSpread(_objectSpread({
    interactive: true,
    content: content || /*#__PURE__*/jsxRuntime.jsx("div", {
      className: 'tide-menu-bar__tooltip',
      children: text
    })
  }, props), {}, {
    children: children
  }));
};

exports.Iconfont = IconFont;
exports.Tooltip = Tooltip;
//# sourceMappingURL=main.js.map
