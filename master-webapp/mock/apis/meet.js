

import Mock, { Random } from "mockjs"
import moment from "moment"
import { API_GET_MEETS, API_MEET_DETAIL, API_MEET_UPLOAD, API_MASTER_LIST } from "../../common/api"
import { arr, obj, makArr } from "../output"



export default {
	// [API_GET_MEETS]: {
	// 	"rows": [
	// 		{
	// 			"id": "d04065edd34047cbb78bf4f3ab865526",
	// 			"master": {
	// 				"appointCost": 0.02,
	// 				"appointEnabled": true,
	// 				"avatar": "https://f1.9999ax.com/user/avatar/201809/a7d94df75b514a1b9959e3ed82b3cb9c",
	// 				"categoryId": "8be857c834b8481f93b9e9ff5c30298f",
	// 				"courseEnabled": true,
	// 				"follow": true,
	// 				"followTimes": 17,
	// 				"id": "9837c2719066477390edeb73f82ba3ea",
	// 				"intro": "扫地僧",
	// 				"master": true,
	// 				"nick": "肖师傅",
	// 				"questionCost": 1.00,
	// 				"questionEnabled": true,
	// 				"questionTimes": 2,
	// 				"score": 5.0,
	// 				"tags": []
	// 			},
	// 			"startTime": 0,
	// 			"status": "TO_CONFIRM",
	// 			"user": {
	// 				"avatar": "https://f1.9999ax.com/user/avatar/201809/ae6da066c11849fca112970362083020",
	// 				"id": "5e46c99eee444e019b09acaec314ec05",
	// 				"master": false,
	// 				"nick": "云很近",
	// 				"vip": false
	// 			}
	// 		}
	// 	],
	// 	"status": 200,
	// 	"total": 1
	// }
	// [API_MASTER_LIST]:Object.assign(arr(null),
	// 	makArr(10,()=>{
	// 		return {
	// 			name:Random.name(),
	// 			meetTime:Date.now(),
	// 			address:Random.city()+" "+Random.county(),
	// 			judegeComment:Random.sentence(10,50),
	// 			avator:Random.image("250",Random.color(),"master"),
	// 			id:Random.integer(1,1000),
	// 			prizeCount:Random.integer(1,100),
	// 			commentCount:Random.integer(100,1000),
	//
	//      //
	//      avatar: Random.image("250",Random.color(),"master"),
	//      categoryId: 1,
	//      followTimes: 99,
	//      intro: "闫芳，河北省第五届武术协会副主席，石家庄第十届政协委员，因网上流传的一段拍摄于2012年6月24日视频为人所知，被称为“最强太极推手”，掌风能击倒人。",
	//      nick: "",
	//      questionCost: 199,
	//      questionTimes: 99,
	//      score: 5.0,
	//      tags: "",
	// 		}
	// 	})
	// ),
	// [API_MEET_DETAIL]:obj({
	// 	name:Random.name(),
	// 	meetTime:Date.now(),
	// 	address:Random.city()+" "+Random.county(),
	// 	judegeComment:Random.sentence(10,50),
	// 	avator:Random.image("250",Random.color(),"master"),
	// 	id:Random.integer(),
	// 	prizeCount:Random.integer(1,100),
	// 	commentCount:Random.integer(100,1000),
	// 	comments:makArr(10,()=>{
	// 		return {
	// 			name:Random.name(true),
	// 			avator:Random.image("250",Random.color(),"user"),
	// 			replay:Random.name(true),
	// 			commentTime:moment().add(Random.integer(-6,-1),"days")._d.getTime(),
	// 			prizeCount:Random.integer(1,100),
	// 			commentCount:Random.integer(100,1000)
	// 		}
	// 	})
	// })
	// [API_MEET_UPLOAD+"-post"]:obj({
	// 	id:1
	// })
}