import CommonImg from "./img";

/**
* 通用头像 直接用div 包含img
*  <>-----}|------------------------------->
*
*/

//

class CommonAvatar extends React.PureComponent {
    render() {
        const { className, ...others } = this.props
        return <CommonImg className={(className || "") + " test-avatar-0"} imgStyle={{ borderRadius: "50%" }} canPre={false} {...others} />
        // const { src, className, ...other } = this.props;
        // const st = {
        //     width: this.state.byHeight ? "auto" : "100%",
        //     height: this.state.byHeight ? "100%" : "auto",
        //     borderRadius: "0"
        //     // marginLeft: -this.state.mW,
        //     // marginTop: -this.state.mH
        // }
        // return <div className={"avator-normal " + (className ? className : "")} {...other}>
        //     <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
        //         <img style={st} onLoad={this.onLoad} src={src}></img>
        //     </div>
        //     {this.props.children}
        // </div>
    }
}

export default CommonAvatar;
