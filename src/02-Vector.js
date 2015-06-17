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
		return new Vector(this.x, this.y);
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
