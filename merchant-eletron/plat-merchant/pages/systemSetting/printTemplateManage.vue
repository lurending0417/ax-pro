<template>
    <div>
        <Crumbs></Crumbs>
        <Tabs :tabsContent="tabsContent"></Tabs>
    </div>
</template>

<script>
    import Tabs from '~/components/Tabs'
    import Crumbs from '~/components/Crumbs'
    import PrintTemplateManage from '~/components/systemSetting/PrintTemplateManage'

    export default {
        components: {
            Tabs,
            Crumbs
        },
        data() {
            return {
                tabsContent: [
                    {identity: 'printTemplateManage', contentComponent: PrintTemplateManage}
                ]
            }
        }
    }
</script>

<style>

</style>
