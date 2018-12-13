import Mock, { Random } from "mockjs"
import moment from "moment"
import { arr, obj, makArr } from "../output"
import { API_WANTED, API_WANTED_DETAIL } from "../../common/api";

export default {
  // [API_WANTED]: Object.assign(arr(null),
  //   makArr(10, () => {
  //     return {
  //       "anon": false,
  //       "attaches": [{
  //         "path": "https://f1.9999ax.com/attach/wanted/20180913/1536832020990/d5ff069a5f9c460596a0c863f4aec4f4"
  //       }, {
  //         "path": "https://f1.9999ax.com/attach/wanted/20180913/1536832021259/602f2b5945d9408c8d7b875eba529dcd"
  //       }],
  //       "bounty": 0.01,
  //       "closed": false,
  //       "content": "哈哈哈哈哈",
  //       "createTime": 169832020824,
  //       "closeTime": 169832020824,
  //       "id": "415794fd3e1c4ee4922223df2de74bde",
  //       "reply": {
  //         "agree": true,
  //         "agreeTimes": 1,
  //         "anon": false,
  //         "attaches": [{
  //           "path": "https://f1.9999ax.com/attach/wanted_reply/20180917/1537164896218/1c4e84ca5dcc4a59980e3f1ff46af305"
  //         }],
  //         "comments": [{
  //           "anon": false,
  //           "attaches": [],
  //           "content": "叼毛",
  //           "createTime": 1537264597934,
  //           "id": "9cc60206bbc14d7c827220e494f8c3c1",
  //           "user": {
  //             "avatar": "https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //             "id": "ac2aa2afdef040f2bb7d1786c9f81aca",
  //             "master": false,
  //             "nick": "左手边的天空",
  //             "vip": false
  //           }
  //         }],
  //         "content": "你这图片才吊",
  //         "id": "0139e49db5fd44938b7261d659d21536",
  //         "user": {
  //           "avatar": "https://f1.9999ax.com/user/avatar/201809/a0509cbd47c94683ad44df5cc53a9e47",
  //           "id": "baeb5e21937f4b708183117414067ff0",
  //           "master": false,
  //           "nick": "fenice",
  //           "vip": false
  //         }
  //       },
  //       "replyTimes": 33,
  //       "user": {
  //         "avatar": "https://f1.9999ax.com/user/avatar/201809/ae6da066c11849fca112970362083020",
  //         "id": "5e46c99eee444e019b09acaec314ec05",
  //         "master": false,
  //         "nick": "云很近",
  //         "vip": false
  //       }
  //     }
  //   })
  // ),
  // [API_WANTED_DETAIL]: obj({
  //   "anon":false,
  //   "attaches":[],
  //   "bounty":0.01,
  //   "closed":false,
  //   "content":"为什么我的悬赏是空的？",
  //   "createTime":1537516783208,
  //   "favorite":true,
  //   "id":"863232f5fd8249a480e30f9779e16db0",
  //   "replies":[
  //     {
  //       "agree":true,
  //       "agreeTimes":11,
  //       "anon":false,
  //       "attaches":[],
  //       "comments":[
  //         {
  //           "anon":false,
  //           "attaches":[],
  //           "content":"1分钱还想要啥？",
  //           "createTime":1537517039698,
  //           "id":"3dfdcbedfbcf4623845c28876c771c36",
  //           "user":{
  //             "avatar":"https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //             "id":"ac2aa2afdef040f2bb7d1786c9f81aca",
  //             "master":false,
  //             "nick":"左手边的天空",
  //             "vip":false
  //           }
  //         }
  //       ],
  //       "content":"无语了",
  //       "id":"cc8857448f6b4b62a6348e0e6c82c23a",
  //       "user":{
  //         "avatar":"https://f1.9999ax.com/user/avatar/201809/fcc54fb1412b41c3be871f422493b59e",
  //         "id":"baeb5e21937f4b708183117414067ff0",
  //         "master":false,
  //         "nick":"秘密",
  //         "vip":false
  //       }
  //     },
  //     {
  //       "agree":false,
  //       "agreeTimes":0,
  //       "anon":false,
  //       "attaches":[],
  //       "comments":[
  //         {
  //           "anon":false,
  //           "attaches":[],
  //           "content":"，哈",
  //           "createTime":1537846663277,
  //           "id":"f8dd32c6da924dbfae1b431dedc3dccb",
  //           "user":{
  //             "avatar":"https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //             "id":"ac2aa2afdef040f2bb7d1786c9f81aca",
  //             "master":false,
  //             "nick":"左手边的天空",
  //             "vip":false
  //           }
  //         }
  //       ],
  //       "content":"你说呢",
  //       "id":"5b9128de822645a1bceccfade3e5797b",
  //       "user":{
  //         "avatar":"https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //         "id":"ac2aa2afdef040f2bb7d1786c9f81aca",
  //         "master":false,
  //         "nick":"左手边的天空",
  //         "vip":false
  //       }
  //     },
  //     {
  //       "agree":false,
  //       "agreeTimes":0,
  //       "anon":false,
  //       "attaches":[],
  //       "comments":[],
  //       "content":"傻孩子",
  //       "id":"e586d35387994e49a2d235f41e7cc8db",
  //       "user":{
  //         "avatar":"https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //         "id":"ac2aa2afdef040f2bb7d1786c9f81aca",
  //         "master":false,
  //         "nick":"左手边的天空",
  //         "vip":false
  //       }
  //     },
  //     {
  //       "agree":false,
  //       "agreeTimes":0,
  //       "anon":false,
  //       "attaches":[],
  //       "comments":[],
  //       "content":"嘻嘻嘻嘻嘻",
  //       "id":"37b451c890dd457da8b08c1933038322",
  //       "user":{
  //         "avatar":"https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //         "id":"ac2aa2afdef040f2bb7d1786c9f81aca",
  //         "master":false,
  //         "nick":"左手边的天空",
  //         "vip":false
  //       }
  //     },
  //     {
  //       "agree":false,
  //       "agreeTimes":0,
  //       "anon":false,
  //       "attaches":[],
  //       "comments":[],
  //       "content":"爱与和平",
  //       "id":"4f9376b7330844ac81d33de72060a509",
  //       "user":{
  //         "avatar":"https://f1.9999ax.com/user/avatar/201809/280414617c2e4fb18679317b770f257f",
  //         "id":"ac2aa2afdef040f2bb7d1786c9f81aca",
  //         "master":false,
  //         "nick":"左手边的天空",
  //         "vip":false
  //       }
  //     },
  //     {
  //       "agree":false,
  //       "agreeTimes":0,
  //       "anon":true,
  //       "attaches":[],
  //       "comments":[],
  //       "content":"悄悄说点什么",
  //       "id":"6f27b87c7e5d45d18184d51ca53e3f1a"
  //     }
  //   ],
  //   "replyTimes":6,
  //   "user":{
  //     "avatar":"https://f1.9999ax.com/user/avatar/201809/fcc54fb1412b41c3be871f422493b59e",
  //     "id":"baeb5e21937f4b708183117414067ff0",
  //     "master":false,
  //     "nick":"秘密",
  //     "vip":false
  //   }
  // }),
}