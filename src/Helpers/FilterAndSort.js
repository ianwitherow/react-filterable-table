const hasValue = require('./hasValue');
const getValue = require('./getValue');

function FilterAndSort(array, options) {
	array = array || [];
	const {
		filter,
		exactFilters,
		sortFields,
		stickySorting,
		fields
	} = options;

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

	// Sort records if need be
	if (sortFields.length > 0) {
		let sortKeys = {};
		sortFields.forEach(field => {
			sortKeys[field.name] = (field.reverse) ? "desc" : "asc";
		});
		return MultiSort(records, sortKeys, stickySorting);
	}
	return records;
}

// Push empty values to the bottom, regardless of sort direction
function StickySortValues(recordA, recordB, reverse) {
	if (typeof recordA === "string" || typeof recordB === "string") {
		// If desc, set it to 0 so it ends up at the end.
		// If asc, set to a bunch of zzzz so it ends up at the end.
		let emptySortCompare = reverse ? "0" : "zzzzzzzzzzzz";
		// For strings, set both to lowercase for comparison
		recordA = hasValue(recordA) ? recordA.toString().toLowerCase() : emptySortCompare;
		recordB = hasValue(recordB) ? recordB.toString().toLowerCase() : emptySortCompare;
	} else if ((hasValue(recordA) && typeof recordA.getMonth === "function") || (hasValue(recordB) && typeof recordB.getMonth === "function")) {
		// For dates, we'll need different "emptySortCompare" values
		// If desc, set to some really early date, like 1/1/1000.
		// If asc, set to some really late date, like 1/1/2999.
		let emptySortCompare = reverse ? new Date("1/1/1000") : new Date("1/1/2999");
		recordA = hasValue(recordA) ? recordA : emptySortCompare;
		recordB = hasValue(recordB) ? recordB : emptySortCompare;
	} else if (typeof recordA === "number" || typeof recordB === "number") {
		// If desc, set to negative infinity
		// If asc, set to positive infinity
		let emptySortCompare = reverse ? -Infinity : Infinity;
		recordA = hasValue(recordA) ? recordA : emptySortCompare;
		recordB = hasValue(recordB) ? recordB : emptySortCompare;
	}

	return { a: recordA, b: recordB };
}


// Adapted from: https://stackoverflow.com/questions/2784230/how-do-you-sort-an-array-on-multiple-columns#answer-15668310
function MultiSort(array, keys, stickySort) {

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

		if (stickySort) {
			let sortDirection = d === -1;
			let stickyValues = StickySortValues(a, b, sortDirection);
			a = stickyValues.a;
			b = stickyValues.b;
		}

		// force any string values to lowercase
		a = typeof a === 'string' ? a.toLowerCase() : a;
		b = typeof b === 'string' ? b.toLowerCase() : b;

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
