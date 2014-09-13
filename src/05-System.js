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