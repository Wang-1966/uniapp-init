// 运行环境配置
import devConfig from './moudules/devConfig';
// 发行环境配置
import proConfig from './moudules/proConfig';
// 公共的配置
import commonConfig from './moudules/commonConfig';

// 不同环境应用的相关配置
const envConfig = process.env.NODE_ENV === 'development' ? devConfig : proConfig;

// 默认导出配置
export default {
  ...envConfig,
  ...commonConfig,
};
