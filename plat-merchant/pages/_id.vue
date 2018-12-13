<template>
    <div>
        <Crumbs :authorizedPages="authorizedPages" :path="path"></Crumbs>
        <Tabs :tabsContent="tabsContent" :path="path"></Tabs>
    </div>
</template>

<script>
    import Tabs from '~/components/Tabs'
    import Crumbs from '~/components/Crumbs'
    import {authUtil} from '~/util';

    export default {
        components: {
            Tabs,
            Crumbs
        },
        data () {
            return {
                tabsContent: [],
                path: '',
                authorizedPages: {}
            }
        },
        created() {
            this.path = this.$router.currentRoute.fullPath;
            let currentRoute = this.path.split('/')[2]
            if (authUtil.getAuthorizedPages()) {
                this.authorizedPages = authUtil.getAuthorizedPages()
                let tab = this.authorizedPages.tab
                this.tabsContent = tab.filter(item => item.route === currentRoute)[0].children
            }
        }
    }
</script>

<style>

</style>
