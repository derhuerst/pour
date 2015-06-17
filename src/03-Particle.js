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
