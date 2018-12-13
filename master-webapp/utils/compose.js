/**
* 中间件 合并
*  <>-----}|------------------------------->
* 
*/

// 异步的方式
export default (middles)=>{
	return function (){
		return dispatch(0,arguments.length?Array.prototype.slice.call(arguments,0):[]);
		function dispatch(n,args){
			const fn=middles[n];
			if(!fn){
				return Promise.resolve();
			}
  
			return Promise.resolve(fn.apply(null,[...args,()=>{
				return dispatch(n+1,args);
			}]))
		}
	}
}


// 同步的方式
export const join=middles=>{
	return function(){
		const args=arguments;
		console.log(args)
		middles.filter(Boolean).forEach(item=>{
			item.apply(null,args)
		})
	}
}
