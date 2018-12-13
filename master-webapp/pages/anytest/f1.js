

import { observer } from "mobx-react"
import Link from "next/link"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"




@navable("/anytest/f1", { title: "f1" })
@observer
// @tabable(0)
export default class F1 extends React.Component {
	static getInitialProps({ req }) {
		UserStore.recovery(req && req.headers && req.headers.cookie)
		return { a: 0 }
	}

	static navProps() {
		return {
			title: "F1"
		}
	}
	constructor(props) {
		super();

		this.state = {
			a: props.a
		}
	}
	componentDidMount() {
		// setTimeout(()=>{
		// 	this.setState({
		// 		a:2
		// 	})
		// },2000)
	}
	render() {
		return <div style={{ overflowY: "auto", paddingBottom: "100px" }}>
			<p style={{ fontFamily: "cursive" }}>f1-阿斯蒂芬-1231-cursive</p>
			<p style={{ fontFamily: "fantasy" }}>f1-阿斯蒂芬-1232-fantasy</p>
			<p style={{ fontFamily: "monospace" }}>f1-阿斯蒂芬-123-monospace</p>
			<p style={{ fontFamily: "sans-serif" }}>f1-阿斯蒂芬-123-sans-serif</p>
			<p style={{ fontFamily: "serif" }}>f1-阿斯蒂芬-123-serif</p>
			<p >f1-阿斯蒂芬-123-default</p>
			<p style={{ fontFamily: "宋体" }}>f1-阿斯蒂芬-123-宋体</p>
			<p style={{ fontFamily: "pingfangsc" }}>f1-阿斯蒂芬-123-pingfangsc</p>
			<a href="weixin://dl/business/?ticket=ta428dhj739hg3efe6e">add</a>
			<Link href="/anytest/f2" scroll={true}>
				<a className="external">f2</a>
			</Link>
			<Link href="/anytest/f3">
				<a className="external">f3</a>
			</Link>
			<button onClick={() => { UserStore.addAge() }}>{UserStore.age}</button>
			<button onClick={this.click} >f2</button>
			<button onClick={this.click2} >f3</button>
		</div>
	}

	click = () => {
		const path = "/anytest/f2"
		this.props.navigation.navTo(path, { a: "2fff" });
	}

	click2 = () => {
		const path = "/anytest/f3"
		this.props.navigation.navTo(path, { a: "3fff" });
	}
}

F1.navProps = () => {
	return {
		title: "F1"
	}
}