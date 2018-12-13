<template>
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="sidebar-collapse">
            <ul class="nav metismenu" id="side-menu">
                <li class="nav-header"
                    style="height: 60px; background-image: linear-gradient(to left, #01c0b8, #00c4b2);">
                    <div class="nav navbar-left" style="margin-top: 5px;overflow: hidden">
                        <div class="logo_style" v-if="merchant.hasLogo">
                            <img :src="merchant.logo" alt="" style="height: 50px;">
                        </div>
                        <span class=" logo_name">{{merchant.name}}</span>
                    </div>
                </li>
            </ul>
            <ul class="nav metismenu">
                <li class="active" v-for="(item, index) in pages">
                    <a @click="clickNavTest(index)"
                       style="display: flex;align-items: center;justify-content: space-between;">
                        <!--<i class="child_icon"></i>-->
                        <i class="fa fa-th-large"></i>
                        <span class="nav-label nav_title">{{item.titleName}}</span>
                        <span :class="item.isShow?'fa fa-angle-down':'fa fa-angle-up'"></span>
                    </a>
                    <TransitionEle>
                        <ul class="nav nav-second-level" v-show="item.isShow">
                            <li v-for="child in item.children">
                                <!--<i class="child_icon pos_style" :style="urlObj"></i>-->
                                <!--<i class="fa fa-wrench pos_style"></i>-->
                                <router-link :to="child.path" style="margin-left:0">{{child.name}}</router-link>
                            </li>
                        </ul>
                    </TransitionEle>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    import {authUtil, baseUtil} from '~/util'
    import TransitionEle from './Transition.js'

    export default {
        components: {
            TransitionEle
        },
        data() {
            // 'url(https://cn.vuejs.org/images/logo.png)'
            return {
                pages: [],
                merchant: {
                    hasLogo: false,
                    logo: '',
                    name: ''
                },
                urlObj: {
                    backgroundImage: ''
                }
            }
        },
        methods: {
            clickNavTest(index) {
                this.pages[index].isShow = !this.pages[index].isShow
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
            this.pages = authUtil.getAuthorizedPages().page
            this.setLogo();
        }
    }
</script>

<style>
    .nav {
        transition: max-height 1s;
        -moz-transition: max-height 1s; /* Firefox 4 */
        -webkit-transition: max-height 1s; /* Safari and Chrome */
        -o-transition: max-height 1s; /* Opera */
    }

    .nav_title {
        flex-grow: 1
    }

    .nav_list-enter-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .nav_list-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.8, 0.5, 1.0);
    }

    .nav_list-enter
        /* .nav_list-leave-active for below version 2.1.8 */
    {
        transform: translateY(-10px);
        opacity: 0;
    }

    .nav_list-leave-to {
        transform: translateY(-10px);
        opacity: 0;
    }
    .logo_name{
        color: #fff;
        float: left;
        height: 50px;
        padding: 15px;
        font-size: 18px;
        line-height: 20px;
    }
    .logo_style{
        float: left;
        margin-left:20px;
        display: inline-block;
        overflow: hidden;
        width:50px;
        height:50px;
        border-radius: 5px;
    }

    .child_icon{
        width: 12px;
        height: 12px;
        background: url(../assets/icon_1.png) no-repeat;
        background-size: 12px;
        display: inline-block;
    }

    .pos_style{
        position: absolute;
        left: 33px;
        top: 9px;z-index: 2;
    }
</style>

