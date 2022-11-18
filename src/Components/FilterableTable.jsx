import React from 'react';
import Table from './Table';
import Header from './Header';
import Pager from 'react-pager';
import FilterAndSort from '../Helpers/FilterAndSort';
import isElementInViewport from '../Helpers/isElementInViewport';

class FilterableTable extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			entries: this.props.data || [],
			sortFields: [ { name: this.props.initialSort, reverse: (typeof this.props.initialSortDir === "boolean") ? !this.props.initialSortDir : false }],
			filter: '',
			exactFilters: this.props.initialExactFilters || [],
			fieldFilters: this.props.initialFieldFilters || [],
			serverError: false,
			totalPages: 1,
			visiblePages: 5,
			page: 0,
			pageSize: +localStorage.getItem(this.props.namespace + '.PageSize') || this.props.pageSize || 10,
			shiftDown: false
		}

		this.tableRef = React.createRef();

		this.loadData = this.loadData.bind(this);
		this.setData = this.setData.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.addExactFilter = this.addExactFilter.bind(this);
		this.updateFieldFilter = this.updateFieldFilter.bind(this);
		this.updatePageSize = this.updatePageSize.bind(this);
		this.updatePage = this.updatePage.bind(this);
		this.filterInputChanged = this.filterInputChanged.bind(this);
		this.updateSort = this.updateSort.bind(this);
		this.scrollIntoView = this.scrollIntoView.bind(this);
		this.removeExactFilter = this.removeExactFilter.bind(this);

		this.keydownEventListener = (e) => {
			if (e.which === 16) { // Shift
				if (!this.state.shiftDown) {
					this.setState({ shiftDown: true });
				}
			}
		}
		this.keyupEventListener = (e) => {
			if (e.which === 16) { // Shift
				if (this.state.shiftDown) {
					this.setState({ shiftDown: false });
				}
			}
		}

	}

	static get defaultProps() {
		// Set defaults if values weren't passed in
		return {
			noRecordsMessage: "There are no records to display",
			tableClassName: "table table-condensed table-hover filterable-table",
			pageSizes: [10, 20, 30, 50]
		}
	}

	componentDidMount() {
		this.loadData();
		// Keep track of shift key
		window.addEventListener("keydown", this.keydownEventListener, false);
		window.addEventListener("keyup", this.keyupEventListener, false);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.keydownEventListener, false);
		window.removeEventListener("keyup", this.keyupEventListener, false);
	}

	componentDidUpdate(prevProps) {
		// If the `data` prop changes, make sure we run our onDataReceived callback (if supplied)
		// and set our states
		if (this.props.hasOwnProperty('data') && prevProps.data !== this.props.data) {
			this.setData(this.props.data);
		}

		if (this.props.hasOwnProperty('sortFields') && prevProps.sortFields !== this.props.sortFields) {
			this.setState({ sort: this.props.sortFields });
		}

		if (this.props.hasOwnProperty('loading') && prevProps.loading !== this.props.loading) {
			this.setState({ loading: this.props.loading });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.hasOwnProperty("shiftDown") && nextState.shiftDown !== this.state.shiftDown) {
			// Don't re-render when holding down shift
			return false;
		}
		return true;
	}

	loadData(e) {
		if (e) { e.preventDefault() }

		// Make sure either data was set or an endpoint was passed in
		if (!Array.isArray(this.props.data) && !this.props.dataEndpoint) {
			throw "No data was passed in and no data endpoint was set.";
		}

		// Set state to 'loading' to show the "Loading..." message
		this.setState({
			loading: true
		});


		if (Array.isArray(this.props.data)) {
			this.setData(this.props.data);
		} else {
			// Load data from endpoint
			fetch(this.props.dataEndpoint)
				.then(r => {
					if (r.status !== 200) {
						throw r;
					}
					return r;
				})
				.then(r => r.json())
				.then(entries => {
					this.setData(entries);
				})
				.catch(error => {
					this.setState({
						serverError: true,
						loading: false
					});
					console.log(error);
				});
		}

	}

	setData(entries) {
		if (this.props.onDataReceived) {
			// Run callback if supplied
			this.props.onDataReceived(entries);
		}

		this.setState({
			entries,
			loading: false,
			serverError: false,
			page: this.props.maintainPageOnSetData ? this.state.page : 0
		});

	}

	updateFilter(filter) {
		// Set the state filter to what was passed in.
		this.setState({
			filter,
			page: 0
		});

		this.scrollIntoView();
	}


	addExactFilter(value, fieldname, name = fieldname) {
		// Exact filters are an array; grab the existing ones and push this one on it.
		// Don't add it if value is null/undefined
		if (value === undefined || value === null || value.toString().length === 0) { return; }

		let { exactFilters } = this.state;

		// Build our object to push onto the array
		let thisFilter = {
			value: value.toString(),
			fieldname,
			name
		}

		// Don't add it if it's already in there
		let filterExists = exactFilters.some(f => {
			// If field and value ar the same, we already have this filter.
			return f.fieldname === thisFilter.fieldname && f.value === thisFilter.value;
		});

		if (filterExists) { return; }

		exactFilters.push(thisFilter);

		// Update state
		this.setState({
			exactFilters,
			page: 0
		});

		// Call callback if supplied
		if (this.props.onFilterAdded) {
			this.props.onFilterAdded(thisFilter);
		}
	}

	// Adds/updates a field filter
	// fieldFilter: object { fieldname, value, exact }
	updateFieldFilter(fieldFilter) {
		let fieldFilters = this.state.fieldFilters.slice();
		let existingFilterIndex = fieldFilters.findIndex(f => f.fieldname === fieldFilter.fieldname);
		if (existingFilterIndex > -1) {
			// Remove the filter if it exists
			if (fieldFilter.value.length === 0) {
				fieldFilters.splice(existingFilterIndex, 1);
			} else {
				fieldFilters[existingFilterIndex] = fieldFilter;
			}
		} else {
			// Doesn't exist yet, add it
			fieldFilters.push(fieldFilter);
		}
		this.setState({ fieldFilters, page: 0 });
		// Call callback if supplied
		if (this.props.onFilterAdded) {
			this.props.onFilterAdded(fieldFilter);
		}
	}

	removeExactFilter(filter, e) {
		let { exactFilters } = this.state;
		let index = exactFilters.indexOf(filter);
		let removedFilter = null;
		if (index > -1) {
			removedFilter = exactFilters.splice(index, 1).pop();
		}
		this.setState({
			exactFilters,
			page: 0
		});
		this.scrollIntoView();

		// Call callback if supplied
		if (this.props.onFilterRemoved) {
			this.props.onFilterRemoved(removedFilter, e);
		}
	}


	updatePage(page) {
		this.setState({ page });
		this.scrollIntoView();
	}

	updatePageSize(event) {
		let pageSize = +event.target.value;
		this.setState({ page: 0, pageSize });
		if (this.props.namespace) {
			localStorage.setItem(this.props.namespace + '.PageSize', pageSize);
		}
	}

	filterInputChanged(event) {
		this.updateFilter(event.target.value);
		this.setState({ page: 0 });
	}

	updateSort(sort) {
		let append = this.state.shiftDown;
		let sortFields = this.state.sortFields.concat();
		let sortField = sortFields.find(sf => sf.name === sort);
		let alreadyExists = sortField !== undefined;
		if (alreadyExists) {
			// Swap direction
			sortField.reverse = !sortField.reverse;
		} else {
			// Add to sort
			sortField = { name: sort, reverse: false };
		}

		if (append && !alreadyExists) {
			sortFields.push(sortField);
		}
		if (!append) {
			sortFields = [sortField];
		}

		this.setState({
			sortFields,
			page: 0
		});
	}

	scrollIntoView() {
		// Make sure things are in view
		if (this.tableRef && this.tableRef.current) {
			let table = this.tableRef.current.table;
			if (table && !isElementInViewport(table)) {
				table.scrollIntoView();
			}
		}
	}

	render() {
		let fields = this.props.fields || [];

		// If fields prop was not specified, use object keys of first record as fieldnames
		if (this.props.fields === undefined && this.state.entries.length > 0) {
			fields = Object.keys(this.state.entries[0]).map(name => ({ name }));
		}

		let loading = this.state.loading &&
			(
				this.props.loadingMessage || 
				<div className="well text-center">
					Loading...
				</div>
			)

		let serverErrorMessage = this.state.serverError &&
			(
				this.props.serverErrorMessage ||
				<div className="alert alert-danger text-center">
					Something went wrong! Check console for error message(s).
				</div>
			)

		let noRecordsMessage = (!this.state.serverError && !this.state.loading && this.state.entries.length === 0) &&
		  	<div>
				{this.props.noRecordsMessage}
			</div>


		let filteredEntries = FilterAndSort(this.state.entries, {
			filter: this.state.filter,
			exactFilters: this.state.exactFilters,
			fieldFilters: this.state.fieldFilters,
			sortFields: this.state.sortFields,
			fields: fields
		});


		let table = !this.state.loading && this.state.entries.length > 0 &&
			<Table
				records={filteredEntries}
				allRecords={this.state.entries}
				fields={fields}
				filterExact={this.state.filterExact}
				addExactFilter={this.addExactFilter}
				updateFieldFilter={this.updateFieldFilter}
				fieldFilters={this.state.fieldFilters}
				updateSort={this.updateSort}
				sortFields={this.state.sortFields}
				iconSort={this.props.iconSort}
				iconSortedAsc={this.props.iconSortedAsc}
				iconSortedDesc={this.props.iconSortedDesc}
				page={this.state.page}
				pageSize={this.state.pageSize}
				pagersVisible={this.props.pagersVisible}
				noFilteredRecordsMessage={this.props.noFilteredRecordsMessage}
				className={this.props.tableClassName}
				tableProps={this.props.tableProps}
				trClassName={this.props.trClassName}
				style={this.props.style}
				showHeaderFilters={this.props.showHeaderFilters}
				onRowClicked={this.props.onRowClicked}
				ref={this.tableRef}
			/>


		let totalPages = (filteredEntries && filteredEntries.length > 0) ?
			Math.ceil(filteredEntries.length / this.state.pageSize)
			: 0;

		let topPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false || this.props.topPagerVisible === false ? '' :
			<Pager total={totalPages}
				current={this.state.page}
				visiblePages={this.state.visiblePages}
				onPageChanged={this.updatePage}
				className={this.props.pagerTopClassName || "pagination-sm pull-right"}
				titles={this.props.pagerTitles}
			/>;

		let bottomPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false || this.props.bottomPagerVisible === false ? '' :
			<Pager total={totalPages}
				current={this.state.page}
				visiblePages={this.state.visiblePages}
				onPageChanged={this.updatePage}
				className={this.props.pagerBottomClassName}
				titles={this.props.pagerTitles}
			/>;


		return (
			<div className={"filterable-table-container" + (this.props.className ? ' ' + this.props.className : '')}>
				<Header
					loading={this.state.loading}
					updateFilter={this.updateFilter}
					updateSort={this.updateSort}
					filter={this.state.filter}
					exactFilters={this.state.exactFilters}
					removeExactFilter={this.removeExactFilter}
					pageSize={this.state.pageSize}
					updatePageSize={this.updatePageSize}
					pager={topPager}
					recordCount={filteredEntries.length}
					recordCountName={this.props.recordCountName}
					recordCountNamePlural={this.props.recordCountNamePlural}
					upperHeaderChildren={this.props.upperHeaderChildren}
					lowerHeaderChildren={this.props.lowerHeaderChildren}
					visible={this.props.headerVisible}
					filterInputVisible={this.props.filterInputVisible}
					pagersVisible={this.props.pagersVisible}
					pageSizes={this.props.pageSizes}
					autofocusFilter={this.props.autofocusFilter}
				>
				</Header>
				

				<div className="table-container">
					{loading}
					{serverErrorMessage}
					{noRecordsMessage}
					{table}
					{bottomPager}
				</div>
			</div>
		);
	}
}

module.exports = FilterableTable;
