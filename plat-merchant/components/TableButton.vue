<template>
    <span>
        <button type="button" :class="btnProps.btnClasses" :style="btnProps.btnStyle"
                @click="clickButton">{{btnProps.btnName}}</button>
    </span>
</template>

<script>
    export default {
        props: ['btnProps', 'clickCallback', 'item'],
        methods: {
            findParents (self, parentTargetName) {
                if (self.parentElement.nodeName.toLocaleLowerCase() === parentTargetName) {
                    return self.parentElement
                }
                return this.findParents(self.parentElement, parentTargetName)
            },
            clickButton (event) {
                if (this.clickCallback) {
                    this.clickCallback(event, this.item)
                }
            }
        }
    }
</script>

<style>

</style>
