<template>
    <el-pagination :total="options.total" @size-change="changeLimit" :current-page.sync="curPage" @current-change="changePage" :page-sizes="[ 5,10,50,100,200]" :page-size="options.params.limit" layout="total,sizes,prev,pager,next,jumper"></el-pagination>
</template>


<script>

    export default {

        props: ['options'],

        data() {
            return {
                curPage: 1
            }
        },
        beforeMount() {
            if (!this.options.params) {
                this.options.params = {
                    start: 0,
                    limit: 10
                }
            } else {
                if (!this.options.params.start) {
                    this.options.params.start = 0;
                }
                if (!this.options.params.limit) {
                    this.options.params.limit = 10;
                }
            }
        },
        watch: {
            'options.params': {
                deep: true,
                handler: function () {
                    this.curPage = 1;
                }
            },
            'curPage': function (page) {
                this.options.params.start = (page - 1) * this.options.params.limit;
            }
        },
        methods: {
            changeLimit(limit) {
                this.options.params.limit = limit;
                this.curPage = 1;
                this.$emit("list");
            },
            changePage() {
                this.$emit("list");
            },
            list() {
                this.$emit('list');
            },
        }

    }

</script>
