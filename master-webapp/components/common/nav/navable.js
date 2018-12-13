import Navg from "./navigation"
import navStore from "./navStore"
import Pages from "../../../common/pages"
navStore.setRoutes(Pages)
if (!process.__Pages) {
	// var pages = require("../../../common/pages").default;

}


export default (path, id) => {
	return (BaseComponent) => {

		if (navStore.isRooted) {
			return BaseComponent;
		}
		navStore.push(path, BaseComponent, id);
		function render(opts) {
			return <Navg component={BaseComponent} {...opts} />
		}

		render.getInitialProps = async (ctx) => {
			// server 端响应
			console.log("navInit-getInitialProps-" + ctx.req.url)
			let rs = {};
			if (BaseComponent.getInitialProps) rs = await BaseComponent.getInitialProps(ctx);

			// navStore.locationUrl=ctx.req.url;
			await navStore.recovery(ctx.req.url, rs);

			return rs || {};
		};
		render.navProps = BaseComponent.navProps;
		// client side
		if (process.browser) {
			navStore.recovery();
		}

		return render;
	}
}