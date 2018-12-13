/** 仅仅是 用于 文字bar header
* */

import PropTypes from "prop-types"


class TabHeaders extends React.PureComponent {
	constructor(props) {
		super()
		this.state = {
			selectedIndex: +props.selectedIndex || 0
		}
		this._containerWidth = 0;
		this._contentWidth = 0;
	}

	static getDelievedState(nextProps) {

	}

	render() {
		const me = this
		let { headers, getText, enableScroll, showSplit, titleStyle, customStyles = {} } = this.props;
		getText = getText || getEmpty;
		customStyles = customStyles || {};

		const activeStyle = [styles.tab_cell_txt_active, customStyles.tab_cell_txt_active]


		const cells = [];
		headers.forEach((item, index) => {
			if (showSplit && index) {
				cells.push(<a key={`split${index}`} style={[styles.tab_cell_txt, styles.tab_cell_split, titleStyle]}>|</a>)
			}
			cells.push(<a
				bordered
				style={[styles.tab_cell_txt,
				customStyles.tab_cell_txt,
				index === me.state.selectedIndex ? activeStyle : null
				]}
			>
				{getText(item)}
			</a>)
		})

		return <div className="">
			{cells}
		</div>
	}

	scroll(index, animated = true) {
		if (this._contentWidth > this._containerWidth && this.myScroll) {
			const length = this.props.headers.size || this.props.headers.length;
			const offset = index * this._contentWidth / length;
			this.myScroll.scrollTo({ x: offset, animated })
		}
	}


	renderContainer(cells) {
		if (this.props.enableScroll) {
			return (<View style={[styles.tab_scroll, this.props.style]}><ScrollView
				ref={ref => this.myScroll = ref}
				horizontal
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				style={{ flex: 1 }}
				contentContainerStyle={[styles.tab_scroll_content, this.props.contentStyle]}
				onLayout={this.onLayout}
				alwaysBounceVertical={false}
				onContentSizeChange={this.onContentSizeChange}
			// contentContainerStyle={{
			//   alignItems: 'center',
			//   // height:47
			// }}
			>
				{cells}
			</ScrollView></View>)
		}

		return <View style={[styles.tab, this.props.style]}>{cells}</View>
	}

	jump(selectedIndex, ot) {
		if (this.props.disabled) {
			return;
		}
		if (selectedIndex !== this.state.selectedIndex) {
			this.setState({ selectedIndex })
			if (this.props.onSelected) {
				// 跳帧执行
				// requestAnimationFrame(() => {
				setImmediate(() => {
					this.props.onSelected(this.props.headers[selectedIndex], selectedIndex)
				})
			}
			if (ot != "-1") { this.scroll(selectedIndex); }
		}
	}
}

const getEmpty = t => t;

TabHeaders.defaultProps = {
	headers: [],
	onSelected: null,
	customStyles: {},
	getText: null,
	showSplit: false,
	enableScroll: false
}

TabHeaders.propTypes = {
	headers: PropTypes.array.isRequired,
	onSelected: PropTypes.func,
	getText: PropTypes.func,
	showSplit: PropTypes.bool,
	enableScroll: PropTypes.bool
}

export default StatusHeaders
