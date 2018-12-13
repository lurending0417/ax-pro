<template>
    <div>
        <div style="padding: 0;">
            <SelectList @getForm="getForm" ref="selectList"></SelectList>
            <p class="help-block" v-if="hasSelected"><span style="color:#ff3232;">{{amount}}</span>人符合查询条件，请选择下一步操作内容。</p>
        </div>
        <div style="text-align: center;padding-top:10px;">
            <button class="btn btn-success form-group-margin" @click="search">查询</button>
            <button class="btn btn-primary form-group-margin" @click="send" :disabled="!hasSelected">发布</button>
            <button class="btn btn-default form-group-margin" @click="cancle">取消</button>
        </div>
    </div>
</template>
<script>
    import SelectList from './SelectList'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapMutations, mapState} from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'item', 'passed', 'form'],
        components: {
            SelectList
        },
        data() {
            return {
                amount: 88,
                hasSelected: false
            }
        },
        computed: {
            ...mapState('userManage/notice', {
                queryConditions: 'queryConditions'
            })
        },
        methods: {
            ...mapMutations('userManage/notice', {
                resetQueryConditions: 'resetQueryConditions'
            }),
            ...mapActions('userManage/notice', {
                apiPutMessageTemplate: 'apiPutMessageTemplate',
                apiPostMessageTemplateSend: 'apiPostMessageTemplateSend',
                apiGetCustomerCount: 'apiGetMerchantCustomerCount'
            }),
            getForm(form) {
                this.resetQueryConditions(form)
            },
            search() {
                this.apiGetCustomerCount({
                    params: {
                        templateId: this.item.id,
                        ...this.queryConditions
                    },
                    callback: (data) => {
                        this.amount = data
                        this.hasSelected = true
                    }
                })
            },
            send() {
                this.apiPostMessageTemplateSend({
                    params: {
                        templateId: this.item.id,
                        ...this.queryConditions
                    },
                    callback: () => {
                        this.cancle()
                    }
                })
            },
            cancle() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                if (this.passed) {
                    this.passed.changeCurrCpn('NoticeSettingMain')
                }
            },
            initData() {
                this.hasSelected = false
                this.$refs.selectList.$emit('init')
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData();
                this.apiPutMessageTemplate({ // 修改
                    params: {
                        ...this.form,
                        templateId: this.item.id
                    },
                    callback: () => {
                    }
                })
            })
        }
    }
</script>
