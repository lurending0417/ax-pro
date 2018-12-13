<template>
    <el-dialog
        title="鼓励金记录"
        width="60%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-row type="flex" justify="space-between" class="m-b">
            <el-col :span="24" class="text-right">
                <el-button type="primary" icon="el-icon-circle-plus" @click="addEncourage">&nbsp;新增发放</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center">
            <el-table-column prop="createTime" label="时间" width="180" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="操作者"></el-table-column>
            <el-table-column prop="weight" label="赠金数量" :formatter="renderGold"></el-table-column>
            <el-table-column prop="goldPrice" label="金价" :formatter="renderWeightedPrice"></el-table-column>
            <el-table-column prop="totalCost" label="总金额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="remark" label="备注说明"></el-table-column>
        </el-table>

        <EncourageRecordEditor :options="editorModal" @close="closeEditor"></EncourageRecordEditor>

    </el-dialog>
</template>

<script>

    import api from "~/api"

    import {renderUtil} from "~/util"

    export default {
        props: ["options"],
        data() {
            return {
                easyClose: true,
                params: {
                    ownerId: ''
                },
                rows: [],
                total: 0,
                editorModal: {
                    visible: false
                }
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.params.merchantId = this.options.ownerId;
                    this.list();
                }
            }
        },
        methods: {
            list() {
                api.request({
                    url: api.url.account.gold.encourage.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addEncourage() {
                this.editorModal = {
                    visible: true,
                    merchantId: this.params.merchantId
                };
            },
            closeEditor(updated) {
                this.editorModal = {
                    visible: false
                };
                updated === true && this.list();
            },
            close() {
                this.$emit("close");
            }
        }
    }
</script>
