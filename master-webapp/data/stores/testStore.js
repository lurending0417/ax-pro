import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

class TestStore extends BaseStore{
    @persist @observable count = 1
    @observable countOther = 1

    @action
    add=()=>{
    	this.count ++;
    }

    @action
    addOther=()=>{
    	this.countOther ++;
    }
}

export default TestStore;