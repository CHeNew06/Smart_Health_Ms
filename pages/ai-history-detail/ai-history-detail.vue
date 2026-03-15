<template>
  <view class="page">
    <CustomNavbar :title="pageTitle" :show-back="true" :bg-color="navbarBg">
      <template #right>
        <view class="navbar-badge">
          <text>{{ modeLabel }}</text>
        </view>
      </template>
    </CustomNavbar>

    <view class="content">
      <!-- 总结卡片 -->
      <view class="summary-card" v-if="summaryList.length">
        <text class="summary-title">AI总结</text>
        <view class="summary-list">
          <text class="summary-item" v-for="(s, i) in summaryList" :key="i">• {{ s }}</text>
        </view>
      </view>

      <!-- 聊天回放 -->
      <view class="replay-section">
        <view class="time-marker" v-if="chatTime">
          <text>{{ chatTime }}</text>
        </view>

        <view
          v-for="(msg, idx) in chatReplay"
          :key="idx"
          class="msg-row"
          :class="msg.role === 'user' ? 'msg-user' : 'msg-ai'"
        >
          <view v-if="msg.role === 'ai'" class="ai-avatar">
            <text>🤖</text>
          </view>
          <view class="msg-bubble">
            <text class="msg-content">{{ msg.content }}</text>
          </view>
        </view>
        <view v-if="!chatReplay.length" class="empty-replay">
          <text>暂无对话记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'

export default {
  name: 'AiHistoryDetail',
  components: { CustomNavbar },
  data() {
    return {
      navbarBg: '#e2eef0',
      pageTitle: '咨询详情',
      modeLabel: '问答模式',
      summaryList: [],
      chatTime: '',
      chatReplay: []
    }
  },
  onLoad(options) {
    if (options.title) {
      this.pageTitle = decodeURIComponent(options.title)
    }
    this.modeLabel = options.mode === 'inquiry' ? '问诊模式' : '问答模式'
  }
}
</script>

<style lang="scss" scoped>
$theme-bg: #e2eef0;
$theme-primary: #4A90D9;

.page {
  min-height: 100vh;
  background: $theme-bg;
}

.navbar-badge {
  padding: 8rpx 20rpx;
  background: rgba($theme-primary, 0.2);
  border-radius: 20rpx;
  font-size: 24rpx;
  color: $theme-primary;
}

.content {
  padding: 24rpx 32rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.summary-card {
  background: linear-gradient(135deg, #EAF2FB 0%, rgba($theme-primary, 0.12) 100%);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.summary-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 20rpx;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.summary-item {
  font-size: 28rpx;
  color: #4E5969;
  line-height: 1.5;
}

.replay-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
}

.time-marker {
  text-align: center;
  font-size: 24rpx;
  color: #86909C;
  margin-bottom: 24rpx;
}

.msg-row {
  display: flex;
  margin-bottom: 28rpx;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }

  &.msg-user {
    flex-direction: row-reverse;
    .msg-bubble {
      background: $theme-primary;
      color: #fff;
      margin-right: 0;
      margin-left: 16rpx;
    }
  }

  &.msg-ai {
    .msg-bubble {
      background: #F5F7FA;
      color: #1D2129;
      margin-left: 0;
      margin-right: 16rpx;
    }
  }
}

.ai-avatar {
  width: 56rpx;
  height: 56rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.msg-bubble {
  max-width: 480rpx;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.msg-content {
  white-space: pre-wrap;
}
</style>
