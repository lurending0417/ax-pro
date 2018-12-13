<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">姓名</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" v-model="form.name">
            </div>
        </div>
        <div class="form-group form-group-margin">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">出生日期</label>
            <div class="input-daterange input-group" style="margin-left: 224px;">
                <span>
                    <DatePicker
                        field="myDate1"
                        placeholder="出生日期"
                        format="yyyy-mm-dd"
                        v-model="form.birthYmd"
                        :backward="false"
                        :no-today="false"
                        :forward="false">
                    </DatePicker>
                </span>
            </div>
        </div>
        <div class="form-group" style="text-align: left">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">性别</label>
            <div class="radio col-sm-4">
                <label>
                    <input type="radio" name="gender" value="MALE" v-model="form.gender">男
                </label>
                <label style="margin: 6px 0 0 15px">
                    <input type="radio" name="gender" value="FEMALE" v-model="form.gender" checked>女
                </label>
            </div>
        </div>
        {{getStores}}
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">所属门店</label>
            <div class="col-sm-4">
                <select class="form-control" v-model="form.storeId">
                    <option v-for="store in stores" :value="store.id">{{ store.name }}</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">岗位</label>
            <div class="col-sm-4">
                <select class="form-control" v-model="form.dutyIds">
                    <option v-for="duty in dutys" :value="duty.id">{{ duty.name }}</option>
                </select>
            </div>
        </div>
        <div class="form-group form-group-margin">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">入职日期</label>
            <div class="input-daterange input-group" style="margin-left: 224px;">
                <span>
                    <DatePicker
                        field="myDate2"
                        placeholder="入职日期"
                        format="yyyy-mm-dd"
                        v-model="form.joinYmd"
                        :backward="false"
                        :no-today="false"
                        :forward="false">
                    </DatePicker>
                </span>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">联系手机</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" v-model="form.telephone">
            </div>
        </div>
        <div class="form-group" style="text-align: left">
            <div class="col-sm-2"></div>
            <label class="col-sm-2 control-label">状态</label>
            <div class="radio col-sm-4">
                <label>
                    <input type="radio" name="status" value="true" v-model="form.atWork">在职
                </label>
                <label style="margin: 6px 0 0 15px">
                    <input type="radio" name="status" value="false" v-model="form.atWork">离职
                </label>
            </div>
        </div>

        <div class="modal-footer" style="text-align: center">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add">确定</button>
        </div>
    </form>
</template>


<script>
    import {mapActions, mapState} from 'vuex'
    import DatePicker from '~/components/DatePicker'
    import {baseUtil} from '~/util'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        components: {
            DatePicker
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'passed', 'refreshTable'],
        data() {
            return {
                stores: [],
                dutys: [],
                form: {
                    merchantId: '',
                    name: '',
                    gender: '',
                    birthYmd: '',
                    storeId: '',
                    dutyIds: '',
                    joinYmd: '',
                    telephone: '',
                    atWork: ''
                }
            }
        },
        watch: {
            'form.storeId': {
                handler(val) {
                    console.log('storeId change', val);
                },
                deep: true
            }
        },
        computed: {
            ...mapState('merchant/SaleManManageMain', {
                getStores: 'getStores'
            })
        },
        methods: {
            ...mapActions('merchant/SaleManManageMain', {
                apiAddStaff: 'apiAddStaff',
                apiGetDuty: 'apiGetDuty'
            }),
            add() {
                this.apiAddStaff({
                    params: this.form,
                    callback: () => {
                        this.closeModal()
                    }
                })
            },
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable();
            },
            init() {
                this.form.merchantId = baseUtil.getMerchantId()
                this.stores = baseUtil.getMetadataStore()
                this.apiGetDuty({
                    params: {},
                    callback: (data) => {
                        this.dutys = data
                        this.form.dutyIds = this.dutys[0].id
                    }
                })
                this.form.storeId = this.stores[0].id
                console.log('this.store', this.form.storeId);
                this.form = {
                    name: '',
                    gender: 'MALE',
                    birthYmd: '',
                    joinYmd: '',
                    telephone: '',
                    atWork: true
                }
            }
        },
        beforeMount() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.init()
            })
        }
    }
</script>

<style scoped>
    .select_item {
        width: 50%;
        margin: 50px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
