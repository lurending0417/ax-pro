import CommentGroup from '../../pages/common/commentGroup'

/**
 * 课程Item组件
 */
class CourseItem extends React.PureComponent {
    constructor(props) {
        super(props)

        if (props.data)
            this.state = {
                img: props.data.img,
                name: props.data.name,
                type: props.data.type,
                amount: props.data.amount,
                des: props.data.des,
                answers: props.data.answers,
                favorites: props.data.favorites,
            }
    }

    render() {
        if (!this.props.data)
            return <div></div>

        return <div className="card color-default" style={{ margin: '0.5rem 0.75rem 1rem' }}>
            <div valign="bottom" className="card-header color-white no-border no-padding">
                <img className="card-cover"
                     style={{ padding: '1rem 1rem 0' }}
                     src={this.state.img}
                     alt=""/>
            </div>
            <div className="card-content">
                <div className="card-content-inner">
                    <div className="row" style={{ lineHeight: '1.35rem' }}>
                        <div className="col-40">
                            {this.state.name}
                        </div>
                        <div className="col-5">&nbsp;</div>
                        <div className="col-33">
                            <div className="button button-warning">{this.state.type}</div>
                        </div>
                        <div className="col" style={{ textAlign: 'right' }}>
                            ¥{this.state.amount}
                        </div>
                    </div>
                    <p>课程介绍 {this.state.des}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CommentGroup hasShare={true}/>
                        {/*<span className="icon icon-message"></span>*/}
                        {/*<span style={{ marginRight: '0.4rem' }}> {this.state.answers} </span>*/}
                        {/*<span className="icon icon-star"></span>*/}
                        {/*<span style={{ marginRight: '0.4rem' }}> {this.state.favorites} </span>*/}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CourseItem;