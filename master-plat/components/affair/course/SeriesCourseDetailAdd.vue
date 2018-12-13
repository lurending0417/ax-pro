<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="40%"
		center
		append-to-body>
		<div>
			<el-form label-position="center" :rules="options.canChange?rules: {}" ref="ruleForm"
					 label-width="100px" :model="form" class="form_style" :disabled="!options.canChange">
				<el-form-item label="编号" prop="code">
					<el-input v-model="form.code"></el-input>
				</el-form-item>
				<el-form-item label="单集名称" prop="title">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="单集简介" prop="intro">
					<el-input v-model="form.intro" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="视频添加">
					<el-upload
						class="avatar-uploader"
						ref="video"
						:multiple="false"
						:data="form"
						:disabled="!options.canChange"
						name="video"
						:on-change="handleVideoChange"
						:on-success="handleSuccess"
						:on-progress="handleProgress"
						:on-error="handleErr"
						:action="fullUrl"
						:show-file-list="false"
						:auto-upload="false">
						<video v-if="videoUrl" :src="videoUrl" controls="controls" style="width: 100%">
							您的浏览器不支持 video 标签。
						</video>
						<i  class="el-icon-plus avatar-uploader-icon" v-else></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="图片添加">
					<el-upload
						class="avatar-uploader"
						ref="upload"
						:multiple="false"
						:data="form"
						:disabled="!options.canChange"
						name="banner"
						:on-change="handleImgChange"
						:on-success="handleSuccess"
						:on-error="handleErr"
						:on-progress="handleProgress"
						:action="fullUrl"
						:show-file-list="false"
						:auto-upload="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i  class="el-icon-plus avatar-uploader-icon" v-else></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="缩略图添加">
					<el-upload
						class="avatar-uploader"
						ref="thumb"
						:multiple="false"
						:data="form"
						:disabled="!options.canChange"
						name="thumb"
						:on-change="handleThumbChange"
						:on-success="handleSuccess"
						:on-error="handleErr"
						:on-progress="handleProgress"
						:action="fullUrl"
						:show-file-list="false"
						:auto-upload="false">
						<img v-if="thumbUrl" :src="thumbUrl" class="avatar">
						<i  class="el-icon-plus avatar-uploader-icon" v-else></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="价格选项">
					<el-radio v-for="(item,index) in discountTypes"
							  v-model="form.discountType"
							  :label="item.id"
							  :key="'discount'+index">{{item.name}}</el-radio>
				</el-form-item>
				<el-form-item label="折扣价" v-if="form.discountType === 'DISCOUNT'">
					<el-input v-model="form.discountPrice"></el-input>
				</el-form-item>
			</el-form>
		</div>

		<span slot="footer" class="dialog-footer" v-if="this.options.canChange">
			<el-button @click="close">取 消</el-button>
			<el-button type="success" @click="save">保 存</el-button>
			<el-button type="primary" @click="save('up')">保存并上架</el-button>
		</span>
		<span slot="footer" class="dialog-footer" v-else>
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import BaseForm from '~/util/formObj'
	import ViewVideoListModal from './ViewVideoListModal.vue'
	import {mapGetters} from 'vuex'
	import api from '~/api'
	export default {
		components: {
			ViewVideoListModal
		},
		props: ['options', 'courseId'],
		data() {
			let form = new BaseForm({
				courseId: '',
				code: '',
				title: '',
				intro: '',
				discountType: 'NORMAL',
				discountPrice: '',
				'access-token': ''
			});
			return {
				form: form,
				rules: {
					code: [
						{ required: true, message: '请输入分集序号', trigger: 'blur' }
					],
					title: [
						{ required: true, message: '请输入名称', trigger: 'change' }
					],
					intro: [
						{ required: true, message: '请输入简介', trigger: 'change' }
					]
				},
				thumbUrl: '',
				imageUrl: '',
				videoUrl: '',
				isChangeImgUrl: false,
				isChangeThumbUrl: false,
				isChangeVideoUrl: false,
				uploadVideoLoading: {},
				preUrl: '',
				fullUrl: '',
				discountTypes: [{
					id: 'NORMAL',
					name: '正常'
				}, {
					id: 'FREE',
					name: '免费'
				}, {
					id: 'DISCOUNT',
					name: '折扣'
				}]
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			})
		},
		methods: {
			close(tag) {
				this.$emit('close', tag)
			},
			submitFun(tag) {
				if (tag === 'up') {
					this.form.enabled = true;
				} else {
					this.form.enabled = false;
				}
				if (this.isChangeImgUrl) {
					console.log('111111111')
					delete this.form.banner;
					this.$refs.upload.submit();
				} else if (this.isChangeThumbUrl) {
					console.log('22222222222');
					delete this.form.thumb;
					this.$refs.thumb.submit();
				} else if (this.isChangeVideoUrl) {
					console.log('333333333333333');
					delete this.form.video;
					this.$refs.video.submit();
				} else if (!this.options.section.id) {
					api.request({
						url: api.url.course.section.add,
						params: {...this.form},
						success: (json) => {
							this.close('refresh')
						}
					})
				} else {
					console.log('444444444444444')
					api.request({
						url: api.url.course.section.edit,
						params: {...this.form, sectionId: this.options.section.id},
						success: (json) => {
							this.close('refresh')
						}
					})
				}
			},
			save(tag) {
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						this.submitFun(tag)
					} else {
						this.$message({
							type: 'warning',
							message: '有未填的必填项'
						})
						return false;
					}
				});
			},
			view() {
				this.subModalObj.visible = true;
			},
			handleThumbChange(file) {
				this.isChangeThumbUrl = true;
				this.thumbUrl = URL.createObjectURL(file.raw);
				this.form.thumb = file.raw;
			},
			handleImgChange(file) {
				this.isChangeImgUrl = true;
				this.imageUrl = URL.createObjectURL(file.raw);
				this.form.banner = file.raw;
			},
			handleVideoChange(file) {
				this.isChangeVideoUrl = true;
				this.videoUrl = URL.createObjectURL(file.raw);
				this.form.video = file.raw;
			},
			handleSuccess(res) {
				if (res.status === 200) {
					this.close('refresh')
				} else {
					this.$message({
						message: res.message,
						type: 'error'
					})
				}
				this.uploadVideoLoading.close()
			},
			handleErr(err) {
				console.log('err', err)
				this.uploadVideoLoading.close()
//				this.$message.error(err);
				this.$message({
					message: '文件上传失败',
					type: 'error'
				})
			},
			handleProgress() {
				this.uploadVideoLoading = this.$loading({
					lock: true,
					text: '上传中，请耐心等候',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
			},
			initForm() {
				this.form.init({discountType: 'NORMAL'});
				this.imageUrl = '';
				this.thumbUrl = '';
				this.videoUrl = '';
				this.isChangeImgUrl = false;
				this.isChangeThumbUrl = false;
				this.isChangeVideoUrl = false;
				this.form.courseId = this.courseId;
				this.form['access-token'] = api.getToken()
				this.fullUrl = this.preUrl + '/course/section';
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.initForm()
					let {section} = this.options;
					if (section.id) {
						this.fullUrl = this.preUrl +`/course/section/${section.id}`;
						let {code, title, intro, discountType, discountPrice} = section;
						Object.assign(this.form, {code, title, intro, discountType, discountPrice})
						this.imageUrl = section.banner;
						this.thumbUrl = section.thumb;
						if (section.video) {
//							this.videoUrl = this.options.section.video;
						}
					}
				}
			}
		},
		mounted() {
			this.preUrl = api.getBaseUrl();
		}
	}
</script>

<style scoped>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		background-color: #f0f1f3;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
</style>
