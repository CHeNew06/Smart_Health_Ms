<template>
	<view class="page-wrapper">
		<CustomNavbar title="当前计划" :showBack="true" bgColor="#4A90D9" titleColor="#fff" />

		<scroll-view scroll-y class="plan-scroll">
			<view class="plan-list">
				<view v-for="(p, i) in plans" :key="i" class="plan-card" @click="goDetail(p.url)">
					<view class="card-top">
						<view class="card-icon-wrap" :style="{ background: p.bgColor }">
							<text class="card-icon">{{ p.icon }}</text>
						</view>
						<view class="card-info">
							<text class="card-title">{{ p.title }}</text>
							<text class="card-desc">{{ p.desc }}</text>
						</view>
						<text class="card-arrow">›</text>
					</view>

					<view class="card-progress">
						<view class="progress-bar-bg">
							<view class="progress-bar-fill" :style="{ width: p.progress + '%', background: p.barColor }"></view>
						</view>
						<text class="progress-text">{{ p.progress }}%</text>
					</view>

					<view class="card-tags">
						<view v-for="(tag, ti) in p.tags" :key="ti"
							class="tag-item" :style="{ background: p.tagBg, color: p.tagColor }">
							<text>{{ tag }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'

export default {
	components: { CustomNavbar },
	data() {
		return {
			plans: [
				{
					icon: '🏃', title: '运动计划', desc: '每日运动30分钟，有氧+无氧结合',
					progress: 65, bgColor: '#E8F5E9', barColor: '#34C759',
					tagBg: '#E8F5E9', tagColor: '#34C759',
					tags: ['晨跑', '太极拳', '散步'],
					url: '/pages/plan-exercise/plan-exercise'
				},
				{
					icon: '🥗', title: '饮食计划', desc: '均衡营养，低盐低脂饮食',
					progress: 50, bgColor: '#FFF3E0', barColor: '#FF9500',
					tagBg: '#FFF3E0', tagColor: '#FF9500',
					tags: ['低盐', '高蛋白', '粗粮'],
					url: '/pages/plan-diet/plan-diet'
				},
				{
					icon: '💊', title: '用药计划', desc: '按时服药，定期复查',
					progress: 80, bgColor: '#FFEBEE', barColor: '#EF4444',
					tagBg: '#FFEBEE', tagColor: '#EF4444',
					tags: ['降压药', '降糖药', '维生素'],
					url: '/pages/plan-medication/plan-medication'
				},
				{
					icon: '🏥', title: '复查计划', desc: '定期体检，跟踪健康指标变化',
					progress: 30, bgColor: '#E3F2FD', barColor: '#4A90D9',
					tagBg: '#E3F2FD', tagColor: '#4A90D9',
					tags: ['血常规', '心电图', '肝功能'],
					url: '/pages/plan-checkup/plan-checkup'
				}
			]
		}
	},
	methods: {
		goDetail(url) {
			uni.navigateTo({ url })
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper { min-height: 100vh; background: #e2eef0; }
.plan-scroll { height: calc(100vh - var(--status-bar-height, 44px) - 44px); }
.plan-list { padding: 28rpx; }

.plan-card {
	background: #fff; border-radius: 24rpx;
	padding: 28rpx; margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.card-top { display: flex; align-items: center; gap: 20rpx; }
.card-icon-wrap {
	width: 80rpx; height: 80rpx; border-radius: 20rpx;
	display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.card-icon { font-size: 40rpx; }
.card-info { flex: 1; }
.card-title { display: block; font-size: 30rpx; font-weight: 600; color: #1D2129; }
.card-desc { display: block; font-size: 24rpx; color: #86909C; margin-top: 4rpx; }
.card-arrow { font-size: 36rpx; color: #C9CDD4; flex-shrink: 0; }

.card-progress {
	display: flex; align-items: center; gap: 16rpx;
	margin-top: 20rpx;
}
.progress-bar-bg { flex: 1; height: 14rpx; background: #F2F3F5; border-radius: 7rpx; overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: 7rpx; transition: width 0.3s; }
.progress-text { font-size: 24rpx; color: #86909C; font-weight: 500; width: 60rpx; text-align: right; }

.card-tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 16rpx; }
.tag-item {
	padding: 6rpx 18rpx; border-radius: 20rpx;
	font-size: 22rpx; font-weight: 500;
}
</style>
