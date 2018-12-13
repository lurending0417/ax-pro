import reactMix from "react-mixin"

export default function(mix){
	const args=Array.prototype.slice.call(arguments,0);
	return compClass=>{
		if(args.length==1){
			reactMix(compClass.prototype,mix)
		}
		else {
			args.forEach(item=>{
				reactMix(compClass.prototype,item)
			})
		}
		return compClass;
	}
}