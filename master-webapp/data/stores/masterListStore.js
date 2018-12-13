/**
* 大师列表数据 单独出来  避免 页面切换 花屏
*  <>-----}|------------------------------->
* 
*/

import { ListStore } from "../../components/common/list"

class MasterlistStore extends ListStore {
    constructor(rowsName, initedRows, initedTotal) {
        super(rowsName, initedRows, initedTotal);
    }
}

export default new MasterlistStore();
