<template>
    <div>
        <el-row type="flex" justify="space-between" style="margin-bottom: 10px;">
            <el-col :span="8" class="text-left" v-if="hasSaved">
                <el-button type="success" icon="el-icon-circle-plus" @click="editRule">编辑</el-button>
            </el-col>
            <el-col :span="8" class="text-left" v-else>
                <el-button type="success" icon="el-icon-circle-plus" @click="saveRule">保存</el-button>
                <el-button icon="el-icon-remove" @click="cancelEdit">取消</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" header-cell-class-name="text-center" stripe border highlight-current-row
                  :span-method="arraySpanMethod" style="width: 100%;">
            <el-table-column label="零售价" align="center" width="750">
                <template slot-scope="scope">
                    <span v-if="hasSaved">
                        {{scope.row.startPrice}}<i class="el-icon-minus"
                                                   style="margin: 10px 10px 22px;"></i>{{scope.row.endPrice}}
                    </span>
                    <span v-else>
                        <el-form inline class="demo-form-inline" style="height: 43px;"
                                 v-if="scope.$index !== rowsLen-1">
                            <el-form-item label="">
                                <el-input v-model.number="scope.row.startPrice" :readonly="scope.$index === 0"
                                          @input="changeStartPrice(scope.$index)"
                                ></el-input>
                            </el-form-item>
                            <i class="el-icon-minus" style="margin: 10px 10px 22px 0;"></i>
                            <el-form-item label="">
                                <el-input v-model.number="scope.row.endPrice" :readonly="scope.$index === rowsLen-2"
                                          @input="changeEndPrice(scope.$index)"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                        <span v-else>
                        <el-button size="mini" type="success" @click="addRule(scope)"
                                   icon="el-icon-circle-plus"></el-button>
                        </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="rent" label="租金" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.$index !== rowsLen-1 && !hasSaved">
                    <el-input v-model.number="scope.row.rent"></el-input>
                    </span>
                    <span v-else>
                        {{scope.row.rent}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope" v-if="!hasSaved">
                    <span v-if="!(scope.$index === 0 || scope.$index === rowsLen-2 )">
                    <el-button size="mini" type="danger" icon="el-icon-remove"
                               @click="deleteRow(scope.$index)"></el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    import api from "~/api"

    export default {

        data() {
            return {
                hasSaved: false,
                rows: []
            }
        },
        computed: {
            rowsLen() {
                return this.rows.length
            }
        },
        methods: {
            editRule() {
                this.hasSaved = false;
                this.rows.push({})
            },
            saveRule() {
                let rentRules = this.rows.map((item) => {
                    return {
                        startPrice: item.startPrice,
                        endPrice: item.endPrice,
                        rent: item.rent
                    }
                })
                rentRules.pop()
                api.request({
                    url: api.url.lease.rentRule.add,
                    params: {
                        ruleJson: JSON.stringify(rentRules)
                    },
                    success: () => {
                        this.list()
                    }
                });
            },
            addRule() {
                let tempValue = this.rows[this.rowsLen - 3].endPrice;
                this.rows.splice(-2, 0, {
                    startPrice: tempValue,
                    endPrice: '',
                    rent: ''
                })
                this.rows[this.rowsLen - 2].startPrice = ''
            },
            cancelEdit() {
                this.hasSaved = true;
                this.list()
            },
            changeEndPrice(index) {
                this.rows[index + 1].startPrice = event.target.value;
            },
            changeStartPrice(index) {
                this.rows[index - 1].endPrice = event.target.value;
            },
            deleteRow(index) {
                this.rows.splice(index, 1);
                this.rows[index].startPrice = this.rows[index - 1].endPrice
            },
            arraySpanMethod({rowIndex, columnIndex}) {
                if (!this.hasSaved) {
                    if (rowIndex === this.rowsLen - 1) {
                        if (columnIndex === 0) {
                            return [1, 3];
                        } else {
                            return [0, 0];
                        }
                    }
                } else {
                    return [1, 1]
                }
            },
            initRentRule() {
                this.rows.push({
                    startPrice: 0,
                    endPrice: '',
                    rent: ''
                })
                this.rows.push({
                    startPrice: '',
                    endPrice: 50000,
                    rent: ''
                })
                this.rows.push({})
            },
            list() {
                api.request({
                    url: api.url.lease.rentRule.list,
                    params: {},
                    success: (data) => {
                        this.hasSaved = true;
                        this.rows = data.rows;
                    }
                });
            }
        },
        mounted() {
            this.initRentRule()
            this.$on("init", () => {
                this.list();
            });
        }

    }

</script>
