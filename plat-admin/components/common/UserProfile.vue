<template>
    <el-card class="box-card">
        <table class="table" style="width:100%;">
            <tr>
                <td>
                    <img v-if="json.avatarPath" :src="renderResource(json.avatarPath)"/>
                    <span><b>姓名：</b>{{json.nickName}}</span>
                </td>
                <td>
                    <span><b>手机号码：</b>{{json.telephone}}</span>
                </td>
                <td>
                    <span><b>性别：</b>{{renderGender(json.gender)}}</span>
                </td>
                <td><span><b>注册时间：</b>{{renderTime(json.createTime)}}</span></td>
            </tr>
        </table>
    </el-card>
</template>


<script>

    import api from "~/api"

    import {baseUtil} from "~/util"

    export default {
        props: ['user', 'userId'],
        data() {
            return {
                json: {}
            }
        },
        beforeMount() {
            if (this.user) {
                this.json = this.user;
            } else if (this.userId) {
                api.request({
                    url: api.url.user.get,
                    params: {
                        userId: this.userId
                    },
                    success: (json) => {
                        this.json = json.result;
                    }
                });
            } else {
                throw Error('请提供用户ID或用户JSON');
            }
        },
        methods: {
            renderGender: (gender) => {
                return gender ? baseUtil.getEnum('gender', gender) : '';
            }
        }
    }

</script>
