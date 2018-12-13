
/**
* 把 willdo place in queues return  promise
*  <>-----}|------------------------------->
* 
*/


module.exports = class MaxQueue {
    constructor({ doing, maxCount }) {
        this.maxCount = maxCount;
        this.doing = doing;
        this.nowCount = 0;
        this.queues = [];
        this._check = false;
    }

    check(isForce = false) {
        if (!isForce && this._check) return;
        if (!this.queues.length) return;
        this._check = true;
        if (this.nowCount < this.maxCount) {
            const n = this.maxCount - this.nowCount;
            const dos = [];
            const left = [];
            this.queues.forEach((item, i) => {
                if (i < n) {
                    dos.push(item)
                }
                else {
                    left.push(item)
                }
            })
            this.queues = left;
            dos.forEach(item => {
                this.nowCount++;
                (0, item => {
                    let { s, f, p } = item;
                    p = p || [];
                    p.push((err, rs) => {
                        this.nowCount--;
                        if (err) {
                            return f(err)
                        }
                        return s(rs);
                    })
                    this.doing.apply(null, p)
                })(item)
            })
        }

        if (!this.queues.length) return this._check = false;

        if (typeof process != "undefined" && process.nextTick) {
            // nodejs 环境
            process.nextTick(this.check.bind(this))
        }
        else {
            setTimeout(() => {
                this.check();
            }, 20)
        }
    }
    add() {
        const ps = Array.prototype.slice.call(arguments, 0);
        return new Promise((s, f) => {
            this.queues.push({ s, f, p: ps });
            this.check();
        })
    }
}