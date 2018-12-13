<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="12">
				<el-form inline>
					<el-form-item>
						<el-select v-model="params.enabled" placeholder="是否启用" style="width: 100%">
							<el-option label="全部" value=""></el-option>
							<el-option label="启用" :value="true"></el-option>
							<el-option label="停用" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="list">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="12" class="text_right">
				<el-button type="danger" @click="add">新增</el-button>
			</el-col>
		</el-row>

		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column prop="model" label="栏目" fixed align="center" :formatter="formatModel"> </el-table-column>
			<el-table-column prop="code" label="编号" align="center" width="50"> </el-table-column>
			<el-table-column prop="title" label="名称" align="center"> </el-table-column>
			<el-table-column prop="enabled" label="是否启用" align="center" :formatter="formatStatus"> </el-table-column>
			<el-table-column prop="url" label="链接" align="center" width="150"> </el-table-column>
			<el-table-column prop="img" label="图片" align="center" width="250">
				<template slot-scope="scope">
					<img :src="scope.row.img" alt="" width="100px;">
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center" width="200" :formatter="renderTime"> </el-table-column>
			<el-table-column prop="creatorName" label="创建人" align="center" > </el-table-column>
			<el-table-column prop="updateTime" label="修改时间" align="center" width="200" :formatter="renderTime"> </el-table-column>
			<el-table-column prop="updaterName" label="修改人" align="center" > </el-table-column>

			<el-table-column label="操作" align="center" width="250" fixed="right">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="handleEdit(scope.row, 'update')">修改</el-button>
					<el-button size="mini" @click="handleDelete(scope.row, 'update')">删除</el-button>
					<el-button size="mini" type="warning" @click="viewHistory(scope.row, 'update')">历史</el-button>
				</template>
			</el-table-column>
		</el-table>
		<BannerAddModal :options="modalObj" @close="closeModal"></BannerAddModal>
	</div>
</template>

<script>
	import api from '~/api'
	import {INDEX_MODEL} from '~/api/const'
	import BannerAddModal from './BannerAddModal.vue'
	export default {
		components: {
			BannerAddModal
		},
		data() {
			return {
				tableData: [{
					title: 'banner1'
				}],
				params: {
					enabled: ''
				},
				modalObj: {
					visible: false,
					modalTitle: '',
					row: {}
				}
			}
		},
		methods: {
			formatStatus(row) {
				if (row.enabled) {
					return '启用'
				}
				return '停用'
			},
			formatModel(row) {
				if (!row.model) {
					return ''
				}
				return this.model.filter(item => item.id === row.model)[0].name
			},
			add() {
				this.modalObj = {
					visible: true,
					modalTitle: '新增banner',
					row: {}
				}
			},
			handleDelete(row) {
				api.request({
					params: {bannerId: row.id},
					url: api.url.page.index.banner.del,
					success: (json) => {
						this.list()
					}
				})
			},
			handleEdit(row) {
				this.modalObj = {
					visible: true,
					modalTitle: '修改banner',
					row
				}
			},
			viewHistory(row) {

			},
			list() {
				api.request({
					params: this.params,
					url: api.url.page.index.banner.list,
					success: (json) => {
						this.tableData = json.rows;
					}
				})
			},
			closeModal(tag) {
				this.modalObj = {
					visible: false,
					modalTitle: '',
					row: {}
				}
				if (tag === 'refresh') {
					console.log(111111111)
					this.list()
				}
			},
		},
		mounted() {
			this.list()
			this.model = INDEX_MODEL
		}
	}
</script>
