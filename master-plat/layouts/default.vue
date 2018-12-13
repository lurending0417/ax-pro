<template>
	<div style="overflow: auto">
		<!--top-->
		<header class="top main_bg_color">
			<!--左边的logo-->
			<div class="merchantLogo">
				<div v-if="merchant.hasLogo" class="logoWrap">
					<img :src="merchant.logo" alt="" style="height: 50px;">
				</div>
				<span class=" logo_name">{{merchant.name}}</span>
			</div>
			<!--右边的一排按钮-->
			<div class="personSetting">
				<span class="m-r-sm text_white welcome-message">{{ name }}</span>
				<i class="fa fa-gear text_white" @click="setPwd"></i>
				<i class="fa fa-power-off text_white"></i>
			</div>
		</header>
		<!--center-->
		<section class="center" style="height: 100%;overflow-y: auto;margin-top:60px;" ref="center">
			<!--left-->
			<div class="left">
				<LeftNav ref="left_nav"></LeftNav>
			</div>
			<nuxt/>
		</section>

		<no-ssr><Loading></Loading></no-ssr>
		<SetPwdModal :options="setPwdModal" @close="close"></SetPwdModal>
		<!--footer-->
		<!--<footer class="fixed_footer" :style="left_width">-->
			<!--Copyright ©2018 成都爱心科技有限公司 版权所有. All Rights reserved. 蜀ICP备17001659号-1-->
		<!--</footer>-->
	</div>
</template>

<script>
	import LeftNav from '~/components/common/LeftNav'
	import SetPwdModal from '~/components/SetPwdModal'
	import {baseUtil} from '~/util'
	export default {
		components: {
			LeftNav,
			SetPwdModal
		},
		data() {
			return {
				setPwdModal: {
					visible: false,
					phone: ''
				},
				screenHeight: 0,
				name: '张三',
				phone: '',
				merchant: {
					hasLogo: false,
					logo: '',
					name: '喔喔百家后台管理'
				},
				left_width: {
					left: '0px'
				}
			}
		},
		mounted() {
			this.setLogo();
			let {user} = baseUtil.getBasicInfo();
			this.name = user.nick
			this.phone = user.phone
		},
		methods:{
			getHeight() {
				this.screenHeight = document.body.offsetHeight - 60
			},
			windowResize() {
				window.onresize = () => this.getHeight();
			},
			setLogo() {
			},
			setPwd() {
				this.setPwdModal = {
					visible: true,
					phone: this.phone
				}
			},
			close() {
				this.setPwdModal = {
					visible: false,
					phone: ''
				}
			}
		}
	}
</script>

<style scoped>
	.fixed_footer {
		position: fixed;
		bottom: 0;
		padding: 10px 20px;
		background: #fff;
		width: 100%;
		z-index: 2;
	}
	.top {
		height: 60px;
		position: fixed;
		width: 100%;
		z-index: 4;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.merchantLogo{
		margin-left: 20px;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.logoWrap{
		overflow: hidden;
		width:50px;
		height: 50px;
		border-radius: 5px;
	}
	.logo_name{
		color: #fff;
		margin-left: 10px;
		font-size: 18px;
	}
	.personSetting {
		width: 140px;
		margin-right: 50px;
		height: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.personSetting>i:hover {
		cursor: pointer;
	}

	.left {
		position: fixed;
		top: 60px;
		left:0px;
		width: 220px;
		height: 100%;
		overflow-y: auto;
		background-color: #efefef;
	}

	.center {
		padding: 20px 20px 20px 240px;
		background-color: #fff;
		height: 100%;
	}
</style>

