import React from 'react';
import Table from './Table';
import Header from './Header';
import Pager from 'react-pager';
import FilterAndSort from '../Helpers/FilterAndSort';
import axios from 'axios';
import isElementInViewport from '../Helpers/isElementInViewport';

class FilterableTable extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			entries: this.props.data || [],
			sort: this.props.initialSort,
			sortDir: (typeof this.props.initialSortDir === "boolean") ? this.props.initialSortDir : true,
			filter: '',
			exactFilters: [],
			serverError: false,
			totalPages: 1,
			visiblePages: 5,
			page: 0,
			pageSize: +localStorage.getItem(this.props.namespace + '.PageSize') || 10
		}

		this.loadData = this.loadData.bind(this);
		this.setData = this.setData.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.addExactFilter = this.addExactFilter.bind(this);
		this.updatePageSize = this.updatePageSize.bind(this);
		this.updatePage = this.updatePage.bind(this);
		this.filterInputChanged = this.filterInputChanged.bind(this);
		this.updateSort = this.updateSort.bind(this);
		this.removeExactFilter = this.removeExactFilter.bind(this);

		axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	}

	static get defaultProps() {
		// Set defaults if values weren't passed in
		return {
			noRecordsMessage: "There are no records to display",
			noFilteredRecordsMessage: "There are no records to display"
		}
	}


	componentDidMount() {
		this.loadData();
		// focus the search input when '/' is pressed
		window.onkeydown = function(e) {
			// Don't focus if the active element is one of these
			let ignoredTags = ["INPUT", "SELECT"];
			// 191 is '/'
			if (e.which === 191 && ignoredTags.indexOf(document.activeElement.tagName) < 0) {
				e.preventDefault();
				document.querySelector("input.filter-input").focus();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setData(nextProps.data);
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
			axios.get(this.props.dataEndpoint)
			.then(response => response.data)
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
			page: 0
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
		if (!value) { return; }

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
	}

	removeExactFilter(filter) {
		let { exactFilters } = this.state;
		let index = exactFilters.indexOf(filter);
		if (index > -1) {
			exactFilters.splice(index, 1);
		}
		this.setState({
			exactFilters,
			page: 0
		});
		this.scrollIntoView();
	}


	updatePage(page) {
		this.setState({ page });
		this.scrollIntoView();
	}

	updatePageSize(event) {
		let pageSize = +event.target.value;
		this.setState({ page: 0, pageSize });
		localStorage.setItem(this.props.namespace + '.PageSize', pageSize);
	}

	filterInputChanged(event) {
		this.updateFilter(event.target.value);
		this.setState({ page: 0 });
	}

	updateSort(sort) {
		let sortDir = this.state.sortDir;
		if (sort === this.state.sort) {
			// If sorting again on the same field, switch the sort direction
			sortDir = !sortDir;
		} else {
			// Default to asc when sorting on new field
			sortDir = true;
		}
		this.setState({
			sort,
			sortDir,
			page: 0
		});
	}

	scrollIntoView() {
		// Make sure things are in view
		let table = document.querySelector('table.filterable-table');
		if (!isElementInViewport(table)) {
			table.scrollIntoView();
		}
	}

	render() {

		let loading = !this.state.loading ? '' :
			<div className="well text-center">
				Loading...
			</div>;

		let serverErrorMessage = !this.state.serverError ? '' :
			<div className="alert alert-danger text-center">
				Something went wrong! Check console for error message(s).
			</div>;

		let noRecordsMessage = (!this.state.serverError && !this.state.loading && this.state.entries.length === 0)
		?  <div>
				{this.props.noRecordsMessage}
			</div>
		: '';


		let filteredEntries = FilterAndSort(this.state.entries, {
			filter: this.state.filter,
			exactFilters: this.state.exactFilters,
			sort: this.state.sort,
			sortDir: this.state.sortDir,
			fields: this.props.fields
		});


		let table = this.state.loading || this.state.entries.length === 0 ? '' :
			<Table
				records={filteredEntries}
				fields={this.props.fields}
				filter={this.state.filter}
				filterExact={this.state.filterExact}
				addExactFilter={this.addExactFilter}
				updateSort={this.updateSort}
				sort={this.state.sort}
				sortDir={this.state.sortDir}
				page={this.state.page}
				pageSize={this.state.pageSize}
				noFilteredRecordsMessage={this.props.noFilteredRecordsMessage}
				className={this.props.tableClassName}
			/>;


		let totalPages = (filteredEntries && filteredEntries.length > 0) ?
			Math.ceil(filteredEntries.length / this.state.pageSize)
			: 0;

		let topPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false ? '' :
			<Pager total={totalPages}
				current={this.state.page}
				visiblePages={this.state.visiblePages}
				onPageChanged={this.updatePage}
				className="pagination-sm pull-right"
			/>;

		let bottomPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false ? '' :
			<Pager total={totalPages}
				current={this.state.page}
				visiblePages={this.state.visiblePages}
				onPageChanged={this.updatePage}
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
					pagersVisible={this.props.pagersVisible}
				>
				</Header>
				

				<div className="report-table-container">
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
