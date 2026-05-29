<template>
	<view class="page-wrapper">
		<view class="home-header">
			<view class="greeting-row">
				<view class="greeting-text">
					<text class="greeting-title">{{ greetingText }}，{{ displayName }}</text>
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
					<text class="score-title">{{ scoreTitle }}</text>
					<view class="score-main">
						<text class="score-num">{{ healthScore }}</text>
						<text class="score-unit">健康评分</text>
					</view>
					<text class="score-desc">{{ scoreDesc }}</text>
					<view class="stats-row">
						<view class="stat-col">
							<text class="stat-val">{{ bodyStatus }}</text>
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
					:url="'/pages/health-detail/health-detail?type=' + m.type"
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
import { getUserInfo, isLoggedIn } from '@/utils/auth'
import { getUserBasicInfo } from '@/api/auth'
import { getHealthScore, getHealthMetrics, getHealthAdvice } from '@/api/health'

export default {
	components: { CustomTabbar },
	data() {
		return {
			showInputMenu: false,
			dateText: '',
			displayName: '',
			healthScore: '--',
			bodyStatus: '--',
			metrics: [
				{ type: 'temperature', icon: '🌡', iconBg: '#FEF9C3', label: '体温', value: '--', unit: '°C', status: '暂无数据', statusColor: '#9CA3AF' },
				{ type: 'bp', icon: '❤', iconBg: '#ECFDF5', label: '血压', value: '--', unit: '/-- mmHg', status: '暂无数据', statusColor: '#9CA3AF' },
				{ type: 'bloodSugar', icon: '💧', iconBg: '#EFF6FF', label: '血糖', value: '--', unit: 'mmol/L', status: '暂无数据', statusColor: '#9CA3AF' },
				{ type: 'bmi', icon: '⚖', iconBg: '#F3E8FF', label: 'BMI', value: '--', unit: 'kg/m²', status: '暂无数据', statusColor: '#9CA3AF' },
				{ type: 'heartRate', icon: '💗', iconBg: '#FEF2F2', label: '心率', value: '--', unit: 'BPM', status: '暂无数据', statusColor: '#9CA3AF' },
				{ type: 'sleep', icon: '🌙', iconBg: '#EDE9FE', label: '睡眠时长', value: '--', unit: '小时', status: '暂无数据', statusColor: '#9CA3AF' }
			],
			adviceList: [
				{ icon: '📝', iconBg: '#EFF6FF', title: '开始记录', desc: '录入您的健康数据，获取个性化健康建议' },
				{ icon: '🏃', iconBg: '#ECFDF5', title: '保持运动', desc: '建议每天进行30分钟中等强度有氧运动' },
				{ icon: '🥗', iconBg: '#FEF9C3', title: '均衡饮食', desc: '合理膳食，多食新鲜蔬果，保持营养均衡' }
			]
		}
	},
	computed: {
		greetingText() {
			const hour = new Date().getHours()
			if (hour < 6) return '夜深了'
			if (hour < 9) return '早上好'
			if (hour < 12) return '上午好'
			if (hour < 14) return '中午好'
			if (hour < 18) return '下午好'
			return '晚上好'
		},
		scoreTitle() {
			if (this.healthScore === '--' || this.healthScore === null || this.healthScore === undefined) return '开始记录健康数据吧'
			const score = Number(this.healthScore)
			if (isNaN(score)) return '开始记录健康数据吧'
			if (score >= 80) return '整体健康状况良好'
			if (score >= 60) return '健康状况一般，请注意'
			return '健康状况需关注'
		},
		scoreDesc() {
			if (this.healthScore === '--') return '录入健康数据后，系统将为您生成健康评分'
			return '坚持记录，保持规律的生活习惯'
		}
	},
	onShow() {
		uni.hideTabBar()
		this.loadUserName()
		this.loadHealthData()
		this.loadAdvice()
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
		async loadUserName() {
			if (!isLoggedIn()) {
				this.displayName = '游客'
				return
			}
			const local = getUserInfo()
			if (local && local.nickname) {
				this.displayName = local.nickname
			}
			try {
				const res = await getUserBasicInfo()
				if (res.data && res.data.nickname) {
					this.displayName = res.data.nickname
				} else if (res.data && res.data.account) {
					this.displayName = res.data.account
				}
			} catch (e) {
				if (!this.displayName) this.displayName = '用户'
			}
		},
		toggleInputMenu() {
			this.showInputMenu = !this.showInputMenu
		},
		async loadHealthData() {
			if (!isLoggedIn()) return
			try {
				const [scoreRes, metricsRes] = await Promise.all([getHealthScore(), getHealthMetrics()])
				if (scoreRes.data) {
					this.healthScore = scoreRes.data.score ?? '--'
					this.bodyStatus = scoreRes.data.bodyStatus ?? '--'
				}
				if (metricsRes.data && Array.isArray(metricsRes.data)) {
					const iconMap = { temperature: '🌡', bp: '❤', bloodSugar: '💧', bmi: '⚖', heartRate: '💗', sleep: '🌙' }
					const iconBgMap = { temperature: '#FEF9C3', bp: '#ECFDF5', bloodSugar: '#EFF6FF', bmi: '#F3E8FF', heartRate: '#FEF2F2', sleep: '#EDE9FE' }
					const statusColorMap = { normal: '#059669', warn: '#D97706', danger: '#DC2626' }
					this.metrics = metricsRes.data.map(m => ({
						type: m.type,
						icon: iconMap[m.type] || '📊',
						iconBg: iconBgMap[m.type] || '#F5F7FA',
						label: m.label || m.type,
						value: m.value ?? '--',
						unit: m.type === 'bp' ? 'mmHg' : (m.unit || ''),
						status: m.statusText || '暂无数据',
						statusColor: statusColorMap[m.status] || '#9CA3AF'
					}))
				}
			} catch (e) {
				// 未登录或接口失败时保持默认值
			}
		},
		async loadAdvice() {
			if (!isLoggedIn()) return
			try {
				const res = await getHealthAdvice()
				if (res?.data?.suggestions?.length) {
					const iconMap = { diet: '🥗', exercise: '🏃', lifestyle: '📝', medical: '🏥' }
					const iconBgMap = { diet: '#FEF9C3', exercise: '#ECFDF5', lifestyle: '#EFF6FF', medical: '#FEF2F2' }
					this.adviceList = res.data.suggestions.map(s => ({
						icon: iconMap[s.category] || '💡',
						iconBg: iconBgMap[s.category] || '#F5F7FA',
						title: s.title || (s.category === 'diet' ? '饮食' : s.category === 'exercise' ? '运动' : s.category === 'lifestyle' ? '生活' : '就医'),
						desc: (s.content || '').substring(0, 80) + ((s.content || '').length > 80 ? '...' : '')
					}))
				}
			} catch (e) {
				// 保持默认建议
			}
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
	overflow: hidden;
	.m-label {
		display: block;
		font-size: 24rpx;
		color: #86909C;
	}
	.m-val-line {
		display: flex;
		align-items: baseline;
		margin-top: 2rpx;
		min-width: 0;
	}
	.m-val {
		font-size: 32rpx;
		font-weight: 700;
		color: #1D2129;
		flex-shrink: 0;
	}
	.m-unit {
		font-size: 20rpx;
		color: #C9CDD4;
		margin-left: 4rpx;
		flex-shrink: 0;
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
