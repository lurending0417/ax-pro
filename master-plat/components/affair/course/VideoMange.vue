<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline>
					<el-form-item>
						<el-select v-model="params.master" placeholder="大师" style="width: 100%">
							<el-option v-for="item in masters" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model="params.query" clearable placeholder="名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
			<el-table-column prop="name" label="名称" width="100" align="center"> </el-table-column>
			<el-table-column prop="image" label="图例" width="180" align="center"> </el-table-column>
			<el-table-column prop="encodeFormat" label="编码格式" width="100" align="center"> </el-table-column>
			<el-table-column prop="time" label="时长" width="100" align="center"> </el-table-column>
			<el-table-column prop="size" label="大小" width="100" align="center"> </el-table-column>
			<el-table-column prop="resolution" label="分辨率" width="100" align="center"> </el-table-column>
			<el-table-column prop="master" label="大师" width="100" align="center"> </el-table-column>
			<el-table-column prop="remark" label="备注" align="center"> </el-table-column>
			<el-table-column label="操作" align="center" width="100">
				<template slot-scope="scope">
					<el-button
						size="mini" type="primary"
						@click="handleEdit(scope.$index, scope.row)">修改</el-button>
				</template>
			</el-table-column>
		</el-table>

		<VideoEditModal :options="videoEditModal" @close="closeModal"></VideoEditModal>
		<no-ssr><Pagination :options="this" @list="list"></Pagination></no-ssr>
	</div>
</template>

<script>
	import VideoEditModal from './VideoEditModal.vue'
	export default {
		components: {
			VideoEditModal
		},
		data() {
			return {
				params: {
					master: '',
					query: ''
				},
				total: 0,
				videoEditModal: {
					visible: false,
					videoObj: {}
				},
				masters: [{
					id: 0,
					name: '全部'
				}, {
					id: 1,
					name: '张大师'
				}, {
					id: 2,
					name: '李大师'
				}],
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
				this.videoEditModal = {
					visible: true,
					videoObj: row
				}
			},
			closeModal() {
				this.videoEditModal = {
					visible: false,
					videoObj: {}
				}
			},
			list() {

			},
			search() {
				console.log('params', this.params)
			}
		}
	}
</script>
