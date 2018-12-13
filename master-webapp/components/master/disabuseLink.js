/**
 * 插件 - 大师解惑 跳转更多
 */
export default class DisaBuseLink extends React.PureComponent {
  render() {
    const { tip, style } = this.props;
    return (
      <div style={style} className="dl_content">
        <p className="dl_txt fs-small">{tip ? tip : ""}</p>
        <div className="master-disabuse-more" />
      </div>
    )
  }
}