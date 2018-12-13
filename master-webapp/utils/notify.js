/** 简单的消息通知 * */

const notifys = {}
const timeout = {}

const del = function (key, fun) {
  if (!fun) {
    delete notifys[key]
  }
  const ls = notifys[key]
  if (ls && ls.length) {
    for (let a = 0; a < ls.length; a++) {
      if (ls[a] === fun) {
        ls.splice(a, 1)
        break
      }
    }
  }
}

const on = function (key, fun, isOnly) {
  notifys[key] = notifys[key] || []
  if (isOnly) {
    notifys[key].length = 0
  }
  notifys[key].push(fun)

  return () => del(key, fun)
}

const fire = function (key) {
  const ls = notifys[key]
  if (ls && ls.length) {
    const args = Array.prototype.slice.call(arguments, 1)
    ls.forEach(handler => handler.apply(this, args))
  }
}

/**
 * 可以单独使用
 */
const fireDelay = function (key, delay) {
  let ls=null;
  if(typeof key=="number"){
    key="";
    ls=[delay];
    delay=key;
  }
  else ls = notifys[key]
  
  if (ls && ls.length) {
    let args = Array.prototype.slice.call(arguments, 2);
    const me = this;
    if (timeout[key]) {
      clearTimeout(timeout[key])
    }
    args = Array.prototype.slice.call(arguments, 2)
    timeout[key] = setTimeout(() => {
      ls.forEach(handler => handler.apply(me, args))
    }, delay)
  }
}

const isOn = key => !!notifys[key]
export { on, isOn, fire, fireDelay }
