<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="60%"
		append-to-body
		center>
		<div class="text_right">
			<el-button size="small" type="danger" @click="add" style="margin: 10px auto;">添加课程</el-button>
		</div>
		<el-table
			:data="courseList"
			class="section_table"
			border
			stripe
			style="width: 100%">
			<el-table-column type="index" label="序号" align="center" width="50" > </el-table-column>
			<el-table-column prop="title" label="标题" align="center"> </el-table-column>
			<el-table-column prop="videoName" label="视频名称" align="center"> </el-table-column>
			<el-table-column prop="video" label="是否上传视频" align="center" :formatter="formatVideo"> </el-table-column>
			<el-table-column prop="enabled" label="是否上架" align="center" :formatter="formatUp"> </el-table-column>
			<el-table-column prop="discountType" label="折扣方式" align="center" :formatter="formatDiscount"> </el-table-column>
			<el-table-column label="操作" align="center" width="300">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row, 'detail')">详情</el-button>
					<el-button size="mini" type="primary" @click="handleEdit(scope.row, 'update')">修改</el-button>
					<el-button size="mini" type="warning" @click="deleteSingleCourse(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<SeriesCourseDetailAdd :options="subModalObj" @close="subClose" :courseId="courseId"></SeriesCourseDetailAdd>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import Arabia_To_SimplifiedChinese from '~/util/digital'
	import BaseForm from '~/util/formObj'
	import ViewVideoListModal from './ViewVideoListModal.vue'
	import SeriesCourseDetailAdd from './SeriesCourseDetailAdd.vue'
	import api from '~/api'
	import {DISCOUNTTYPE} from '~/api/const'
	export default {
		components: {
			SeriesCourseDetailAdd
		},
		props: ['options'],
		data() {
			return {
				subModalObj: {
					visible: false,
					modalTitle: '',
					section: {},
					canChange: true
				},
				courseId: '',
				courseList: [],
				total: 0,
				masters: []
			}
		},
		methods: {
			sortByCode(a, b) {
				return a - b
			},
			formatVideo(row) {
				if (row.video) {
					return '是'
				}
				return '否'
			},
			formatUp(row) {
				if (row.enabled) {
					return '是'
				}
				return '否'
			},
			formatDiscount(row) {
				return DISCOUNTTYPE.filter(item => item.id === row.discountType)[0].name
			},
			wrapFunc(num) {
				return Arabia_To_SimplifiedChinese(num + 1);
			},
			add() {
				this.subModalObj = {
					visible: true,
					modalTitle: '新增课程分集',
					section: {},
					canChange: true
				}
			},
			handleEdit(section, tag) {
				if (tag === 'update') {
					this.subModalObj = {
						visible: true,
						modalTitle: '修改分集内容',
						section,
						canChange: true
					}
				} else if (tag === 'detail') {
					this.subModalObj = {
						visible: true,
						modalTitle: '分集详情',
						section,
						canChange: false
					}
				}
			},
			deleteSingleCourse (row) {
				api.request({
					url: api.url.course.section.del,
					params: {
						sectionId:row.id
					},
					success: res => {
						this.list()
					}
				})
			},
			close() {
				this.$emit('close')
			},
			subClose(tag) {
				this.subModalObj = {
					visible: false,
					modalTitle: '',
					section: {},
					canChange: true
				};
				if (tag === 'refresh') {
					this.list()
				}
			},
			list() {
				api.request({
					url: api.url.course.section.list,
					params: {courseId: this.courseId},
					success: (res) => {
						this.courseList = res.rows;
						this.total = res.total;
					}
				})
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.courseId = this.options.course.id;
					this.list()
				}
			}
		}
	}
</script>

<style scoped>
	.course_item_wrap{
		margin-bottom: 10px;
		display: flex;
		align-items: center;
	}
	.video_name{
		flex-grow:1 ;
		margin-left: 20px;
	}
	.upload-demo{
		display: flex;
	}
</style>
