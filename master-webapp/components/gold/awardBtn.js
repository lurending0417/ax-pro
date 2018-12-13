import GiftCom from "../common/giftCom";
import PropTypes from  "prop-types"

// 


class AwardBtn extends React.PureComponent{
	constructor(){
		super()
		this.state={
			startAnimate: ""
		}
	}
    
    static propTypes={
    	toUserId:PropTypes.string.isRequired
    }

    render(){
    	return <div style={{zIndex:1000}} className="gift-icon gift-position" onClick={this.bindAnimate}>
    		<GiftCom toUserId={this.props.toUserId} startAnimate={this.state.startAnimate} changeStartAnimate={this.changeStartAnimate} />
    	</div>
    	//{/*GiftCom高度为214px(10.7rem),当这部分隐藏时，有15px（0.75rem）漏在外面，计算得出bottom应该为：-（10.7-0.75）=9.95rem*/}
    }
    
    changeStartAnimate=()=>{
    	this.setState({startAnimate: "down"})
    }
    
    bindAnimate=()=>{
    	const {startAnimate}=this.state
    	this.setState({startAnimate:(!startAnimate||startAnimate === "down")?"up":"down"})
    	// if (!startAnimate||startAnimate === "down") { // === ''
    	// 	this.setState({startAnimate: "up"})
    	// } else if (this.state.startAnimate === "up") {
    	// 	this.setState({startAnimate: "down"})
    	// } else if (this.state.startAnimate === "down") {
    	// 	this.setState({startAnimate: "up"})
    	// }
    }
}

export default AwardBtn;