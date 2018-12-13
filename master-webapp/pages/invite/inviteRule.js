import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"


@navable("/invite/inviteRule")
@observer
export default class InviteRule extends React.Component {
	static getInitialProps({ req }) {
		UserStore.recovery(req && req.headers && req.headers.cookie)
		return { a: 0 }
	}

	static navProps() {
		return {
			title: "分销规则"
		}
	}

	constructor(props) {
		super();

		this.state = {
			a: props.a
		}
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
                invite rule
			</div>
		)
	}

}