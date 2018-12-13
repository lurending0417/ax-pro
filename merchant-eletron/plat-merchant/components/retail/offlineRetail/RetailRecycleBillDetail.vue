<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label>单号：</label>{{getRetailRecycleBillItem.billNumber}}
            </div>
        </div>
        <fieldset style="width: 60%" v-if="showUserIsMember" >
            <legend>客户信息</legend>
            <div class="form-inline" style="margin-bottom: 15px">
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getRetailRecycleBillItem.customer.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getRetailRecycleBillItem.customer.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getRetailRecycleBillItem.customer.createTime }}</label>
            </div>
        </fieldset>

        <div class="form-inline" style="margin-top: 20px">
            <div class="form-group form-group-margin">
                <label>回收仓库：</label>{{getRetailRecycleBillItem.wareHouseId}}
            </div>
            <div style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '打印模板'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                modalClasses: [''],
                                titleName: '选择打印模板'
                            }">
                    <PrintTemplate slot="main"
                                   :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"></PrintTemplate>
                </ButtonWithModal>
            </div>
        </div>

        <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
            <thead>
            <tr>
                <th>序号</th>
                <th>金属</th>
                <th>计价方式</th>
                <th>毛重</th>
                <th>折旧率</th>
                <th>净重</th>
                <th>工费（元/克）</th>
                <th>金价（元/克）</th>
                <th>其他扣除</th>
                <th>回收金额</th>
                <th>付款状态</th>
                <th>付款人</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in getRetailRecycleBillDetailView">
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">{{item.metalId}}</td>
                <td class="table-bordered">{{item.priceType}}</td>
                <td class="table-bordered">{{item.roughWeight}}</td>
                <td class="table-bordered">
                    {{item.netWeight / item.roughWeight ? item.netWeight / item.roughWeight : 0}}
                </td>
                <td class="table-bordered">{{item.netWeight}}</td>
                <td class="table-bordered">{{item.processingCharges}}</td>
                <td class="table-bordered">{{item.metalPrice}}</td>
                <td class="table-bordered">{{item.forfeit}}</td>
                <td class="table-bordered">{{item.totalCost}}</td>
                <td class="table-bordered">{{item.paid}}</td>
                <td class="table-bordered">{{item.updaterId }}</td>
            </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;回收金额：</label>
                <label>{{getRetailRecycleBillItem.totalCost}}</label>
            </div>
            <div class="col-md-10" style="text-align: right">
                <span style="margin: 10px">
                    <button type="button" class="btn btn-primary" data-dismiss="modal"
                            @click="print(passed.wareBill, getRetailRecycleBillDetailView)">打印票据</button>
                </span>
                <span style="margin: 10px" v-if="getRetailRecycleBillItem.paid === '未付款'">
                    <button type="button" class="btn btn-success"
                            @click="jump2payment(getRetailRecycleBillItem.billNumber)">前往收银</button>
                </span>
                <span style="margin: 10px">
                    <button type="button" class="btn btn-default" @click="clickBack">返回</button>
                </span>
            </div>
        </div>
        <script>
            window.requireFFI = window.require;
        </script>
    </div>
</template>

