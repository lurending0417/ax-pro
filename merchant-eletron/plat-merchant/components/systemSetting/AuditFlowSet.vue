<template>
    <div>
        <div class="row">
            <div class="col-md-10"></div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增审批流程',
                                modalClasses: ['modal-lg']
                            }">
                    <AuditFlowSetAdd slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                    ></AuditFlowSetAdd>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn :heads="[
                    {propName: 'billNumber', name: '审批单据'},
                    {propName: 'auditName', name: '审批单据类型'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getAuditFlowSetList">
            <div v-for="(item,index) in getAuditFlowSetList" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '查看'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + index,
                        titleName: '查看',
                        modalClasses: ['modal-lg']
                    }"
                >
                    <AuditFlowSetView
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL + index"
                        :item="item"
                    >
                    </AuditFlowSetView>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '修改'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL+ 'update' + index,
                        titleName: '修改',
                        modalClasses: ['modal-lg']
                    }"
                >
                    <AuditFlowSetAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+ 'update' + index"
                        :item="item"
                    >
                    </AuditFlowSetAdd>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: '操作记录',
                                modalClasses: ['modal-lg']
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                             :params="item"></History>
                </ButtonWithModal>
            </div>
        </TableCpn>

        <!--<Pagination-->
            <!--:total="total"-->
            <!--:limit="20"-->
            <!--:CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"-->
            <!--:CONST_RESTORE="CONST_RESTORE"-->
        <!--&gt;-->
        <!--</Pagination>-->
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import AuditFlowSetAdd from '~/components/systemSetting/AuditFlowSetAdd'
    import AuditFlowSetView from '~/components/systemSetting/AuditFlowSetView'
    import dateUtil from '~/util/dateUtil'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import TableButton from '~/components/TableButton'
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            TableCpn,
            Pagination,
            TableButton,
            History,
            AuditFlowSetView,
            AuditFlowSetAdd
        },
        data () {
            return {
                searchInfos: {},
                outWareStores: [],
                inWareStores: [],
                storesIsChecked: false,
                startYmd$: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                endYmd$: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('systemSetting/auditFlowSet', {
                getAuditFlowSetList: 'getAuditFlowSetList',
                total: 'getTotal'
            })
        },
        watch: {
            startYmd$ () {
                this.search()
            },
            endYmd$ () {
                this.search()
            }
        },
        methods: {
            ...mapMutations('systemSetting/auditFlowSet', {
                // getDutyList: 'getDutyList'
            }),
            ...mapActions('systemSetting/auditFlowSet', {
                auditFlowSetListGet: 'auditFlowSetListGet',
                getDutyList: 'getDutyList'
            }),
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    console.log('params', params)
                    // this.auditFlowSetListGet(params)
                })
            }
        },
        mounted () {
            this.auditFlowSetListGet({
                limit: 20,
                start: 0,
                type: ''
            })
        },
        beforeMount () {
            // 获取所有岗位
            this.getDutyList();
        }
    }
</script>
