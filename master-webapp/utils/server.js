/**
* server 端 没有 window doc  仿照一个
*  <>-----}|------------------------------->
* 
*/

if(!process.browser){
	var doc = (typeof document === "undefined") ? {
		body: {},
		addEventListener: function addEventListener() {},
		removeEventListener: function removeEventListener() {},
		activeElement: {
			blur: function blur() {},
			nodeName: ""
		},
		querySelector: function querySelector() {
			return null;
		},
		querySelectorAll: function querySelectorAll() {
			return [];
		},
		getElementById: function getElementById() {
			return null;
		},
		createEvent: function createEvent() {
			return {
				initEvent: function initEvent() {}
			};
		},
		createElement: function createElement() {
			return {
				children: [],
				childNodes: [],
				style: {},
				setAttribute: function setAttribute() {},
				getElementsByTagName: function getElementsByTagName() {
					return [];
				}
			};
		},
		location: { hash: "" }
      } : document; // eslint-disable-line
    
	var win = (typeof window === "undefined") ? {
		document: doc,
		navigator: {
			userAgent: ""
		},
		location: {},
		history: {},
		CustomEvent: function CustomEvent() {
			return this;
		},
		addEventListener: function addEventListener() {},
		removeEventListener: function removeEventListener() {},
		getComputedStyle: function getComputedStyle() {
			return {
				getPropertyValue: function getPropertyValue() {
					return "";
				}
			};
		},
		Image: function Image() {},
		Date: function Date() {},
		screen: {},
		setTimeout: function setTimeout() {},
		clearTimeout: function clearTimeout() {}
      } : window; // eslint-disable-line
    
	// global.window=win;
}



