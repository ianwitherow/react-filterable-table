import React from 'react';
const hasValue = require('../Helpers/hasValue');
const getValue = require('../Helpers/getValue');

class Table extends React.Component {

	headerSortElement(field) {
		// Return the prop element for the sort icon (if provided)
		if (field.sortable) {
			let sortField = this.props.sortFields.find(sf => sf.name === field.name || sf.name === field.sortFieldName);
			if (sortField) {
				if (!sortField.reverse) {
					return this.props.iconSortedAsc || <span className="fa fa-sort-asc" />;
				} else {
					return this.props.iconSortedDesc || <span className="fa fa-sort-desc" />;
				}
			}
			return this.props.iconSort || <span className="fa fa-sort" />;
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
		// if pagersVisible is false, don't slice it - all records should be shown
		let records = this.props.records;
		if (this.props.pagersVisible !== false) {
			records = records.slice(startIndex, endIndex);
		}

		// If the field has the visible property set to false, ignore it
		const fields = this.props.fields.filter(field => {
			return field.visible !== false;
		});

		const headerCells = fields.map((field, i) => {
			// Use the displayName property if supplied, otherwise use name
			let fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
			const renderProps = { field, ...this.props };
			if (typeof(field.thRender) === "function") {
				fieldDisplayName = field.thRender(renderProps);
			}

			return (
				<th onClick={field.sortable ? () => updateSort(field.sortFieldName || field.name) : null} className={field.thClassName ? field.thClassName : null} key={i} title={field.title || null}>
					<span className={field.sortable ? "sortable" : null}>{fieldDisplayName}</span>
					{this.headerSortElement(field)}
				</th>
			);
		});

		const rows = records.map((record, i) => {
			let trClassName = this.props.trClassName || null;
			if (typeof(this.props.trClassName) === "function") {
				trClassName = this.props.trClassName(record, i);
			}

			const tableTds = fields.map((field, q) => {
				// Use the displayName property if supplied, otherwise use name
				let fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
				let spanClassName = "";
				let tdClassName = field.tdClassName || null;

				// Build out the body of the <td>
				let recordBody = getValue(record, field.name);

				// If this field has a render function, call it with some props
				const renderProps = {
					value: recordBody,
					record,
					records: this.props.allRecords,
					filteredRecords: records,
					field,
					...this.props
				};

				if (field.render && typeof field.render === "function") {
					recordBody = field.render(renderProps);
				}

				// If tdClassName is a function, call it with our renderProps
				if (typeof(field.tdClassName) === "function") {
					 tdClassName = field.tdClassName(renderProps);
				}

				// Determine if the body is empty
				let bodyIsEmpty = (recordBody === null || recordBody === undefined || recordBody.toString().length === 0);

				// If the body is empty and the field has something set for emptyDisplay, use that as the text.
				if (field.emptyDisplay && (bodyIsEmpty)) {
					recordBody = field.emptyDisplay;
				}

				// add the "empty" classname if record is empty
				if (bodyIsEmpty) {
					spanClassName = "empty"
				}

				if (!bodyIsEmpty && field.exactFilterable) {
					spanClassName = "filterable";
				}

				let tdContent = hasValue(recordBody)
					?  <span className={spanClassName} onClick={field.exactFilterable ? () => addExactFilter(getValue(record, field.name), field.name, (fieldDisplayName)) : null}>
							{recordBody}
						</span>
					: null;

				return (
					<td className={tdClassName} key={q}>
						{tdContent}
					</td>
				);
			});

			return (
				<tr key={i} className={trClassName}>
					{tableTds}
				</tr>
			);
		});

		const tfoot = fields.some(f => f.footerValue)
			? (
				<tfoot>
					<tr className={this.props.footerTrClassName}>
						{
							fields.map((field, i) => {
								const renderProps = {
									records: this.props.allRecords,
									filteredRecords: this.props.records,
									field,
									...this.props
								};

								return (
									<td key={i} className={field.footerTdClassName}>
										{(typeof field.footerValue === "function" ? field.footerValue(renderProps) : field.footerValue) || '' }
									</td>
								)
							})
						}
					</tr>
				</tfoot>
			)
			: null;

		let tableClassName = this.props.className;
		if (tableClassName.indexOf('filterable-table') === -1) {
			// Make sure class 'filterable-table' is included
			tableClassName += " filterable-table";
		}

		return (
			rows.length === 0 ? 
				(<div>{this.props.noFilteredRecordsMessage || 'There are no records to display.'}</div>)
			:
			<div>
				<table className={tableClassName} style={this.props.style} ref="table">
					<thead>
						<tr>
							{headerCells}
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
					{tfoot}
				</table>
			</div>
		);
	}
}

module.exports = Table;