<script>
    import { mapMutations, mapActions, mapGetters } from 'vuex'
    import { baseUtil, dateUtil, numberUtil } from '~/util'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import Pagination from '~/components/Pagination'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import RetailRecycleBillMain from '~/components/retail/offlineRetail/RetailRecycleBillMain'
    import { ChangeTabEvent } from '~/components/ChangeTabEvent'

    function TEcoding(str) {
        var iconv = require('iconv-lite')
        return iconv.encode(Buffer.from(str), 'gbk')
    }
    export default {
        props: ['passed'],
        components: {
            TableCpn,
            ButtonWithModal,
            PrintTemplate,
            Pagination
        },
        data () {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                showUserIsMember: false,
                showUserCreateMember: false,
                telephone$: '',
                wareHouseId$: '',
                nickName$: '',
                gender$: '',
                depreciationRate$: '', // 折旧率
                retailRecycleBillAdd: [] // 新增的对象数组
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailBillAdd', {
                getUserInfo: 'getUserInfo'
            }),
            ...mapGetters('retail/offlineRetail/retailRecycleBillAdd', {
                retailRecycleBillAddView: 'getRetailRecycleBillAddView',
                getMetalPriceArr: 'getMetalPriceArr'
            }),
            ...mapGetters('retail/offlineRetail/retailRecycleBillMain', {
                getRetailRecycleBillItem: 'getRetailRecycleBillItem',
                getRetailRecycleBillDetailView: 'getRetailRecycleBillDetailView'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailRecycleBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapActions('retail/offlineRetail/retailBillAdd', {
                apiGetUser: 'apiGetUser'
            }),
            // 打印标签
            print (wareBill, item) {
                console.log('-------------------')
                console.log(wareBill)
                // this.getTotalPrice.totalRetailPrice
                console.log('打印标签ing:', item)
                // 打印标签
                let templates = baseUtil.getTemplates()
                let printTemplateChecked = 'RECYCLE'
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
                    var buffer = Buffer.alloc(32)
                    DLL.TLXOpenDocumentXMLA(TEcoding(templates[printTemplateChecked]), buffer, false);
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('门店'), TEcoding('门　　店：' + wareBill.storeName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('柜组'), TEcoding('柜　　组：' + wareBill.wareHouseName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('单号'), TEcoding('单　　号：' + wareBill.billNumber));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('合计'), TEcoding('合计：共' + item.length + '件，净重' + wareBill.netWeight + item[0].weightUnit));
                    var acceptMount = 0;
                    var content = '';
                    item.map((subItem, index) => {
                        acceptMount += subItem.originalPrice;
                        content += ('来料名称：' + subItem.metalId + '\n');
                        content += ('毛　　重：' + subItem.roughWeight + subItem.weightUnit + '\n');
                        content += ('净　　重：' + subItem.netWeight + subItem.weightUnit + '\n');
                        content += ('金　　价：￥ ' + subItem.metalPrice + '/' + subItem.weightUnit + '\n');
                        content += ('工费单价：￥' + (typeof (subItem.processingCharges) === 'undefined' ? 0 : subItem.processingCharges) + '/' + subItem.weightUnit + '\n');
                        content += ('工费小计：￥' + (typeof (subItem.processingCharges) === 'undefined' ? 0 : numberUtil.toKeepTwoPlacesOfDecimalAndRound(subItem.processingCharges * subItem.netWeight)) + '\n');
                        content += ('其他扣除：￥' + (typeof (subItem.forfeit) === 'undefined' ? 0 : subItem.forfeit.toString()) + '\n');
                        content += ('来料金额：￥' + subItem.totalCost + '\n');
                        content += '\n';
                    });
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('来料详情'), TEcoding(content));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('来料金额'), TEcoding('来料金额：￥' + numberUtil.toKeepTwoPlacesOfDecimalAndRound(wareBill.totalCost)));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('来料名称'), TEcoding('来料名称：' + item[0].metalId));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('单号条码'), TEcoding(wareBill.billNumber));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('操作人'), TEcoding('操作人：' + wareBill.creatorName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('日期'), TEcoding('日期：' + dateUtil.pattern(new Date(), 'yyyy-MM-dd HH:mm:ss')));
                    var fff = DLL.TLXOutputLabel(buffer.readInt32LE(0), 1, 0)
                    // var fff =  DLL.TLXOutputDocument(1, 1, 1, 0)`
                    DLL.TLXCloseDocument(buffer.readInt32LE(0))
                    console.log(fff)
                } else {
                    alert('未能成功匹配模板，请上传相应的打印模板')
                }
            },
            jump2payment (billId) {
                // 跳转到收银页面，进行收银操作
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT', billId)
            },
            clickBack () {
                this.resetCurrCpn(RetailRecycleBillMain)
            }
        },
        mounted () {
            if (this.getRetailRecycleBillItem.customer) {
                this.showUserIsMember = true
            }
        },
        beforeMount () {
        }
    }
</script>

<style scoped>
    .red {
        background: #ec475873;
    }
</style>
