<template>
    <el-select v-model="params[field]" :multiple="multiple_" :collapse-tags="collapse_tags_" :multiple-limit="multiple_limit_" :clearable="clearable_" :placeholder="placeholder_" @change="handleSelect">
        <el-option
            v-for="item in enums_"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
    </el-select>
</template>


<script>

    import {baseUtil, renderUtil} from "~/util"

    export default {
        model: {
            prop: 'selected',
            event: 'change'
        },
        props: ['enum', 'clearable', 'placeholder', 'selected', 'params', 'field', 'multiple', 'multipleLimit', 'collapseTags'],
        data() {
            return {
                enums_: [],
                clearable_: false,
                placeholder_: '',
                multiple_: false,
                multiple_limit_: 0,
                collapse_tags_: false
            }
        },
        beforeMount() {
            this.enums_ = baseUtil.getEnum(this.enum);
            this.clearable_ = this.clearable && true;
            this.placeholder_ = this.placeholder || "请选择";
            this.multiple_ = this.multiple && true;
            this.multiple_limit_ = this.multipleLimit;
            this.collapse_tags_ = this.collapseTags && true;
        },
        methods: {
            handleSelect(selected) {
                this.$emit('change', selected);
            }
        }

    }

</script>
