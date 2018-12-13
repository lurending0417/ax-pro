/**
 * 支付、纯色、收藏按钮组件
 */

import PropTypes from "prop-types";

export default class CommonBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    renderBtn() {
        return (
            <div onClick={this.props.callback}
                className={(this.props.isFill ? "btn_fill" : "btn_border") + " btn_radius btn_content " + (this.props.className || "")}
                style={this.props.style}>
                {this.props.title}
            </div>
        );
    }

    // 收藏
    renderCollectionBtn() {
        return (
            <div className="btn_collection" onClick={this.props.callback}>
                {this.props.collection ? "已收藏" : "收藏"}
            </div>
        );
    }

    render() {
        return (
            <div>
                {(() => {
                    if (this.props.isCollection) {
                        return this.renderCollectionBtn();
                    }
                    return this.renderBtn();
                })()}
            </div>
        )

    }
}


CommonBtn.propTypes = {
    isFill: PropTypes.bool, // 填满、边框
    title: PropTypes.string,
    isCollection: PropTypes.bool
}

CommonBtn.defaultProps = {
    isFill: true,
    isCollection: false // 判断是否为收藏按钮
}