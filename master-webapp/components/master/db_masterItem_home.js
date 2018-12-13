import MasterIntroduceMain from "./main";
import CommonBtn from "../../components/common/button/commonBtn";
import DisaBuseLink from "./disabuseLink";
import MasterLabel from "./masterLabel";
import LinkBtn from "../common/link";

//首页专用
export default class DB_MasterItem extends MasterIntroduceMain {
    renderMain(children) {
        return <div className="border-round umain ms_card_item">
            {children}
        </div>
    }

    renderHeaderPlugin() {

        const detail = this.props.detail || { id: "", watchCost: 1000 };
        return <div className="ma-p-concern">
            <LinkBtn className="gold-border-btn btn-size-normaler button" onClick={this.props.askCallBack}>偷看
                <span className="ma-f-question">￥{detail.listenCost}</span>
            </LinkBtn>
        </div>
        // return <CommonBtn
        // 	isFill={false}
        // 	style={{
        // 		height: "1.6rem",
        // 		width: "4.25rem",
        // 		fontWeight: "500",
        // 		fontSize: "0.75rem",
        // 		position: "absolute",
        // 		right: "0.5rem",
        // 		top: "0.75rem"
        // 	}}
        // 	title={`提问￥${detail ? detail.watchTimes : 0}`}
        // 	callback={this.props.askCallBack}
        // />
    }

    renderFooter() {
        const detail = this.props.detail;
        return (
            <div key="footer" className="ms_item_footer">
                {
                    (detail.master && detail.master.tags) ? <MasterLabel tags={detail.master.tags} /> : <MasterLabel />
                }
                <DisaBuseLink tip={`${detail ? detail.listenTimes : 0}人已偷看`} />
            </div>
        )
    }
}