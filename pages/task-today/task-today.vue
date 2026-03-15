<template>
	<view class="page page-task-today">
		<CustomNavbar title="今日任务" :showBack="true" bgColor="#34C759" titleColor="#fff" />

		<!-- Header section -->
		<view class="task-header">
			<view class="header-row">
				<text class="date-text">{{ dateText }}</text>
				<navigator url="/pages/task-history/task-history" class="link-history" hover-class="none">
					<text>查看历史</text>
					<text class="arr">›</text>
				</navigator>
			</view>
			<view class="progress-card">
				<view class="progress-left">
					<text class="progress-percent">{{ completionPercent }}%</text>
					<text class="progress-label">{{ doneCount }}/{{ tasks.length }}完成</text>
				</view>
				<view class="progress-right">
					<canvas canvas-id="ringChart" id="ringChart" class="ring-canvas" :style="{ width: ringSize + 'px', height: ringSize + 'px' }"></canvas>
				</view>
			</view>
		</view>

		<!-- Task list -->
		<view class="task-body">
			<!-- 待完成 -->
			<view class="task-section">
				<text class="section-title">待完成</text>
				<view class="task-list">
					<view
						v-for="(item, idx) in pendingTasks"
						:key="'pending-' + idx"
						class="task-card"
					>
						<view class="task-checkbox" @click="confirmComplete(item)">
							<text v-if="item.done" class="check-icon">✓</text>
						</view>
						<view class="task-content">
							<text class="task-title">{{ item.title }}</text>
							<view class="task-meta">
								<text class="task-tag" :style="{ background: tagColor(item.type) }">{{ item.type }}</text>
								<text class="task-time">{{ item.time }}</text>
							</view>
						</view>
					</view>
					<view v-if="!pendingTasks.length" class="empty-hint">
						<text class="empty-txt">🎉 今日任务已全部完成！</text>
					</view>
				</view>
			</view>

			<!-- 已完成 -->
			<view class="task-section">
				<text class="section-title">已完成</text>
				<view class="task-list">
					<view
						v-for="(item, idx) in doneTasks"
						:key="'done-' + idx"
						class="task-card task-card-done"
					>
						<view class="task-checkbox checked">
							<text class="check-icon">✓</text>
						</view>
						<view class="task-content">
							<text class="task-title strikethrough">{{ item.title }}</text>
							<view class="task-meta">
								<text class="task-tag" :style="{ background: tagColor(item.type) }">{{ item.type }}</text>
								<text class="task-time">{{ item.time }}</text>
							</view>
						</view>
					</view>
					<view v-if="!doneTasks.length" class="empty-hint">
						<text class="empty-txt">暂无已完成任务</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'

export default {
	components: { CustomNavbar },
	data() {
		return {
			ringSize: 80,
			tasks: []
		}
	},
	computed: {
		dateText() {
			const d = new Date()
			return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
		},
		pendingTasks() { return this.tasks.filter(t => !t.done) },
		doneTasks() { return this.tasks.filter(t => t.done) },
		doneCount() { return this.doneTasks.length },
		completionPercent() {
			if (!this.tasks.length) return 0
			return Math.round(this.doneCount / this.tasks.length * 100)
		}
	},
	mounted() {
		this.$nextTick(() => this.drawRing())
	},
	methods: {
		tagColor(type) {
			const m = { 运动: '#34C759', 饮食: '#FF9500', 用药: '#FF3B30', 健康: '#4A90D9' }
			return m[type] || '#4A90D9'
		},
		confirmComplete(item) {
			if (item.done) return
			uni.showModal({
				title: '确认完成',
				content: `确定已完成任务「${item.title}」吗？`,
				success: (res) => {
					if (res.confirm) {
						item.done = true
						uni.showToast({ title: '已完成', icon: 'success' })
						this.$nextTick(() => this.drawRing())
					}
				}
			})
		},
		drawRing() {
			const ctx = uni.createCanvasContext('ringChart', this)
			const s = this.ringSize
			const r = s / 2 - 6
			const cx = s / 2, cy = s / 2
			const percent = this.completionPercent / 100

			ctx.setLineWidth(8)
			ctx.setLineCap('round')
			ctx.setStrokeStyle('#E5E6EB')
			ctx.beginPath()
			ctx.arc(cx, cy, r, 0, 2 * Math.PI)
			ctx.stroke()

			if (percent > 0) {
				ctx.setStrokeStyle('#34C759')
				ctx.beginPath()
				ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * percent)
				ctx.stroke()
			}

			ctx.draw()
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #e2eef0;
}
.task-header {
	background: linear-gradient(135deg, #34C759 0%, #2EB350 100%);
	padding: 20rpx 32rpx 48rpx;
	border-radius: 0 0 32rpx 32rpx;
}
.header-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}
.date-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}
.link-history {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: rgba(255,255,255,0.9);
	.arr { margin-left: 4rpx; }
}
.progress-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.progress-percent {
	font-size: 64rpx;
	font-weight: 700;
	color: #34C759;
	display: block;
}
.progress-label {
	font-size: 28rpx;
	color: #4E5969;
}
.ring-canvas {
	width: 160rpx;
	height: 160rpx;
}

.task-body { padding: 32rpx; }
.task-section { margin-bottom: 40rpx; }
.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1D2129;
	display: block;
	margin-bottom: 16rpx;
}

.task-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
}
.task-card-done { opacity: 0.85; }
.task-checkbox {
	width: 48rpx;
	height: 48rpx;
	border: 2rpx solid #C9CDD4;
	border-radius: 50%;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	&.checked {
		background: #34C759;
		border-color: #34C759;
	}
}
.check-icon {
	color: #fff;
	font-size: 28rpx;
	font-weight: bold;
}
.task-content { flex: 1; }
.task-title {
	font-size: 30rpx;
	color: #1D2129;
	display: block;
}
.strikethrough {
	text-decoration: line-through;
	color: #999 !important;
}
.task-meta {
	display: flex;
	align-items: center;
	margin-top: 8rpx;
	gap: 16rpx;
}
.task-tag {
	font-size: 22rpx;
	color: #fff;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}
.task-time {
	font-size: 24rpx;
	color: #4E5969;
}
.empty-hint {
	padding: 32rpx;
	text-align: center;
}
.empty-txt {
	font-size: 28rpx;
	color: #86909C;
}
</style>
