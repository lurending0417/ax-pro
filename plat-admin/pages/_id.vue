<template>
    <el-card class="box-card">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane v-for="(tab,index) in tabs" :key="index" :name="tab.alias" :label="tab.name">
                <component v-bind:is="tab.component" :name="tab.alias" ref="tabComponent" style="min-height:500px;"></component>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>


<script>

    import {authUtil, renderUtil} from "~/util"

    export default {
        data() {
            return {
                activeTab: null,
                tabs: [],
                initTabs: []
            }
        },
        watch: {
            activeTab(value) {
                if (!value) {
                    return;
                }
                renderUtil.renderTab(this);
            }
        },
        created() {
            var tabs = authUtil.getAuthorizedTabs(this.$router.currentRoute.fullPath);
            this.tabs = tabs;
            if (tabs.length > 0) {
                this.activeTab = tabs[0].alias;
            }
        }
    }


</script>
