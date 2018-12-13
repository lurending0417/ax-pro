<template>
    <div>
        <div class="modal-body">
            <div>
                <div class="config_cls" style="margin-top:0">
                    <span>姓名：{{personConfig.name}}</span>
                </div>
                <div class="config_cls">
                    <span>岗位：{{personConfig.duty}}</span>
                </div>
                <div class="config_cls">
                    <span>性别：{{personConfig.gender==='FEMALE'?'女':'男'}}</span>
                </div>
                <div class="config_cls">
                    <span>账号：{{personConfig.telephone}}</span>
                </div>
            </div>
            <fieldset style="padding-left: 20px;padding-right:20px;">
                <legend style="text-align: center;">修改密码</legend>
                <form class="form-horizontal">
                    <div class="line_wrap" style="position: relative;">
                        <label class="label_cls">新密码</label>
                        <div class="input_wrap">
                            <input type="password" class="form-control width_limit flo_right_forget"
                                   placeholder="请输入6—10位英文或数字"
                                   style="width: 97%;"
                                   @keyup.13="enterOnPasswordInputForget" v-model="password">
                        </div>
                        <span class="remark_cls">{{remark.password}}</span>
                    </div>
                    <div class="line_wrap" style="position: relative;">
                        <label class="label_cls">确认密码</label>
                        <div class="input_wrap">
                            <input type="password" class="form-control width_limit flo_right_forget"
                                   placeholder="密码"
                                   ref="rePasswordInputForget"
                                   @keyup.13="enterOnRePasswordInputForget"
                                   @input="changeRePassword">
                        </div>
                        <span class="remark_cls">{{remark.rePassword}}</span>
                    </div>
                    <div class="form-group" style="text-align:center;">
                        <button class="btn btn-info" type="button" @click="modifyPassword">确定</button>
                    </div>
                </form>
            </fieldset>
            <footer class="text-center" style="margin-top:20px;">版本号：{{merchantVersion}}</footer>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, objectUtil} from '~/util'
    import pkg from '~/package.json'

    export default {
        props: ['modalParams'],
        data() {
            return {
                personConfig: {
                    name: '',
                    duty: '',
                    gender: '',
                    telephone: ''
                },
                password: '',
                remark: {
                    password: '',
                    rePassword: ''
                },
                merchantVersion: ''
            }
        },
        watch: {
            'password': function (val) {
                let isTrue = /^[a-zA-Z0-9]{6,10}$/.test(val);
                if (!isTrue) {
                    this.remark.password = '密码有误，请输入6—10位英文或数字';
                } else {
                    this.remark.password = '';
                }
            }
        },
        methods: {
            ...mapActions('login', {
                resetPasswordSettingAction: 'resetPasswordSettingAction'
            }),
            modifyPassword() {
                let vm = this;
                this.resetPasswordSettingAction({
                    sendParams: {
                        password: this.password
                    },
                    callBack: () => {
                        ButtonWithModalEvent.$emit(vm.modalParams.CONST_CLOSE_MODAL);
                    }
                });
            },
            enterOnPasswordInputForget() {
                this.$refs.rePasswordInputForget.focus();
            },
            enterOnRePasswordInputForget() {
                this.modifyPassword();
            },
            changeRePassword() {
                if (event.target.value !== this.password) {
                    this.remark.rePassword = '两次输入密码不一致，请重新输入'
                } else {
                    this.remark.rePassword = ''
                }
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.modalParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.modalParams.CONST_CLICK_MODAL, () => {
                let temp = baseUtil.getStaff()
                objectUtil.replaceSameFieldsValue(temp, this.personConfig);
                let dutyStr = '';
                baseUtil.getStaff().duties.forEach((item, index) => {
                    dutyStr += item.name;
                    dutyStr += (index === baseUtil.getStaff().duties.length - 1) ? '' : ',';
                })
                this.personConfig.duty = dutyStr;
            });
            this.merchantVersion = pkg.version;
        }
    }
</script>
<style scoped>
    .config_cls {
        margin: 10px 0;
        font-weight: 700;
    }

    .line_wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
    }

    .input_wrap {
        overflow: hidden;
        flex-grow: 1;
        position: relative;
    }

    .label_cls {
        margin-right: 20px;
    }

    .remark_cls {
        position: absolute;
        top: 100%;
        left: 23%;
        font-size: 12px;
        color: red;
    }

    .form-control {
        margin: 0;
    }

    .flo_right_forget {
        float: right;
    }
</style>
