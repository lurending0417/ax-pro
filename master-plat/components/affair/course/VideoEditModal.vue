<template>
	<el-dialog append-to-body
		title="修改视频"
		:visible.sync="options.visible"
		width="40%"
		center>
		<div>
			<video src="https://vjs.zencdn.net/v/oceans.mp4" controls="controls" style="width: 100%">
				您的浏览器不支持 video 标签。
			</video>
			<el-form label-position="center" label-width="80px" :model="form" class="form_style">
				<el-form-item label="视频名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="大师" prop="master" >
					<el-select v-model="form.master" placeholder="请选择大师" style="width: 100%">
						<el-option v-for="item in masters" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remark" type="textarea"></el-input>
				</el-form-item>
			</el-form>
		</div>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import BaseForm from '~/util/formObj'
	export default {
		props: ['options'],
		data() {
			return {
				form: new BaseForm({
					name: '',
					master: '',
					remark: ''
				}),
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
				this.form.init();
				this.$emit('close')
			},
			save() {
				console.log('save', this.form)
				this.close()
			}
		}
	}
</script>

<style scoped>
	.form_style{
		margin-top: 20px;
	}
</style>
