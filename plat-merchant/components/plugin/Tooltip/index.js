// import Tooltip from './Tooltip.vue';

export default {
    install: function (Vue, options) {
        options = options || {}
        // 自定义指令的名字，默认为 tip
        const name = options.directiveName || 'tip'
        // tip 的展示方向
        // const allPlacements = ['top', 'right', 'bottom', 'left']

        Vue.directive(name, {
            bind(el, binding) {
                let {mouseenter} = binding.modifiers;
                if (mouseenter) {
                    el.addEventListener('mouseenter', function (e) {
                        console.log('this', this);
                        console.log('e', e);
                    })
                }
            }
        })
    }
}
