import UserStore from "../../data/stores/UserStore"
import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import tabable from "../../components/nav/tab"
import Api from "../../api/api"
import { APILOGIN } from "../../common/api"
import * as mcc from "../../mock/index"

@navable("/anytest/f3")
@observer
@tabable(2)
export default class F2 extends React.Component {
	static async getInitialProps() {
		function delay() {
			return new Promise(s => {
				setTimeout(s, 2000);
			})
		}
		Api.request({
			url: APILOGIN,
			method: "get"
		}).then(rs => {
			console.log(rs);
		})
		await delay();
		return { a: "f3" }
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		return null;
	}
	static getSnapshotBeforeUpdate(preProps, prevState) {

	}
	render() {
		return <h1><button onClick={() => { UserStore.addAge() }}>{UserStore.age}</button>{this.props.a || "f333"}</h1>
	}
}

F2.navProps = () => {

	return {
		title: "F3",
		rightBtn: () => {
			return <a className="pull-right back">right</a>
		}
	}
}