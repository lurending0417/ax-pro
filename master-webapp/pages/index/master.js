import Router, { withRouter } from "next/router"
import { observer } from "mobx-react"
import Link from "next/link"

import List from "../../components/common/list"
import MaterIntr from "../../components/master/main"
import { API_MASTER_LIST } from "../../common/api"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"

import MastList from "../master/list"


@navable("/index/master", "master")
@observer
@tabable(1)
export default class Master extends React.Component {
	static getInitialProps({ req }) {
		UserStore.recovery(req && req.headers && req.headers.cookie)
		return { a: 0 }
	}

	// static navProps() {
	// 	return {
	// 		title: "大师",
	// 		showBack: false
	// 	}
	// }

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
		return <MastList navigation={this.props.navigation} />
	}

	renderItem = (item) => {
		return <MaterIntr onClick={this.toDetail(item)} concern_able tags_able address_able  {...item} />
	}

	toDetail(item) {
		return () => {
			this.props.navigation.navTo("/master/detail", {
				data: item
			})
		}
	}
}