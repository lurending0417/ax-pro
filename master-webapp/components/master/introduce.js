import { child } from "serializr";

/**
* 用户简介
*  <>-----}|------------------------------->
* header body  footer
* header 头像 名字  插件
*/
import slotable from "./slot"
import _map from "lodash/map"
import PropTypes from "prop-types";

import CommentGroup from "../../pages/common/commentGroup"

const _plugins = {};

@slotable
export default class UserIntroduce extends React.PureComponent {

	static addPlugin = (key, pos, comp) => {
		_plugins[key] = {
			pos, comp
		}
	}


	formatPlugins() {
		const needPlugins = {};
		Object.keys(this.props).forEach(key => {
			const item = _plugins[key];
			let ps = this.props[key];
			if (typeof ps !== "object") {
				ps = {};
			}
			if (item) {
				needPlugins[item.pos] = needPlugins[item.pos] || [];
				needPlugins[item.pos].push({ Comp: item.comp, ps: ps })
			}
		})
		this.needPlugins = needPlugins;
	}

	render() {
		this.formatPlugins();
		return this.renderMain([
			this.renderHeader(),
			this.renderBody(),
			this.renderFooter()
		])
	}

	fakeData() {
		return {
			isShortIntr: this.props.isShortIntr,
			concernCount: Math.floor(Math.random() * 1000),
			tags: _map(new Array(4), () => (Math.floor(Math.random() * 100) + "")),
			detail: this.props.detail,
			navigation: this.props.navigation
		}
		// return this.props.data;
	}

	renderPluginByPos(pos) {
		if (this.needPlugins[pos]) {
			const ps1 = this.fakeData();
			return this.needPlugins[pos].map((item, index) => {
				const { Comp, ps = {} } = item;
				return <Comp key={pos + "-" + index} {...ps}  {...ps1} />
			})
		}

		return null;
	}

	renderHeaderPlugin() {
		const { headerPlugin } = this.props;
		if (headerPlugin)
			return headerPlugin(this.props);
		return this.renderPluginByPos("header")
	}

	renderName() {
		return <div className="ma_right">
			<div className="ma_title_blue fs-big">{this.props.user ? this.props.user.nick : "藏着呢"}</div>
		</div>
	}

	renderAvator() {
		return <div className="ma_avatar">
		</div>
	}

	renderHeader() {
		return <div key="head" className="uheader ms_item_header">
			{this.renderAvator()}
			{this.renderName()}
			{this.renderHeaderPlugin()}
		</div>
	}

	renderBodyText() {
		var content = this.props.detail ? (this.props.detail.content ? this.props.detail.content : this.props.detail.intro) : ""
		if (!content) {
			return null;
		}
		return <p className={this.props.bodyTxtClass} style={this.props.bodyTxtStyle}>{content}</p>
	}

	renderBody() {
		return <div key="body" className="ubody ms_item_content fs-small">
			{this.renderPluginByPos("body")}
			{this.renderBodyText()}
		</div>
	}

	renderFooterPlugin() {
		return this.renderPluginByPos("footer")
	}

	renderFooter() {
		return <div key="footer" className="ufooter">
			{this.renderPluginByPos("footer")}
			{/* <CommentGroup /> */}
		</div>
	}

	renderMain(children) {
		return <div onClick={this.props.onClick} style={this.props.style} className={"umain ms_item" + (this.props.className && (" " + this.props.className) || "")}>
			{children}
		</div>
	}

}

// 将数据分为 用户(大师、普通用户) 和 内容 两部分
UserIntroduce.propTypes = {
	user: PropTypes.object, //用户(大师、普通用户)
	detail: PropTypes.object // 内容
}

