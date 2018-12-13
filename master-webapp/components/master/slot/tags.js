


class Tags extends React.PureComponent {
	constructor() {
		super()
	}
	render() {
		let tags = this.props.detail && this.props.detail.tags || [];
		if (!tags.length) return <div></div>;
		return <div className="fs-gray fs-small ma-p-tags empty-50">
			{
				tags.map((item, index) => {
					return <span key={"tags" + index}>{"#" + item}</span>
				})
			}
		</div>
	}
}

export default Tags;