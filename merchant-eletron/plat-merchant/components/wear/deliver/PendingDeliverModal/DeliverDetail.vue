<template>
    <div :id="'modalId'+modalId">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="modalId" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
            <button type="button" class="btn btn-w-m btn-info" @click="print">打印取货小票</button>
            <button type="button" class="btn btn-w-m btn-info" @click="send">发货</button>
            <button type="button" class="btn btn-w-m btn-info" @click="cancle">取消订单</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
        <script>
            window.requireFFI = window.require;
        </script>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex';
    import uuid from 'uuid'
    import {TableEvent} from '~/components/TableEvent'
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'
    import { baseUtil, dateUtil } from '~/util'
    function TEcoding(str) {
        var iconv = require('iconv-lite')
        return iconv.encode(Buffer.from(str), 'gbk')
    }
    export default {
        props: ['id', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL', 'validateParams', 'item'],
        components: {
            LeaseDetailModalCopy
        },
        data() {
            return {
                modalId: uuid(),
                params: {
                    PAGE_OPEN: uuid()
                },
                deliverDetailItem: {
                    buyer: {
                        nickName: '',
                        telephone: ''
                    },
                    leaseRecord: {},
                    rxAddress: {}, // 收货地址
                    backShippingRecord: {},
                    leaseShippingRecord: {},
                    leaseStorage: {
                        detailImages: [],
                        mainImage: null,
                        slideImages: [],
                        lease: {},
                        storageView: {
                            props: [],
                            storage: {}
                        }
                    }
                },
                rxAddressId: ''
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById',
                apiLeaseRecordCancle: 'apiLeaseRecordCancle'
            }),
            print() {
                console.log('打印');
                console.log(this.deliverDetailItem);
                let receivePerson = baseUtil.getStaff().nickName
                let ship = '';
                // switch (this.deliverDetailItem.leaseShippingRecord.shippingRecord.shipper) {
                //     case 'JD':
                //         ship = '京东物流';
                //         break;
                //     case 'SF':
                //         ship = '顺丰物流';
                //         break;
                //     case 'YTO':
                //         ship = '';
                //         break;
                // }
                let printConfig = {
                    billNumber: this.deliverDetailItem.leaseRecord.billNumber,
                    // shipper: ship,
                    // logisticsCode: this.deliverDetailItem.leaseShippingRecord.shippingRecord.logisticsCode,
                    retailPrice: this.deliverDetailItem.leaseStorage.storageView.storage.retailPrice,
                    serial: this.deliverDetailItem.leaseStorage.storageView.storage.serial,
                    name: this.deliverDetailItem.leaseStorage.storageView.scientificName,
                    weight: this.deliverDetailItem.leaseStorage.storageView.storage.weight,
                    outStoreName: this.deliverDetailItem.outStore.name, // 发货店铺
                    receivePerson // 收货人
                }
                console.log('快递信息', printConfig);
                let templates = baseUtil.getTemplates()
                let printTemplateChecked = 'PICKUP';
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
                    // DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('快递单号'), TEcoding(printConfig.shipper + '：' + printConfig.logisticsCode));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('条码'), TEcoding(printConfig.serial + ''));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('名称'), TEcoding('' + printConfig.name));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('总质量'), TEcoding('' + printConfig.weight + 'g'));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('发货门店'), TEcoding('发货门店：' + printConfig.outStoreName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('收货人'), TEcoding(printConfig.receivePerson));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('价格'), TEcoding(printConfig.retailPrice + '元'));
                    var fff = DLL.TLXOutputLabel(buffer.readInt32LE(0), 1, 0)
                    var out = DLL.TLXCloseDocument(buffer.readInt32LE(0))
                    // var fff =  DLL.TLXOutputDocument(1, 1, 1, 0)
                    console.log(fff)
                } else {
                    alert('未能成功匹配模板，请上传相应的打印模板')
                }
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            send() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLICK_MODAL, {
                    detailParams: this.CONST_CLICK_MODAL,
                    recordId: this.deliverDetailItem.leaseRecord.id,
                    rxAddressId: this.rxAddressId,
                    refreshTable: this.refreshTable
                })
//                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            cancle() {
                let flag = confirm('确定取消订单吗?')
                if (flag) {
                    this.apiLeaseRecordCancle({
                        params: {
                            leaseRecordId: this.id
                        },
                        callBack: () => {
                            this.close()
                        }
                    });
                }
            },
            getRecordDetail() {
                let vm = this;
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.id
                    },
                    callBack(data) {
                        vm.rxAddressId = data.rxAddress.id
                        if (data) {
                            TableEvent.$emit(vm.params.PAGE_OPEN, data);
                            vm.deliverDetailItem = data;
                        }
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.getRecordDetail()
            });
        }
    }
</script>
