import Store from "../../data/stores/"
import { observer } from "mobx-react";

@observer
export default class Footer extends React.Component {

	constructor(props){
		super();
		if(Store.tab.currentIndex==-1){
			Store.tab.currentIndex=props.index
		}
		this.index=props.index;

	}
	render() {
		// console.log("footer render--"+Store.tab.currentIndex+"--pi-"+this.props.index)
		const index =Store.tab.currentIndex;
		return <div className="bar bar-tab footer" style={{ position: "fixed", bottom: 0 }}>
			{
				Store.tab.tabs.map((tab, tindex) => {
					return <a onClick={this.onClick(tindex,tab.href,tab)} key={"tab" + tindex}
						className={"external tab-item" + (index == tindex ? " active" : "")}>
						<span className={"icon " + tab.cls}></span>
						<span className="tab-label">{tab.title}</span>
						<span className="badge">{tab.badge}</span>
					</a>
				})
			}
		</div>
	}

	onClick(index, href,tab) {
		return (e) => {
			if(Store.tab.currentIndex==index)
				return;
			Store.tab.setIndex(index);
			e.stopPropagation();
			e.preventDefault();
			
		}
	}
}