class F1 extends React.PureComponent{
	componentDidMount(){
		console.log("f1")
	}
}

class F2 extends F1{
	componentDidMount(){
		console.log("f2")
	}
    
	render(){
		return <p>f2</p>
	}
}

export default F2