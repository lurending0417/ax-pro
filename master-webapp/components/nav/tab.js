import Footer from "./footer"

export default (index) => {
	return (BaseComponent) => {
		// console.log("dd")
		// const render = BaseComponent.prototype.render;

		// BaseComponent.prototype.render = function () {

		// 	const me = this;
		// 	return <div className="tab-content">
		// 		{render.call(me)}
		// 		<div style={{ height: "2.5rem" }}></div>
		// 		<Footer index={index}/>
		// 	</div>
		// }

		return BaseComponent;
	}
}
