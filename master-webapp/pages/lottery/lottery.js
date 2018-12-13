import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"

import img_back from "../../static/images/lottery/lottery_item_back.png"
import img_off from "../../static/images/lottery/lottery_off.png"
import img_on_1 from "../../static/images/lottery/lottery_on_1.png"
import img_on_2 from "../../static/images/lottery/lottery_on_2.png"
import img_cash_1 from "../../static/images/lottery/lottery_cash_1.png"
import img_cash_2 from "../../static/images/lottery/lottery_cash_2.png"
import img_cash_3 from "../../static/images/lottery/lottery_cash_3.png"
import img_cash_4 from "../../static/images/lottery/lottery_cash_4.png"
import img_cash_5 from "../../static/images/lottery/lottery_cash_5.png"
import img_cash_6 from "../../static/images/lottery/lottery_cash_6.png"
import img_cash_7 from "../../static/images/lottery/lottery_cash_7.png"
import img_cash_8 from "../../static/images/lottery/lottery_cash_8.png"
import lotteryStore from "../../data/stores/lotteryStore";


@navable("/lottery/lottery")
@observer
export default class Lottery extends React.Component {

    constructor(props) {
        super();

        this.state = {
            cash: [
                // { amount: 0.01, img: img_cash_1 },
                // { amount: 0.5, img: img_cash_2 },
                // { amount: 1, img: img_cash_3 },
                // { amount: 5, img: img_cash_4 },
                // { amount: 0.02, img: img_cash_5 },
                // { amount: 50, img: img_cash_6 },
                // { img: img_cash_7 },
                // { img: img_cash_8 }
            ],
            buttonType: 1,
            buttonImg: img_off,
            buttonCanClick: false
        }

        lotteryStore.getLottery((store) => {
            this.setState({
                cash: store.lotteries,
                buttonCanClick: store.remainTimes > 0 ? true : false,
                buttonImg: store.remainTimes > 0 ? img_on_1 : img_off
            })
        })
    }

    componentDidMount() {
    }

    open(e, index, type, amount) {
        const cash = this.randomsort(this.state.cash, index, type, amount)
        if (cash[index]["type"] !== "CASH")
            this.changePosition(cash, index)
        this.setState({ cash })
        if (e.target) {
            e.target.previousElementSibling.classList.remove("ani-front-2")
            e.target.classList.remove("ani-back-2")
            e.target.previousElementSibling.classList.add("ani-front-open")
            e.target.classList.add("ani-back-open")
        } else {
            e.previousElementSibling.classList.remove("ani-front-2")
            e.classList.remove("ani-back-2")
            e.previousElementSibling.classList.add("ani-front-open")
            e.classList.add("ani-back-open")
        }

        setTimeout(() => {
            const dom = document.getElementsByClassName("animation")[0]
            for (let i = 0; i < 8; i++) {
                if (i !== index) {
                    dom.children[i].children[0].className += " ani-front-open";
                    dom.children[i].children[1].className += " ani-back-open";
                    dom.children[i].children[0].className += " lottery_modal";
                }
            }
        }, 1200)
    }

    randomsort(array, index, type, amount) {
        let _index;
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            if (type === array[i].type && amount === array[i].amount)
                _index = i
        }
        if (_index !== index) {
            const temp = array[index]
            array[index] = array[_index]
            array[_index] = temp
        }
        return array;
    }

    changePosition(arr, index) {
        let needChange = true
        for (let i = 0; i < 8; i++) {
            if (arr[i]["type"] === "CASH" && needChange) {
                const a = arr[i]
                arr[i] = arr[index]
                arr[index] = a
                needChange = false
            }
        }
    }

    randomOpen(type, amount) {
        const index = parseInt(Math.random() * 8)
        this.open(document.getElementsByClassName("click-back")[index], parseInt(index), type, amount)
    }


    render() {
        return (
            <div className="lottery">
                <div className="lottery_background"></div>
                <div className="lottery_title"></div>
                <div className="lottery_border_box">
                    <div className="lottery_border">
                        <div className="animation">
                            {
                                this.state.cash.map((item, index) => {
                                    return <div key={"item-" + index} className={`item item-${index + 1}`}
                                        style={index === 0 ? { zIndex: 9 } : {}}>
                                        <div className="front">
                                            <img src={item.img} style={{ width: "100%" }} />
                                            {
                                                item.type === "CASH" && <div className="amount">
                                                    <div>¥</div>
                                                    <div>{item.amount}</div>
                                                </div>
                                            }
                                        </div>
                                        <img className="back click-back" src={img_back} onClick={(e) => {
                                            if (this.state.buttonCanClick === false)
                                                return
                                            this.setState({ buttonCanClick: false })
                                            const target = e.target
                                            lotteryStore.postLottery((result) => {
                                                this.setState({ buttonType: false, buttonImg: img_off })
                                                this.open(target, index, result.type, result.amount)
                                            })
                                        }}></img>
                                    </div>
                                })
                            }
                            <div className="item-center-box" onClick={() => {
                                if (this.state.buttonCanClick === false)
                                    return

                                switch (this.state.buttonType) {
                                    case false:
                                        return;
                                    case 1:
                                        this.setState({ buttonType: 2, buttonImg: img_on_2 })
                                        setTimeout(() => {
                                            this.setState({ buttonCanClick: true })
                                        }, 3800)
                                        break;
                                    case 2:
                                        lotteryStore.postLottery((result) => {
                                            this.setState({ buttonType: false, buttonImg: img_off })
                                            this.randomOpen(result.type, result.amount)
                                        })
                                        break;
                                }
                                this.setState({ buttonCanClick: false })

                                // 发牌
                                const doms = document.getElementsByClassName("animation")[0].children
                                for (let i = 0; i < doms.length; i++) {
                                    if (i >= 8) break;
                                    doms[i].children[0].classList.add("ani-front-1")
                                    doms[i].children[1].classList.add("ani-back-1")
                                }
                                setTimeout(() => {
                                    let index = 0;
                                    const ani = setInterval(() => {
                                        doms[index].children[0].classList.remove("ani-front-1")
                                        doms[index].children[1].classList.remove("ani-back-1")
                                        doms[index].children[0].classList.add("ani-front-2")
                                        doms[index].children[1].classList.add("ani-back-2")
                                        index++;
                                        if (index === 8)
                                            clearInterval(ani)
                                    }, 100)
                                }, 1000)
                            }}>
                                <img className="item-center lottery_modal" src={this.state.buttonImg} />
                                {this.state.buttonType === 2 && <div
                                    className="item-center-times">{lotteryStore.remainTimes}/{lotteryStore.totalTimes}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}