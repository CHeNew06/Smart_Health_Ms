<template>
	<view class="page-wrapper">
		<view class="home-header">
			<view class="greeting-row">
				<view class="greeting-text">
					<text class="greeting-title">早上好，张老先生</text>
					<text class="greeting-date">{{ dateText }}</text>
				</view>
				<view class="input-dropdown-wrap">
					<view class="input-dropdown-btn" @click="toggleInputMenu">
						<text>录入数据</text>
						<text class="arrow">▼</text>
					</view>
					<view v-if="showInputMenu" class="input-dropdown-mask" @click="showInputMenu = false"></view>
					<view v-if="showInputMenu" class="input-dropdown-menu">
						<navigator url="/pages/health-input/health-input" class="menu-item" hover-class="none">
							<text class="menu-icon">✎</text>
							<text>手动录入</text>
						</navigator>
					<navigator url="/pages/health-input/health-input?tab=1" class="menu-item" hover-class="none">
						<text class="menu-icon">🎤</text>
						<text>语音记录</text>
					</navigator>
					</view>
				</view>
			</view>

			<view class="score-card">
				<view class="score-info">
					<text class="score-title">整体健康状况良好</text>
					<view class="score-main">
						<text class="score-num">86</text>
						<text class="score-unit">健康评分</text>
					</view>
					<text class="score-desc">较上周提升3分，继续保持规律的生活习惯</text>
					<view class="stats-row">
						<view class="stat-col">
							<text class="stat-val">7</text>
							<text class="stat-txt">连续打卡天数</text>
						</view>
						<view class="stat-col">
							<text class="stat-val">92%</text>
							<text class="stat-txt">本周完成率</text>
						</view>
						<view class="stat-col">
							<text class="stat-val">正常</text>
							<text class="stat-txt">身体状态</text>
						</view>
					</view>
				</view>
				<view class="donut-area">
					<view class="donut-ring">
						<view class="ring-seg ring-seg1"></view>
						<view class="ring-seg ring-seg2"></view>
						<view class="ring-seg ring-seg3"></view>
						<view class="ring-seg ring-seg4"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="home-body">
			<text class="sec-title">健康指标</text>
			<view class="metrics-grid">
				<navigator
					v-for="(m, idx) in metrics"
					:key="idx"
					url="/pages/health-detail/health-detail"
					class="m-card"
					hover-class="m-card-hover"
				>
					<view class="m-icon-circle" :style="{ background: m.iconBg }">
						<text class="m-emoji">{{ m.icon }}</text>
					</view>
					<view class="m-info">
						<text class="m-label">{{ m.label }}</text>
						<view class="m-val-line">
							<text class="m-val">{{ m.value }}</text>
							<text class="m-unit">{{ m.unit }}</text>
						</view>
						<text class="m-status" :style="{ color: m.statusColor }">{{ m.status }}</text>
					</view>
				</navigator>
			</view>

			<text class="sec-title">今日建议</text>
			<view class="advice-list">
				<navigator
					v-for="(a, idx) in adviceList"
					:key="idx"
					url="/pages/health-advice/health-advice"
					class="advice-item"
					hover-class="advice-hover"
				>
					<view class="a-icon" :style="{ background: a.iconBg }">
						<text>{{ a.icon }}</text>
					</view>
					<view class="a-body">
						<text class="a-title">{{ a.title }}</text>
						<text class="a-desc">{{ a.desc }}</text>
					</view>
				</navigator>
			</view>
		</view>
		<CustomTabbar :current="0" />
	</view>
</template>

<script>
import CustomTabbar from '@/components/custom-tabbar.vue'

