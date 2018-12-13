<template>
    <span class="cascading-wrap">
        <input type="text" class="form-control" v-model="getDay"
               @click="chooseDay"
               style="width: 100px;"/>
        <div class="day-wrap" v-show="isBtnClick">
            <table class="vue-datepicker-tb table-striped" >
                <thead>
                <tr>
                    <th colspan="4">月</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,mIndex) in month">
                    <td v-for="(mon,index) in item" @click="clickMonth(mon)">{{mon.m}}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="day-wrap" v-show="isMonthClick">
            <table class="vue-datepicker-tb table-striped day-table" >
                <thead>
                <tr>
                    <th colspan="10">日</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,mIndex) in day">
                    <td v-for="(d,index) in item" @click="clickDay(d)" :value="bindValue">{{d}}</td>
                </tr>
                </tbody>
            </table>
        </div>

    </span>
</template>

<script>
    export default {
        props: {
            bindValue: String
        },
        model: {
            prop: 'bindValue',
            event: 'click'
        },
        data() {
            let month = [];
            for (let i = 0; i < 3; i++) {
                month[i] = [];
                let temp = (i + 1) * 4 - 3;
                for (let j = 0; j < 4; j++) {
                    let day = 31;
                    if (temp === 2) {
                        day = 29;
                    } else if (temp === 4 || temp === 6 || temp === 9 || temp === 11) {
                        day = 30;
                    }
                    month[i][j] = {m: temp, d: day}
                    temp++
                }
            }
            return {
                month,
                day: [],
                isBtnClick: false,
                isMonthClick: false,
                getDay: ''
            }
        },
        methods: {
            chooseDay() {
                this.isBtnClick = !this.isBtnClick
                this.isMonthClick = false
            },
            clickDay(day) {
                this.isMonthClick = false
                this.getDay += day + '日';
                this.$emit('click', this.getDay)
            },
            clickMonth(mon) {
                this.isBtnClick = false
                this.isMonthClick = true
                this.getDay = mon.m + '月';
                this.createDay(mon.d);
            },
            createDay(day) {
                let arr = [];
                let row = 3;
                if (day === 31) {
                    row = 4;
                }
                for (let i = 0; i < row; i++) {
                    arr[i] = [];
                    let cols = 10;
                    if (i === 2 && day === 29) {
                        cols = 9
                    } else if (i === 3) {
                        cols = 1
                    }
                    let temp = 10 * (i + 1) - 9;
                    for (let j = 0; j < cols; j++) {
                        arr[i][j] = temp++
                    }
                }
                this.day = arr
            }
        },
        mounted() {
            this.$on('initMonthDayModal', () => {
                this.getDay = ''
            })
        }
    }
</script>
<style scoped>
    .cascading-wrap {
        position: relative;
    }

    .day-wrap{
        position: absolute;
        top: 33px;
        left: -100px;
        border: 1px solid #DDD;
        z-index: 2;
        background-color: #fff;
        padding: 0 10px 10px;
        display: inline-block;
    }

    .vue-datepicker-tb {
        width: 245px;
        border-collapse: collapse;
        text-align: center;
    }

    .vue-datepicker-tb.day-table{
        width: 250px;
    }
    .vue-datepicker-tb > tbody > tr > td:hover {
        background-color: #f5f7fa;
        cursor:pointer;
        color: #1ab394;
    }
    .vue-datepicker-tb > thead > tr > th {
        text-align: center;
        padding: 5px 0;
    }

</style>
