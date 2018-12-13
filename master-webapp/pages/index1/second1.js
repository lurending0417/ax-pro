
import { observer } from "mobx-react"
import UserStore from "../../data/stores/UserStore";
import tabable from "../../components/nav/tab"


@observer
@tabable(1)
export default class Second1 extends React.Component {
	static async getInitialProps({req}){
		UserStore.recovery(req.headers.cookie);
		const rs=await UserStore.getStorages()
		console.log(rs);
		return {
			rows:rs.rows
		};
	}

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div style={{ width: "3.75rem", height: "1rem", background: "#DFDFDF" }}>
				{UserStore.name + " " + UserStore.age}
				<button onClick={()=>{UserStore.addAge()}}>+1</button>
			</div>
		);
	}
}

