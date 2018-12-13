<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="50%"
		append-to-body
		center>
		<div>
			<el-form label-position="center" label-width="80px" :model="form" class="form_style" :disabled="!options.canChange">
				<el-form-item label="系列名称">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="系列简介">
					<el-input v-model="form.intro" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="大师" prop="masterId" >
					<el-select v-model="form.masterId" placeholder="大师" style="width: 100%">
						<el-option v-for="item in masters" :key="item.id" :label="item.nick" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图片添加">
					<UploadCom
						ref="upload"
						:handleSuccess="handleSuccessFun"
						:handleChange="handleAvatarChange"
						:action="preUrl"
						:data="form"
						name="banner">
						<img :src="dialogImageUrl" class="img-preview" v-if="dialogImageUrl">
						<i class="add-btn" v-else>+</i>
					</UploadCom>
				</el-form-item>
				<el-form-item label="单价">
					<el-input v-model="form.sectionPrice"></el-input>
				</el-form-item>
				<el-form-item label="系列原价">
					<el-input v-model="form.coursePrice"></el-input>
				</el-form-item>
			</el-form>

		</div>

		<span slot="footer" class="dialog-footer" v-if="options.canChange">
			<el-button @click="close">取 消</el-button>
			<el-button type="success" @click="save">保 存</el-button>
			<el-button type="primary" @click="save('up')">保存并上架</el-button>
		</span>

		<span slot="footer" class="dialog-footer" v-else>
			<el-button @click="close">关 闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import Arabia_To_SimplifiedChinese from '~/util/digital'
	import BaseForm from '~/util/formObj'
	import ViewVideoListModal from './ViewVideoListModal.vue'
	import SeriesCourseDetailAdd from './SeriesCourseDetailAdd.vue'
	import api from '~/api'
	import {mapGetters} from 'vuex'

	import UploadCom from '~/components/common/UploadCom'
	export default {
		components: {
			SeriesCourseDetailAdd,
			UploadCom
		},
		props: ['options'],
		data() {
			let form = new BaseForm({
				courseId: '',
				title: '',
				intro: '',
				masterId: '',
				coursePrice: '',
				sectionPrice: '',
				'access-token': ''
			});
			return {
				dialogImageUrl: '',
				isChangeUrl: false,
				preUrl: '',
				form: form
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			})
		},
		methods: {
			handleSuccessFun() {
				this.close('refresh')
			},
			handleAvatarSuccess(res) {
				console.log('success')
				if (res.status === 200) {
					this.close('refresh')
				} else {
//					this.isChangeUrl = false;
					this.$message({
						message: res.message,
						type: 'error'
					})
				}
			},
			handleAvatarChange(file) {
				this.isChangeUrl = true;
				this.dialogImageUrl = URL.createObjectURL(file);
			},
			handleErr(err) {
				this.$message.error(err);
			},
			wrapFunc(num) {
				return Arabia_To_SimplifiedChinese(num + 1);
			},
			close(tag) {
				this.form.init();
				this.dialogImageUrl = '';
				this.$emit('close', tag)
			},
			save(tag) {
				if (tag === 'up') {
					this.form.enabled = true;
				} else {
					this.form.enabled = false;
				}
				if (this.isChangeUrl) {
					this.$refs.upload.submit();
				} else if (this.options.row.id) {
					api.request({
						url: api.url.course.edit,
						params: {...this.form, banner: this.dialogImageUrl},
						success: (json) => {
							this.close('refresh')
						}
					})
				} else {
					delete this.form.courseId;
					api.request({
						url: api.url.course.add,
						params: {...this.form, banner: ''},
						success: (json) => {
							this.close('refresh')
						}
					})
				}
			}
		},
		watch: {
			'options.visible': function (val) {
				console.log('modal is visible')
				setTimeout(()=> {
					if (val && !row.id) {
						console.log('非修改')
						this.$refs.upload.init()
					}
				}, 0)
				let {row} = this.options;
				this.isChangeUrl = false;
				this.preUrl = api.getBaseUrl() + `/course`
				this.form.init();
				this.dialogImageUrl = '';
				this.form['access-token'] = api.getToken()
				if (val && row.id) {
					let {title, intro, coursePrice, sectionPrice} = row;
					Object.assign(this.form, {title, intro, coursePrice, sectionPrice})
					this.form.masterId = row.master.id;
					this.dialogImageUrl =  row.banner;
					this.preUrl = api.getBaseUrl() + `/course/${row.id}`
					this.form.courseId = row.id
				}
			}
		},
		mounted() {
			console.log('modal is mounted')
			this.preUrl = api.getBaseUrl() + '/course';
		}
	}
</script>

<style scoped>
	.course_item_wrap{
		margin-bottom: 10px;
		display: flex;
		align-items: center;
	}
	.video_name{
		flex-grow:1 ;
		margin-left: 20px;
	}
	.upload-demo{
		display: flex;
	}


	.add-btn{
		display: inline-block;
		font-size: 28px;
		color: #8c939d;
		background-color: #f0f1f3;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		font-style: normal;
		border-radius: 6px;
		border: 1px dashed #fff;
		box-sizing: border-box;
	}
	.add-btn:hover,.img-preview:hover{
		border: 1px dashed #409EFF;
		cursor: pointer;
	}
	.img-preview{
		height: 100px;
		border: 1px dashed #fff;
		border-radius: 6px;
	}
</style>
