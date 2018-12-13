<template>
	<div>
		<div class="master_detail_wrap">
			<div class="master_avatar_wrap">
				<img :src="formData.avatar" alt="" style="width: 100px;">
			</div>
			<div class="master_tag_wrap">
				<div class="m-b-s">
					<span class="m-r-s"><i class="fa fa-user m-r-s" style="color: #409EFF"></i>{{formData.nick}}</span>
					<el-switch
						v-model="formData.enabled"
						disabled
						active-color="#13ce66"
						inactive-color="#e3e3e3">
					</el-switch>
				</div>
				<div>
					<el-tag v-for="(tag, index) in formData.tags" :key="'tag'+index" type="success"
							@close="delTag(index)" class="m-r-s m-b-s" size="small">{{tag}}</el-tag>
				</div>
				<el-select size="small" v-model="formData.categoryId" placeholder="领域" style="width: 20%" class="m-b-s" disabled>
					<el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</div>
			<div>
				<span class="m-r-s">钱包余额：{{formData.walletBalance}}元</span>
				<el-button size="mini" type="primary" plain @click="viewRecord">查看流水</el-button>
			</div>
		</div>

		<div class="master_detail_wrap">
			{{formData.intro}}
		</div>

		<div class="fengcai_wrap" v-html="formData.fengcai"></div>

		<div class="m-b-m">
			<span class="m-r-s">课程业务</span>
			<el-switch
				disabled
				v-model="formData.courseEnabled"
				active-color="#13ce66"
				inactive-color="#e3e3e3">
			</el-switch>
		</div>

		<div class="m-b-m">
			<el-card class="box-card" shadow="never">
				<div slot="header" class="text_center">
					<span class="m-r-s">约见业务</span>
					<el-switch
						v-model="formData.appointEnabled"
						active-color="#13ce66"
						disabled
						inactive-color="#e3e3e3">
					</el-switch>
				</div>

				<el-form label-position="left" label-width="50px" inline>
					<el-form-item label="地址">
						<RegionSelect v-model="formData.districtCode"></RegionSelect>
					</el-form-item>
					<el-form-item label="费用">
						<el-input v-model="formData.appointCost" placeholder="元/小时"></el-input>
					</el-form-item>
					<el-form-item label="电话">
						<el-input v-model="formData.appointPhone"></el-input>
					</el-form-item>
				</el-form>
			</el-card>
		</div>

		<div>
			<el-card class="box-card" shadow="never">
				<div slot="header" class="text_center">
					<span class="m-r-s">解惑业务</span>
					<el-switch
						v-model="formData.questionEnabled"
						active-color="#13ce66"
						disabled
						inactive-color="#e3e3e3">
					</el-switch>
				</div>

				<el-form label-position="left" label-width="50px" inline>
					<el-form-item label="费用">
						<el-input v-model="formData.questionCost" placeholder="元/小时"></el-input>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<WalletUsageList1 :options="usageModalObj" @close="closeModal"></WalletUsageList1>
	</div>
</template>

<script>
	import BaseForm from '~/util/formObj'
	import {baseUtil} from '~/util'
	import WalletUsageList1 from './WalletUsageList'
	export default {
		components: {
			'WalletUsageList1': WalletUsageList1
		},
		props: ['formData'],
		data() {
			return {
				formData1: new BaseForm({
					avatar: '/avatar.jpeg',
					nick: '张三丰',
					phone: '18408217559',
					categoryId: '',
					tags: ['和蔼', '仙风道骨', '开山祖师'],
					intro: '',
					fengcai: '用户简介',
					appointCost: '',
					appointPhone: '',
					appointEnabled: true,
					districtCode: '',
					enabled: true,
					courseEnabled: true,
					questionCost: '',
					questionEnabled: true
				}),
				usageModalObj: {
					visible: false,
					row: {}
				},
				category: []
			}
		},
		methods: {
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
			}
		},
		mounted() {
			let {category} = baseUtil.getBasicInfo();
			this.category = category
		}
	}
</script>

<style scoped>
	.fengcai_wrap{
		border: 1px solid #ebeef5;
		border-radius: 5px;
		padding: 10px;
		margin-bottom: 20px;
	}
</style>
