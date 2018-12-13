import {Random} from "mockjs"

import {APILOGIN,APIREGISTER} from "../../common/api"
import {obj,arr} from "../output"


export default {
	[APILOGIN]:obj({
		nickName:Random.name(),
		gender:Random.boolean(),
		head:Random.image("200*200","hello"),
		token:Random.hex()
	}),
	[APIREGISTER]:obj({})
}