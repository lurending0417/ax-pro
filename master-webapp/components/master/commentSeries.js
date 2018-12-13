// 评论组

import _map from "lodash/map"
import Comment from "./comment"



export default class CommentSeries extends Comment{
    
	renderMain(children){
		return <div className="border-round umain ms_item">
			{children}
		</div>
	}
    
	renderFooter(){
		return <div  key="footer" className="ufooter">
			{
				(0,()=>{
					return _map(new Array(10),(item,index)=>{
						return <Comment className="border-round" key={"com"+index} />
					})
				})()
			}
		</div>
		
	}
}