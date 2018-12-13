<template>
    <div class="loginStyle">
        <el-card class="box-card">
            <h3 class="text-center">易戴易美·平台管理端</h3>
            <el-form :label-position="labelPosition" label-width="80px" :model="params" ref="loginForm">
                <el-form-item label="用户名" prop="telephone">
                    <el-input v-model="params.telephone" @keyup.native="keyup"></el-input>
                </el-form-item>
                <el-form-item v-if="loginByPwd" label="密码" prop="password">
                    <el-input type="password" v-model="params.password" @keyup.native="keyup"></el-input>
                </el-form-item>
                <el-form-item v-if="loginByRand" label="验证码" prop="smsCode">
                    <el-row>
                        <el-col :span="12">
                            <el-input type="text" v-model="params.smsCode" @keyup.enter.native="submitForm"></el-input>
                        </el-col>
                        <el-col :span="12" style="padding-left:20px;">
                            <el-button style="width: 100%;" @click="sendRand" :disabled="sendBtnDisabled">{{sendBtnTitle}}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-button type="text" @click="toggleLoginType">{{loginTypeName}}</el-button>
                <el-alert style="margin-bottom: 20px;"
                          v-if="loginResult.fail"
                          type="error"
                          :closable="false"
                          :title="loginResult.message"
                          show-icon>
                </el-alert>
                <el-form-item style="text-align: right;">
                    <el-button @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script>

    import api from "~/api"

    import {baseUtil} from "~/util"

    export default {
        layout: 'login',
        data() {
            return {
                labelPosition: 'left',
                loginResult: {
                    fail: false,
                    message: ''
                },
                loginByRand: false,
                loginByPwd: true,
                loginTypeName: '验证码登录',
                sendBtnDisabled: false,
                sendBtnTitle: '发送验证码',
                countDown: 0,
                params: {
                    telephone: '',
                    password: '',
                    smsCode: '',
                    smsToken: '',
                    client: 'PLAT'
                }
            };
        },
        watch: {
            'countDown': function (value) {
                if (value > 0) {
                    this.sendBtnDisabled = true;
                    this.sendBtnTitle = '' + value + '秒后重发'
                } else {
                    this.sendBtnDisabled = false;
                    this.sendBtnTitle = '发送验证码';
                }
            }
        },
        mounted() {
            if (baseUtil.getAccessToken()) {
                this.$router.push("/dashboard");
            }
        },
        methods: {
            resetForm() {
                this.$refs.loginForm.resetFields();
            },
            keyup() {
                this.loginResult = {
                    fail: false,
                    message: ''
                }
            },
            toggleLoginType() {
                this.loginByRand = !this.loginByRand;
                this.loginByPwd = !this.loginByPwd;
                this.loginTypeName = this.loginByRand ? '密码登录' : '验证码登录';
                this.params.smsToken = '';
                this.params.smsCode = '';
                this.params.password = '';
            },
            sendRand() {
                api.request({
                    url: api.url.sms.sms.rand.send,
                    params: {
                        telephone: this.params.telephone,
                        sign: baseUtil.sms.sign(this.params.telephone)
                    },
                    success: (json) => {
                        this.params.smsToken = json.result;
                        this.countDown = 90;
                        this.startCountDown();
                    }
                });
            },
            startCountDown() {
                if (this.countDown > 0) {
                    setTimeout(this.startCountDown, 1000);
                    this.countDown = this.countDown - 1;
                }
            },
            submitForm() {
                api.request({
                    url: api.url.user.login,
                    params: this.params,
                    success: (json) => {
                        baseUtil.login(json.result);
                        this.$router.push("/dashboard");
                    },
                    fail: (json) => {
                        this.loginResult = {
                            fail: true,
                            message: json.message
                        }
                    }
                });

            }
        }
    }
</script>

<style>
    .loginStyle {
        width: 400px;
        margin-top: 10%;
        margin-left: 58%;
    }
</style>
