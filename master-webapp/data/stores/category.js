import BaseStore from "./BaseStore";
import api from "../../api/api";
import { API_GET_CATEGORY } from "../../common/api";
import { observable } from "mobx";
import { waitAuth } from "../../utils/wx";
import sysStore from "./sysStore";

export default class CategoryStore {
	constructor() {
		sysStore.done(() => {
			this.rows = sysStore.categories;
		})
	}

	@observable rows = []
}