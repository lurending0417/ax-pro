<template>
    <div :style="style">test</div>
</template>

<script>
    export default {
        data() {
            return {
                style: ''
            }
        },
        mounted() {
            if (process.browser) {
                console.log('test');
                this.style = {color: 'red'};
            }
        }
    }
</script>
