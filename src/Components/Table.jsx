import React from 'react';
const hasValue = require('../Helpers/hasValue');
const getValue = require('../Helpers/getValue');

class Table extends React.Component {

	headerSortElement(field) {
		// Return the prop element for the sort icon (if provided)
		if (field.sortable) {
			let sortField = this.props.sortFields.find(sf => sf.name === field.name || (sf.name === field.sortFieldName && field.sortFieldName != null));
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
			visible,
			onRowClicked
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

		const headerRow = <tr>{
			fields.map((field, i) => {
				// Use the displayName property if supplied, otherwise use name
				let fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
				const renderProps = { field, ...this.props };
				if (typeof(field.thRender) === "function") {
					fieldDisplayName = field.thRender(renderProps);
				}

				let thProps = field.thProps || {};
				if (typeof(thProps) === "function") {
					thProps = thProps(renderProps);
				}

				return (
					<th className={field.thClassName ? field.thClassName : null} key={i} title={field.title || null} onClick={field.sortable ? () => updateSort(field.sortFieldName || field.name) : null} {...thProps}>
						<span className={field.sortable ? "sortable" : null}>{fieldDisplayName}</span>
						{this.headerSortElement(field)}
					</th>
				);
			})
		}</tr>;

		// Add filter textboxes above the table headers if the `showHeaderFilters` prop was set
		const headerFilterRow = this.props.showHeaderFilters && <tr>
			{fields.map((field, i) => {
				const fieldFilter = this.props.fieldFilters.find(f => f.fieldname === field.name);
				return <th key={`fieldFilter_${i}`} className="headerFilter">
					{field.inputFilterable &&
						<span className="filter-container">
							<input
								className={`form-control form-control-sm filter-input ${fieldFilter && fieldFilter.value.length ? "has-value" : ""}`}
								placeholder="Filter"
								value={fieldFilter ? fieldFilter.value : ""}
								onChange={(e) => this.props.updateFieldFilter({ fieldname: field.name, value: e.target.value, exact: (field.fieldFilterExact || false) })}
							/>
								<span className="close clear-filter" onClick={(e) => {
									this.props.updateFieldFilter({ fieldname: field.name, value: "" });
									// Focus the text box
									e.target.parentElement.firstElementChild.focus();
								}}>&times;</span>
						</span>
					}
				</th>
			}
			)}
		</tr>;


		const rows = records.map((record, i) => {
			let trClassName = this.props.trClassName || null;
			let trProps = this.props.trProps || {};

			if (typeof(trProps) === "function") {
				trProps = trProps(record, i);
			}

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
					recordIndex: i,
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

				let tdProps = {};
				if (field.tdProps != null) {
					tdProps = field.tdProps;
					if (typeof(tdProps) === "function") {
						tdProps = tdProps(renderProps);
					}
				}

				return (
					<td className={tdClassName} {...tdProps} key={q}>
						{tdContent}
					</td>
				);
			});

			const rowClicked = onRowClicked ? () => onRowClicked({ record, index: i }) : null;
			return (
				<tr key={i} className={trClassName} {...trProps} onClick={rowClicked} >
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

		const tableProps = this.props.tableProps ? this.props.tableProps : {};

		return (
			rows.length === 0 && this.props.fieldFilters.length === 0 ? 
				(<div>{this.props.noFilteredRecordsMessage || 'There are no records to display.'}</div>)
			:
			<div>
				<table className={tableClassName} style={this.props.style} {...tableProps}>
					<thead>
						{headerFilterRow}
						{headerRow}
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