export default {
	components: { CustomTabbar },
	data() {
		return {
			showInputMenu: false,
			dateText: '',
			metrics: [
				{ icon: '🌡', iconBg: '#FEF9C3', label: '体温', value: '37.6', unit: '°C', status: '偏高', statusColor: '#F59E0B' },
				{ icon: '❤', iconBg: '#ECFDF5', label: '血压', value: '125', unit: '/77 mmHg', status: '正常', statusColor: '#16A34A' },
				{ icon: '💧', iconBg: '#EFF6FF', label: '血糖', value: '5.8', unit: 'mmol/L', status: '正常', statusColor: '#16A34A' },
				{ icon: '⚖', iconBg: '#F3E8FF', label: 'BMI', value: '21.9', unit: 'kg/m²', status: '标准', statusColor: '#2563EB' },
				{ icon: '💗', iconBg: '#FEF2F2', label: '心率', value: '83', unit: 'BPM', status: '正常', statusColor: '#16A34A' },
				{ icon: '🌙', iconBg: '#EDE9FE', label: '睡眠时长', value: '7.5', unit: '小时', status: '良好', statusColor: '#2563EB' }
			],
			adviceList: [
				{ icon: '🌡', iconBg: '#FEF9C3', title: '关注体温', desc: '体温偏高，建议多休息，必要时就医检查' },
				{ icon: '🏃', iconBg: '#ECFDF5', title: '保持运动', desc: '建议每天进行30分钟中等强度有氧运动' },
				{ icon: '🥗', iconBg: '#EFF6FF', title: '均衡饮食', desc: '减少钠盐摄入，每日不超过5g，多食新鲜蔬果' }
			]
		}
	},
	onShow() {
		uni.hideTabBar()
	},
	onLoad() {
		this.initDateText()
	},
	methods: {
		initDateText() {
			const d = new Date()
			const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
			this.dateText = `今天是 ${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日，${weekDays[d.getDay()]}`
		},
		toggleInputMenu() {
			this.showInputMenu = !this.showInputMenu
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper {
	min-height: 100vh;
	background: #e2eef0;
	padding-bottom: 20rpx;
}

.home-header {
	background: linear-gradient(180deg, #4A90D9 0%, #3A7BC8 100%);
	padding: 80rpx 32rpx 40rpx;
	color: #fff;
}

.greeting-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 28rpx;
}
.greeting-text {
	.greeting-title {
		display: block;
		font-size: 38rpx;
		font-weight: 700;
	}
	.greeting-date {
		display: block;
		font-size: 24rpx;
		opacity: 0.85;
		margin-top: 6rpx;
	}
}

.input-dropdown-wrap { position: relative; }
.input-dropdown-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 14rpx 24rpx;
	background: rgba(255,255,255,0.2);
	border-radius: 36rpx;
	font-size: 26rpx;
	color: #fff;
	.arrow { font-size: 20rpx; }
}
.input-dropdown-mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	z-index: 99;
}
.input-dropdown-menu {
	position: absolute;
	right: 0;
	top: 80rpx;
	background: #fff;
	border-radius: 20rpx;
	min-width: 280rpx;
	box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.15);
	overflow: hidden;
	z-index: 100;
}
.menu-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 24rpx 28rpx;
	font-size: 28rpx;
	color: #333;
	border-bottom: 1rpx solid #f0f0f0;
	&:last-child { border-bottom: none; }
	.menu-icon { font-size: 30rpx; }
}

/* Score Card - 使用纯CSS环形图代替canvas */
.score-card {
	background: rgba(255,255,255,0.15);
	border-radius: 28rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
}
.score-info {
	flex: 1;
	min-width: 0;
	.score-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 4rpx;
	}
	.score-main {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		margin: 8rpx 0;
	}
	.score-num {
		font-size: 72rpx;
		font-weight: 800;
		line-height: 1;
	}
	.score-unit {
		font-size: 22rpx;
		opacity: 0.8;
	}
	.score-desc {
		display: block;
		font-size: 22rpx;
		opacity: 0.7;
		line-height: 1.4;
		margin-bottom: 16rpx;
	}
}
.stats-row {
	display: flex;
	gap: 16rpx;
}
.stat-col {
	text-align: center;
	.stat-val {
		display: block;
		font-size: 30rpx;
		font-weight: 700;
	}
	.stat-txt {
		font-size: 18rpx;
		opacity: 0.7;
	}
}

/* CSS 环形图 */
.donut-area {
	width: 200rpx;
	height: 200rpx;
	flex-shrink: 0;
	margin-left: 16rpx;
}
.donut-ring {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	position: relative;
	background: conic-gradient(
		#F59E0B 0deg 108deg,
		transparent 108deg 112deg,
		#3B82F6 112deg 202deg,
		transparent 202deg 206deg,
		#22C55E 206deg 296deg,
		transparent 296deg 300deg,
		#EF4444 300deg 360deg
	);
	-webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 20rpx), #000 calc(100% - 20rpx));
	mask: radial-gradient(farthest-side, transparent calc(100% - 20rpx), #000 calc(100% - 20rpx));
}

/* Body */
.home-body {
	padding: 28rpx 32rpx 0;
}
.sec-title {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	color: #1D2129;
	margin-bottom: 20rpx;
}

/* 指标卡片网格 */
.metrics-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 36rpx;
}
.m-card {
	width: calc(50% - 10rpx);
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	box-sizing: border-box;
}
.m-card-hover { opacity: 0.85; }
.m-icon-circle {
	width: 68rpx;
	height: 68rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.m-emoji { font-size: 32rpx; }
.m-info {
	flex: 1;
	min-width: 0;
	.m-label {
		display: block;
		font-size: 24rpx;
		color: #86909C;
	}
	.m-val-line {
		display: flex;
		align-items: baseline;
		margin-top: 2rpx;
	}
	.m-val {
		font-size: 36rpx;
		font-weight: 700;
		color: #1D2129;
	}
	.m-unit {
		font-size: 20rpx;
		color: #C9CDD4;
		margin-left: 4rpx;
	}
	.m-status {
		display: block;
		font-size: 22rpx;
		font-weight: 600;
		margin-top: 2rpx;
	}
}

/* 建议列表 */
.advice-list { margin-bottom: 32rpx; }
.advice-item {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
	padding: 24rpx;
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.03);
}
.advice-hover { opacity: 0.85; }
.a-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	flex-shrink: 0;
}
.a-body {
	flex: 1;
	min-width: 0;
	.a-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #1D2129;
	}
	.a-desc {
		display: block;
		font-size: 24rpx;
		color: #86909C;
		margin-top: 4rpx;
		line-height: 1.4;
	}
}
</style>
