<template>
    <div>
        <nuxt/>
        <RequestLoading></RequestLoading>
    </div>
</template>

<script>
    import RequestLoading from '~/components/RequestLoading';

    export default {
        components: {
            RequestLoading
        }
    }
</script>

<style>
    body {
        background: transparent;
    }
</style>
