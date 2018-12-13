/**
 * 语音发送组件
 */
import PropTypes from "prop-types";
import RecordTime from "../../components/comment/recordTimeText";

// let wx = {
// 	startRecord: ({ success }) => { success({ localId: 1 }) },
// 	stopRecord: ({ success }) => success({ localId: 1 })
// };

export default class SpeakGroup extends React.Component {
	constructor(props) {
		super()

		this.state = {
			recordId: "",
			medId: "",
			duration: 0,
			status: props.status || "SPEAK_GOING"
		}
	}
	render() {
		return (
			<div className="sg_content">
				<div>
					{(() => {
						const cla = this.state.recordId ? "comment-speak-resay" : (this.state.status == "SPEAK_GOING" ? "comment-speak-going" : "comment-speak-finish")

						return (
							<div className="sg_speak">
								<div className={cla} onTouchStart={this.startRecord} onTouchEnd={this.finishRecord}></div>
								{
									(0, () => {
										if (this.state.recordId) {
											return <div onClick={this.playRecord} className="sg_txt_listen fs-small">试听({this.state.duration}s)</div>
										}
									})()
								}

							</div>
						);
					})()}
				</div>
				<RecordTime onClose={this.finishRecord} ref="recordTime" />
			</div>
		);
	}

	startRecord = (e) => {

		e.stopPropagation();
		e.nativeEvent.preventDefault();
		this.pressed = true;
		this.state.recordId = "";
		this.refs["recordTime"].show();

		this.start();
	}

	start() {
		wx.startRecord({
			success: () => {
				this.ts = Date.now();
				if (!this.pressed) {
					this.stop(true);
					return;
				}
				this.setState({
					status: "SPEAK_FINISH"
				})
			},
			fail: (err) => {
				console.log("fff", err);
				this.ts = 0;
			}
		});
	}

	stop(force) {

		wx.stopRecord({
			success: ({ localId }) => {
				const duration = Math.floor((Date.now() - this.ts) / 1000);
				if (duration < 2) {
					$.toast("录音时间太短")
					force = true;
				}
				this.state.recordId = force ? "" : localId;

				this.setState({
					status: force ? "SPEAK_GOING" : "SPEAK_FINISH_PLAY",
					duration: Math.floor((Date.now() - this.ts) / 1000)
				})
			}
		})
	}


	playRecord = () => {
		if (this.state.recordId) {
			wx.playVoice({
				localId: this.state.recordId
			})
		}
	}

	finishRecord = (e) => {
		e.stopPropagation();
		e.nativeEvent.preventDefault();
		this.pressed = false;
		if (this.state.status != "SPEAK_FINISH") {
			return;
		}
		this.refs["recordTime"].hide();

		this.stop();
	}

	upload = async () => {
		if (!this.state.recordId) {
			// $.toast("没有发现录音")
			return ""
		}

		return new Promise(s => {
			wx.uploadVoice({
				localId: this.state.recordId.toString(), // 需要上传的音频的本地ID，由stopRecord接口获得
				isShowProgressTips: 1, // 默认为1，显示进度提示
				success: function (res) {
					console.log("res", serverId);
					var serverId = res.serverId; // 返回音频的服务器端ID
					s(serverId)
				},
				fail: err => {
					console.error(err)
					$.toast(JSON.stringify(err));
					s("")
				}
			})
		})

	}
}

SpeakGroup.propTypes = {
	status: PropTypes.oneOf(["SPEAK_GOING", "SPEAK_FINISH", "SPEAK_RESAY"])
}
SpeakGroup.defaultProps = {
	status: "SPEAK_GOING"
}
