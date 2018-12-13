<template>
    <el-menu
        :default-active="defaultKey"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#495060"
        text-color="#fff"
        :collapse="isCollapse"
        :router="true"
        active-text-color="#ffd04b">
        <el-submenu v-for="(page,pageIndex) in pages" :key="pageIndex" :index="page.route">
            <template slot="title">
                <i :class="page.icon"></i>
                <span>{{page.name}}</span>
            </template>
            <el-menu-item v-for="(sub,subIndex) in page.sub" :key="subIndex" :index="sub.route">
                <span slot="title">{{sub.name}}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>

    import {authUtil} from "~/util"

    export default {
        props: ['isCollapse'],
        data() {
            return {
                defaultKey: '/',
                pages: []
            }
        },
        created() {
            this.defaultKey = this.$router.currentRoute.fullPath;
            this.pages = authUtil.getAuthorizedPages();
        },
        methods: {
            handleOpen(key) {
            },
            handleClose(key) {
            },
            handleSelect(key) {
                this.defaultKey = key;
            }
        }
    }
</script>

<style>

    .el-menu {
        text-align: left;
        border-right: none;
    }

    .el-menu-vertical:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

</style>
