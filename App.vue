<script>
import config from '/config';

export default {
  globalData: {
    isInit: false,
  },
  onLaunch() {
    // 更新小程序
    this.checkForUpdate();
    // 初始化小程序
    this.init();
    // 校验是否登录
    this.checkTheSignInStatus();
  },
  onShow() {},
  onHide() {},
  methods: {
    /**
     * 检查登录状态
     */
    checkTheSignInStatus() {
      let signInStatusTime = setInterval(() => {
        // 获取当前页面栈
        const pages = getCurrentPages();
        // 获取当前页面对象
        const currentPage = pages[pages.length - 1];
        if (pages.length > 0) {
          clearInterval(signInStatusTime);
          // 跳转的路由是否在路由白名单
          const whetherToIgnoreOrNot = config.routeWhiteList.includes('/' + currentPage.route);
          // 用户token
          const token = uni.getStorageSync('token');
          if (!token && !whetherToIgnoreOrNot) {
            uni.showModal({
              content: '如需继续，请先登录账号~',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  uni.redirectTo({
                    url:
                      '/pages/login/login?redirect=' +
                      encodeURIComponent(currentPage.$page.fullPath),
                  });
                }
              },
            });
          }
        }
      }, 500);
    },
    /**
     * 应用初始化
     */
    async init() {
      uni.showLoading({
        title: '初始化...',
        mask: true,
      });
      try {
        // 获取后端基础配置信息;
        // .....

        const token = uni.getStorageSync('token');
        if (token) {
          // 重置token
          // const newToken = await flushToken();
          // uni.setStorageSync('token', newToken?.data?.token);
        } else {
          // 一键登录
          await this.wxLogin();
        }

        this.initializationCompleted();
      } catch (e) {
        this.initializationCompleted();
      }
    },
    /**
     * 完成初始化
     */
    initializationCompleted() {
      this.globalData.isInit = true;
      uni.hideLoading();
      uni.$emit('initApp');
    },
    /**
     * 微信登录（缓存openId和unionId到本地）
     */
    wxLogin() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (loginRes) => {
            api({ wxCode: loginRes.code })
              .then(async (res) => {
                console.log('微信登录：', res);
                uni.setStorageSync('openId', res.data.openId);
                uni.setStorageSync('unionId', res.data.unionId);
                if (res?.data?.token) {
                  // 本地缓存不存在token时（未登录状态），通过微信code实现无感登录
                  uni.setStorageSync('token', res?.data?.token);
                }
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          },
          fail: (err) => {
            console.log('微信登录失败：', err);
            reject(err);
          },
        });
      });
    },
    /**
     * 检测是否更新
     */
    checkForUpdate() {
      const updateManager = uni.getUpdateManager();

      updateManager.onCheckForUpdate((res) => {
        if (!res.hasUpdate) {
          // 当前没有最新版本，则不提示用户更新
          return;
        }

        // 静默下载更新小程序新版本
        updateManager.onUpdateReady(() => {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        });

        // 更新失败
        updateManager.onUpdateFailed(() => {
          // 新的版本下载失败
          uni.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            showCancel: false,
          });
        });
      });
    },
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import '/uni_modules/uview-plus/index.scss';
</style>
