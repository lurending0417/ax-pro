<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="50%"
		append-to-body
		center>

		<div class=" m-b-s">
			<el-card class="box-card" shadow="never">
				<div slot="header" class="flex_cardTitle">
					<h4>约见详情（{{temp.statusName}}）</h4>
					<span v-if="temp.status === 'TO_CONFIRM' || temp.status === 'TO_MEET'">
						<el-button size="mini" @click="updateMeet('cancel', '取消约见')">取消约见</el-button>
						<el-button size="mini" type="success" @click="updateMeet('update', '修改约见')">修改约见</el-button>
					</span>
				</div>

				<div class="meet_detail_wrap">
					<div class="m-b-s flex_center">
						<span class="m-r-m"><strong>大师昵称：</strong>{{temp.master.nick}}</span>
						<span class="m-r-m"><strong>大师手机：</strong>{{temp.master.phone}}</span>
					</div>
					<el-row class="row m-b-s" type="flex">
						<span class="m-r-m"><strong>发起时间：</strong>{{temp.startTime}}</span>
						<span class="m-r-m"><strong>发起人昵称：</strong>{{temp.user.nick}}</span>
						<span class="m-r-m"><strong>约见人姓名：</strong>{{temp.userName}}</span>
						<span class="m-r-m"><strong>约见人手机：</strong>{{temp.userPhone}}</span>
					</el-row>
					<el-row class="row m-b-s" type="flex">
						<span class="m-r-m"><strong>期望约见时间：</strong>{{temp.appointTime}}</span>
						<span class="m-r-m"><strong>期望约见时长：</strong>{{temp.hours}}小时</span>
						<span class="m-r-m"><strong>支付金额：</strong>{{temp.totalCost}}</span>
					</el-row>

					<div class="m-b-s">
						<strong>备注：</strong>{{temp.content}}
					</div>

					<el-row class="row m-b-s" type="flex" v-if="temp.status === 'CANCELED'">
						<span class="m-r-m"><strong>取消原因：</strong>{{temp.cancelReason}}</span>
					</el-row>
				</div>

			</el-card>
		</div>

		<!--<div class="meet_detail">-->
			<!--<el-card class="box-card" shadow="never">-->
				<!--<div slot="header" class="flex_cardTitle">-->
					<!--<h4>修改列表</h4>-->
					<!--<el-button type="text" @click="showDetail" size="mini">{{showAll? '收起':'展开'}}</el-button>-->
				<!--</div>-->

				<!--<div v-for="(item, index) in updateList" :key="index" v-if="(index === 0) || showAll" class="meet_detail_wrap m-b-s">-->
					<!--<el-row class="row m-b-s" type="flex" justify="space-between">-->
						<!--<span class="m-r-m"><strong>约见时间：</strong>{{item.appointTime}}</span>-->
						<!--<span class="m-r-m"><strong>约见地点：</strong>{{item.appointAddr}}</span>-->
						<!--<span class="m-r-m"><strong>修改时间：</strong>{{item.startTime}}</span>-->
					<!--</el-row>-->
					<!--<div class="m-b-s" >-->
						<!--<strong>备注：</strong>-->
						<!--{{item.content}}-->
					<!--</div>-->
				<!--</div>-->
			<!--</el-card>-->
		<!--</div>-->

		<!--修改约见-->
		<MeetUpdateModal :options="modalObj" @close="closeModal"></MeetUpdateModal>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from '~/api'
	import {mapGetters} from 'vuex'
	import {renderUtil} from "~/util"
	import MeetUpdateModal from './MeetUpdateModal.vue'
	export default {
		props: ['options'],
		components: {
			MeetUpdateModal
		},
		data() {
			return {
				showAll: false,
				updateList: [{
					appointTime: '2018-08-29 16:30:27',
					appointAddr: '北京市朝阳区',
					startTime: '2018-08-29 16:30:27',
					content: '饭店烧烤常年法律饭店烧烤常年法律饭店烧烤常年法律饭店烧烤常年法律饭店烧烤常年法律'
				}, {
					appointTime: '2018-08-29 16:30:27',
					appointAddr: '北京市朝阳区',
					startTime: '2018-08-29 16:30:27',
					content: '饭店烧烤常年法律饭店烧烤常年法律饭店烧烤常年法律饭店烧烤常年法律饭店烧烤常年法律'
				}],
				temp: {
					startTime: '2018-08-29 16:30:27',
					appointTime: '2018-08-29 16:30:27',
					hours: '3小时',
					totalCost: 180,
					user: {
						nick: '张三',
						phone: '18408217559'
					},
					master: {
						nick: '梅凯',
						phone: '18408217559'
					},
					cancelReason: '时间不符合时间不符合时间不符合时间不符合时间不符合',
					statusName: '',
					content: '让大师来成都'
				},
				modalObj: {
					visible: false,
					modalTitle: '',
					row: {},
					tag: ''
				}
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			})
		},
		methods: {
			showDetail() {
				this.showAll = !this.showAll
			},
			renderTime(date) {
				return renderUtil.renderTime(date)
			},
			close(tag) {
				this.$emit('close', tag)
			},
			updateMeet(tag, modalTitle) {
				this.modalObj = {
					modalTitle,
					visible: true,
					appointId: this.options.row.id,
					tag
				}
			},
			closeModal(tag) {
				this.modalObj = {
					modalTitle: '',
					visible: false,
					row: {},
					tag: ''
				}
				if (tag === 'refresh') {
					this.close('refresh')
				}
			},
			list() {

			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					Object.assign(this.temp, this.options.row)
				}
			}
		}
	}
</script>

<style scoped>
	.flex_cardTitle{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.flex_center{
		display: flex;
		align-items: center;
	}
</style>
