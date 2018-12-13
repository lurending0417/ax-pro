/**
* 大师 简介 主体   其他小东西  以插件 形式 添加
*  <>-----}|------------------------------->
* header body footer
*/

import Introduce from "./introduce"
import CommonAvatar from "../common/commonAvatar";

class MasterIntroduceMain extends Introduce {
	renderAvator() {
		const avatar = this.props.user && this.props.user.avatar || null;
		return <CommonAvatar src={avatar} className="ma_avatar test-avatar-0" >
			<div className="master-confirm-icon ma_master_confirm" />
		</CommonAvatar>
		return <div className="ma_avatar test-avatar-0">
			{
				(0, () => {
					if (avatar) {
						return <img className="full" src={avatar}></img>
					}
				})()
			}
			<div className="master-confirm-icon ma_master_confirm" />
		</div>
	}

	renderName() {
		const detail = this.props.detail || { score: 6 };
		return <div className="ma_right">
			<div className="ma_title fs-big">
				{detail.nick || "大师"}
				{
					this.props.needType === true &&
					<em className={"tag tag-" + detail.categoryName} style={{
						borderRadius: "0.5rem",
						display: "inline-flex",
						color: "#fff",
						marginLeft: "0.75rem",
						justifyContent: "center",
						alignItems: "center",
						padding: "0 0.45rem",
						fontSize: "0.7rem",
						backgroundColor: `${detail.categoryColor}`
					}}>{detail.categoryName}</em>
				}
			</div>
			<div className="ma_stars">
				{(() => {
					var content = [];
					for (var i = 0; i < detail.score; i++) {
						content.push(<div key={"star-" + i} className="ma_star master-star-icon" />);
					}
					return content;
				})()}
			</div>
		</div>
	}
}

export default MasterIntroduceMain;

