import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import navStore from "../../components/common/nav/navStore"
import { data } from "../../common/tab"

class TabStore {
	constructor() {

		// 避免循环引用 直接放在这里
		if (navStore)
			navStore.backTabCheck = routeName => {
				const ind = data.findIndex(item => item.href == routeName);
				if (ind != -1) {
					// tabStore
					this.currentIndex = ind;
				}
			}

		// setInterval(()=>{
		// 	this.setTabBadge(Math.floor(Math.random()*5),Math.floor(Math.random()*10))
		// },1000)
	}

	@observable tabs = data

	@observable currentIndex = -1;

	@observable opened = {}

	@observable isAnimating = false;

	@action
	setTabBadge(index, badge) {
		this.tabs[index].badge = badge;
	}

	isIn(index) {
		return navStore.has(this.tabs[index].href)
	}

	@action
	setIndex(index) {
		this.currentIndex = index;
		if (this.isIn(index)) {
			navStore.backTo(this.tabs[index].href)
		}
		else {
			navStore.navTo(this.tabs[index].href)
		}
	}

}

export default new TabStore();