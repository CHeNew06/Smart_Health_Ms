<template>
	<view class="page page-task-history">
		<CustomNavbar title="历史任务" :show-back="true" />
		<view class="page-body">
			<!-- Calendar -->
			<view class="calendar-wrap">
				<text class="cal-month">{{ currentMonth }}</text>
				<view class="cal-grid">
					<view v-for="(d, idx) in calendarDays" :key="idx" class="cal-day-wrap" @click="selectDay(d)">
						<view
							class="cal-day"
							:class="{ today: d.isToday, selected: d.date === selectedDay }"
						>
							<text class="day-num">{{ d.day }}</text>
							<view v-if="d.hasTask" class="day-dot"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- Stats row -->
			<view class="stats-row">
				<view class="stat-card">
					<text class="stat-value">{{ stats.completionRate }}</text>
					<text class="stat-label">完成率</text>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ stats.streak }}</text>
					<text class="stat-label">连续打卡</text>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ stats.totalTasks }}</text>
					<text class="stat-label">总任务</text>
				</view>
			</view>

			<!-- Selected day tasks -->
			<view class="day-tasks">
				<text class="day-tasks-title">选中日期任务</text>
				<view v-if="!selectedDayTasks.length" class="empty-hint">
					<text class="empty-txt">该日期暂无任务记录</text>
				</view>
				<view class="task-item" v-for="(t, i) in selectedDayTasks" :key="i">
					<view class="task-status-dot" :class="t.status"></view>
					<text class="task-item-title">{{ t.title }}</text>
					<text class="task-item-time">{{ t.time }}</text>
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
		const today = new Date()
		const y = today.getFullYear()
		const m = today.getMonth()
		const d = today.getDate()
		const todayStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
		const days = []
		const daysInMonth = new Date(y, m + 1, 0).getDate()
		for (let i = 1; i <= daysInMonth; i++) {
			const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
			days.push({
				date: dateStr,
				day: i,
				isToday: i === d,
				hasTask: false
			})
		}
		return {
			selectedDay: todayStr,
			calendarDays: days,
			currentMonth: `${y}年${m + 1}月`,
			stats: { completionRate: '--', streak: 0, totalTasks: 0 },
			selectedDayTasks: []
		}
	},
	methods: {
		selectDay(d) {
			this.selectedDay = d.date
			this.selectedDayTasks = []
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #e2eef0;
}
.page-body {
	padding: 24rpx;
}
.calendar-wrap {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
}
.cal-month {
	font-size: 32rpx;
	font-weight: 600;
	color: #1D2129;
	display: block;
	margin-bottom: 24rpx;
}
.cal-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}
.cal-day-wrap {
	width: calc((100% - 16rpx * 6) / 7);
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}
.cal-day {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	background: #F5F7FA;
	&.today {
		background: #4A90D9;
		color: #fff;
	}
	&.selected {
		background: #4A90D9;
		color: #fff;
		box-shadow: 0 0 0 4rpx rgba(74,144,217,0.3);
	}
}
.day-num {
	font-size: 26rpx;
}
.day-dot {
	position: absolute;
	bottom: 8rpx;
	width: 8rpx;
	height: 8rpx;
	background: #4A90D9;
	border-radius: 50%;
}
.cal-day.today .day-dot,
.cal-day.selected .day-dot {
	background: #fff;
}
.stats-row {
	display: flex;
	gap: 16rpx;
	margin-bottom: 24rpx;
}
.stat-card {
	flex: 1;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	text-align: center;
}
.stat-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #4A90D9;
	display: block;
}
.stat-label {
	font-size: 24rpx;
	color: #4E5969;
}
.day-tasks {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
}
.day-tasks-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1D2129;
	display: block;
	margin-bottom: 24rpx;
}
.task-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #E5E6EB;
	&:last-child { border-bottom: none; }
}
.task-status-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin-right: 16rpx;
	&.done { background: #34C759; }
	&.missed { background: #FF3B30; }
}
.task-item-title {
	flex: 1;
	font-size: 28rpx;
	color: #1D2129;
}
.task-item-time {
	font-size: 24rpx;
	color: #4E5969;
}
.empty-hint { padding: 32rpx; text-align: center; }
.empty-txt { font-size: 28rpx; color: #86909C; }
</style>
