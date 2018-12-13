/**
* 滚动页 首次点击 无效
*  <>-----}|------------------------------->
* 
*/

export default {
    componentDidMount: () => {
        requestAnimationFrame(() => {
            $(".page-current .page-body .content>div").scrollTop(1);
        })
    }
}

