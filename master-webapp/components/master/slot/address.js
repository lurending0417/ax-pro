
import ren from "../../../utils/renderUtil"

class Address extends React.PureComponent {
	constructor() {
		super()
	}
	render() {
		const code = this.props.detail && this.props.detail.districtCode || 510100;
		if (code)
			return <div className="fs-gray fs-small ma-p-address empty-50">
				<span>约见地址：{ren.renderDistrictCode(code)}</span>
			</div>
		return null;
	}
}

export default Address;