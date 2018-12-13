<template>
<div>

</div>
</template>

<!--<template>-->
    <!--<div>-->
        <!--<canvas id="FiveChessCanvas" width="450" height="450" @click="moveChess">-->
            <!--Your browser does not support the Canvas API.-->
            <!--Please upgrade your browser.-->
        <!--</canvas>-->
    <!--</div>-->
<!--</template>-->
<!--<script>-->
    <!--class Chess {-->
        <!--// 0 ===》 user-->
        <!--// f ===》 computer-->
        <!--constructor(ctx, color) {-->
            <!--this.color = color;-->
            <!--this.ctx = ctx;-->
        <!--}-->

        <!--moveStep(x, y) {-->
            <!--let {color, ctx} = this-->
            <!--ctx.beginPath();-->
            <!--if (color === '0') {-->
                <!--ctx.fillStyle = '#000';-->
            <!--} else if (color === 'f') {-->
                <!--ctx.fillStyle = '#c0eea4';-->
            <!--}-->
            <!--ctx.arc(x, y, 10, 0, 2 * Math.PI);-->
            <!--ctx.fill();-->
            <!--ctx.closePath();-->
        <!--}-->
    <!--}-->

    <!--class Map {-->
        <!--constructor(size, step, margin) {-->
            <!--this.margin = margin;-->
            <!--this.step = step;-->
            <!--this.size = size;-->
            <!--let arr = [];-->
            <!--for (let i = 0; i <= size; i++) {-->
                <!--arr[i] = [];-->
                <!--for (let j = 0; j <= size; j++) {-->
                    <!--arr[i][j] = {-->
                        <!--x: (i * step) + margin, // x轴坐标-->
                        <!--y: (j * step) + margin, // y轴坐标-->
                        <!--type: '0' // 状态（f,0,none）-->
                    <!--}-->
                <!--}-->
            <!--}-->
            <!--this.arr = arr;-->
        <!--}-->

        <!--placeChess(i, j, type) {-->
            <!--let xPos = parseInt(i / this.step);-->
            <!--let xFlo = 0;-->
            <!--if (i % this.step - this.step > 0) {-->
                <!--xFlo = 1;-->
            <!--}-->
            <!--let yPos = parseInt(j / this.step);-->
            <!--let yFlo = 0;-->
            <!--if (j % this.step - this.step > 0) {-->
                <!--yFlo = 1;-->
            <!--}-->
            <!--this.arr[xPos + xFlo][yPos + yFlo].type = type-->
            <!--return this.arr[xPos + xFlo][yPos + yFlo]-->
        <!--}-->

        <!--hasChess() {-->
            <!--let {arr, size} = this;-->
            <!--let flag = false;-->
            <!--for (let i = 0; i <= size; i++) {-->
                <!--for (let j = 0; j <= size; j++) {-->
                    <!--if (arr[i][j] === 1) {-->
                        <!--flag = true;-->
                        <!--break;-->
                    <!--}-->
                <!--}-->
            <!--}-->
            <!--return flag-->
        <!--}-->

        <!--isOver() {-->
            <!--let {arr, size} = this;-->
            <!--let flag = false;-->
            <!--for (let i = 0; i <= size; i++) {-->
                <!--for (let j = 0; j <= size; j++) {-->
                    <!--if (arr[i][j] === 1) {-->
                        <!--flag = true;-->
                        <!--break;-->
                    <!--}-->
                <!--}-->
            <!--}-->
            <!--return flag-->
        <!--}-->
    <!--}-->

    <!--export default {-->
        <!--data() {-->
            <!--return {-->
                <!--ctx: null,-->
                <!--step: 30,-->
                <!--lenStep: 14,-->
                <!--margin: 10,-->
                <!--map: []-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--DrawChessBoard() { // 绘制棋盘-->
                <!--let {ctx, step, lenStep, margin} = this;-->
                <!--console.log('ctx', ctx)-->
                <!--ctx.strokeStyle = '#ee5566';-->
                <!--for (let i = 0; i <= lenStep; i++) {-->
                    <!--// draw rows-->
                    <!--ctx.moveTo(margin, (i * step) + margin)-->
                    <!--ctx.lineTo((lenStep * step) + margin, (i * step) + margin)-->
                    <!--// draw cols-->
                    <!--ctx.moveTo((i * step) + margin, margin)-->
                    <!--ctx.lineTo((i * step) + margin, (lenStep * step) + margin)-->
                <!--}-->
                <!--ctx.stroke();-->
                <!--ctx.closePath();-->
                <!--// 标注圆心-->
                <!--ctx.beginPath();-->
                <!--ctx.fillStyle = '#000';-->
                <!--ctx.arc((lenStep / 2 * step) + margin, (lenStep / 2 * step) + margin, 4, 0, 2 * Math.PI);-->
                <!--ctx.fill();-->
            <!--},-->
            <!--moveChess(event) {-->
                <!--let x = event.offsetX;-->
                <!--let y = event.offsetY;-->
                <!--let userObj = this.map.placeChess(x, y, '0');-->
                <!--new Chess(this.ctx, '0').moveStep(userObj.x, userObj.y)-->
            <!--}-->
        <!--},-->
        <!--mounted() {-->
            <!--this.ctx = document.getElementById('FiveChessCanvas').getContext('2d');-->
            <!--this.DrawChessBoard()-->
            <!--this.map = new Map(this.lenStep, this.step, this.margin)-->
        <!--}-->
    <!--}-->
<!--</script>-->
