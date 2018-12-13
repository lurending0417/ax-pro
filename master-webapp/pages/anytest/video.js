import Barrage from "../../components/video/barrage"


class VideoTest extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        return <div>
            <video width="100%" height="240" controls="">
                <source src="http://www.runoob.com/try/demo_source/movie.mp4" type="video/mp4" />
                您的浏览器不支持 video 标签。
            </video>
            <Barrage />
        </div>
    }
}

export default VideoTest;