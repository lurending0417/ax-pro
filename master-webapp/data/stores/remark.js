import { observable, action } from "mobx"
import BaseStore from "./BaseStore";
import { persist } from "mobx-persist";

class Remark extends BaseStore {
    constructor(){
        super();
    }

    @persist("object") @observable remark = {
        content: "这幅画很不错！"
    };
    @persist("object") @observable reply = {
        content: "不愧是名家作品！",
        name: "张三",
        time: "12/12 13:11"
    };

}

export default new Remark();