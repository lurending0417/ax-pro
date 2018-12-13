<template>
    <el-radio-group v-model="params[field]" @change="handleSelect">
        <el-radio v-for="item in enums_" :label="item.id" :key="item.id">{{item.name}}</el-radio>
    </el-radio-group>
</template>


<script>

    import {baseUtil, renderUtil} from "~/util"

    export default {
        model: {
            prop: 'selected',
            event: 'change'
        },
        props: ['enum', 'clearable', 'placeholder', 'selected', 'params', 'field'],
        data() {
            return {
                enums_: [],
                clearable_: false,
                placeholder_: ''
            }
        },
        beforeMount() {
            this.enums_ = baseUtil.getEnum(this.enum);
            this.clearable_ = this.clearable && true;
            this.placeholder_ = this.placeholder || "请选择";
        },
        methods: {
            handleSelect(selected) {
                this.$emit('change', selected);
            }
        }

    }

</script>
