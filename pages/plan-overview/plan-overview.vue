<template>
	<view class="page-wrapper">
		<!-- 全屏loading遮罩 -->
		<view v-if="aiLoading" class="loading-overlay">
			<view class="loading-card">
				<view class="spinner"></view>
				<text class="loading-title">AI正在生成健康计划</text>
				<text class="loading-sub">正在分析您的健康数据与用药记录...</text>
			</view>
		</view>

		<view class="plan-header">
			<text class="plan-h-title">健康计划</text>
			<text class="plan-h-sub">AI为您量身定制的七天健康管理方案</text>
			<view class="ai-gen-btn" @click="onAiGen">
				<text>✨ AI智能生成健康计划</text>
			</view>
		</view>

		<view class="plan-body">
			<!-- 快捷入口 -->
			<text class="sec-title">快捷入口</text>
			<view class="quick-grid">
				<navigator url="/pages/medication/medication" class="quick-card" hover-class="quick-hover">
					<text class="q-icon">💊</text>
					<text class="q-label">用药管理</text>
					<text class="q-count">用药档案与记录</text>
				</navigator>
				<navigator url="/pages/plan-edit/plan-edit" class="quick-card" hover-class="quick-hover">
					<text class="q-icon">📅</text>
					<text class="q-label">当前计划</text>
					<text class="q-count">本周健康计划</text>
				</navigator>
			</view>

			<!-- 今日任务进度 -->
			<text class="sec-title">今日任务</text>
			<view class="progress-card">
				<view class="progress-ring-area">
					<view class="ring-bg">
						<view class="ring-fill" :style="ringStyle"></view>
						<view class="ring-center">
							<text class="ring-pct">{{ completionPercent }}%</text>
						</view>
					</view>
				</view>
				<view class="progress-info">
					<text class="pi-main">{{ doneCount }}/{{ tasks.length }} 已完成</text>
					<text class="pi-sub">继续加油，完成今日健康任务</text>
					<view class="pi-bar-wrap">
						<view class="pi-bar-bg">
							<view class="pi-bar-fill" :style="{ width: completionPercent + '%' }"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 今日任务列表 -->
			<view class="task-section" v-if="pendingTasks.length">
				<text class="task-sec-label">待完成</text>
				<view v-for="(t, i) in pendingTasks" :key="'p'+i" class="task-item" @click="confirmComplete(t)">
					<view class="task-check"><text class="check-empty"></text></view>
					<view class="task-body">
						<text class="task-name">{{ t.title }}</text>
						<text class="task-time">{{ t.time }}</text>
					</view>
					<view class="task-tag" :style="{ background: tagColor(t.type) }"><text>{{ t.type }}</text></view>
				</view>
			</view>

			<view class="task-section" v-if="doneTasks.length">
				<text class="task-sec-label">已完成</text>
				<view v-for="(t, i) in doneTasks" :key="'d'+i" class="task-item task-done">
					<view class="task-check checked"><text>✓</text></view>
					<view class="task-body">
						<text class="task-name line-through">{{ t.title }}</text>
						<text class="task-time">{{ t.time }}</text>
					</view>
					<view class="task-tag" :style="{ background: tagColor(t.type) }"><text>{{ t.type }}</text></view>
				</view>
			</view>
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
			tasks: []
		}
	},
	computed: {
		pendingTasks() { return this.tasks.filter(t => !t.done) },
		doneTasks() { return this.tasks.filter(t => t.done) },
		doneCount() { return this.doneTasks.length },
		completionPercent() {
			if (!this.tasks.length) return 0
			return Math.round(this.doneCount / this.tasks.length * 100)
		},
		ringStyle() {
			const deg = (this.completionPercent / 100) * 360
			return {
				background: `conic-gradient(#34C759 0deg ${deg}deg, transparent ${deg}deg 360deg)`
			}
		}
	},
	onShow() { uni.hideTabBar() },
	methods: {
		tagColor(type) {
			const m = { '运动': '#34C759', '饮食': '#FF9500', '用药': '#EF4444', '健康': '#4A90D9' }
			return m[type] || '#4A90D9'
		},
		onAiGen() {
			if (this.aiLoading) return
			this.aiLoading = true
			setTimeout(() => {
				this.aiLoading = false
				uni.showToast({ title: '计划已生成', icon: 'success' })
			}, 3000)
		},
		confirmComplete(item) {
			uni.showModal({
				title: '确认完成',
				content: `确定已完成「${item.title}」吗？`,
				success: (res) => {
					if (res.confirm) {
						item.done = true
						uni.showToast({ title: '已完成', icon: 'success' })
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper { min-height: 100vh; background: #e2eef0; }

/* Loading */
.loading-overlay {
	position: fixed; inset: 0; background: rgba(255,255,255,0.92); z-index: 9999;
	display: flex; align-items: center; justify-content: center;
}
.loading-card { text-align: center; padding: 60rpx; }
.spinner {
	width: 80rpx; height: 80rpx; margin: 0 auto 32rpx;
	border: 6rpx solid #E5E6EB; border-top-color: #4A90D9;
	border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-title { display: block; font-size: 32rpx; font-weight: 600; color: #1D2129; margin-bottom: 12rpx; }
.loading-sub { display: block; font-size: 26rpx; color: #86909C; }

/* Header */
.plan-header {
	background: linear-gradient(135deg, #4A90D9 0%, #3A7BC8 100%);
	padding: calc(var(--status-bar-height, 44px) + 24rpx) 32rpx 48rpx;
	color: #fff;
}
.plan-h-title { display: block; font-size: 40rpx; font-weight: 700; margin-bottom: 6rpx; }
.plan-h-sub { display: block; font-size: 26rpx; opacity: 0.85; }
.ai-gen-btn {
	display: flex; align-items: center; justify-content: center;
	margin-top: 28rpx; padding: 24rpx;
	background: rgba(255,255,255,0.15); border-radius: 20rpx;
	border: 2rpx dashed rgba(255,255,255,0.4);
	font-size: 28rpx; font-weight: 600; color: #fff;
}

/* Body */
.plan-body {
	margin-top: -20rpx; background: #e2eef0;
	border-radius: 32rpx 32rpx 0 0; padding: 32rpx 32rpx 20rpx;
}
.sec-title { display: block; font-size: 30rpx; font-weight: 600; color: #1D2129; margin-bottom: 20rpx; }

/* Quick Grid */
.quick-grid { display: flex; gap: 20rpx; margin-bottom: 32rpx; }
.quick-card {
	flex: 1; background: #fff; border-radius: 20rpx;
	padding: 28rpx; text-align: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.quick-hover { opacity: 0.85; }
.q-icon { display: block; font-size: 44rpx; margin-bottom: 8rpx; }
.q-label { display: block; font-size: 28rpx; font-weight: 600; color: #1D2129; }
.q-count { display: block; font-size: 22rpx; color: #86909C; margin-top: 4rpx; }

/* Progress */
.progress-card {
	display: flex; align-items: center; background: #fff;
	border-radius: 24rpx; padding: 32rpx; margin-bottom: 32rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); gap: 32rpx;
}
.progress-ring-area { flex-shrink: 0; }
.ring-bg {
	width: 120rpx; height: 120rpx; border-radius: 50%;
	background: #E5E6EB; position: relative;
}
.ring-fill {
	position: absolute; inset: 0; border-radius: 50%;
	-webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 14rpx), #000 calc(100% - 14rpx));
	mask: radial-gradient(farthest-side, transparent calc(100% - 14rpx), #000 calc(100% - 14rpx));
}
.ring-center {
	position: absolute; inset: 14rpx; border-radius: 50%;
	background: #fff; display: flex; align-items: center; justify-content: center;
}
.ring-pct { font-size: 28rpx; font-weight: 700; color: #34C759; }
.progress-info { flex: 1; }
.pi-main { display: block; font-size: 32rpx; font-weight: 700; color: #1D2129; }
.pi-sub { display: block; font-size: 24rpx; color: #86909C; margin: 8rpx 0 16rpx; }
.pi-bar-wrap {}
.pi-bar-bg { height: 12rpx; background: #E5E6EB; border-radius: 6rpx; overflow: hidden; }
.pi-bar-fill { height: 100%; background: #34C759; border-radius: 6rpx; transition: width 0.3s; }

/* Tasks */
.task-section { margin-bottom: 24rpx; }
.task-sec-label { display: block; font-size: 26rpx; font-weight: 600; color: #86909C; margin-bottom: 16rpx; }
.task-item {
	display: flex; align-items: center; background: #fff;
	border-radius: 16rpx; padding: 24rpx; margin-bottom: 12rpx; gap: 16rpx;
}
.task-done { opacity: 0.7; }
.task-check {
	width: 44rpx; height: 44rpx; border-radius: 50%;
	border: 2rpx solid #C9CDD4; display: flex;
	align-items: center; justify-content: center; flex-shrink: 0;
}
.task-check.checked { background: #34C759; border-color: #34C759; color: #fff; font-size: 24rpx; }
.task-body { flex: 1; }
.task-name { display: block; font-size: 28rpx; color: #1D2129; }
.line-through { text-decoration: line-through; color: #86909C !important; }
.task-time { display: block; font-size: 22rpx; color: #86909C; margin-top: 4rpx; }
.task-tag {
	padding: 6rpx 16rpx; border-radius: 10rpx;
	font-size: 22rpx; color: #fff; flex-shrink: 0;
}
</style>
