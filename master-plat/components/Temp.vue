<template>
	<div>
		开发中，暂无内容
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					name: '视频一',
					image: '',
					encodeFormat: '',
					time: '',
					size: '',
					resolution: '', // 分辨率
					master: '', // 分辨率
					remark: ''
				}, {
					name: '视频二',
					image: '',
					encodeFormat: '',
					time: '',
					size: '',
					resolution: '', // 分辨率
					master: '', // 分辨率
					remark: ''
				}, {
					name: '视频三',
					image: '',
					encodeFormat: '',
					time: '',
					size: '',
					resolution: '', // 分辨率
					master: '', // 分辨率
					remark: ''
				}]
			}
		},
		methods:{
			handleEdit(index, row) {
				console.log(index, row);
			}
		}
	}
</script>
