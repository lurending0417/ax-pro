import navStore, { NavState } from "./navStore"
import { observer } from "mobx-react"
import { child } from "serializr";

import Header from "./header"
import Footer from "./footer"

import { showFooter } from "../../../common/tab"

@observer
class Navigation extends React.Component {
	constructor(props) {
		super();
		this.state = {
			error: false
		}
		if (!navStore.isRooted)
			navStore.isRooted = this;
	}
	componentDidCatch() {
		process.nextTick(() => {
			this.setState({
				error: true
			})
		})

		setTimeout(() => {
			sessionStorage.setItem("currentRoute", "");
			// location.href="/";
		}, 1000)
	}
	render() {
		if (this.state.error) {
			return <p>出错了</p>
		}
		let pathname = "/";
		if (process.browser) {
			pathname = location.pathname;
		}

		const { component, ...others } = this.props;
		if (process.browser && navStore.isRooted && navStore.isRooted != this) {

			const Bc = component;
			if (Bc)
				return <Bc {...others} />
		}

		const canShowFooter = showFooter(navStore.currentRoute || navStore.currentPath);// showFooter(navStore.currentRoute)// Footer.canShowFooter(navStore.currentRoute);


		return <div>
			<Footer isVisible={canShowFooter} />
			<div className="pages">
				{
					navStore.routes.filter(Boolean).map((route, index) => {
						const Child = route.component;
						let props = route.props || {};
						if (navStore.backId == route.id) {
							props = { ...props, isBack: true }
						}
						return <div className="page" id={route.id} key={route.id}>
							<div className="page-main">
								<div className="page-body">
									{this.renderHeader(route)}
									<div className="content">
										<Child onAsyncLoaded={this.onAsyncLoaded(route)} {...props} navigation={navStore} navRootProps={others} />
									</div>
								</div>
							</div>
						</div>
					})
				}
			</div>

		</div>
	}

	renderHeader(route) {
		if (route.navProps && (route.navProps.title || route.navProps.header)) {
			if (route.navProps.header) {
				return route.navProps.header();
			}
			return <Header {...route.navProps} />
		}
	}

	onAsyncLoaded(route) {
		return async (compClass) => {
			// console.log("async loaded")
			const ps = compClass.navProps && compClass.navProps(route.props || {});
			if (ps) {
				process.nextTick(() => {
					navStore.setNavProps(route, ps)
				})
			}
			if (compClass.getInitialProps) {
				const pas = await compClass.getInitialProps({});
				if (pas) {
					process.nextTick(() => {
						navStore.setNavProps(route, pas)
					})
				}
			}

		}
	}

	componentDidUpdate() {
		switch (navStore.state) {
			case NavState.navTo: {
				navStore.resetState();
				$.router.loadPage("#" + navStore.routes.slice(-1)[0].id)

			}
				break;
			case NavState.backTo: {
				// console.log(navStore.backId)
				// $.router.back(navStore.backId||"")
				navStore.resetState();
			}
				break;
		}
	}
}

export default Navigation;
