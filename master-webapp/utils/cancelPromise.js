const CancelEerr = "CANCEL"
 
class CancelPromise {
	constructor(fun,/* 后续的任务都取消 */isDeep = false) {
		let pfun=fun;
		if(typeof fun!="function"){
			pfun=s=>s(fun);
		}
		this.prom = new Promise(pfun)
 
		this._cancel = false;
		this._beforeCacnel = [];
		const cacnelJudge = (rs) => {
			if (this._cancel) {
				return Promise.reject(CancelEerr);
			}
			return Promise.resolve(rs);
		}
 
		this.prom = this.prom.then(cacnelJudge);
 
		["then", "catch", "final"].forEach(method => {
			this[method] = fun => {
				if (isDeep) {
					this.prom = this.prom.then(cacnelJudge);
				}
				this.prom = this.prom[method](fun)
				return this;
			}
		});
	}
 
	cancel() {
		this._beforeCacnel.forEach(item => item());
		this._cancel = true;
 
		return this;
	}
 
 
	// 可能需要在取消前绑定一些事情
	beforeCancel(fun) {
		this._beforeCacnel.push(fun);
 
		return this;
	}
}

CancelPromise.resolve=(p)=>{
	return new CancelPromise()
}
 
export default CancelPromise
 
export {
	CancelEerr
}
