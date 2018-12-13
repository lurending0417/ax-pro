<template>
    <el-row type="flex" justify="space-between">
        <el-col :span="8">
            <table class="el-table">
                <tbody>
                <tr v-if="merchant.logo">
                    <td colspan="4">
                        <img class="r64" :src="renderResource(merchant.logo,'!wh495')"/>
                    </td>
                </tr>
                <tr>
                    <td class="text-right"><b>商户编号：</b></td>
                    <td>{{merchant.code}}</td>
                    <td class="text-right"><b>商户名称：</b></td>
                    <td>{{merchant.name}}</td>
                </tr>
                <tr>
                    <td class="text-right"><b>商户地址：</b></td>
                    <td colspan="3">{{renderDistrict(merchant.districtCode)}} {{merchant.address}}</td>
                </tr>
                <tr>
                    <td class="text-right"><b>管理员：</b></td>
                    <td>{{merchant.managerName}}</td>
                    <td class="text-right"><b>管理员手机：</b></td>
                    <td>{{merchant.managerPhone}}</td>
                </tr>
                <tr>
                    <td class="text-right"><b>系统版本：</b></td>
                    <td>{{renderVersion(merchant.version)}}</td>
                </tr>
                <tr>
                    <td class="text-right"><b>入驻日期：</b></td>
                    <td>{{renderYmd(merchant.createYmd)}}</td>
                    <td class="text-right"><b>添加员工：</b></td>
                    <td>{{merchant.creatorName}}</td>
                </tr>
                <tr>
                    <td class="text-right"><b>修改时间：</b></td>
                    <td>{{renderTime(merchant.updateTime)}}</td>
                    <td class="text-right"><b>修改员工：</b></td>
                    <td>{{merchant.updaterName}}</td>
                </tr>
                <tr>
                    <td colspan="100" class="text-right">
                        <el-button type="primary" icon="el-icon-warning" @click="editAccount">&nbsp;结算账户</el-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </el-col>
        <el-col :span="8"></el-col>

        <MerchantBankAccountEditor :options="editorModal" @close="closeAccountEditor"></MerchantBankAccountEditor>

    </el-row>
</template>


<script>

    import api from "~/api"
    import {renderUtil} from "~/util";

    export default {
        props: ["options"],
        data() {
            return {
                merchant: {},
                editorModal: {
                    visible: false,
                    merchantId: ''
                }
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.search();
                }
            }
        },
        mounted() {
            this.$on("init", () => {
                this.merchant = {};
                this.search();
            });
        },
        created() {
            console.log('basic info created...');
        },
        methods: {
            renderVersion(version) {
                return version ? renderUtil.renderEnum('version', version) : '';
            },
            renderDistrict(districtCode) {
                return renderUtil.renderDistrictCode(districtCode);
            },
            search() {
                api.request({
                    url: api.url.merchant.get,
                    params: {
                        merchantId: this.options.merchantId
                    },
                    success: (json) => {
                        this.merchant = json.result;
                    }
                });
            },
            editAccount() {
                this.editorModal = {
                    visible: true,
                    merchantId: this.merchant.id
                }
            },
            closeAccountEditor() {
                this.editorModal = {
                    visible: false,
                    merchantId: ''
                }
            }
        }
    }
</script>
