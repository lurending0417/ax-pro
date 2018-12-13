<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline :size="formSize">
					<el-form-item v-if="disableMaster">
						<el-select v-model="params.masterId" placeholder="大师" style="width: 100%">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in masters" :key="item.id" :label="item.nick" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="params.categoryId" placeholder="分类" style="width: 100%">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="params.enabled" placeholder="上架状态" style="width: 100%">
							<el-option label="全部" value=""></el-option>
							<el-option label="已上架" :value="true"></el-option>
							<el-option label="未上架" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model="params.query" clearable placeholder="关键字"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="list">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="warning" @click="list">刷新</el-button>
					</el-form-item>
					<el-form-item class="m-r-m">
						<el-button type="danger" @click="add">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<!--<el-col :span="3" class="text_right">-->
				<!--<el-button type="danger" @click="add">新增</el-button>-->
			<!--</el-col>-->
		</el-row>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
			<el-table-column prop="title" label="序列名称" align="center"> </el-table-column>
			<el-table-column prop="sections" label="节数" width="50" align="center"> </el-table-column>
			<el-table-column prop="totalPrice" label="全节总价" :formatter="formatPrice" align="center"> </el-table-column>
			<el-table-column prop="coursePrice" label="系列原价" align="center"> </el-table-column>
			<el-table-column prop="categoryName" label="分类" width="80" align="center" :formatter="formatMasterType"> </el-table-column>
			<el-table-column prop="master" label="大师" align="center" :formatter="formatMaster"> </el-table-column>
			<el-table-column prop="enabled" label="是否已上架" :formatter="formatIsUp" align="center"> </el-table-column>
			<el-table-column label="操作" align="center" width="400">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row, 'detail')">详情</el-button>
					<el-button size="mini" type="danger" @click="addSection(scope.row)">编辑课程表</el-button>
					<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row, 'update')">修改</el-button>
					<el-button size="mini" type="warning" @click="shelf(scope.row)">{{scope.row.enabled?'下架':'上架'}}</el-button>
					<el-button size="mini" type="danger" @click="deleteCourse(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>
		<SeriesCourseAddModal :options="modalObj" @close="closeModal"></SeriesCourseAddModal>
		<SeriesCourseSectionAdd :options="sectionModalObj" @close="closeSectionModal"></SeriesCourseSectionAdd>
	</div>
</template>

<script>
	import SeriesCourseAddModal from './SeriesCourseAddModal.vue'
	import SeriesCourseSectionAdd from './SeriesCourseSectionAdd.vue'
	import {mapActions, mapGetters} from 'vuex'
	import api from '~/api'
	import {baseUtil} from '~/util'
	export default {
		props: ['masterId', 'isUser', 'size'],
		components: {
			SeriesCourseAddModal,
			SeriesCourseSectionAdd
		},
		data() {
			return {
				params: {
					categoryId: '',
					masterId: '',
					enabled: true,
					query: ''
				},
				modalObj: {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				},
				sectionModalObj: {
					modalTitle: '',
					visible: false,
					row: {}
				},
				total: 0,
				tableData: [],
				category: []
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			}),
			formSize() {
				return this.size || ''
			},
			disableMaster() {
				if (this.masterId && !this.isUser)
					return true
				return false
			}
		},
		methods: {
			...mapActions('master', {
				apiGetMasterList: 'apiGetMasterList'
			}),
			formatMasterType(row) {
				return row.master.categoryName || ''
			},
			formatPrice(row) {
				return (row.sectionPrice * (row.sections || 0)).toFixed(2)
			},
			formatMaster(row) {
				return row.master.nick
			},
			formatIsUp(row) {
				if (row.enabled) {
					return '是'
				}
				return '否'
			},
			handleEdit(index, row, tag) {
				let temp = {
					modalTitle: '',
					visible: true,
					row: row,
					canChange: true
				}
				switch (tag) {
					case 'detail' : {
						temp.modalTitle = '课程详情';
						temp.canChange = false; break
					}
					case 'update' : {
						temp.modalTitle = '修改系列课程'; break
					}
				}
				this.modalObj = temp
			},
			add() {
				this.modalObj = {
					modalTitle: '新增课程',
					visible: true,
					row: {},
					canChange: true
				}
			},
			deleteCourse(row) {
				console.log('ddd', row)
				api.request({
					url: api.url.course.del,
					params: {
						courseId:row.id
					},
					success: res => {
						this.list()
					}
				})
			},
			addSection(row) {
				this.sectionModalObj = {
					modalTitle: `${row.title}-课程表`,
					visible: true,
					course: row
				}
			},
			closeModal(tag) {
				this.modalObj = {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			closeSectionModal() {
				this.sectionModalObj = {
					modalTitle: '',
					visible: false,
					course: {}
				}
			},
			shelf(row) {
				let params = {...row};
				params.enabled = !row.enabled;
				params.courseId = row.id;
				params.masterId = row.master.id;
				delete params.master;
				delete params.id;
				api.request({
					url: api.url.course.edit,
					params,
					success: (json) => {
						if (!params.enabled) {
							this.$message('下架成功')
						} else {
							this.$message('上架成功')
						}
						this.list()
					}
				})
			},
			list() {
				api.request({
					url: api.url.course.list,
					params: this.params,
					success: (json) => {
						this.tableData = json.rows;
						this.total = json.total;
					}
				})
			}
		},
		mounted() {
			let {category} = baseUtil.getBasicInfo();
			this.category = category;
			if (this.masterId) {
				this.params.masterId = this.masterId
			}
			this.list();
			this.apiGetMasterList({})
		}
	}
</script>
