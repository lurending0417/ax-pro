<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <span class="col-sm-3"></span>
            <label class="col-sm-2 control-label">供货商</label>
            <div class="col-sm-4">
                <select class="form-control" v-model="vendorId$">
                    <option v-for="vendor in vendors" :value="vendor.id">{{ vendor.name }}</option>
                </select>
            </div>
            <span class="col-sm-3"></span>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add('addModal')">确定</button>
        </div>
    </form>
</template>

<script>
    import { baseUtil } from '~/util'
    import { mapActions } from 'vuex'
    import SaleReturnAdd from '~/components/storage/stock/SaleReturnAdd'

    export default {
        props: ['passed'],
        data () {
            return {
                vendors: [],
                vendorId$: ''
            }
        },
        methods: {
            ...mapActions('storage/stock/saleReturnAdd', {
                apiAddSaleReturnBill: 'apiAddSaleReturnBill'
            }),
            add () {
                this.apiAddSaleReturnBill({
                    params: {
                        vendorId: this.vendorId$
                    },
                    callback: () => {
                        this.passed.canChange = true
                        this.passed.changeCurrCpn(SaleReturnAdd)
                    }
                })
            }
        },
        mounted () {
            this.vendors = baseUtil.getMetadataVendors()
            this.vendorId$ = this.vendors[0].id
        }
    }
</script>
