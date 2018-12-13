const eleTransition = '0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out'
const Transiton = {
    'before-enter': function (el) {
        el.style.transition = eleTransition;
        if (!el.dataset) {
            el.dataset = {}
        }
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;

        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
    },
    'enter': function (el) {
        el.dataset.oldOverflow = el.style.overflow;
        if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + 'px';
        } else {
            el.style.height = '';
        }
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
        el.style.overflow = 'hidden'
    },
    'after-enter': function (el) {
        el.style.transiton = '';
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
    },
    'before-leave': function (el) {
        if (!el.dataset) {
            el.dataset = {}
        }
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;
        el.dataset.oldOverflow = el.style.overflow;

        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden'
    },
    'leave': function (el) {
        if (el.scrollHeight !== 0) {
            el.style.transition = eleTransition;
            el.style.height = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        }
    },
    'after-leave': function (el) {
        el.style.transition = '';
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
    }
}

export default {
    name: 'collapseTransition',
    functional: true,
    render(h, {children}) {
        const data = {
            on: Transiton
        }
        return h('transition', data, children)
    }
}
