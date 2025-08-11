import config from '@/config';

export default function request(reqData) {
    const {
        // 请求方式
        method,
        // 请求地址
        url,
        // 请求参数
        data,
        // 是否显示加载动画
        isLoad,
        // 加载动画标题
        loadingTitle,
        // 加载动画遮罩层点击是否不可穿透
        loadingMaskState = true,
        // 自定义头信息中的content-type字段
        contentType,
        // 是否不弹窗提示后端返回的异常信息
        noneToast,
        // 是否必须存在token才能调用该接口
        isToken,
        // 这次请求是否不携带token
        emptyToken
    } = reqData;

    return new Promise((resolve, reject) => {
        if (isToken && !uni.getStorageSync('token')) {
            reject(null);
            return;
        }
        if (isLoad) {
            uni.showLoading({
                title: loadingTitle || '加载中...',
                mask: loadingMaskState || true
            });
        }

        // 默认header信息
        const defaultHeader = {
            'content-type': contentType || 'application/json;charset=UTF-8',
            Authorization: emptyToken ? '' : `Bearer ${uni.getStorageSync('token')}`
        };

        uni.request({
            url: `${config.baseUrl}${url}`,
            method: method.toUpperCase(),
            data: data,
            header: Object.assign({}, defaultHeader, config.header),
            success: (res) => {
                if (isLoad) {
                    uni.hideLoading();
                }
                if (!handleError(res, reqData)) {
                    reject(res.data);
                    return;
                }
                resolve(res.data);
            },
            fail: (err) => {
                uni.showToast({
                    title: '网络异常',
                    icon: 'none'
                });
                reject(err);
            }
        });
    });
}

/**
 * 请求回调异常处理
 * @param {Object} res 请求回调
 * @param {Object} reqData 请求方法传参
 */
function handleError(res, reqData) {
    // 请求回调的code状态码
    const code = res.data.code;

    // 获取当前页面栈
    const pages = getCurrentPages();
    // 获取当前页面对象
    const currentPage = pages[pages.length - 1];
    // 当前路由是否在路由白名单中
    const isLoginWhite = config.routeWhiteList.includes('/' + currentPage?.route);

    if (currentPage.route !== 'pages/login/login' && !isLoginWhite && uni.getStorageSync('token')) {
        // 如果存在token并且已过期，同时在需要登录的页面时，跳转登录页面
        uni.redirectTo({
            url: '/pages/login/login?redirect=' + encodeURIComponent(currentPage.$page.fullPath)
        });
        return false;
    }

    if (code !== '200') {
        console.log('请求错误-请求地址：', reqData.url);
        console.log('请求错误-请求参数：', reqData.data);
        console.log('请求错误-请求回调：', res.data);
        if (!reqData.noneToast) {
            uni.showToast({
                title: res?.data?.msg || '服务器开小差了',
                icon: 'none'
            });
        }
        return false;
    }

    return true;
}
