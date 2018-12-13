<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <RegionSelect v-model="params.districtCode"></RegionSelect>
                    </el-form-item>
                    <el-form-item>
                        <EnumSelect clearable :params="params" field="version" enum="version" placeholder="请选择版本"></EnumSelect>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8" style="text-align:right;">
                <el-button type="success" icon="el-icon-circle-plus" @click="addMerchant">&nbsp;添加商户</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row>
            <el-table-column prop="createYmd" label="入驻日期" align="center" width="120" :formatter="renderYmd"></el-table-column>
            <el-table-column prop="logo" label="LOGO" align="center" width="90">
                <template slot-scope="scope">
                    <img v-if="scope.row.logo" class="r64" :src="renderResource(scope.row.logo,'!wh495')"/>
                </template>
            </el-table-column>
            <el-table-column label="商户名称">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewMerchant(scope.row)">{{scope.row.name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" width="90" align="center" :formatter="renderVersion"></el-table-column>
            <el-table-column prop="managerName" label="管理员姓名"></el-table-column>
            <el-table-column prop="managerPhone" label="管理员手机" :formatter="renderPhone"></el-table-column>
            <el-table-column label="地址" :formatter="renderAddress"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editMerchant(scope.row)">修改</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <MerchantView :options="viewModal" @close="closeView"></MerchantView>
        <MerchantEditor :options="editorModal" @close="closeEditor"></MerchantEditor>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

    </div>
</template>


<script>

    import api from "~/api"
    import renderUtil from "../../util/renderUtil";


    export default {
        data() {
            return {
                params: {
                    districtCode: '',
                    query: ''
                },
                editorModal: {
                    visible: false,
                    action: '',
                    json: {}
                },
                historyModal: {
                    visible: false,
                    entityId: ''
                },
                viewModal: {
                    visible: false,
                    merchantId: ''
                },
                rows: [],
                total: 0,

            }
        },
        computed: {
            page: () => {
                return this.params.start / this.params.limit + 1;
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
        },
        methods: {
            renderVersion(row, cell, value) {
                return value ? renderUtil.renderEnum('version', value) : '';
            },
            renderAddress(row) {
                return renderUtil.renderDistrictCode(row.districtCode) + ' ' + (row.address ? row.address : '');
            },
            list() {
                api.request({
                    url: api.url.merchant.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addMerchant() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {}
                }
            },
            editMerchant(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            viewMerchant(row) {
                this.viewModal = {
                    visible: true,
                    merchantId: row.id
                }
            },
            closeEditor(updated) {
                this.editorModal = {};
                updated === true && this.list();
            },
            closeView() {
                this.viewModal = {};
            },
            history(row) {
                this.historyModal = {
                    visible: true,
                    entityId: row.id
                }
            },
            closeHistory() {
                this.historyModal = {};
            }
        }
    }

</script>
