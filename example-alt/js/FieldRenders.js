
module.exports = {
	name: function(props) {
		return props.value;
	},
	age: function(props) {
		// If they are over 60, use the "blind" icon, otherwise use a motorcycle
		let iconClassName = "fa fa-" + (props.value > 60 ? "blind" : "motorcycle");
		let personName = props.record.name;
		return (
			<span title={personName + "'s Age"}>
				{props.value} <span className={iconClassName}></span>
			</span>
		);
	},
	job: function(props) {
		let message = `${props.record.name}'s job is ${props.record.job} and they're ${props.record.age} year old.`;
		return (
			<span title={message}>
				{props.value}
			</span>
		);
	}
}
