import api from "../../api/api";
import { query2Object } from "../../utils/func";

/**
* 直接 服务端 渲染
*  <>-----}|------------------------------->
* 
*/


// 

class ServerPage extends React.PureComponent {
    static async getInitialProps({ req }) {
        if (req && req.url) {
            const props = query2Object(req.url)
            const store = await ServerPage.req(props)
            return {
                store: store
            }
        }
        else {
            return {

            };
        }
    }
    static async req(opts) {
        return api.request(opts)
    }

    constructor(props) {
        super()

        let store = null;
        if (props.navRootProps && props.navRootProps.store) {
            store = this.copy(props.navRootProps.store);
        }
        this.state = {
            store: store
        }
    }

    componentDidMount() {
        if (!this.state.store) {
            ServerPage.req(this.props).then(rs => {
                this.copy(rs.result)
            })
        }
    }

    copy(store) {
        // 需要改到
        // let st={}
        // Object.keys(store).forEach(key => {
        //     st[key] = store[key]
        // })
        return store;
    }
}

export default ServerPage;
