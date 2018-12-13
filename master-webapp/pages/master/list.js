/**
* 大师列表
*  <>-----}|------------------------------->
* 
*/

import List from "../../components/common/list"
import MaterIntr from "../../components/master/main"
import { API_MASTER_LIST, API_MASTER_LIST_REAL } from "../../common/api"
import navable from "../../components/common/nav/navable"
import Headers from "../../components/master/headers"
import Store from "../../data/stores"
import { BillTypes } from "../../common/constant";
import masterListStore from "../../data/stores/masterListStore";
import { on } from "../../utils/notify"


// @navable("/master/list")
class MasterList extends React.PureComponent {
	constructor() {
		super()
		const category = Store.category;
	}
	// static navProps(){
	// 	return {
	// 		title:"大师列表"
	// 	}
	// }

	componentDidMount() {
		// 刷新下列表数据
		this.unNo = on("MasterListRefresh", (item, setV) => {
			this.refs.list.refreshItem(item, setV);
		})
	}

	componentWillUnmount() {
		this.unNo();
	}

	render() {
		return <div style={{ overflow: "hidden" }} className="meet full">
			<Headers onChange={this.headerChange}></Headers>
			<List
				ref="list"
				// store={masterListStore}
				api={API_MASTER_LIST_REAL}
				renderItem={this.renderItem}
				className={"list-split"}
				getQuery={this.getQuery}
			/>
		</div>
	}

	getQuery = () => {
		return {
			categoryId: this.type || null

		}
	}

	headerChange = (index, item) => {
		this.type = item.id;

		this.refs["list"].getListData(0);
	}

	renderItem = (item, index, empty) => {
		if (empty) return null;
		return <MaterIntr bodyTxtClass={"fs-line3"} onClick={this.toDetail(item)} navigation={this.props.navigation} concern_able tags_able user={item} detail={item} />
	}

	toDetail(item) {
		return () => {
			this.props.navigation.navTo("/master/detail", {
				data: item
			})
		}

	}
}

export default MasterList;