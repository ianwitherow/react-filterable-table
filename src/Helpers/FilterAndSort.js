const hasValue = require('./hasValue');

function FilterAndSort(array, options) {
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
					let recordValue = hasValue(record[field.name]) ? record[field.name].toString() : '';
					return hasValue(recordValue) && recordValue.toLowerCase().indexOf(filter.toLowerCase()) > -1;
				});
			});

		// Check exact filters
		if (exactFilters.length > 0) {
			records = records.filter((record) => {
				return exactFilters.every(exactFilter => {
					if (Array.isArray(record[exactFilter.fieldname])) {
						// The field we're filtering on is an array. See if the array has our filter value in it.
						return hasValue(record[exactFilter.fieldname]) && record[exactFilter.fieldname].indexOf(exactFilter.value) > -1;
					} else {
						// Just compare values
						// I know it's called "ExactFilter", but we're not going to compare case. Lowercase them both.
						let recordValue = hasValue(record[exactFilter.fieldname]) ? record[exactFilter.fieldname].toString().toLowerCase() : '';
						let exactFilterValue = exactFilter.value.toString().toLowerCase();
						return recordValue === exactFilterValue;
					}
				});
			});
		}

		// Sort records if need be
		if (hasValue(sort)) {
			records = records.sort((a, b) => {

				let recordA = a[sort];
				let recordB = b[sort];

				if (stickySorting) {

					// Special rules for sorting different data types
					// Empty things should always sort last
					if (typeof a[sort] === "string" || typeof b[sort] === "string") {
						// If desc, set it to 0 so it ends up at the end.
						// If asc, set to a bunch of zzzz so it ends up at the end.
						let emptySortCompare = !sortDir ? "0" : "zzzzzzzzzzzz";
						// For strings, set both to lowercase for comparison
						recordA = hasValue(a[sort]) ? a[sort].toLowerCase() : emptySortCompare;
						recordB = hasValue(b[sort]) ? b[sort].toLowerCase() : emptySortCompare;
					} else if ((hasValue(a[sort]) && typeof a[sort].getMonth === "function") || (hasValue(b[sort]) && typeof b[sort].getMonth === "function")) {
						// For dates, we'll need different "emptySortCompare" values
						// If desc, set to some really early date, like 1/1/1000.
						// If asc, set to some really late date, like 1/1/2999.
						let emptySortCompare = !hasValue(sortDir) ? new Date("1/1/1000") : new Date("1/1/2999");
						recordA = hasValue(a[sort]) ? a[sort] : emptySortCompare;
						recordB = hasValue(b[sort]) ? b[sort] : emptySortCompare;
					} else if (typeof a[sort] === "number" || typeof b[sort] === "number") {
						// If desc, set to negative infinity
						// If asc, set to positive infinity
						let emptySortCompare = !sortDir ? -Infinity : Infinity;
						recordA = hasValue(a[sort]) ? a[sort] : emptySortCompare;
						recordB = hasValue(b[sort]) ? b[sort] : emptySortCompare;
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
