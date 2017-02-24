import React from 'react';

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.headerSortClassName = this.headerSortClassName.bind(this);
	}

	headerSortClassName(field) {
		// Return the class name for the sort icon
		if (field.sortable) {
			if (this.props.sort === field.name || this.props.sort === field.sortFieldName) {
				if (this.props.sortDir) {
					return "fa fa-sort-asc";
				} else {
					return "fa fa-sort-desc";
				}
			}
			return "fa fa-sort";
		}
		return null;
	}

	render() {
		const {
			addExactFilter,
			updateSort,
			page,
			pageSize,
			visible
		} = this.props;

		// Paging - determine indexes for where to slice the array
		const startIndex = page * pageSize;
		const endIndex = startIndex + pageSize;

		// Slice array based on what should be shown on the current page
		const records = this.props.records.slice(startIndex, endIndex);

		// If the field has the visible property set to false, ignore it
		const fields = this.props.fields.filter(field => {
			return field.visible !== false;
		});

		const headerCells = fields.map((field, i) => {
			// Use the displayName property if supplied, otherwise use name
			let fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
			return (
				<th onClick={field.sortable ? () => updateSort(field.sortFieldName || field.name) : null} className={field.thClassName ? field.thClassName : null} key={i}>
					<span className={field.sortable ? "sortable" : null}>{fieldDisplayName}</span>
					<span className={this.headerSortClassName(field)}></span>
				</th>
			);
		});

		const rows = records.map((record, i) => {

			const tableTds = fields.map((field, q) => {
				// Use the displayName property if supplied, otherwise use name
				let fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
				let spanClassName = field.exactFilterable && record[field.name] ? "filterable " : "";
				// Give the field's render function (if supplied) access to ALL the things!

				// Build out the body of the <td>
				let recordBody = record[field.name];

				// If this field has a render function, call it with some props
				if (field.render && typeof field.render === "function") {
					const renderProps = { value: record[field.name], record, field, ...this.props };
					recordBody = field.render(renderProps);
				}

				// Determine if the body is empty
				let bodyIsEmpty = (recordBody === null || recordBody === undefined || recordBody.toString().length === 0);

				// If the body is empty and the field has something set for emptyDisplay, use that as the text.
				if (field.emptyDisplay && (bodyIsEmpty)) {
					recordBody = field.emptyDisplay;
				}

				// add the "empty" classname if record is empty
				if (bodyIsEmpty) {
					spanClassName += "empty"
				}


				return (
					<td className={field.tdClassName ? field.tdClassName : null} key={q}>
						<span className={spanClassName} onClick={field.exactFilterable ? () => addExactFilter(record[field.name], field.name, (fieldDisplayName)) : null}>
							{recordBody}
						</span>
					</td>
				);
			});

			return (
				<tr key={i}>
					{tableTds}
				</tr>
			);
		});

		const tfootCells = fields.map((field, i) => {
			return (
				<td key={i} className={field.tdClassName ? field.tdClassName : null}>
					{field.footerValue || '' }
				</td>
			);
		});


		return (
			rows.length === 0 ? 
				(<p className="well text-center">{this.props.noFilteredRecordsMessage || 'There are no records to display.'}</p>)
			:
			<div>
				<table className="table table-condensed table-hover filterable-table">
					<thead>
						<tr>
							{headerCells}
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
					<tfoot>
						<tr>
							{tfootCells}
						</tr>
					</tfoot>
				</table>
			</div>
		);
	}
}

module.exports = Table;
