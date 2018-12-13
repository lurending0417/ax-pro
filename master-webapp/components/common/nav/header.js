import navStore from "./navStore";

export default (props) => {
	// return null;
	let { float = false, title, showBack = true, beforeBack, leftBtn, rightBtn, headerCls, hiddenTitleBorder } = props
	let headerCss = ["head-box bar color-black", "bar-nav", headerCls];
	if (float) {
		headerCss = ["head-box bar color-black", headerCls]
	}
	return <div className={headerCss.filter(Boolean).join(" ")} style={hiddenTitleBorder === true ? { borderBottom: "none" } : {}}>
		{
			(0, () => {
				if (showBack && !leftBtn) {
					leftBtn = () => <a className="button button-link button-nav pull-left" onClick={() => {
						if (beforeBack) {
							if (beforeBack(navStore)) {
								navStore.backTo();
							}
						}
						else {
							navStore.backTo();
						}
					}}>
						<i className="icon icon-back"></i>
					</a>
				}
				if (leftBtn) {
					return leftBtn()
				}
			})()
		}
		<h1 className="title fs-line1">{title}</h1>
		{
			(0, () => {
				return rightBtn && rightBtn() || null;
			})()
		}
	</div>
}