<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <RegionSelect v-model="params.districtCode"></RegionSelect>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row style="width: 100%">
            <el-table-column prop="createYmd" label="开通日期" align="center" :formatter="renderYmd"></el-table-column>
            <el-table-column prop="name" label="门店名称"></el-table-column>
            <el-table-column prop="districtCode" label="省市区县" :formatter="renderDistrictCode"></el-table-column>
            <el-table-column prop="managerName" label="管理员姓名"></el-table-column>
            <el-table-column prop="managerPhone" label="管理员电话"></el-table-column>
            <el-table-column prop="servicePhone" label="客服电话"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
        <div style="text-align: right; margin-top:20px;">
            <Pagination :options="this" @list="list"></Pagination>
        </div>
    </div>
</template>

<script>

    import api from "~/api"

    export default {
        props: ['options'],
        data() {
            return {
                params: {
                    merchantId: this.options ? this.options.merchantId : ''
                },
                rows: [],
                total: 0
            }
        },
        mounted() {
            this.$on("init", () => {
                this.rows = [];
                this.total = 0;
                this.list();
            });
            this.$on("reset", () => {
                this.rows = [];
                this.total = 0;
            });
        },
        watch: {
            'options.merchantId': function (value) {
                this.params.merchantId = value;
            }
        },
        methods: {
            list() {
                api.request({
                    url: api.url.store.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            }
        }

    }
</script>
