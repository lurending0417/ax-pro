/**
 * store 延迟加载
 */
import BaseUserStore from "./UserStore"
import TestStore from "./testStore"
import tabStore from "./tabStore";
import CollectionStore from "./CollectionStore";
import QuestionStore from "./disabuse/questionStore";
import CategoryStore from "./category"
import RewardStore from "./reward"
import CommentStore from "./commentStore";
// 拦截fetch
import "../../mock"

class Stores {
	constructor() {
		this.cached = {}

		this.init();
	}

	init() {
		//console.log("inited")
		if (this.category) {

			if (!this.avatar) {
				this.avatar = ""
			}
		}
	}

	getSingle(key, cla, ps) {
		if (this.cached[key]) {
			return this.cached[key]
		}

		return this.cached[key] = new cla(ps), this.cached[key];
	}

	get UserStore() {
		return BaseUserStore;
	}

	get tab() {
		return tabStore
	}

	get CollectionStore() {
		return CollectionStore;
	}

	get QuestionStore() {
		return QuestionStore;
	}


	get category() {
		return this.getSingle("category", CategoryStore)
	}

	get RewardStore() {
		return RewardStore;
	}

	get CommentStore() {
		return CommentStore;
	}
}

// const stores = {
//     UserStore
// }

// export default stores

export default new Stores()