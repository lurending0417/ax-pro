<template>
    <div style="text-align: right">
        <ul class="pagination">
            <li class="paginate_button"><a @click="goPrevious()" href="javascript:;">上一页</a></li>
            <li class="paginate_button disabled" v-show="showStartEllipsis()"><a href="javascript:;">...</a></li>
            <li class="paginate_button" v-for="num in paginationNums" :class="{ active: isActiveItem(num) }" @click="go(num)" :key="num">
                <router-link :to="{ path: '' }">{{ num }}</router-link>
            </li>
            <li class="paginate_button disabled" v-show="showEndEllipsis()"><a href="javascript:;">...</a></li>
            <li class="paginate_button"><a @click="goNext()" href="javascript:;">下一页</a></li>
        </ul>
    </div>
</template>

<script>
    import { PaginationEvent } from '~/components/PaginationEvent';

    export default {
        props: {
            total: {
                type: Number,
                required: true
            },
            limit: {
                type: Number,
                required: true
            },
            CONST_CHANGE_PAGE: {
                type: String,
                required: true
            },
            CONST_RESTORE: {
                type: String
            }
        },
        data() {
            return {
                // 结果总数
                totalResultAmount: 0,
                // 每页数量
                limitPerPage: 10,
                // 可显示的最大页码数量
                maxPaginationAmount: 5,
                // 总页码数量
                totalPaginationAmount: 0,
                // 当前页码
                currPaginationNum: 1,
                // 最小页码
                minPaginationNum: 1,
                // 最大页码
                maxPaginationNum: 0,
                // 当前显示的第一个页码
                startPaginationNum: 1,
                // 当前显示的最后一个页码
                endPaginationNum: 0,
                // 当前显示分页的所有页码
                paginationNums: [],
                // 从数据库第几条数据开始
                start: 0
            };
        },
        methods: {
            goPrevious() {
                if (this.currPaginationNum !== 1) --this.currPaginationNum;
            },
            goNext() {
                if (this.currPaginationNum !== this.totalPaginationAmount && this.totalPaginationAmount > 0) ++this.currPaginationNum;
            },
            go(num) {
                this.currPaginationNum = num;
            },
            initData() {
                this.limitPerPage = this.limit ? this.limit : this.limitPerPage;
                this.totalResultAmount = this.total;
            },
            getTotalPaginationAmount() {
                return this.totalResultAmount % this.limitPerPage === 0 ? parseInt(this.totalResultAmount / this.limitPerPage) : parseInt(this.totalResultAmount / this.limitPerPage) + 1;
            },
            getStart() {
                return (this.currPaginationNum - 1) * this.limitPerPage;
            },
            updatePaginationNums() {
                this.paginationNums = [];
                let count = this.startPaginationNum;
                while (count <= this.endPaginationNum) {
                    this.paginationNums.push(count++);
                }
            },
            isActiveItem(num) {
                return num === this.currPaginationNum;
            },
            showStartEllipsis() {
                return this.startPaginationNum !== this.minPaginationNum;
            },
            showEndEllipsis() {
                return this.endPaginationNum !== this.maxPaginationNum;
            },
            changePage() {
                PaginationEvent.$emit(this.CONST_CHANGE_PAGE, { start: this.start, limit: this.limitPerPage });
            },
            getCurrEndPaginationNum() {
                return this.maxPaginationNum > this.maxPaginationAmount ? this.maxPaginationAmount : this.maxPaginationNum;
            }
        },
        watch: {
            total() {
                this.initData();
            },
            totalResultAmount() {
                this.totalPaginationAmount = this.getTotalPaginationAmount();
                this.maxPaginationNum = this.totalPaginationAmount;
            },
            maxPaginationNum() {
                this.endPaginationNum = this.getCurrEndPaginationNum();
                this.updatePaginationNums();
            },
            currPaginationNum(val) {
                this.start = this.getStart();
                // 视图显示的pagination处理
                if (this.currPaginationNum === this.startPaginationNum) {
                    if (this.currPaginationNum > this.minPaginationNum) {
                        // 改变显示的分页视图的可视页码
                        --this.endPaginationNum;
                        --this.startPaginationNum;
                        this.updatePaginationNums();
                    }
                } else if (this.currPaginationNum === this.endPaginationNum) {
                    if (this.currPaginationNum < this.maxPaginationNum) {
                        // 改变显示的分页视图的可视页码
                        ++this.endPaginationNum;
                        ++this.startPaginationNum;
                        this.updatePaginationNums();
                    }
                }
                // 改变页码，通知其他组件
                this.changePage();
            }
        },
        mounted() {
            // 开启还原事件监听
            let restoreConst = this.CONST_RESTORE ? this.CONST_RESTORE : '';
            PaginationEvent.$on(restoreConst, () => {
                this.currPaginationNum = 1;
                this.startPaginationNum = 1;
                this.endPaginationNum = this.getCurrEndPaginationNum();
                this.updatePaginationNums();
                this.changePage();
            });
            // 初始化pagination数据
            this.initData();
            // 改变页码，通知其他组件
            this.changePage();
        }
    };
</script>
