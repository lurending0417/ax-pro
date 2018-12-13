<template>
<div>
</div>
</template>

<!--<template>-->
    <!--<div class="canvas_warp">-->
        <!--<button class="btn btn-success" @click="begin">test</button>-->
        <!--<button class="btn btn-success" @click="stop">test1</button>-->
        <!--<canvas id="cvs" class="canvas" @keydown="changeDir"></canvas>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->

    <!--class Map {-->
        <!--constructor(width, height, snakeSize) {-->
            <!--// width ==> canvas.width divide snakeSize-->
            <!--// height ==> canvas.height divide snakeSize-->
            <!--this.width = width;-->
            <!--this.height = height;-->
            <!--this.snakeSize = snakeSize;-->
            <!--this.arr = []-->
            <!--for (let i = 0; i <= height; i++) {-->
                <!--this.arr[i] = []-->
                <!--for (let j = 0; j <= width; j++) {-->
                    <!--this.arr[i][j] = {-->
                        <!--x: j * snakeSize,-->
                        <!--y: i * snakeSize,-->
                        <!--food: 0-->
                    <!--}-->
                <!--}-->
            <!--}-->
        <!--}-->
    <!--}-->

    <!--class Snake {-->
        <!--constructor(width, length, ctx) {-->
            <!--this.ctx = ctx;-->
            <!--this.width = width; // 宽度固定-->
            <!--this.length = length; // 长度-->
            <!--this.xPos = 150; // 起点x轴-->
            <!--this.yPos = 100; // 起点y轴-->
            <!--this.direction = 'bottom';-->
            <!--let snake = [];-->
            <!--ctx.fillStyle = '#b5b5b5';-->
            <!--for (let i = 0; i < length; i++) {-->
                <!--snake[i] = [this.xPos, this.yPos + (i * width)];-->
            <!--}-->
            <!--this.snake = snake;-->
            <!--this.isDead = this.isDead.bind(this)-->
            <!--this.createSnake = this.createSnake.bind(this)-->
            <!--this.runCopy = this.runCopy.bind(this)-->
            <!--this.createSnake()-->
        <!--}-->

        <!--createSnake() {-->
            <!--let {ctx, width, snake} = this;-->
            <!--for (let i = 0; i < snake.length; i++) {-->
                <!--ctx.fillRect(snake[i][0], snake[i][1], width, width);-->
            <!--}-->
        <!--}-->

        <!--runCopy(dir) {-->
            <!--let {width, direction, length, snake, createSnake} = this;-->
            <!--let firstIndex = 0;-->
            <!--let lastIndex = length - 1;-->
            <!--let lastArr = snake[lastIndex];-->
            <!--let temp = [];-->
            <!--console.log('dir', dir)-->
            <!--console.log('direction', direction)-->
            <!--switch (dir) {-->
                <!--case 'top' : {-->
                    <!--if (direction === 'bottom') {-->
                        <!--dir = 'bottom';-->
                        <!--temp = [lastArr[0], lastArr[1] + width]-->
                        <!--break-->
                    <!--}-->
                    <!--temp = [lastArr[0], lastArr[1] - width]-->
                    <!--break-->
                <!--}-->
                <!--case 'bottom' : {-->
                    <!--if (direction === 'top') {-->
                        <!--dir = 'top';-->
                        <!--temp = [lastArr[0], lastArr[1] - width]-->
                        <!--break-->
                    <!--}-->
                    <!--temp = [lastArr[0], lastArr[1] + width]-->
                    <!--break-->
                <!--}-->
                <!--case 'left' : {-->
                    <!--if (direction === 'right') {-->
                        <!--dir = 'right';-->
                        <!--temp = [lastArr[0] + width, lastArr[1]]-->
                        <!--break-->
                    <!--}-->
                    <!--temp = [lastArr[0] - width, lastArr[1]]-->
                    <!--break-->
                <!--}-->
                <!--case 'right' : {-->
                    <!--if (direction === 'left') {-->
                        <!--dir = 'left';-->
                        <!--temp = [lastArr[0] - width, lastArr[1]]-->
                        <!--break-->
                    <!--}-->
                    <!--temp = [lastArr[0] + width, lastArr[1]]-->
                <!--}-->
            <!--}-->
            <!--snake.splice(firstIndex, 1)-->
            <!--snake.push(temp)-->
            <!--this.direction = dir-->
            <!--this.snake = snake-->
            <!--console.log('this.direction', this.direction)-->
            <!--createSnake()-->
        <!--}-->

        <!--isDead(mapWidth, mapHeight) {-->
            <!--let {direction, snake, width} = this;-->
            <!--let pointX = snake[snake.length - 1][0]-->
            <!--let pointY = snake[snake.length - 1][1]-->
            <!--switch (direction) {-->
                <!--case 'top': {-->
                    <!--return pointY < 0-->
                <!--}-->
                <!--case 'bottom': {-->
                    <!--console.log('pointY + width', pointY + width)-->
                    <!--console.log('mapHeight', mapHeight)-->
                    <!--return pointY + width > mapHeight-->
                <!--}-->
                <!--case 'left': {-->
                    <!--return pointX < 0-->
                <!--}-->
                <!--case 'right': {-->
                    <!--return pointX + width > mapWidth-->
                <!--}-->
            <!--}-->
        <!--}-->
    <!--}-->

    <!--export default {-->
        <!--data() {-->
            <!--return {-->
                <!--ctx: null,-->
                <!--snakeSize: 10,-->
                <!--snake: null, // 蛇-->
                <!--map: [], // 地图-->
                <!--canvas: null, // 画布-->
                <!--direction: 'bottom', // 方向-->
                <!--interValId: 0,-->
                <!--mapWidth: 500, // 画布宽度-->
                <!--mapHeight: 400 // 画布高度-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--begin() {-->
                <!--this.snake = new Snake(this.snakeSize, 4, this.ctx)-->
                <!--let snake = this.snake-->
                <!--let ctx = this.ctx-->
                <!--let canvas = this.canvas-->
                <!--this.interValId = setInterval(() => {-->
                    <!--let flag = this.snake.isDead(this.map.width * this.snakeSize, this.map.height * this.snakeSize);-->
                    <!--if (flag) {-->
                        <!--alert('你死了')-->
                        <!--this.stop()-->
                    <!--}-->
                    <!--ctx.clearRect(0, 0, canvas.width, canvas.height)-->
                    <!--snake.runCopy(this.direction)-->
                <!--}, 200)-->
                <!--this.canvas.focus()-->
            <!--},-->
            <!--stop() {-->
                <!--clearInterval(this.interValId)-->
            <!--},-->
            <!--changeDir(event) {-->
                <!--let key = event.key;-->
                <!--let dir = '';-->
                <!--switch (key) {-->
                    <!--case 'ArrowDown' : {-->
                        <!--dir = 'bottom'-->
                        <!--break-->
                    <!--}-->
                    <!--case 'ArrowUp' : {-->
                        <!--dir = 'top'-->
                        <!--break-->
                    <!--}-->
                    <!--case 'ArrowLeft' : {-->
                        <!--dir = 'left'-->
                        <!--break-->
                    <!--}-->
                    <!--case 'ArrowRight' : {-->
                        <!--dir = 'right'-->
                        <!--break-->
                    <!--}-->
                <!--}-->
                <!--this.direction = dir-->
                <!--console.log('000000', this.direction)-->
            <!--}-->
        <!--},-->
        <!--mounted() {-->
            <!--this.canvas = document.getElementById('cvs');-->
            <!--this.canvas.setAttribute('width', this.mapWidth)-->
            <!--this.canvas.setAttribute('height', this.mapHeight)-->
            <!--this.ctx = document.getElementById('cvs').getContext('2d')-->
            <!--this.map = new Map(this.mapWidth / this.snakeSize, this.mapHeight / this.snakeSize, this.snakeSize)-->
        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->
    <!--.canvas_warp {-->
        <!--/*margin: 30px auto;*/-->
        <!--width: 500px;-->
        <!--text-align: center;-->
    <!--}-->

    <!--.canvas {-->
        <!--/*background: linear-gradient(left, #799F0C, #ACBB78);*/-->
        <!--background: #fff;-->
        <!--border: 1px solid #000;-->
        <!--outline: none;-->
    <!--}-->
<!--</style>-->
