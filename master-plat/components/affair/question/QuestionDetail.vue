<template>
	<el-dialog append-to-body
		:title="options.modalTitle"
		:visible.sync="options.visible"
	    :close-on-click-modal="false"
		width="50%"
		center>
		<el-row class="row m-b-s" type="flex">
			<span class="m-r-m"><strong>当前状态：</strong>{{result.status}}</span>
		</el-row>
		<el-row class="row m-b-s" type="flex">
			<span class="m-r-m"><strong>提问者昵称：</strong>{{result.user.nick}}</span>
			<span class="m-r-m"><strong>大师姓名：</strong>{{result.master.nick}}</span>
		</el-row>

		<div class="question_wrap">
			<div class="flex_question_wrap">
				<span class="avatar">
					<img :src="result.user.avatar" style="width: 50px;">
				</span>
				<span class="nick">{{result.user.nick}}</span>
				<span>{{renderTime(result.createTime)}}</span>
			</div>
			<div>
			<span>{{result.content}}</span>
			<div class="img_list" v-if="result.attaches && result.attaches.length > 0">
				<img v-for="(item, index) in result.attaches" :key="index" :src="item.path" alt="">
			</div>
			</div>
		</div>

		<div v-if="result.replies && result.replies.length > 0">
			<div class="question_wrap" v-for="(item, index) in result.replies" v-bind:key="item.id">
				<div class="flex_question_wrap">
					<span class="avatar">
						<img :src="item.user.avatar" style="width: 50px;">
					</span>
					<span class="nick">{{item.user.nick}}</span>
					<span>{{renderTime(item.createTime)}}</span>
				</div>
				<div>
					<div class="player_wrap" v-if="item.voicePath">
						<!--:style="{width: `${20*item.voiceDuration}px`}" -->
						<span class="player" @click="play(item, index)" style="width: 100px;background-color: #fff;">
							<span class="button_cls">{{item.voiceDuration}}s</span>
							<audio ref="audio">
								<source :src="item.voicePath">
								Your browser does not support the audio tag.
							</audio>
						</span>
						<!--{{item.player && item.player.ended?'':item.playText}}-->
						<span class="m-r-s">{{item.playText}}</span>
						<el-button type="danger" round size="mini" @click="transformText(item)">转文字</el-button>
						<el-button type="success" round size="mini" @click="saveResult(item)">保存结果</el-button>
					</div>

					<el-input
						type="textarea"
						:rows="3"
						v-if="item.voicePath"
						v-model="item.voiceRecognition">
					</el-input>

					<div v-if="!item.voicePath">{{item.content}}</div>
					<div class="img_list" v-if="item.attaches && item.attaches.length > 0">
						<img v-for="(item, index) in item.attaches" :key="index" :src="item.path" alt="">
					</div>
				</div>
			</div>
		</div>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from '~/api'
	import {mapGetters} from 'vuex'
	import {renderUtil} from "~/util"
	export default {
		props: ['options'],
		data() {
			return {
				timer: 0,
				result:  {
					content: "",
					createTime: 0,
					id: "",
					master: {
						nick: ""
					},
					replies: [
						{
							content: "",
							createTime: 0,
							id: "",
							type: "", //MASTER_REPLAY
							user: {
								avatar: "",
								id: "",
								nick: ""
							},
							voiceDuration: 0,
							voiceLength: 0,
							voicePath: "",
							voiceRecognition: "",
							voiceRecognitionConfirmed: false
						}
					],
					status: "", // NO_REPLY
					user: {
						avatar: "",
						id: "",
						master: false,
						nick: "",
					}
				}
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			})
		},
		methods: {
			renderTime(date) {
				return renderUtil.renderTime(date)
			},
			saveResult(reply) {
				api.request({
					url: api.url.question.recognition.confirm,
					params: {replyId: reply.id, content: reply.voiceRecognition},
					success: (json) => {
						this.$message('操作成功')
					}
				})
			},
			transformText(reply) {
				api.request({
					url: api.url.question.recognition.get,
					params: {replyId: reply.id},
					success: (json) => {
						reply.voiceRecognition = json.result;
					}
				})
			},
			play(item, index) {
				let target = event.target;
				if (target.children.length > 0) {
					item.player = target.children[1];
				} else {
					item.player = target.parentNode.children[1];
				}
				if (item.player) {
					if (item.player.paused) {
						item.player.play()
						item.playText = '播放中';
						this.timer = setTimeout(() => {
							item.playText = ""
						}, item.player.duration * 1000 - item.player.currentTime * 1000)
					} else {
						item.player.pause()
						item.playText = '已暂停'
						clearTimeout(this.timer)
					}
					this.result.replies.splice(index, 1, item)
				}
			},
			close() {
				this.dialogImageUrl = ''
				this.$emit('close', 'refresh')
			},
			getQuestionDetail(questionId) {
				api.request({
					url: api.url.question.recognition.detail,
					params: {questionId},
					success: (json) => {
						let tempReplies = json.result.replies || [];
						tempReplies = tempReplies.map(item => {
							if (!item.voiceRecognition) {
								item.voiceRecognition = ''
							}
							if (item.voicePath) {
								item.player = null;
								item.playText = ''
							}
							return item
						});
						json.result.replies = tempReplies;
						this.result = json.result
					}
				})
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.getQuestionDetail(this.options.row.id)
				}
			}
		}
	}
</script>

<style scoped>
	.question_wrap{
		border-radius: 4px;
		border: 1px solid #d6d6d6;
		padding: 10px;
		margin-bottom: 10px;
	}
	.flex_question_wrap{
		display: flex;
		align-items: center;
		margin-bottom:10px;
	}
	.flex_question_wrap .nick{
		flex-grow: 1;
		margin-left: 20px;
	}
	.avatar{
		width: 50px;
		height: 50px;
		overflow: hidden;
	}
	.img_list{
		display: flex;
		margin-top: 10px;
	}
	.img_list>img{
		height: 50px;
		margin-right: 10px;
	}
	.player_wrap{
		display: flex;
		align-items: center;
		margin-bottom: 5px;
	}
	.player{
		margin-right:10px;
		display: inline-block;
		height: 25px;
		border: 1px solid #409EFF;
		text-align: center;
		border-radius: 15px;
		font-size: 14px;
		line-height: 25px;
	}
	.player:hover{
		cursor: pointer;
	}
</style>
