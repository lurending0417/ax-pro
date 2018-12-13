<template>
    <div>
        <div
            id="myModal"
            class="modal inmodal fade"
            tabindex="-1"
            role="dialog"
            :class="{ in: modalIsNeedIn }"
            :style="{ display: modalDisplay, paddingLeft: modalNeedPaddingLeft }"
            aria-labelledby="myModalLabel"
        >
            <div class="modal-dialog" role="document" :class="modalProps.modalClasses">
                <div class="modal-content">
                    <div class="modal-header modal-header-self">
                        <button type="button" class="close close-self" data-dismiss="modal" aria-label="Close"
                                @click="toggle"><span aria-hidden="true">&times;</span></button>
                        <p class="modal-title modal-title-self" :id="'modal'+modalProps.CONST_CLICK_MODAL">{{ modalProps.titleName }}</p>
                    </div>
                    <slot name="main"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['modalProps'],
        data() {
            return {
                modalIsOpen: false,
                modalIsNeedIn: false,
                modalDisplay: 'none',
                modalNeedPaddingLeft: false
            }
        },
        watch: {
            modalIsOpen() {
                if (this.modalIsOpen) {
                    this.openModal()
                } else {
                    this.closeModal()
                }
            }
        },
        methods: {
            toggle() {
                this.modalIsOpen = !this.modalIsOpen
                if (this.modalProps.CONST_CLICK_MODAL && this.modalIsOpen) {
                    ButtonWithModalEvent.$emit(this.modalProps.CONST_CLICK_MODAL)
                }
            },
            closeModal() {
                this.modalIsNeedIn = false
                this.modalDisplay = 'none'
                this.modalNeedPaddingLeft = false
            },
            openModal() {
                this.modalIsNeedIn = true
                this.modalDisplay = 'block'
                this.modalNeedPaddingLeft = true
            },
            addDefaultStyles() {
                let windowHeight = document.body.offsetHeight
                let className = 'modal-body'
                let attrs = `max-height: ${windowHeight * 3.5 / 5}px!important; overflow-y: auto;`
                let styleTag = `<style>.${className} { ${attrs} }</style>`
                document.querySelector('#customArea').innerHTML = styleTag
            },
            windowResize() {
                window.onresize = () => this.addDefaultStyles()
            }
        },
        mounted() {
            ButtonWithModalEvent.$on(this.modalProps.CONST_CLICK_MODAL, () => {
                this.modalIsOpen = true
            })
            ButtonWithModalEvent.$on(this.modalProps.CONST_CLOSE_MODAL, () => {
                this.modalIsOpen = false
            })
            this.addDefaultStyles()
            this.windowResize()
        }
    }
</script>

<style>
    .modal-title-self {
        font-size: 18px !important;
    }

    .modal-header-self {
        padding: 20px 15px !important;
    }

    .close-self {
        outline: none;
    }
</style>
