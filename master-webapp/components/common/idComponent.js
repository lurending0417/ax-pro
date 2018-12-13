/**
* ssr 渲染 动态id 可能会不一样
*  <>-----}|------------------------------->
*
*/

import React from "react"

let _id=0;


export default {
	componentDidMount(){
		// console.log("id")
		process.nextTick(()=>{
			this.setState({
				_id_:Date.now()+"-"+(_id++)
			})
		})
	},

	componentDidUpdate(){
		if(this.state._id_&&!this.__inited){
			this.__inited=true;
			this.initById&&this.initById();
		}
	},

	getId(){
		return this.state._id_;
	}
}