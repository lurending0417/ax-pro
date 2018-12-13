import BaseIdComp from "./idComponent"
import { join } from "../../utils/compose"
import mixable from "../../utils/mixable"

@mixable(BaseIdComp)
export default class CityPicker extends React.PureComponent {
	constructor(props) {
		super();

		this.state = {
			time: props.defaultValue || ""
		}
	}

	getJq() {
		return this._jq;
	}
	initById() {
		const { type } = this.props;
		if (this.props.readOnly) {
			return;
		}
		if (type != "range") {
			const cm = $("#" + this.state._id_);
			cm.datetimePicker1({
				toolbarTemplate: "<header class=\"bar bar-nav\">\
				<button class=\"button button-link pull-right close-picker\">确定</button>\
				<h1 class=\"title\">选择日期和时间</h1>\
				</header>"
			});

			cm.change(() => {
				console.log("change  time")
				join([this.props.onChange, this.onChange])({ target: { value: cm.val() } })
			})

			this._jq = cm;
		}
	}

	focus = () => {
		this.props.navigation.navTo("/common/rangeTimePicker", {
			onChoose: (time) => {
				this.setState({
					time: time
				})
			},
			defaultValue: this.state.time
		})
	}

	onChange = (e) => {
		this.setState({
			time: e.target.value
		})
	}

	render() {
		const fcs = {}
		const { type, readOnly, onChange, navigation, defaultValue, ...others } = this.props;
		if (type == "range") {
			fcs.onClick = this.focus;
			fcs.onFocus = this.focus;
			fcs.className = (this.props.className || "") + " time-range"
			// 分两行用span 展示
			const ts = this.state.time.split("--")
			return <div {...fcs}>
				<span>{ts[0]}</span>
				<span>{ts[1]}</span>
			</div>
		}
		return <input readOnly value={this.state.time} id={this.state._id_} {...others} {...fcs}></input>
	}
}