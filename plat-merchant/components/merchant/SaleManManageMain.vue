<template>
    <div>
        <div class="form-inline">
            <SelectItem v-model="form.storeId" selectTitle="门店" :selectItems="stores"></SelectItem>
            <SelectItem v-model="form.dutyId" selectTitle="岗位" :selectItems="dutyList"></SelectItem>
            <SelectItem v-model="form.atWork" selectTitle="状态" :selectItems="status"></SelectItem>
        </div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                       placeholder="姓名，手机号"
                       v-model="query$">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-7" style="text-align: right"></div>
            <div class="col-md-1" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增员工'
                            }">
                    <SaleManManageAdd slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                      :refreshTable="refreshTable"
                                      :passed="passed"
                    ></SaleManManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <TableCpn :heads="[
                    {propName: 'name', name: '姓名'},
                    {propName: 'gender', name: '性别'},
                    {propName: 'birthYmd', name: '出生日期'},
                    {propName: 'storeId', name: '所属门店'},
                    {propName: 'dutyName', name: '岗位'},
                    {propName: 'createTime', name: '入职日期'},
                    {propName: 'telephone', name: '联系手机'},
                    {propName: 'atWork', name: '状态'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getStaffs">
            <div v-for="(item,index) in getStaffs" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '修改'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + index,
                        titleName: '修改员工'
                    }"
                >
                    <SaleManManageModify
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL + index"
                        :refreshTable="refreshTable"
                        :item="item"
                    >
                    </SaleManManageModify>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: '历史',
                                modalClasses: ['modal-lg']
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                             :params="item"></History>
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
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent';
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import TableButton from '~/components/TableButton'
    import SaleManManageAdd from '~/components/merchant/SaleManManageAdd'
    import SaleManManageModify from '~/components/merchant/SaleManManageModify'
    import History from '~/components/storage/wareBaseInfo/History'
    import {baseUtil} from '~/util'
    import SelectItem from '~/components/SelectItem'

    export default {
        components: {
            SelectItem,
            DatePicker,
            TableCpn,
            Pagination,
            ButtonWithModal,
            TableButton,
            SaleManManageModify,
            SaleManManageAdd,
            History
        },
        props: ['passed'],
        data() {
            return {
                query$: '',
                form: {
                    storeId: '',
                    dutyId: '',
                    atWork: ''
                },
                stores: [],
                status: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('merchant/SaleManManageMain', {
                total: 'getTotal',
                dutyList: 'getDutyArr',
                getStaffs: 'getStaffs'
            })
        },
        methods: {
            ...mapActions('merchant/SaleManManageMain', {
                apiGetDuty: 'apiGetDuty',
                apiGetStaffs: 'apiGetStaffs' // 获取店员
            }),
            ...mapActions('storage/warebaseinfo/goldPriceItem', {
                getMetaData: 'getMetaData' // 刷新metaData
            }),
            ...mapActions('systemSetting/auditFlowSet', {
                getDutyList: 'getDutyList'
            }),
            search(page) {
                let params = {
                    merchantId: baseUtil.getMerchantId(),
                    query: this.query$,
                    limit: 10,
                    start: 0,
                    ...this.form
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.apiGetStaffs(params);
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    // params.merchantId = JSON.parse(sessionStorage.ax_basicInfo).merchant.id;
                    this.search(params);
                })
            },
            refreshTable() {
                this.search()
            },
            initData() {
                this.form = {
                    storeId: '',
                    dutyId: '',
                    atWork: ''
                }
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
            // 刷新metaData
            this.getMetaData()
            this.apiGetDuty({
                params: {}
            })
        },
        mounted() {
            this.initData()
            this.stores = baseUtil.getMetadataStore();
            this.status = [{
                id: true,
                name: '在职'
            }, {
                id: false,
                name: '离职'
            }]
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>

<style>

</style>
