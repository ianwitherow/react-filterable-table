import React from 'react';

class ExactFilter extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { filter, removeFilter } = this.props;

		return (
			<span className="filter-item">
				<span className="filter-item-title">
					<span className="filter-item-remove" onClick={() => removeFilter(filter)}>
						<span className="fa fa-times"></span>
					</span>
					{filter.name}
				</span>
				<span className="filter-item-value">
					{filter.value}
				</span>
			</span>
		);
	}
}

module.exports = ExactFilter;

