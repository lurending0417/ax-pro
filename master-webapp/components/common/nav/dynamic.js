import dynamic from "next/dynamic"

export default (p,o)=>{
	const dynCom=dynamic(p,o);
	const rawRender=dynCom.prototype.render;

	dynCom.prototype.render=function(){
		// 检测 异步组建是否加载
		if(this.state.AsyncComponent&&!this.__loaded){
			this.__loaded=true;
			if(this.props.onAsyncLoaded){
				this.props.onAsyncLoaded(this.state.AsyncComponent)
			}
		}
		return rawRender.call(this);
	}
    
	return dynCom
}