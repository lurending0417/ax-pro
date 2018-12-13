


class LoginOut extends React.PureComponent{
    constructor(){
        super()
    }
    componentDidMount(){
        localStorage.clear();
    }
    render(){
        return <div>注销</div>
    }
}

export default LoginOut;