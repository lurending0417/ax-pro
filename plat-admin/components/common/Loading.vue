<template>
    <div v-loading.fullscreen.lock="loading"></div>
</template>

<script>

    import {LoadingEvent} from "./LoadingEvent";

    export default {
        data() {
            return {
                loading: false
            }
        },
        mounted() {
            LoadingEvent.$on("mask", () => {
                this.loading = true
            });
            LoadingEvent.$on("unmask", () => {
                this.loading = false
            });
        }
    }
</script>
