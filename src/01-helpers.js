// `helpers` contains a collection of helper functions. They are used internally but get `export`ed as well.



// EcmaScript 5 strict mode. Because all modules get concatenated, this applies to all of them.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode for more about ES5 strict mode.
"strict mode";



// Proxy for `Object.create`. Create a new inherited object from another object. See https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/create and http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object for more.
var inherit = exports.inherit = Object.create;
