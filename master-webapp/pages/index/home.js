import Router, { withRouter } from "next/router"
import { observer } from "mobx-react"

import DB_MasterItem_Home from "../../components/master/db_masterItem_home"
import MaterIntr from "../../components/master/main"


import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"

import icon_course from "../../static/images/index/home-icon-course.png"
import icon_answer from "../../static/images/index/home-icon-answer.png"
import icon_reward from "../../static/images/index/home-icon-reward.png"
import icon_meeting from "../../static/images/index/home-icon-meeting.png"


import homeStore from "../../data/stores/homeStore"
import HomeSwiper from "../../components/home/swiper";
import HomeCourse from "../../components/home/course";
import RewardItem from "../../components/master/rewardItem";

import ImgPreModal from "../../components/common/imgPre"
import LinkBtn from "../../components/common/link";
import { wxShare } from "../../utils/wx";
import Link from "../../components/common/link"
import mixable from "../../utils/mixable"
import ScrollClick from "../../components/common/scrollClick"

const AllCourse = "AllCourse";
const AllMasters = "AllMasters"

const HomeStore = homeStore;

@navable("/index/home", "home")
@observer
@mixable(ScrollClick)
export default class Home extends React.Component {
    static async getInitialProps({ req }) {

        const store = await HomeStore.recovery()
        return {
            a: 0,
            touchTop: 0,
            touchLeft: 0,
            store: store
        }
    }


    constructor(props) {
        super();

        this.state = {
            a: props.a,
            imgs: [{ src: "https://img.zcool.cn/community/01d65d563877d832f87512f672b15a.jpg@1280w_1l_2o_100sh.webp" },
            { src: "http://dpic.tiankong.com/bx/am/QJ6799330262.jpg?x-oss-process=style/670w" },
            { src: "https://cdn.duitang.com/uploads/item/201510/16/20151016090939_hN4Wm.jpeg" }]
        }

        // 直接 server渲染
        if (props.navRootProps && props.navRootProps.store) {
            HomeStore.recovery(props.navRootProps.store)
        }
        else {
            HomeStore.getIndexPage()
        }
    }

    componentDidMount() {
        wxShare({
            title: "喔喔百家",
            desc: "喔喔百家",
            path: "/",
            imgUrl: ""
        })

    }


    navigateTo(path, params) {
        return (e) => {
            this.props.navigation.navTo(path, params);
        }

    }


    renderAvator(tag) {
        return <div className={"ma_avatar imgBg test-avatar-" + (tag || 0)}>
            <div className="master-confirm-icon ma_master_confirm" />
        </div>
    }

    renderName(item) {
        return <div className="ma_right">
            <div className="fs-bold fs-big theme-bold"><span>{item.nick}<em
                className={"tag tag-" + item.tag}>国画</em></span></div>
            {this.renderIntro(item.intr)}
        </div>
    }

    renderIntro(intr) {
        return <div className="fs-small fs-gray">{intr}</div>
    }

    renderTags() {
        return <div className="home-kinds-box">
            <Link className="home-kind" onClick={this.navigateTo("/course/list", "/disabuse/db_main")}>
                <img src={icon_course} />
                <div>大师课程</div>
            </Link>
            <Link className="home-kind" onClick={this.navigateTo("/disabuse/db_main", "/disabuse/db_main")}>
                <img src={icon_answer} />
                <div>大师解惑</div>
            </Link>
            <Link className="home-kind" onClick={this.navigateTo("/reward/reward", "/reward/reward")}>
                <img src={icon_reward} />
                <div>悬赏问答</div>
            </Link>
            <Link className="home-kind" onClick={this.navigateTo("/master/meetlist", "/disabuse/db_main")}>
                <img src={icon_meeting} />
                <div>约见大师</div>
            </Link>
        </div>
    }

    renderMasters() {
        return <div className="home-master-box">
            <div className="home-master-top home-top-item">
                <div className="home-master-title">推荐大师</div>
                <div className="home-title-all theme-bold canClick"
                    onClick={this.navigateTo("/index/master", "/index/master")}>全部
                </div>
            </div>

            <div className="meet">
                <ul>
                    {
                        HomeStore.masters.map((item, index) => {
                            /*return <div key={"m-" + index} className="theme-radius theme-border theme-background-FC home-master-item">
                                <div className="uheader ms_item_header">
                                    {this.renderAvator(index)}
                                    {this.renderName(item)}
                                    <i className="icon right-arrow-icon"></i>
                                </div>
                            </div>*/
                            return <li key={item.id + "-" + index} className="canClick" style={{ padding: 0 }}
                                onClick={this.toDetail(item)}>
                                <MaterIntr navigation={this.props.navigation}
                                    concern_only_number_able tags_able
                                    user={item}
                                    detail={item}
                                    needType={true}
                                    bodyTxtStyle={{ WebkitLineClamp: 20 }} />
                            </li>
                        })
                    }
                </ul>
            </div>

        </div>
    }

