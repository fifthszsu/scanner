//logs.js
const util = require('../../utils/util.js')

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
    wx.scanCode({ //扫描API
      success(res) { //扫描成功
        that.setData({
          scanCodeMsg: res.result
        });
        wx.showToast({
          title: '成功',
          duration: 1000
        })
        const db = wx.cloud.database()
        db.collection('mobile').doc(that.data.scanCodeMsg).get({
          success: function(res) {
            db.collection('mobile').doc(that.data.scanCodeMsg).update({
              data: {
                time: util.formatTime(new Date()),
                user: that.data.yourName
              },
              success: function(res) {
                that.setData({
                  message: "该机成功注册到您名下,请妥善保管",
                  pic : "/images/smile.png"
                });
              }
            })
          },
          fail: function(res) {
            that.setData({
              message: "注册失败，请检查二维码是否有效",
              pic : "/images/cry.png"
            });
          }
        })
        
      }
    })
    wx.getUserInfo({ //获取用户信息
      success(res) { //扫描成功
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        console.log(userInfo)
        that.setData({
          yourName: nickName
        });
        wx.showToast({
          title: '成功',
          duration: 1000
        })
        
        
      }
    })
  },
})
