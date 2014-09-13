// velo | Jannis R | v0.1.0 | https://github.com/derhuerst/velo





!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.velo=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// core/helpers
// `helpers` contains a collection of useful functions.



// todo: strict mdoe



// A do-nothing function used as a default callback.
var noop = function () {};



// A reference to `hasOwnProperty`.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
var hasProp = {}.hasOwnProperty;



// Let the child child "class" inherit from the parent "class".
// Taken from the CoffeeScript project (http://techoctave.com/c7/posts/93-simple-javascript-inheritance-using-coffeescript-extends).
var inherit = function (child, parent) {
	for (var key in parent) {
		if (hasProp.call(parent, key))
			child[key] = parent[key];
	}

	function ctor() {
		this.constructor = child;
	}

	ctor.prototype = parent.prototype;
	child.prototype = new ctor();

	return child;
};



// Extend the `target` object by the keys and values of the `source` object.
// Stolen from the zepto.js project (https://github.com/madrobby/zepto/blob/1d94d92223a5ec2edf1fbe18a7a9cc717e7663e4/src/zepto.js#L223) and customized.
var extend = function (target, source) {
	for (key in source) {
		if (source[key] !== undefined)
			target[key] = source[key];
	}
	return target
};

// core/Vector
// `Vector` represents a 2D vector. It is used as a position or translation.



// Export the `Vector` "class" and a shorthand.
exports.Vector = Vector;
exports.v = function (x, y) {
	return new Vector(x, y);
};



// Create a new Vector by `x` and `y`.
function Vector (x, y){
	this.x = x || 0;    // The x property, which can be changed without hassle.
	this.y = y || 0;    // The y property, which can be changed without hassle.
}



// We can easily overwrite the prototype because `Vector` has no super class.
Vector.prototype = {



	// Change the `x` and `y` values relatively. Either one `Vector` object or two values can be passed.
	add: function (x, y) {
		if (y !== null) {    // Two arguments have been passed, using them as raw values.
			this.x += x;
			this.y += y;
		} else if (x !== null) {    // Only one argument has been passed, using it as a `Vector` object.
			this.x += x.x;
			this.y += y.y;
		}

		return this;    // Make method chaining possible.
	},



	// Apply a rotation of `angle` to the `x` and `y` values.
	rotate: function (angle) {    // todo: length
		this.x = Math.cos(angle) * x;
		this.y = Math.sin(angle) * y;

		return this;    // Make method chaining possible.
	},



	// Check if the `x` and `y` values of this vector are equal to given ones. Either one `Vector` object or two values can be passed.
	equals: function (x, y) {
		if (y !== null)    // Two arguments has been passed, using them as raw values.
			return this.x === x.x && this.y === x.y;
		return this.x === x && this.y === y;
	},



	// Return a new `Vector` object with the same values. The returned vector then `equals` to this one.
	clone: function () {
		return exports.v(this.x, this.y);    // shorthand for `new Vector(…)`
	}



};

// core/List
// `List` is a native Array with a few comfort methods. It is used for lists of child nodes or vertices.



// Export the `List` "class" and a shorthand.
exports.List = List;
exports.l = function (items) {
	return new List(items);
};



// Let `List` inherit from `Array`.
inherit(List, Array);



// Create a new `List` of the given `items`.
function List (items) {
	Array.call(this, items);    // call the super class constructor
}



// Add methods to the prototype of `List`.
extend(List.prototype, {



	// Add `item` to the list if it isn't alerady stored.
	add: function (item) {
		if (this.indexOf(item) < 0)
			this.push(item);
	},


	// Remove `item` from the list.
	remove: function (item, i) {    // Short declaration of `i` in the arguments list.
		if (i = items.indexOf(item) >= 0)
			items.splice(i, item);
	},


	// Return wether `item` exists in the list.
	has: function (item) {
		return this._items.indexOf(item) >= 0;
	},



	// Call `method` by name with all further arguments on every item in the list.
	call: function () {
		new Array(arguments);    // Convert to real `Array`.
		for (var i = 0, length = this.length; i < length; i++) {
			this[i][arguments.shift()].apply(this[i], arguments);
		}
	}



});

// core/Node
// `Node` is a base class for everything that will be rendered. Every `Node` object has a `parent`, `position`, `rotation` and can store child nodes in `children`.
// *velo* works with a tree of nodes, each of which has a position and a rotation relative to its parent node. Whenever the user changes a node's `parent`, (relative) position or (relative) `rotation`, `_update` recomputes the (absolute) position and rotation. `Shape` objects inheriting from `Node` can then draw onto the untranslated and unrotated canvas using `_absolute`. This way, rendering will be fast, because the transformations do not have to be recomputed on each render cycle.