    toDetail(item) {
        return () => {
            this.props.navigation.navTo("/master/detail", {
                data: item
            })
        }

    }

    renderCourse() {

    }

    test = () => {
        this.refs["imgPre"].show();
        requestAnimationFrame(() => {
            this.refs["imgPre"].setIndex(1)
        })

    }

    delImg = (index) => {
        this.state.imgs.splice(index, 1);
        this.setState({
            imgs: [...this.state.imgs]
        })
    }

    renderAD(ad) {
        if (!HomeStore.ad[ad] || HomeStore.ad[ad].length === 0)
            return <div></div>

        return <div className="home-img-box">
            <div className="home-img-line-top"></div>
            {
                HomeStore.ad[ad].map((item, index) => {
                    return <div key={item.id + "-" + index} style={{ position: "relative" }}>
                        <img className="home-img theme-radius canClick" src={item.img}
                            style={index !== 0 ? { marginTop: "0.5rem" } : {}}
                            onClick={() => {
                                this.navigateTo(item.url)()
                            }} />
                        <div className="home-img-text">广告</div>
                    </div>
                })
            }
            <div className="home-img-line-bottom"></div>
        </div>;
    }

    render() {

        return <div className="home">
            <HomeSwiper items={HomeStore.swipers} props={this.props} />

            {this.renderTags()}

            {this.renderMasters()}

            {this.renderAD("MASTER")}

            {
                HomeStore.courses.length > 0 &&
                <div>
                    <div className="home-course-box">
                        <div>
                            <div className="home-course-top home-top-item">
                                <div className="home-course-title">推荐课程</div>
                                <div className="home-title-all theme-bold canClick"
                                    onClick={this.navigateTo("/course/list", "/course/list")}>全部
                                </div>
                            </div>

                            {
                                HomeStore.courses.map((item, index) => {
                                    return <HomeCourse navigation={this.props.navigation} tag={item.discountType}
                                        key={"c-" + index}
                                        src={item.img}
                                        onClick={() => {
                                            this.props.navigation.navTo(item.targetType == "COURSE" ? "/course/group" : "/course/one", {
                                                courseId: item.targetId,
                                                title: item.title
                                            })
                                        }} />
                                })
                            }
                        </div>
                    </div>
                </div>
            }

            {this.renderAD("COURSE")}

            <div>
                <div className="home-answer-box">
                    <div className="home-answer-top home-top-item">
                        <div className="home-answer-title">解惑精选</div>
                        <div className="home-title-all theme-bold canClick"
                            onClick={this.navigateTo("/disabuse/db_main", "/disabuse/db_main")}>全部
                        </div>
                    </div>

                    <div>
                        {
                            HomeStore.answerMasters.map((item, index) => {
                                // return <MasterIntroduceMain className="border-round" tags_able ask_able look_able key={"ans-" + index} detail={item} user={item} />
                                return <div key={item.id + "-" + index} className="canClick" onClick={
                                    this.navigateTo("/disabuse/db_detail", { a: { questionId: item.id } })
                                }>
                                    <DB_MasterItem_Home key={"ans-" + index} detail={item} user={item} stars={5} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

            {this.renderAD("QUESTION")}

            <div>
                <div className="home-reward-box">
                    <div className="home-reward-top home-top-item">
                        <div className="home-reward-title ">悬赏精选</div>
                        <div className="home-title-all theme-bold canClick"
                            onClick={this.navigateTo("/reward/reward", "/reward/reward")}>全部
                        </div>
                    </div>

                    <div>
                        {
                            HomeStore.rewards.map((item, index) => {
                                return <RewardItem user={item.user} detail={item} key={index}
                                    // style={{ marginTop: ".75rem" }}
                                    callBack={this.navigateTo("/reward/rewardDetail", { wantedId: item.id })} />
                            })
                        }
                    </div>
                </div>
            </div>

            {this.renderAD("WANTED")}
        </div>
    }

}