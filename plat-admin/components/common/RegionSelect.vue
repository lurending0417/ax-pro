<template>
    <el-cascader
        :options="regionData"
        filterable
        clearable
        change-on-select
        :placeholder="placeholder_"
        v-model="codes"
        @change="handleSelect">
    </el-cascader>
</template>


<script>

    import ChinaAreaData from "china-area-data"

    export default {
        model: {
            prop: 'initCode',
            event: 'change'
        },
        props: ['initCode', 'placeholder'],
        data() {
            return {
                placeholder_: '',
                codes: []
            }
        },
        created() {
            this.placeholder_ = this.placeholder || '请选择区域';
            this.codes = this.codesHandler(this.initCode);
        },
        computed: {
            regionData: () => {
                let provinces = [], china = ChinaAreaData["86"];
                for (let provinceCode in china) {
                    let province = {
                        value: provinceCode,
                        label: china[provinceCode],
                    };
                    let provinceChildren = [], cities = ChinaAreaData[provinceCode];
                    for (let cityCode in cities) {
                        let city = {
                            value: cityCode,
                            label: cities[cityCode],
                            children: []
                        };
                        let districts = ChinaAreaData[cityCode];
                        for (let districtCode in districts) {
                            city.children.push({
                                value: districtCode,
                                label: districts[districtCode]
                            });
                        }
                        provinceChildren.push(city);
                    }
                    province.children = provinceChildren;
                    provinces.push(province);
                }
                return provinces;
            }
        },
        watch: {
            'initCode': function (val) {
                this.codes = this.codesHandler(val);
            }
        },
        methods: {
            handleSelect(selected) {
                let length = selected.length;
                this.$emit('change', length ? selected[length - 1] : '');
            },
            codesHandler(val) {
                let array = [];
                if (!val) {
                    return array;
                }
                var provinceCode = val.slice(0, 2) + '0000', cityCode = val.slice(0, 4) + '00', dCode = val;
                array.push(provinceCode);
                if (array.indexOf(cityCode) == -1) {
                    array.push(cityCode);
                }
                if (array.indexOf(dCode) == -1) {
                    array.push(dCode);
                }
                return array;
            }
        }

    }
</script>
