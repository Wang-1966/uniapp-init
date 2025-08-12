/**
 * 自定义应用初始化完成生命周期
 * 当页面不是从首页正常进入时，需要在应用初始化完成后执行相应逻辑，可使用该方法
 */
export const onInit = (callBack) => {
  // 监听应用初始化完成事件
  uni.$once('initApp', () => {
    if (callBack) {
      callBack();
    }
  });

  // 如果应用已初始化完成,直接触发回调（这里处理为异步任务，防止在页面的同步作用域顶部调用时，无法获取底部定义的方法或变量）
  setTimeout(() => {
    if (getApp().globalData.isInit) {
      if (callBack) {
        callBack();
      }
    }
  });
};
