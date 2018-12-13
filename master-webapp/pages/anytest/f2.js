import UserStore from "../../data/stores/UserStore"
import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"

@navable("/anytest/f2")
@observer
export default class F2 extends React.Component {
	static async getInitialProps() {
		console.log("asdfasdf")
		function delay() {
			return new Promise(s => {
				setTimeout(s, 2000);
			})
		}
		await delay();
		return { a: "f2" }
	}
	render() {
		return <h1>
			<button onClick={() => { console.log(this.props.navigation.backTo()) }}>back</button>
			<button onClick={() => { UserStore.addAge() }}>{UserStore.age}</button>
			{this.props.a || "f22"}</h1>
	}
}

F2.navProps = () => {

	return {
		title: "F2"
	}
}