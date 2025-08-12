import loadingIcon from '@/static/images/icon/loadm.png';
import refresherDown from '@/static/images/icon/refresher-down.png';

export default function () {
  // z-paging组件默认配置
  uni.$zp = {
    config: {
      'auto-show-system-loading': true,
      'system-loading-mask': true,
      'refresher-threshold': '100rpx',
      'refresher-out-rate': 0.8,
      'loading-more-title-custom-style': {
        color: '#8286ef',
        'font-size': '22rpx',
      },
      'loading-more-no-more-text': '- 到底了 -',
      'show-loading-more-no-more-line': false,
      'loading-more-loading-icon-custom-image': loadingIcon,
      'refresher-title-style': {
        color: '#8286ef',
        'font-size': '22rpx',
      },
      'refresher-refreshing-img': loadingIcon,
      'refresher-img-style': { width: '28rpx', height: '28rpx', transform: 'translateY(-2rpx)' },
      'refresher-default-img': refresherDown,
      'use-custom-refresher': false,
    },
  };
}
