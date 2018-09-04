const hasValue = require('./hasValue');
const getValue = require('./getValue');

function FilterAndSort(array, options) {
	array = array || [];
	const {
		filter,
		exactFilters,
		sort,
		sortDir,
		stickySorting,
		fields
	} = options;

	const filterableFields = fields.filter(field => {
		return field.inputFilterable;
	});


	let records = !hasValue(filter)
		? array
		: array.filter((record) => {
			// create array of filterable fields, then use Array.some to return the value, instead of having an OR for each one.
			return filterableFields.some(field => {
				let recordValue = hasValue(getValue(record, field.name)) ? getValue(record, field.name).toString() : '';
				return hasValue(recordValue) && recordValue.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			});
		});

	// Check exact filters
	if (exactFilters.length > 0) {
		records = records.filter((record) => {
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
	if (hasValue(sort)) {
		records = records.sort((a, b) => {

			let recordA = getValue(a, sort);
			let recordB = getValue(b, sort);

			if (stickySorting) {

				// Special rules for sorting different data types
				// Empty things should always sort last
				if (typeof recordA === "string" || typeof recordB === "string") {
					// If desc, set it to 0 so it ends up at the end.
					// If asc, set to a bunch of zzzz so it ends up at the end.
					let emptySortCompare = !sortDir ? "0" : "zzzzzzzzzzzz";
					// For strings, set both to lowercase for comparison
					recordA = hasValue(recordA) ? recordA.toString().toLowerCase() : emptySortCompare;
					recordB = hasValue(recordB) ? recordB.toString().toLowerCase() : emptySortCompare;
				} else if ((hasValue(recordA) && typeof recordA.getMonth === "function") || (hasValue(recordB) && typeof recordB.getMonth === "function")) {
					// For dates, we'll need different "emptySortCompare" values
					// If desc, set to some really early date, like 1/1/1000.
					// If asc, set to some really late date, like 1/1/2999.
					let emptySortCompare = !sortDir ? new Date("1/1/1000") : new Date("1/1/2999");
					recordA = hasValue(recordA) ? recordA : emptySortCompare;
					recordB = hasValue(recordB) ? recordB : emptySortCompare;
				} else if (typeof recordA === "number" || typeof recordB === "number") {
					// If desc, set to negative infinity
					// If asc, set to positive infinity
					let emptySortCompare = !sortDir ? -Infinity : Infinity;
					recordA = hasValue(recordA) ? recordA : emptySortCompare;
					recordB = hasValue(recordB) ? recordB : emptySortCompare;
				}
			}

			if (sortDir) {
				// Asc
				if (recordA < recordB) {
					return -1;
				}
				if (recordA > recordB) {
					return 1;
				}
			} else {
				// Desc
				if (recordA > recordB) {
					return -1;
				}
				if (recordA < recordB) {
					return 1;
				}
			}

			return 0;
		});

	}
	return records;
}



module.exports = FilterAndSort;
