import navable from "../../components/common/nav/navable";

import {fireDelay,on} from "../../utils/notify"

// 

navable("/common/listdetail")
class CommonListDetail extends React.PureComponent{
	constructor(){
		super()
		this.state={}
	}
	static navProps(){
		return {
			title:"组件详情"
		}
	}

	componentDidMount(){
		this.props.componentDidMount&&this.props.componentDidMount(this.ref)
	}

	renderFormField(key,v){
		if(key in this.state&&this.state[key]!==null){
			v=this.state[key]
		}
		return <li className="item-content">
				<div className="item-inner">
					<div className="item-title label">{key}</div>
					<div className="item-after">
						<input onChange={this.onChange(key)} value={v}  className="fs-gray" />
					</div>
				</div>
			</li>
	}

	onChange=f=>e=>{
		this.setState({
			[f]:e.target.value
		})
		fireDelay(f,10000);
	}

	componentWillUnmount(){
		this.binds.forEach(item=>item())
	}

	render(){
		let {comp,...others}=this.props
		
		if(comp.defaultProps){
			others=Object.assign({},comp.defaultProps,others,this.state)
		}
		if(!comp){
			comp=<p>未发现组建</p>
		}
		let rawPs=comp.propTypes||{};
		rawPs=Object.assign({},rawPs,comp.defaultProps)
		
		if(!this.inited){
			this.inited=true;
			this.binds=[]
			Object.keys(rawPs).forEach(key=>{
				this.binds.push(on(key,()=>{
					this.setState({[key]:null})
				}))
			})
		}

		const Comp=comp;
		return <div className="full">
			<div className="list-block">
				<ul>
					{
						Object.keys(rawPs).map(key=>{
							return this.renderFormField(key,rawPs[key])
						})
					}
				</ul>
			</div>
			<div style={{
				position: "relative",
				width: "100%",
				height: "100%",
				overflow:"hidden"
			}}>
				<Comp ref={ref=>this.ref=ref} {...others} />
			</div>
			
		</div>
	}
}

export default CommonListDetail;