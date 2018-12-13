/**
* 图片 选择
*  <>-----}|------------------------------->
* wap 文件选择  微信 使用api 选择
*/

import { isWx, checkApi } from "../../utils/wx"
import { preImgFromFile } from "../../utils/func"
import { isIos } from "../../utils/platform"
import CommonAvatar from "./commonAvatar";


class ImagePicker extends React.PureComponent {
	constructor() {
		super()
		this.state = {
			src: null
		}
	}
	static navProps = () => {
		return {
			title: "个人设置"
		}
	}
	static defaultProps = {
		autoShow: true,
		debug: () => { }
	}
	render() {
		const bgStyle = {
			position: "relative",
			overflow: "hidden"
		}
		const { onChoose, autoShow, debug, ...others } = this.props
		const src = this.state.src || this.props.src;
		const wx = isWx();
		if (wx)
			others.onClick = this.chooseFile;

		return (<CommonAvatar src={src} style={bgStyle}
			{...others}
		>
			{
				(0, () => {
					if (!wx) {
						return <input name='img' onChange={this.imgChoose} accept="image/*" type="file" className="opac0 transparent full" />
					}
				})()
			}
		</CommonAvatar>)
	}

	preImg(file) {
		const url = preImgFromFile(file);
		this.setState({
			src: url
		})
	}

	imgChoose = (e) => {
		const file = e.target.files && e.target.files[0]
		this.preImg(file);
	}

	chooseFile = () => {
		const debug = this.props.debug;
		checkApi("chooseImage").then(() => {
			debug("开始选择图片")
			wx.chooseImage({
				count: this.props.count || 1, // 默认9
				sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
				success: (res) => {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					debug("选择succ-" + res.localIds.toString())

					if (this.props.autoShow) {
						this.setState({
							src: localIds,
							rawId: localIds
						})
						if (isIos()) {
							debug("ios 特殊处理")
							wx.getLocalImgData({
								localId: localIds.toString(), // 图片的localID
								success: function (res) {
									var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
									this.setState({
										src: localData,
										rawId: localIds
									})
								}
							});
						}
					}


					if (this.props.onChoose) {
						setTimeout(() => {
							// bug 延迟才可以
							this.props.onChoose(localIds)
						}, 250)
					}
				},
				fail: (err) => {
					$.toast("cimg->" + JSON.stringify(err))
				}
			});
		})


	}

	save(debug = () => { }) {
		debug("upload check")
		if (!this.state.rawId || !isWx()) {
			return Promise.resolve(null);
		}
		debug("upload begin-" + this.state.rawId.toString())
		return new Promise((s) => {
			// 直接上传给微信
			try {
				wx.uploadImage({
					localId: this.state.rawId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function (res) {
						debug("succ")
						var serverId = res.serverId; // 返回图片的服务器端ID
						// 传给服务器
						s(serverId);
					},
					fail: (err) => {
						debug("fail")
						debug(JSON.stringify(err).substr(0, 100))
					}
				});
			}
			catch (e) {
				debug("catch")
				debug(e)
			}

		})

	}
}

export default ImagePicker;