<template>
    <el-dialog
        title="查看商户详情"
        width="80%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane v-for="(tab,index) in tabs" :key="index" :name="tab.alias" :label="tab.name">
                <component v-bind:is="tab.component" :name="tab.alias" ref="tabComponent" :options="tabOptions"></component>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
</template>

<script>

    import {renderUtil} from "~/util"

    export default {
        props: ["options"],
        data() {
            return {
                easyClose: true,
                tabs: [{
                    name: '基本信息',
                    alias: 'basicInfo',
                    component: 'MerchantBasicInfo'
                }, {
                    name: '门店列表',
                    alias: 'store',
                    component: 'Store'
                }, {
                    name: '试戴订单',
                    alias: 'leaseRecord',
                    component: 'LeaseRecord'
                }, {
                    name: '钱包账户',
                    alias: 'merchantWallet',
                    component: 'WalletTran'
                }, {
                    name: '营销金账户',
                    alias: 'marketingAccount',
                    component: 'MarketingTran'
                }, {
                    name: '鼓励金账户',
                    alias: 'encourageAccount',
                    component: 'EncourageTran'
                }],
                tabOptions: {},
                activeTab: '',
            }
        },
        watch: {
            activeTab(value) {
                if (!value) {
                    return;
                }
                renderUtil.renderTab(this);
            },
            'options.visible': function (value) {
                if (value) {
                    this.tabOptions = {
                        merchantId: this.options.merchantId
                    };
                    renderUtil.resetTab(this);
                }
            }
        },
        methods: {
            close() {
                this.$emit("close");
            },
        }
    }
</script>
