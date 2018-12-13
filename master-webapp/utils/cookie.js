import {EXPIRE,STOARGEKEY} from "../common/constant"

const cookieHelper={
	getRaw:(rawCookie)=>{
		if(process.browser){
			return rawCookie||document.cookie;
		}
		return rawCookie||""
	},
	get:(name,rawCookie)=> {
		let arr
		const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
		if (arr = cookieHelper.getRaw(rawCookie).match(reg)) {
			let v =decodeURIComponent((arr[2]))
			try{
				v=JSON.parse(v);
				if(v&&v.length==3&&v[0]===STOARGEKEY){
					return v[1]
				}
			}
			catch(e){

			}
			return v;
		} else {
			return null
		}
	},
	set:(name, value, expire)=> {
		if (!process.browser) {
			return;
		}
		var cookie = name + "=" + (encodeURIComponent(JSON.stringify([STOARGEKEY,value,0]))) + "; max-age="+(expire||EXPIRE)+"; path=/";
		document.cookie = cookie;
	},
	delete:(name)=> {
		if (!process.browser) {
			return;
		}
		document.cookie = name + "=; max-age=0; path=/"
	}
}

export default cookieHelper