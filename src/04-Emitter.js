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
