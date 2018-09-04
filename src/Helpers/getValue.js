// If field has a dot in it, traverse object with dot notation to get the property value
// Otherwise just return the property of the record
module.exports = function getValue(record, field) {
	if (field.indexOf(".") > 0) {
		return field.split('.').reduce((o,i)=>o ? o[i] : null, record);
	}
	return record[field];
}

