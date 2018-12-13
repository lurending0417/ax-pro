<template>
    <div>
        <div class="modal-body form-horizontal">
            <div class="form-group" style="text-align: right">
                <div class="col-lg-3"><label class="control-label">门店</label></div>
                <div class="col-lg-5">
                    <select class="form-control" v-model="form.storeId">
                        <option v-for="store in stores" :value="store.id">{{ store.name }}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" style="text-align: right">
                <div class="col-lg-3"><label class="control-label">库房名称</label></div>
                <div class="col-lg-5"><input type="text" class="form-control" v-model="form.name"></div>
            </div>
            <div class="form-group" style="text-align: right">
                <div class="col-lg-3"><label class="control-label">负责人</label></div>
                <div class="col-lg-5">
                    <select class="form-control" v-model="form.managerId">
                        <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                    </select>
                </div>
            </div>
            <div class="form-group" style="text-align: right">
                <div class="col-lg-3"><label class="control-label">库房性质</label></div>
                <div class="col-lg-5" style="text-align: left">
                    <div><label><input type="radio" name="recycle" value="false"
                                       v-model="form.recycle">&nbsp;销售库</label></div>
                    <div><label><input type="radio" name="recycle" value="true" v-model="form.recycle">&nbsp;回收库</label>
                    </div>
                </div>
            </div>
            <div class="form-group" style="text-align: right">
                <div class="col-lg-3"><label class="control-label">状态</label></div>
                <div class="col-lg-5" style="text-align: left">
                    <div><label><input type="radio" name="enabled" value="true" v-model="form.enabled">&nbsp;启用</label>
                    </div>
                    <div><label><input type="radio" name="enabled" value="false" v-model="form.enabled">&nbsp;停用</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button class="btn btn-danger" @click="ensureToModify">确定</button>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapState, mapActions} from 'vuex';
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent';
    import uuid from 'uuid';
    import {objectUtil} from '~/util';

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'warehouse', 'refreshTable'],
        data() {
            return {
                radioName: uuid(),
                form: {
                    managerId: '',
                    enabled: '',
                    name: '',
                    storeId: '',
                    merchantId: '',
                    recycle: ''
                }
            }
        },
        computed: {
            ...mapGetters('storage/warehouse/warehouseItemsModify', {
                stores: 'stores',
                staffs: 'staffs'
            }),
            ...mapState('storage/warehouse/warehouseItemsModify', {
                warehouseInfo: 'warehouse'
            })
        },
        methods: {
            ...mapMutations('storage/warehouse/warehouseItemsModify', {
                resetWarehouse: 'resetWarehouse'
            }),
            ...mapActions('storage/warehouse/warehouseItemsModify', {
                modify: 'modify'
            }),
            ensureToModify() {
                this.modify({form: {...this.form}, callback: this.closeModal});
            },
            closeModal() {
                // 关闭模态框
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                // 刷新表格
                this.refreshTable();
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.resetWarehouse(this.warehouse);
                console.log(this.warehouseInfo);
                objectUtil.replaceSameFieldsValue(this.warehouseInfo, this.form);
            });
        }
    }
</script>
