pour.Particle.prototype.draw = function (context) {
	context.fillStyle = 'blue';
	context.fillRect(this.position.x - 1|0, this.position.y - 1|0, 2, 2);
};
pour.Emitter.prototype.draw = function (context) {
	context.fillStyle = 'red';
	context.fillRect(this.position.x - 2|0, this.position.y - 2|0, 4, 4);
};
pour.Field.prototype.draw = function (context) {
	context.strokeStyle = this.mass > 0 ? 'green' : 'red';
	context.beginPath();
	context.arc(this.position.x|0, this.position.y|0, Math.abs(Math.ceil(this.mass / 7)), 0, Math.PI * 2);
	context.stroke();
};
pour.System.prototype.draw = function (context, i, length) {
	context.clearRect(0, 0, canvas.element.width, canvas.element.height);
	for (i = 0, length = this.fields.length; i < length; i++) {
		this.fields[i].draw(context);
	}
	for (i = 0, length = this.emitters.length; i < length; i++) {
		this.emitters[i].draw(context);
	}
	for (i = 0, length = this.particles.length; i < length; i++) {
		this.particles[i].draw(context);
	}
};