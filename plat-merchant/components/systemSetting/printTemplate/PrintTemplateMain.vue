<template>
    <div>
        <span v-for="template in Object.keys(templates)">
            <span>{{ template }}&nbsp;&nbsp;&nbsp;</span>
            <i class="fa fa-times-circle fa-lg del_btn" @click="deleteTemplate" :data-template="template"></i>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
        <button class="btn btn-primary printTemplateButton"><i class="fa fa-plus-square-o"></i>&nbsp;新增模板
            <input type="file" class="addPrintTemplate" id="abc" @change="addPrintTemplate()"/>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        components: {},
        data () {
            return {
                templates: {}
            }
        },
        computed: {
            ...mapGetters('systemSetting/auditFlowSet', {})
        },
        watch: {},
        methods: {
            ...mapMutations('systemSetting/auditFlowSet', {}),
            ...mapActions('systemSetting/auditFlowSet', {}),
            addPrintTemplate () {
                var fileInput = document.getElementById('abc')
                if (!fileInput.value) {
                    fileInput.innerHTML = '没有选择任何文件'
                    return
                }
                var file = fileInput.files[0]
                if (file.name.split('.')[1] !== 'lsdx') {
                    alert('不是有效的模板lsdx文件')
                    return
                }
                var reader = new FileReader()
                reader.readAsText(file, 'utf8')
                reader.onload = function (e) {
                    var obj = {}
                    if (!window.localStorage.getItem('printTemplate')) {
                        obj[file.name.split('.')[0]] = this.result
                    } else {
                        obj = JSON.parse(window.localStorage.getItem('printTemplate'))
                        obj[file.name.split('.')[0]] = this.result
                    }
                    console.log(file)
                    console.log('-------------')
                    console.log(JSON.stringify(obj))
                    window.localStorage.setItem('printTemplate', JSON.stringify(obj))
                }
                reader.onloadend = function (e) {
                    console.log('end')
                    this.templates = JSON.parse(window.localStorage.getItem('printTemplate'))
                }
            },
            deleteTemplate () {
                let obj = JSON.parse(window.localStorage.getItem('printTemplate'))
                for (let key in obj) {
                    console.log(key)
                    console.log(event)
                    if (event.target.dataset.template === key) {
                        delete obj[key]
                    }
                }
                window.localStorage.setItem('printTemplate', JSON.stringify(obj))
                this.templates = JSON.parse(window.localStorage.getItem('printTemplate'))
            }
        },
        created () {
        },
        mounted () {
            this.templates = JSON.parse(window.localStorage.getItem('printTemplate'))
        },
        beforeMount () {
        }
    }
</script>
<style>
    .printTemplateButton {
        position: relative;
    }

    .addPrintTemplate {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
</style>
