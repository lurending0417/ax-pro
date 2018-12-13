import { observable, action } from "mobx";
import PropTypes from "prop-types"
import IdBaseComp from "./idComponent"

import Api from "../../api/api"
import _map from "lodash/map"
import { observer } from "mobx-react";

import ListScroll from "./listScroll"
import mixable from "../../utils/mixable"
import ListEmpty from "./empty";

/**
 * 通用 list  上拉更多 下拉加载
 *  <>-----}|------------------------------->
 *
 */

const _listCount = 0;
class ListStore {
    constructor(/*取的字段*/rowsName, initedRows, initedTotal) {
        this.rowsName = rowsName || "rows"

        if (this.initedRows) {
            this.setRowsAndTotal(initedRows, initedTotal || initedRows.length)
        }
    }

    refreshKey = 0;
    @observable total = 0;
    @observable rows = [];
    @observable api = ""

    @action
    setRowsAndTotal(r, t) {
        this.rows = r;
        this.total = t;
    }

    @action
    getList(api, start, query = {}) {
        if (start === 0) {
            this.refreshKey++;
        }
        const ps = Object.assign({ start: start }, query)
        return Api.request({
            method: "GET",
            url: api,
            params: ps
        }).then(rs => {
            this.total = rs.total;
            const rows = rs[this.rowsName];
            if (rows && rows instanceof Array) {
                if (start == 0)
                    this.rows = rows;
                else {
                    this.rows = this.rows.concat(rows);
                }
            }

            return rs;
        })
    }

    @action
    remove(index) {
        this.rows.splice(index, 1)
        this.total -= 1;
    }
}


@observer
@mixable(ListScroll, IdBaseComp)
class List extends React.Component {
    static propTypes = {
        api: PropTypes.string,
        dataSource: PropTypes.array,
        limit: PropTypes.number,
        renderItem: PropTypes.func.isRequired,
        renderHeader: PropTypes.func,
        getKey: PropTypes.func,
        getQuery: PropTypes.func,
        rowsName: PropTypes.string
    }
    static defaultProps = {
        limit: 10,
        autoLoad: true,
        infinite: true,
        enableRefresh: true
    }

    constructor(props) {
        super();


        this.state = {
            store: props.store || new ListStore(props.rowsName || "rows", props.initedRows, props.initedTotal),
            hideInifte: false,
            isLoading: false
        }
    }

    getSnapshotBeforeUpdate(prevProps) {
        if (prevProps.api != this.props.api && this.props.api) {
            process.nextTick(() => {
                this.getListData(0);
            })
        }

        return null;
    }

    componentDidMount() {
        if (this.props.autoLoad && this.props.api && !this.state.store.total) {
            this.getListData(0);
        }

    }

    getListData = (start = -1) => {
        const store = this.state.store;
        // const rowsName = this.state.rowsName;
        start = start === -1 ? store.rows.length : start;
        // start = start === -1 ? (store[rowsName] ? store[rowsName].length : store.rows.length) : start;

        const {
            api, getQuery = () => {
            }
        } = this.props;


        this.setState({
            isLoading: true
        })
        return store.getList(api, start, Object.assign({
            limit: this.props.limit
        }, getQuery())).then(rs => {
            this.setState({ isLoading: false })
            return rs;
        }).catch(err => {
            this.setState({ isLoading: false })
            return Promise.reject(err);
        })
    }

    refreshItem = (item,/**自定义赋值 */setV) => {
        // 根据key 来刷新
        for (let i = 0, len = this.state.store.total; i < len; i++) {
            if (this.getKey(item) == this.getKey(this.state.store.rows[i])) {
                if (setV) {
                    this.state.store.rows[i] = setV(this.state.store.rows[i], item)
                }
                else {
                    this.state.store.rows[i] = Object.assign({}, this.state.store.rows[i], item);
                }

                this.forceUpdate();
                break;
            }
        }

    }

    remove = (item) => {
        let index = null;
        if (typeof item == "number") {
            index = item;
        }
        else {
            index = this.state.store.rows.findIndex(newItem => {
                return this.getKey(newItem) == this.getKey(item)
            })
        }
        if (index > -1) {
            this.state.store.remove(index)
        }

    }

    renderEmpty() {
        const { renderEmpty, renderItem } = this.props;
        if (renderEmpty && !this.state.isLoading) {
            return renderEmpty();
        }
        // if (this.state.isLoading)
        //     return _map(new Array(5), (item, index) => {
        //         return <li key={"empty" + index}>
        //             {renderItem({}, index, "empty")}
        //         </li>
        //     })
        return <ListEmpty desc={this.props.emptyDesc} emptyAction={this.props.emptyAction} />
    }

    getKey = item => this.props.getKey && this.props.getKey(item) || item.id

    getUnKey = item => {
        return this.getKey(item) + "-" + this.state.store.refreshKey
    }

    renderList() {
        const { renderItem, className, renderHeader, infinite } = this.props;
        // const isEmpty = !this.state.store.rows.length;
        const isEmpty = (!this.state.store.rows.length);
        const pcls = "list-block" + (isEmpty && " list-empty" || "") + (className && (" " + className) || "")
        return <div className={pcls}>
            <ul style={{ background: "none", border: "none" }}>

                {renderHeader ? renderHeader() : null}
                {
                    (0, () => {
                        if (isEmpty) {
                            return this.renderEmpty()
                        }
                    })()
                }
                {
                    this.state.store.rows.map((item, index) => {
                        return <li key={this.getUnKey(item)}>
                            {renderItem(item, index)}
                        </li>
                    })
                }
            </ul>
        </div>
    }

    getScrollCla = () => {
        const { enableRefresh, infinite } = this.props;
        return [infinite ? "infinite-scroll" : "", enableRefresh ? "pull-to-refresh-content" : ""].join(" ")
    }

    render() {
        const { renderItem, getKey = this.getKey, className, renderHeader, infinite, enableRefresh } = this.props;
        // const isEmpty = !this.state.store.rows.length;
        const isEmpty = (!this.state.store.rows.length);
        const pcls = "list-block" + (isEmpty && " list-empty" || "") + (className && (" " + className) || "")


        return <div className="auto-list">
            <div style={{ position: "absolute" }} id={this.getId()} className={this.getScrollCla()} data-ptr-distance="55"
                data-distance="100">
                {
                    (0, () => {
                        if (enableRefresh) {
                            return <div className="pull-to-refresh-layer">
                                <div className="preloader"></div>
                                <div className="pull-to-refresh-arrow"></div>
                            </div>
                        }
                    })()
                }

                {this.renderList()}
                {
                    (0, () => {
                        if (infinite) {
                            return <div className="infinite-scroll-preloader" style={this.state.hideInifte ? { display: "none" } : {}}>
                                <div className="preloader"></div>
                            </div>
                        }
                    })()
                }
            </div>
        </div>
    }
}


export { ListStore };
export default List;






