<template>
    <div  :id="'modalId'+CONST_CLICK_MODAL">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="CONST_CLICK_MODAL" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
            <button type="button" class="btn btn-w-m btn-info" @click="print">打印收货信息</button>
            <ButtonWithModal
                :btnProps="{
                                btnClasses: ['btn btn-w-m btn-info'],
                                btnName: '收货'
                            }"
                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL_1+'receive',
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL_1+'receive',
                                titleName: '收货'
                            }">
                <ReceiveRecord
                    slot="main"
                    :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+'receive'"
                    :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL_1+'receive'"
                    :refreshTable="refreshTable"
                >
                </ReceiveRecord>
            </ButtonWithModal>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
        <script>
            window.requireFFI = window.require;
        </script>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import ReceiveRecord from './ReceiveRecord';
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {TableEvent} from '~/components/TableEvent'
    import {mapActions, mapGetters} from 'vuex';
    import uuid from 'uuid'
    import {baseUtil} from '~/util';
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'

    function TEcoding(str) {
        var iconv = require('iconv-lite')
        return iconv.encode(Buffer.from(str), 'gbk')
    }
    export default {
        components: {
            LeaseDetailModalCopy,
            ButtonWithModal,
            ReceiveRecord
        },
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        data() {
            return {
                express: {
                    shipper: '',
                    logisticsCode: ''
                },
                params: {
                    PAGE_OPEN: uuid()
                },
                detailData: {},
                CONST_CLOSE_MODAL_1: uuid(),
                CONST_CLICK_MODAL_1: uuid()
            }
        },
        computed: {
            ...mapGetters('merchant/storeManageMain', {
                reginData: 'reginData'
            })
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById',
                apiLeaseRecordCancle: 'apiLeaseRecordCancle'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            print() {
                let receivePerson = baseUtil.getStaff().nickName
                let ship = '';
                switch (this.express.shipper) {
                    case 'JD':
                        ship = '京东物流';
                        break;
                    case 'SF':
                        ship = '顺丰物流';
                        break;
                    default:
                        ship = '京东物流';
                        break;
                }
                let printConfig = {
                    billNumber: this.detailData.leaseRecord.billNumber,
                    shipper: ship,
                    logisticsCode: this.express.logisticsCode,
                    serial: this.detailData.leaseStorage.storageView.storage.serial,
                    name: this.detailData.leaseStorage.storageView.scientificName,
                    weight: this.detailData.leaseStorage.storageView.storage.weight,
                    outStoreName: this.detailData.outStore.name, // 发货店铺
                    receivePerson // 收货人
                }
                console.log('快递信息', printConfig);
                let templates = baseUtil.getTemplates()
                let printTemplateChecked = 'LOGISTICS';
                if (templates[printTemplateChecked]) {
                    console.log('=====')
                    var ffi = requireFFI('ffi')
                    var ref = requireFFI('ref')
                    var intP = ref.refType('int');
                    var DLL = ffi.Library('./TLXLabelPaint', {
                        'TLXOpenDocumentA': ['int', ['string', intP]],
                        'TLXSetNamedVariableA': ['int', ['int', 'string', 'string']],
                        'TLXSetNamedVariableW': ['int', ['int', 'string', 'string']],
                        'TLXOutputLabel': ['int', ['int', 'int', 'int']],
                        'TLXOutputDocument': ['int', ['int', 'int', 'int', 'int']],
                        'TLXOpenDocumentXMLA': ['int', ['string', intP, 'bool']],
                        'TLXOpenDocumentXMLW': ['int', ['string', intP, 'bool']],
                        'TLXNamedVarsAddVarDataA': ['int', ['int', 'int', 'string', 'string']],
                        'TLXEditTemplateXMLA': ['int', ['string', intP]],
                        'TLXCloseDocument': ['int', ['int']]
                    })
                    var buffer = Buffer.alloc(32);
                    DLL.TLXOpenDocumentXMLA(TEcoding(templates[printTemplateChecked]), buffer, false);
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('订单号'), TEcoding('订单号：' + printConfig.billNumber));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('快递单号'), TEcoding(printConfig.shipper + '：' + printConfig.logisticsCode));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('条码'), TEcoding(printConfig.serial));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('名称'), TEcoding('' + printConfig.name));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('总质量'), TEcoding('' + printConfig.weight + 'g'));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('发货门店'), TEcoding('发货门店：' + printConfig.outStoreName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('收货人'), TEcoding(printConfig.receivePerson));
                    var fff = DLL.TLXOutputLabel(buffer.readInt32LE(0), 1, 0)
                    var out = DLL.TLXCloseDocument(buffer.readInt32LE(0))
                    // var fff =  DLL.TLXOutputDocument(1, 1, 1, 0)
                    console.log(fff)
                } else {
                    alert('未能成功匹配模板，请上传相应的打印模板')
                }
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                vm.express = {
                    shipper: vm.item.shipperNameBack,
                    logisticsCode: vm.item.logisticsCodeBack
                };
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.id
                    },
                    callBack(data) {
                        if (data) {
                            TableEvent.$emit(vm.params.PAGE_OPEN, data);
                            vm.detailData = data
                        }
                    }
                })
            });
        }
    }
</script>

<style scoped>
    fieldset {
        padding: 10px 20px;
        text-align: center;
    }

    fieldset div {
        text-indent: 2em;
    }

    .footer_btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .order_style {
        text-align: left;
        font-weight: 700;
        font-size: inherit;
        color: #676a6c;
    }
</style>
