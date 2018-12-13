export default class BaseForm {
	constructor() {
		let argArr = Array.prototype.slice.call(arguments);
		Object.assign(this, argArr[0])
	}
	init(assignObj) {
		for (let key in this) {
			if (typeof this[key] === 'object') {
				if (this[key] instanceof Array) {
					this[key] = [];
				} else if (this[key] instanceof Object) {
					this[key] = {}
				}
			} else if (typeof this[key] === 'boolean') {
				this[key] = false;
			} else if (typeof this[key] === 'string') {
				this[key] = '';
			} else if (typeof this[key] === 'number') {
				this[key] = 0;
			}
		}
		Object.assign(this, assignObj)
	}
}
