<template>
    <el-dialog
        title="编辑商户信息"
        width="30%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="90px">
            <el-form-item label="商户名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="省市区县">
                <RegionSelect v-model="params.districtCode"></RegionSelect>
            </el-form-item>
            <el-form-item label="街道地址">
                <el-input v-model="params.address"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名">
                <el-input v-model="params.managerName"></el-input>
            </el-form-item>
            <el-form-item label="管理员手机">
                <el-input v-model="params.managerPhone"></el-input>
            </el-form-item>
            <el-form-item label="软件版本">
                <EnumRadio :params="params" field="version" enum="version"></EnumRadio>
            </el-form-item>
            <el-form-item label="LOGO文件">
                <el-upload ref="upload" :file-list="files" name="logoFile" :action="reqUrl" :auto-upload="false" :data="params" :on-success="success" :on-error="error" :on-change="fileChange" :before-remove="fileChange" :multiple="true" :show-file-list="true" :limit="limit">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
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
    import {LoadingEvent} from "../../common/LoadingEvent";

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                easyClose: true,
                reqUrl: '',
                files: [],
                file: '',
                limit: 1
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    let json = this.options.json || {};
                    this.params = {
                        id: json.id,
                        name: json.name,
                        districtCode: json.districtCode,
                        address: json.address,
                        managerName: json.managerName,
                        managerPhone: json.managerPhone,
                        version: json.version,
                        'access-token': baseUtil.getAccessToken()
                    };
                }
                if (this.options.action === 'add') {
                    this.reqUrl = api.url.merchant.add.toString();
                } else {
                    this.reqUrl = api.url.merchant.edit.toString();
                }
                this.files = [];
            }
        },
        methods: {
            fileChange(file, list) {
                this.files = list;
            },
            submit() {
                if (this.options.action === 'edit') {
                    this.params.merchantId = this.params.id;
                }
                delete this.params.id;

                let uploader = this.$refs.upload;
                if (this.files.length > 0) {
                    LoadingEvent.$emit('mask');
                    uploader.submit();
                } else {
                    api.request({
                        url: this.reqUrl,
                        method: 'post',
                        params: this.params,
                        success: () => {
                            this.close(true);
                        }
                    });
                }

            },
            success(json) {
                LoadingEvent.$emit("unmask");
                if (json.status == 200) {
                    this.close(true);
                } else {
                    Message.error(json.message || '操作失败');
                }
            },
            error(json) {
                Message.error(json.message || '操作失败');
            },
            close(updated) {
                this.$emit("close", updated);
            }
        }
    }

</script>
