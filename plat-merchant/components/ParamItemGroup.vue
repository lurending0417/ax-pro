<template>
    <div>
        <fieldset v-if="receivedParams.id">
            <legend>{{receivedParams.name}}</legend>
            <div v-for="props in receivedParams.props" class="form-group" style="padding: 7px">
                <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                <div class="form-control-static col-md-10" style="text-align: left">
                <span v-for="value in props.preValues" class="normal m-r">
                    <span v-if="props.inputType === 'INPUT'">
                        <input type="text" :name="props.id" :placeholder="value" v-model="props.gettedValue"
                               :disabled="pageReadOnly"/>
                    </span>
                    <span v-else-if="props.inputType === 'RADIO'">
                        <input type="radio" v-bind:value="value" v-model="props.gettedValue"
                               :disabled="pageReadOnly"/>{{value}}
                    </span>
                    <span v-else-if="props.inputType === 'CHECKBOX'">
                        <input type="checkbox" :name="props.id" v-bind:value="value" v-model="props.gettedValue"
                               :disabled="pageReadOnly"/>{{value}}
                    </span>
                </span>
                    <span v-if="!props.preValues">
                    <span v-if="props.inputType === 'INPUT'">
                        <input type="text" :name="props.id" v-model="props.gettedValue"
                               :disabled="pageReadOnly"/>
                    </span>
                </span>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script>
    export default {
        props: ['Params', 'pageReadOnly'],
        data() {
            return {
                receivedParams: {}
            }
        },
        mounted() {
            console.log('底层', this.Params);
            this.receivedParams = {};
            this.receivedParams = this.Params;
        }
    }
</script>
