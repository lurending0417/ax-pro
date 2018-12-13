// 


class ListEmpty extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        const st = { marginTop: "0", fontSize: ".7rem" }
        if (this.props.emptyAction) {
            st.textDecoration = "underline"
        }
        return <div style={{ position: "relative" }} className="disp-vertical-center-center full">
            <div className="icon-empty"></div>
            <p onClick={this.props.emptyAction} style={st} className="fs-gray">{this.props.desc || "空空如也"}</p>
        </div>
    }
}

export default ListEmpty;