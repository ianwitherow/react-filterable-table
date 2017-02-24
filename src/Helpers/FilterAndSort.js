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


		let records = !filter || filter.length === 0
			? array
			: array.filter((record) => {
				// create array of filterable fields, then use Array.some to return the value, instead of having an OR for each one.
				return filterableFields.some(field => {
					let recordValue = record[field.name] ? record[field.name].toString() : '';
					return recordValue && recordValue.toLowerCase().indexOf(filter.toLowerCase()) > -1;
				});
			});

		// Check exact filters
		if (exactFilters.length > 0) {
			records = records.filter((record) => {
				return exactFilters.every(exactFilter => {
					if (Array.isArray(record[exactFilter.fieldname])) {
						// The field we're filtering on is an array. See if the array has our filter value in it.
						return record[exactFilter.fieldname] && record[exactFilter.fieldname].indexOf(exactFilter.value) > -1;
					} else {
						// Just compare values
						// I know it's called "ExactFilter", but we're not going to compare case. Lowercase them both.
						let recordValue = record[exactFilter.fieldname] ? record[exactFilter.fieldname].toString().toLowerCase() : '';
						let exactFilterValue = exactFilter.value.toString().toLowerCase();
						return recordValue === exactFilterValue;
					}
				});
			});
		}

		// Sort records if need be
		if (sort && sort.length > 0) {
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
						recordA = a[sort] && a[sort].length > 0 ? a[sort].toLowerCase() : emptySortCompare;
						recordB = b[sort] && b[sort].length > 0 ? b[sort].toLowerCase() : emptySortCompare;
					} else if ((a[sort] && typeof a[sort].getMonth === "function") || b[sort] && typeof b[sort].getMonth === "function") {
						// For dates, we'll need different "emptySortCompare" values
						// If desc, set to some really early date, like 1/1/1000.
						// If asc, set to some really late date, like 1/1/2999.
						let emptySortCompare = !sortDir ? new Date("1/1/1000") : new Date("1/1/2999");
						recordA = a[sort] || emptySortCompare;
						recordB = b[sort] || emptySortCompare;
					} else if (typeof a[sort] === "number" || typeof b[sort] === "number") {
						// If desc, set to negative infinity
						// If asc, set to positive infinity
						let emptySortCompare = !sortDir ? -Infinity : Infinity;
						recordA = a[sort] !== null && a[sort] !== undefined ? a[sort] : emptySortCompare;
						recordB = b[sort] !== null && b[sort] !== undefined ? b[sort] : emptySortCompare;
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
