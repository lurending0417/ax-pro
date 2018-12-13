
let id=0
const genId=()=>{
	return Date.now()+"-"+(id++)
}


export default (BaseComponent)=>{
	const render=BaseComponent.prototype.render;
        
	BaseComponent.prototype.render=function(){
		const me=this;
		me._pageId=me._pageId||genId();
		return <div className="page" id={me._pageId}>
			 {render.call(me)}
		</div>
	}
        
	return BaseComponent;
}