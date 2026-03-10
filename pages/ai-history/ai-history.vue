<template>
  <view class="page">
    <CustomNavbar title="咨询历史" :show-back="true" :bg-color="navbarBg" />

    <view class="content">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索咨询记录"
          placeholder-class="placeholder"
        />
      </view>

      <view class="filter-tags">
        <view
          v-for="(tag, i) in filterTags"
          :key="i"
          class="tag"
          :class="{ active: filterActive === i }"
          @click="filterActive = i"
        >
          <text>{{ tag.label }}</text>
        </view>
      </view>

      <view class="history-list">
        <view
          v-for="(item, idx) in historyList"
          :key="idx"
          class="history-card"
          @click="goDetail(item)"
        >
          <view class="card-icon">
            <text>{{ item.mode === 'chat' ? '💬' : '📋' }}</text>
          </view>
          <view class="card-main">
            <view class="card-title-row">
              <text class="card-title">{{ item.title }}</text>
              <text class="card-badge" :class="item.mode">{{ item.modeText }}</text>
            </view>
            <text class="card-summary">{{ item.summary }}</text>
            <view class="card-meta">
              <text>{{ item.time }}</text>
              <text>{{ item.count }}条消息</text>
            </view>
          </view>
          <text class="card-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'

export default {
  name: 'AiHistory',
  components: { CustomNavbar },
  data() {
    return {
      navbarBg: '#e2eef0',
      searchKeyword: '',
      filterActive: 0,
      filterTags: [
        { label: '全部', value: '' },
        { label: '智能问答', value: 'chat' },
        { label: 'AI问诊', value: 'inquiry' }
      ],
      historyList: [
        {
          id: '1',
          title: '血压偏高咨询',
          mode: 'chat',
          modeText: '智能问答',
          summary: '咨询了关于血压偏高的注意事项和测量频率建议',
          time: '03-09 14:30',
          count: 6
        },
        {
          id: '2',
          title: '血糖管理建议',
          mode: 'chat',
          modeText: '智能问答',
          summary: '询问了日常饮食和运动对血糖的影响',
          time: '03-08 09:15',
          count: 8
        },
        {
          id: '3',
          title: '心血管风险评估',
          mode: 'inquiry',
          modeText: 'AI问诊',
          summary: '完成5步主动问诊，AI给出风险评估',
          time: '03-07 16:20',
          count: 12
        },
        {
          id: '4',
          title: '睡眠质量咨询',
          mode: 'chat',
          modeText: '智能问答',
          summary: '咨询了改善睡眠的方法和作息建议',
          time: '03-06 21:00',
          count: 4
        },
        {
          id: '5',
          title: '头痛症状问诊',
          mode: 'inquiry',
          modeText: 'AI问诊',
          summary: '通过AI问诊排查头痛可能原因',
          time: '03-05 10:45',
          count: 10
        }
      ]
    }
  },
  methods: {
    goDetail(item) {
      uni.navigateTo({
        url: '/pages/ai-history-detail/ai-history-detail?id=' + (item.id || '') + '&title=' + encodeURIComponent(item.title || '') + '&mode=' + (item.mode || 'chat')
      })
    }
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

.content {
  padding: 24rpx 32rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 80rpx;
  margin-bottom: 24rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
}

.placeholder {
  color: #C9CDD4;
}

.filter-tags {
  display: flex;
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.tag {
  padding: 12rpx 28rpx;
  background: #fff;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #4E5969;

  &.active {
    background: $theme-primary;
    color: #fff;
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.history-card {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.card-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba($theme-primary, 0.1);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
  margin-right: 24rpx;
}

.card-main {
  flex: 1;
  min-width: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1D2129;
}

.card-badge {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;

  &.chat {
    background: rgba($theme-primary, 0.15);
    color: $theme-primary;
  }

  &.inquiry {
    background: rgba(#34C759, 0.15);
    color: #34C759;
  }
}

.card-summary {
  font-size: 26rpx;
  color: #4E5969;
  line-height: 1.5;
  display: block;
  margin-bottom: 12rpx;
}

.card-meta {
  font-size: 24rpx;
  color: #86909C;
  display: flex;
  gap: 24rpx;
}

.card-arrow {
  font-size: 36rpx;
  color: #C9CDD4;
  flex-shrink: 0;
}
</style>
