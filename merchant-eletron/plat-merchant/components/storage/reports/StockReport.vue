<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <div style="display: inline-block;">
                        <DatePicker
                            field="startDate"
                            placeholder="起始日期"
                            v-model="form.startYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <div style="display: inline-block">
                        <DatePicker
                            field="endDate"
                            placeholder="结束日期"
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <button class="btn btn-primary" @click="search()">搜索</button>
            </div>
        </div>
        <div class="form-inline">
            <strong>门店：</strong>
            <label class="checkbox-inline" v-for="item in storeArr">
                <input type="checkbox" name="store" :value="item.id"
                       v-model="checkedStoreArr">{{item.name}}</label>
        </div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th rowspan="2">门店</th>
                <th rowspan="2">仓库</th>
                <th colspan="4">期初</th>
                <th colspan="4">入库</th>
                <th colspan="4">出库</th>
                <th colspan="3">库存信息修改</th>
                <th colspan="4">期末</th>
            </tr>
            <tr>
                <th>件数</th>
                <th>原价</th>
                <th>工费</th>
                <th>总质量</th>
                <th>件数</th>
                <th>原价</th>
                <th>工费</th>
                <th>总质量</th>
                <th>件数</th>
                <th>原价</th>
                <th>工费</th>
                <th>总质量</th>
                <th>原价</th>
                <th>工费</th>
                <th>总质量</th>
                <th>件数</th>
                <th>原价</th>
                <th>工费</th>
                <th>总质量</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in tableView">
                <td>{{item.storeName }}</td>
                <td>{{item.wareHouseName }}</td>
                <td>{{item.startAmount }}</td>
                <td>{{handleItemUnit(item.startRegularPrice, '元') }}</td>
                <td>{{handleItemUnit(item.startProcessingCharges, '元')}}</td>
                <td>{{handleItemUnit(item.startWeight, 'g')}}</td>

                <td class="bgColorIN"
                    @click="clickTd(item, index, 'in')">
                    {{item.inAmount}}
                </td>
                <td class="bgColorIN"
                    @click="clickTd(item, index, 'in')">{{handleItemUnit(item.inRegularPrice, '元') }}
                </td>
                <td class="bgColorIN"
                    @click="clickTd(item, index, 'in')">{{handleItemUnit(item.inProcessingCharges, '元')}}
                </td>
                <td class="bgColorIN"
                    @click="clickTd(item, index, 'in')">{{ handleItemUnit(item.inWeight, 'g')}}
                </td>

                <td class="bgColorOUT" @click="clickTd(item, index, 'out')">{{item.outAmount}}</td>
                <td class="bgColorOUT" @click="clickTd(item, index, 'out')">{{handleItemUnit(item.outRegularPrice, '元')}}</td>
                <td class="bgColorOUT" @click="clickTd(item, index, 'out')">{{handleItemUnit(item.outProcessingCharges, '元')}}</td>
                <td class="bgColorOUT" @click="clickTd(item, index, 'out')">{{handleItemUnit(item.outWeight,'g')}}</td>

                <td class="bgColorEDIT" @click="clickTd(item, index, 'modify')">{{handleItemUnit(item.editRegularPrice, '元') }}</td>
                <td class="bgColorEDIT" @click="clickTd(item, index, 'modify')">{{handleItemUnit(item.editProcessingCharges,'元') }}</td>
                <td class="bgColorEDIT" @click="clickTd(item, index, 'modify')">{{handleItemUnit(item.editWeight, 'g')}}</td>

                <td>{{item.endAmount }}</td>
                <td>{{handleItemUnit(item.endRegularPrice, '元')}}</td>
                <td>{{handleItemUnit(item.endProcessingCharges, '元')}}</td>
                <td>{{handleItemUnit(item.endWeight, 'g')}}</td>
            </tr>
            </tbody>
        </table>
        <ModalItem
            :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL+'in',
                        titleName: '入库明细表',
                        modalClasses: ['modal-lg']
                    }">
            <StockReportDetail
                slot="main"
                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                :type="'IN'"
                :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'in'">
            </StockReportDetail>
        </ModalItem>
        <ModalItem
            :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL+'out',
                        titleName: '出库明细表',
                        modalClasses: ['modal-lg']
                    }">
            <StockReportDetail
                slot="main"
                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                :type="'OUT'"
                :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'out'">
            </StockReportDetail>
        </ModalItem>
        <ModalItem
            :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify',
                        titleName: '修改商品明细',
                        modalClasses: ['modal-lg']
                    }">
            <StockReportDetail
                slot="main"
                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                :type="'EDIT'"
                :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'">
            </StockReportDetail>
        </ModalItem>
    </div>
</template>

<script>
    import uuid from 'uuid'
    import api from '~/api'
    import {dateUtil, baseUtil} from '~/util'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import StockReportDetail from './StockReportDetail'
    import ModalItem from '~/components/ModalItem'

    export default {
        components: {
            StockReportDetail,
            ModalItem,
            DatePicker,
            ButtonWithModal
        },
        data() {
            return {
                checkedStoreArr: [],
                storeArr: [],
                tableView: [],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    storeId: ''
                }
            }
        },
        methods: {
            search() {
                let params = {...this.form}
                api.request({
                    url: api.consts._REPORT_STORAGE_CHECKOUT,
                    params,
                    success: (data) => {
                        this.tableView = data.rows
                    }
                })
            },
            changeBg(symbol, index) {
                this.$refs[symbol + index].forEach(item => {
                    item.setAttribute('class', symbol)
                })
            },
            clickTd(item, index, symbol) {
                ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL + symbol, {item, form: {...this.form}})
            },
            watchFunc() {
                this.$watch('checkedStoreArr', function (val) {
                    console.log('checkedStoreArr changed', val)
                    this.form.storeId = val.join()
                }, {deep: true})
                this.$watch('form', function (val) {
                    console.log('form ')
                    this.search()
                }, {deep: true})
            }
        },
        mounted() {
            // 如果当前门店为管理性质（MANAGE）的门店，则展示当前商户的所有门店
            // 如果当前门店为普通性质（NORMAL）的门店，则展示当前门店
            let store = baseUtil.getStore()
            if (store.type === 'NORMAL') {
                this.storeArr = [store]
            } else {
                this.storeArr = baseUtil.getMetadataStore()
            }
            this.checkedStoreArr.push(store.id)
            this.watchFunc()
            this.$on('init', () => {
                this.search()
            })
        }
    }
</script>
<style scoped>
    tr:hover .bgColorIN {
        background-color: #aad2ff;
        cursor: pointer;
    }

    tr:hover .bgColorOUT {
        background-color: #bfddff;
        cursor: pointer;
    }

    tr:hover .bgColorEDIT {
        background-color: #d6e9ff;
        cursor: pointer;
    }
</style>
