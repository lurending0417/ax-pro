String.prototype.getLength = function (spacing = 2) {
  let cl = 0;
  for (let i = 0, len = this.length; i < len; i++) {
    cl += this.charCodeAt(i) > 127 ? spacing : 1;
  }

  return cl;
}


String.prototype.cut = function (l) {
  if (this.length * 2 < l) {
    return this;
  }
  let i = 0;
  for (const len = this.length, cl = 0; i < len; i++) {
    cl += this.charCodeAt(i) > 127 ? 2 : 1;
    if (cl > l) {
      break;
    }
  }
  return this.substr(0, i)
}

String.format = function (source) {
  if (!source) { return ''; }
  if (arguments.length == 1 || arguments[1] === null) { return source; }

  const froms = typeof arguments[1] === 'object' ? arguments[1] : Array.prototype.slice.call(arguments, 1);

  return Object.keys(froms).reduce((last, item) => {
    return last.replace(new RegExp(`\\{${item}\\}`, 'g'), froms[item])
  }, source);
}
