<template>
    <el-dialog
        title="编辑平台端员工"
        width="25%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="80px">
            <el-form-item label="工号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="params.telephone"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-checkbox-group v-model="params.roleIds">
                    <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="在职状态">
                <el-radio-group v-model="params.atWork">
                    <el-radio :label="true">在职</el-radio>
                    <el-radio :label="false" class="text-danger">离职</el-radio>
                </el-radio-group>
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

    import {baseUtil} from "~/util"

    export default {
        props: ["options"],
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
                    console.log(json);
                    this.params = {
                        id: json.id,
                        code: json.code,
                        name: json.name,
                        telephone: json.telephone,
                        roleIds: json.roleIds || [],
                        atWork: json.atWork
                    };
                }
            }
        },
        computed: {
            roles: () => {
                let roles = [];
                baseUtil.getMetadata('adminRoles').forEach((roleGroup) => {
                    roleGroup.roles.forEach((role) => {
                        roles.push(role);
                    });
                });
                return roles;
            },

        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.user.employee.add;
                } else {
                    this.params.employeeId = this.params.id;
                    url = api.url.user.employee.edit;
                }
                delete this.params.id;
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
