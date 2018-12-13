const setting={
      init:()=>{
            // wx.getSystemInfo({
            //       success: function(res) {
            //             let systemFileds=[
            //                   'windowWidth','windowHeight', // 可用宽高
            //                   'brand',//手机品牌
            //                   'model',//型号
            //                   'fontSizeSetting',
            //                   ];
            //             systemFileds.forEach(key=>{
            //                   setting[key]=res[key]
            //             })
            //       },
            // })
            let res=wx.getSystemInfoSync();
            let systemFileds = [
                  'pixelRatio',
                  'windowWidth', 'windowHeight', // 可用宽高
                  'brand',//手机品牌
                  'model',//型号
                  'fontSizeSetting',
            ];
            systemFileds.forEach(key => {
                  setting[key] = res[key]
            })

            console.log(setting['pixelRatio'])
      },
     
}

module.exports=setting;

setting.init();