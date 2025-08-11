/**
 * 使用该脚本前请将HBuilderX cli程序添加至环境变量中，否则将无法执行自动构建命令
 * 详情请前往官方文档查看：https://hx.dcloud.net.cn/cli/README
 */
const { execSync } = require('child_process');
const { modify, applyEdits, parse } = require('jsonc-parser');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

// 根据小程序appid匹配对应的自定义配置
const secretKeysOptions = {
    // "测试"小程序上传密钥文件位置
	wx----------------1: '/secret-keys/private.wx----------------1.key',
    // "春华秋实素养"小程序上传密钥文件位置
    wx----------------2: '/secret-keys/private.wx----------------2.key',
};

// 获取当前文件的上上级目录
const parentDir = path.resolve(__dirname, '../../');
// manifest.json文件路径
const manifestJsonPath = path.join(parentDir, 'manifest.json');
// 获取根目录名称
const rootDirName = path.basename(parentDir);

/**
 * 修改uni-app的manifest.json文件
 */
function changeUniAppConfig(appid) {
    // 读取文件内容（字符串）
    const content = fs.readFileSync(manifestJsonPath, 'utf-8');
    const edits = modify(content, ['mp-weixin', 'appid'], appid, {
        formattingOptions: { tabSize: 2, insertSpaces: true }
    });
    // 重新格式化带注释的JSON字符串
    const newContent = applyEdits(content, edits);
    //转换为字符串并写回文件（保留原始格式+注释）
    fs.writeFileSync(manifestJsonPath, newContent, 'utf-8');
    console.log(`manifest.json文件修改完成：${appid}`);
}

/**
 * 获取版本号
 * @returns {*} 版本号
 */
function getVersion() {
    const content = fs.readFileSync(manifestJsonPath, 'utf-8');
    const formatContent = parse(content);
    return formatContent.versionName;
}

/**
 * 主函数
 */
function main() {
    execSync(`cli open`);
    console.log(`开始上传`);

    for (let item in secretKeysOptions) {
        console.log(`${item}上传中...`);
        changeUniAppConfig(item);
        if (!secretKeysOptions[item]) {
            console.log(`${item}密钥文件不存在`);
            continue;
        }
        const nowTime = dayjs().format('YYYY年M月D日H时m分');
        execSync(
            `cli publish --platform mp-weixin --project ${rootDirName} --upload true --appid ${item} --description "ci机器人 在 ${nowTime} 自动上传" --version ${getVersion()} --privatekey ${
                __dirname + secretKeysOptions[item]
            }`,
            {
                stdio: 'inherit'
            }
        );
    }
}

try {
    main();
} catch (e) {
    console.log('执行异常：', e);
}
