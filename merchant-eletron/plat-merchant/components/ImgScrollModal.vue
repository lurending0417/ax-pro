<template>
    <div>
        <img :src="src" @click="watchClick" class="img-rounded img-shadow origin">
        <div v-show="!hiddenMask" class="mask" :style="mask_style" @click="hiddenClick">
            <img :src="src" class="img-rounded img-shadow">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['src', 'modalId'],
        data() {
            return {
                mask_style: {},
                hiddenMask: true
            }
        },
        methods: {
            watchImgSize(img) {
                let size = {};
                let fixedWidth = 80;
                let isOverFlow = false; // 宽高都超出
                let ratio = img.width / img.height;
                if (img.width > document.body.clientWidth - fixedWidth) {
                    size.width = document.body.clientWidth - fixedWidth;
                    size.height = size.width / ratio; // 收缩宽度之后的高度
                    if (size.height > document.body.clientHeight - fixedWidth) {
                        size.height = document.body.clientHeight - fixedWidth;
                        size.width = size.height * ratio;
                        isOverFlow = true
                    }
                } else if (img.height > (document.body.clientHeight - fixedWidth) && !isOverFlow) {
                    size.height = document.body.clientHeight - fixedWidth + 'px';
                    size.width = (document.body.clientHeight - fixedWidth) * ratio;
                }
                return size;
            },
            watchClick(event) {
//                console.log('modalId', this.modalId)
//                console.log('modalId', document.getElementById('modalId' + this.modalId))
                let target = document.getElementById('modalId' + this.modalId).parentNode.parentNode;
                this.mask_style.top = -target.offsetTop + 'px';
                this.mask_style.left = -target.offsetLeft + 'px';
                let enlargeImg = event.target.nextSibling.getElementsByTagName('img')[0]
                let {width, height} = this.watchImgSize(enlargeImg);
                enlargeImg.style.width = width + 'px';
                enlargeImg.style.height = height + 'px';
                this.hiddenMask = false;
            },
            hiddenClick() {
                this.hiddenMask = true;
            }
        },
        mounted() {
            this.mask_style.width = document.body.clientWidth + 'px';
            this.mask_style.height = document.body.clientHeight + 'px';
        }
    }
</script>

<style scoped>
    .origin {
        width: 170px;
    }
    img:hover {
        cursor: pointer;
    }
    .mask{
        position: fixed;
        z-index: 3;
        background-color: rgba(0,0,0,0.21);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
