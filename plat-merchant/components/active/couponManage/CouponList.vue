<template>
    <div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-offset-10">
                    <ButtonWithModal
                        :btnProps="{
                                    btnClasses: ['btn btn-danger'],
                                    btnName: '新增'
                                    }"
                        :modalProps="{
                                    CONST_CLOSE_MODAL: CONST_CLOSE_MODAL_1,
                                    CONST_CLICK_MODAL: CONST_CLICK_MODAL_1+'coupon',
                                    titleName: '转买券发放规则设置',
                                    modalClasses: ['modal-lg']
                                }">
                        <ModifyCoupon slot="main"
                                    :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL_1"
                                    :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+'coupon'"
                                      :getCouponList="getCouponList"
                        >
                        </ModifyCoupon>
                    </ButtonWithModal>
                </div>
            </div>
            <TableCpn
                :heads="[
                { propName: 'createTime', name: '创建时间' },
                { propName: 'materials', name: '材质' },
                { propName: 'stores', name: '参会店面' },
                { propName: 'ratio', name: '比例' },
                { propName: 'enabledStatus', name: '状态' },
                { propName: 'creatorName', name: '操作人' },
                { name: '操作', tag: 'BUTTON' }
            ]"
                :items="tableView"
            >
                <span :slot="'BUTTON'+index" v-for="(item,index) in tableView" >
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '修改'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL_1,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL_1+'update'+index,
                                titleName: '修改转买券发放规则设置',
                                modalClasses: ['modal-lg']
                            }">
                        <ModifyCoupon slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL_1"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+'update'+index"
                                      :item="item"
                                      :getCouponList="getCouponList"
                        >
                        </ModifyCoupon>
                    </ButtonWithModal>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL_1,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL_1+'history'+index,
                                titleName: '历史',
                                modalClasses: ['modal-lg']
                            }">
                        <History slot="main"
                                 :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL_1"
                                 :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+'history'+index"
                                 :params="item"></History>
                    </ButtonWithModal>
                </span>
            </TableCpn>
        </div>
    </div>
</template>
<script>
    import TableCpn from '~/components/Table';
    import ButtonWithModal from '~/components/ButtonWithModal'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import ModifyCoupon from './ModifyCoupon'
    import History from '~/components/storage/wareBaseInfo/History'
    import uuid from 'uuid'
    import api from '~/api'
    import {dateUtil, baseUtil} from '~/util'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL'],
        components: {
            TableCpn,
            History,
            ButtonWithModal,
            ModifyCoupon
        },
        data() {
            return {
                tableView: [],
                CONST_CLOSE_MODAL_1: uuid(),
                CONST_CLICK_MODAL_1: uuid()
            }
        },
        methods: {
            handleIds(tag, str) {
                let joinArr = [];
                let arr = baseUtil.getArrByKeyFromMetaData(tag);
                if (arr.length > 0) {
                    if (str === 'all') {
                        joinArr = arr.map(item => {
                            return item.name
                        })
                    } else {
                        str.split(',').map(item => {
                            for (let i = 0, j = arr.length; i < j; i++) {
                                if (arr[i].id === item) {
                                    joinArr.push(arr[i].name)
                                    break;
                                }
                            }
                        })
                    }
                }
                return joinArr.join()
            },
            handleTableView(rows) {
                return rows.map(item => {
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    item.creatorName = baseUtil.getNameFromPropId('staffs', item.creatorId);
                    item.enabledStatus = item.enabled ? '启用' : '停用';
                    if (item.storeIds) {
                        item.stores = this.handleIds('stores', item.storeIds);
                    }
                    let materials = '';
                    if (item.metalIds) {
                        materials = this.handleIds('metal', item.metalIds);
                    }
                    if (item.gemIds) {
                        materials += ',' + this.handleIds('gem', item.gemIds);
                    }
                    item.materials = materials
                    return item
                });
            },
            getCouponList() {
                api.request({
                    url: api.consts._COUPON_RULE_SET,
                    params: {},
                    success: (data) => {
                        this.tableView = this.handleTableView(data.rows)
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.getCouponList()
            })
        }
    }
</script>
