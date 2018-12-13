<template>
	<el-dialog append-to-body
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="40%"
		center>
		<el-form label-position="center" label-width="80px" :model="form" :rules="rules" ref="bannerForm">
			<el-form-item label="栏目" prop="model" >
				<el-select v-model="form.model" placeholder="栏目" style="width: 100%">
					<el-option v-for="item in model" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="编号">
				<el-input v-model="form.code"></el-input>
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="链接" prop="url">
				<el-input v-model="form.url"></el-input>
			</el-form-item>
			<el-form-item label="图片添加">
				<el-upload
					class="avatar-uploader"
					ref="upload"
					:multiple="false"
					:data="form"
					name="img"
					:on-change="handleImgChange"
					:on-success="handleImgSuccess"
					:on-error="handleErr"
					:action="fullUrl"
					:show-file-list="false"
					:auto-upload="false">
					<img v-if="imageUrl" :src="imageUrl" class="avatar">
					<i  class="el-icon-plus avatar-uploader-icon" v-else></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="状态">
				<el-radio v-model="form.enabled" :label="true">启用</el-radio>
				<el-radio v-model="form.enabled" :label="false">停用</el-radio>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer" >
			<el-button @click="close">取消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api"
	import {INDEX_MODEL} from '~/api/const'
	import BaseForm from '~/util/formObj'
	export default {
		props: ['options'],
		data() {
			return {
				rules: {
					url: [
						{ required: true, message: '不可忽略', trigger: 'change' }
					]
				},
				form: new BaseForm({
					model: '',
					code: '',
					title: '',
					url: '',
					enabled: true,
					'access-token': ''
				}),
				model: [],
				imageUrl: '',
				preUrl: '',
				fullUrl: '',
				isChangeImgUrl: false
			}
		},
		methods: {
			handleImgSuccess(res) {
				if (res.status === 200) {
					this.close('refresh')
				} else {
					this.$message({
						message: res.message,
						type: 'error'
					})
				}
			},
			handleImgChange(file) {
				this.isChangeImgUrl = true
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			handleErr(err) {
				console.log('err', err)
				this.$message.error(err);
			},
			submitForm() {
				let {row} = this.options;
				console.log('this.isChangeImgUrl', this.isChangeImgUrl)
				if (this.isChangeImgUrl) {
					this.$refs.upload.submit();
				} else {
					if (row.id) {
						api.request({
							url: api.url.page.index.banner.edit,
							params: {...this.form, img: this.imageUrl, bannerId: this.options.row.id},
							success: (json) => {
								this.close('refresh')
							}
						})
					} else {
						this.$message('尚未选则图片文件')
					}
				}
			},
			save() {
				this.$refs['bannerForm'].validate((valid) => {
					if (valid) {
						this.submitForm()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			close(tag) {
				this.$emit('close', tag)
			},
			initPage() {
				this.form.init({model: this.model[0].id, enabled: true});
				this.imageUrl = '';
				this.isChangeImgUrl = false;
				this.form['access-token'] = api.getToken()
				this.fullUrl = this.preUrl + '/page/index/banner';
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.initPage()
					let {row} = this.options
					if (this.options.row.id) {
						let {model, code, title, url, enabled} = row
						Object.assign(this.form, {model, code, title, url, enabled});
						this.fullUrl = this.preUrl + '/page/index/banner/' + row.id;
						this.imageUrl = row.img
					}
				}
			}
		},
		mounted() {
			this.preUrl = api.getBaseUrl();
			this.model = INDEX_MODEL;
		}
	}
</script>
