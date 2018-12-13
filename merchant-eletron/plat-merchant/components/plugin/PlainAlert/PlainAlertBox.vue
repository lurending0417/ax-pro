<template>
    <transition name="fade">
        <div class="container" :style="defineStyle" v-if="isShow" ref="content">
            <div class="alert">
                <a class="close" @click="closeBox">×</a>
                <strong>{{title}}</strong>
                <p v-for="(item, index) in splitContent" :class="splitContent.length > 1? 'text-left': 'text-align'">
                    {{item}}{{index === splitContent.length - 1? '' : ';'}}</p>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'PlainAlertBox',
        data() {
            return {
                isShow: true,
                title: 'error!',
                content: '',
                time: 60000,
                timer: 0,
                defineStyle: {
                    bottom: '',
                    left: ''
                },
                screenX: 0,
                screenY: 0
            }
        },
        computed: {
            splitContent() {
                let contentArr = [];
                if (this.content) {
                    contentArr = this.content.split('；')
                }
                return contentArr
            }
        },
        watch: {
            'defineStyle': {
                handler: function(val) {
                    console.log(val, 'val')
                },
                deep: true
            }
        },
        methods: {
            close () {
                let that = this;
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(function() {
                    that.isShow = false
                }, this.time);
            },
            showMsgBox: function () {
                this.isShow = true;
                this.promise = new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                });
                // 返回promise对象
                return this.promise;
            },
            closeBox() {
                this.isShow = false;
            }
        },
        mounted () {
            this.close()
        }
    }
</script>

<style scoped>
    .container {
        width: 400px;
        background: #1289d4;
        border-radius: 5px;
        padding: 0;
        position: fixed;
        /*transform: translate(-50%,-50%);*/
        left: 50%;
        bottom: 50%;
        margin-left: -200px;
        z-index: 2002;
        color: #fff;
    }

    .alert {
        margin: 0;
        text-align: center;
        position: relative;
    }

    .alert::before{
        content: '';
        position: absolute;
        bottom:-15px;
        border-bottom: 7px solid transparent;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #1289d4;
        left:50%;
        margin-left: -4px;
    }

    .close{
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
        opacity: 0
    }
</style>
