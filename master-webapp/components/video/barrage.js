import { observer } from "mobx-react";
import BarStore from "./barrageStore"


const barStore = new BarStore();
// 

@observer
class BarrageList extends React.Component {
    constructor() {
        super()
    }
    render() {
        return <div style={{
            position: "abolute",
            let: 0,
            top: 0,
            width: "100%",
            height: 240
        }}>
            {
                barStore.showMsgs.map(item => {
                    return <span key={item.id} style={{
                        position: "absolute",
                        animationDuration: `${item.animDuration || 5}s`,
                        right: "-100px",
                        top: `${item.line * 20}%`
                    }} className={`bar-line-${item.line} animated slideOutLeft`}>{item.msg}</span>
                })
            }
        </div>
    }
}

export default BarrageList;