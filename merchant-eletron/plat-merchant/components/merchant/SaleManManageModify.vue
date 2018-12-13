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
                    <input type="radio" name="gender" value="FEMALE" v-model="form.gender">女
                </label>
            </div>
        </div>
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
                <select class="form-control" :value="form.dutyIds[0]" @change="changeDuty">
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
                    <input type="radio" name="status" value="false" v-model="form.atWork" checked>离职
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
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil} from '~/util'

    export default {
        components: {
            DatePicker
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'passed', 'item', 'refreshTable'],
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
                    dutyIds: [],
                    joinYmd: '',
                    telephone: '',
                    atWork: ''
                }
            }
        },
        computed: {
            ...mapState('merchant/SaleManManageMain', {
                getStores: 'getStores'
            })
        },
        methods: {
            ...mapActions('merchant/SaleManManageMain', {
                apiGetStaff: 'apiGetStaff',
                apiModifyStaff: 'apiModifyStaff',
                apiGetDuty: 'apiGetDuty'
            }),
            add() {
                console.log(this.form);
                this.apiModifyStaff({
                    params: {
                        staffId: this.item.id,
                        name: this.form.name || '',
                        gender: this.form.gender || '',
                        birthYmd: this.form.birthYmd || '',
                        storeId: this.form.storeId || '',
                        dutyIds: this.form.dutyIds[0] || '',
                        joinYmd: this.form.joinYmd || '',
                        telephone: this.form.telephone || '',
                        atWork: this.form.atWork || ''
                    },
                    callback: () => {
                        this.closeModal()
                    }
                })
            },
            changeDuty() {
                this.form.dutyIds.unshift(event.target.value)
            },
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            init() {
                this.stores = baseUtil.getMetadataStore();
                this.apiGetDuty({
                    params: {},
                    callback: (data) => {
                        this.dutys = data
                    }
                });
                this.apiGetStaff({
                    params: {
                        staffId: this.item.id
                    },
                    callback: (data) => {
                        console.log('111111', data)
                        // objectUtil.replaceSameFieldsValue_1();
                        this.form.name = data.name;
                        this.form.gender = data.gender;
                        this.form.birthYmd = data.birthYmd ? (data.birthYmd + '') : '';
                        this.form.storeId = data.storeId;
                        this.form.dutyIds = data.dutyIds;
                        this.form.joinYmd = data.joinYmd ? (data.joinYmd + '') : '';
                        this.form.telephone = data.telephone;
                        this.form.atWork = data.atWork
                    }
                })
            }
        },
        mounted() {
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
