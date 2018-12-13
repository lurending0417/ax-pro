import CityPicker from "../../components/common/cityPicker"

export default class AddressPicker extends React.PureComponent{
    static navProps=()=>{
    	return {
    		title:"地址选择"
    	}
    }
    constructor(props){
    	super()
    	const dv=(props.defaultValue||"").split("  ")
    	this.state={
    		address:dv[0],
    		detail:dv[1]
    	}
    }
    render(){
    	return <div  className="common-picker">
    		<div className="list-block" style={{backgroundColor: "white",marginTop:0}}>
    			<div className="item-content">
    				<div className="item-inner">
    					<div className="item-input" style={{paddingLeft:".25rem"}}>
    						<CityPicker onChange={this.onChange("address")} ref="picker" defaultValue={this.state.address} />
    					</div>
    				</div>
    			</div>
    			<div className="item-content">
    				<div className="item-inner">
    					<div className="item-input">
    						<textarea onChange={this.onChange("detail")} placeholder={"地址详情"} value={this.state.detail}></textarea>
    					</div>
    				</div>
    			</div>
    		</div>
    		<div className="content-block">
    			<div className="row">
    				<div className="col-100">
    					<a onClick={this.submit}  className="button button-big button-fill button-success">保存</a>
    				</div>
    			</div>
    		</div>
    	</div>
    }

    onChange=(type)=>{
    	return (e)=>{
    		this.setState({
    			[type]:e.target.value
    		})
    	}
    }
    
    submit=()=>{
    	if(this.props.onChoose){
    		this.props.onChoose(this.state.address+" "+this.state.detail)
    	}
    	this.props.navigation.backTo();
    }

}