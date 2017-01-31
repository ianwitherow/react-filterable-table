# react-filterable-table
Extendable table with filtering, sorting, paging, and more.

[Working example](https://ianwitherow.github.io/react-filterable-table/example/index.html)

Basic usage:

```
let data = [
	{ name: "Steve", age: 27, job: "Sandwich Eater" },
	{ name: "Gary", age: 35, job: "Falafeler" },
	{ name: "Greg", age: 24, job: "Jelly Bean Juggler" },
	{ name: "Jeb", age: 39, job: "Burrito Racer" },
	{ name: "Jeff", age: 48, job: "Hot Dog Wrangler" }
];

let fields = [
	{ name: 'name', displayName: "Name", inputFilterable: true, sortable: true },
	{ name: 'age', displayName: "Age", inputFilterable: true, exactFilterable: true, sortable: true },
	{ name: 'job', displayName: "Occupation", inputFilterable: true, exactFilterable: true, sortable: true }
];

<FilterableTable
	namespace="People"
	initialSort="name"
	data={data}
	fields={fields}
	noRecordsMessage="There are no people to display"
	noFilteredRecordsMessage="No people match your filters!"
	fields={this.fields}
/>

```

## Props

* `namespace` - `string` - The app saves settings (currently only page size) to localStorage. Namespace prevents overriding settings from other pages/apps where this is used.
* `className` - `string` - Class name to apply to the component's root &lt;div&gt; element.
* `tableClassName` - `string` - Class name to apply to the component's &lt;table&gt; element.
* `initialSort` - `string` - The field name on which to sort on initially.
* `initialSortDir` - `bool` - The sort direction to use initially - true is ascending, false is descending.
* `data` - `array` - Static data to bind to.
* `dataEndpoint` - `string` - If not using a static dataset, this can be used to fetch data with AJAX.
* `onDataReceived` - `fn` - This is called (passing the array of data) before the data is rendered. Any necessary data transformations (date parsing, etc) can be done here.
* `fields` - `array` - Array of `field`s used for building the table. These fields have their own list of props detailed below.
* `noRecordsMessage` - `string` - Message to show when there are no records.
* `noFilteredRecordsMessage` - `string` - Message to show when the user has applied filters which result in no records to show.
* `recordCountName` - `string` - Verbage to use at the top where it says "X results". For example, "1 giraffe"
* `recordCountNamePlural` - `string` - Verbage to use when there are more than 1 results (or 0). For example, "3 giraffes"
* `headerVisible` - `bool` - Whether or not to show the header
* `pagersVisible` - `bool` - Whether or not to show the pagers


## `field` Props

* `name` - `string` - Name of the property on the `data` object
* `displayName` - `string` - Field name as it will appear in the table header. If ommitted, `name` is used.
* `inputFilterable` - `bool` - Whether or not this field should be filtered when the user types in the Filter text box at the top.
* `exactFilterable` - `bool` - Whether or not the user can click the field's value to filter on it exactly.
* `sortable` - `bool` - Whether or not the user can sort on this field.
* `visible` - `bool` - Whether or not the field is visible.
* `thClassName` - `string` - Class name of the &lt;th&gt; element.
* `tdClassName` - `string` - Class name of the &lt;td&gt; element.
* `emptyDisplay` - `string` - Text to show when the field is empty, for example "---" or "Not Set".
* `render` - `fn` - Function called to render the field. Function is passed a `props` object which contains: `props.value` - the value of the field from the `data` object, and `props.field` - this field object (will add an example of this).


## Example using a `render` function

```
let renderAge = (props) => {
	/*
	 * This props object looks like this:
	 * {
	 *   value:  (value of the field in the data. In this case, it's the person's age.),
	 *   record: (the data record for the whole row, in this case it'd be: { name: "Steve", age: 27, job: "Sandwich Eater" }),
	 *   field:  (the same field object that this render function was passed into. We'll have access to any props on it, including that 'someRandomProp' one we put on there. Those can be functions, too, so we can add custom onClick handlers to our return value.)
	 * }
	 */

	// If they are over 60, use the "blind" icon, otherwise use a motorcycle
	let iconClassName = "fa fa-" + (props.value > 60 ? "fa-blind" : "fa-motorcycle");
	let personName = props.record.name;

	return (
		<span title={personName + "'s Age"}>
			{props.value} <span className={iconClassName}></span>
		</span>
	);
};


let data = [
	...
	{ name: "Steve", age: 27, job: "Sandwich Eater" },
	...
];

let fields = [
	...
	{ name: 'age', displayName: "Age", inputFilterable: true, exactFilterable: true, sortable: true, someRandomProp: "Tacos!", render: renderAge },
	...
]
```
