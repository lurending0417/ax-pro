import navable from "../../components/common/nav/navable";
import { fire, on } from "../../utils/notify"

let _id = 0;

@navable("/common/photoManager")
export default class PhotoManager extends React.PureComponent {
	constructor(props) {
		super(props);
		if (process.browser) {
			this.imgWidth = document.body.clientWidth;
		}
		else {
			this.imgWidth = 0;
		}


		this.state = {
			id: "pic-swiper" + (_id++),
			index: props.index || 0,
			items: props.items,
			refresh: this.init
		}

		this.unDel = on("del-pic", () => {
			console.log("fired")
			this.state.items.splice(this.state.index, 1)
			this.setState({
				items: [...this.state.items]
			})
			this.props.onDel(this.state.index);
		})
	}

	componentDidMount() {
		this.init();
	}

	componentWillUnmount() {
		this.unDel();
	}

	init = () => {
		$.swiper($("#" + this.state.id), {
			onSlideChangeEnd: s => {
				this.setIndex(s.activeIndex)
			}
		});
	}

	setIndex = (index) => {
		this.setState({
			index: index
		})

		this.props.navigation.setNavProps(null, {
			title: (index + 1) + "/" + this.props.items.length
		})
	}

	static navProps(props) {
		const a = props.a || {}
		return {
			title: a.title || props.title,
			rightBtn: () => {
				return <DeleteBtn callBack={() => { fire("del-pic") }} />;
			}
		}
	}

	static getDerivedStateFromProps(nextProps, preState) {
		console.log("123123")
		if (preState.items != nextProps.items) {
			requestAnimationFrame(preState.refresh)
			return {
				id: preState.id + "-" + 1,
				items: nextProps.items
			}
		}
	}

	renderScroll() {
		return <div id={this.state.id} className="pm-scroll swiper-container" data-space-between='10' data-loop="true">
			<div className="swiper-wrapper">
				{
					this.state.items.map((item, index) => {
						return <div key={"swiper-" + index} className="swiper-slide">
							<img style={{ maxWidth: this.imgWidth + "px" }} src={item.src}></img>
						</div>
					})
				}
			</div>
		</div>
	}

	render() {
		if (this.props.items) {
			return this.renderScroll();
		}
		return (
			<div className="pm_content">
				<img src={this.props.a.src} />
			</div>
		);
	}
}

class DeleteBtn extends React.PureComponent {

	render() {
		return (
			<div onClick={this.props.callBack} className="delete-icon pm_nav_right"></div>
		)
	}
}