/**
* 展示 通用的组建
*  <>-----}|------------------------------->
* 
*/
import {plugins} from "../../components/common/plugin"
import navable from "../../components/common/nav/navable";

// 

@navable("/common/list")
class PluginList extends React.PureComponent{
	constructor(){
		super()
		this.state={
			keyword:""
		}
	}
	static navProps(){
		return {
			title:"组件列表"
		}
	}
	render(){
		const r=new RegExp(this.state.keyword)
		return <div className="list-block">
			<ul>
				<li>
					<div className="searchbar">
						<a className="searchbar-cancel">Cancel</a>
						<div className="search-input">
							<label className="icon icon-search" ></label>
							<input onChange={this.search} type="search"  placeholder="Input Query..." />
						</div>
					</div>
				</li>
				{
					plugins.filter(item=>r.test(item.name)||r.test(item.desc)).map((item,index)=>{
						return <li key={"li"+index}>
							<a className="item-content item-link" onClick={this.onClick(item)}>
								<h3>{item.name}</h3>
								<p className="item-inner">{item.desc}</p>
							</a>
						</li>
					})
				}
			</ul>
		</div>
	}
    
    search=e=>{
    	this.setState({
    		keyword:e.target.value
    	})
    }
    
    onClick=(item)=>{
    	const {name,desc,comp,...others}=item;
    	return ()=>{
    		this.props.navigation.navTo("/common/listdetail",{
    			comp:item.comp,
    			...others
    		})
    	}
    }
}

export default PluginList;
