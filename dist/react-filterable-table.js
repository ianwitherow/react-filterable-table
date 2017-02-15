(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["FilterableTable"] = factory(require("react"));
	else
		root["FilterableTable"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _Table = __webpack_require__(4);

	var _Table2 = _interopRequireDefault(_Table);

	var _Header = __webpack_require__(5);

	var _Header2 = _interopRequireDefault(_Header);

	var _reactPager = __webpack_require__(8);

	var _reactPager2 = _interopRequireDefault(_reactPager);

	var _FilterAndSort = __webpack_require__(9);

	var _FilterAndSort2 = _interopRequireDefault(_FilterAndSort);

	var _axios = __webpack_require__(10);

	var _axios2 = _interopRequireDefault(_axios);

	var _isElementInViewport = __webpack_require__(36);

	var _isElementInViewport2 = _interopRequireDefault(_isElementInViewport);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FilterableTable = function (_React$Component) {
		_inherits(FilterableTable, _React$Component);

		function FilterableTable(props) {
			_classCallCheck(this, FilterableTable);

			var _this = _possibleConstructorReturn(this, (FilterableTable.__proto__ || Object.getPrototypeOf(FilterableTable)).call(this, props));

			_this.state = {
				loading: false,
				entries: _this.props.data || [],
				sort: _this.props.initialSort,
				sortDir: typeof _this.props.initialSortDir === "boolean" ? _this.props.initialSortDir : true,
				filter: '',
				exactFilters: [],
				serverError: false,
				totalPages: 1,
				visiblePages: 5,
				page: 0,
				pageSize: +localStorage.getItem(_this.props.namespace + '.PageSize') || 10
			};

			_this.loadData = _this.loadData.bind(_this);
			_this.setData = _this.setData.bind(_this);
			_this.updateFilter = _this.updateFilter.bind(_this);
			_this.addExactFilter = _this.addExactFilter.bind(_this);
			_this.updatePageSize = _this.updatePageSize.bind(_this);
			_this.updatePage = _this.updatePage.bind(_this);
			_this.filterInputChanged = _this.filterInputChanged.bind(_this);
			_this.updateSort = _this.updateSort.bind(_this);
			_this.removeExactFilter = _this.removeExactFilter.bind(_this);

			_axios2.default.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
			return _this;
		}

		_createClass(FilterableTable, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.loadData();
				// focus the search input when '/' is pressed
				window.onkeydown = function (e) {
					// Don't focus if the active element is one of these
					var ignoredTags = ["INPUT", "SELECT"];
					// 191 is '/'
					if (e.which === 191 && ignoredTags.indexOf(document.activeElement.tagName) < 0) {
						e.preventDefault();
						document.querySelector("input.filter-input").focus();
					}
				};
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				// If the `data` prop changes, make sure we run our onDataReceived callback (if supplied)
				// and set our states
				if (nextProps.hasOwnProperty('data')) {
					this.setData(nextProps.data);
				}
			}
		}, {
			key: 'loadData',
			value: function loadData(e) {
				var _this2 = this;

				if (e) {
					e.preventDefault();
				}

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
					_axios2.default.get(this.props.dataEndpoint).then(function (response) {
						return response.data;
					}).then(function (entries) {
						_this2.setData(entries);
					}).catch(function (error) {
						_this2.setState({
							serverError: true,
							loading: false
						});
						console.log(error);
					});
				}
			}
		}, {
			key: 'setData',
			value: function setData(entries) {
				if (this.props.onDataReceived) {
					// Run callback if supplied
					this.props.onDataReceived(entries);
				}

				this.setState({
					entries: entries,
					loading: false,
					serverError: false,
					page: 0
				});
			}
		}, {
			key: 'updateFilter',
			value: function updateFilter(filter) {
				// Set the state filter to what was passed in.
				this.setState({
					filter: filter,
					page: 0
				});

				this.scrollIntoView();
			}
		}, {
			key: 'addExactFilter',
			value: function addExactFilter(value, fieldname) {
				var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : fieldname;

				// Exact filters are an array; grab the existing ones and push this one on it.
				// Don't add it if value is null/undefined
				if (!value) {
					return;
				}

				var exactFilters = this.state.exactFilters;

				// Build our object to push onto the array

				var thisFilter = {
					value: value.toString(),
					fieldname: fieldname,
					name: name
				};

				// Don't add it if it's already in there
				var filterExists = exactFilters.some(function (f) {
					// If field and value ar the same, we already have this filter.
					return f.fieldname === thisFilter.fieldname && f.value === thisFilter.value;
				});

				if (filterExists) {
					return;
				}

				exactFilters.push(thisFilter);

				// Update state
				this.setState({
					exactFilters: exactFilters,
					page: 0
				});
			}
		}, {
			key: 'removeExactFilter',
			value: function removeExactFilter(filter) {
				var exactFilters = this.state.exactFilters;

				var index = exactFilters.indexOf(filter);
				if (index > -1) {
					exactFilters.splice(index, 1);
				}
				this.setState({
					exactFilters: exactFilters,
					page: 0
				});
				this.scrollIntoView();
			}
		}, {
			key: 'updatePage',
			value: function updatePage(page) {
				this.setState({ page: page });
				this.scrollIntoView();
			}
		}, {
			key: 'updatePageSize',
			value: function updatePageSize(event) {
				var pageSize = +event.target.value;
				this.setState({ page: 0, pageSize: pageSize });
				localStorage.setItem(this.props.namespace + '.PageSize', pageSize);
			}
		}, {
			key: 'filterInputChanged',
			value: function filterInputChanged(event) {
				this.updateFilter(event.target.value);
				this.setState({ page: 0 });
			}
		}, {
			key: 'updateSort',
			value: function updateSort(sort) {
				var sortDir = this.state.sortDir;
				if (sort === this.state.sort) {
					// If sorting again on the same field, switch the sort direction
					sortDir = !sortDir;
				} else {
					// Default to asc when sorting on new field
					sortDir = true;
				}
				this.setState({
					sort: sort,
					sortDir: sortDir,
					page: 0
				});
			}
		}, {
			key: 'scrollIntoView',
			value: function scrollIntoView() {
				// Make sure things are in view
				var table = document.querySelector('table.filterable-table');
				if (!(0, _isElementInViewport2.default)(table)) {
					table.scrollIntoView();
				}
			}
		}, {
			key: 'render',
			value: function render() {

				var loading = !this.state.loading ? '' : _react2.default.createElement(
					'div',
					{ className: 'well text-center' },
					'Loading...'
				);

				var serverErrorMessage = !this.state.serverError ? '' : _react2.default.createElement(
					'div',
					{ className: 'alert alert-danger text-center' },
					'Something went wrong! Check console for error message(s).'
				);

				var noRecordsMessage = !this.state.serverError && !this.state.loading && this.state.entries.length === 0 ? _react2.default.createElement(
					'div',
					null,
					this.props.noRecordsMessage
				) : '';

				var filteredEntries = (0, _FilterAndSort2.default)(this.state.entries, {
					filter: this.state.filter,
					exactFilters: this.state.exactFilters,
					sort: this.state.sort,
					sortDir: this.state.sortDir,
					stickySorting: this.props.stickySorting,
					fields: this.props.fields
				});

				var table = this.state.loading || this.state.entries.length === 0 ? '' : _react2.default.createElement(_Table2.default, {
					records: filteredEntries,
					fields: this.props.fields,
					filter: this.state.filter,
					filterExact: this.state.filterExact,
					addExactFilter: this.addExactFilter,
					updateSort: this.updateSort,
					sort: this.state.sort,
					sortDir: this.state.sortDir,
					page: this.state.page,
					pageSize: this.state.pageSize,
					noFilteredRecordsMessage: this.props.noFilteredRecordsMessage,
					className: this.props.tableClassName
				});

				var totalPages = filteredEntries && filteredEntries.length > 0 ? Math.ceil(filteredEntries.length / this.state.pageSize) : 0;

				var topPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false ? '' : _react2.default.createElement(_reactPager2.default, { total: totalPages,
					current: this.state.page,
					visiblePages: this.state.visiblePages,
					onPageChanged: this.updatePage,
					className: 'pagination-sm pull-right'
				});

				var bottomPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false ? '' : _react2.default.createElement(_reactPager2.default, { total: totalPages,
					current: this.state.page,
					visiblePages: this.state.visiblePages,
					onPageChanged: this.updatePage
				});

				return _react2.default.createElement(
					'div',
					{ className: "filterable-table-container" + (this.props.className ? ' ' + this.props.className : '') },
					_react2.default.createElement(_Header2.default, {
						loading: this.state.loading,
						updateFilter: this.updateFilter,
						updateSort: this.updateSort,
						filter: this.state.filter,
						exactFilters: this.state.exactFilters,
						removeExactFilter: this.removeExactFilter,
						pageSize: this.state.pageSize,
						updatePageSize: this.updatePageSize,
						pager: topPager,
						recordCount: filteredEntries.length,
						recordCountName: this.props.recordCountName,
						recordCountNamePlural: this.props.recordCountNamePlural,
						upperHeaderChildren: this.props.upperHeaderChildren,
						lowerHeaderChildren: this.props.lowerHeaderChildren,
						visible: this.props.headerVisible,
						pagersVisible: this.props.pagersVisible
					}),
					_react2.default.createElement(
						'div',
						{ className: 'report-table-container' },
						loading,
						serverErrorMessage,
						noRecordsMessage,
						table,
						bottomPager
					)
				);
			}
		}], [{
			key: 'defaultProps',
			get: function get() {
				// Set defaults if values weren't passed in
				return {
					noRecordsMessage: "There are no records to display",
					noFilteredRecordsMessage: "There are no records to display",
					stickySorting: false,
					namespace: "react-filterable-table"
				};
			}
		}]);

		return FilterableTable;
	}(_react2.default.Component);

	module.exports = FilterableTable;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Table = function (_React$Component) {
		_inherits(Table, _React$Component);

		function Table(props) {
			_classCallCheck(this, Table);

			var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

			_this.headerSortClassName = _this.headerSortClassName.bind(_this);
			return _this;
		}

		_createClass(Table, [{
			key: "headerSortClassName",
			value: function headerSortClassName(field) {
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
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    addExactFilter = _props.addExactFilter,
				    updateSort = _props.updateSort,
				    page = _props.page,
				    pageSize = _props.pageSize,
				    visible = _props.visible;

				// Paging - determine indexes for where to slice the array

				var startIndex = page * pageSize;
				var endIndex = startIndex + pageSize;

				// Slice array based on what should be shown on the current page
				var records = this.props.records.slice(startIndex, endIndex);

				// If the field has the visible property set to false, ignore it
				var fields = this.props.fields.filter(function (field) {
					return field.visible !== false;
				});

				var headerCells = fields.map(function (field, i) {
					// Use the displayName property if supplied, otherwise use name
					var fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
					return _react2.default.createElement(
						"th",
						{ onClick: field.sortable ? function () {
								return updateSort(field.sortFieldName || field.name);
							} : null, className: field.thClassName ? field.thClassName : null, key: i },
						_react2.default.createElement(
							"span",
							{ className: field.sortable ? "sortable" : null },
							fieldDisplayName
						),
						_react2.default.createElement("span", { className: _this2.headerSortClassName(field) })
					);
				});

				var rows = records.map(function (record, i) {

					var tableTds = fields.map(function (field, q) {
						// Use the displayName property if supplied, otherwise use name
						var fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
						var recordBody = record[field.name];
						var spanClassName = field.exactFilterable && record[field.name] ? "filterable " : "";
						// Give the field's render function (if supplied) access to ALL the things!
						var renderProps = _extends({ value: record[field.name], record: record, field: field }, _this2.props);

						// Build out the body of the <td>
						if (field.render && typeof field.render === "function") {
							// This field has a render function; call it with our props
							recordBody = field.render(renderProps);
						} else {
							// If the record is empty and the field has something set for emptyDisplay, use that as the text.
							if (field.emptyDisplay && (!recordBody || recordBody.length === 0)) {
								recordBody = field.emptyDisplay;
							}
						}

						// add the "empty" classname if record is empty
						if (!record[field.name] || record[field.name].length === 0) {
							spanClassName += "empty";
						}

						return _react2.default.createElement(
							"td",
							{ className: field.tdClassName ? field.tdClassName : null, key: q },
							_react2.default.createElement(
								"span",
								{ className: spanClassName, onClick: field.exactFilterable ? function () {
										return addExactFilter(record[field.name], field.name, fieldDisplayName);
									} : null },
								recordBody
							)
						);
					});

					return _react2.default.createElement(
						"tr",
						{ key: i },
						tableTds
					);
				});

				var tfootCells = fields.map(function (field, i) {
					return _react2.default.createElement(
						"td",
						{ key: i, className: field.tdClassName ? field.tdClassName : null },
						field.footerValue || ''
					);
				});

				return rows.length === 0 ? _react2.default.createElement(
					"p",
					{ className: "well text-center" },
					this.props.noFilteredRecordsMessage || 'There are no records to display.'
				) : _react2.default.createElement(
					"div",
					null,
					_react2.default.createElement(
						"table",
						{ className: "table table-condensed table-hover filterable-table" },
						_react2.default.createElement(
							"thead",
							null,
							_react2.default.createElement(
								"tr",
								null,
								headerCells
							)
						),
						_react2.default.createElement(
							"tbody",
							null,
							rows
						),
						_react2.default.createElement(
							"tfoot",
							null,
							_react2.default.createElement(
								"tr",
								null,
								tfootCells
							)
						)
					)
				);
			}
		}]);

		return Table;
	}(_react2.default.Component);

	module.exports = Table;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _ExactFilters = __webpack_require__(6);

	var _ExactFilters2 = _interopRequireDefault(_ExactFilters);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Header = function (_React$Component) {
		_inherits(Header, _React$Component);

		function Header(props) {
			_classCallCheck(this, Header);

			var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

			_this.filterChanged = _this.filterChanged.bind(_this);
			return _this;
		}

		_createClass(Header, [{
			key: 'filterChanged',
			value: function filterChanged(event) {
				var newValue = event ? event.target.value : '';
				if (newValue.length === 0) {
					// When clearing filter, set focus in the text box
					this.refs.filter.focus();
				}
				this.props.updateFilter(newValue);
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				if (this.props.visible === false) {
					return _react2.default.createElement('div', null);
				}
				var _props = this.props,
				    loading = _props.loading,
				    recordCount = _props.recordCount,
				    filter = _props.filter,
				    updateFilter = _props.updateFilter,
				    updatePageSize = _props.updatePageSize;

				// Record count message -- the text at the top that says something like "4 records"
				// text can be overridden using the recordCountName and recordCountNamePlural props.

				var recordCountMessage = _react2.default.createElement(
					'span',
					null,
					recordCount,
					' ',
					recordCount === 1 ? this.props.recordCountName : this.props.recordCountNamePlural
				);

				return _react2.default.createElement(
					'div',
					null,
					this.props.children,
					this.props.upperHeaderChildren,
					_react2.default.createElement(
						'div',
						{ className: 'row header-row' },
						_react2.default.createElement(
							'div',
							{ className: 'col-sm-3 filter-container' },
							_react2.default.createElement(
								'span',
								{ className: 'filter-container' },
								_react2.default.createElement('input', { type: 'text', className: 'form-control filter-input', value: filter, onChange: this.filterChanged, ref: 'filter', placeholder: 'Filter' }),
								_react2.default.createElement(
									'span',
									{ className: 'close clear-filter', onClick: function onClick() {
											return _this2.filterChanged('');
										} },
									'\xD7'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'col-sm-5 col-sm-push-4' },
							_react2.default.createElement(
								'select',
								{ className: 'form-control pull-sm-right pull-md-right pull-lg-right', onChange: updatePageSize, value: this.props.pageSize },
								_react2.default.createElement(
									'option',
									{ value: '10' },
									'10 per page'
								),
								_react2.default.createElement(
									'option',
									{ value: '20' },
									'20 per page'
								),
								_react2.default.createElement(
									'option',
									{ value: '30' },
									'30 per page'
								),
								_react2.default.createElement(
									'option',
									{ value: '50' },
									'50 per page'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'col-sm-4 col-sm-pull-4 text-center text-muted record-count' },
							loading || recordCountMessage
						)
					),
					this.props.lowerHeaderChildren,
					_react2.default.createElement(
						'div',
						{ className: 'row header-row' },
						_react2.default.createElement(
							'div',
							{ className: 'col-sm-8' },
							_react2.default.createElement(_ExactFilters2.default, {
								exactFilters: this.props.exactFilters,
								removeExactFilter: this.props.removeExactFilter
							})
						),
						_react2.default.createElement(
							'div',
							{ className: 'col-sm-4 hidden-xs' },
							this.props.pager
						)
					)
				);
			}
		}], [{
			key: 'defaultProps',
			get: function get() {
				// Set defaults if values weren't passed in
				return {
					recordCountName: "record",
					recordCountNamePlural: "records"
				};
			}
		}]);

		return Header;
	}(_react2.default.Component);

	module.exports = Header;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ExactFilter = __webpack_require__(7);

	var ExactFilters = function (_React$Component) {
		_inherits(ExactFilters, _React$Component);

		function ExactFilters(props) {
			_classCallCheck(this, ExactFilters);

			return _possibleConstructorReturn(this, (ExactFilters.__proto__ || Object.getPrototypeOf(ExactFilters)).call(this, props));
		}

		_createClass(ExactFilters, [{
			key: 'render',
			value: function render() {
				var _props = this.props,
				    exactFilters = _props.exactFilters,
				    removeExactFilter = _props.removeExactFilter;


				var filters = exactFilters.map(function (filter, i) {
					return _react2.default.createElement(ExactFilter, { filter: filter, removeFilter: removeExactFilter, key: i });
				});

				return _react2.default.createElement(
					'div',
					{ className: 'exact-filters' },
					filters
				);
			}
		}]);

		return ExactFilters;
	}(_react2.default.Component);

	module.exports = ExactFilters;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ExactFilter = function (_React$Component) {
		_inherits(ExactFilter, _React$Component);

		function ExactFilter(props) {
			_classCallCheck(this, ExactFilter);

			return _possibleConstructorReturn(this, (ExactFilter.__proto__ || Object.getPrototypeOf(ExactFilter)).call(this, props));
		}

		_createClass(ExactFilter, [{
			key: "render",
			value: function render() {
				var _props = this.props,
				    filter = _props.filter,
				    removeFilter = _props.removeFilter;


				return _react2.default.createElement(
					"span",
					{ className: "filter-item" },
					_react2.default.createElement(
						"span",
						{ className: "filter-item-title" },
						_react2.default.createElement(
							"span",
							{ className: "filter-item-remove", onClick: function onClick() {
									return removeFilter(filter);
								} },
							_react2.default.createElement("span", { className: "fa fa-times" })
						),
						filter.name
					),
					_react2.default.createElement(
						"span",
						{ className: "filter-item-value" },
						filter.value
					)
				);
			}
		}]);

		return ExactFilter;
	}(_react2.default.Component);

	module.exports = ExactFilter;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(3)):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports.Pager=t(require("react")):e.Pager=t(e.react)}(this,function(e){return function(e){function t(n){if(a[n])return a[n].exports;var r=a[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){for(var a=[],n=e;n<t;n++)a.push(n);return a}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),u=a(1),c=n(u),d=0,p=1,h={first:"First",prev:"«",prevSet:"...",nextSet:"...",next:"»",last:"Last"},f=function(e){function t(e){r(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.handleFirstPage=a.handleFirstPage.bind(a),a.handlePreviousPage=a.handlePreviousPage.bind(a),a.handleNextPage=a.handleNextPage.bind(a),a.handleLastPage=a.handleLastPage.bind(a),a.handleMorePrevPages=a.handleMorePrevPages.bind(a),a.handleMoreNextPages=a.handleMoreNextPages.bind(a),a.handlePageChanged=a.handlePageChanged.bind(a),a}return s(t,e),o(t,[{key:"getTitles",value:function(e){return this.props.titles[e]||h[e]}},{key:"calcBlocks",value:function(){var e=this.props,t=e.total,a=e.visiblePages,n=e.current+p,r=Math.ceil(t/a),i=Math.ceil(n/a)-p;return{total:r,current:i,size:a}}},{key:"isPrevDisabled",value:function(){return this.props.current<=d}},{key:"isNextDisabled",value:function(){return this.props.current>=this.props.total-p}},{key:"isPrevMoreHidden",value:function(){var e=this.calcBlocks();return e.total===p||e.current===d}},{key:"isNextMoreHidden",value:function(){var e=this.calcBlocks();return e.total===p||e.current===e.total-p}},{key:"visibleRange",value:function(){var e=this.calcBlocks(),t=e.current*e.size,a=this.props.total-t,n=t+(a>e.size?e.size:a);return[t+p,n+p]}},{key:"handleFirstPage",value:function(){this.isPrevDisabled()||this.handlePageChanged(d)}},{key:"handlePreviousPage",value:function(){this.isPrevDisabled()||this.handlePageChanged(this.props.current-p)}},{key:"handleNextPage",value:function(){this.isNextDisabled()||this.handlePageChanged(this.props.current+p)}},{key:"handleLastPage",value:function(){this.isNextDisabled()||this.handlePageChanged(this.props.total-p)}},{key:"handleMorePrevPages",value:function(){var e=this.calcBlocks();this.handlePageChanged(e.current*e.size-p)}},{key:"handleMoreNextPages",value:function(){var e=this.calcBlocks();this.handlePageChanged((e.current+p)*e.size)}},{key:"handlePageChanged",value:function(e){var t=this.props.onPageChanged;t&&t(e)}},{key:"renderPages",value:function(e){var t=this;return l(e[0],e[1]).map(function(e,a){var n=e-p,r=t.handlePageChanged.bind(t,n),i=t.props.current===n;return c["default"].createElement(g,{key:a,index:a,isActive:i,className:"btn-numbered-page",onClick:r},e)})}},{key:"render",value:function(){var e=this.getTitles.bind(this),t="pagination";return this.props.className&&(t+=" "+this.props.className),c["default"].createElement("nav",null,c["default"].createElement("ul",{className:t},c["default"].createElement(g,{className:"btn-first-page",key:"btn-first-page",isDisabled:this.isPrevDisabled(),onClick:this.handleFirstPage},e("first")),c["default"].createElement(g,{className:"btn-prev-page",key:"btn-prev-page",isDisabled:this.isPrevDisabled(),onClick:this.handlePreviousPage},e("prev")),c["default"].createElement(g,{className:"btn-prev-more",key:"btn-prev-more",isHidden:this.isPrevMoreHidden(),onClick:this.handleMorePrevPages},e("prevSet")),this.renderPages(this.visibleRange()),c["default"].createElement(g,{className:"btn-next-more",key:"btn-next-more",isHidden:this.isNextMoreHidden(),onClick:this.handleMoreNextPages},e("nextSet")),c["default"].createElement(g,{className:"btn-next-page",key:"btn-next-page",isDisabled:this.isNextDisabled(),onClick:this.handleNextPage},e("next")),c["default"].createElement(g,{className:"btn-last-page",key:"btn-last-page",isDisabled:this.isNextDisabled(),onClick:this.handleLastPage},e("last"))))}}]),t}(c["default"].Component);f.propTypes={current:c["default"].PropTypes.number.isRequired,total:c["default"].PropTypes.number.isRequired,visiblePages:c["default"].PropTypes.number.isRequired,titles:c["default"].PropTypes.object,onPageChanged:c["default"].PropTypes.func},f.defaultProps={titles:h};var g=function(e){if(e.isHidden)return null;var t=e.className?e.className+" ":"",a=""+t+(e.isActive?" active":"")+(e.isDisabled?" disabled":"");return c["default"].createElement("li",{key:e.index,className:a},c["default"].createElement("a",{onClick:e.onClick},e.children))};g.propTypes={isHidden:c["default"].PropTypes.bool,isActive:c["default"].PropTypes.bool,isDisabled:c["default"].PropTypes.bool,className:c["default"].PropTypes.string,onClick:c["default"].PropTypes.func},t["default"]=f},function(t,a){t.exports=e}])});

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	function FilterAndSort(array, options) {
		var filter = options.filter,
		    exactFilters = options.exactFilters,
		    sort = options.sort,
		    sortDir = options.sortDir,
		    stickySorting = options.stickySorting,
		    fields = options.fields;


		var filterableFields = fields.filter(function (field) {
			return field.inputFilterable;
		});

		var records = !filter || filter.length === 0 ? array : array.filter(function (record) {
			// create array of filterable fields, then use Array.some to return the value, instead of having an OR for each one.
			return filterableFields.some(function (field) {
				var recordValue = record[field.name] ? record[field.name].toString() : '';
				return recordValue && recordValue.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			});
		});

		// Check exact filters
		if (exactFilters.length > 0) {
			records = records.filter(function (record) {
				return exactFilters.every(function (exactFilter) {
					if (Array.isArray(record[exactFilter.fieldname])) {
						// The field we're filtering on is an array. See if the array has our filter value in it.
						return record[exactFilter.fieldname] && record[exactFilter.fieldname].indexOf(exactFilter.value) > -1;
					} else {
						// Just compare values
						// I know it's called "ExactFilter", but we're not going to compare case. Lowercase them both.
						var recordValue = record[exactFilter.fieldname] ? record[exactFilter.fieldname].toString().toLowerCase() : '';
						var exactFilterValue = exactFilter.value.toString().toLowerCase();
						return recordValue === exactFilterValue;
					}
				});
			});
		}

		// Sort records if need be
		if (sort && sort.length > 0) {
			records = records.sort(function (a, b) {

				var recordA = a[sort];
				var recordB = b[sort];

				if (stickySorting) {

					// Special rules for sorting different data types
					// Empty things should always sort last
					if (typeof a[sort] === "string" || typeof b[sort] === "string") {
						// If desc, set it to 0 so it ends up at the end.
						// If asc, set to a bunch of zzzz so it ends up at the end.
						var emptySortCompare = !sortDir ? "0" : "zzzzzzzzzzzz";
						// For strings, set both to lowercase for comparison
						recordA = a[sort] && a[sort].length > 0 ? a[sort].toLowerCase() : emptySortCompare;
						recordB = b[sort] && b[sort].length > 0 ? b[sort].toLowerCase() : emptySortCompare;
					} else if (a[sort] && typeof a[sort].getMonth === "function" || b[sort] && typeof b[sort].getMonth === "function") {
						// For dates, we'll need different "emptySortCompare" values
						// If desc, set to some really early date, like 1/1/1000.
						// If asc, set to some really late date, like 1/1/2999.
						var _emptySortCompare = !sortDir ? new Date("1/1/1000") : new Date("1/1/2999");
						recordA = a[sort] || _emptySortCompare;
						recordB = b[sort] || _emptySortCompare;
					} else if (typeof a[sort] === "number" || typeof b[sort] === "number") {
						// If desc, set to negative infinity
						// If asc, set to positive infinity
						var _emptySortCompare2 = !sortDir ? -Infinity : Infinity;
						recordA = a[sort] !== null ? a[sort] : _emptySortCompare2;
						recordB = b[sort] !== null ? b[sort] : _emptySortCompare2;
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);
	var bind = __webpack_require__(13);
	var Axios = __webpack_require__(14);
	var defaults = __webpack_require__(15);

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  return instance;
	}

	// Create the default instance to be exported
	var axios = createInstance(defaults);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;

	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};

	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(33);
	axios.CancelToken = __webpack_require__(34);
	axios.isCancel = __webpack_require__(30);

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(35);

	module.exports = axios;

	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bind = __webpack_require__(13);

	/*global toString:true*/

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}

	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var defaults = __webpack_require__(15);
	var utils = __webpack_require__(12);
	var InterceptorManager = __webpack_require__(27);
	var dispatchRequest = __webpack_require__(28);
	var isAbsoluteURL = __webpack_require__(31);
	var combineURLs = __webpack_require__(32);

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}

	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }

	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }

	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);

	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }

	  return promise;
	};

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});

	module.exports = Axios;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(12);
	var normalizeHeaderName = __webpack_require__(17);

	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}

	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(18);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(18);
	  }
	  return adapter;
	}

	var defaults = {
	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],

	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};

	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	module.exports = defaults;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 16 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);
	var settle = __webpack_require__(19);
	var buildURL = __webpack_require__(22);
	var parseHeaders = __webpack_require__(23);
	var isURLSameOrigin = __webpack_require__(24);
	var createError = __webpack_require__(20);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(25);

	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;

	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }

	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;

	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (("production") !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }

	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }

	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }

	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }

	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };

	      settle(resolve, reject, response);

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(26);

	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;

	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }

	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }

	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        if (request.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }

	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }

	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }

	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }

	    if (requestData === undefined) {
	      requestData = null;
	    }

	    // Send the request
	    request.send(requestData);
	  });
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createError = __webpack_require__(20);

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response
	    ));
	  }
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var enhanceError = __webpack_require__(21);

	/**
	 * Create an Error with the specified message, config, error code, and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, response);
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.response = response;
	  return error;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }

	      if (!utils.isArray(val)) {
	        val = [val];
	      }

	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;

	  if (!headers) { return parsed; }

	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;

	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';

	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}

	module.exports = btoa;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));

	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }

	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }

	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }

	        if (secure === true) {
	          cookie.push('secure');
	        }

	        document.cookie = cookie.join('; ');
	      },

	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },

	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :

	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	function InterceptorManager() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	module.exports = InterceptorManager;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);
	var transformData = __webpack_require__(29);
	var isCancel = __webpack_require__(30);
	var defaults = __webpack_require__(15);

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Ensure headers exist
	  config.headers = config.headers || {};

	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );

	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  var adapter = config.adapter || defaults.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }

	    return Promise.reject(reason);
	  });
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(12);

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}

	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};

	Cancel.prototype.__CANCEL__ = true;

	module.exports = Cancel;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Cancel = __webpack_require__(33);

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }

	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });

	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }

	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};

	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};

	module.exports = CancelToken;


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";

	/*
	 * Credit to Dan (http://stackoverflow.com/users/139361)
	 * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport#answer-7557433
	 */

	function isElementInViewport(el) {

	    //special bonus for those using jQuery
	    if (typeof jQuery === "function" && el instanceof jQuery) {
	        el = el[0];
	    }

	    var rect = el.getBoundingClientRect();

	    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
	    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	    ;
	}

	module.exports = isElementInViewport;

/***/ }
/******/ ])
});
;