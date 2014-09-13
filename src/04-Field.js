// A field that either attracts or repulses particles by its mass.



exports.Field = Field;
exports.f = function (position, mass) {
	return new Field(position, mass);
};



function Field(position, mass){
	this.position = position || exports.v();
	this.mass = (typeof mass === 'number') ? mass : 250;
}



Field.prototype.type = 'field';