import navStore from "./nav/navStore"

// 

class LinkBtn extends React.PureComponent {
    constructor() {
        super()
    }

    render() {
        const { children, href, onClick, disabled, ...others } = this.props;
        return <a onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.move} {...others}
            onClick={this.onClick}>{children}</a>
    }

    onClick = (e) => {
        if (this.clicked == 2) return;
        this.clicked = 2;

        const { href, onClick, disabled } = this.props;
        if (disabled) {
            return;
        }
        e && e.stopPropagation();
        requestAnimationFrame(() => {
            onClick && onClick();
        })

        if (href) {
            navStore.navTo(href);
            // location.href = href;
        }
    }

    onTouchStart = (e) => {
        this.clicked = false;
        this.ts = Date.now();
        this.moved = false
    }

    move = (e) => {
        // this.clicked = true;
        this.moved = true
    }

    onTouchEnd = (e) => {
        if (this.clicked) {
            return;
        }
        this.clicked = 1

        const ts = Date.now() - this.ts;
        if (ts < 700 && this.moved === false) {
            this.clicked = true;
            this.onClick(e)
        }
    }
}

export default LinkBtn;
