// 系统的配置
import systemConfig from './systemConfig';
// 多个小程序的自定义配置
import appConfig from './appConfig';

// 默认导出配置
export default {
  ...systemConfig,
  ...appConfig,
};
