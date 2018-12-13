// time text
import renderUtil from "../../utils/renderUtil"
import timeMix from "react-timer-mixin"
import mixable from "../../utils/mixable"

@mixable(timeMix)
class TimeText extends React.PureComponent{
	static defaultProps={
		format:"{time}",
		aimTime:null,
		step:1000
	}
	constructor(props){
    	super()
    	this.state=this.getState(props);
	}
	componentDidMount(){
    	this.start();
	}

	getSnapshotBeforeUpdate(prevProps){
    	if(this.props.aimTime!=prevProps.aimTime){
    		process.nextTick(this.start)
		}
		return null;
	}

    start=()=>{
    	if(this._ts){
    		this.clearInterval(this._ts)
    	}
        
    	const {step}=this.props;

    	this._ts=this.setInterval(()=>{
    		this.setState(this.getState(this.props))
    	},step)
    }

    getState=(props)=>{
    	const {aimTime,format,onFinished=()=>{}}=props;
    	const now=Date.now();
    	let v="0秒";
    	if(aimTime<now){
    		v="0秒";
    		onFinished();
    		this.clearInterval(this._ts)
    	}
    	else v=renderUtil.renderTimeSpan(aimTime,now)
        
    	if(v=="01分钟")v="60秒"
        
    	return {
    		label:format.replace(/\{time\}/g,v)
    	}
    }

    render(){
    	const {style={},className="",onClick=null}=this.props
    	return <span style={style} className={className} onClick={onClick}>{this.state.label}</span>
    }
}



export default TimeText;