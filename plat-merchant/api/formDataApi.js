import {browserUtil} from '~/util'
import extension from './extension'

/**
 * 上传文件、图片
 * @param options 必须传入options对象
 * @param options.formData 上传的数据，不包括accessToken
 * @param options.url 上传的地址，需要提前处理路径参数，此函数不做处理
 * @param options.success 上传成功的回调函数，传入了data
 * @param options.fail 上传失败的回调函数，传入了data.message,非必须
 */
export default function (options) {
    if (!options) {
        return
    }
    let xhrs = new XMLHttpRequest();
    let accessToken = browserUtil.getCookie('access-token');
    console.log('options.formData', options);
    console.log('options.formData', options.formData);
    options.formData.append('access-token', accessToken);

    let url = extension.chooseURL() + '/' + options.url
    xhrs.open('POST', url);
    if (!options.formData) {
        alert('请传入formData')
        return
    }
    if (!options.fail) {
        options.fail = (message) => {
            alert(message)
        }
    }
    xhrs.send(options.formData);
    xhrs.onreadystatechange = function () {
        if (xhrs.readyState === 4 && xhrs.status === 200) {
            let data = JSON.parse(xhrs.responseText);
            if (data.status === 200) {
                options.success(data)
            } else {
                options.fail(data.message)
            }
        } else if ((xhrs.status > 200 && xhrs.status < 300) || xhrs.status === 304) {
            let str = xhrs.status + ' : ' + xhrs.statusText + ' : ' + xhrs.responseText
            alert('服务器繁忙，错误信息：' + str);
        }
    };
}
