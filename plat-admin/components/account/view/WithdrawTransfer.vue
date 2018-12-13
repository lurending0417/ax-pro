<template>
    <el-dialog
        title="提现转账"
        width="25%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="90px">
            <el-form-item label="户名">
                {{params.realName}}
            </el-form-item>
            <el-form-item label="账号">
                {{params.bankAccount}}
            </el-form-item>
            <el-form-item label="金额">
                {{params.withdrawAmount}}
            </el-form-item>
            <el-form-item label="银行流水号">
                <el-input v-model="params.tranId"></el-input>
            </el-form-item>
            <el-form-item label="备注说明">
                <el-input type="textarea" v-model="params.remark"></el-input>
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
                easyClose: true
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    let json = this.options.json || {};
                    this.params = {
                        realName: json.realName,
                        bankAccount: json.bankAccount,
                        withdrawAmount: json.withdrawAmount,
                        recordId: json.id,
                        tranId: '',
                        remark: ''
                    };
                }
            }
        },
        methods: {
            submit() {
                let url = api.url.account.withdraw.transfer;
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
