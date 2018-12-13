import Header from "../common/headers"
import Store from "../../data/stores"
import { observer } from "mobx-react";

const CategroyStore = Store.category;

// 

@observer
class CategoryHeaders extends React.Component {
    constructor() {
        super()
    }
    render() {
        return <Header isTextGold={false} {...this.props} className="bar color-black bar-nav cat-header" headers={CategroyStore.rows || []} getText={item => item.name} />
    }
}

export default CategoryHeaders;