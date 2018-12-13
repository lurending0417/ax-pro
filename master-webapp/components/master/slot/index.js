/**
 * 一些 小东西  以  插件的 形式 组装进去
 * 布局 以 absolute 定位
 *  <>-----}|------------------------------->
 *
 */


import CommentGroup from "../../../pages/common/commentGroup"
import Concern from "./concern"
import Tags from "./tags"
import Address from "./address"
import MeetBtn from "./meetBtn"
import DisaBuseLink from "../disabuseLink";
import QuestionBtn from "./questionBtn";


export default (comClass) => {

    const addPlugin = comClass.addPlugin;


    // 关注
    addPlugin("concern_able", "header", Concern)

    // 只有关注数量，没有关注按钮
    addPlugin("concern_only_number_able", "header", ({ detail }) => {
        return <Concern concern_only_number_able={true} detail={detail}></Concern>
    })

    // 标签
    addPlugin("tags_able", "footer", Tags)

    //地址
    addPlugin("address_able", "footer", Address)

    // 品论
    addPlugin("comment_able", "footer", CommentGroup)

    // 约见
    addPlugin("meet_able", "header", MeetBtn)

    // 查看解惑
    addPlugin("look_able", "footer", ({ detail }) => {
        let num = 0;
        if (detail) {
            num = detail.questionTimes
        }
        return <DisaBuseLink style={{
            float: "right"
        }} tip={`${num + "次" || "查看"}解惑`}/>
    })

    // 提问
    addPlugin("ask_able", "header", QuestionBtn)

    // 头像
    return comClass;
}