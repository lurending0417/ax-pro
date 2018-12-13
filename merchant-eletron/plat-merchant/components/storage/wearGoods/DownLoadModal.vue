<template>
    <div style="display: flex;justify-content: space-around;padding: 20px 0 0 0;">
        <div style="text-align: center;">
            <qrcode-vue :value="qrcodeLeft.value" :size="125" level="H"></qrcode-vue>
            <p>安卓下载</p>
        </div>
        <div style="text-align: center;">
            <qrcode-vue :value="qrcodeRight.value" :size="125" level="H"></qrcode-vue>
            <p>ios下载</p>
        </div>
    </div>
</template>

<script>
//    import QRCode from 'qrcodejs2';
    import QrcodeVue from 'qrcode.vue';
    export default {
        components: {
            QrcodeVue
        },
        data() {
            return {
                qrcodeLeft: {
                    value: 'https://static.9999ax.com/xmedit/XiaoMeiEdit.apk'
                },
                qrcodeRight: {
                    value: 'https://itunes.apple.com/cn/app/%E5%B0%8F%E7%BE%8E%E7%BC%96%E8%BE%91/id1369288264?mt=8'
                }
            }
        }
    }
</script>
