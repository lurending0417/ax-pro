/**
* 中间件 合并
*  <>-----}|------------------------------->
* 
*/

// 异步的方式  koa
export default (middles) => {
	return function () {
		return dispatch(0, arguments.length ? Array.prototype.slice.call(arguments, 0) : []);
		function dispatch(n, args) {
			const fn = middles[n];
			if (!fn) {
				return Promise.resolve();
			}

			return Promise.resolve(fn.apply(null, [...args, () => {
				return dispatch(n + 1, args);
			}]))
		}
	}
}


// 同步的方式  
/** redux
 * a1=next=>{console.log('a1');next()}
 * a2=next=>{console.log('a2');next()}
 * a3=next=>{console.log('a3');next()}
 * join(a1,a2,a3) 
 */
export const join = (...middles) => {
	middles = middles.map(middle => (...ars) => middle(...ars))

	if (middles.length < 1) {
		return () => { };
	}
	if (middles.length == 1) {
		return middles[0]
	}

	return middles.reduce((a1, a2) => (...ars) => a1(a2(...ars)))
}

export const orride = (proto, fnName, fn) => {
	let last = proto[fnName];
	proto[fnName] = function (...args) {
		last && last.apply(this, args)

		fn.apply(this, args)
	}
}
