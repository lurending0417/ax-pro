// import { getBaseUrl } from "../common/constant/common";
// import AuthStore from "../data/stores/AuthStore";

function uploadUserIcon(dom) {
    // let formData = new FormData()
    // let file = dom.files[0]
    // formData.append('file', file)
    //
    // let fileSize = file.size;
    // var size = fileSize / 1024 / 1024;
    // if (size > 10) {
    //     alert("头像不能大于10M");
    //     return
    // }
    //
    // window.loading && window.loading.show()
    // fetch(getBaseUrl() + '/user/avatar?access-token=' + sessionStorage.getItem("token"), {
    //     method: "POST",
    //     headers: {},
    //     body: formData
    // }).then(function (response) {
    //     // let fileReader = new FileReader()
    //     // fileReader.readAsDataURL(file)
    //     // fileReader.onload = (e) => {
    //     //   document.getElementById("headImg").setAttribute('src', e.target.result)
    //     // }
    //     response.json().then(function (data) {
    //         AuthStore.result.user.avatarPath = data.result
    //         window.loading && window.loading.hidden()
    //     });
    //
    // }, function (error) {
    //     window.loading && window.loading.hidden()
    //     alert("上传头像失败")
    // })
}


export default { uploadUserIcon }