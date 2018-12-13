<template>
    <div class="btn-group">
        <button data-toggle="dropdown" class="btn btn-danger dropdown-toggle" @click="changeStatus"
                id="btnTargetDropdownMenu" style="min-width: 160px;">
            {{btnName}} <span class="caret"></span></button>
        <ul class="dropdown-menu" style="display: block;" v-show="isShow">
            <li v-for="(item, index) in dropDownList" @click="chooseItem(item, index)"><a href="#">{{item.name}}</a></li>
        </ul>
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                titleName: '发送通知',
                modalClasses: ['modal-lg']
            }">
            <UserSendNotice slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :count="count"
                            :customerId="customerIds"
            ></UserSendNotice>
        </ModalItem>
    </div>
</template>

<script>
    import uuid from 'uuid'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import ModalItem from '~/components/ModalItem'
    import UserSendNotice from './UserSendNotice'
    import {mapState, mapMutations} from 'vuex'
    export default {
        components: {
            ModalItem,
            UserSendNotice
        },
        props: {
            dropDownList: Array,
            sendList: Array
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                isShow: false,
                curIndex: 0,
                count: 0,
                customerIds: ''
            }
        },
        computed: {
            ...mapState('userManage/notice', {
                total: 'total',
                curTotal: 'curTotal',
                customerId: 'customerId',
                userList: 'userList'
            }),
            btnName() {
                if (this.dropDownList.length > 0) {
                    return this.dropDownList[this.curIndex].name
                } else {
                    return ''
                }
            }
        },
        methods: {
            ...mapMutations('userManage/notice', {
                resetCustomerId: 'resetCustomerId'
            }),
            chooseItem(item, index) {
                this.curIndex = index;
                this.isShow = false;
                this.sendNotice(item.id)
            },
            sendNotice(symbol) {
                ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL, symbol)
                if (symbol === 'CHOOSE') {
                    this.count = this.sendList.length
                    this.resetCustomerId(this.sendList.join())
                    this.customerIds = this.customerId
                } else if (symbol === 'CURRENT') {
                    if (this.total <= 10) {
                        this.count = this.total
                    } else {
                        this.count = 10
                    }
                    this.customerIds = this.userList
                } else {
                    this.count = this.total;
                    this.customerIds = ''
                }
            },
            changeStatus() {
                this.isShow = !this.isShow
            },
            initData() {
                this.isShow = false;
                this.curIndex = 0;
                this.count = 0;
                this.customerIds = '';
            }
        },
        mounted() {
            this.resetCustomerId('')
            this.initData()
        }
    }
</script>

<style scoped>

</style>
