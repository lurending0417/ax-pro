<template>
	<div class="login_style">

		<el-card class="box-card">
			<h3 class="text_center margin_cls">喔喔百家后台管理</h3>
			<el-form :model="params" :rules="rules" ref="forms" label-width="100px" label-position="left" >
				<el-form-item label="用户名" prop="phone">
					<el-input v-model="params.phone" @keyup.enter.native="focusNext" ref="user"></el-input>
				</el-form-item>

				<el-form-item v-if="loginByPassword" label="密码" prop="pwd">
					<el-input v-model="params.pwd" ref="pwd" type="password" @keyup.enter.native="submitForm"></el-input>
				</el-form-item>

				<el-form-item  label="验证码" prop="code" v-else>
					<el-row>
						<el-col :span="12">
							<el-input type="text" ref="code" v-model="params.code" @keyup.enter.native="submitForm"></el-input>
						</el-col>
						<el-col :span="12" style="padding-left:20px;">
							<el-button style="width: 100%;" @click="sendCode" :disabled="sendBtnDisabled">
								{{sendBtnDisabled?interval +' 秒后重新发送':'发送验证码' }}</el-button>
						</el-col>
					</el-row>
				</el-form-item>

				<el-button type="text" @click="toggleLoginType">{{loginByPassword?'验证码登录':'密码登录'}}</el-button>

				<el-form-item label-width="180px">
					<el-button type="primary" @click="submitForm('params')">登录</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-alert style="margin-bottom: 20px;"
				  v-if="loginResult.fail"
				  type="error"
				  :closable="false"
				  :title="loginResult.message"
				  show-icon>
		</el-alert>
	</div>
</template>

<script>
	import api from '~/api'
	import {baseUtil} from '~/util'
	import {mapActions} from 'vuex'
export default {
	layout: 'login',
	data() {
		return {
			params: {
				phone: '',
				pwd: '',
				code: '',
				token: ''
			},
			loginResult: {
				fail: false,
				message: ''
			},
			rules: {
				phone: [
					{ message: '无效的手机号', trigger: 'blur', pattern: /^1[34578][0-9]{9}$/}
				],
				pwd: [
					{ message: '请输入密码', trigger: 'blur' }
				]
			},
			interval: 60,
			intervalId: 0,
			loginByPassword: true,
			sendBtnDisabled: false
		};
	},
	methods: {
		...mapActions('auth', {
			sendCodeStore: 'sendCode'
		}),
		focusNext() {
			if (this.loginByPassword) {
				this.$refs.pwd.focus();
			} else {
				this.$refs.code.focus();
			}
		},
		submitForm(formName) {
			this.$refs['forms'].validate((valid) => {
				if (valid) {
					this.login()
				} else {
					this.$message('error submit!!');
					return false;
				}
			});
		},
		login() {
			this.checkToken();
			let {phone, token, code, pwd} = this.params;
			if (this.loginByPassword) { // 密码登录
				api.request({
					url: api.url.user.login.pwd,
					params: {phone, pwd},
					success: (json) => {
						baseUtil.login(json.result);
						this.$router.push("/welcome");
					},
					fail: (json) => {
						this.loginResult = {
							fail: true,
							message: json.message
						}
					}
				});
			} else { // code登录
				api.request({
					url: api.url.user.login.sms,
					params: {phone, token, code},
					success: (json) => {
						baseUtil.login(json.result);
						this.$router.push("/welcome");
					},
					fail: (json) => {
						this.loginResult = {
							fail: true,
							message: json.message
						}
					}
				});
			}
		},
		checkToken() {
			let token = api.getToken();
			if (token) {
				baseUtil.cookie.delete('access-token')
			}
		},
		sendCode() {
			let {phone} = this.params;
			this.checkToken();
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
					this.interval = 60;
					this.sendBtnDisabled = false;
				} else {
					this.interval = this.interval - 1;
				}
			}, 1000)
		},
		toggleLoginType() {
			this.loginByPassword = !this.loginByPassword
		}
	},
	beforeDestroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId)
		}
	},
	mounted() {
		this.$refs.user.focus()
	}
}
</script>

<style>
	.login_style{
		margin: 10%  20% auto 50%;
	}
	.margin_cls{
		margin: 20px auto;
	}
</style>

