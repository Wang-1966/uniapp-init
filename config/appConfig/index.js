import app1 from './moudules/app1';
import app2 from './moudules/app2';

// 根据小程序appid匹配对应的自定义配置
const configOptions = {
    // "app1"配置
    wx---------------1: app1,
    // "app2"配置
    wx---------------2: app2
};

/**
 * 根据当前项目应用的小程序appid返回对应的小程序自定义配置
 */
export default configOptions[uni.getAccountInfoSync().miniProgram.appId];
