let ExactFilter = require('./ExactFilter');

class ExactFilters extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {

		let { exactFilters, removeExactFilter } = this.props;

		let filters = exactFilters.map((filter, i) => {
			return <ExactFilter filter={filter} removeFilter={removeExactFilter} key={i} />;
		});

		return (
			<div className="exact-filters">
				{filters}
			</div>
		);

	}

}

module.exports = ExactFilters;
