<template>
    <div>
        <div class="row">
            <div class="col-lg-offset-10" style="text-align: right;margin-right:20px;">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '新增'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                        titleName: '新增'
                    }"
                >
                    <ReceiptAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                        :receiptTypes="receiptTypes"
                        :refreshTable="getReceiptList"
                    >
                    </ReceiptAdd>
                </ButtonWithModal>
            </div>
        </div>
        <TableCpn :heads="[
                {propName: 'name', name: '小票名称'},
                {propName: 'typeName', name: '小票类型'},
                {tag:'BUTTON',name: '操作'}
            ]"
                  :items="tableView">
            <div v-for="(item,index) in tableView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '修改'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + index,
                        titleName: '修改'
                    }"
                >
                    <ReceiptAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL + index"
                        :receiptTypes="receiptTypes"
                        :refreshTable="getReceiptList"
                        :item="item"
                    >
                    </ReceiptAdd>
                </ButtonWithModal>
            </div>
        </TableCpn>
    </div>
</template>

<script>
    import TableCpn from '~/components/Table'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ReceiptAdd from '~/components/systemSetting/receiptManage/ReceiptAdd'
    import uuid from 'uuid'
    import api from '~/api'
    import {baseUtil} from '~/util'

    export default {
        components: {
            TableCpn,
            ButtonWithModal,
            ReceiptAdd
        },
        data() {
            return {
                tableView: [],
                receiptTypes: [],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        methods: {
            getReceiptList() {
                let params = {
                    type: '',
                    query: ''
                }
                api.request({
                    url: api.consts._GOODS_RECEIPT_TEMPLATE_LIST,
                    method: 'get',
                    params,
                    success: (data) => {
                        this.receiptTypes = baseUtil.getEnumsByKey('receiptType')
                        data.rows.map(item => {
                            item.typeName = this.receiptTypes.find(ele => item.type === ele.id).name
                            return item
                        })
                        this.tableView = data.rows
                    }
                })
            }
        },
        created() {
            this.getReceiptList()
        }
    }
</script>
