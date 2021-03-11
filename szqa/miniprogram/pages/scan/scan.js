//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    pic: "",
    scanCodeMsg: "",
    yourName: "",
    message: "",
    nickName:"",
    sucFlag: false
  },
  onLoad: function () {
    wx.cloud.init()
    var that = this; 
    var user = app.globalData.userInfo.nickName;
    that.setData({
      nickName: user
    });
    var memberName = app.globalData.memberName;
    that.setData({
      yourName: memberName
    });
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
        db.collection('mobile').get({
          success: res => {
            var notFound = true
            for (const ele of res.data){
              if(ele.id == that.data.scanCodeMsg){
                var timeNow = util.formatTime(new Date())
                db.collection('mobile').doc(ele._id).update({
                  data: {
                    time: timeNow,
                    user: that.data.nickName,
                    member: that.data.yourName
                  },
                  success: function(res) {
                    that.setData({
                      message: "该机 "+ele.brand+" "+ele.OS+" 成功注册到 " + that.data.yourName+" 名下,请妥善保管",
                      pic : "/images/smile.png"
                    });
                    // that.setData({
                    //   sucFlag: true
                    // });
                    db.collection('logs').doc("79550af2604a3b12098cc7e009506ef8").get({
                      success: res => {
                        var arr=res.data.log
                        arr.push(that.data.scanCodeMsg + " : " + timeNow+" : " + that.data.yourName + " : " + that.data.nickName)
                        db.collection('logs').doc("79550af2604a3b12098cc7e009506ef8").update({
                          data: {
                            log: arr
                          }
                        })
                      }
                    }) 
                  },
                  fail: function(res) {
                    that.setData({
                      message: "数据库更新失败，请联系管理员",
                      pic : "/images/cry.png"
                    });
                  }
                })
 
                notFound = false
                break
              }
            }
            if (notFound){
              that.setData({
                message: "注册失败，请检查二维码是否有效",
                pic : "/images/cry.png"
              });
            }
          }
        })
        // if(that.data.sucFlag){
        //   console.log("aaa")
        //   db.collection('logs').doc("79550af2604a3b12098cc7e009506ef8").get({
        //     success: res => {
        //       var arr=res.data.log
        //       arr.push(that.data.scanCodeMsg + " : " + timeNow+" : " + that.data.yourName + " : " + that.data.nickName)
        //       db.collection('logs').doc("79550af2604a3b12098cc7e009506ef8").update({
        //         data: {
        //           log: arr
        //         }
        //       })
        //     }
        //   }) 
        // }
        
        
        // db.collection('mobile').doc(that.data.scanCodeMsg).get({
        //   success: function(res) {
        //     var brand = res.data.brand
        //     var os = res.data.OS
        //     db.collection('mobile').doc(that.data.scanCodeMsg).update({
        //       data: {
        //         time: util.formatTime(new Date()),
        //         user: that.data.nickName,
        //         member: that.data.yourName
        //       },
        //       success: function(res) {
        //         that.setData({
        //           message: "该机 "+brand+" "+os+" 成功注册到 " + that.data.yourName+" 名下,请妥善保管",
        //           pic : "/images/smile.png"
        //         });
        //       },
        //       fail: function(res) {
        //         that.setData({
        //           message: "数据库更新失败，请联系管理员",
        //           pic : "/images/cry.png"
        //         });
        //       }
        //     })
        //   },
        //   fail: function(res) {
        //     that.setData({
        //       message: "注册失败，请检查二维码是否有效",
        //       pic : "/images/cry.png"
        //     });
        //   }
        // })
        
      }
    })
    
  },
  onUnload: function () {
    wx.reLaunch({
      url: '../index/index', //指定url
    })
  }
  
})
