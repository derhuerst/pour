// pour | Jannis R | v0.3.0 | https://github.com/derhuerst/pour





(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pour = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// `helpers` contains a collection of helper functions. They are used internally but get `export`ed as well.



// EcmaScript 5 strict mode. Because all modules get concatenated, this applies to all of them.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode for more about ES5 strict mode.
"strict mode";



// Proxy for `Object.create`. Create a new inherited object from another object. See https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/create and http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object for more.
var inherit = exports.inherit = Object.create;




// `Vector` represents a 2D vector. It can be used for positions, velocities and accelerations.
var Vector = exports.Vector = {




	// Initialize the vector. `x` and `y` are `0` by default.
	init: function (x, y) {
		this.x = x || 0;
		this.y = y || 0;

		return this;   // method chaining
	},



	// Set `x` and `y` to `0`.
	reset: function () {
		this.x = this.y = 0;

		return this;   // method chaining
	},



	// Add to the vector. Either one `Vector` object or two raw values `x` and `y` can be passed.
	add: function (x, y) {
		if (arguments.length >= 2) {   // assuming two raw values
			this.x += x;
			this.y += y;
		} else if (arguments.length === 1 && arguments[0]) {   // assuming one `Vector` object
			this.x += x.x;
			this.y += x.y;
		}

		return this;   // method chaining
	},


	// Subtract from the vector. Either one `Vector` object or two raw values `x` and `y` can be passed.
	substract: function (x, y) {
		if (arguments.length >= 2) {   // assuming two raw values
			this.x -= x;
			this.y -= y;
		} else if (arguments.length === 1 && arguments[0]) {   // assuming one `Vector` object
			this.x -= x.x;
			this.y -= x.y;
		}

		return this;   // method chaining
	},



	// Do a scalar multiplication with the vector. Either one factor or a `Vector` object with two factors for `x` and `y` can be passed.
	multiply: function (vector) {
		if (typeof vector === 'number') {
			this.x *= vector;
			this.y *= vector;
		} else if (typeof vector.x === 'number' && typeof vector.x === 'number') {
			this.x *= vector.x;
			this.y *= vector.y;
		}

		return this;   // method chaining
	},



	// Compute the vector's angle in radians.
	angle: function () {
		return Math.atan2(this.y, this.x);
	},



	// Compute the vector's length.
	length: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},



	// Return a new `Vector` object with the same values.
	clone: function () {
		return v(this.x, this.y);
	},



	// Create a new `Vector` object using a direction (`angle`) and a `length`.
	fromAngle: function (angle, length) {
		length = typeof length === 'number' ? length : 1;
		return v(Math.cos(angle) * length, Math.sin(angle) * length);
	}



};



// Export a shorthand.
var v = exports.v = function (x, y) {
	return inherit(Vector)
	.init(x, y);
};




// `Particle` has a position, a velocity and an acceleration, influenced by `Field`s in the same `System`.
var Particle = exports.Particle = {



	// Create a new `Particle` based on `options`. `options` is an object that may contain the following keys.
	// - `position`: The position as a `Vector` object. Default: `pour.v()`
	// - `velocity`: The velocity as a `Vector` object. Default: `pour.v()`
	// - `acceleration`: The acceleration as a `Vector` object. Default: `pour.v()`
	// - `death`: The number of `tick`s the particle will interact with the system for. Default: `200`
	init: function (options) {
		options = options || {};

		this.position = options.position || v();
		this.velocity = options.velocity || v();
		this.acceleration = options.acceleration || v();

		this.death = (typeof options.death === 'number') ? options.death : 200;
		this.life = 0;
		this.dead = false;

		return this;   // method chaining
	},



	// todo: necessary?
	type: 'particle',



	// pour's computation is done step-based. This means that you can simulate time passing by by calling `tick` regularly. `tick`
	// - checks if the particle is still alive
	// - computes the particle's `acceleration` based on the `Field`s it gets influenced by,
	// - adds the particle's `velocity` to its `position` and
	// - adds the particle's `acceletation` to its `velocity`.
	tick: function(fields){
		if (this.dead) return this;

		var thus = this, i, length, force;

		// check if still living
		thus.life++;
		if(thus.life >= thus.death){
			thus.dead = true;
			return;
		}

		// compute acceleration based on distance to all fields
		thus.acceleration = exports.v();
		for(i = 0, length = fields.length; i < length; i++){
			force = fields[i].position.clone().substract(thus.position);
			force.multiply(fields[i].mass / Math.pow(force.x * force.x + force.y * force.y, 1.5));
			thus.acceleration.add(force);
		}

		// position & velocity
		thus.velocity.add(thus.acceleration);
		thus.position.add(thus.velocity);

		return this;   // method chaining
	}



};



