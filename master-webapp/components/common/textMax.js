// 最长 字符

class MaxLengthText  extends React.PureComponent{
    static defaultProps={
        max:200
    }
    constructor(props){
        super()
        this.state={
            value:props.defaultValue||"",
            l:(props.value||"").length
        }
    }


    render(){
        return <div className="maxtxt">
            <textarea className="full" onChange={this.onChange} value={this.state.value}></textarea>
            <span className="maxtxt-span">{this.state.l+"/"+this.props.max}</span>
        </div>
    }

    onChange=e=>{
        if(e.target.value.length<=this.props.max){
            this.setState({
                value:e.target.value,
                l:e.target.value.length
            })

            this.props.onChange&&this.props.onChange(e)
        }
    }
}

export default MaxLengthText;