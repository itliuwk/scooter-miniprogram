export function wxpay(params) {
    return new Promise((resolve, reject) => {
        if (params.state == 'COMPLETED') {
            resolve(true)
        } else {
            if (!params) {
                throw "支付失败"
            }
            wx.requestPayment({
                'timeStamp': params.timeStamp,
                'nonceStr': params.nonceStr,
                'package': params.packageInfo,
                'signType': params.signType,
                'paySign': params.paySign,
                'success': function () {
                    resolve(true)
                },
                'fail': function (res) {
                    resolve(false)
                },
                'complete': function (res) {

                }
            });
        }
    })

}