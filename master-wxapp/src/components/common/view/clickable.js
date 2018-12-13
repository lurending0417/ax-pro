// 滚动 页面 循环的 第一个元素 点击 无效
import { orride } from '../../../libs/tools/compose'

export default props => {
    props.methods = props.methods || {};

    orride(props.methods, 'touchstart', function () {
        this._touchStart = Date.now();
    })

    orride(props.methods, 'touchend', function () {
        let ts = Date.now() - this._touchStart;
        console.log(ts)
    })

    return props;
}