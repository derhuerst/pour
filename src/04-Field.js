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
