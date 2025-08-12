import App from './App';
import Vue from 'vue';
import './uni.promisify.adaptor';
import * as Pinia from 'pinia';
import uviewPlus from '/uni_modules/uview-plus';
import { interceptor } from '/utils/interceptor.js';
import initZpagingConfig from '/utils/initZpagingConfig.js';

// 路由守卫
interceptor();
// 初始化z-paging插件配置
initZpagingConfig();

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.use(uviewPlus);
  return {
    app,
    Pinia,
  };
}
// #endif
