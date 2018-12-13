export default (info)=>(target, key, descriptor)=>{
  let raw=descriptor.value;
  descriptor.value=(function(...args){
    console.info(info||key+'executed');
    return raw.apply(target,args)
  });
  return descriptor;
}