export default class MasterLabel extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="dl_content">
                {
                    this.props.tags && this.props.tags.map((tag, index) => {
                        return <div key={index}
                            className={index === 0 ? "fs-small dl_gray" : "fs-small dl_gray dl_space"}>
                            #{tag}
                        </div>
                    })
                }
            </div>
        )
    }
}