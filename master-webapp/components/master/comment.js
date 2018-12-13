/**
* 评论的内容
*  <>-----}|------------------------------->
* 
*/

import Introduce from "./introduce"

export default class CommentIntroduce extends Introduce {
	renderHeaderPlugin(){
		return <div className="fs-small fs-gray" style={{
			float: "right",
			flex: "1",
			textAlign: "right",
			paddingRight: ".75rem",
			alignSelf: "stretch",
			paddingTop: ".25rem"
		}}>2天前</div>
	}
    

	renderBody(){
		return <div key="body" className="ubody ms_item_content fs-small">
			{this.renderVoice()}
			{this.renderBodyText()}
		</div>
	}
    
	renderVoice(){
		return <div>
			<a className="button button-round">我是声音</a>
		</div>
	}
}
