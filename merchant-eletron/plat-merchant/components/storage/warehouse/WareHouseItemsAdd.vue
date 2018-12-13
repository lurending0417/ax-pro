<template>
    <div>
        <div class="modal-body form-horizontal">
            <div class="form-group">
                <label class="col-sm-2 control-label">门店</label>
                <div class="col-sm-4">
                    <div class="form-inline" style="text-align: left">
                        <select class="form-control" v-model="form.storeId">
                            <option v-for="store in stores" :value="store.id">{{ store.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">库房名称</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" v-model="form.name">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">负责人</label>
                <div class="col-sm-4">
                    <div class="form-inline" style="text-align: left">
                        <select class="form-control" v-model="form.managerId">
                            <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">库房性质</label>
                <div class="col-sm-10" style="text-align: left">
                    <label style="display: block">
                        <input type="radio" name="recycle" :value="false" v-model="form.recycle">
                        <span style="margin-left: 10px">销售库</span>
                    </label>
                    <label>
                        <input type="radio" name="recycle" :value="true" v-model="form.recycle">
                        <span style="margin-left: 10px">回收库</span>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">状态</label>
                <div class="col-sm-10" style="text-align: left">
                    <label style="display: block">
                        <input type="radio" name="status" :value="true" v-model="form.enabled">
                        <span style="margin-left: 10px">启用</span>
                    </label>
                    <label>
                        <input type="radio" name="status" :value="false" v-model="form.enabled">
                        <span style="margin-left: 10px">停用</span>
                    </label>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button class="btn btn-danger" @click="add">确定</button>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent';
    import {baseUtil} from '~/util'

    export default {
        props: ['CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        data() {
            return {
                form: {
                    storeId: '',
                    enabled: '',
                    name: '',
                    managerId: '',
                    recycle: ''
                },
                stores: [],
                staffs: []
            }
        },
        watch: {
            'form.storeId': {
                handler(val) {
                    this.staffs = baseUtil.getMetadataStaffByStoreId({storeId: val, atWork: true});
                    this.form.managerId = this.staffs.length > 0 ? this.staffs[0].id : ''
                },
                deep: true
            }
        },
        methods: {
            ...mapActions('storage/warehouse/warehouseItemsAdd', {
                addAction: 'addAction'
            }),
            add() {
                this.addAction({
                    callback: () => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        this.refreshTable();
                    },
                    params: this.form
                });
            },
            initData() {
                this.stores = baseUtil.getMetadataStore();
                this.staffs = baseUtil.getMetadataStaffByStoreId({storeId: this.stores[0].id, atWork: true});
                this.form = {
                    enabled: true,
                    name: '',
                    storeId: this.stores[0].id,
                    managerId: this.staffs.length === 0 ? '' : this.staffs[0].id,
                    recycle: false
                }
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData();
            })
        }
    }
</script>