// Export the `Node` "class" and a shorthand.
exports.Node = Node;
exports.n = function (options) {
	return new Node(options);
};



// Create a new `Node` based on `parent`, `position`, `rotation` and `children`.
function Node (options) {
	options = options || {};

	// The parent `Node` object.
	this._parent = options.parent || null;
	// The position relative to the node's parent as a `Vector` object.
	this._position = options.position || exports.v();
	// The rotation relative to the node's parent in radians.
	this._rotation = options.rotation || 0;
	// The list of child nodes.
	this.children = exports.l(options.children);    // shorthand for `new List(…)`

	this._update();    // Recompute the the absolute translation.
}



// Add methods to the prototype of `Node`.
extend(Node.prototype, {



	// With no arguments, get the node's parent node. Otherwise, set the node's parent to `Node` and recompute the the absolute translation.
	parent: function (node) {
		if (arguments.length === 0)    // no parent node given
			return this._parent    // work as getter

		// parent node given, work as setter
		this._parent = node || null;
		this._root = node ? node._root : null;

		this._update();    // Recompute the the absolute translation.
	},


	// With no arguments, get the node's position. Otherwise change the position and recompute the the absolute translation.
	// If `relative` is `true`, translate position by `vector`. Otherwise, set the position to `vector`.
	position: function (vector, relative) {
		if (arguments.length === 0)    // no vector given
			return this._rotation;    // work as getter

		// vector given, work as setter
		if (relative === true)
			this._position.add(vector);
		else
			this._position = node;

		this._update();    // Recompute the the absolute translation.
	},


	// With no arguments, get the node's rotation. Otherwise, set the rotation to `angle` and recompute the the absolute translation.
	rotation: function (angle) {
		if (arguments.length === 0)    // no angle node given
			return this._rotation    // work as getter

		// angle given, work as setter
		this._rotation = angle;

		this._update();    // Recompute the the absolute translation.
	},



	// Recompute the absolute translations in `_absolute` and `_update` all children.
	// Note: This node's rotation doesn't affect its rotation, but its drawing and children.
	_update: function () {
		var thus = this, parent = thus._parent;    // aliases for shorter code

		thus._absRotation = thus._rotation;
		if (parent){
			thus._absPosition = thus._absolute(thus._position, parent._absPosition, parent._absRotation);
			thus._absRotation += parent._absRotation;
		} else
			thus._absPosition = thus._position.clone();

		// Call update on all child nodes, because they are affected by changes on this node.
		thus.children.call('_update');
	},



	// Helper function to compute a node's absolute position based on
	// - this node's (relative) position,
	// - the parent node's (absolute) position,
	// - the parent node's (absolute) rotation.
	_absolute: function (position, parentAbsolutePosition, parentAbsoluteRotation) {
		return position.clone()    // Take this node's relative position, clone it,
		.rotate(parentAbsoluteRotation)    // apply the parent node's (absolute) rotation
		.add(parentAbsolutePosition);    // and add the parent node's (absolute) position.
	}



});

// core/Canvas
// `Canvas` manages the canvas element and the RenderingContext2d. It is the root of the scene graph.



// Export the `Canvas` "class" and a shorthand.
exports.Canvas = Canvas;
exports.c = function (element) {
	return new Canvas(element);
};



// Let `Canvas` inherit from `Node`.
inherit(Canvas, Node);



// Create a new `Canvas` object using `element`.
function Canvas (element) {
	Node.call(this);    // call the super class constructor

	// A user might want to access the `_root` property, no matter if (s)he is dealing with the root node (a `Canvas` object).
	this._root = this;

	// The canvas DOM node (`HTMLCanvasElement`).
	this.element = element;
	// The rendering context (`RenderingContext2d`).
	this.context = element.getContext('2d');
}



// Add methods to the prototype of `Canvas`.
extend(Canvas.prototype, {



	// Clear the canvas.
	clear: function () {
		this.context.clearRect(0, 0, this.width, this.height);
		// todo: Research the "canvas width height" trick. Maybe it is faster.
		// http://simonsarris.com/blog/346-how-you-clear-your-canvas-matters
	},


	// Clear the canvas and draw all children draw to it.
	draw: function () {
		this.clear();
		this.children.call('draw');
	}



});

