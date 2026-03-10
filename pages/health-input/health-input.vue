<template>
	<view class="page-wrapper">
		<CustomNavbar title="数据录入" />
		<TabSwitch :tabs="['手动录入', '语音录入']" v-model="tabIndex" />

		<!-- 手动录入 -->
		<view v-show="tabIndex === 0" class="manual-panel">
			<text class="sec-label">选择指标类型</text>
			<view class="metric-grid">
				<view
					v-for="(m, i) in metricTypes"
					:key="i"
					class="metric-opt"
					:class="{ active: selectedMetric === i }"
					@click="selectedMetric = i"
				>
					<text class="mt-icon">{{ m.icon }}</text>
					<text class="mt-name">{{ m.name }}</text>
				</view>
			</view>

			<view class="form-area">
				<view class="input-group">
					<text class="input-label">数值</text>
					<view v-if="currentMetric.dual" class="dual-input">
						<input type="number" v-model="bpHigh" :placeholder="currentMetric.ph1" class="input-field" />
						<text class="separator">/</text>
						<input type="number" v-model="bpLow" :placeholder="currentMetric.ph2" class="input-field" />
					</view>
					<input v-else type="digit" v-model="singleValue" :placeholder="'请输入' + currentMetric.name" class="input-field" />
					<text class="unit-hint">单位：{{ currentMetric.unit }}</text>
				</view>

				<view class="input-group">
					<text class="input-label">测量时间</text>
					<picker mode="date" :value="recordDate" @change="recordDate = $event.detail.value">
						<view class="picker-field">
							<text>{{ recordDate }}</text>
						</view>
					</picker>
					<picker mode="time" :value="recordTime" @change="recordTime = $event.detail.value" style="margin-top: 16rpx;">
						<view class="picker-field">
							<text>{{ recordTime }}</text>
						</view>
					</picker>
				</view>

				<view class="input-group">
					<text class="input-label">备注</text>
					<textarea v-model="notes" placeholder="可记录测量状态，如：饭后、运动后等" placeholder-class="ph" class="notes-area" />
				</view>

				<view class="btn-submit" @click="onSubmit">
					<text>✓ 确认提交</text>
				</view>
			</view>
		</view>

		<!-- 语音录入 -->
		<view v-show="tabIndex === 1" class="voice-panel">
			<view class="voice-center">
				<view class="mic-btn" :class="{ recording: isRecording }" @click="toggleRecording">
					<text class="mic-icon">🎤</text>
				</view>
				<text class="voice-hint">{{ isRecording ? '正在录音...' : '点击按钮开始语音记录' }}</text>

				<view class="wave-bars" v-if="isRecording">
					<view v-for="i in 7" :key="i" class="wave-bar" :style="{ animationDelay: (i * 0.1) + 's' }"></view>
				</view>
			</view>

			<!-- 识别结果始终显示区域 -->
			<view class="voice-result-card">
				<text class="vr-label">🔊 识别结果</text>
				<text v-if="voiceResult" class="vr-text">"{{ voiceResult }}"</text>
				<text v-else class="vr-empty">暂无识别结果，请点击上方按钮开始语音记录</text>
			</view>

			<!-- AI提取指标始终显示区域 -->
			<view class="extract-section">
				<text class="sec-label">AI 自动提取指标</text>
				<view v-if="extractedTags.length > 0" class="tag-list">
					<view v-for="(t, i) in extractedTags" :key="i" class="ext-tag" :class="t.type">
						<text>{{ t.icon }} {{ t.label }}</text>
					</view>
				</view>
				<view v-else class="extract-empty">
					<text class="extract-empty-text">暂无提取结果</text>
				</view>

				<view v-if="extractedTags.length > 0" class="warn-card">
					<text class="warn-icon">ℹ</text>
					<text class="warn-text">请确认AI提取的数据是否准确，确认后点击提交</text>
				</view>
			</view>

			<view class="btn-submit voice-submit" :class="{ disabled: !voiceResult }" @click="onVoiceSubmit">
				<text>✓ 确认并提交</text>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'
import TabSwitch from '@/components/tab-switch.vue'

