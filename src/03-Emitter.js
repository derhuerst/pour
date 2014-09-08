// En emitter emits a particle whenever emit is called.



exports.Emitter = Emitter;
exports.e = function (options) {
	return new Emitter(options);
};



function Emitter(options){
	this.position = options.position || exports.v();
	this.velocity = options.velocity || exports.v(1);
	this.spread = (options.spread !== null) ? options.spread : Math.PI / 2;
	this.death = (options.death !== null) ? options.death : 200;
}



Emitter.prototype = {



	type: 'emitter',



	emit: function(){
		return exports.e({
			position: this.position.clone(),
			velocity: Vector.fromAngle(this.velocity.angle() + this.spread * (Math.random() - 0.5)).multiply(this.velocity.length()),
			death: this.death
		});
	}



};