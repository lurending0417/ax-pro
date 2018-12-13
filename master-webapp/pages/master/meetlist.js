/**
* 大师列表
*  <>-----}|------------------------------->
* 
*/
import Store from "../../data/stores"
import List from "../../components/common/list"
import MaterIntr from "../../components/master/main"
import { API_MASTER_LIST } from "../../common/api"
import navable from "../../components/common/nav/navable"
import Headers from "../../components/common/headers"
import { observer } from "mobx-react";
import { BillTypes } from "../../common/constant";

const CategoryStore = Store.category;
const data = ["大师", "太极", "书法", "国画"]

@navable("/master/meetlist")
@observer
class MasterMeetList extends React.PureComponent {
	constructor() {
		super()
		this.type = null;
	}
	static navProps() {
		return {
			title: "大师列表"
		}
	}
	render() {
		return <div className="meet full">
			<Headers onChange={this.headerIndexChange} className="bar color-black bar-nav" headers={CategoryStore.rows} getText={item => item.name}></Headers>
			<List
				api={API_MASTER_LIST}
				renderItem={this.renderItem}
				className={"list-split"}
				getQuery={this.getQuery}
				ref="list"
			/>
		</div>
	}

	renderItem = (item) => {
		return <MaterIntr navigation={this.props.navigation} detail={item} user={item} onClick={this.toDetail(item)} meet_able tags_able address_able />
	}

	getQuery = () => {
		return {
			categoryId: this.type || null,
			billType: BillTypes.APPOINT
		}
	}

	headerIndexChange = (index) => {
		this.type = CategoryStore.rows[index].id;

		this.refs["list"].getListData(0);

	}

	toDetail(item) {
		return () => {
			this.props.navigation.navTo("/master/detail", {
				data: item
			})
		}
	}
}

export default MasterMeetList;