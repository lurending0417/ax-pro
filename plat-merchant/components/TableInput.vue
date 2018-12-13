<template>
    <div>
        <input class="form-control" :class="getClasses" @blur="inputCompleted"/>
    </div>
</template>

<script>
    export default {
        props: ['btnProps', 'inputCallback', 'item'],
        methods: {
            getClasses () {
                if (this.btnProps.btnClasses) {
                    return this.btnProps.btnClasses
                }
                return ''
            },
            findParents (self, parentTargetName) {
                if (self.parentElement.nodeName.toLocaleLowerCase() === parentTargetName) {
                    return self.parentElement
                }
                return this.findParents(self.parentElement, parentTargetName)
            },
            inputCompleted (event) {
                this.inputCallback(event, this.item)
            }
        }
    }
</script>

<style>
</style>
