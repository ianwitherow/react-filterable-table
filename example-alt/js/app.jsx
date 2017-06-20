const ReactDOM = require('react-dom');
const FilterableTable = require('../../src/Components/FilterableTable.jsx');
const FieldRenders = require('./FieldRenders.js');

let data = [
	{ name: "Steve", age: 27, job: "Sandwich Eater" },
	{ name: "Gary", age: 35, job: "Falafeler" },
	{ name: "Greg", age: 24, job: "Jelly Bean Juggler" },
	{ name: "Jeb", age: 39, job: "Burrito Racer" },
	{ name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
	{ name: "Jackson", age: 41, job: "Careful Bead Accelerator" },
	{ name: "Emma", age: 83, job: "Clever Beam Councillor" },
	{ name: "Aiden", age: 59, job: "Dead Bean Investigator" },
	{ name: "Olivia", age: 60, job: "Easy Bedroom Projector" },
	{ name: "Lucas", age: 65, job: "Famous Boot Actor" },
	{ name: "Ava", age: 40, job: "Gifted Bread Counsellor" },
	{ name: "Liam", age: 52, job: "Helpful Brick Investor" },
	{ name: "Mia", age: 33, job: "Important Brother Protector" },
	{ name: "Noah", age: 65, job: "Inexpensive Camp Administrator" },
	{ name: "Isabella", age: 76, job: "Cooing Chicken Decorator" },
	{ name: "Ethan", age: 26, job: "Deafening Children Legislator" },
	{ name: "Riley", age: 77, job: "Faint Crook Radiator" },
	{ name: "Mason", age: 42, job: "Hissing Deer Auditor" },
	{ name: "Aria", age: 27, job: "Loud Dock Dictator" },
	{ name: "Caden", age: 22, job: "Melodic Doctor Mediator" },
	{ name: "Zoe", age: 85, job: "Noisy Downtown Refrigerator" },
	{ name: "Oliver", age: 84, job: "Round Drum Calculator" },
	{ name: "Charlotte", age: 28, job: "Shallow Dust Director" },
	{ name: "Elijah", age: 46, job: "Skinny Eye Narrator" },
	{ name: "Lily", age: 47, job: "Square Family Sailor" },
	{ name: "Grayson", age: 19, job: "Jolly Butter Collector" },
	{ name: "Layla", age: 81, job: "Kind Cast Editor" },
	{ name: "Jacob", age: 27, job: "Lively Cave Navigator" },
	{ name: "Amelia", age: 31, job: "Nice Cent Spectator" },
	{ name: "Michael", age: 39, job: "Obedient Cherries Commentator" },
	{ name: "Emily", age: 64, job: "Bitter Cherry Educator" },
	{ name: "Benjamin", age: 36, job: "Delicious Cobweb Objector" },
	{ name: "Madelyn", age: 61, job: "Fresh Coil Supervisor" },
	{ name: "Carter", age: 68, job: "Greasy Cracker Competitor" },
	{ name: "Aubrey", age: 67, job: "Creepy Dinner Elevator" },
	{ name: "James", age: 70, job: "Crooked Eggnog Operator" },
	{ name: "Adalyn", age: 68, job: "Cuddly Elbow Surveyor" },
	{ name: "Jayden", age: 70, job: "Curly Face Conductor" }
];

let fields = [
	{ name: 'name', displayName: "Name", inputFilterable: true, sortable: true, render: FieldRenders.name },
	{ name: 'age', displayName: "Age", inputFilterable: true, exactFilterable: true, sortable: true, render: FieldRenders.age },
	{ name: 'job', displayName: "Occupation", inputFilterable: true, exactFilterable: true, sortable: true, render: FieldRenders.job }
];


ReactDOM.render(
	<div>
		<FilterableTable
			namespace="People"
			initialSort="name"
			data={data}
			fields={fields}
			noRecordsMessage="There are no people to display"
			noFilteredRecordsMessage="No people match your filters!"
		/>
	</div>, document.getElementById('root')
);


