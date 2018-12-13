import {observer} from "mobx-react";
import Store from "../../data/stores"
import logger from "../../utils/logger"

const test=Store.test;

@observer
export default class TestStore extends React.Component{
	static getInitialProps(ctx){
		test.recovery(ctx.req.headers.cookie);
		return {};
	}
	@logger("teststore rendered")
	render(){
		
		return <div>
			<label>{test.count}</label>
			<button onClick={()=>test.add()}>test add</button>
			<button onClick={test.addOther}>test other</button>
		</div>
	}
}