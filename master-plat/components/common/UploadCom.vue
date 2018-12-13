<template>
	<span @click="chooseFile">
		<input type="file" @change="changeFile" ref="uploadInput" :multiple="false" style="display: none" :disabled="disabled">
		<slot></slot>
	</span>
</template>

<script>
	export default {
		props: {
			action: {
				type: String,
				required: true
			},
			name: {
				type: String,
				default: 'file'
			},
			handleErr: {
				type: Function,
				default: () => {}
			},
			handleSuccess: {
				type: Function,
				default: () => {}
			},
			handleChange: {
				type: Function,
				default: () => {}
			},
			data: Object,
			disabled: Boolean
		},
		data() {
			return {
				fileList: []
			}
		},
		methods: {
			init() {
				this.fileList = []
			},
			chooseFile() {
				this.$refs.uploadInput.click()
			},
			changeFile(e) {
				const files = e.target.files;
				if (!files[0]) return;
				this.fileList = e.target.files;
				this.preview();
			},
			preview() {
				this.handleChange && this.handleChange(this.fileList[0]);
				// this.imageUrl = URL.createObjectURL(this.fileList[0]);
			},
			submit() {
				let option = {};
				let form = new FormData();
				form.append(this.name, this.fileList[0]);
				if (this.data) {
					Object.keys(this.data).forEach(key => {
						form.append(key, this.data[key])
					});
				}
				option.form = form;
				option.action = this.action;
				this.ajax(option)
			},
			ajax(option) {
				let xhr = new XMLHttpRequest();
				xhr.open("post", option.action, true);
				xhr.onreadystatechange = () => {
					if(xhr.readyState === 4 && xhr.status === 200){
						let response = JSON.parse(xhr.responseText)
						if (response.status === 200) {
							this.handleSuccess(response)
							this.$message({
								message: '上传成功',
								type: 'success'
							})
						} else {
							this.handleErr(response)
							this.$message({
								message: `${response.message}`,
								type: 'error'
							})
						}
					}
				}
				xhr.send(option.form);
			}
		},
		mounted() {
			console.log('com is mounted')
		}
	}
</script>

<style scoped="">

</style>
