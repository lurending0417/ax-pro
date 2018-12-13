
import img_1 from "../../static/images/img1/4@3x.png"

export default class Thrid extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			arr: [
				1, 2, 3, 12, 31, 231, 4, 12, 3
			]
		}

	}

	render() {
		return (
			<div style={{ width: "3.75rem", height: "1rem", background: "#DFDFDF" }}>
                this is other page
				<img src={img_1}/>
			</div>
		);
	}
}

