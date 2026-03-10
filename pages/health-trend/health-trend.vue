<template>
	<view class="page-wrapper">
		<CustomNavbar title="指标趋势" />
		<view class="content">
			<!-- 指标选择 -->
			<scroll-view scroll-x class="metric-scroll" :show-scrollbar="false">
				<view class="metric-pills">
					<view
						v-for="(m, i) in metricTypes"
						:key="i"
						class="pill"
						:class="{ active: selectedMetric === m.id }"
						@click="selectMetric(m.id)"
					>
						{{ m.name }}
					</view>
				</view>
			</scroll-view>

			<!-- 时间范围 -->
			<view class="time-range">
				<view
					v-for="(t, i) in timeRanges"
					:key="i"
					class="time-btn"
					:class="{ active: selectedRange === t.id }"
					@click="selectRange(t.id)"
				>
					{{ t.name }}
				</view>
			</view>

			<!-- 趋势图 -->
			<view class="chart-area">
				<canvas canvas-id="trendChart" id="trendChart" class="trend-canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
			</view>

			<!-- 参考范围 -->
			<view class="ref-box">
				<text class="ref-title">参考范围</text>
				<text class="ref-text">{{ currentMetricData.refText }}</text>
			</view>

			<!-- 统计 -->
			<view class="stats-row">
				<view class="stat-card">
					<text class="stat-value">{{ currentMetricData.stats.avg }}</text>
					<text class="stat-label">平均值</text>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ currentMetricData.stats.max }}</text>
					<text class="stat-label">最高值</text>
				</view>
				<view class="stat-card">
					<text class="stat-value">{{ currentMetricData.stats.min }}</text>
					<text class="stat-label">最低值</text>
				</view>
			</view>

			<!-- 趋势分析 -->
			<view class="trend-card">
				<text class="trend-title">趋势分析</text>
				<text class="trend-text">{{ currentMetricData.analysis }}</text>
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
			metricTypes: [
				{ id: 'bp', name: '血压' },
				{ id: 'hr', name: '心率' },
				{ id: 'glu', name: '血糖' },
				{ id: 'temp', name: '体温' },
				{ id: 'sleep', name: '睡眠' },
				{ id: 'breath', name: '呼吸' },
				{ id: 'weight', name: '体重' }
			],
			selectedMetric: 'bp',
			timeRanges: [
				{ id: 7, name: '7天' },
				{ id: 14, name: '14天' },
				{ id: 30, name: '30天' }
			],
			selectedRange: 7,
			canvasWidth: 320,
			canvasHeight: 200,
			allData: {
				bp: {
					refText: '收缩压90-140 mmHg，舒张压60-90 mmHg',
					stats: { avg: '132/84', max: '145/92', min: '118/72' },
					analysis: '近7天血压呈小幅波动趋势，建议保持规律作息，低盐饮食，适度运动。如持续偏高请及时就医。',
					data7: [128, 135, 130, 142, 132, 138, 145],
					data14: [122, 130, 126, 134, 128, 135, 130, 125, 138, 132, 142, 132, 138, 145],
					data30: [120, 125, 130, 128, 132, 126, 134, 130, 128, 135, 132, 130, 138, 125, 128, 140, 135, 130, 126, 132, 128, 135, 130, 125, 138, 132, 142, 132, 138, 145],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 140, warnLow: 90
				},
				hr: {
					refText: '静息心率60-100 次/分',
					stats: { avg: '72', max: '88', min: '62' },
					analysis: '心率整体平稳，偶有运动后升高属于正常现象。',
					data7: [68, 72, 65, 78, 70, 88, 72],
					data14: [70, 68, 72, 65, 78, 70, 68, 72, 74, 80, 70, 78, 88, 72],
					data30: [72, 68, 70, 65, 74, 68, 72, 70, 75, 68, 72, 66, 78, 70, 72, 68, 74, 70, 72, 68, 70, 68, 72, 74, 80, 70, 78, 70, 88, 72],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 100, warnLow: 60
				},
				glu: {
					refText: '空腹血糖3.9-6.1 mmol/L',
					stats: { avg: '5.6', max: '7.2', min: '4.8' },
					analysis: '血糖偶有偏高，注意控制碳水化合物摄入，规律进餐。',
					data7: [5.2, 5.8, 5.4, 6.5, 5.1, 7.2, 5.6],
					data14: [4.9, 5.2, 5.5, 5.8, 5.4, 5.0, 6.5, 5.2, 5.8, 5.1, 6.0, 5.4, 7.2, 5.6],
					data30: [5.0, 5.2, 4.8, 5.5, 5.3, 5.0, 5.8, 5.2, 5.4, 5.6, 5.1, 5.3, 6.0, 5.5, 5.2, 5.8, 5.4, 5.0, 5.6, 5.3, 5.2, 5.5, 5.8, 5.1, 6.0, 5.4, 6.5, 5.4, 7.2, 5.6],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 6.1, warnLow: 3.9
				},
				temp: {
					refText: '正常体温36.0-37.2 °C',
					stats: { avg: '36.5', max: '37.0', min: '36.1' },
					analysis: '体温在正常范围内波动，无异常情况。',
					data7: [36.3, 36.5, 36.4, 36.8, 36.2, 37.0, 36.5],
					data14: [36.2, 36.3, 36.5, 36.4, 36.6, 36.3, 36.8, 36.2, 36.5, 36.4, 36.6, 36.2, 37.0, 36.5],
					data30: [36.3, 36.2, 36.4, 36.5, 36.3, 36.4, 36.6, 36.3, 36.5, 36.2, 36.4, 36.5, 36.3, 36.6, 36.2, 36.5, 36.4, 36.3, 36.6, 36.2, 36.5, 36.3, 36.5, 36.4, 36.6, 36.2, 36.8, 36.4, 37.0, 36.5],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 37.2, warnLow: 36.0
				},
				sleep: {
					refText: '建议睡眠时长7-9小时',
					stats: { avg: '6.8', max: '8.5', min: '5.0' },
					analysis: '部分天数睡眠时长不足，建议固定作息时间，减少睡前使用电子设备。',
					data7: [6.5, 7.0, 5.5, 8.0, 6.0, 8.5, 7.0],
					data14: [7.0, 6.5, 7.5, 5.0, 6.0, 7.0, 6.5, 8.0, 5.5, 7.0, 6.0, 8.0, 8.5, 7.0],
					data30: [7.0, 6.5, 7.5, 5.5, 6.0, 7.0, 8.0, 6.5, 7.5, 5.0, 6.5, 7.0, 7.5, 6.0, 7.0, 8.0, 5.5, 7.0, 6.5, 7.5, 6.0, 7.0, 6.5, 8.0, 5.5, 7.0, 6.0, 8.0, 8.5, 7.0],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 9, warnLow: 7
				},
				breath: {
					refText: '正常呼吸频率12-20 次/分',
					stats: { avg: '16', max: '19', min: '14' },
					analysis: '呼吸频率在正常范围内，无需担忧。',
					data7: [16, 15, 17, 14, 18, 19, 16],
					data14: [15, 16, 14, 17, 16, 15, 18, 14, 16, 17, 15, 18, 19, 16],
					data30: [16, 15, 14, 17, 16, 15, 18, 16, 14, 15, 17, 16, 15, 14, 16, 18, 15, 16, 17, 14, 16, 15, 16, 14, 17, 15, 18, 15, 19, 16],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 20, warnLow: 12
				},
				weight: {
					refText: '根据BMI维持健康体重',
					stats: { avg: '68.2', max: '69.0', min: '67.5' },
					analysis: '体重波动较小，维持良好。建议继续保持当前饮食和运动习惯。',
					data7: [68.0, 68.5, 67.8, 68.2, 67.5, 69.0, 68.2],
					data14: [68.5, 68.0, 68.3, 67.8, 68.0, 68.5, 67.8, 68.2, 68.0, 67.5, 68.5, 68.2, 69.0, 68.2],
					data30: [69.0, 68.5, 68.8, 68.0, 68.3, 68.5, 67.8, 68.0, 68.5, 67.8, 68.2, 68.0, 68.5, 68.3, 68.0, 67.8, 68.5, 68.0, 68.2, 68.3, 67.8, 68.5, 68.0, 68.3, 68.0, 67.5, 68.5, 68.2, 69.0, 68.2],
					labels7: ['3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9'],
					warnHigh: 999, warnLow: 0
				}
			}
		}
	},
	computed: {
		currentMetricData() {
			return this.allData[this.selectedMetric] || this.allData.bp
		},
		chartData() {
			const d = this.currentMetricData
			if (this.selectedRange === 7) return d.data7
			if (this.selectedRange === 14) return d.data14
			return d.data30
		}
	},
	mounted() {
		const info = uni.getSystemInfoSync()
		this.canvasWidth = info.windowWidth - 64
		this.canvasHeight = 200
		this.$nextTick(() => { this.drawChart() })
	},
	methods: {
		selectMetric(id) {
			this.selectedMetric = id
			this.$nextTick(() => this.drawChart())
		},
		selectRange(id) {
			this.selectedRange = id
			this.$nextTick(() => this.drawChart())
		},
		drawChart() {
			const ctx = uni.createCanvasContext('trendChart', this)
			const w = this.canvasWidth
			const h = this.canvasHeight
			const data = this.chartData
			if (!data || data.length === 0) return

			const padTop = 25, padBottom = 30, padLeft = 40, padRight = 15
			const chartW = w - padLeft - padRight
			const chartH = h - padTop - padBottom

			const min = Math.min(...data)
			const max = Math.max(...data)
			const range = max - min || 1
			const yMin = min - range * 0.15
			const yMax = max + range * 0.15
			const yRange = yMax - yMin

			ctx.clearRect(0, 0, w, h)

			// 警戒区域
			const md = this.currentMetricData
			if (md.warnHigh < 999) {
				const warnY = padTop + chartH * (1 - (md.warnHigh - yMin) / yRange)
				if (warnY > padTop && warnY < h - padBottom) {
					ctx.setStrokeStyle('rgba(239,68,68,0.3)')
					ctx.setLineDash([4, 4])
					ctx.beginPath()
					ctx.moveTo(padLeft, warnY)
					ctx.lineTo(w - padRight, warnY)
					ctx.stroke()
					ctx.setLineDash([])
				}
			}

			// Y轴刻度
			ctx.setFontSize(10)
			ctx.setFillStyle('#86909C')
			const ySteps = 4
			for (let i = 0; i <= ySteps; i++) {
				const val = yMin + (yRange / ySteps) * i
				const y = padTop + chartH * (1 - i / ySteps)
				ctx.fillText(val.toFixed(Number.isInteger(val) ? 0 : 1), 2, y + 3)
				ctx.setStrokeStyle('#f0f0f0')
				ctx.beginPath()
				ctx.moveTo(padLeft, y)
				ctx.lineTo(w - padRight, y)
				ctx.stroke()
			}

			// X轴标签
			const step = chartW / (data.length - 1 || 1)
			const showEvery = data.length <= 7 ? 1 : (data.length <= 14 ? 2 : 5)
			for (let i = 0; i < data.length; i++) {
				if (i % showEvery === 0 || i === data.length - 1) {
					const x = padLeft + i * step
					let label = ''
					if (data.length <= 7 && md.labels7 && md.labels7[i]) {
						label = md.labels7[i]
					} else {
						label = '' + (i + 1)
					}
					ctx.setFillStyle('#86909C')
					ctx.setFontSize(9)
					ctx.fillText(label, x - 10, h - 8)
				}
			}

			// 渐变填充
			const grd = ctx.createLinearGradient(0, padTop, 0, h - padBottom)
			grd.addColorStop(0, 'rgba(74,144,217,0.25)')
			grd.addColorStop(1, 'rgba(74,144,217,0)')
			ctx.beginPath()
			ctx.moveTo(padLeft, h - padBottom)
			for (let i = 0; i < data.length; i++) {
				const x = padLeft + i * step
				const y = padTop + chartH * (1 - (data[i] - yMin) / yRange)
				ctx.lineTo(x, y)
			}
			ctx.lineTo(padLeft + (data.length - 1) * step, h - padBottom)
			ctx.closePath()
			ctx.setFillStyle(grd)
			ctx.fill()

			// 折线
			ctx.setStrokeStyle('#4A90D9')
			ctx.setLineWidth(2)
			ctx.beginPath()
			for (let i = 0; i < data.length; i++) {
				const x = padLeft + i * step
				const y = padTop + chartH * (1 - (data[i] - yMin) / yRange)
				if (i === 0) ctx.moveTo(x, y)
				else ctx.lineTo(x, y)
			}
			ctx.stroke()

			// 数据点
			for (let i = 0; i < data.length; i++) {
				const x = padLeft + i * step
				const y = padTop + chartH * (1 - (data[i] - yMin) / yRange)
				const isWarn = data[i] > md.warnHigh || data[i] < md.warnLow
				ctx.setFillStyle('#fff')
				ctx.beginPath()
				ctx.arc(x, y, 4, 0, 2 * Math.PI)
				ctx.fill()
				ctx.setStrokeStyle(isWarn ? '#EF4444' : '#4A90D9')
				ctx.setLineWidth(2)
				ctx.beginPath()
				ctx.arc(x, y, 4, 0, 2 * Math.PI)
				ctx.stroke()

				if (isWarn) {
					ctx.setFillStyle(isWarn ? '#EF4444' : '#4A90D9')
					ctx.setFontSize(9)
					ctx.fillText(data[i].toString(), x - 8, y - 8)
				}
			}

			ctx.draw()
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
.content { padding: 24rpx 32rpx; }
.metric-scroll { white-space: nowrap; margin-bottom: 24rpx; }
.metric-pills { display: inline-flex; gap: 20rpx; padding: 8rpx 0; }
.pill {
	display: inline-flex; align-items: center;
	padding: 16rpx 32rpx; background: #fff;
	border-radius: 32rpx; font-size: 26rpx;
	color: $uni-text-color-secondary;
	border: 2rpx solid $uni-border-color; flex-shrink: 0;
}
.pill.active { background: $theme-primary; color: #fff; border-color: $theme-primary; }
.time-range { display: flex; gap: 20rpx; margin-bottom: 24rpx; }
.time-btn {
	flex: 1; height: 64rpx; display: flex;
	align-items: center; justify-content: center;
	background: #fff; border-radius: 12rpx;
	font-size: 26rpx; color: $uni-text-color-secondary;
	border: 2rpx solid $uni-border-color;
}
.time-btn.active { background: $theme-primary-bg; color: $theme-primary; border-color: $theme-primary; }

.chart-area {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx 16rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.trend-canvas { width: 100%; }

.ref-box {
	background: $theme-primary-bg;
	border-radius: 12rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 24rpx;
	border-left: 6rpx solid $theme-primary;
}
.ref-title { display: block; font-size: 26rpx; font-weight: 600; color: $theme-primary; margin-bottom: 8rpx; }
.ref-text { font-size: 26rpx; color: $uni-text-color-secondary; }

.stats-row { display: flex; gap: 20rpx; margin-bottom: 24rpx; }
.stat-card {
	flex: 1; background: #fff; border-radius: 12rpx;
	padding: 28rpx; text-align: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.stat-value { display: block; font-size: 36rpx; font-weight: 700; color: $theme-primary; margin-bottom: 8rpx; }
.stat-label { font-size: 24rpx; color: $uni-text-color-secondary; }

.trend-card {
	background: #fff; border-radius: 12rpx;
	padding: 32rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.trend-title { display: block; font-size: 30rpx; font-weight: 600; color: $uni-text-color; margin-bottom: 16rpx; }
.trend-text { font-size: 28rpx; color: $uni-text-color-secondary; line-height: 1.6; }
</style>
