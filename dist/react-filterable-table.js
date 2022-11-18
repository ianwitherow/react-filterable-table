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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var FilterableTable = __webpack_require__(2);
	module.exports = FilterableTable;
	exports.FilterableTable = FilterableTable;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _Table = __webpack_require__(4);

	var _Table2 = _interopRequireDefault(_Table);

	var _Header = __webpack_require__(7);

	var _Header2 = _interopRequireDefault(_Header);

	var _reactPager = __webpack_require__(10);

	var _reactPager2 = _interopRequireDefault(_reactPager);

	var _FilterAndSort = __webpack_require__(11);

	var _FilterAndSort2 = _interopRequireDefault(_FilterAndSort);

	var _isElementInViewport = __webpack_require__(12);

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
				sortFields: [{ name: _this.props.initialSort, reverse: typeof _this.props.initialSortDir === "boolean" ? !_this.props.initialSortDir : false }],
				filter: '',
				exactFilters: _this.props.initialExactFilters || [],
				fieldFilters: _this.props.initialFieldFilters || [],
				serverError: false,
				totalPages: 1,
				visiblePages: 5,
				page: 0,
				pageSize: +localStorage.getItem(_this.props.namespace + '.PageSize') || _this.props.pageSize || 10,
				shiftDown: false
			};

			_this.tableRef = _react2.default.createRef();

			_this.loadData = _this.loadData.bind(_this);
			_this.setData = _this.setData.bind(_this);
			_this.updateFilter = _this.updateFilter.bind(_this);
			_this.addExactFilter = _this.addExactFilter.bind(_this);
			_this.updateFieldFilter = _this.updateFieldFilter.bind(_this);
			_this.updatePageSize = _this.updatePageSize.bind(_this);
			_this.updatePage = _this.updatePage.bind(_this);
			_this.filterInputChanged = _this.filterInputChanged.bind(_this);
			_this.updateSort = _this.updateSort.bind(_this);
			_this.scrollIntoView = _this.scrollIntoView.bind(_this);
			_this.removeExactFilter = _this.removeExactFilter.bind(_this);

			_this.keydownEventListener = function (e) {
				if (e.which === 16) {
					// Shift
					if (!_this.state.shiftDown) {
						_this.setState({ shiftDown: true });
					}
				}
			};
			_this.keyupEventListener = function (e) {
				if (e.which === 16) {
					// Shift
					if (_this.state.shiftDown) {
						_this.setState({ shiftDown: false });
					}
				}
			};

			return _this;
		}

		_createClass(FilterableTable, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.loadData();
				// Keep track of shift key
				window.addEventListener("keydown", this.keydownEventListener, false);
				window.addEventListener("keyup", this.keyupEventListener, false);
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				window.removeEventListener("keydown", this.keydownEventListener, false);
				window.removeEventListener("keyup", this.keyupEventListener, false);
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate(prevProps) {
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
		}, {
			key: 'shouldComponentUpdate',
			value: function shouldComponentUpdate(nextProps, nextState) {
				if (nextState.hasOwnProperty("shiftDown") && nextState.shiftDown !== this.state.shiftDown) {
					// Don't re-render when holding down shift
					return false;
				}
				return true;
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
					fetch(this.props.dataEndpoint).then(function (r) {
						if (r.status !== 200) {
							throw r;
						}
						return r;
					}).then(function (r) {
						return r.json();
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
					page: this.props.maintainPageOnSetData ? this.state.page : 0
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
				if (value === undefined || value === null || value.toString().length === 0) {
					return;
				}

				var exactFilters = this.state.exactFilters;

				// Build our object to push onto the array

				var thisFilter = {
					value: value.toString(),
					fieldname: fieldname,
					name: name

					// Don't add it if it's already in there
				};var filterExists = exactFilters.some(function (f) {
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

				// Call callback if supplied
				if (this.props.onFilterAdded) {
					this.props.onFilterAdded(thisFilter);
				}
			}

			// Adds/updates a field filter
			// fieldFilter: object { fieldname, value, exact }

		}, {
			key: 'updateFieldFilter',
			value: function updateFieldFilter(fieldFilter) {
				var fieldFilters = this.state.fieldFilters.slice();
				var existingFilterIndex = fieldFilters.findIndex(function (f) {
					return f.fieldname === fieldFilter.fieldname;
				});
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
				this.setState({ fieldFilters: fieldFilters, page: 0 });
				// Call callback if supplied
				if (this.props.onFilterAdded) {
					this.props.onFilterAdded(fieldFilter);
				}
			}
		}, {
			key: 'removeExactFilter',
			value: function removeExactFilter(filter, e) {
				var exactFilters = this.state.exactFilters;

				var index = exactFilters.indexOf(filter);
				var removedFilter = null;
				if (index > -1) {
					removedFilter = exactFilters.splice(index, 1).pop();
				}
				this.setState({
					exactFilters: exactFilters,
					page: 0
				});
				this.scrollIntoView();

				// Call callback if supplied
				if (this.props.onFilterRemoved) {
					this.props.onFilterRemoved(removedFilter, e);
				}
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
				if (this.props.namespace) {
					localStorage.setItem(this.props.namespace + '.PageSize', pageSize);
				}
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
				var append = this.state.shiftDown;
				var sortFields = this.state.sortFields.concat();
				var sortField = sortFields.find(function (sf) {
					return sf.name === sort;
				});
				var alreadyExists = sortField !== undefined;
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
					sortFields: sortFields,
					page: 0
				});
			}
		}, {
			key: 'scrollIntoView',
			value: function scrollIntoView() {
				// Make sure things are in view
				if (this.tableRef && this.tableRef.current) {
					var table = this.tableRef.current.table;
					if (table && !(0, _isElementInViewport2.default)(table)) {
						table.scrollIntoView();
					}
				}
			}
		}, {
			key: 'render',
			value: function render() {
				var fields = this.props.fields || [];

				// If fields prop was not specified, use object keys of first record as fieldnames
				if (this.props.fields === undefined && this.state.entries.length > 0) {
					fields = Object.keys(this.state.entries[0]).map(function (name) {
						return { name: name };
					});
				}

				var loading = this.state.loading && (this.props.loadingMessage || _react2.default.createElement(
					'div',
					{ className: 'well text-center' },
					'Loading...'
				));

				var serverErrorMessage = this.state.serverError && (this.props.serverErrorMessage || _react2.default.createElement(
					'div',
					{ className: 'alert alert-danger text-center' },
					'Something went wrong! Check console for error message(s).'
				));

				var noRecordsMessage = !this.state.serverError && !this.state.loading && this.state.entries.length === 0 && _react2.default.createElement(
					'div',
					null,
					this.props.noRecordsMessage
				);

				var filteredEntries = (0, _FilterAndSort2.default)(this.state.entries, {
					filter: this.state.filter,
					exactFilters: this.state.exactFilters,
					fieldFilters: this.state.fieldFilters,
					sortFields: this.state.sortFields,
					fields: fields
				});

				var table = !this.state.loading && this.state.entries.length > 0 && _react2.default.createElement(_Table2.default, {
					records: filteredEntries,
					allRecords: this.state.entries,
					fields: fields,
					filterExact: this.state.filterExact,
					addExactFilter: this.addExactFilter,
					updateFieldFilter: this.updateFieldFilter,
					fieldFilters: this.state.fieldFilters,
					updateSort: this.updateSort,
					sortFields: this.state.sortFields,
					iconSort: this.props.iconSort,
					iconSortedAsc: this.props.iconSortedAsc,
					iconSortedDesc: this.props.iconSortedDesc,
					page: this.state.page,
					pageSize: this.state.pageSize,
					pagersVisible: this.props.pagersVisible,
					noFilteredRecordsMessage: this.props.noFilteredRecordsMessage,
					className: this.props.tableClassName,
					tableProps: this.props.tableProps,
					trClassName: this.props.trClassName,
					style: this.props.style,
					showHeaderFilters: this.props.showHeaderFilters,
					onRowClicked: this.props.onRowClicked,
					ref: this.tableRef
				});

				var totalPages = filteredEntries && filteredEntries.length > 0 ? Math.ceil(filteredEntries.length / this.state.pageSize) : 0;

				var topPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false || this.props.topPagerVisible === false ? '' : _react2.default.createElement(_reactPager2.default, { total: totalPages,
					current: this.state.page,
					visiblePages: this.state.visiblePages,
					onPageChanged: this.updatePage,
					className: this.props.pagerTopClassName || "pagination-sm pull-right",
					titles: this.props.pagerTitles
				});

				var bottomPager = this.state.loading || this.state.entries.length === 0 || this.props.pagersVisible === false || this.props.bottomPagerVisible === false ? '' : _react2.default.createElement(_reactPager2.default, { total: totalPages,
					current: this.state.page,
					visiblePages: this.state.visiblePages,
					onPageChanged: this.updatePage,
					className: this.props.pagerBottomClassName,
					titles: this.props.pagerTitles
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
						filterInputVisible: this.props.filterInputVisible,
						pagersVisible: this.props.pagersVisible,
						pageSizes: this.props.pageSizes,
						autofocusFilter: this.props.autofocusFilter
					}),
					_react2.default.createElement(
						'div',
						{ className: 'table-container' },
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
					tableClassName: "table table-condensed table-hover filterable-table",
					pageSizes: [10, 20, 30, 50]
				};
			}
		}]);

		return FilterableTable;
	}(_react2.default.Component);

	module.exports = FilterableTable;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var hasValue = __webpack_require__(5);
	var getValue = __webpack_require__(6);

	var Table = function (_React$Component) {
		_inherits(Table, _React$Component);

		function Table() {
			_classCallCheck(this, Table);

			return _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
		}

		_createClass(Table, [{
			key: 'headerSortElement',
			value: function headerSortElement(field) {
				// Return the prop element for the sort icon (if provided)
				if (field.sortable) {
					var sortField = this.props.sortFields.find(function (sf) {
						return sf.name === field.name || sf.name === field.sortFieldName && field.sortFieldName != null;
					});
					if (sortField) {
						if (!sortField.reverse) {
							return this.props.iconSortedAsc || _react2.default.createElement('span', { className: 'fa fa-sort-asc' });
						} else {
							return this.props.iconSortedDesc || _react2.default.createElement('span', { className: 'fa fa-sort-desc' });
						}
					}
					return this.props.iconSort || _react2.default.createElement('span', { className: 'fa fa-sort' });
				}
				return null;
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    addExactFilter = _props.addExactFilter,
				    updateSort = _props.updateSort,
				    page = _props.page,
				    pageSize = _props.pageSize,
				    visible = _props.visible,
				    onRowClicked = _props.onRowClicked;

				// Paging - determine indexes for where to slice the array

				var startIndex = page * pageSize;
				var endIndex = startIndex + pageSize;

				// Slice array based on what should be shown on the current page
				// if pagersVisible is false, don't slice it - all records should be shown
				var records = this.props.records;
				if (this.props.pagersVisible !== false) {
					records = records.slice(startIndex, endIndex);
				}

				// If the field has the visible property set to false, ignore it
				var fields = this.props.fields.filter(function (field) {
					return field.visible !== false;
				});

				var headerRow = _react2.default.createElement(
					'tr',
					null,
					fields.map(function (field, i) {
						// Use the displayName property if supplied, otherwise use name
						var fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
						var renderProps = _extends({ field: field }, _this2.props);
						if (typeof field.thRender === "function") {
							fieldDisplayName = field.thRender(renderProps);
						}

						return _react2.default.createElement(
							'th',
							{ onClick: field.sortable ? function () {
									return updateSort(field.sortFieldName || field.name);
								} : null, className: field.thClassName ? field.thClassName : null, key: i, title: field.title || null },
							_react2.default.createElement(
								'span',
								{ className: field.sortable ? "sortable" : null },
								fieldDisplayName
							),
							_this2.headerSortElement(field)
						);
					})
				);

				// Add filter textboxes above the table headers if the `showHeaderFilters` prop was set
				var headerFilterRow = this.props.showHeaderFilters && _react2.default.createElement(
					'tr',
					null,
					fields.map(function (field, i) {
						var fieldFilter = _this2.props.fieldFilters.find(function (f) {
							return f.fieldname === field.name;
						});
						return _react2.default.createElement(
							'th',
							{ key: 'fieldFilter_' + i, className: 'headerFilter' },
							field.inputFilterable && _react2.default.createElement(
								'span',
								{ className: 'filter-container' },
								_react2.default.createElement('input', {
									className: 'form-control form-control-sm filter-input ' + (fieldFilter && fieldFilter.value.length ? "has-value" : ""),
									placeholder: 'Filter',
									value: fieldFilter ? fieldFilter.value : "",
									onChange: function onChange(e) {
										return _this2.props.updateFieldFilter({ fieldname: field.name, value: e.target.value, exact: field.fieldFilterExact || false });
									}
								}),
								_react2.default.createElement(
									'span',
									{ className: 'close clear-filter', onClick: function onClick(e) {
											_this2.props.updateFieldFilter({ fieldname: field.name, value: "" });
											// Focus the text box
											e.target.parentElement.firstElementChild.focus();
										} },
									'\xD7'
								)
							)
						);
					})
				);

				var rows = records.map(function (record, i) {
					var trClassName = _this2.props.trClassName || null;
					if (typeof _this2.props.trClassName === "function") {
						trClassName = _this2.props.trClassName(record, i);
					}

					var tableTds = fields.map(function (field, q) {
						// Use the displayName property if supplied, otherwise use name
						var fieldDisplayName = field.displayName !== undefined ? field.displayName : field.name;
						var spanClassName = "";
						var tdClassName = field.tdClassName || null;

						// Build out the body of the <td>
						var recordBody = getValue(record, field.name);

						// If this field has a render function, call it with some props
						var renderProps = _extends({
							value: recordBody,
							record: record,
							recordIndex: i,
							records: _this2.props.allRecords,
							filteredRecords: records,
							field: field
						}, _this2.props);

						if (field.render && typeof field.render === "function") {
							recordBody = field.render(renderProps);
						}

						// If tdClassName is a function, call it with our renderProps
						if (typeof field.tdClassName === "function") {
							tdClassName = field.tdClassName(renderProps);
						}

						// Determine if the body is empty
						var bodyIsEmpty = recordBody === null || recordBody === undefined || recordBody.toString().length === 0;

						// If the body is empty and the field has something set for emptyDisplay, use that as the text.
						if (field.emptyDisplay && bodyIsEmpty) {
							recordBody = field.emptyDisplay;
						}

						// add the "empty" classname if record is empty
						if (bodyIsEmpty) {
							spanClassName = "empty";
						}

						if (!bodyIsEmpty && field.exactFilterable) {
							spanClassName = "filterable";
						}

						var tdContent = hasValue(recordBody) ? _react2.default.createElement(
							'span',
							{ className: spanClassName, onClick: field.exactFilterable ? function () {
									return addExactFilter(getValue(record, field.name), field.name, fieldDisplayName);
								} : null },
							recordBody
						) : null;

						return _react2.default.createElement(
							'td',
							{ className: tdClassName, key: q },
							tdContent
						);
					});

					var rowClicked = onRowClicked ? function () {
						return onRowClicked({ record: record, index: i });
					} : null;
					return _react2.default.createElement(
						'tr',
						{ key: i, className: trClassName, onClick: rowClicked },
						tableTds
					);
				});

				var tfoot = fields.some(function (f) {
					return f.footerValue;
				}) ? _react2.default.createElement(
					'tfoot',
					null,
					_react2.default.createElement(
						'tr',
						{ className: this.props.footerTrClassName },
						fields.map(function (field, i) {
							var renderProps = _extends({
								records: _this2.props.allRecords,
								filteredRecords: _this2.props.records,
								field: field
							}, _this2.props);

							return _react2.default.createElement(
								'td',
								{ key: i, className: field.footerTdClassName },
								(typeof field.footerValue === "function" ? field.footerValue(renderProps) : field.footerValue) || ''
							);
						})
					)
				) : null;

				var tableClassName = this.props.className;
				if (tableClassName.indexOf('filterable-table') === -1) {
					// Make sure class 'filterable-table' is included
					tableClassName += " filterable-table";
				}

				var tableProps = this.props.tableProps ? this.props.tableProps : {};

				return rows.length === 0 && this.props.fieldFilters.length === 0 ? _react2.default.createElement(
					'div',
					null,
					this.props.noFilteredRecordsMessage || 'There are no records to display.'
				) : _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'table',
						_extends({ className: tableClassName, style: this.props.style }, tableProps),
						_react2.default.createElement(
							'thead',
							null,
							headerFilterRow,
							headerRow
						),
						_react2.default.createElement(
							'tbody',
							null,
							rows
						),
						tfoot
					)
				);
			}
		}]);

		return Table;
	}(_react2.default.Component);

	module.exports = Table;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";

	// Return true if it's not null or undefined, and length is > 0
	module.exports = function (val) {
		return val !== null && val !== undefined && val.toString().length > 0;
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	// If field has a dot in it, traverse object with dot notation to get the property value
	// Otherwise just return the property of the record
	module.exports = function getValue(record, field) {
		if (field.indexOf(".") > 0) {
			return field.split('.').reduce(function (o, i) {
				return o ? o[i] : null;
			}, record);
		}
		return record[field];
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _ExactFilters = __webpack_require__(8);

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

			_this.filterRef = _react2.default.createRef();
			return _this;
		}

		_createClass(Header, [{
			key: 'filterChanged',
			value: function filterChanged(event) {
				var newValue = event ? event.target.value : '';
				if (newValue.length === 0) {
					// When clearing filter, set focus in the text box
					this.filterRef.current.focus();
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
				    updatePageSize = _props.updatePageSize,
				    pageSizes = _props.pageSizes;

				// Record count message -- the text at the top that says something like "4 records"
				// text can be overridden using the recordCountName and recordCountNamePlural props.

				var recordCountMessage = _react2.default.createElement(
					'span',
					null,
					recordCount.toLocaleString(),
					' ',
					recordCount === 1 ? this.props.recordCountName : this.props.recordCountNamePlural
				);

				var filterInput = this.props.filterInputVisible !== false && _react2.default.createElement(
					'span',
					{ className: 'filter-container' },
					_react2.default.createElement('input', { type: 'text', className: 'form-control filter-input', value: filter, onChange: this.filterChanged, ref: this.filterRef, placeholder: 'Filter', autoFocus: this.props.autofocusFilter }),
					_react2.default.createElement(
						'span',
						{ className: 'close clear-filter', onClick: function onClick() {
								return _this2.filterChanged('');
							} },
						'\xD7'
					)
				);

				var perPageSelect = this.props.pagersVisible !== false && this.props.pageSizes && this.props.pageSizes.length > 0 && _react2.default.createElement(
					'select',
					{ className: 'form-control pull-sm-right pull-md-right pull-lg-right', onChange: updatePageSize, value: this.props.pageSize },
					this.props.pageSizes.map(function (p, i) {
						return _react2.default.createElement(
							'option',
							{ value: p, key: i },
							p,
							' per page'
						);
					})
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
							filterInput
						),
						_react2.default.createElement(
							'div',
							{ className: 'col-sm-5 col-sm-push-4' },
							perPageSelect
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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ExactFilter = __webpack_require__(9);

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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
							{ className: "filter-item-remove", onClick: function onClick(e) {
									return removeFilter(filter, e);
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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(3)):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports.Pager=t(require("react")):e.Pager=t(e.react)}(this,function(e){return function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=5)}([function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function a(e){if(c===setTimeout)return setTimeout(e,0);if((c===n||!c)&&setTimeout)return c=setTimeout,setTimeout(e,0);try{return c(e,0)}catch(t){try{return c.call(null,e,0)}catch(t){return c.call(this,e,0)}}}function i(e){if(f===clearTimeout)return clearTimeout(e);if((f===r||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(e);try{return f(e)}catch(t){try{return f.call(null,e)}catch(t){return f.call(this,e)}}}function o(){y&&d&&(y=!1,d.length?h=d.concat(h):v=-1,h.length&&u())}function u(){if(!y){var e=a(o);y=!0;for(var t=h.length;t;){for(d=h,h=[];++v<t;)d&&d[v].run();v=-1,t=h.length}d=null,y=!1,i(e)}}function s(e,t){this.fun=e,this.array=t}function l(){}var c,f,p=e.exports={};!function(){try{c="function"==typeof setTimeout?setTimeout:n}catch(e){c=n}try{f="function"==typeof clearTimeout?clearTimeout:r}catch(e){f=r}}();var d,h=[],y=!1,v=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new s(e,t)),1!==h.length||y||a(u)},s.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=l,p.addListener=l,p.once=l,p.off=l,p.removeListener=l,p.removeAllListeners=l,p.emit=l,p.prependListener=l,p.prependOnceListener=l,p.listeners=function(e){return[]},p.binding=function(e){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(e){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(e,t,n){"use strict";function r(e){return function(){return e}}var a=function(){};a.thatReturns=r,a.thatReturnsFalse=r(!1),a.thatReturnsTrue=r(!0),a.thatReturnsNull=r(null),a.thatReturnsThis=function(){return this},a.thatReturnsArgument=function(e){return e},e.exports=a},function(e,t,n){"use strict";(function(t){function n(e,t,n,a,i,o,u,s){if(r(t),!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,a,i,o,u,s],f=0;l=new Error(t.replace(/%s/g,function(){return c[f++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}}var r=function(e){};"production"!==t.env.NODE_ENV&&(r=function(e){if(void 0===e)throw new Error("invariant requires an error message argument")}),e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";(function(t){var r=n(1),a=r;"production"!==t.env.NODE_ENV&&function(){var e=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];var a=0,i="Warning: "+e.replace(/%s/g,function(){return n[a++]});"undefined"!=typeof console&&console.error(i);try{throw new Error(i)}catch(e){}};a=function(t,n){if(void 0===n)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(0!==n.indexOf("Failed Composite propType: ")&&!t){for(var r=arguments.length,a=Array(r>2?r-2:0),i=2;i<r;i++)a[i-2]=arguments[i];e.apply(void 0,[n].concat(a))}}}(),e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e,t){for(var n=[],r=e;r<t;r++)n.push(r);return n}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(6),c=r(l),f=n(7),p=r(f),d={first:"First",prev:"«",prevSet:"...",nextSet:"...",next:"»",last:"Last"},h=function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleFirstPage=n.handleFirstPage.bind(n),n.handlePreviousPage=n.handlePreviousPage.bind(n),n.handleNextPage=n.handleNextPage.bind(n),n.handleLastPage=n.handleLastPage.bind(n),n.handleMorePrevPages=n.handleMorePrevPages.bind(n),n.handleMoreNextPages=n.handleMoreNextPages.bind(n),n.handlePageChanged=n.handlePageChanged.bind(n),n}return o(t,e),s(t,[{key:"getTitles",value:function(e){return this.props.titles[e]||d[e]}},{key:"calcBlocks",value:function(){var e=this.props,t=e.total,n=e.visiblePages,r=e.current+1;return{total:Math.ceil(t/n),current:Math.ceil(r/n)-1,size:n}}},{key:"isPrevDisabled",value:function(){return this.props.current<=0}},{key:"isNextDisabled",value:function(){return this.props.current>=this.props.total-1}},{key:"isPrevMoreHidden",value:function(){var e=this.calcBlocks();return 1===e.total||0===e.current}},{key:"isNextMoreHidden",value:function(){var e=this.calcBlocks();return 1===e.total||e.current===e.total-1}},{key:"visibleRange",value:function(){var e=this.calcBlocks(),t=e.current*e.size,n=this.props.total-t;return[t+1,t+(n>e.size?e.size:n)+1]}},{key:"handleFirstPage",value:function(){this.isPrevDisabled()||this.handlePageChanged(0)}},{key:"handlePreviousPage",value:function(){this.isPrevDisabled()||this.handlePageChanged(this.props.current-1)}},{key:"handleNextPage",value:function(){this.isNextDisabled()||this.handlePageChanged(this.props.current+1)}},{key:"handleLastPage",value:function(){this.isNextDisabled()||this.handlePageChanged(this.props.total-1)}},{key:"handleMorePrevPages",value:function(){var e=this.calcBlocks();this.handlePageChanged(e.current*e.size-1)}},{key:"handleMoreNextPages",value:function(){var e=this.calcBlocks();this.handlePageChanged((e.current+1)*e.size)}},{key:"handlePageChanged",value:function(e){var t=this.props.onPageChanged;t&&t(e)}},{key:"renderPages",value:function(e){var t=this;return u(e[0],e[1]).map(function(e,n){var r=e-1,a=t.handlePageChanged.bind(t,r),i=t.props.current===r;return c.default.createElement(y,{key:n,index:n,isActive:i,className:"btn-numbered-page",onClick:a},e)})}},{key:"render",value:function(){var e=this.getTitles.bind(this),t="pagination";return this.props.className&&(t+=" "+this.props.className),c.default.createElement("nav",null,c.default.createElement("ul",{className:t},c.default.createElement(y,{className:"btn-first-page",key:"btn-first-page",isDisabled:this.isPrevDisabled(),onClick:this.handleFirstPage},e("first")),c.default.createElement(y,{className:"btn-prev-page",key:"btn-prev-page",isDisabled:this.isPrevDisabled(),onClick:this.handlePreviousPage},e("prev")),c.default.createElement(y,{className:"btn-prev-more",key:"btn-prev-more",isHidden:this.isPrevMoreHidden(),onClick:this.handleMorePrevPages},e("prevSet")),this.renderPages(this.visibleRange()),c.default.createElement(y,{className:"btn-next-more",key:"btn-next-more",isHidden:this.isNextMoreHidden(),onClick:this.handleMoreNextPages},e("nextSet")),c.default.createElement(y,{className:"btn-next-page",key:"btn-next-page",isDisabled:this.isNextDisabled(),onClick:this.handleNextPage},e("next")),c.default.createElement(y,{className:"btn-last-page",key:"btn-last-page",isDisabled:this.isNextDisabled(),onClick:this.handleLastPage},e("last"))))}}]),t}(c.default.Component);h.propTypes={current:p.default.number.isRequired,total:p.default.number.isRequired,visiblePages:p.default.number.isRequired,titles:p.default.object,onPageChanged:p.default.func},h.defaultProps={titles:d};var y=function(e){if(e.isHidden)return null;var t=e.className?e.className+" ":"",n=t+(e.isActive?" active":"")+(e.isDisabled?" disabled":"");return c.default.createElement("li",{key:e.index,className:n},c.default.createElement("a",{onClick:e.onClick},e.children))};y.propTypes={isHidden:p.default.bool,isActive:p.default.bool,isDisabled:p.default.bool,className:p.default.string,onClick:p.default.func},t.default=h},function(t,n){t.exports=e},function(e,t,n){(function(t){if("production"!==t.env.NODE_ENV){var r="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,a=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===r};e.exports=n(8)(a,!0)}else e.exports=n(10)()}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var r=n(1),a=n(2),i=n(4),o=n(3),u=n(9);e.exports=function(e,n){function s(e){var t=e&&(w&&e[w]||e[T]);if("function"==typeof t)return t}function l(e,t){return e===t?0!==e||1/e==1/t:e!==e&&t!==t}function c(e){this.message=e,this.stack=""}function f(e){function r(r,l,f,p,d,h,y){if(p=p||O,h=h||f,y!==o)if(n)a(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");else if("production"!==t.env.NODE_ENV&&"undefined"!=typeof console){var v=p+":"+f;!u[v]&&s<3&&(i(!1,"You are manually calling a React.PropTypes validation function for the `%s` prop on `%s`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.",h,p),u[v]=!0,s++)}return null==l[f]?r?new c(null===l[f]?"The "+d+" `"+h+"` is marked as required in `"+p+"`, but its value is `null`.":"The "+d+" `"+h+"` is marked as required in `"+p+"`, but its value is `undefined`."):null:e(l,f,p,d,h)}if("production"!==t.env.NODE_ENV)var u={},s=0;var l=r.bind(null,!1);return l.isRequired=r.bind(null,!0),l}function p(e){function t(t,n,r,a,i,o){var u=t[n];if(x(u)!==e)return new c("Invalid "+a+" `"+i+"` of type `"+k(u)+"` supplied to `"+r+"`, expected `"+e+"`.");return null}return f(t)}function d(e){function t(t,n,r,a,i){if("function"!=typeof e)return new c("Property `"+i+"` of component `"+r+"` has invalid PropType notation inside arrayOf.");var u=t[n];if(!Array.isArray(u)){return new c("Invalid "+a+" `"+i+"` of type `"+x(u)+"` supplied to `"+r+"`, expected an array.")}for(var s=0;s<u.length;s++){var l=e(u,s,r,a,i+"["+s+"]",o);if(l instanceof Error)return l}return null}return f(t)}function h(e){function t(t,n,r,a,i){if(!(t[n]instanceof e)){var o=e.name||O;return new c("Invalid "+a+" `"+i+"` of type `"+N(t[n])+"` supplied to `"+r+"`, expected instance of `"+o+"`.")}return null}return f(t)}function y(e){function n(t,n,r,a,i){for(var o=t[n],u=0;u<e.length;u++)if(l(o,e[u]))return null;return new c("Invalid "+a+" `"+i+"` of value `"+o+"` supplied to `"+r+"`, expected one of "+JSON.stringify(e)+".")}return Array.isArray(e)?f(n):("production"!==t.env.NODE_ENV&&i(!1,"Invalid argument supplied to oneOf, expected an instance of array."),r.thatReturnsNull)}function v(e){function t(t,n,r,a,i){if("function"!=typeof e)return new c("Property `"+i+"` of component `"+r+"` has invalid PropType notation inside objectOf.");var u=t[n],s=x(u);if("object"!==s)return new c("Invalid "+a+" `"+i+"` of type `"+s+"` supplied to `"+r+"`, expected an object.");for(var l in u)if(u.hasOwnProperty(l)){var f=e(u,l,r,a,i+"."+l,o);if(f instanceof Error)return f}return null}return f(t)}function g(e){function n(t,n,r,a,i){for(var u=0;u<e.length;u++){if(null==(0,e[u])(t,n,r,a,i,o))return null}return new c("Invalid "+a+" `"+i+"` supplied to `"+r+"`.")}if(!Array.isArray(e))return"production"!==t.env.NODE_ENV&&i(!1,"Invalid argument supplied to oneOfType, expected an instance of array."),r.thatReturnsNull;for(var a=0;a<e.length;a++){var u=e[a];if("function"!=typeof u)return i(!1,"Invalid argument supplid to oneOfType. Expected an array of check functions, but received %s at index %s.",E(u),a),r.thatReturnsNull}return f(n)}function b(e){function t(t,n,r,a,i){var u=t[n],s=x(u);if("object"!==s)return new c("Invalid "+a+" `"+i+"` of type `"+s+"` supplied to `"+r+"`, expected `object`.");for(var l in e){var f=e[l];if(f){var p=f(u,l,r,a,i+"."+l,o);if(p)return p}}return null}return f(t)}function m(t){switch(typeof t){case"number":case"string":case"undefined":return!0;case"boolean":return!t;case"object":if(Array.isArray(t))return t.every(m);if(null===t||e(t))return!0;var n=s(t);if(!n)return!1;var r,a=n.call(t);if(n!==t.entries){for(;!(r=a.next()).done;)if(!m(r.value))return!1}else for(;!(r=a.next()).done;){var i=r.value;if(i&&!m(i[1]))return!1}return!0;default:return!1}}function P(e,t){return"symbol"===e||("Symbol"===t["@@toStringTag"]||"function"==typeof Symbol&&t instanceof Symbol)}function x(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":P(t,e)?"symbol":t}function k(e){if(void 0===e||null===e)return""+e;var t=x(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}function E(e){var t=k(e);switch(t){case"array":case"object":return"an "+t;case"boolean":case"date":case"regexp":return"a "+t;default:return t}}function N(e){return e.constructor&&e.constructor.name?e.constructor.name:O}var w="function"==typeof Symbol&&Symbol.iterator,T="@@iterator",O="<<anonymous>>",_={array:p("array"),bool:p("boolean"),func:p("function"),number:p("number"),object:p("object"),string:p("string"),symbol:p("symbol"),any:function(){return f(r.thatReturnsNull)}(),arrayOf:d,element:function(){function t(t,n,r,a,i){var o=t[n];if(!e(o)){return new c("Invalid "+a+" `"+i+"` of type `"+x(o)+"` supplied to `"+r+"`, expected a single ReactElement.")}return null}return f(t)}(),instanceOf:h,node:function(){function e(e,t,n,r,a){return m(e[t])?null:new c("Invalid "+r+" `"+a+"` supplied to `"+n+"`, expected a ReactNode.")}return f(e)}(),objectOf:v,oneOf:y,oneOfType:g,shape:b};return c.prototype=Error.prototype,_.checkPropTypes=u,_.PropTypes=_,_}}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function r(e,n,r,s,l){if("production"!==t.env.NODE_ENV)for(var c in e)if(e.hasOwnProperty(c)){var f;try{a("function"==typeof e[c],"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",s||"React class",r,c),f=e[c](n,c,s,r,null,o)}catch(e){f=e}if(i(!f||f instanceof Error,"%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",s||"React class",r,c,typeof f),f instanceof Error&&!(f.message in u)){u[f.message]=!0;var p=l?l():"";i(!1,"Failed %s type: %s%s",r,f.message,null!=p?p:"")}}}if("production"!==t.env.NODE_ENV)var a=n(2),i=n(4),o=n(3),u={};e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";var r=n(1),a=n(2),i=n(3);e.exports=function(){function e(e,t,n,r,o,u){u!==i&&a(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t};return n.checkPropTypes=r,n.PropTypes=n,n}}])});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _hasValue = __webpack_require__(5);

	var _hasValue2 = _interopRequireDefault(_hasValue);

	var _getValue = __webpack_require__(6);

	var _getValue2 = _interopRequireDefault(_getValue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function FilterAndSort(array, options) {
		array = array || [];
		var filter = options.filter,
		    exactFilters = options.exactFilters,
		    fieldFilters = options.fieldFilters,
		    sortFields = options.sortFields,
		    fields = options.fields;

		if (!fields || !fields.length) return [];

		var filterableFields = fields.filter(function (field) {
			return field.inputFilterable;
		});

		var records = !(0, _hasValue2.default)(filter) ? array : array.filter(function (record) {
			// create array of filterable fields, then use Array.some to return the value, instead of having an OR for each one.
			return filterableFields.some(function (field) {
				var recordValue = (0, _hasValue2.default)((0, _getValue2.default)(record, field.name)) ? (0, _getValue2.default)(record, field.name).toString() : '';
				return (0, _hasValue2.default)(recordValue) && recordValue.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			});
		});

		// Check exact filters
		if (exactFilters.length > 0) {
			records = records.filter(function (record) {
				return exactFilters.every(function (exactFilter) {
					var recordValue = (0, _getValue2.default)(record, exactFilter.fieldname);
					if (Array.isArray(recordValue)) {
						// The field we're filtering on is an array. See if the array has our filter value in it.
						return (0, _hasValue2.default)(recordValue) && recordValue.indexOf(exactFilter.value) > -1;
					} else {
						// Just compare values
						// I know it's called "ExactFilter", but we're not going to compare case. Lowercase them both.
						var compareValue = (0, _hasValue2.default)(recordValue) ? recordValue.toString().toLowerCase() : '';
						var exactFilterValue = exactFilter.value.toString().toLowerCase();
						return compareValue === exactFilterValue;
					}
				});
			});
		}

		// Check field filters
		if (fieldFilters.length > 0) {
			records = records.filter(function (record) {
				return fieldFilters.every(function (fieldFilter) {
					var exact = fieldFilter.exact || fields.find(function (f) {
						return f.name === fieldFilter.fieldname;
					}).fieldFilterExact || false;

					var recordValue = (0, _getValue2.default)(record, fieldFilter.fieldname);
					if (Array.isArray(recordValue)) {
						// The field we're filtering on is an array. See if the array has our filter value in it.
						return (0, _hasValue2.default)(recordValue) && recordValue.some(function (val) {
							return val && exact ? val.toLowerCase() === fieldFilter.value.toLowerCase() : val.toLowerCase().includes(fieldFilter.value);
						});
					} else {
						// See if the value is contained in the record
						// Compare against trimmed lowercase strings
						var thisRecordValue = (0, _hasValue2.default)(recordValue) ? recordValue.toString().toLowerCase().trim() : "";
						var thisFilterValue = (0, _hasValue2.default)(fieldFilter.value) ? fieldFilter.value.toString().toLowerCase().trim() : "";
						return (0, _hasValue2.default)(thisRecordValue) && (exact ? thisRecordValue === thisFilterValue : thisRecordValue.includes(thisFilterValue));
					}
				});
			});
		}

		// Sort records if need be
		if (sortFields.length > 0) {
			var sortKeys = {};
			sortFields.forEach(function (field) {
				sortKeys[field.name] = field.reverse ? "desc" : "asc";
			});
			records = MultiSort([].concat(_toConsumableArray(records)), sortKeys);
		}
		return records;
	}

	// Adapted from: https://stackoverflow.com/questions/2784230/how-do-you-sort-an-array-on-multiple-columns#answer-15668310
	function MultiSort(array, keys) {

		keys = keys || {};

		// via
		// https://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
		var obLen = function obLen(obj) {
			var size = 0,
			    key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};

		var obIx = function obIx(obj, ix) {
			return Object.keys(obj)[ix];
		};

		var keySort = function keySort(a, b, d) {
			d = d !== null ? d : 1;

			a = (0, _hasValue2.default)(a) ? a : null;
			b = (0, _hasValue2.default)(b) ? b : null;

			// force any string values to lowercase
			a = typeof a === 'string' ? a.toLowerCase() : a;
			b = typeof b === 'string' ? b.toLowerCase() : b;

			if (a === null) {
				return 1;
			}
			if (b === null) {
				return -1;
			}
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

		if (!KL) return array.sort(keySort);

		for (var k in keys) {
			// asc unless desc or skip
			keys[k] = keys[k] == 'desc' || keys[k] == -1 ? -1 : keys[k] == 'skip' || keys[k] === 0 ? 0 : 1;
		}

		array.sort(function (a, b) {
			var sorted = 0,
			    ix = 0;

			while (sorted === 0 && ix < KL) {
				var k = obIx(keys, ix);
				if (k) {
					var dir = keys[k];
					sorted = keySort((0, _getValue2.default)(a, k), (0, _getValue2.default)(b, k), dir);
					ix++;
				}
			}
			return sorted;
		});
		return array;
	};

	module.exports = FilterAndSort;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";

	/*
	 * Credit to Dan (http://stackoverflow.com/users/139361)
	 * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport#answer-7557433
	 */

	function isElementInViewport(el) {
		if (el === undefined || el === null) {
			return false;
		}

		//special bonus for those using jQuery
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		var rect = el.getBoundingClientRect();

		return rect.top >= 0;
	}

	module.exports = isElementInViewport;

/***/ })
/******/ ])
});
;