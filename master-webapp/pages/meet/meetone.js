/**
* 具体某人 约见详情
*  <>-----}|------------------------------->
* 
*/

import navable from "../../components/common/nav/navable"

import UserIntr from "../../components/master/introduce"
import MasterIntr from "../../components/master/main"
import CommentIntr from "../../components/master/comment"
import CommentSeries from "../../components/master/commentSeries"

@navable("/meet/meetoone")
export default class MeetEdit extends React.PureComponent{

	static navProps(props){
		return {
			title:"约见"+(props.name&&props.name.substr(1)||"")+"大师"
		}
	}

	render(){
		return <div>
			<MasterIntr stars={6} concern_able tags_able comment_able />
			<CommentIntr />
			<CommentSeries />
		</div>
	}
}

