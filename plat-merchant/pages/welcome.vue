<template>
    <div></div>
</template>

<script>
    import {authUtil} from '~/util';
    export default {
        mounted() {
            this.$store.commit('resetAuthorizedObj', authUtil.getAuthorizedPages())
        }
    }
</script>
