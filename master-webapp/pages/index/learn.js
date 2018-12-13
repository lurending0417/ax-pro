import Router, { withRouter } from "next/router"
import { observer } from "mobx-react"
import Link from "next/link"
import List from "../../components/common/list";
import Headers from "../../components/common/headers"
import CourseListItem from "../../components/course/courseListItem";
import { API_COURSE_LIST } from "../../common/api";


import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import CategoryHeaders from "../../components/master/headers";
import Atten_Plan from "../../components/common/atten_plan";


@navable("/index/learn", "learn")
@observer
@tabable(2)
export default class Learn extends React.Component {
	static getInitialProps({ req }) {
		UserStore.recovery(req && req.headers && req.headers.cookie)
		return { a: 0 }
	}

	// static navProps() {
	// 	return {
	// 		title: "学习",
	// 		showBack: false
	// 	}
	// }

	constructor(props) {
		super();

		this.state = {
			a: props.a
		}
		this.menus = [
			"待学习",
			"已学习"
		]
	}


	componentDidMount() {
		// setTimeout(()=>{
		// 	this.setState({
		// 		a:2
		// 	})
		// },2000)
	}
	getQuery = () => {
		return {
			studied: this.type || false
		}
	}
	renderItem = (item, index, empty) => {
		if (empty) return null;
		return <CourseListItem data={item} navigation={this.props.navigation} style={{zIndex: "2"}}/>
	}

	headerIndexChange = (index) => {
		switch (index) {
			case 0:
				this.type = false;
				break;
			case 1:
				this.type = true;
				break;
			default:
				this.type = false;
				break;
		}
		this.refs["list"].getListData(0);
	}
  renderHeader = () => {
    return <Atten_Plan hasTitle navigation={this.props.navigation}/>
  }
	render() {
		return <div className="no-scroll">
			{/* <CategoryHeaders onChange={this.headerIndexChange} /> */}
			<Headers isTextGold={false} onChange={this.headerIndexChange} className="bar color-black bar-nav cat-header" headers={this.menus} getText={item => item}></Headers>
			<List
				api={API_COURSE_LIST}
				renderItem={this.renderItem}
				getQuery={this.getQuery}
				className="list-split list-split-border"
				ref="list"
        renderHeader={this.renderHeader}
				emptyDesc={"暂无相关课程"}
			/>
		</div>
	}
}