export default {
  initById: function () {
    const id = "#" + this.getId();
    const me = this;

    // return ;
    function checkInfite(hideInifte) {

      if (!hideInifte) {
        $.attachInfiniteScroll(id);
      }
      else {
        $.detachInfiniteScroll(id);
      }
    }

    // 刷新  更多
    if (process.browser) {
      $.initInfiniteScroll(id)
      checkInfite(me.state.hideInifte);
      let isLoadingMore = false;
      $(id).bind("infinite", () => {


        if (isLoadingMore) {
          return;
        }
        isLoadingMore = true;
        me.getMore().then((rs) => {
          isLoadingMore = false;
          if (!rs.rows.length) {
            me.checkInfite(true);
          }
        }).catch(() => {
          isLoadingMore = false;
        });
      })
    }
  },
  componentWillUnmount: function () {
    const id = "#" + this.getId();
    const el = $(id)
    if (!el.length) {
      return;
    }

    // el.unbind("refresh")
    el.unbind("infinite")
    $.destroyPullToRefresh(id)
  },
}