/**
 * Die Klasse Vector
 * 
 * Diese Klasse beschreibt einen Punkt absolut zum Nullpunkt des verwendeten Koordinatesystems, oder
 * Relativ zum betrachteten Punkt.
 */
function Vector(x, y) {
	this.x = x;
	this.y = y;
}



/**
 * Addiert zwei Vectoren miteinander und gibt den resultierenden Vector zurück
 */ 
Vector.prototype.add = function(v) {
	return new Vector(this.x + v.x, this.y + v.y);
};



/**
 * Subrahiert einen Vector von einem anderen und gibt den resultierenden Vector zurück
 */
Vector.prototype.sub = function (v) {
	return new Vector(this.x - v.x, this.y - v.y);
};



/**
 * Multipliziert den Vector mit einem Faktor und gibt den resultierenden Vektor zurück
 */
Vector.prototype.mult = function (factor) {
	return new Vector(this.x * factor, this.y * factor);
};



/**
 * Dividiert den Vector durch einen factor und gibt den resultierenden Vektor zurück
 */
Vector.prototype.div = function(factor) {
	return new Vector(this.x / factor, this.y / factor);
};



/**
 * Multipiziert diese Vector mit dem übergebenen Vector und gibt das Ergebnis zurück
 */
Vector.prototype.vectorMult = function(v) {
	return new Vector(this.x * v.x, this.y * v.y);
};



/**
 * Diese Funktion berechnet den Einheitsvektor und gibt diesen zurück
 */
Vector.prototype.unitVector = function() {
	return this.div(this.absolute());
};



/**
 * Berechnet die Länge des Vektors und gibt sie zurück
 */
Vector.prototype.absolute = function() {
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
};



/**
 * Gibt den Vector als String zurück
 */
Vector.prototype.toString = function () {
	return x+","+y;
};