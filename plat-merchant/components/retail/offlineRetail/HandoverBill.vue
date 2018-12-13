<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate5"
                            placeholder="起始日期"
                            v-model="form.startYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate6"
                            placeholder="结束日期"
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">接班人</label>
                <select class="form-control" style="margin-left: 15px" v-model="form.staffId">
                    <option value="">全部</option>
                    <option v-for="person in staffs" :value="person.id">{{ person.nickName }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">仓库</label>
                <select class="form-control" style="margin-left: 15px" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option v-for="warehouse in wareHouse" :value="warehouse.id">{{ warehouse.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">接班状态</label>
                <select class="form-control" style="margin-left: 15px" v-model="form.status">
                    <option value="">全部</option>
                    <option value="true">已接班</option>
                    <option value="false">未接班</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px" ref="query"
                       placeholder="" v-model="query" @keyup.enter="search()">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增交班单'
                            }">
                    <HandoverBillAdd slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                     :wareHouses="wareHouse"
                                     :passed="passed"
                    >

                    </HandoverBillAdd>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn
            :heads="[
                {propName:'createTime',name:'交班时间'},
                {propName:'wareHouseId',name:'仓库'},
                {propName:'startAmount',name:'数量',mergeName:'期初数据'},
                {propName:'startWeight',name:'重量',mergeName:'期初数据'},
                {propName:'startRegularPrice',name:'金额',mergeName:'期初数据'},
                {propName:'inAmount',name:'数量',mergeName:'入库信息'},
                {propName:'inWeight',name:'重量',mergeName:'入库信息'},
                {propName:'inRegularPrice',name:'金额',mergeName:'入库信息'},
                {propName:'outAmount',name:'数量',mergeName:'出库信息'},
                {propName:'outWeight',name:'重量',mergeName:'出库信息'},
                {propName:'outRegularPrice',name:'金额',mergeName:'出库信息'},
                {propName:'endAmount',name:'数量',mergeName:'期末信息'},
                {propName:'endWeight',name:'重量',mergeName:'期末信息'},
                {propName:'endRegularPrice',name:'金额',mergeName:'期末信息'},
                {propName:'updateTime',name:'接班时间'},
                {propName:'confirmedById',name:'接班人'},
                {tag:'BUTTON',name:'操作'}
            ]"
            :items="getHandoverBillsView">
            <div v-for="(item,index) in getHandoverBillsView" :slot="'BUTTON'+index" v-if="!item.confirmed">
                <TableButton
                             :btnProps="{
                                btnClasses: ['btn btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '删除'
                            }"
                             :item=item
                             :clickCallback="clickDelete"
                />
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-primary btn-sm'],
                                btnName: '接班'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'detial'+index,
                                titleName: '接班'
                            }">
                    <HandoverConfirm slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'detial'+index"
                                     :params="index"
                                     :item="item"
                    >
                    </HandoverConfirm>
                </ButtonWithModal>
            </div>
        </TableCpn>

        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import TableCpn from '~/components/Table'
    import DatePicker from '~/components/DatePicker';
    import uuid from 'uuid';
    import {dateUtil, baseUtil} from '~/util';
    import HandoverBillAdd from '~/components/retail/offlineRetail/HandoverBillAdd';
    import HandoverConfirm from '~/components/retail/offlineRetail/HandoverConfirm';
    import ButtonWithModal from '~/components/ButtonWithModal';
    import TableButton from '~/components/TableButton';
    import Pagination from '~/components/Pagination';
    import { PaginationEvent } from '~/components/PaginationEvent';

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            DatePicker,
            HandoverBillAdd,
            ButtonWithModal,
            Pagination,
            TableButton,
            HandoverConfirm
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                wareHouse: [],
                staffs: [],
                handoverList: [],
                handoverItem: {},
                query: '',
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    status: '',
                    staffId: '',
                    storeId: '',
                    wareHouseId: ''
                }
            }
        },
        watch: {
            'form': {
                handler: function () {
                    this.search()
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/handoverBill', {
                getHandoverBillsView: 'getHandoverBillsView',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapActions('retail/offlineRetail/handoverBill', {
                getHandoverBills: 'getHandoverBills',
                addHandoverBill: 'addHandoverBill',
                delHandoverBill: 'delHandoverBill'
            }),
            add() {
                let wareHouseId = ''
                let that = this;
                this.addHandoverBill({
                    wareHouseId,
                    callback: () => {
                        that.search()
                    }
                })
            },
            search(page) {
                let params = {...this.form, limit: 10, start: 0}
                if (page) {
                    params.limit = page.limit
                    params.start = page.start
                }
                this.getHandoverBills(params)
                this.$refs.query.select()
            },
            clickDelete(event, item) {
                let that = this;
                this.delHandoverBill({
                    callback: () => {
                        that.search()
                    },
                    recordId: item.id
                });
            },
            registerPaginationEvent() {
                PaginationEvent.$off(this.CONST_CHANGE_PAGE);
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            let storeId = baseUtil.getStore().id; // 获取当前登录的人的店铺
            this.wareHouse = baseUtil.getMetadataWareHouseByStoreId(storeId); // 获取当前店铺的所有仓库
            this.staffs = baseUtil.getStaffsInDesignStoreByStoreId(storeId); // 获取当前店铺的所有员工
        }
    }
</script>

<style>

</style>
