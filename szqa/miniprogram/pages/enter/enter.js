//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isDisabled: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    memberName:"",
    nickName:""
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    var that = this;
    var user = app.globalData.userInfo.nickName;
    that.setData({
      nickName: user
    });

  },
  // getUserInfo: function (e) {
  //   console.log("hello")
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  nameInput: function (e) { //获取input的值
    if(e.detail.value != ''){
      this.setData({
        isDisabled: false,
        memberName: e.detail.value
      })
    }else{
      this.setData({
        isDisabled: true,
      })
    }
  },
  clickButton: function(e){
    wx.cloud.init();
    var that = this;
    const db = wx.cloud.database()
        db.collection('mapping').doc("28ee4e3e60477d8509c42ddc7e0ab43a").get({
          success: function(res) {
            app.globalData.memberName = that.data.memberName;
            // console.log("the name 2 is " + app.globalData.memberName)
            var newObj = res.data.map;
            newObj[that.data.nickName] = that.data.memberName;
            db.collection('mapping').doc("28ee4e3e60477d8509c42ddc7e0ab43a").update({
              data: {
                map: newObj
              },
              success: function() {
                wx.navigateTo({
                  url: '../scan/scan'
                })
              }
            })
          },
        })
  }
})
