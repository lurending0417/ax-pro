/**
* 大师 简介 主体   其他小东西  以插件 形式 添加
*  <>-----}|------------------------------->
* header body footer
*/

import Introduce from "./main" 

class MasterIntroduceMain extends Introduce{
    render(){
		this.formatPlugins();
		return this.renderMain([
			this.renderHeader(),
			this.renderBody(),
			this.renderFooter()
		])
    }
    
    renderMain(children){
		return <div onClick={this.props.onClick} style={this.props.style} className={"umain ms_item"+(this.props.className&&(" "+this.props.className)||"")}>
            {children[0]}
            <div className="border-round" style={{
                display: "flex",
                flexDirection: "column"
            }}>
                {children[1]}
                {children[2]}
            </div>
		</div>
	}
}

export default MasterIntroduceMain;

