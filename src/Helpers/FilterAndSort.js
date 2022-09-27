import hasValue from './hasValue';
import getValue from './getValue';

function FilterAndSort(array, options) {
	array = array || [];
	const {
		filter,
		exactFilters,
		fieldFilters,
		sortFields,
		fields
	} = options;
	if (!fields || !fields.length) return [];

	const filterableFields = fields.filter(field => {
		return field.inputFilterable;
	});


	let records = !hasValue(filter)
		? array
		: array.filter(record => {
			// create array of filterable fields, then use Array.some to return the value, instead of having an OR for each one.
			return filterableFields.some(field => {
				let recordValue = hasValue(getValue(record, field.name)) ? getValue(record, field.name).toString() : '';
				return hasValue(recordValue) && recordValue.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			});
		});

	// Check exact filters
	if (exactFilters.length > 0) {
		records = records.filter(record => {
			return exactFilters.every(exactFilter => {
				let recordValue = getValue(record, exactFilter.fieldname);
				if (Array.isArray(recordValue)) {
					// The field we're filtering on is an array. See if the array has our filter value in it.
					return hasValue(recordValue) && recordValue.indexOf(exactFilter.value) > -1;
				} else {
					// Just compare values
					// I know it's called "ExactFilter", but we're not going to compare case. Lowercase them both.
					let compareValue = hasValue(recordValue) ? recordValue.toString().toLowerCase() : '';
					let exactFilterValue = exactFilter.value.toString().toLowerCase();
					return compareValue === exactFilterValue;
				}
			});
		});
	}

	// Check field filters
	if (fieldFilters.length > 0) {
		records = records.filter(record => {
			return fieldFilters.every(fieldFilter => {
				let exact = fieldFilter.exact || fields.find(f => f.name === fieldFilter.fieldname).fieldFilterExact || false;

				let recordValue = getValue(record, fieldFilter.fieldname);
				if (Array.isArray(recordValue)) {
					// The field we're filtering on is an array. See if the array has our filter value in it.
					return hasValue(recordValue) && recordValue.some(val => val && exact ? val.toLowerCase() === fieldFilter.value.toLowerCase() : val.toLowerCase().includes(fieldFilter.value))
				} else {
					// See if the value is contained in the record
					// Compare against trimmed lowercase strings
					const thisRecordValue = hasValue(recordValue) ? recordValue.toString().toLowerCase().trim() : "";
					const thisFilterValue = hasValue(fieldFilter.value) ? fieldFilter.value.toString().toLowerCase().trim() : "";
					return hasValue(thisRecordValue) && (exact ? thisRecordValue === thisFilterValue : thisRecordValue.includes(thisFilterValue));
				}
			});
		});
	}

	// Sort records if need be
	if (sortFields.length > 0) {
		let sortKeys = {};
		sortFields.forEach(field => {
			sortKeys[field.name] = (field.reverse) ? "desc" : "asc";
		});
		records = MultiSort([...records], sortKeys);
	}
	return records;
}

// Adapted from: https://stackoverflow.com/questions/2784230/how-do-you-sort-an-array-on-multiple-columns#answer-15668310
function MultiSort(array, keys) {

	keys = keys || {};

	// via
	// https://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
	var obLen = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key))
				size++;
		}
		return size;
	};

	var obIx = function(obj, ix) {
		return Object.keys(obj)[ix];
	};

	var keySort = function(a, b, d) {
		d = d !== null ? d : 1;

		a = (hasValue(a)) ? a : null;
		b = (hasValue(b)) ? b : null;

		// force any string values to lowercase
		a = typeof a === 'string' ? a.toLowerCase() : a;
		b = typeof b === 'string' ? b.toLowerCase() : b;

		if (a === null) {
			return 1;
		}
		if (b === null) {
			return -1;
		}
		// Return either 1 or -1  *d to indicate a sort priority. d is sort direction
		if (a > b) {
			return 1 * d;
		}
		if (a < b) {
			return -1 * d;
		}
		// returning 0, undefined or any falsey value will use subsequent sorts or
		// the index as a tiebreaker
		return 0;
	};

	var KL = obLen(keys);

	if (!KL)
		return array.sort(keySort);

	for ( var k in keys) {
		// asc unless desc or skip
		keys[k] = 
			keys[k] == 'desc' || keys[k] == -1  ? -1 
			: (keys[k] == 'skip' || keys[k] === 0 ? 0 
			: 1);
	}

	array.sort(function(a, b) {
		var sorted = 0, ix = 0;

		while (sorted === 0 && ix < KL) {
			var k = obIx(keys, ix);
			if (k) {
				var dir = keys[k];
				sorted = keySort(getValue(a, k), getValue(b, k), dir);
				ix++;
			}
		}
		return sorted;
	});
	return array;
};

module.exports = FilterAndSort;
