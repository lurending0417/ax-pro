<template>
    <div id="wrapper">
        <LeftNav ref="left_nav"></LeftNav>


        <div id="page-wrapper"  class="gray-bg dashbard-1">
            <div class="row border-bottom">
                <nav class="navbar navbar-static-top" role="navigation"
                     style="margin-bottom: 0; background-image: linear-gradient(to left, #06b7c9, #01c0b8);">

                    <ul class="nav navbar-top-links navbar-right" style="color: #fff">
                        <li>
                            <span class="m-r-sm text-white welcome-message">{{ name }}</span>
                        </li>
                        <li>
                            <a @click="personSetting">
                                <i class="fa fa-gear text-white"></i>
                            </a>
                        </li>
                        <li>
                            <a @click="exit">
                                <i class="fa fa-power-off text-white"></i>
                            </a>
                        </li>
                    </ul>

                </nav>
            </div>
            <div class="row  border-bottom white-bg dashboard-header" :style="{minHeight: (screenHeight - 60) + 'px'}">

                    <nuxt/>

            </div>

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
                this.screenHeight = document.body.offsetHeight;
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
            }
        },
        mounted() {
            this.getHeight();
            this.windowResize();
            this.name = baseUtil.getStaff().name
            this.left_width = {
                left: this.$refs.left_nav.$el.offsetWidth + 'px'
            };
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
</style>