// Export a shorthand.
var p = exports.p = function (options) {
	return inherit(Particle)
	.init(options);
};




// An `Emitter` emits a `Particle` whenever `emit()` is called.
var Emitter = exports.Emitter = {



	// Create a new `Emitter` based on `options`. `options` is an object that may contain the following keys.
	// - `position`: Every new particle's `position` as a `Vector` object. Default: `pour.v()`
	// - `velocity`: Every new particle's `velocity` as a `Vector` object. Default: `pour.v()`
	// - `death`: The number of `tick`s the new particle will interact with the system for. Default: `1000`
	// - `spread`: The angle (in radians) by which the new particle's direction varies. Default: `0`
	init: function (options) {
		options = options || {};

		this.position = options.position || exports.v();
		this.velocity = options.velocity || exports.v(1);
		this.death = (typeof options.death === 'number') ? options.death : 1000;
		this.spread = options.spread || 0;

		return this;   // method chaining
	},



	type: 'emitter',



	emit: function () {
		return exports.p({
			position: this.position.clone(),
			velocity: Vector.fromAngle(this.velocity.angle() + this.spread * (Math.random() - 0.5), this.velocity.length()),
			death: this.death
		});
	}



};



// Export a shorthand.
var e = exports.e = function (options) {
	return inherit(Emitter)
	.init(options);
};




// A `Field` that either attracts or repulses `Particle`s, according to its `mass`.
var Field = exports.Field = {



	// Initialize the field. `position` is `pour.v()` by default. `mass` is `250` by default.
	init: function (position, mass) {
		this.position = position || v();
		this.mass = (typeof mass === 'number') ? mass : 250;

		return this;   // method chaining
	},



	type: 'field'



};



// Export a shorthand.
var f = exports.f = function (position, mass) {
	return inherit(Field)
	.init(position, mass);
};




// A `System` can hold any number of `Particle`s, `Emitter`s and `Field`s.
var System = exports.System = {



	// Create a new `System` based on `options`. `options` is an object that may contain the following keys.
	// - `particles`: An array of `Particle` objects. Default: `[]`
	// - `emitters`: An array of `Emitter` objects. Default: `[]`
	// - `fields`: An array of `Field` objects. Default: `[]`
	init: function (options) {
		options = options || {};

		this.particles = options.particles || [];
		this.emitters = options.emitters || [];
		this.fields = options.fields || [];

		return this;   // method chaining
	},



	type: 'system',



	// Adds any `Particle`, `Emitter` or `Field` to the `System`.
	add: function(thing){
		if (!thing || !thing.type || !this[thing.type + 's']) return this;

		if(this[thing.type + 's'].indexOf(thing) < 0)
			this[thing.type + 's'].push(thing);

		return this;   // method chaining
	},


	// Removes any `Particle`, `Emitter` or `Field` from the `System`.
	remove: function(thing, i){
		if (!thing || !thing.type || !this[this.type + 's']) return this;

		if(i = this[thing.type + 's'].indexOf(thing) >= 0)
			this[thing.type + 's'].splice(i, 1);

		return this;   // method chaining
	},



	tick: function(){
		var i, length;

		for(i = 0, length = this.particles.length; i < length; i++){
			if(this.particles[i].dead){
				this.particles.splice(i, 1);
				continue;
			}
			this.particles[i].tick(this.fields);
		}

		return this;   // method chaining
	}



};



// Export a shorthand.
var s = exports.s = function (options) {
	return inherit(System)
	.init(options);
};

},{}]},{},[1])(1)
});