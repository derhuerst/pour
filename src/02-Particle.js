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