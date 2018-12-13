<template>
    <div class="form-group form-group-margin">
        <span class="titleNameSize">{{selectTitle}}&nbsp;&nbsp;&nbsp;</span>
        <select class="form-control" :value="bindValue" @change="$emit('change', $event.target.value)">
            <option value="" v-if="!hideAllItems">全部</option>
            <option :value="item.id" v-for="item in selectItems">{{item.name}}</option>
        </select>
    </div>
</template>

<script>
    export default {
        props: {
            bindValue: String,
            selectTitle: String,
            selectItems: Array,
            hideAllItems: Boolean
        },
        model: {
            prop: 'bindValue',
            event: 'change'
        }
    }
</script>