// shapes/Shape
// `Shape` is a base class providing `fillColor`, `strokeColor` and `lineWidth`.



// Export the `Shape` "class" and a shorthand.
exports.Shape = Shape;
exports.sh = function (options) {
	return new Shape(options);
};



// Let `Shape` inherit from `Node`.
inherit(Shape, Node);



// Create a new `Shape` based on `options`.
function Shape (options) {
	Node.call(options);    // call the super class constructor

	// The color the shape will be filled with. Can be any valid CSS color.
	this.fillColor = options.fillColor || 'gray';
	// The color the shape will be bordered with. Can be any valid CSS color.
	this.strokeColor = options.strokeColor || 'black';
	// The width of the border.
	this.lineWidth = options.lineWidth !== null ? options.lineWidth : 1;
}



// Add methods to the prototype of `Shape`.


// Prepare drawing the shape by changing the colors of the rendering context.
Shape.prototype.draw = function () {
	var context = this._root.context;    // aliases for shorter code

	context.fillStyle = this.fillColor;
	context.strokeStyle = this.strokeColor;
	context.lineWidth = this.lineWidth;
};

// 02-util/01-RenderingInterval



exports.RenderingInterval = RenderingInterval;
exports.ri = function (callback) {
	return new RenderingInterval(callback);
};



function RenderingInterval (callback) {
	this.callback = callback || noop;
	this.stop();
}



RenderingInterval.prototype = {



	start: function () {
		this.running = true;
		this._queue();
		return this;
	},



	stop: function () {
		this.running = false;
		return this;
	},



	_call: function () {
		if(!this.running)
			return;
		this.callback();
		this._queue();
	},


	_queue: function () {
		requestAnimationFrame(this._call.bind(this));
	}



};

// 02-util/02-Interval



exports.Interval = Interval;
exports.i = function (callback, interval) {
	return new Interval(callback, interval);
};



// Let `Interval` inherit from `RenderingInterval`.
inherit(Interval, RenderingInterval);



function Interval (callback, interval) {
	RenderingInterval.call(this, callback);

	this.interval = interval;
}



Interval.prototype._queue = function () {
	setTimeout(this._call.bind(this), this.interval);
};

// shapes/Point



// Export the `Point` "class" and a shorthand.
exports.Point = Point;
exports.pt = function (options) {
	return new Point(options);
};



// Let `Point` inherit from `Shape`.
inherit(Point, Shape);



// todo
function Point (options) {
	options = options || {};

	Shape.call(options);    // call the super class constructor

	// The size of the rendered dot.
	this.size = options.size !== null ? options.size : 2;
}



// Add methods to the prototype of `Point`.


// Draw a little dot to the canvas.
Point.prototype.draw = function () {
	// aliases for shorter code
	var thus = this,
	context = thus._root.context,
	position = thus._absPosition,
	size = thus.size|0;

	// Prepare drawing.
	Shape.draw.call(thus);

	context.fillRect(position.x|0, position.y|0, size, size);
	if (thus.lineWidth > 0)
		context.strokeRect(position.x|0, position.y|0, size, size);
};

// shapes/Polygon



// Export the `Polygon` "class" and a shorthand.
exports.Polygon = Polygon;
exports.p = function (options) {
	return new Polygon(options);
};



// Let `Polygon` inherit from `Shape`.
inherit(Polygon, Shape);



// A polygon is a shape bounded by a list of vertix nodes.
function Polygon (options) {
	options = options || {};

	Shape.call(options);    // call the super class constructor

	// The list of vertex nodes the polygon exists of.
	// User might want to access the list of vertex ndoes, which is why `_vertices` is aliased as `vertices`. `draw` uses `_vertices` to play nice with `Rectangle` and `Square` (both inheriting from `Polygon`).
	this._vertices = this.vertices = exports.l(options.vertices);
}



// Add methods to the prototype of `Polygon`.


// Draw the polygon to the canvas.
Polygon.prototype.draw = function () {
	// aliases for shorter code
	var thus = this,
	context = thus._root.context,
	vertices = thus._vertices;

	// Prepare drawing.
	Shape.draw.call(thus);
	context.beginPath();
	var i, vertex;

	for (i = 0, length = vertices.length; i < length; i++) {
		vertex = thus._absolute(vertices[i], thus._absPosition, thus._absRotation);
		context[i === 0 ? 'moveto' : 'lineTo'](vertex.x|0, vertex.y|0);
	}

	// Finish drawing.
	context.closePath();
	context.fill();
	if (thus.lineWidth > 0)
		context.stroke();
};

