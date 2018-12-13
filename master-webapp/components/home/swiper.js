import { query2Object } from "../../utils/func";

// 

class HomeSwiper extends React.PureComponent {
    constructor() {
        super()
    }

    render() {
        return <div id="home-swiper" className="home-top-banner swiper-container" data-space-between='10'
            data-pagination=".swiper-pagination" data-loop="true">
            <div className="swiper-wrapper">
                {
                    this.props.items.map((item, index) => {
                        return <div key={"swiper-" + index} className="swiper-slide" onClick={this.click(item)}>
                            <img src={item.img} style={{ borderRadius: "0.5rem" }}></img>
                        </div>
                    })

                }
            </div>
            <div className="swiper-pagination" style={{ marginBottom: "-0.2rem" }}></div>
        </div>
    }

    componentDidMount() {

    }

    click = (item) => {
        return () => {
            const ps = query2Object(item.url);
            this.props.props.navigation.navTo(item.url, {
                data: item,
                ...ps
            })
        }
    }

    init() {
        if (this.props.items.length && !this.inited) {
            this.inited = true;
            $.swiper($("#home-swiper"), {});
        }

    }

    componentDidMount() {
        requestAnimationFrame(() => {
            this.init();
        })

    }

    componentDidUpdate() {
        if (!this.inited && this.props.items.length) {
            this.init();
        }
    }
}

export default HomeSwiper;