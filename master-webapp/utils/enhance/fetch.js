import CancelPromise from "../cancelPromise";
import API from "../../api/api"
export default (component)=>{

	component.prototype._fetch=function(opts){
		this.ajax=this.ajax||{};
		this.req=this.req||0;

		const key=this.req++;
		this.ajax[key]=CancelPromise.resolve(API.request(opts)).then(()=>{
			delete this.ajax[key]
		}).catch(()=>{
			delete this.ajax[key]
		})
		return this.ajax[key];
	}

	const unMount=component.prototype.componentWillUnmount
	component.prototype.componentWillUnmount=function(){
		Object.keys(this.ajax).forEach(key=>{
			this.ajax[key].cancel();
		})
		unMount.call(this);
	}

	component._fetch=(opts)=>{
		return API.request(opts)
	}

	return component;
}