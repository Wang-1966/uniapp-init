<template>
  <view
    class="nav-main"
    :style="{ ' background-color': bgColor, 'padding-top': menuButtonInfo.top + 'px' }"
    :class="{ shadow: showShadow }"
  >
    <view
      class="page-nav"
      :class="{ 'page-nav2': $slots.default }"
      :style="{
        height: menuButtonInfo.height + 'px',
        width: $slots.default ? `${menuButtonInfo.left}px` : '100%',
      }"
    >
      <view class="con-view">
        <view class="back-icon" @tap="goBack">
          <up-icon
            name="arrow-left"
            size="32rpx"
            bold
            :color="iconWhite ? '#fff' : '#212121'"
          ></up-icon>
        </view>
        <text
          @tap="goBack"
          class="page-nav-tit"
          v-if="!$slots.title"
          :style="{
            'padding-left': $slots.default ? '92rpx' : '0',
          }"
        >
          {{ title }}
        </text>
        <view
          v-else
          class="title-solt"
          :style="{
            'padding-left': $slots.default ? '92rpx' : '0',
          }"
        >
          <slot name="title"></slot>
        </view>
      </view>
      <view class="slot-view">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 全屏页面顶部导航组件
 * 默认插槽为导航栏右侧区域
 * name="title"为标题区域插槽(title插槽存在时，默认的标题将不再显示)
 */
import { ref } from 'vue';

const props = defineProps({
  // 标题文本
  title: {
    type: String,
    default: '',
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: 'rgba(0,0,0,0)',
  },
  // 是否显示阴影
  showShadow: {
    type: Boolean,
    default: false,
  },
  // 是否显示阴影
  iconWhite: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['goBack']);

/**
 * 点击返回按钮抛出"goBack"事件
 */
const goBack = () => {
  emit('goBack');
};

// 小程序右上角胶囊布局数据信息
const menuButtonInfo = ref(uni.getMenuButtonBoundingClientRect());

// 组件的高度(单位px)
const componentHeight = () => {
  // 头部下边间距高度
  const headerBottom = 16;
  return menuButtonInfo.value.top + menuButtonInfo.value.height + uni.upx2px(headerBottom);
};

defineExpose({ componentHeight });
</script>

<style scoped lang="scss">
.title-solt {
  max-width: 440rpx;
  display: flex;
  align-items: center;
}
.shadow {
  box-shadow: 0 8rpx 8rpx 0 rgba(153, 153, 153, 0.35);
}
.nav-main {
  width: 100%;
  padding-bottom: 16rpx;
  overflow: hidden;
}
.con-view {
  height: 100%;
  display: flex;
  align-items: center;
}
.slot-view {
  padding-right: 8rpx;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: center;
}
.page-nav2 {
  display: flex;
  align-items: center;
  justify-content: space-between !important;
}
.page-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  .back-icon {
    position: absolute;
    left: 12rpx;
    top: 50%;
    transform: translateY(-50%);
    padding: 16rpx;
  }
  .page-nav-tit {
    display: inline-block;
    max-width: 380rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #212121;
    font-size: 32rpx;
    font-weight: 600;
  }
}
</style>
