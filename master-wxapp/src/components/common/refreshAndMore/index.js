/**
* 刷新 或者 加载 更多
* 页面 需要 refresh more组建
*  <>-----}|------------------------------->
*  // 重载 onPullDownRefresh onReachBottom onPageScroll
*/
import store from '../../../store/index'
import regeneratorRuntime from 'regenerator-runtime'

export default (props) => {

    let onPullDownRefresh = props.onPullDownRefresh;
    props.onPullDownRefresh = async function () {
        this.setData({
            showLoadingRefresh: true
        })

        if (this.onRefresh) {
            await this.onRefresh()
        }
        if (this.getList) {
            await this.getList(0)
        }
        global.process.nextTick(() => {
            wx.stopPullDownRefresh();
            this.setData({
                showLoadingRefresh: false
            })
        })


        onPullDownRefresh && onPullDownRefresh.call(this)
    }




    let onReachBottom = props.onReachBottom;
    props.onReachBottom = function () {
        if (!this.data.hasMore) {
            return;
        }
        this.setData({
            showFooter: true
        })

        this._fixedStMax = this._st + 35;
        this._fixedSt = this._st;

        onReachBottom && onReachBottom.call(this)
    }

    let onPageScroll = props.onPageScroll;
    props.onPageScroll = function (opts) {
        this.onLoadMore && this.onLoadMore()
        if (!this.data.hasMore) {
            return;
        }
        this._st = opts.scrollTop

        if (opts.scrollTop > this._fixedStMax) {
            this.setData({
                showLoadingMore: true,
            })

            if (this.getList) {
                this.getList(this.data.rows.length)
            }


        }
        else if (opts.scrollTop < this._fixedSt) {
            this.setData({
                showFooter: false,
                showLoadingMore: false,
            }, () => {
                this._fixedSt = 0;
                this._fixedStMax = 0;
            })
        }
        onPageScroll && onPageScroll.call(this, opts)
    }



    props.data = props.data || {};
    props.data = Object.assign(props.data, {
        showFooter: false,
        hasMore: false,
        showLoadingRefresh: false,
        rows: [],
        api: props.data.api,
        start: props.data.start || 0,
        limit: props.data.limit || 10,
        total: 0,
    })

    if (!props.getList) {
        props.getList = async function (start = 0) {
            var me = this;
            if (me._isLoading) {
                return;
            }
            me._isLoading = true;
            let query = this.getQuery && this.getQuery() || {}
            query.start = start;
            query.limit = this.data.limit;

            return new Promise((s, f) => {
                store.dispatch({
                    type: 'CallApi',
                    payload: {
                        api: props.data.api,
                        body: query,
                        success: rs => {
                            if (rs.rows) {
                                let data = [];
                                if (query.start === 0) {
                                    data = rs.rows;
                                }
                                else {
                                    data = this.data.rows.concat(rs.rows)
                                }
                                this.setData({
                                    rows: data,
                                    total: rs.total,
                                    hasMore: rs.total > data.length,
                                    showFooter: rs.total > data.length,
                                })
                            }
                        },
                        done: function () {
                            me._isLoading = false;
                            s();
                        }
                    }
                })
            })

        }

    }

    props.enableMore = function () {
        this.data.hasMore = true;
    }
    props.disableMore = function () {
        this.setData({
            hasMore: false,
            showFooter: false,
        })
    }
    return props;
}

