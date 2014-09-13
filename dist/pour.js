// pour | Jannis R | v0.1.0 | https://github.com/derhuerst/pour





!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.pour=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// A simple 2D vector helper "class" used for positions, velocities and accelerations..



exports.Vector = Vector;
exports.v = function (x, y) {
	return new Vector(x, y);
};



function Vector(x, y){
	this.x = x || 0;
	this.y = y || 0;
}



Vector.prototype = {



	add: function(x, y){
		if (y) {
			this.x += x;
			this.y += y;
		} else if (x) {
			this.x += x.x;
			this.y += x.y;
		}

		return this;
	},


	substract: function(x, y){
		if (y) {
			this.x -= x;
			this.y -= y;
		} else if (x) {
			this.x -= x.x;
			this.y -= x.y;
		}

		return this;
	},


	multiply: function(vector){
		if (typeof vector === 'number') {
			this.x *= vector;
			this.y *= vector;
		} else {
			this.x *= vector.x;
			this.y *= vector.y;
		}

		return this;
	},



	angle: function(){
		return Math.atan2(this.y, this.x);
	},



	length: function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},



	clone: function(){
		return new Vector(this.x, this.y);
	}



};



Vector.fromAngle = function(angle, length){
	length = typeof length === 'number' ? length : 1;
	return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
};

// A simple particle with a position, a speed and an acceleration, influenced by fields in the same system.



exports.Particle = Particle;
exports.p = function (options) {
	return new Particle(options);
};



function Particle(options){
	options = options || {};

	this.position = options.position || exports.v();
	this.velocity = options.velocity || exports.v();
	this.acceleration = options.acceleration || exports.v();

	this.death = options.death !== null ? options.death : 200;
	this.life = 0;
	this.dead = false;
}



Particle.prototype = {



	type: 'particle',



	tick: function(fields){
		if (this.dead) return;

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
	}



};

// En emitter emits a particle whenever emit is called.



exports.Emitter = Emitter;
exports.e = function (options) {
	return new Emitter(options);
};



function Emitter(options){
	options = options || {};

	this.position = options.position || exports.v();
	this.velocity = options.velocity || exports.v(1);
	this.spread = options.spread || 0;
	this.death = (typeof options.death === 'number') ? options.death : 1000;
}



Emitter.prototype = {



	type: 'emitter',



	emit: function(){
		return exports.p({
			position: this.position.clone(),
			velocity: Vector.fromAngle(this.velocity.angle() + this.spread * (Math.random() - 0.5), this.velocity.length()),
			death: this.death
		});
	}



};

// A field that either attracts or repulses particles by its mass.



exports.Field = Field;
exports.f = function (position, mass) {
	return new Field(position, mass);
};



function Field(position, mass){
	this.position = position || exports.v();
	this.mass = (typeof mass === 'number') ? mass : 250;
}



Field.prototype.type = 'field';

// A composition of particles, emitters and fields.



exports.System = System;
exports.s = function (options) {
	return new System(options);
};



function System(options){
	options = options || {};

	this.particles = options.particles || [];
	this.emitters = options.emitters || [];
	this.fields = options.fields || [];
}



System.prototype = {



	add: function(thing){
		if(this[thing.type + 's'].indexOf(thing) < 0)
			this[thing.type + 's'].push(thing);

		return this;
	},


	remove: function(thing, i){
		if(i = this[thing.type + 's'].indexOf(thing) >= 0)
			this[thing.type + 's'].splice(i, 1);

		return this;
	},



	tick: function(){
		var particles = this.particles, i;
		for(i = 0; i < particles.length; i++){
			if(particles[i].dead){
				particles.splice(i, 1);
				continue;
			}
			particles[i].tick(this.fields);
		}

		return this;
	}



};
},{}]},{},[1])(1)
});