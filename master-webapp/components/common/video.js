import api from "../../api/api";
import { API_COURSE_MEDIA } from "../../common/api";


// 

class VidoeAndMp3 extends React.PureComponent {
    static defaultProps = {
        show: true
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if (preState.canPlay != nextProps.canPlay || preState.query != nextProps.query) {
            if ((nextProps.canPlay && !preState.canPlay) || (preState.query != nextProps.query && nextProps.query)) {
                requestAnimationFrame(() => {
                    preState.refresh();
                })
            }
            return {
                canPlay: nextProps.canPlay,
                query: nextProps.query
            }
        }

        return null;
    }

    constructor(props) {
        super()
        let h = 210;
        if (process.browser) {
            h = document.body.clientWidth * 720 / 1280;
        }
        this.state = {
            type: props.type || "video",
            url: props.url,
            currentTime: 0,
            played: -1,
            canPlay: props.canPlay,
            refresh: this.refresh,
            query: props.query,
            height: h
        }
    }

    refresh = () => {
        this.getPlayUrl(this.state.type).then(rs => {
            this.setState({
                url: rs.result,
                played: -1,
                currentTime: 0
            })
        })
    }

    componentDidMount() {
        this.getPlayUrl(this.state.type).then(rs => {
            this.setState({
                url: rs.result
            })
        })
    }

    onLoad = () => {
        // 获取尺寸
    }

    render() {
        const { style, className } = this.props
        const bg = {}
        if (this.state.type == "audio") {
            bg.backgroundImage = `url(${this.props.poster})`
        }

        if (this.props.bg) {
            bg.backgroundImage = `url(${this.props.bg})`
        }

        if (!bg.backgroundImage) {
            bg.background = "black"
        }





        const evs = {
            onPause: this.onPause,
            onPlay: this.onPlay,
            onError: this.onError,
            onLoad: this.onLoad,
            onCanPlay: this.canPlay,
            onLoadStart: this.beforeLoad
        }
        return <div style={Object.assign(bg, { position: "relative", width: "100%", height: this.state.height }, style)} className={"disp-vertical-center-center imgBg " + (className || "")}>
            {(0, () => {
                if (this.props.bg) {
                    return null;
                }
                if (this.state.type == "video") {
                    return <video {...evs} controls style={{ width: "100%", height: "100%" }} ref="video" poster={this.props.poster} src={this.state.url} onTimeUpdate={this.timeUpdate} />
                }
                else return <audio {...evs} controls ref="audio" src={this.state.url} onTimeUpdate={this.timeUpdate} />
            })()}
            {(0, () => {
                if (this.props.bg) {
                    return null;
                }
                if (!this.props.type) {
                    return <span onClick={this.switch} style={{
                        position: "absolute",
                        right: "0.25rem",
                        // color: this.state.type == "video" ? "#fff" : "black",
                        color: "#fff",
                        top: ".25rem",
                        visibility: this.props.show ? "visible" : "hidden"
                    }}>切换{this.state.type != "video" ? "视频" : "音频"}</span>
                }
            })()}
        </div>
    }

    onPlay = e => {
        this.playing = true;
    }

    onPause = e => {
        this.playing = false;
    }

    onError = (err) => {
        // 授权出错 从新获取
        console.log("err>" + this.state.currentTime);
        if (this.playing) {
            this._errTime = this.state.currentTime;
            this.getPlayUrl(this.state.type).then(rs => {
                this.setState({
                    url: rs.result,
                    played: false
                })

                requestAnimationFrame(() => {
                    this.refs[this.state.type].play();
                })
            })
        }
    }

    beforeLoad = () => {
        console.log("loadStart");
        this._isBegin = true;
    }

    canPlay = () => {
        console.log("canPlay")
        if (!this._isBegin) {
            return;
        }

        this._isBegin = false;

        const aud = this.refs[this.state.type];
        if (this.state.played == -1 || this.state.played)
            return;
        console.log("set Current-time")
        this.state.played = true;
        aud.paused && aud.play();

        // update time

        console.log("errtime>" + this._errTime)
        requestAnimationFrame(() => {
            aud.currentTime = this._errTime || this.state.currentTime || 0;

            this._errTime = 0;
        })

    }

    timeUpdate = (e) => {
        this.state.currentTime = e.currentTarget.currentTime;
        // console.log(this.state.currentTime);

        this.props.onProgress && this.props.onProgress(e.currentTarget.currentTime)
    }

    switch = () => {
        const nextType = this.state.type == "video" ? "audio" : "video";


        this.getPlayUrl(nextType).then(rs => {
            this.setState({
                url: rs.result,
                type: nextType,
                played: false
            })


        })

    }

    getPlayUrl = (type) => {
        if (!this.props.canPlay) {
            return Promise.resolve({ result: "" })
        }
        return api.request({
            url: this.props.api,
            params: Object.assign({
                quality: type == "audio" ? "mp3" : "720p"
            }, this.props.query || (this.props.getQuery && this.props.getQuery()) || {})
        })
    }


}

export default VidoeAndMp3;