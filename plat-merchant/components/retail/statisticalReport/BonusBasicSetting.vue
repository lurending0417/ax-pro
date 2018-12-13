<template>
    <div>
        <div class="line-cls" v-if="merchantVersion == 'STANDARD'">
            <KeyValueCom :title="'多人业绩分配设置：'" :value="getTeamRule.byEqual?'平均分配':'自定义分配'"></KeyValueCom>
            <ButtonWithModal
                :btnProps="{
                        btnClasses: ['btn btn-success'],
                        btnName: '修改'
                    }"
                :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + 'multiPerson',
                        titleName: '多人业绩分配设置'
                    }"
            >
                <MultiPersonAssignSetting
                    slot="main"
                    :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                    :CONST_CLICK_MODAL="CONST_CLICK_MODAL + 'multiPerson'"
                    :refreshRule="refreshRule"
                >
                </MultiPersonAssignSetting>
            </ButtonWithModal>
        </div>
        <fieldset>
            <legend>业绩表等效项设置</legend>
            <div class="line-cls" style="text-align: right;">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-danger'],
                        btnName: '新增'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + 'addEquivalentItem',
                        titleName: '新增等效项'
                    }"
                >
                    <EquivalentItem
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL + 'addEquivalentItem'"
                        :refreshTable="refreshTable"
                    >
                    </EquivalentItem>
                </ButtonWithModal>
            </div>


            <TableCpn :heads="heads" :items="equivalentList" :hasOrderId="false">
                <div v-for="(item,index) in equivalentList" :slot="'BUTTON'+index">
                    <ButtonWithModal
                        :btnProps="{
                            btnClasses: ['btn btn-sm btn-danger'],
                            btnName: '修改'
                        }"
                        :modalProps="{
                            CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                            CONST_CLICK_MODAL: CONST_CLICK_MODAL + index,
                            titleName: '修改等效项'
                        }"
                    >
                        <EquivalentItem
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL + index"
                            :refreshTable="refreshTable"
                            :item="item"
                        >
                        </EquivalentItem>
                    </ButtonWithModal>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: item.name+'操作记录',
                                modalClasses: ['modal-lg']
                            }">
                        <History slot="main"
                                 :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                 :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                                 :params="item"></History>
                    </ButtonWithModal>
                </div>
            </TableCpn>

        </fieldset>
    </div>
</template>
<script>
    import KeyValueCom from '~/components/KeyValueCom'
    import MultiPersonAssignSetting from './MultiPersonAssignSetting'
    import EquivalentItem from './EquivalentItem'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import History from '~/components/storage/wareBaseInfo/History'
    import uuid from 'uuid'
    import {baseUtil} from '~/util'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import TableCpn from '~/components/Table'

    export default {
        components: {
            History,
            TableCpn,
            KeyValueCom,
            EquivalentItem,
            MultiPersonAssignSetting,
            ButtonWithModal
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('retail/statisticalReport/statisticalRetail', {
                getTeamRule: 'getTeamRule',
                merchantVersion: 'getMerchantVersion',
                equivalentList: 'getEquivalentList'
            }),
            heads() {
                let arr = [
                    {propName: 'code', name: '序号'},
                    {propName: 'name', name: '名称'},
                    {propName: 'tranTypeName', name: '业务类型'},
                    {propName: 'metalName', name: '金属'},
                    {propName: 'gemName', name: '宝石'},
                    {propName: 'categoryName', name: '品类'},
                    {propName: 'enabledName', name: '状态'},
                    {tag: 'BUTTON', name: '操作'}
                ]
                if (this.merchantVersion === 'STANDARD') {
                    arr.splice(3, 0,
                        {propName: 'wareTypeName', name: '素/非素'},
                        {propName: 'processingTypeName', name: '精品/普货'},
                        {propName: 'priceTypeName', name: '计价方式'})
                }
                return arr
            }
        },
        methods: {
            ...mapActions('retail/statisticalReport/statisticalRetail', {
                apiGetTeamRule: 'apiGetTeamRule',
                apiGetEquivalentItem: 'apiGetEquivalentItem'
            }),
            ...mapMutations('retail/statisticalReport/statisticalRetail', {
                resetMerchantVersion: 'resetMerchantVersion'
            }),
            refreshRule() {
                this.apiGetTeamRule()
            },
            refreshTable() {
                this.apiGetEquivalentItem()
            }
        },
        mounted() {
            this.refreshRule()
            this.refreshTable()
            this.resetMerchantVersion(baseUtil.getMerchant().version)
        }
    }
</script>
