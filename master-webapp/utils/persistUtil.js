import { create } from "mobx-persist";
import Storage from "./storage"

let hydrate = null,
	opts = {
		// server使用cookie 浏览器使用 localStorage
		storage:new Storage({
			cookieList:["UserStore","NavStore"]
		}),
		jsonify:false
	};

const lastGet=opts.storage.getItem
opts.storage.getItem=async (key,rawCookie)=>{
	const v=await lastGet.call(opts.storage,key,rawCookie);
	if(v===null){
		return {}
	}
	return v;
}

function createHydrate() {
	if (hydrate === null)
		hydrate = create(opts);
}

/**
 * 持久化数据
 * @param key
 * @param value 传入需要持久化的对象
 */
function put(key, value) {
	// server 端 不管
	if (hydrate === null)
		createHydrate();
	hydrate(key, value);
}

export default {
	createHydrate,
	put
}