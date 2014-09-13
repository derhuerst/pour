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