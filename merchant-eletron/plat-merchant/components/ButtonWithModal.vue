<template>
    <span>
        <button
            type="button"
            class="btn"
            :class="triggerBtnClasses"
            :style="triggerBtnStyle"
            data-toggle="modal"
            data-target="#myModal"
            @click="toggle"
        >
            {{ triggerBtnName }}
        </button>
        <div
            id="myModal"
            class="modal inmodal fade"
            :class="{ in: modalIsNeedIn }"
            :style="{ display: modalDisplay, paddingLeft: modalNeedPaddingLeft }"
            tabindex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
        >
            <div class="modal-dialog" :class="modalClasses" role="document" :style="modalStyle">
                <div class="modal-content">
                    <div class="modal-header modal-header-self">
                        <button type="button" class="close close-self" data-dismiss="modal" aria-label="Close"
                                @click="toggle"><span aria-hidden="true">&times;</span></button>
                        <p class="modal-title modal-title-self" id="">{{ modalTitleName }}</p>
                    </div>
                    <slot name="main"></slot>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['btnProps', 'modalProps'],
        data() {
            return {
                triggerBtnClasses: [],
                triggerBtnStyle: {},
                triggerBtnName: '',
                modalTitleName: '',
                modalIsOpen: false,
                modalIsNeedIn: false,
                modalDisplay: 'none',
                modalNeedPaddingLeft: false,
                modalClasses: [],
                modalStyle: {}
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
                this.modalIsOpen = !this.modalIsOpen;
                if (this.modalProps.CONST_CLICK_MODAL && this.modalIsOpen) {
                    ButtonWithModalEvent.$emit(this.modalProps.CONST_CLICK_MODAL)
                }
                if (this.modalProps.CONST_CLOSE_MODAL && !this.modalIsOpen) {
                    ButtonWithModalEvent.$emit(this.modalProps.CONST_CLOSE_MODAL)
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
            this.triggerBtnClasses = this.btnProps.btnClasses
            this.triggerBtnStyle = this.btnProps.btnStyle
            this.triggerBtnName = this.btnProps.btnName
            this.modalTitleName = this.modalProps.titleName
            this.modalClasses = this.modalProps.modalClasses;
            this.modalStyle = this.modalProps.modalStyle;
            ButtonWithModalEvent.$on(this.modalProps.CONST_CLOSE_MODAL, () => {
                this.modalIsOpen = false
//                document.body.style.overflow = 'auto'
            })
            ButtonWithModalEvent.$on(this.modalProps.CONST_CLICK_MODAL, () => {
                this.modalIsOpen = true
//                document.body.style.overflow = 'hidden'
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
