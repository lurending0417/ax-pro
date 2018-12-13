import PlainAlertBox from './PlainAlertBox.vue'

// 定义插件对象
const AlertMessageBox = {};

AlertMessageBox.install = function (Vue, options) {
    const AlertMessageBoxInstance = Vue.extend(PlainAlertBox);
    let currentMsg;
    const initInstance = () => {
        // 实例化vue实例
        currentMsg = new AlertMessageBoxInstance();
        let msgBoxEl = currentMsg.$mount().$el;
        document.body.appendChild(msgBoxEl);
    };
    // 在Vue的原型上添加实例方法，以全局调用
    Vue.prototype.$msgBox = {
        showMsgBox (options) {
            console.log('options', options)
            if (!currentMsg) {
                initInstance();
            }
            if (typeof options === 'string') {
                currentMsg.content = options;
            } else if (typeof options === 'object') {
                Object.assign(currentMsg, options);
            }
            return currentMsg.showMsgBox()
                .then(val => {
                    currentMsg = null;
                    return Promise.resolve(val);
                })
                .catch(err => {
                    currentMsg = null;
                    return Promise.reject(err);
                });
        }
    };
};

export default AlertMessageBox;
