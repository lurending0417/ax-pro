<template>
    <el-dialog
        title="发放鼓励金"
        width="25%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-form :model="params" label-width="80px" :disabled="formDisabled">
            <el-form-item label="实时金价">
                {{params.goldPrice}}
            </el-form-item>
            <el-form-item label="发放重量">
                {{params.weight}}
            </el-form-item>
            <el-form-item label="发放金额">
                <el-input v-model="params.totalCost"></el-input>
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

    import {renderUtil} from "~/util"

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
                    this.params = {
                        merchantId: this.options.merchantId,
                        goldPriceId: '',
                        goldPrice: '',
                        totalCost: '',
                        weight: '',
                        remark: ''
                    };
                    this.fetchGoldPrice();
                }
            },
            'params.totalCost': function () {
                this.calcWeight();
            },
            'params.goldPrice': function () {
                this.calcWeight();
            }
        },
        methods: {
            fetchGoldPrice() {
                api.request({
                    url: api.url.account.gold.price,
                    success: (json) => {
                        this.params.goldPriceId = json.result.id;
                        this.params.goldPrice = json.result.price;
                        this.formDisabled = false;
                    }
                })
            },
            calcWeight() {
                this.params.weight = renderUtil.floor(this.params.totalCost / this.params.goldPrice, 3) + ' g';
            },
            submit() {
                let url = api.url.account.gold.encourage.add;
                api.request({
                    url: url,
                    params: this.params,
                    success: () => {
                        this.$message.success('发放成功！');
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
