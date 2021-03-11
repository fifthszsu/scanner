//logs.js
// const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    pic: "",
    scanCodeMsg: "",
    yourName: "",
    message: ""
  },
  onLoad: function () {
    wx.cloud.init()
    var that = this;
    // console.log(app.globalData.userInfo)
    // wx.scanCode({ //扫描API
    //   success(res) { //扫描成功
    //     that.setData({
    //       scanCodeMsg: res.result
    //     });
    //     wx.showToast({
    //       title: '成功',
    //       duration: 1000
    //     })
    //     const db = wx.cloud.database()
    //     db.collection('mobile').doc(that.data.scanCodeMsg).get({
    //       success: function(res) {
    //         db.collection('mobile').doc(that.data.scanCodeMsg).update({
    //           data: {
    //             time: util.formatTime(new Date()),
    //             user: that.data.yourName
    //           },
    //           success: function(res) {
    //             that.setData({
    //               message: "该机成功注册到您名下,请妥善保管",
    //               pic : "/images/smile.png"
    //             });
    //           }
    //         })
    //       },
    //       fail: function(res) {
    //         that.setData({
    //           message: "注册失败，请检查二维码是否有效",
    //           pic : "/images/cry.png"
    //         });
    //       }
    //     })
        
    //   }
    // })
    wx.getUserInfo({ //获取用户信息
      success(res) { //扫描成功
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        // wx.setStorage({
        //   "userName":nickName
        // })
        const db = wx.cloud.database()
        db.collection('mapping').doc("28ee4e3e60477d8509c42ddc7e0ab43a").get({
          success: function(res2) {
            if(res2.data.map.hasOwnProperty(nickName)){
              app.globalData.memberName = res2.data.map[nickName]
              wx.navigateTo({
                url: '../scan/scan'
              })
            }else{
              wx.navigateTo({
                url: '../enter/enter'
              })
            }
          },
          fail: function(res2) {console.log(res2)}
        })
        that.setData({
          yourName: nickName
        });
        // wx.showToast({
        //   title: '成功',
        //   duration: 1000
        // })
        
        
      }
    })
  },
})
