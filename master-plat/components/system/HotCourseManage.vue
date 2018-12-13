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
			<el-table-column prop="code" label="编号" align="center"> </el-table-column>
			<el-table-column prop="name" label="课程名称" align="center"> </el-table-column>
			<el-table-column prop="targetTypeName" label="课程类别" align="center"> </el-table-column>
			<el-table-column prop="master" label="大师" align="center" > </el-table-column>
			<el-table-column prop="enabled" label="是否启用" align="center" :formatter="formatStatus"> </el-table-column>
			<el-table-column label="操作" align="center" width="250" >
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="handleEdit(scope.row, 'update')">修改</el-button>
					<el-button size="mini" @click="handleDelete(scope.row, 'delete')">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<HotCourseAdd :options="modalObj" @close="closeModal"></HotCourseAdd>

		<HotCourseUpdate :options="modalUpdateObj" @close="closeUpdateModal"></HotCourseUpdate>
	</div>
</template>

<script>
	import api from '~/api'
	import {COURSE_TYPE} from '~/api/const'
	import HotCourseAdd from './HotCourseAdd.vue'
	import HotCourseUpdate from './HotCourseUpdate.vue'
	import {mapActions} from 'vuex'
	export default {
		components: {
			HotCourseAdd,
			HotCourseUpdate
		},
		data() {
			return {
				tableData: [],
				modalObj: {
					visible: false
				},
				modalUpdateObj: {
					visible: false,
					modalTitle: '',
					row: {}
				},
				params: {
					enabled: ''
				}
			}
		},
		methods: {
			...mapActions('master', {
				apiGetCategoryList: 'apiGetCategoryList',
				apiGetMasterList: 'apiGetMasterList'
			}),
			formatStatus(row) {
				if (row.enabled) {
					return '启用'
				}
				return '停用'
			},
			add() {
				this.modalObj = {
					visible: true
				}
			},
			handleDelete(row) {
				api.request({
					params: {id: row.id},
					url: api.url.page.index.course.del,
					success: (json) => {
						this.list()
					}
				})
			},
			handleEdit(row) {
				this.modalUpdateObj = {
					visible: true,
					modalTitle: '修改推荐大师编号',
					row
				}
			},
			list() {
				api.request({
					params: this.params,
					url: api.url.page.index.course.list,
					success: (json) => {
						this.tableData = json.rows.map(item => {
							if (!item.targetType) {
								item.targetTypeName = ''
							}
							item.targetTypeName = COURSE_TYPE.filter(ele => ele.id === item.targetType)[0].name
							return item
						});
					}
				})
			},
			closeModal(tag) {
				this.modalObj = {
					visible: false
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			closeUpdateModal(tag) {
				this.modalUpdateObj = {
					visible: false,
					modalTitle: '',
					row: {}
				}
				if (tag === 'refresh') {
					this.list()
				}
			}
		},
		mounted() {
			this.list();
			this.apiGetMasterList();
		}
	}
</script>
