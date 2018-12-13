<template>
    <form class="form-horizontal" style="margin-top: 16px;">
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">接班人</label>
            <div class="col-sm-6">
                <select class="form-control" ref="staff" @change="changeStaff">
                    <option :value="staff.id" v-for="staff in nextPersonList" :data-tel="staff.telephone">
                        {{staff.nickName}}
                    </option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">登录密码</label>
            <div class="col-sm-6">
                <input type="password" class="form-control" ref="password" @blur="validatePassword">
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">备注</label>
            <div class="col-sm-6">
                <!--<input type="password" class="form-control" ref="remark" v-model="remark">-->
                <textarea class="form-control" v-model="remark"></textarea>
            </div>
        </div>

        <div class="modal-footer" style="text-align: center">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="clickAsure">确定</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'
    import baseUtil from '../../../util/baseUtil';

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'wareHouses', 'item'],
        data() {
            return {
                nextPersonList: [],
                remark: ''
            }
        },
        methods: {
            ...mapActions('retail/offlineRetail/handoverBill', {
                confirmdHandoverBill: 'confirmdHandoverBill',
                getHandoverBills: 'getHandoverBills',
                resetUserPassword: 'resetUserPassword'
            }),
            restoreStatus() {
                this.remark = '';
                this.$refs.staff.value = '';
                this.$refs.password.value = '';
            },
            clickAsure() {
                let that = this
                this.confirmdHandoverBill({
                    callback: () => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        this.getHandoverBills({});
                    },
                    sendParams: {
                        recordId: that.item.id,
                        staffId: that.$refs.staff.value,
                        staffPwd: that.$refs.password.value,
                        confirmMsg: that.remark
                    }
                });
            },
            changeStaff() {
                this.$refs.password.value = ''
            },
            validatePassword() {
                if (!event.target.value) {
                    alert('密码不能为空');
                } else {
                    // let tel = '';
                    // this.nextPersonList.forEach((person) => {
                    //     if (person.id === this.$refs.staff.value) {
                    //         tel = person.telephone
                    //     }
                    // })
                    // this.resetUserPassword({
                    //     callback: () => {
                    //     },
                    //     sendParams: {
                    //         telephone: tel,
                    //         smsToken: '1111',
                    //         smsCode: '1111',
                    //         password: event.target.value,
                    //         ip: '10.0.0.252',
                    //         client: 'PC'
                    //     }
                    // })
                }
            }
        },
        mounted() {
            // 获取当前店铺所有店员，筛选出其他店员
            let otherStaffs = [];
            let ownId = baseUtil.getUser().id;
            baseUtil.getMetadataStaffs().forEach((staff) => {
                if (ownId !== staff.id) {
                    otherStaffs.push(staff);
                }
            })
            this.nextPersonList = otherStaffs;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log('restore');
                this.restoreStatus()
            })
        }
    }
</script>

<style scoped>
    .select_item {
        width: 50%;
        margin: 50px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
