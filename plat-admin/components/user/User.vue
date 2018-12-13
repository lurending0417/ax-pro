<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <EnumSelect clearable enum="gender" :params="params" field="gender" placeholder="用户性别"></EnumSelect>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="telephone" label="手机号码" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewUser(scope.row.id)">{{scope.row.telephone}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="inviteCode" label="邀请码" align="center"></el-table-column>
            <el-table-column prop="gender" label="性别" align="center" :formatter="renderGender"></el-table-column>
            <el-table-column label="登录密码" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.loginPwd" class="el-icon-circle-check text-navy"></i>
                    <i v-else class="el-icon-circle-close text-muted"></i>
                </template>
            </el-table-column>
            <el-table-column label="微信" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.weixin" class="el-icon-circle-check text-navy"></i>
                    <i v-else class="el-icon-circle-close text-muted"></i>
                </template>
            </el-table-column>
            <el-table-column label="实名" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.realName" class="el-icon-circle-check text-navy"></i>
                    <i v-else class="el-icon-circle-close text-muted"></i>
                </template>
            </el-table-column>
            <el-table-column label="支付密码" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.payCode" class="el-icon-circle-check text-navy"></i>
                    <i v-else class="el-icon-circle-close text-muted"></i>
                </template>
            </el-table-column>
            <el-table-column label="绑卡" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.bankCard" class="el-icon-circle-check text-navy"></i>
                    <i v-else class="el-icon-circle-close text-muted"></i>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="170" align="center" :formatter="renderTime"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>
        <UserView :options="userModal" @close="closeUserView"></UserView>
    </div>
</template>


<script>

    import api from "~/api"
    import {renderUtil} from "~/util";

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                rows: [],
                total: 0,
                userModal: {
                    visible: false,
                    userId: ''
                }
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
            this.$on("reset", () => {
                this.rows = [];
                this.total = 0;
            });
        },
        methods: {
            viewUser(userId) {
                this.userModal = {
                    visible: true,
                    userId: userId
                }
            },
            closeUserView() {
                this.userModal = {
                    visible: false,
                    userId: ''
                }
            },
            list() {
                api.request({
                    url: api.url.user.list,
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
