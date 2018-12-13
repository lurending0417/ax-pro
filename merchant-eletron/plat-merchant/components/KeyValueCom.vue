<template>
    <span class="form-group form-group-margin">
        <strong>{{title}}</strong><span>{{value}}</span>
    </span>
</template>

<script>
    export default {
        props: ['title', 'value']
    }
</script>
