<template>
	<view class="page-wrapper">
		<CustomNavbar title="健康建议" />
		<view class="header-area">
			<text class="header-icon">💡</text>
			<text class="header-desc">基于您的健康数据，为您提供个性化建议</text>
		</view>
		<TabSwitch :tabs="['饮食', '运动', '生活', '就医']" v-model="tabIndex" />

		<view class="content">
			<!-- Warning card - 有异常时显示 -->
			<view v-if="warningText" class="warning-card">
				<text class="warning-title">⚠ 异常指标提醒</text>
				<text class="warning-text">{{ warningText }}</text>
			</view>

			<!-- Diet tab -->
			<view v-show="tabIndex === 0" class="advice-list">
				<view v-if="!dietAdvice.length" class="empty-hint">暂无饮食建议，请先录入健康数据</view>
				<view v-for="(item, i) in dietAdvice" :key="i" class="advice-item">
					<view class="advice-icon" :style="{ background: item.color }">{{ item.icon }}</view>
					<view class="advice-body">
						<text class="advice-title">{{ item.title }}</text>
						<text class="advice-desc">{{ item.desc }}</text>
						<view class="advice-tags">
							<text v-for="(t, j) in item.tags" :key="j" class="tag">{{ t }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Exercise tab -->
			<view v-show="tabIndex === 1" class="advice-list">
				<view v-if="!exerciseAdvice.length" class="empty-hint">暂无运动建议，请先录入健康数据</view>
				<view v-for="(item, i) in exerciseAdvice" :key="i" class="advice-item">
					<view class="advice-icon" :style="{ background: item.color }">{{ item.icon }}</view>
					<view class="advice-body">
						<text class="advice-title">{{ item.title }}</text>
						<text class="advice-desc">{{ item.desc }}</text>
						<view class="advice-tags">
							<text v-for="(t, j) in item.tags" :key="j" class="tag">{{ t }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Life tab -->
			<view v-show="tabIndex === 2" class="advice-list">
				<view v-if="!lifeAdvice.length" class="empty-hint">暂无生活建议，请先录入健康数据</view>
				<view v-for="(item, i) in lifeAdvice" :key="i" class="advice-item">
					<view class="advice-icon" :style="{ background: item.color }">{{ item.icon }}</view>
					<view class="advice-body">
						<text class="advice-title">{{ item.title }}</text>
						<text class="advice-desc">{{ item.desc }}</text>
						<view class="advice-tags">
							<text v-for="(t, j) in item.tags" :key="j" class="tag">{{ t }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Medical tab -->
			<view v-show="tabIndex === 3" class="advice-list">
				<view v-if="!medicalAdvice.length" class="empty-hint">暂无就医建议，请先录入健康数据</view>
				<view v-for="(item, i) in medicalAdvice" :key="i" class="advice-item">
					<view class="advice-icon" :style="{ background: item.color }">{{ item.icon }}</view>
					<view class="advice-body">
						<text class="advice-title">{{ item.title }}</text>
						<text class="advice-desc">{{ item.desc }}</text>
						<view class="advice-tags">
							<text v-for="(t, j) in item.tags" :key="j" class="tag">{{ t }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/custom-navbar.vue'
	import TabSwitch from '@/components/tab-switch.vue'
	export default {
		components: { CustomNavbar, TabSwitch },
		data() {
			return {
				tabIndex: 0,
				warningText: '',
				dietAdvice: [],
				exerciseAdvice: [],
				lifeAdvice: [],
				medicalAdvice: []
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';
	.page-wrapper {
		min-height: 100vh;
		background: $theme-bg;
		padding-bottom: 48rpx;
	}
	.header-area {
		background: linear-gradient(135deg, #4A90D9 0%, #6BA5E0 100%);
		padding: 40rpx 32rpx;
		text-align: center;
	}
	.header-icon {
		display: block;
		font-size: 56rpx;
		margin-bottom: 16rpx;
	}
	.header-desc {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.95);
	}
	.content {
		padding: 24rpx 32rpx;
	}
	.empty-hint {
		text-align: center;
		color: $uni-text-color-placeholder;
		font-size: 28rpx;
		padding: 60rpx 0;
	}
	.warning-card {
		background: #FEF2F2;
		border-radius: $uni-radius-base;
		padding: 24rpx 32rpx;
		margin-bottom: 32rpx;
		border-left: 6rpx solid #DC2626;
	}
	.warning-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #DC2626;
		margin-bottom: 8rpx;
	}
	.warning-text {
		font-size: 26rpx;
		color: $uni-text-color-secondary;
		line-height: 1.5;
	}
	.advice-list {
		padding: 0;
	}
	.advice-item {
		display: flex;
		background: #fff;
		border-radius: $uni-radius-base;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}
	.advice-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: $uni-radius-base;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.advice-body {
		flex: 1;
	}
	.advice-title {
		display: block;
		font-size: 30rpx;
		font-weight: 600;
		color: $uni-text-color;
		margin-bottom: 8rpx;
	}
	.advice-desc {
		font-size: 26rpx;
		color: $uni-text-color-secondary;
		line-height: 1.5;
		margin-bottom: 12rpx;
	}
	.advice-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
	}
	.tag {
		padding: 4rpx 16rpx;
		background: $theme-primary-bg;
		color: $theme-primary;
		border-radius: 16rpx;
		font-size: 22rpx;
	}
</style>
