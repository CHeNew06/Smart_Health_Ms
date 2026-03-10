<template>
	<view class="page-wrapper">
		<CustomNavbar title="血压详情" :showBack="true" bgColor="#4A90D9" titleColor="#fff" />
		<view class="detail-header">
			<view class="current-value-area">
				<view class="icon-circle"><text>💓</text></view>
				<view class="val-row">
					<text class="big-value">145</text>
					<text class="big-unit"> / 92 mmHg</text>
				</view>
				<view class="status-badge-danger">
					<text>偏高 ↑</text>
				</view>
			</view>
			<view class="reference-box">
				<text class="ref-col">正常范围</text>
				<text class="ref-col-bold">收缩压 90-140</text>
				<text class="ref-col-bold">舒张压 60-90</text>
			</view>
		</view>

		<view class="detail-body">
			<!-- 查看趋势按钮（与HTML原型一致） -->
			<navigator url="/pages/health-trend/health-trend" class="trend-entry" hover-class="trend-entry-hover">
				<text class="trend-icon">📈</text>
				<text class="trend-text">查看趋势图表</text>
			</navigator>

			<text class="section-title">最近 7 天记录</text>
			<view class="record-list">
				<view
					v-for="(item, idx) in records"
					:key="idx"
					class="record-item"
				>
					<view class="record-left">
						<text class="record-date">{{ item.date }}</text>
						<text class="record-time">{{ item.time }}</text>
					</view>
					<text class="record-value" :class="{ 'value-danger': item.status !== '正常' }">{{ item.value }}</text>
					<view class="record-badge" :class="'badge-' + item.statusClass">
						<text>{{ item.status }}</text>
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
			records: [
				{ date: '今天', time: '08:30', value: '145/92', status: '偏高', statusClass: 'high' },
				{ date: '昨天', time: '08:15', value: '138/88', status: '临界', statusClass: 'warn' },
				{ date: '3月7日', time: '09:00', value: '132/85', status: '正常', statusClass: 'normal' },
				{ date: '3月6日', time: '08:45', value: '128/82', status: '正常', statusClass: 'normal' },
				{ date: '3月5日', time: '07:50', value: '135/86', status: '正常', statusClass: 'normal' },
				{ date: '3月4日', time: '08:20', value: '142/91', status: '偏高', statusClass: 'high' },
				{ date: '3月3日', time: '08:10', value: '130/84', status: '正常', statusClass: 'normal' }
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper {
	min-height: 100vh;
	background: #e2eef0;
}

.detail-header {
	background: linear-gradient(135deg, #4A90D9 0%, #1D4ED8 100%);
	padding: 48rpx 32rpx 40rpx;
	color: #fff;
}
.current-value-area { text-align: center; }
.icon-circle {
	width: 96rpx; height: 96rpx; border-radius: 50%;
	background: rgba(255,255,255,0.15);
	display: inline-flex; align-items: center; justify-content: center;
	font-size: 44rpx; margin-bottom: 16rpx;
}
.val-row { margin-bottom: 12rpx; }
.big-value { font-size: 72rpx; font-weight: 700; }
.big-unit { font-size: 30rpx; opacity: 0.85; }
.status-badge-danger {
	display: inline-block;
	padding: 8rpx 28rpx;
	border-radius: 28rpx;
	background: rgba(239,68,68,0.2);
	color: #FCA5A5;
	font-size: 26rpx;
	font-weight: 600;
	margin-top: 8rpx;
}
.reference-box {
	background: rgba(255,255,255,0.1);
	border-radius: 20rpx;
	padding: 20rpx 28rpx;
	margin-top: 28rpx;
	display: flex;
	justify-content: space-between;
	font-size: 24rpx;
}
.ref-col { opacity: 0.8; }
.ref-col-bold { font-weight: 600; }

.detail-body {
	margin-top: -20rpx;
	background: #e2eef0;
	border-radius: 32rpx 32rpx 0 0;
	padding: 28rpx 0 48rpx;
}

.trend-entry {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 28rpx;
	margin: 0 32rpx 24rpx;
	background: #EAF2FB;
	border-radius: 20rpx;
	color: #4A90D9;
	font-weight: 500;
	font-size: 28rpx;
}
.trend-entry-hover { background: #DBEAFE; }
.trend-icon { font-size: 32rpx; }
.trend-text { font-size: 28rpx; }

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1D2129;
	padding: 0 32rpx 20rpx;
}

.record-list { padding: 0 32rpx; }
.record-item {
	display: flex;
	align-items: center;
	padding: 24rpx 28rpx;
	background: #fff;
	margin-bottom: 12rpx;
	border-radius: 16rpx;
}
.record-left {
	flex: 0 0 140rpx;
}
.record-date {
	display: block;
	font-size: 28rpx;
	color: #4E5969;
	font-weight: 500;
}
.record-time {
	font-size: 22rpx;
	color: #86909C;
}
.record-value {
	flex: 1;
	text-align: right;
	font-size: 32rpx;
	font-weight: 600;
	color: #1D2129;
}
.value-danger { color: #DC2626; }
.record-badge {
	margin-left: 16rpx;
	padding: 6rpx 20rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 600;
}
.badge-normal { background: #ECFDF5; color: #059669; }
.badge-warn { background: #FFFBEB; color: #D97706; }
.badge-high { background: #FEF2F2; color: #DC2626; }
</style>
