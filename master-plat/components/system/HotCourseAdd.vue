<template>
	<el-dialog append-to-body
		title="新增推荐课程"
		:visible.sync="options.visible"
		width="60%"
		center>

		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline size="small">
					<el-form-item>
						<el-select v-model="params.targetType" placeholder="课程类别" style="width: 100%">
							<el-option v-for="item in targetType" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="params.masterId" placeholder="大师" style="width: 100%">
							<el-option v-for="item in master" :key="item.id" :label="item.nick" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model="params.query" placeholder="课程名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="list">搜索</el-button>
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
			<el-table-column label="编号" align="center" width="100">
				<template slot-scope="scope">
					<el-input size="mini"  v-model="scope.row.order"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="课程名称" align="center"> </el-table-column>
			<el-table-column prop="targetType" label="课程类别" align="center" :formatter="formatCourseType"> </el-table-column>
			<el-table-column prop="master" label="大师" align="center" > </el-table-column>
			<el-table-column label="是否启用" align="center" width="100">
				<template slot-scope="scope">
					<el-switch
						v-model="scope.row.enabled$"
						active-color="#13ce66"
						inactive-color="#e3e3e3">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="80" >
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="handleEdit(scope.row)">推荐</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--<no-ssr><Pagination :options="this" @list="list"></Pagination></no-ssr>-->

		<span slot="footer" class="dialog-footer" >
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api";
	import {COURSE_TYPE} from "~/api/const";
	import {mapActions, mapGetters} from 'vuex'
	export default {
		props: ['options'],
		data() {
			return {
				params: {
					targetType: '',
					masterId: '',
					query: ''
				},
				tableData: [],
				targetType: []
			}
		},
		computed: {
			...mapGetters('master', {
				master: 'getMasterList'
			})
		},
		methods: {
			...mapActions('master', {
				apiGetMasterList: 'apiGetMasterList'
			}),
			formatCourseType(row) {
				if (!row.targetType) {
					return ''
				}
				return this.targetType.filter(item => item.id === row.targetType)[0].name
			},
			handleEdit(row) {
				api.request({
					url: api.url.page.index.course.add,
					params: {
						targetType: this.params.targetType,
						targetId: row.id,
						code: row.order,
						enabled: row.enabled$
					},
					success: json => {
						this.$message('操作成功')
					}
				})
			},
			close() {
				this.$emit('close', 'refresh')
			},
			list() {
				api.request({
					url: api.url.page.index.course.queryList,
					params: {...this.params},
					success: json => {
						this.tableData = json.rows.map((item, index) => {
							item.order = index + 1;
							item.enabled$ = true;
							return item
						});
						this.total = json.total;
					}
				})
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.params.targetType = this.targetType[1].id
					this.list()
				}
			}
		},
		mounted() {
			this.targetType = COURSE_TYPE;
		}
	}
</script>
