<template>
	<view class="page-wrapper">
		<CustomNavbar title="健康建议" />
		<view class="header-area">
			<text class="header-icon">💡</text>
			<text class="header-desc">基于您的健康数据，为您提供个性化建议</text>
		</view>
		<TabSwitch :tabs="['饮食', '运动', '生活', '就医']" v-model="tabIndex" />

		<view class="content">
			<!-- Warning card -->
			<view class="warning-card">
				<text class="warning-title">⚠ 异常指标提醒</text>
				<text class="warning-text">您的血压近期偏高，建议减少盐分摄入并规律监测。</text>
			</view>

			<!-- Diet tab -->
			<view v-show="tabIndex === 0" class="advice-list">
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
				dietAdvice: [
					{ icon: '🥗', color: '#E8F5E9', title: '低盐饮食', desc: '每日食盐摄入控制在6克以内，有助于控制血压。', tags: ['控盐', '清淡'] },
					{ icon: '🥦', color: '#E3F2FD', title: '增加蔬果', desc: '多吃富含钾的蔬菜水果，如香蕉、菠菜等。', tags: ['钾元素', '膳食纤维'] },
					{ icon: '🚫', color: '#FFF3E0', title: '减少腌制食品', desc: '避免腊肉、咸菜等高钠食物。', tags: ['低钠'] }
				],
				exerciseAdvice: [
					{ icon: '🚶', color: '#E8F5E9', title: '每日步行', desc: '建议每日步行30分钟，中等强度为宜。', tags: ['有氧', '轻度'] },
					{ icon: '🧘', color: '#F3E5F5', title: '放松训练', desc: '可尝试深呼吸、太极等，帮助稳定血压。', tags: ['减压'] }
				],
				lifeAdvice: [
					{ icon: '😴', color: '#E3F2FD', title: '规律作息', desc: '保持7-8小时睡眠，避免熬夜。', tags: ['睡眠'] },
					{ icon: '🚭', color: '#FFEBEE', title: '戒烟限酒', desc: '吸烟饮酒会影响血压控制，建议戒除或限制。', tags: ['健康习惯'] }
				],
				medicalAdvice: [
					{ icon: '📋', color: '#FFF8E1', title: '定期复诊', desc: '血压偏高时建议每2-4周复诊一次，遵医嘱用药。', tags: ['复诊'] },
					{ icon: '💊', color: '#E8EAF6', title: '规范用药', desc: '如已服用降压药，请按时规律服药，勿自行停药。', tags: ['用药'] }
				]
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
