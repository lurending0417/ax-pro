
import { observer } from "mobx-react"
import img from "../../static/images/img1/4@3x.png"
import img_2 from "../../static/images/box-off@1x.png"
import img_3 from "../../static/images/banner@3x.png"
// import { test_a1 } from "../../src/common/common";
import UserStore from "../../data/stores/UserStore"
import "../../common/rem"
import test from "../../data/stores/testStore"
import tabable from "../../components/nav/tab"


@observer
@tabable(2)
export default class Test extends React.Component {

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

		this.state = {
			arr: [
				-42, 22, 13, 12, 31, 231, 4, 12, 5
			]
		}

		console.log("NODE_ENV=", process.env.NODE_ENV)

		// UserStore.getStorages()
	}

	componentDidMount(){
		document.cookie="auth:123123;"
	}

	render() {
		return (<div className="content">
			<div className="App">
				{
					(0,()=>{
						if(this.props.rows){
							return <ul>
								{
									this.props.rows.map(item=>{
										return <li key={item.storageId}>{item.scientificName}</li>
									})
								}
							</ul>
						}
					})()
				}
				<img src={img_3}/>
				<img src={img}/>
				<img src={img_2}/>
				{
					this.state.arr.map((item, index) => {
						return <div key={index}>{item}</div>
					})
				}
				<div className="App-header">
					<h2>Welcome to App你好</h2>
				</div>
				<p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<text>{UserStore.name}</text>
				<text>{UserStore.age}</text>
				<button onClick={test.add}>{test.count}</button>

				<button onClick={() => {
					this.setState({
						arr: [
							this.state.arr[0] + 1, this.state.arr[1] + 1, this.state.arr[2] + 1, this.state.arr[3] + 1, this.state.arr[4] + 1, this.state.arr[5] + 1, this.state.arr[6] + 1, this.state.arr[7] + 1, this.state.arr[8] + 1
						]
					})

					UserStore.addAge()
				}}>+1
				</button>
				<a href="/index1/second1">
                    jump1
				</a>
				<button onClick={() => {
					window.location.href = "../thrid/thrid.html"
				}}>
                    jump2
				</button>
			</div>
		</div>
		);
	}
}


