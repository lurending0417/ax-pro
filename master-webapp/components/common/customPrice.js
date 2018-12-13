import CommonBtn from "../common/button/commonBtn";

export default class CustomPrice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cost: 100
    }
  }
  render() {
    return (
      <div className="cp_content">
        <div className="cp_body">
          <div className="cp_title fs-bold fs-big">
            悬赏金额
          </div>
          <div className="cp_body_center">
            <input
              className="cp_body_in"
              type="number"
              placeholder={"0"}
              onChange={(e) => this.setState({ cost: e.target.value })}
              defaultValue={this.state.cost}
            />
            <div className="fs-small fs-gray cp_body_unit">元</div>
          </div>
          <a
            style={{
              width: "5.75rem",
              fontSize: ".8rem",
              marginTop: "1.25rem"
            }}
            className="button btn-size-normaler gold-border-btn"
            onClick={() => this.props.callback(+this.state.cost)}
          >提交</a>
        </div>
        <div className="close-icon cp_close" onClick={this.props.closeBack} />
      </div>
    );
  }
}

