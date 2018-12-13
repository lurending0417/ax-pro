<template>
    <div class="reqloading-wrapper" v-show="showRequestLoading">
        <div class="sk-spinner sk-spinner-three-bounce" style="margin-top: 21%">
            <div class="sk-bounce1"></div>
            <div class="sk-bounce2"></div>
            <div class="sk-bounce3"></div>
        </div>
    </div>
</template>

<script>
    import {
        RequestLoadingEvent,
        _CONST_OPEN_REQUEST_LOADING,
        _CONST_CLOSE_REQUEST_LOADING
    } from '~/components/RequestLoadingEvent'

    export default {
        data () {
            return {
                showRequestLoading: false
            }
        },
        mounted () {
            RequestLoadingEvent.$on(_CONST_OPEN_REQUEST_LOADING, () => {
                this.showRequestLoading = true
            })
            RequestLoadingEvent.$on(_CONST_CLOSE_REQUEST_LOADING, () => {
                this.showRequestLoading = false
            })
        }
    }
</script>

<style>
    .reqloading-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: 100%;
        height: 100%;
    }
</style>
