import { observer } from "mobx-react"
import PropTypes from "prop-types"

@observer
export default class ViewImgDetail extends React.Component {

	constructor(props) {
		super()
	}

	render() {
		return (
			<div className="showImgDetail" onClick={this.props.hideImg}>
				<img src={this.props.src} alt="" />
			</div>
		)
	}

}

ViewImgDetail.propTypes = {
	src: PropTypes.string.isRequired,
	hideImg: PropTypes.func.isRequired
}