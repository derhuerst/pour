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