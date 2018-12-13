<template>
    <el-dialog
        title="提现流转记录"
        width="40%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center">
            <el-table-column prop="createTime" label="时间" width="180" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="操作者"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="renderStatus"></el-table-column>
            <el-table-column prop="remark" label="备注说明"></el-table-column>
        </el-table>
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
                rows: [],
                total: 0
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.list();
                }
            }
        },
        methods: {
            renderStatus(row, cell, value) {
                return value ? renderUtil.renderEnum('withdrawRecordStatus', value) : '';
            },
            list() {
                api.request({
                    url: api.url.account.withdraw.tran,
                    params: {
                        recordId: this.options.recordId
                    },
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            close() {
                this.$emit("close");
            }
        }
    }
</script>
