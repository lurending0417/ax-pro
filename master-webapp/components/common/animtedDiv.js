/**
* div 从display none 变成 block  动画无效  延迟执行
*  <>-----}|------------------------------->
* 
*/
import mixable from "../../utils/mixable"
import timerMix from "react-timer-mixin"
import PropTypes from "prop-types"
import { isIos } from "../../utils/platform";


@mixable(timerMix)
export default class AnimateDiv extends React.PureComponent {
	static propTypes = {
		animted: PropTypes.bool,
		animateType: PropTypes.string,// 类型 once infinite
		animateWay: PropTypes.string.isRequired //animtate.css 
	}
	static defaultProps = {
		duration: 250,
		animateType: "once",
		animateWay: "fadeIn",
		animted: true
	}

	constructor(props) {
		super();
		this.state = {
			isMounted: false,
			isIos: isIos(),
			animted: props.animted,
			delay: this.delay
		}
	}

	delay = () => {
		this.setTimeout(() => {
			this.setState({
				isMounted: true
			})
		}, 20)

	}
	componentDidMount() {
		this.setState({
			isMounted: true
		})
	}

	// static getDerivedStateFromProps(nextProps, preState) {
	// 	if (nextProps.animated != preState.animated) {
	// 		preState.delay();
	// 		return {
	// 			animated: nextProps.animated,
	// 			isMounted: false
	// 		}
	// 	}
	// }
	render() {
		const { animted, animateType, animateWay, duration, className, style, ...others } = this.props;
		if (animted && !this.state.animted) {
			this.state.isMounted = false;
			this.setTimeout(() => {
				this.setState({
					isMounted: true
				})
			}, animted ? 20 : duration)
		}
		else if (!animted) {
			this.state.animted = animted;
		}
		const newstyle = Object.assign({}, style, {
			animationDuration: duration + "ms"
		})
		const cls = [
			className
		]
		// if (!this.state.isIos) 
		{
			cls.push(animateWay, this.state.animted && this.state.isMounted ? "animated" : "",
				animateType != "once" ? " infinite" : "")
		}
		return <div className={cls.filter(Boolean).join(" ")} style={newstyle} {...others}>{this.props.children}</div>
	}
}

