import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import { SYS_MSG_TYPE } from "../../common/constant"

import starCom from "../../components/common/starCom"
import MessageStore from "../../data/stores/message"


@navable("/index/message", "msg")
@observer
@tabable(3)
export default class Message extends React.Component {
	static getInitialProps({ req }) {
		// UserStore.recovery(req && req.headers && req.headers.cookie)
		return { a: 0 }
	}

	// static navProps() {
	// 	return {
	// 		title: "消息",
	// 		showBack: false
	// 	}
	// }
	constructor(props) {
		super();
		this.state = {
			a: props.a,
			centerHeight: "28.65rem",
			msgArr: this.createMsgArr()
		}

	}

	createMsgArr() {
		const arr = [...SYS_MSG_TYPE];
		arr.map((item) => {
			if (item.id === "COMMENT") {
				item.iconCls = "message-remark-icon";
				item.urlObj = { url: "/message/remark", a: "4123fff" };
			} else if (item.id === "AGREE") {
				item.iconCls = "message-star-icon";
				item.urlObj = { url: "/message/star", a: "22212" };
			} else if (item.id === "WANTED") {
				item.iconCls = "message-money-icon";
				item.urlObj = { url: "/message/reward", a: "32123" };
			}
		})
		return arr;
	}

	componentDidMount() {
		MessageStore.getNewMessageCount().then(() => {
			if (JSON.stringify(MessageStore.newMessageCount) === "{}" || !MessageStore.newMessageCount) {
				return
			}
			const countObj = MessageStore.newMessageCount;
			if (countObj.total === 0) {
				return
			}
			const { msgArr } = this.state;
			countObj.types.forEach((item) => {
				msgArr.forEach((msgItem) => {
					if (item.type === msgItem.id) {
						// console.log("item.type", item.type)
						msgItem.count = item.count
					}
				})
			})
			this.setState({ msgArr })
		})

	}

	read = (url, a, oItem) => {
    this.navigateTo(url, a);
    let nItem = oItem;
    var total = 0;
    const { msgArr } = this.state;
    const countObj = MessageStore.newMessageCount;
    countObj.types.forEach((item) => {
      msgArr.forEach((msgItem) => {
        if (item.type === msgItem.id) {
          msgItem.count = nItem.id === item.type ? 0 : item.count
          total += msgItem.count;
          item.count = nItem.id === item.type ? 0 : item.count;
          return msgItem
        }
      })
      return item;
    })
    console.log("msg", msgArr);
    countObj.total = total;
    MessageStore.newMessageCount = {...countObj}
    this.setState({ msgArr })
  }

	renderListItem(iconCls, urlObj, tag, hasNew, index, item) {

		return (
			<div className="border-round message_item_wrap" onClick={() => this.read(urlObj.url, urlObj.a, item)} key={"msg" + index}>
				<span className={iconCls}></span>
				<span className="remark_title fs-small">{tag}</span>
				{
					hasNew && (
						<span className="remark_tip fs-small">你有新的{tag}</span>
					)
				}
				<span className="right-arrow-icon"> </span>
        {
          hasNew && (
            <div
              style={{
                position: "fixed",
                height: "0.4rem",
                width: "0.4rem",
                backgroundColor: "#E4112B",
                borderRadius: "0.2rem",
                marginLeft: "1.25rem",
                marginTop: "-0.6rem",
                border: "0.05rem solid #FFFFFF"
              }}
            ></div>
          )
        }
			</div>
		)
	}

	render() {
		return <div style={{ overflowY: "auto", height: this.state.centerHeight, backgroundColor: "#fff", paddingTop: ".75rem" }}>
			{
				this.state.msgArr.map((item, index) => {
					return this.renderListItem(item.iconCls, item.urlObj, item.name, item.count > 0, index, item)
				})
			}
			{/*其他内容*/}
			{/*<div className="flex-center-wrap">*/}
			{/*<button className="button" onClick={() => this.navigateTo("/remarkTest/remarkList", "66667")}>评论与回复</button>*/}
			{/*/!*<button className="button">点赞</button>*!/*/}
			{/*<button className="button" onClick={()=>{this.shareTo()}}>分享</button>*/}
			{/*<button className="button" onClick={() => this.openStarModal()}>选星评价</button>*/}
			{/*<button className="button" onClick={() => this.navigateTo("/remarkTest/giftTest", "5443")}>打赏现金</button>*/}
			{/*<button className="button" onClick={() => this.navigateTo("/remarkTest/purchaseVip", "4433")}>购买会员</button>*/}
			{/*</div>*/}
		</div>
	}

	shareTo() {
		const alertModal = $.alert("请点击右上方进行分享");
		$(alertModal).find(".modal-text").addClass("fs-normal")
	}

	navigateTo(path, a) {
		this.props.navigation.navTo(path, { a });
	}

	openStarModal() {
		starCom("ddd", "dddddssss")
	}

}