<template>
    <div>
        <div class="modal-body">
            <TableCpn :heads="heads" :items="tranRecords"></TableCpn>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="close">关闭</button>
        </div>
    </div>
</template>
<script>
    import TableCpn from '~/components/Table'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapState} from 'vuex'
    import {baseUtil} from '~/util'

    export default {
        components: {
            TableCpn
        },
        data() {
            return {
                heads: [],
                type: '',
                item: {}
            }
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'page', 'accountType'],
        computed: {
            ...mapState('account/statement', {
                tranRecords: 'tranRecords'
            })
        },
        methods: {
            ...mapActions('account/statement', {
                getGoldTranRecored: 'getGoldTranRecored'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            chooseTable() {
                if (this.page === 'cash') {
                    this.heads = [
                        {propName: 'createTime', name: '时间'},
                        {propName: 'billNumber', name: '流水号'},
                        {propName: 'balance', name: '发生金额'}
                    ]
                } else if (this.page === 'lease') {
                    this.heads = [
                        {propName: 'createTime', name: '时间'},
                        {propName: 'billNumber', name: '订单号'},
                        {propName: 'balance', name: '发生金额'}
                    ]
                } else {
                    this.heads = [
                        {propName: 'createTime', name: '时间'},
                        {propName: 'billNumber', name: '流水号'},
                        {propName: 'billNumber', name: '关联单号'},
                        {propName: 'balance', name: '重量'}
                    ]
                }
            },
            getData() {
                this.getGoldTranRecored({
                    billType: this.type,
                    startYmd: this.item.billYmd,
                    endYmd: this.item.billYmd,
                    ownerId: baseUtil.getMerchantId(),
                    accountType: this.accountType
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, ({titleName, type, item}) => {
                document.getElementById('modal' + this.CONST_CLICK_MODAL).innerHTML = titleName
                this.type = type;
                this.item = item;
                this.chooseTable()
                this.getData();
            })
        }
    }
</script>
