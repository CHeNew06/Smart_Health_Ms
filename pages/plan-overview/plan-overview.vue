<template>
	<view class="page-wrapper">
		<view class="plan-header">
			<text class="plan-h-title">健康计划</text>
			<text class="plan-h-sub">AI为您量身定制的健康管理方案</text>
			<view class="ai-gen-btn" :class="{ loading: aiLoading }" @click="onAiGen">
				<text v-if="!aiLoading">✨ AI智能生成健康计划</text>
				<text v-else>⏳ AI正在生成计划...</text>
			</view>
		</view>

		<view class="plan-body">
			<text class="sec-title">快捷入口</text>
			<view class="quick-grid">
				<navigator url="/pages/medication/medication" class="quick-card" hover-class="quick-hover">
					<text class="q-icon" style="color:#EF4444">💊</text>
					<text class="q-label">用药管理</text>
					<text class="q-count">3种在用药物</text>
				</navigator>
				<navigator url="/pages/task-today/task-today" class="quick-card" hover-class="quick-hover">
					<text class="q-icon" style="color:#10B981">✅</text>
					<text class="q-label">今日任务</text>
					<text class="q-count">已完成 3/8</text>
				</navigator>
			</view>

			<text class="sec-title">当前计划</text>
			<navigator
				v-for="(p, idx) in plans"
				:key="idx"
				url="/pages/plan-edit/plan-edit"
				class="plan-card"
				hover-class="plan-card-hover"
			>
				<view class="pc-header">
					<view class="pc-icon" :style="{ background: p.iconBg, color: p.iconColor }">
						<text>{{ p.icon }}</text>
					</view>
					<view class="pc-info">
						<text class="pc-title">{{ p.title }}</text>
						<text class="pc-desc">{{ p.desc }}</text>
					</view>
					<text class="pc-arrow">›</text>
				</view>
				<view class="pc-progress">
					<view class="pc-bar">
						<view class="pc-fill" :style="{ width: p.progress + '%', background: p.iconColor }"></view>
					</view>
					<text class="pc-pct" :style="{ color: p.iconColor }">{{ p.progress }}%</text>
				</view>
				<view class="pc-tags">
					<text v-for="(t, j) in p.tags" :key="j" class="pc-tag">{{ t }}</text>
				</view>
			</navigator>
		</view>

		<CustomTabbar :current="2" />
	</view>
</template>

<script>
import CustomTabbar from '@/components/custom-tabbar.vue'

export default {
	components: { CustomTabbar },
	data() {
		return {
			aiLoading: false,
			plans: [
				{
					icon: '🏃', iconBg: '#ECFDF5', iconColor: '#10B981',
					title: '运动计划', desc: '每日有氧运动，强化心肺功能',
					progress: 65, tags: ['快走 30分钟/天', '太极拳 周三/五']
				},
				{
					icon: '🍽', iconBg: '#FFFBEB', iconColor: '#F59E0B',
					title: '饮食计划', desc: '低盐低脂，营养均衡',
					progress: 80, tags: ['每日盐<5g', '蔬果≥500g', '限制红肉']
				},
				{
					icon: '💊', iconBg: '#FEF2F2', iconColor: '#EF4444',
					title: '用药计划', desc: '降压药规律服用',
					progress: 95, tags: ['硝苯地平 早晚各1片']
				},
				{
					icon: '🏥', iconBg: '#DBEAFE', iconColor: '#2563EB',
					title: '复查计划', desc: '定期检查，跟踪指标变化',
					progress: 30, tags: ['心内科 3月15日', '血常规 4月1日']
				}
			]
		}
	},
	onShow() {
		uni.hideTabBar()
	},
	methods: {
		onAiGen() {
			if (this.aiLoading) return
			this.aiLoading = true
			setTimeout(() => {
				this.aiLoading = false
				uni.showToast({ title: '计划已生成', icon: 'success' })
			}, 2500)
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper {
	min-height: 100vh;
	background: #F5F7FA;
}
.plan-header {
	background: linear-gradient(135deg, #4A90D9 0%, #3A7BC8 100%);
	padding: 80rpx 32rpx 48rpx;
	color: #fff;
}
.plan-h-title {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	margin-bottom: 6rpx;
}
.plan-h-sub {
	display: block;
	font-size: 26rpx;
	opacity: 0.85;
}
.ai-gen-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 28rpx;
	padding: 24rpx;
	background: rgba(255,255,255,0.15);
	border-radius: 20rpx;
	border: 2rpx dashed rgba(255,255,255,0.4);
	font-size: 28rpx;
	font-weight: 600;
	color: #fff;
}
.ai-gen-btn.loading { opacity: 0.7; }

.plan-body {
	margin-top: -20rpx;
	background: #F5F7FA;
	border-radius: 32rpx 32rpx 0 0;
	padding: 32rpx 32rpx 20rpx;
}
.sec-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: #1D2129;
	margin-bottom: 20rpx;
}

/* 快捷入口 */
.quick-grid {
	display: flex;
	gap: 20rpx;
	margin-bottom: 32rpx;
}
.quick-card {
	flex: 1;
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx;
	text-align: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.quick-hover { opacity: 0.85; }
.q-icon {
	display: block;
	font-size: 44rpx;
	margin-bottom: 8rpx;
}
.q-label {
	display: block;
	font-size: 28rpx;
	font-weight: 500;
	color: #1D2129;
}
.q-count {
	display: block;
	font-size: 22rpx;
	color: #86909C;
	margin-top: 4rpx;
}

/* 计划卡片 */
.plan-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 28rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.plan-card-hover { opacity: 0.9; }
.pc-header {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 20rpx;
}
.pc-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	flex-shrink: 0;
}
.pc-info {
	flex: 1;
	min-width: 0;
}
.pc-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: #1D2129;
}
.pc-desc {
	display: block;
	font-size: 24rpx;
	color: #86909C;
	margin-top: 4rpx;
}
.pc-arrow {
	font-size: 32rpx;
	color: #C9CDD4;
	flex-shrink: 0;
}
.pc-progress {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 16rpx;
}
.pc-bar {
	flex: 1;
	height: 12rpx;
	background: #E5E6EB;
	border-radius: 6rpx;
	overflow: hidden;
}
.pc-fill {
	height: 100%;
	border-radius: 6rpx;
}
.pc-pct {
	font-size: 26rpx;
	font-weight: 600;
	width: 80rpx;
	text-align: right;
}
.pc-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}
.pc-tag {
	padding: 6rpx 16rpx;
	background: #F5F7FA;
	border-radius: 10rpx;
	font-size: 22rpx;
	color: #4E5969;
}
</style>
