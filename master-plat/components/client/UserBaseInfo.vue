<template>
	<div>
		<div class="master_detail_wrap">
			<div class="master_avatar_wrap">
				<img :src="formData.avatar" alt="" style="width: 100px;">
			</div>
			<div class="master_tag_wrap">
				<div class="m-r-s m-b-s"><i class="fa fa-user m-r-s" style="color: #409EFF"></i>{{formData.nick}}</div>
				<div class="m-r-s m-b-s"><i class="fa fa-phone m-r-s" style="color: #409EFF"></i>{{formData.phone}}</div>
				<div class="m-r-s m-b-s" v-if="formData.master || formData.vip">
					<i class="fa fa-diamond m-r-s" style="color: #409EFF"></i>{{getUserType}}
				</div>
				<div class="m-r-s m-b-s" v-else>
					<el-button size="mini" type="primary" plain @click="becomeMaster">{{getUserType}}</el-button>
				</div>
			</div>
			<div class="time_wrap">
				<div class="m-r-s m-b-s">注册日期：{{renderTime(formData.createTime)}}</div>
				<div class="m-r-s m-b-s">会员到期时间：{{formData.vipExpireYmd}}</div>
				<div class="m-r-s m-b-s">
					<span class="m-r-s">钱包余额：{{formData.walletBalance}}元</span>
					<el-button size="mini" type="primary" plain @click="viewRecord">查看流水</el-button>
				</div>
			</div>
		</div>
		<MasterAddDetail :options="modalObj" @close="handleClose"></MasterAddDetail>
		<WalletUsageList :options="usageModalObj" @close="closeModal"></WalletUsageList>
	</div>
</template>

<script>
	import BaseForm from '~/util/formObj'
	import MasterAddDetail from './MasterAddDetail'
	import WalletUsageList from './WalletUsageList'
	export default {
		components: {
			MasterAddDetail,
			WalletUsageList
		},
		props: ['formData'],
		data() {
			return {
				modalObj: {
					visible: false,
					modalTitle: '',
					row: {}
				},
				usageModalObj: {
					visible: false,
					row: {}
				}
			}
		},
		computed: {
			getUserType() {
				if (this.formData.master) {
					return '大师'
				}
				if (this.formData.vip) {
					return '会员'
				}
				return '成为大师'
			}
		},
		methods: {
			becomeMaster() {
				this.modalObj = {
					visible: true,
					modalTitle: '成为大师',
					row: this.formData
				}
			},
			viewRecord() {
				this.usageModalObj = {
					visible: true,
					row: this.formData
				}
			},
			closeModal() {
				this.usageModalObj = {
					visible: false,
					row: {}
				}
			},
			handleClose(tag) {
				this.modalObj = {
					visible: false,
					modalTitle: '',
					row: {}
				}
				if (tag === 'refresh') {
					this.$emit('beforeClose', 'refresh')
				}
			}
		}
	}
</script>

<style scoped>
	.master_detail_wrap{
		display: flex;
		align-items: center;
		border: 1px solid #cad2dd;
		border-radius: 5px;
		padding: 10px;
		margin-bottom: 20px;
	}
	.master_avatar_wrap{
		border-radius: 50px;
		border: 1px solid #8fd4dd;
		overflow:hidden ;
		width: 100px;
		height: 100px;
	}
	.master_tag_wrap{
		flex-grow: 1;
		margin-left: 10px;
	}
	.time_wrap{
		margin-right: 40px;
	}
</style>
