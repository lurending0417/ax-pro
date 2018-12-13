<template>
	<el-dialog append-to-body
		title="密码设置"
		:visible.sync="options.visible"
		width="30%"
		center>
		<el-form label-position="center" label-width="80px" :model="params">
			<el-form-item label="密码" prop="pwd">
				<el-input v-model="params.pwd" type="password"></el-input>
			</el-form-item>

			<el-form-item  label="验证码" prop="code">
				<el-row>
					<el-col :span="12">
						<el-input type="text" v-model="params.code" @keyup.enter.native="submitForm"></el-input>
					</el-col>
					<el-col :span="12" style="padding-left:20px;">
						<el-button style="width: 100%;" @click="sendCode" :disabled="sendBtnDisabled">
							{{sendBtnDisabled?interval +' 秒后重新发送':'发送验证码' }}</el-button>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="submitForm">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from '~/api'
	import {mapActions} from 'vuex'
	export default {
		props: ['options'],
		data() {
			return {
				params: {
					pwd: '',
					token: '',
					code: ''
				},
				interval: 60,
				intervalId: 0,
				sendBtnDisabled: false
			}
		},
		methods: {
			...mapActions('auth', {
				sendCodeStore: 'sendCode'
			}),
			close() {
				this.$emit('close')
			},
			submitForm() {
				api.request({
					url: api.url.user.login.set,
					params: this.params,
					success: (json) => {
						this.$message({
							message: '密码设置成功',
							type: 'success'
						});
						this.close()
					}
				});
			},
			sendCode() {
				let {phone} = this.options;
				this.sendCodeStore({
					phone,
					callback: (result) => {
						this.params.token = result;
						this.startCount()
					}
				})
			},
			startCount() {
				this.sendBtnDisabled = true;
				this.intervalId = setInterval(() => {
					if (this.interval === 0) {
						clearInterval(this.intervalId)
						this.sendBtnDisabled = false;
					} else {
						this.interval = this.interval - 1;
					}
				}, 1000)
			}
		}
	}
</script>
