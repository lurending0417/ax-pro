<template>
	<div>
		<div class="text_right" style="margin-bottom: 10px;">
			<el-button type="danger" @click="add('singleModalObj', '新增单集课程')">新增单集课程</el-button>
			<el-button type="danger" @click="add('seriesModalObj', '新增系列课程')">新增系列课程</el-button>
		</div>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
			<el-table-column prop="name" label="课程名称" width="100" align="center"> </el-table-column>
			<el-table-column prop="type" label="课程类别" width="100" :formatter="formatCourseType" align="center"> </el-table-column>
			<el-table-column prop="master" label="大师" width="100" align="center"> </el-table-column>
			<el-table-column prop="regularPrice" label="原价" width="100" align="center"> </el-table-column>
			<el-table-column prop="retailPrice" label="现价" width="100" align="center"> </el-table-column>
			<el-table-column prop="purchaseNum" label="购买次数" width="100" align="center"> </el-table-column>
			<el-table-column prop="agreeNum" label="点赞数" width="100" align="center"> </el-table-column>
			<el-table-column prop="remarkNum" label="评价数" width="100" align="center"> </el-table-column>
			<el-table-column prop="shareNum" label="分享数" width="100" align="center"> </el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row)">详情</el-button>
					<el-button size="mini" type="warning" @click="shelf(scope.$index, scope.row)">下架</el-button>
				</template>
			</el-table-column>
		</el-table>

		<no-ssr><Pagination :options="this" @list="list"></Pagination></no-ssr>

		<!--新增单集课程-->
		<SingleCourseAddModal :options="singleModalObj" @close="closeModal('singleModalObj')"></SingleCourseAddModal>
		<!--新增系列课程-->
		<SeriesCourseAddModal :options="seriesModalObj" @close="closeModal('seriesModalObj')"></SeriesCourseAddModal>
	</div>
</template>

<script>
	import SingleCourseAddModal from './SingleCourseAddModal.vue'
	import SeriesCourseAddModal from './SeriesCourseAddModal.vue'
	export default {
		components: {
			SingleCourseAddModal,
			SeriesCourseAddModal
		},
		data() {
			let modalParams = {
				modalTitle: '',
				visible: false,
				row: {},
				canChange: true
			}
			return {
				params: {},
				total: 0,
				tableData: [{
					name: '课程一',
					type: 'SINGLE',
					purchaseNum: 2,
					agreeNum: 2,
					remarkNum: 7,
					shareNum: 10,
					regularPrice: '',
					retailPrice: '',
					master: ''
				}, {
					name: '课程二',
					type: 'SERIES',
					purchaseNum: 2,
					agreeNum: 2,
					remarkNum: 7,
					shareNum: 10,
					regularPrice: '',
					retailPrice: '',
					master: ''
				}],
				courseType: [{
					name: '单集',
					id: 'SINGLE'
				}, {
					name: '系列',
					id: 'SERIES',
				}],
				singleModalObj: {...modalParams},
				seriesModalObj: {...modalParams}
			}
		},
		methods: {
			formatCourseType(row) {
				return this.courseType.filter(item => item.id === row.type)[0].name
			},
			add(tag, modalTitle) {
				this[tag] = {
					modalTitle,
					visible: true,
					row: {},
					canChange: true
				}
			},
			handleEdit(row) {
				this.singleModalObj = {
					modalTitle: '课程详情',
					visible: true,
					row: row,
					canChange: false
				}
			},
			shelf() {

			},
			list() {

			},
			closeModal(tag) {
				this[tag] = {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				}
			}
		}
	}
</script>
