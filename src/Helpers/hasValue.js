// Return true if it's not null or undefined, and length is > 0
module.exports = function(val) {
	return val !== null && val !== undefined && val.toString().length > 0;
}
