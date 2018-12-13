import {baseUtil} from '~/util'
import componentUtil from './componentUtil'

export default {

    install(Vue) {
        Vue.prototype.baseUtil = baseUtil;
        Vue.prototype.handleItemUnit = componentUtil.handleItemUnit;
    }

}
