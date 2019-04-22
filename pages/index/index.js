// pm2.5 浓度对应的指数等级
// 0-50 优
// 50-100 良
// 100-150 轻度污染：对敏感人群不健康
// 150-200 中度污染：不健康
// 200-300 重度污染：非常不健康
// 300-500 严重污染：有毒物
// 500以上 爆表：有毒物
let bmap = require('../../lib/bmap-wx.js')
let utils = require('../../utils/utils')
let globalData = getApp().globalData
let SYSTEMINFO = globalData.systeminfo
Page({
    data: {
        cityDatas: {},
        icons: ['/img/clothing.png', '/img/carwashing.png', '/img/pill.png', '/img/running.png', '/img/sun.png'],
        // 用来清空 input
        searchText: '',
        // 是否已经弹出
        hasPopped: false,
        animationMain: {},
        animationOne: {},
        animationTwo: {},
        animationThree: {},
        // 是否切换了城市
        cityChanged: false,
        // 需要查询的城市
        searchCity: '',
        setting: {},
        bcgImg: '',
<<<<<<< HEAD
        bcgColor: '#4FC3F7',
=======
        bcgColor: '#40a7e7',
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        // 粗暴直接：移除后再创建，达到初始化组件的作用
        showHeartbeat: true,
        // heartbeat 时禁止搜索，防止动画执行
        enableSearch: true,
        pos: {},
<<<<<<< HEAD
        painting: {}
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
    },
    calcPM(value) {
        if (value > 0 && value <= 50) {
            return {
                val: value,
                desc: '优',
                detail: '',
            }
        } else if (value > 50 && value <= 100) {
            return {
                val: value,
                desc: '良',
                detail: '',
            }
        } else if (value > 100 && value <= 150) {
            return {
                val: value,
                desc: '轻度污染',
                detail: '对敏感人群不健康',
            }
        } else if (value > 150 && value <= 200) {
            return {
                val: value,
                desc: '中度污染',
                detail: '不健康',
            }
        } else if (value > 200 && value <= 300) {
            return {
                val: value,
                desc: '重度污染',
                detail: '非常不健康',
            }
        } else if (value > 300 && value <= 500) {
            return {
                val: value,
                desc: '严重污染',
                detail: '有毒物',
            }
        } else if (value > 500) {
            return {
                val: value,
                desc: '爆表',
                detail: '能出来的都是条汉子',
            }
        }
    },
    success(data) {
        wx.stopPullDownRefresh()
        let now = new Date()
            // 存下来源数据
        data.updateTime = now.getTime()
        data.updateTimeFormat = utils.formatDate(now, "MM-dd hh:mm")
        let results = data.originalData.results[0] || {}
        data.pm = this.calcPM(results['pm25'])
            // 当天实时温度
        data.temperature = `${results.weather_data[0].date.match(/\d+/g)[2]}`
        wx.setStorage({
            key: 'cityDatas',
            data: data,
        })
        this.setData({
            cityDatas: data,
        })
    },
    commitSearch(res) {
        let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
        this.search(val)
    },
    dance() {
        this.setData({
            enableSearch: false,
        })
        let that = this
        let heartbeat = this.selectComponent('#heartbeat')
        heartbeat.dance(() => {
            that.setData({
                showHeartbeat: false,
                enableSearch: true,
            })
            that.setData({
                showHeartbeat: true,
            })
        })
    },
    search(val) {
        if (val === '520' || val === '521') {
            this.setData({
                searchText: '',
            })
            this.dance()
            return
        }
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300,
        })
        if (val) {
            let that = this
            this.geocoder(val, (loc) => {
                that.init({
                    location: `${loc.lng},${loc.lat}`
                })
            })
        }
    },
    // 地理位置编码
    geocoder(address, success) {
        let that = this
        wx.request({
            url: getApp().setGeocoderUrl(address),
            success(res) {
                let data = res.data || {}
                if (!data.status) {
                    let location = (data.result || {}).location || {}
                        // location = {lng, lat}
                    success && success(location)
                } else {
                    wx.showToast({
                        title: data.msg || '网络不给力，请稍后再试',
                        icon: 'none',
                    })
                }
            },
            fail(res) {
                wx.showToast({
                    title: res.errMsg || '网络不给力，请稍后再试',
                    icon: 'none',
                })
            },
            complete() {
                that.setData({
                    searchText: '',
                })
            },
        })
    },
    fail(res) {
        wx.stopPullDownRefresh()
        let errMsg = res.errMsg || ''
            // 拒绝授权地理位置权限
        if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
            wx.showToast({
                title: '需要开启地理位置权限',
                icon: 'none',
                duration: 3000,
                success(res) {
                    let timer = setTimeout(() => {
                        clearTimeout(timer)
                        wx.openSetting({})
                    }, 3000)
                },
            })
        } else {
            wx.showToast({
                title: '网络不给力，请稍后再试',
                icon: 'none',
            })
        }
    },
    init(params) {
        let that = this
        let BMap = new bmap.BMapWX({
            ak: globalData.ak,
        })
        BMap.weather({
            location: params.location,
            fail: that.fail,
            success: that.success,
        })
    },
    // drawWeather () {
    //   let context = wx.createCanvasContext('line')
    //   context.setStrokeStyle("#ffffff")
    //   context.setLineWidth(1)
    //   context.moveTo(0, 0)
    //   context.lineTo(350, 150)
    //   context.stroke()
    //   context.draw()
    // },
    onPullDownRefresh(res) {
        this.init({})
    },
    setMenuPosition() {
<<<<<<< HEAD
        let that = this
        wx.getStorage({
            key: 'pos',
            success: function(res) {
                that.setData({
                    pos: res.data,
                })
            },
            fail: function(res) {
                that.setData({
=======
        wx.getStorage({
            key: 'pos',
            success: (res) => {
                this.setData({
                    pos: res.data,
                })
            },
            fail: (res) => {
                this.setData({
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
                    pos: {},
                })
            },
        })
    },
    getCityDatas() {
<<<<<<< HEAD
        let that = this
        let cityDatas = wx.getStorage({
            key: 'cityDatas',
            success: function(res) {
                that.setData({
=======
        let cityDatas = wx.getStorage({
            key: 'cityDatas',
            success: (res) => {
                this.setData({
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
                    cityDatas: res.data,
                })
            },
        })
    },
    onShow() {
        this.getCityDatas()
        this.setMenuPosition()
<<<<<<< HEAD
        let that = this
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        let bcgColor = utils.themeSetting()
        this.setData({
            bcgColor,
        })
        this.setBcg()
        this.initSetting((setting) => {
<<<<<<< HEAD
            that.checkUpdate(setting)
=======
            this.checkUpdate(setting)
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        })
        if (!this.data.cityChanged) {
            this.init({})
        } else {
            this.search(this.data.searchCity)
            this.setData({
                cityChanged: false,
                searchCity: '',
            })
<<<<<<< HEAD
        }
    },
    onHide() {
        wx.setStorage({
            key: 'pos',
            data: this.data.pos,
        })
    },
    checkUpdate(setting) {
        // 兼容低版本
        if (!setting.forceUpdate || !wx.getUpdateManager) {
            return
        }
        let updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate((res) => {
            console.error(res)
        })
        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已下载完成，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },
    setBcg() {
        let that = this
        wx.getSavedFileList({
            success: function(res) {
                let fileList = res.fileList
                if (!utils.isEmptyObject(fileList)) {
                    that.setData({
                        bcgImg: fileList[0].filePath,
                    })
                } else {
                    that.setData({
                        bcgImg: '',
                    })
                }
            },
        })
    },
    initSetting(successFunc) {
        let that = this
        wx.getStorage({
            key: 'setting',
            success: function(res) {
                let setting = res.data || {}
                that.setData({
                    setting,
                })
                successFunc && successFunc(setting)
            },
            fail: function() {
                that.setData({
                    setting: {},
                })
            },
        })
    },
    onShareAppMessage(res) {
        return {
            title: '自律更自由',
            path: `/pages/index/index`,
            // imageUrl: '',
            success() {},
            fail(e) {
                let errMsg = e.errMsg || ''
                    // 对不是用户取消转发导致的失败进行提示
                let msg = '分享失败，可重新分享'
                if (errMsg.indexOf('cancel') !== -1) {
                    msg = '取消分享'
                }
                wx.showToast({
                    title: msg,
                    icon: 'none',
                })
            }
        }
=======
        }
    },
    onHide() {
        wx.setStorage({
            key: 'pos',
            data: this.data.pos,
        })
    },
    checkUpdate(setting) {
        // 兼容低版本
        if (!setting.forceUpdate || !wx.getUpdateManager) {
            return
        }
        let updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate((res) => {
            console.error(res)
        })
        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已下载完成，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },
    setBcg() {
        wx.getSavedFileList({
            success: (res) => {
                let fileList = res.fileList
                if (!utils.isEmptyObject(fileList)) {
                    this.setData({
                        bcgImg: fileList[0].filePath,
                    })
                } else {
                    this.setData({
                        bcgImg: '',
                    })
                }
            },
        })
    },
    initSetting(successFunc) {
        wx.getStorage({
            key: 'setting',
            success: (res) => {
                let setting = res.data || {}
                this.setData({
                    setting,
                })
                successFunc && successFunc(setting)
            },
            fail: (res) => {
                this.setData({
                    setting: {},
                })
            },
        })
    },
    onShareAppMessage(res) {
        return {
            title: 'Quiet Weather--安静天气',
            path: `/pages/index/index`,
            // imageUrl: '',
            success() {},
            fail(e) {
                let errMsg = e.errMsg || ''
                    // 对不是用户取消转发导致的失败进行提示
                let msg = '分享失败，可重新分享'
                if (errMsg.indexOf('cancel') !== -1) {
                    msg = '取消分享'
                }
                wx.showToast({
                    title: msg,
                    icon: 'none',
                })
            }
        }
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
    },
    menuMainMove(e) {
        // 如果已经弹出来了，需要先收回去，否则会受 top、left 会影响
        if (this.data.hasPopped) {
            this.takeback()
            this.setData({
                hasPopped: false,
            })
        }
        let windowWidth = SYSTEMINFO.windowWidth
        let windowHeight = SYSTEMINFO.windowHeight
        let touches = e.touches[0]
        let clientX = touches.clientX
        let clientY = touches.clientY
            // 边界判断
        if (clientX > windowWidth - 40) {
            clientX = windowWidth - 40
        }
        if (clientX <= 90) {
            clientX = 90
        }
        if (clientY > windowHeight - 40 - 60) {
            clientY = windowHeight - 40 - 60
        }
        if (clientY <= 60) {
            clientY = 60
        }
        let pos = {
            left: clientX,
            top: clientY,
        }
        this.setData({
            pos,
        })
    },
    menuMain() {
        if (!this.data.hasPopped) {
            this.popp()
            this.setData({
                hasPopped: true,
            })
        } else {
            this.takeback()
            this.setData({
                hasPopped: false,
            })
        }
    },
    menuOne() {
        this.menuMain()
        wx.navigateTo({
            url: '/pages/citychoose/citychoose',
        })
    },
    menuTwo() {
        this.menuMain()
        wx.navigateTo({
            url: '/pages/setting/setting',
        })
    },
    menuThree() {
        this.menuMain()
        wx.navigateTo({
            url: '/pages/about/about',
        })
    },
<<<<<<< HEAD
    menuFour() {
        this.menuMain()
        wx.navigateTo({
            url: '/pages/share/index',
        })
    },
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
    popp() {
        let animationMain = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        let animationOne = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        let animationTwo = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        let animationThree = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
<<<<<<< HEAD
        let animationFour = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        animationMain.rotateZ(180).step()
        animationOne.translate(-50, -60).rotateZ(360).opacity(1).step()
        animationTwo.translate(-100, 0).rotateZ(360).opacity(1).step()
        animationThree.translate(-50, 60).rotateZ(360).opacity(1).step()
        animationFour.translate(-50, 0).rotateZ(360).opacity(1).step()
=======
        animationMain.rotateZ(180).step()
        animationOne.translate(-50, -60).rotateZ(360).opacity(1).step()
        animationTwo.translate(-90, 0).rotateZ(360).opacity(1).step()
        animationThree.translate(-50, 60).rotateZ(360).opacity(1).step()
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        this.setData({
            animationMain: animationMain.export(),
            animationOne: animationOne.export(),
            animationTwo: animationTwo.export(),
            animationThree: animationThree.export(),
<<<<<<< HEAD
            animationFour: animationFour.export()
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        })
    },
    takeback() {
        let animationMain = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        let animationOne = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        let animationTwo = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        let animationThree = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
<<<<<<< HEAD
        let animationFour = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        animationMain.rotateZ(0).step();
        animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
        animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
        animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
<<<<<<< HEAD
        animationFour.translate(0, 0).rotateZ(0).opacity(0).step()
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        this.setData({
            animationMain: animationMain.export(),
            animationOne: animationOne.export(),
            animationTwo: animationTwo.export(),
            animationThree: animationThree.export(),
<<<<<<< HEAD
            animationFour: animationFour.export()
=======
>>>>>>> 05e4fffd53380cacb00cb26a54e8b220d6dcc36f
        })
    },
})