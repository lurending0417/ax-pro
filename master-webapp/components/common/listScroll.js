export default {
    initById: function () {
        const id = "#" + this.getId();
        const me = this;

        const { enableRefresh, infinite } = this.props;

        function checkInfite(hideInifte) {
            if (!hideInifte) {
                $.attachInfiniteScroll(id);
            }
            else {
                $.detachInfiniteScroll(id);
            }
        }

        // 如果list 的高度为0 设置一个 默认高度
        const height = this.props.height || ((document.body.clientHeight - 50) + "px");
        if ($(id).parent().height() == 0) {
            $(id).parent().css("height", height)
        }

        // 刷新  更多
        if (process.browser) {

            if (enableRefresh) {
                $.initPullToRefresh(id)
                $(id).bind("refresh", () => {
                    me.getListData(0).then(() => {
                        $.pullToRefreshDone(id)

                        const hideInifte = me.state.store.rows.length >= me.state.store.total;
                        checkInfite(hideInifte)

                        me.setState({
                            hideInifte: hideInifte
                        })
                    }).catch(() => {
                        $.pullToRefreshDone(id)
                    });
                })
            }


            let isLoadingMore = false;
            if (infinite) {
                $.initInfiniteScroll(id)

                $(id).bind("infinite", () => {
                    if (isLoadingMore) {
                        return;
                    }
                    isLoadingMore = true;
                    me.getListData().then(() => {
                        isLoadingMore = false;
                        if (me.state.store.rows.length >= me.state.store.total) {
                            checkInfite(true);
                            me.setState({
                                hideInifte: true
                            })
                        }
                    }).catch(() => {
                        isLoadingMore = false;
                    });
                })
            }

        }
    },
    componentWillUnmount: function () {
        const id = "#" + this.getId();
        const el = $(id)
        if (!el.length) {
            return;
        }

        el.unbind("refresh")
        el.unbind("infinite")
        $.destroyPullToRefresh(id)
    },
    componentDidUpdate: function () {

        if (!this.state.hideInifte && this.state.store.rows && this.state.store.rows.length >= this.state.store.total) {
            process.nextTick(() => {
                this.setState({
                    hideInifte: true
                })
            })
        }
    }
}