<template>
    <transition name="fade">
        <div class="container" :style="defineStyle">
            <div class="alert">
                <a class="close" @click="closeBox">×</a>
                <strong>{{title}}</strong>
                <p>{{content}}</p>
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
                time: 7000,
                timer: 0,
                defineStyle: {
                    top: ''
                }
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
        left: 50%;
        top: 90px;
        margin-left: -200px;
        z-index: 10;
        color: #fff;
    }

    .alert {
        margin: 0;
        text-align: center;
        position: relative;
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
