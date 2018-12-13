import LinkBtn from "../../common/link";

// 

class CommentIcon extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        const { icon, desc, className } = this.props;
        return <LinkBtn onClick={this.props.onClick} style={Object.assign({ display: "inline-flex", justifyContent: "center" }, this.props.style)} className={className}>
            <span style={{
                height: "0.9rem",
                display: "block",
                width: "0.9rem"
            }} className={icon}></span>
            <span style={{ marginLeft: ".25rem", position: "relative", whiteSpace: "nowrap" }}>
                {desc}
                {this.renderBadge()}
            </span>

        </LinkBtn>
    }

    renderBadge() {
        if (this.props.badge) {
            return <span style={{
                position: "absolute",
                top: "-0.75rem",
                width: "2.5rem",
                left: "-.5rem"
            }} className="tag-round">{`赚${this.props.badge}`}</span>
        }
    }
}

export default CommentIcon;