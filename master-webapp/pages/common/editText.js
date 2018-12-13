/**
* 单独页  做输入
*  <>-----}|------------------------------->
* 
*/
import Api from "../../api/api"

export default class EditText extends React.PureComponent {
	constructor(props) {
		super();
		this.state = {
			newV: props.value || "",
			oldV: props.value || ""
		}
	}
	static navProps(props) {
		return {
			title: props.title
		}
	}
	renderInput() {
		const { multiple = false } = this.props;
		if (multiple)
			return <textarea onChange={this.onChange} placeholder={this.props.placeholder}>{this.state.newV}</textarea>
		return <input onChange={this.onChange} type="text" placeholder={this.props.placeholder} value={this.state.newV} />
	}
	render() {
		return <div>
			<div className="list-block" style={{ backgroundColor: "white", marginTop: 0 }}>
				<div className="item-content">
					<div className="item-inner">
						<div className="item-input">
							{this.renderInput()}
						</div>
					</div>
				</div>
			</div>
			<p style={{ marginLeft: "1rem" }}>{this.props.desc}</p>
			<div className="content-block">
				<div className="row">
					<div className="col-100">
						<a onClick={this.submit} className="button button-big gold-btn">保存</a>
					</div>
				</div>
			</div>
		</div>
	}

	onChange = (e) => {
		this.setState({
			newV: e.target.value
		})
	}

	submit = () => {
		const v = this.state.newV;
		const { check, reg, desc, errmsg, api, field, method = "post", navigation } = this.props;

		if (this.state.newV == this.state.oldV) {
			return navigation.backTo();
		}

		if (check) {
			let err = "";
			if ((err = check(v)) !== true) {
				return $.alert(err);
			}
		}

		if (reg) {
			if (!reg.test(v)) {
				return $.alert(errmsg || desc);
			}
		}

		if (this.props.onChoose) {
			return this.props.onChoose(v)
		}



		Api.request({
			url: api,
			method: method,
			params: {
				[field]: v
			}
		}).then(() => {
			$.alert("保存成功", () => {
				this.props.onSaved && this.props.onSaved(v);
				process.nextTick(() => {
					navigation.backTo();
				})
			})
		})

	}
}