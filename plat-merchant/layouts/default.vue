<template>
    <div id="wrapper">
        <!--top-->
        <div class="top">
            <!--左边的logo-->
            <div class="merchantLogo">
                <div v-if="merchant.hasLogo" class="logoWrap">
                    <img :src="merchant.logo" alt="" style="height: 50px;">
                </div>
                <span class=" logo_name">{{merchant.name}}</span>
            </div>
            <!--右边的一排按钮-->
            <div class="personSetting">
                <span class="m-r-sm text-white welcome-message">{{ name }}</span>
                <i class="fa fa-gear text-white" @click="personSetting"></i>
                <i class="fa fa-power-off text-white" @click="exit"></i>
            </div>
        </div>
        <!--center-->
        <div class="center" style="height: 0;overflow-y: auto;" ref="center">
            <!--left-->
            <div class="left">
                <LeftNav ref="left_nav"></LeftNav>
            </div>
            <nuxt/>
        </div>


        <!--<div class="fixed_footer" :style="left_width">-->
        <!--Copyright ©2018 成都爱心科技有限公司 版权所有. All Rights reserved. 蜀ICP备17001659号-1-->
        <!--</div>-->

        <RequestLoading></RequestLoading>

        <!--个人设置-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: modalParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: modalParams.CONST_CLICK_MODAL,
                titleName: '个人设置'
            }">
            <PersonSetting slot="main" :modalParams="modalParams"></PersonSetting>
        </ModalItem>

    </div>
</template>

<script>
    import LeftNav from '~/components/LeftNav';
    import ModalItem from '~/components/ModalItem'
    import RequestLoading from '~/components/RequestLoading';
    import PersonSetting from '~/components/PersonSetting';
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, browserUtil, authUtil} from '~/util'
    import {mapActions} from 'vuex'
    import uuid from 'uuid'

    //    (function() {
    //        if (!sessionStorage.length) {
    //            // 这个调用能触发目标事件，从而达到共享数据的目的
    //            localStorage.setItem('getSessionStorage', Date.now());
    //        };
    //        // 该事件是核心
    //        window.addEventListener('storage', function(event) {
    //            if (event.key === 'getSessionStorage') {
    //                // 已存在的标签页会收到这个事件
    //                localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    //                localStorage.removeItem('sessionStorage');
    //            } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
    //                // 新开启的标签页会收到这个事件
    //                let data = JSON.parse(event.newValue);
    //                for (let key in data) {
    //                    sessionStorage.setItem(key, data[key]);
    //                }
    //            }
    //        });
    //    })();

    export default {
        components: {
            LeftNav,
            ModalItem,
            PersonSetting,
            RequestLoading
        },
        data() {
            return {
                screenHeight: 0,
                name: '',
                modalParams: {
                    CONST_CLICK_MODAL: uuid(),
                    CONST_CLOSE_MODAL: uuid()
                },
                merchant: {
                    hasLogo: false,
                    logo: '',
                    name: ''
                },
                left_width: {
                    left: '0px'
                }
            };
        },
        methods: {
            ...mapActions('login', {
                logout: 'logout'
            }),
            getHeight() {
                this.screenHeight = document.body.offsetHeight - 60
            },
            windowResize() {
                window.onresize = () => this.getHeight();
            },
            personSetting() {
                ButtonWithModalEvent.$emit(this.modalParams.CONST_CLICK_MODAL);
            },
            exit() {
                this.logout({
                    callBack: () => {
                        baseUtil.deleteMetadata();
                        baseUtil.deleteBasicInfo();
                        authUtil.deleteAuthorizedPages()
                        browserUtil.deleleteCookie('access-token');
                        this.$router.push('/')
                    }
                });
            },
            setLogo() {
                let basePath = process.env.imgBaseUrl;
                let merchant = baseUtil.getMerchant()
                this.merchant.name = merchant.name
                if (!merchant.logo) {
                    this.merchant.hasLogo = false
                } else {
                    this.merchant.hasLogo = true
                    this.merchant.logo = basePath + merchant.logo
                }
            }
        },
        mounted() {
            this.getHeight()
            this.windowResize();
            this.$refs.center.style.height = this.screenHeight + 'px'
            this.setLogo();
            this.name = baseUtil.getStaff().name
//            this.left_width = {
//                left: this.$refs.left_nav.$el.offsetWidth + 'px'
//            };
        }
    };
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
        background-image: linear-gradient(to left, #06b7c9, #00c4b2);
        height: 60px;
        position: fixed;
        width: 100%;
        z-index: 3;
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
        background-color: #efefef;
    }

    .center {
        margin-top: 60px;
        padding: 20px 20px 20px 240px;
        background-color: #fff;
        height: 100%;
    }

    #wrapper {
        /*background-color: #f0ad4e;*/
    }
</style>
