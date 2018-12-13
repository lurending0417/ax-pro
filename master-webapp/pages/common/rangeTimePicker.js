import TimePicker from "../../components/common/timePicker"
export default class TimeRangePicker extends React.PureComponent{
    static navProps=()=>{
    	return {
    		title:"时间段选择"
    	}
    }
    constructor(props){
    	super()
    	const v=(props.defaultValue||"").split("--")
    	this.state={
    		v0:v[0],
    		v1:v[1]
    	}
    }
    render(){
    	return <div className="common-picker">
    		<div className="list-block" style={{backgroundColor: "white",marginTop:0}}>
    			<div className="item-content">
    				<div className="item-inner">
    					<div className="item-input">
    						<TimePicker ref="minTime" onChange={this.onChange(0)} defaultValue={this.state.v0} />
    					</div>
    				</div>
    			</div>
    			<div className="item-content">
    				<div className="item-inner">
    					<div className="item-input">
    						<TimePicker ref="maxTime" onChange={this.onChange(1)}   defaultValue={this.state.v1} />
    					</div>
    				</div>
    			</div>
    		</div>
    		<p style={{marginLeft:"1rem"}}>{"时间段选择"}</p>
    		<div className="content-block">
    			<div className="row">
    				<div className="col-100">
    					<a onClick={this.submit} className="button button-big button-fill button-success">保存</a>
    				</div>
    			</div>
    		</div>
    	</div>
    }

    onChange=(n)=>{
    	return e=>{
    		process.nextTick(()=>{
    			if(n==0){
    				this.refs["maxTime"].getJq().data("datetimePicker_update")({
    					minValue:e.target.value
    				});
    			}
    			else{
    				this.refs["minTime"].getJq().data("datetimePicker_update")({
    					maxValue:e.target.value
    				});
    			}
    		})
    		
			
    		this.setState({
    			["v"+n]:e.target.value
    		})
    	}
    }
    
    submit=()=>{
    	if(this.state.v1>this.state.v0){
    		console.log(this.state)
    		this.props.onChoose&&this.props.onChoose(this.state.v0+"--"+this.state.v1)
    		this.props.navigation.backTo();
    	}
    }

}