// shapes/Rectangle



// Export the `Rectangle` "class" and a shorthand.
exports.Rectangle = Rectangle;
exports.p = function (options) {
	return new Rectangle(options);
};



// Let `Rectangle` inherit from `Polygon`.
inherit(Rectangle, Polygon);



// Yeah, a `Reactangle` is a rectangle.
function Rectangle (options) {
	Polygon.call(options);    // call the super class constructor

	// The rectangle's width. Pretty obvious.
	this.width = options.width !== null ? options.width : 60;
	// The rectangle's height. Pretty obvious.
	this.height = options.height !== null ? options.height : 40;

	// Remove the alias to `_vertices` set by `Polygon`.
	delete this.vertices;
}



// Add methods to the prototype of `Rectangle`.


// Recompose the `vertices` list.
Rectangle.prototype._update = function () {
	var thus = this;    // alias for shorter code

	thus._vertices = [
		exports.v(0, 0),
		exports.v(thus.width, 0),
		exports.v(thus.width, thus.height),
		exports.v(0, thus.height)
	];

	Node._update.call(this);    // Update the rest.
};

// shapes/Ellipse



// Export the `Ellipse` "class" and a shorthand.
exports.Ellipse = Ellipse;
exports.e = function (options) {
	return new Ellipse(options);
};



// Let `Ellipse` inherit from `Shape`.
inherit(Ellipse, Shape);



// Yeah, a `Ellipse` is a ellipse, drawn around its `position`.
function Ellipse (options) {
	Shape.call(options);    // call the super class constructor

	// The ellipse's width. Pretty obvious.
	this.width = options.width !== null ? options.width : 60;
	// The ellipse's height. Pretty obvious.
	this.height = options.height !== null ? options.height : 40;
}



// Add methods to the prototype of `Ellipse`.


// Draw the ellipse to the canvas.
Ellipse.prototype.draw = function () {
	// aliases for shorter code
	var thus = this,
	context = thus._root.context;

	// Prepare drawing.
	context.save();
	Shape.draw.call(thus);
	context.translate(thus._absPosition|0);
	context.rotate(thus._absRotation);
	context.scale(1, thus.height / thus.width);    // todo: Use `|0` here?
	context.beginPath();

	context.arc(0, 0, thus.width / 2|0, 0, Math.PI * 2);    // todo: Use `|0` here?

	// Finish drawing.
	context.closePath();
	context.fill();
	if (thus.lineWidth > 0)
		context.stroke();
	context.restore();
};

// convenience/Square



// Export the `Square` "class" and a shorthand.
exports.Square = Square;
exports.s = function (options) {
	return new Square(options);
};



// Let `Square` inherit from `Polygon`.
inherit(Square, Polygon);



// Yeah, a `Reactangle` is a rectangle.
function Square (options) {
	Polygon.call(options);    // call the super class constructor

	// The square's width and height. Pretty obvious.
	this.size = options.size !== null ? options.size : 2;

	// Remove the alias to `_vertices` set by `Polygon`.
	delete this.vertices;
}



// Add methods to the prototype of `Square`.


// Recompose the `vertices` list.
Square.prototype._update = function () {
	var thus = this;    // alias for shorter code

	thus._vertices = [
		exports.v(0, 0),
		exports.v(thus.size, 0),
		exports.v(thus.size, thus.size),
		exports.v(0, thus.size)
	];

	Node._update.call(this);    // Update the rest.
};

// convenience/Circle



// Export the `Circle` "class" and a shorthand.
exports.Circle = Circle;
exports.e = function (options) {
	return new Circle(options);
};



// Let `Circle` inherit from `Shape`.
inherit(Circle, Shape);



// Yeah, a `Circle` is a circle, drawn around its `position`.
function Circle (options) {
	Shape.call(options);    // call the super class constructor

	// The circle's radius. Pretty obvious.
	this.radius = options.radius !== null ? options.radius : 50;
}



// Add methods to the prototype of `Circle`.


// Draw the circle to the canvas.
Circle.prototype.draw = function () {
	// aliases for shorter code
	var thus = this,
	context = thus._root.context;

	// Prepare drawing.
	Shape.draw.call(thus);
	context.beginPath();

	context.arc(0, 0, thus.radius|0, 0, Math.PI * 2);    // todo: Use `|0` here?

	// Finish drawing.
	context.closePath();
	context.fill();
	if (thus.lineWidth > 0)
		context.stroke();
};
},{}]},{},[1])(1)
});