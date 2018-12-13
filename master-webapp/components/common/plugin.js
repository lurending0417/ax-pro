/**
* 引入 组建的 位置
*  <>-----}|------------------------------->
* 
*/
import { API_GET_MEETS } from "../../common/api";
import List from "./list"
import Link from "./link"
import MaterIntr from "../master/main"
import AwardBtn from "../gold/awardBtn";
import CityPicker1 from "./cityPicker"
import CityPicker2 from "./ChooseCityCpn"
import Modal from "./modal"
import TestVideo from "../../pages/anytest/video"


const plugins = [
	{
		name: "list",
		desc: "刷新列表",
		comp: List,
		api: API_GET_MEETS,
		renderItem: (item) => (<MaterIntr {...item} />)
	}, {
		name: "link",
		desc: "链接",
		comp: Link,
		href: "",
		children: "Hello 点我呀",
		onClick: () => $.toast("干啥干啥呢")
	}, {
		name: "master",
		desc: "大师",
		comp: MaterIntr
	}, {
		name: "赏",
		desc: "赏按钮",
		comp: AwardBtn
	}, {
		name: "城市选择1",
		desc: "城市选择1",
		comp: CityPicker1,
		defaultValue: "四川 成都 双流"
	}, {
		name: "城市选择2",
		desc: "城市选择2",
		comp: CityPicker2,
		defaultValue: "四川 成都 双流",
		componentDidMount: ref => ref.show()
	}, {
		name: "modal",
		desc: "modal",
		comp: Modal,
		componentDidMount: ref => ref.show()
	}, {
		name: "video",
		desc: "video",
		comp: TestVideo
	}
]


export {
	plugins
}
