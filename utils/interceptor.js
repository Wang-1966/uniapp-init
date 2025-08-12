import config from '@/config/index.js';

// 路由守卫配置
const routeGuardsFun = {
  invoke: (data) => {
    // 跳转的路由是否在路由白名单
    const whetherToIgnoreOrNot = config.routeWhiteList.includes(data.url.split('?')[0]);
    // 用户token
    const token = uni.getStorageSync('token');
    if (!token && !whetherToIgnoreOrNot) {
      uni.showModal({
        content: '如需继续，请先登录账号~',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login',
            });
          }
          data.complete();
        },
      });
      return false;
    }
    return true;
  },
};

// 返回页面异常处理
const backFun = {
  fail: () => {
    uni.switchTab({
      url: '/pages/index/index',
    });
  },
};

/**
 * 路由守卫方法
 */
export const interceptor = () => {
  uni.addInterceptor('navigateTo', routeGuardsFun);
  uni.addInterceptor('reLaunch', routeGuardsFun);
  uni.addInterceptor('redirectTo', routeGuardsFun);
  uni.addInterceptor('navigateBack', backFun);
};
