<template>
    <el-dialog
        title="编辑商户账户信息"
        width="30%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-form :model="params" label-width="90px" :disabled="formDisabled">
            <el-form-item label="联系人">
                <el-input v-model="params.contactName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="params.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="开户行">
                <el-input v-model="params.bankName"></el-input>
            </el-form-item>
            <el-form-item label="户名">
                <el-input v-model="params.accountName"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="params.accountNumber"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close(false)">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </span>
    </el-dialog>
</template>


<script>

    import api from "~/api"

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                easyClose: true,
                formDisabled: true
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.formDisabled = true;
                    api.request({
                        url: api.url.merchant.account.get,
                        params: {
                            merchantId: this.options.merchantId
                        },
                        success: (json) => {
                            this.params = json.result;
                            this.params.merchantId = this.options.merchantId;
                            this.formDisabled = false;
                        }
                    });
                }
            }
        },
        methods: {
            submit() {
                let url = api.url.merchant.account.edit;
                api.request({
                    url: url,
                    params: this.params,
                    success: () => {
                        this.close(true);
                    }
                });
            },
            close(updated) {
                this.$emit("close", updated);
            }
        }
    }

</script>