export default {
	components: { CustomNavbar, TabSwitch },
	data() {
		return {
			tabIndex: 0,
			metricTypes: [
				{ name: '血压', icon: '💓', unit: 'mmHg', dual: true, ph1: '收缩压', ph2: '舒张压' },
				{ name: '心率', icon: '❤', unit: '次/分', dual: false },
				{ name: '体温', icon: '🌡', unit: '°C', dual: false },
				{ name: '血糖', icon: '💧', unit: 'mmol/L', dual: false },
				{ name: '睡眠', icon: '🌙', unit: '小时', dual: false },
				{ name: '呼吸', icon: '🫁', unit: '次/分', dual: false },
				{ name: '体重', icon: '⚖', unit: 'kg', dual: false },
				{ name: '身高', icon: '📏', unit: 'cm', dual: false }
			],
			selectedMetric: 0,
			bpHigh: '',
			bpLow: '',
			singleValue: '',
			recordDate: '',
			recordTime: '',
			notes: '',
			isRecording: false,
			voiceResult: '',
			extractedTags: []
		}
	},
	computed: {
		currentMetric() {
			return this.metricTypes[this.selectedMetric]
		}
	},
	onLoad(options) {
		if (options && options.tab === '1') {
			this.tabIndex = 1
		}
		const d = new Date()
		this.recordDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
		this.recordTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
	},
	methods: {
		toggleRecording() {
			this.isRecording = !this.isRecording
			if (this.isRecording) {
				this.voiceResult = ''
				this.extractedTags = []
				setTimeout(() => {
					this.isRecording = false
					this.voiceResult = '今天早上量了血压，收缩压145，舒张压92，心率72次，感觉有点头晕'
					this.extractedTags = [
						{ icon: '💓', label: '血压: 145/92 mmHg', type: 'normal' },
						{ icon: '❤', label: '心率: 72 次/分', type: 'normal' },
						{ icon: '⚠', label: '症状: 头晕', type: 'danger' }
					]
				}, 3000)
			}
		},
		onSubmit() {
			uni.showToast({ title: '提交成功', icon: 'success' })
		},
		onVoiceSubmit() {
			if (!this.voiceResult) return
			uni.showToast({ title: '已确认录入', icon: 'success' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper {
	min-height: 100vh;
	background: #e2eef0;
	padding-bottom: 48rpx;
}

.sec-label {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #1D2129;
	padding: 16rpx 0 20rpx;
}

.manual-panel { padding: 0 32rpx; }

.metric-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-bottom: 28rpx;
}
.metric-opt {
	width: calc(33.33% - 12rpx);
	padding: 20rpx 12rpx;
	border: 2rpx solid #E5E6EB;
	border-radius: 16rpx;
	text-align: center;
	background: #fff;
	box-sizing: border-box;
	&.active {
		border-color: #4A90D9;
		background: rgba(74,144,217,0.08);
	}
}
.mt-icon { display: block; font-size: 36rpx; margin-bottom: 6rpx; }
.mt-name { font-size: 24rpx; color: #4E5969; }
.metric-opt.active .mt-name { color: #4A90D9; font-weight: 500; }

.form-area {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.input-group { margin-bottom: 28rpx; }
.input-label {
	display: block;
	font-size: 26rpx;
	color: #4E5969;
	margin-bottom: 12rpx;
	font-weight: 500;
}
.input-field {
	height: 80rpx;
	background: #F5F7FA;
	border: 2rpx solid #E5E6EB;
	border-radius: 14rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #1D2129;
	width: 100%;
	box-sizing: border-box;
}
.dual-input {
	display: flex;
	align-items: center;
	gap: 16rpx;
	.input-field { flex: 1; }
}
.separator { font-size: 36rpx; color: #86909C; font-weight: 700; }
.unit-hint { display: block; font-size: 22rpx; color: #86909C; margin-top: 8rpx; }
.picker-field {
	height: 80rpx;
	background: #F5F7FA;
	border: 2rpx solid #E5E6EB;
	border-radius: 14rpx;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #1D2129;
}
.notes-area {
	width: 100%;
	min-height: 140rpx;
	background: #F5F7FA;
	border: 2rpx solid #E5E6EB;
	border-radius: 14rpx;
	padding: 20rpx 24rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}
.ph { color: #C9CDD4; }
.btn-submit {
	height: 88rpx;
	background: #4A90D9;
	color: #fff;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	font-weight: 600;
	margin-top: 32rpx;
}
.btn-submit.disabled {
	background: #C9CDD4;
	pointer-events: none;
}

/* 语音录入 */
.voice-panel { padding: 0 32rpx; }
.voice-center {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 48rpx 0 32rpx;
}
.mic-btn {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #8B5CF6, #7C3AED);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 12rpx 32rpx rgba(124,58,237,0.3);
	margin-bottom: 24rpx;
}
.mic-btn.recording {
	box-shadow: 0 0 0 20rpx rgba(124,58,237,0.1), 0 0 0 40rpx rgba(124,58,237,0.05);
}
.mic-icon { font-size: 72rpx; }
.voice-hint { font-size: 26rpx; color: #86909C; margin-bottom: 24rpx; }

.wave-bars {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	height: 64rpx;
}
.wave-bar {
	width: 8rpx;
	height: 24rpx;
	border-radius: 4rpx;
	background: #8B5CF6;
	animation: waveAnim 0.6s ease-in-out infinite alternate;
}
@keyframes waveAnim {
	from { height: 16rpx; }
	to { height: 56rpx; }
}

.voice-result-card {
	background: #F5F7FA;
	border: 2rpx dashed #E5E6EB;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	min-height: 120rpx;
}
.vr-label {
	display: block;
	font-size: 24rpx;
	color: #86909C;
	margin-bottom: 12rpx;
}
.vr-text {
	font-size: 28rpx;
	color: #1D2129;
	line-height: 1.6;
}
.vr-empty {
	font-size: 26rpx;
	color: #C9CDD4;
	line-height: 1.6;
}

.extract-section { margin-bottom: 24rpx; }
.extract-empty {
	background: #F5F7FA;
	border-radius: 16rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.extract-empty-text { font-size: 26rpx; color: #C9CDD4; }

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 20rpx;
}
.ext-tag {
	display: flex;
	align-items: center;
	padding: 12rpx 20rpx;
	background: rgba(74,144,217,0.1);
	color: #4A90D9;
	border-radius: 14rpx;
	font-size: 26rpx;
	font-weight: 500;
	&.danger {
		background: #FEF2F2;
		color: #EF4444;
	}
}
.warn-card {
	display: flex;
	align-items: center;
	gap: 12rpx;
	background: #FFFBEB;
	border: 2rpx solid #FDE68A;
	border-radius: 14rpx;
	padding: 20rpx;
}
.warn-icon { font-size: 28rpx; color: #F59E0B; }
.warn-text { font-size: 26rpx; color: #92400E; flex: 1; }

.voice-submit { margin: 0; }
</style>
