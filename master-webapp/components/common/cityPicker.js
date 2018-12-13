import BaseIdComp from "./idComponent"
import mixable from "../../utils/mixable"
import { join } from "../../utils/compose"
import ChooseCityCpn from "./ChooseCityCpn";


@mixable(BaseIdComp)
export default class CityPicker extends React.PureComponent {
	constructor(props) {
		super();

		this.state = {
			address: props.defaultValue || "",
			cityCode: "",
			visible: false
		}
	}

	initById() {
		$("#" + this.state._id_).attr("readonly", true);
		return;
		// const cm = $("#" + this.state._id_);
		// cm.cityPicker({
		// 	toolbarTemplate: "<header class=\"bar bar-nav\">\
		//     <button class=\"button button-link pull-right close-picker\">确定</button>\
		//     <h1 class=\"title\">地址选择</h1>\
		//     </header>"
		// 	// onChange:p=>{
		// 	// 	console.log(p.value)
		// 	// 	join([this.props.onChange,this.onChange])({target:{value:p.value.filter(Boolean).join(" ")}})
		// 	// }
		// })
		// cm.change(() => {
		// 	console.log("change")
		// 	join([this.props.onChange, this.onChange])({ target: { value: cm.val() } })
		// })
	}

	focus = () => {
		if (this.props.readOnly) {
			return;
		}
		// this.props.navigation.navTo("/common/addressPicker",{
		// 	onChoose:(city)=>{
		// 		this.setState({
		// 			address:city
		// 		})
		// 	},
		// 	defaultValue:this.props.defaultValue
		// })

		this.cityComp.show();
	}

	onChange = (e) => {
		console.log(3)
		this.setState({
			address: e.target.city,
			cityCode: e.target.value
		})

		this.props.onChange && this.props.onChange(e)
	}

	empty = () => { }

	render() {
		const fcs = {}
		const { type, readOnly, onChange, navigation, defaultValue, ...others } = this.props;

		if (!readOnly)
			fcs.onClick = this.focus;
		if (type == "detail") {
			fcs.onClick = this.focus;
			// fcs.onFocus=this.focus;
			fcs.className = (this.props.className || "") + " city-detail fs-gray"
			const v = (this.state.address || "").split("  ")
			return <div {...fcs}>
				<span>{v[0]}</span>
				<span className="text-overflow">{v[1]}</span>
			</div>
		}
		return <div><input readOnly value={this.state.address} id={this.state._id_} {...others}  {...fcs} ></input>
			{/* return <div ><span className="input" id={this.state._id_} {...others}  {...fcs} >{this.state.address}</span> */}
			<ChooseCityCpn onChange={this.onChange} ref={ref => this.cityComp = ref} />
		</div>
	}
}