<template>
	<el-dialog
		title="视频列表"
		:visible.sync="options.visible"
		width="70%"
		center
		append-to-body>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
			<el-table-column prop="name" label="名称" align="center"> </el-table-column>
			<el-table-column prop="image" label="图例" align="center"> </el-table-column>
			<el-table-column prop="encodeFormat" label="编码格式" align="center"> </el-table-column>
			<el-table-column prop="time" label="时长" align="center"> </el-table-column>
			<el-table-column prop="size" label="大小" align="center"> </el-table-column>
			<el-table-column prop="resolution" label="分辨率" align="center"> </el-table-column>
			<el-table-column prop="master" label="大师" align="center"> </el-table-column>
			<el-table-column prop="remark" label="备注" align="center"> </el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button
						size="mini" type="primary"
						@click="add(scope.$index, scope.row)">添加</el-button>
				</template>
			</el-table-column>
		</el-table>
		<span slot="footer" class="dialog-footer">
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {
		props: ['options'],
		data() {
			return {
				tableData: [{
					id:'1',
					name: '视频一',
					image: '',
					encodeFormat: '',
					time: '',
					size: '',
					resolution: '', // 分辨率
					master: '', // 分辨率
					remark: ''
				}, {
					id:'2',
					name: '视频二',
					image: '',
					encodeFormat: '',
					time: '',
					size: '',
					resolution: '', // 分辨率
					master: '', // 分辨率
					remark: ''
				}, {
					id:'3',
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
		methods: {
			close() {
				this.$emit('close')
			},
			add(index, row) {
				this.$emit('close', row)
			}
		}
	}
</script>

