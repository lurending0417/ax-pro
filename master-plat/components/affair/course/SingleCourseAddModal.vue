<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="40%"
		append-to-body
		center>
		<div>
			<el-form label-position="center" label-width="80px" :model="form" class="form_style" :disabled="!options.canChange">
				<el-form-item label="课程名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="课程简介">
					<el-input v-model="form.intro" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="归属大师" prop="master" >
					<el-select v-model="form.master" placeholder="大师" style="width: 100%">
						<el-option v-for="item in masters" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="视频添加">
					<el-input v-model="form.videoName" style="width: 80%;margin-right: 20px;" disabled></el-input>
					<el-button type="warning" @click="view">浏览</el-button>
				</el-form-item>
				<el-form-item label="图片添加">
					<el-upload
						class="avatar-uploader"
						action="https://jsonplaceholder.typicode.com/posts/"
						:show-file-list="false"
						:on-success="handleAvatarSuccess">
						<img v-if="form.imageUrl" :src="imageUrl" class="avatar">
						<i  class="el-icon-plus avatar-uploader-icon" v-else></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="价格选项">
					<el-radio v-model="form.isFree" :label="true">免费课程</el-radio>
					<el-radio v-model="form.isFree" :label="false">折扣课程</el-radio>
				</el-form-item>
				<el-form-item label="原价" v-if="!form.isFree">
					<el-input v-model="form.regularPrice"></el-input>
				</el-form-item>
				<el-form-item label="现价" v-if="!form.isFree">
					<el-input v-model="form.retailPrice"></el-input>
				</el-form-item>
			</el-form>
			<ViewVideoListModal :options="subModalObj" @close="subClose"></ViewVideoListModal>
		</div>

		<span slot="footer" class="dialog-footer" v-if="options.canChange">
			<el-button @click="close">取 消</el-button>
			<el-button type="success" @click="save">保 存</el-button>
			<el-button type="primary" @click="save">保存并上架</el-button>
		</span>
		<span slot="footer" class="dialog-footer" v-else>
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import BaseForm from '~/util/formObj'
	import ViewVideoListModal from './ViewVideoListModal.vue'
	export default {
		components: {
			ViewVideoListModal
		},
		props: ['options'],
		data() {
			let form = new BaseForm({
				name: '',
				intro: '',
				master: '',
				videoId: '',
				videoName: '',
				imageUrl: '',
				retailPrice: '',
				regularPrice: '',
				isFree: true
			});
			return {
				subModalObj: {
					visible: false
				},
				form: form,
				masters: [{
					id: 0,
					name: ''
				}, {
					id: 1,
					name: '张大师'
				}, {
					id: 2,
					name: '李大师'
				}]
			}
		},
		methods: {
			close() {
				this.form.init({isFree: true});
				this.$emit('close')
			},
			subClose(row) {
				console.log('row', row)
				this.subModalObj.visible = false;
				this.form.videoId = row.id
				this.form.videoName = row.name
			},
			save() {
				console.log('save', this.form)
				this.close()
			},
			view() {
				this.subModalObj.visible = true;
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			}
		}
	}
</script>

