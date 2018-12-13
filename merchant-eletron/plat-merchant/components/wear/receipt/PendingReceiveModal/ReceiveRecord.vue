<template>
    <div>
        <div class="modal-body">
            <form class="form-horizontal" style="margin-top: 16px">
                <div class="form-group">
                    <label class="col-sm-3 control-label">仓库</label>
                    <div class="col-sm-8">
                        <select class="form-control" v-model="form.wareHouseId">
                            <option :value="item.id" v-for="item in wareHouses">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">快递公司</label>
                    <div class="col-sm-8">
                        <select class="form-control" v-model="form.shipper">
                            <option :value="item.id" v-for="item in shippers">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">快递单号</label>
                    <div class="col-sm-8">
                        <input type="text" v-model="form.logisticsCode" @keyup.enter="asureReceive" class="form-control"/>
                    </div>
                </div>
            </form>
        </div>

        <div class="modal-footer footer_btn" style="text-align: center;">
            <button type="button" class="btn btn-w-m btn-info" @click="asureReceive">确认收货</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, constUtil} from '~/util';
    import {mapActions, mapGetters} from 'vuex'

    export default {
        props: ['CONST_CLICK_MODAL', 'refreshTable', 'CONST_CLOSE_MODAL', 'tableList'],
        data() {
            return {
                form: {
                    wareHouseId: '',
                    shipper: '',
                    logisticsCode: ''
                },
                shippers: [],
                wareHouses: []
            }
        },
        computed: {
            ...mapGetters('merchant/storeManageMain', {
                reginData: 'reginData'
            })
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiLeaseRecordAccept: 'apiLeaseRecordAccept',
                apiGetDeliverDetailById: 'apiGetDeliverDetailById'
            }),
            asureReceive() {
                let vm = this;
                console.log('form', this.form);
                this.apiLeaseRecordAccept({
                    params: this.form,
                    callBack() {
                        ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL);
                        vm.refreshTable()
                    }
                });
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable();
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.wareHouses = baseUtil.getMetadataWareHouseByStoreId({enabled: true});
                this.shippers = constUtil._CONST_SHIPPER
                this.form = {
                    shipper: this.shippers[0].name,
                    wareHouseId: this.wareHouses[0].id,
                    logisticsCode: ''
                };
            });
        }
    }
</script>

<style>
    .top > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .top > div label {
        width: 160px;
    }

    .top > div select {
        margin-right: 20px;
    }

    .top > div input {
        margin-left: 20px;
    }
</style>
