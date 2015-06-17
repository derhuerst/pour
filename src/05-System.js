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
		if (!thing || !thing.type || !this[this.type + 's']) return this;

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
