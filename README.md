# react-filterable-table
Extendable table with filtering, sorting, paging, and more.

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
