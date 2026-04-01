<template>
	<view class="page-wrapper">
		<CustomNavbar :title="detail.title" :showBack="true" bgColor="#4A90D9" titleColor="#fff" />
		<view class="detail-header">
			<view class="current-value-area">
				<view class="icon-circle"><text>{{ detail.icon }}</text></view>
				<view class="val-row">
					<text class="big-value">{{ detail.value }}</text>
					<text class="big-unit"> {{ detail.unit }}</text>
				</view>
				<view :class="'status-badge-' + detail.statusClass">
					<text>{{ detail.statusText }}</text>
				</view>
			</view>
			<view class="reference-box">
				<text class="ref-col">正常范围</text>
				<text class="ref-col-bold">{{ detail.refRange }}</text>
			</view>
		</view>

		<view class="detail-body">
			<navigator :url="'/pages/health-trend/health-trend?type=' + metricType" class="trend-entry" hover-class="trend-entry-hover">
				<text class="trend-icon">📈</text>
				<text class="trend-text">查看趋势图表</text>
			</navigator>

			<text class="section-title">最近 7 天记录</text>
			<view class="record-list">
				<view v-if="!detail.records.length" class="empty-record">
					<text>暂无记录，请前往数据录入</text>
				</view>
				<view v-for="(item, idx) in detail.records" :key="idx" class="record-item">
					<view class="record-left">
						<text class="record-date">{{ item.date }}</text>
						<text class="record-time">{{ item.time }}</text>
					</view>
					<text class="record-value" :class="{ 'value-danger': item.statusClass !== 'normal' }">{{ item.value }}</text>
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

function emptyDetail(conf) {
	return {
		...conf,
		value: '--',
		statusText: '暂无数据',
		statusClass: 'normal',
		records: []
	}
}

const METRIC_CONFIG = {
	bp: { title: '血压详情', icon: '💓', unit: '/ mmHg', refRange: '收缩压 90-140 / 舒张压 60-90' },
	temperature: { title: '体温详情', icon: '🌡', unit: '°C', refRange: '36.0 - 37.3 °C' },
	bloodSugar: { title: '血糖详情', icon: '💧', unit: 'mmol/L', refRange: '空腹 3.9 - 6.1 mmol/L' },
	bmi: { title: 'BMI详情', icon: '⚖', unit: 'kg/m²', refRange: '18.5 - 23.9' },
	heartRate: { title: '心率详情', icon: '💗', unit: 'BPM', refRange: '60 - 100 BPM' },
	sleep: { title: '睡眠详情', icon: '🌙', unit: '小时', refRange: '7 - 9 小时' }
}

const ALL_DETAILS = {}
for (const [k, v] of Object.entries(METRIC_CONFIG)) {
	ALL_DETAILS[k] = emptyDetail(v)
}

export default {
	components: { CustomNavbar },
	data() {
		return {
			metricType: 'bp',
			detail: ALL_DETAILS.bp
		}
	},
	onLoad(options) {
		if (options && options.type && ALL_DETAILS[options.type]) {
			this.metricType = options.type
			this.detail = ALL_DETAILS[options.type]
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper { min-height: 100vh; background: #e2eef0; }

.detail-header {
	background: linear-gradient(135deg, #4A90D9 0%, #1D4ED8 100%);
	padding: 48rpx 32rpx 40rpx; color: #fff;
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
	display: inline-block; padding: 8rpx 28rpx; border-radius: 28rpx;
	background: rgba(239,68,68,0.2); color: #FCA5A5;
	font-size: 26rpx; font-weight: 600; margin-top: 8rpx;
}
.status-badge-success {
	display: inline-block; padding: 8rpx 28rpx; border-radius: 28rpx;
	background: rgba(34,197,94,0.2); color: #86EFAC;
	font-size: 26rpx; font-weight: 600; margin-top: 8rpx;
}

.reference-box {
	background: rgba(255,255,255,0.1); border-radius: 20rpx;
	padding: 20rpx 28rpx; margin-top: 28rpx;
	display: flex; justify-content: space-between; font-size: 24rpx;
}
.ref-col { opacity: 0.8; }
.ref-col-bold { font-weight: 600; }

.detail-body {
	margin-top: -20rpx; background: #e2eef0;
	border-radius: 32rpx 32rpx 0 0; padding: 28rpx 0 48rpx;
}

.trend-entry {
	display: flex; align-items: center; justify-content: center;
	gap: 12rpx; padding: 28rpx; margin: 0 32rpx 24rpx;
	background: #EAF2FB; border-radius: 20rpx;
	color: #4A90D9; font-weight: 500; font-size: 28rpx;
}
.trend-entry-hover { background: #DBEAFE; }
.trend-icon { font-size: 32rpx; }
.trend-text { font-size: 28rpx; }

.section-title { font-size: 32rpx; font-weight: 600; color: #1D2129; padding: 0 32rpx 20rpx; }

.record-list { padding: 0 32rpx; }
.record-item {
	display: flex; align-items: center; padding: 24rpx 28rpx;
	background: #fff; margin-bottom: 12rpx; border-radius: 16rpx;
}
.record-left { flex: 0 0 140rpx; }
.record-date { display: block; font-size: 28rpx; color: #4E5969; font-weight: 500; }
.record-time { font-size: 22rpx; color: #86909C; }
.record-value { flex: 1; text-align: right; font-size: 32rpx; font-weight: 600; color: #1D2129; }
.value-danger { color: #DC2626; }
.record-badge {
	margin-left: 16rpx; padding: 6rpx 20rpx; border-radius: 20rpx;
	font-size: 22rpx; font-weight: 600;
}
.badge-normal { background: #ECFDF5; color: #059669; }
.badge-warn { background: #FFFBEB; color: #D97706; }
.badge-high { background: #FEF2F2; color: #DC2626; }
</style>
