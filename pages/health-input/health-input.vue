<template>
	<view class="page-wrapper">
		<CustomNavbar title="数据录入" />
		<TabSwitch :tabs="['手动录入', '语音录入']" v-model="tabIndex" />

		<!-- 手动录入：填写所有指标后统一提交 -->
		<view v-show="tabIndex === 0" class="manual-panel">
			<text class="sec-label">填写健康指标（可填写部分或全部）</text>
			<view class="form-area">
				<view v-for="m in metricConfig" :key="m.key" class="metric-input-row">
					<view class="metric-label">
						<text class="metric-icon">{{ m.icon }}</text>
						<text class="metric-name">{{ m.name }}</text>
						<text class="metric-unit">({{ m.unit }})</text>
					</view>
					<view v-if="m.dual" class="dual-input">
						<input type="number" v-model="formData.bp.high" :placeholder="m.ph1" class="input-field" />
						<text class="separator">/</text>
						<input type="number" v-model="formData.bp.low" :placeholder="m.ph2" class="input-field" />
					</view>
					<input v-else type="digit" v-model="formData[m.key]" :placeholder="'请输入' + m.name" class="input-field" />
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
				<text class="voice-hint">{{ voiceHint }}</text>

				<view class="wave-bars" v-if="isRecording">
					<view v-for="i in 7" :key="i" class="wave-bar" :style="{ animationDelay: (i * 0.1) + 's' }"></view>
				</view>

				<text v-if="recordDuration > 0 && !isRecording" class="duration-text">录音时长：{{ recordDuration }}s</text>
			</view>

			<!-- 识别结果 -->
			<view class="voice-result-card">
				<text class="vr-label">🔊 识别结果</text>
				<text v-if="recognizing" class="vr-text">正在识别，请稍候...</text>
				<text v-else-if="voiceResult" class="vr-text">"{{ voiceResult }}"</text>
				<text v-else class="vr-empty">暂无识别结果，请点击上方按钮开始语音记录</text>
			</view>

			<!-- AI提取指标 -->
			<view class="extract-section">
				<text class="sec-label">AI 自动提取指标</text>
				<view v-if="extractedTags.length > 0" class="tag-list">
					<view v-for="(t, i) in extractedTags" :key="i" class="ext-tag" :class="t.cls || ''">
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

			<view class="btn-submit voice-submit" :class="{ disabled: !voiceResult || extractedTags.length === 0 }" @click="onVoiceSubmit">
				<text>✓ 确认并提交</text>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'
import TabSwitch from '@/components/tab-switch.vue'
import { submitBatchInput, submitVoiceInput, extractVoiceByDify } from '@/api/health'
import { recognizeSpeech } from '@/api/speech'

const ICON_BY_TYPE = {
	bp: '💓', heartRate: '❤', temperature: '🌡', bloodSugar: '💧',
	sleep: '🌙', breath: '🫁', weight: '⚖', height: '📏'
}

const METRIC_CONFIG = [
	{ key: 'bp', name: '血压', icon: '💓', unit: 'mmHg', dual: true, ph1: '收缩压', ph2: '舒张压' },
	{ key: 'heartRate', name: '心率', icon: '❤', unit: '次/分', dual: false },
	{ key: 'temperature', name: '体温', icon: '🌡', unit: '°C', dual: false },
	{ key: 'bloodSugar', name: '血糖', icon: '💧', unit: 'mmol/L', dual: false },
	{ key: 'sleep', name: '睡眠', icon: '🌙', unit: '小时', dual: false },
	{ key: 'breath', name: '呼吸', icon: '🫁', unit: '次/分', dual: false },
	{ key: 'weight', name: '体重', icon: '⚖', unit: 'kg', dual: false },
	{ key: 'height', name: '身高', icon: '📏', unit: 'cm', dual: false }
]

export default {
	components: { CustomNavbar, TabSwitch },
	data() {
		return {
			tabIndex: 0,
			metricConfig: METRIC_CONFIG,
			formData: {
				bp: { high: '', low: '' },
				heartRate: '',
				temperature: '',
				bloodSugar: '',
				sleep: '',
				breath: '',
				weight: '',
				height: ''
			},
			recordDate: '',
			recordTime: '',
			notes: '',
			// 语音录入
			isRecording: false,
			recognizing: false,
			voiceResult: '',
			extractedTags: [],
			recordDuration: 0,
			recorderManager: null,
			recordTimer: null
		}
	},
	computed: {
		voiceHint() {
			if (this.isRecording) return '正在录音，再次点击停止...'
			if (this.recognizing) return '正在识别中，请稍候...'
			return '点击按钮开始语音记录（最长60秒）'
		}
	},
	onLoad(options) {
		if (options && options.tab === '1') {
			this.tabIndex = 1
		}
		const d = new Date()
		this.recordDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
		this.recordTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
		this.initRecorder()
	},
	onUnload() {
		this.clearRecordTimer()
		if (this.recorderManager && this.isRecording) {
			this.recorderManager.stop()
		}
	},
	methods: {
		initRecorder() {
			const rm = uni.getRecorderManager()

			rm.onStart(() => {
				this.isRecording = true
				this.recordDuration = 0
				this.startRecordTimer()
			})

			rm.onStop((res) => {
				this.isRecording = false
				this.clearRecordTimer()
				console.log('[Recorder] onStop, tempFilePath:', res.tempFilePath, 'duration:', res.duration, 'fileSize:', res.fileSize)
				if (res.tempFilePath) {
					if (res.duration && res.duration < 1000) {
						uni.showToast({ title: '录音时间过短，请至少录制1秒', icon: 'none' })
						return
					}
					this.doRecognize(res.tempFilePath)
				} else {
					uni.showToast({ title: '录音文件获取失败，请重试', icon: 'none' })
				}
			})

			rm.onError((err) => {
				this.isRecording = false
				this.clearRecordTimer()
				console.error('[Recorder] onError:', JSON.stringify(err))
				let msg = '录音失败'
				if (err.errMsg) {
					if (err.errMsg.indexOf('auth') !== -1 || err.errMsg.indexOf('permission') !== -1 || err.errMsg.indexOf('deny') !== -1) {
						msg = '没有录音权限，请在系统设置中开启'
					} else {
						msg = '录音失败: ' + err.errMsg
					}
				}
				uni.showToast({ title: msg, icon: 'none', duration: 3000 })
			})

			this.recorderManager = rm
		},

		startRecordTimer() {
			this.recordTimer = setInterval(() => {
				this.recordDuration++
				if (this.recordDuration >= 60) {
					this.recorderManager.stop()
				}
			}, 1000)
		},

		clearRecordTimer() {
			if (this.recordTimer) {
				clearInterval(this.recordTimer)
				this.recordTimer = null
			}
		},

		async toggleRecording() {
			if (this.recognizing) return

			if (this.isRecording) {
				this.recorderManager.stop()
			} else {
				const hasPermission = await this.checkRecordPermission()
				if (!hasPermission) return

				this.voiceResult = ''
				this.extractedTags = []
				this.recordDuration = 0

				this.recorderManager.start({
					format: 'wav',
					sampleRate: 16000,
					numberOfChannels: 1,
					encodeBitRate: 256000,
					frameSize: 16000,
					duration: 60000
				})
			}
		},

		checkRecordPermission() {
			return new Promise((resolve) => {
				// #ifdef APP-PLUS
				const os = uni.getSystemInfoSync().platform
				if (os === 'android') {
					const main = plus.android.runtimeMainActivity()
					const pkgName = main.getPackageName()
					const ContextCompat = plus.android.importClass('androidx.core.content.ContextCompat')
					const Manifest = plus.android.importClass('android.Manifest')
					const granted = ContextCompat.checkSelfPermission(main, 'android.permission.RECORD_AUDIO')
					if (granted !== 0) {
						const ActivityCompat = plus.android.importClass('androidx.core.app.ActivityCompat')
						ActivityCompat.requestPermissions(main, ['android.permission.RECORD_AUDIO'], 1001)
						setTimeout(() => {
							const result = ContextCompat.checkSelfPermission(main, 'android.permission.RECORD_AUDIO')
							if (result !== 0) {
								uni.showModal({
									title: '权限提示',
									content: '语音录入需要麦克风权限，请在系统设置中允许本应用录音',
									showCancel: false
								})
								resolve(false)
							} else {
								resolve(true)
							}
						}, 2000)
						return
					}
					resolve(true)
				} else if (os === 'ios') {
					const avAuth = plus.ios.importClass('AVCaptureDevice')
					const status = avAuth.authorizationStatusForMediaType('soun')
					if (status === 3) {
						resolve(true)
					} else if (status === 0) {
						avAuth.requestAccessForMediaType('soun', (granted) => {
							resolve(!!granted)
						})
					} else {
						uni.showModal({
							title: '权限提示',
							content: '语音录入需要麦克风权限，请在系统设置中允许本应用录音',
							showCancel: false
						})
						resolve(false)
					}
				} else {
					resolve(true)
				}
				// #endif
				// #ifndef APP-PLUS
				uni.authorize({
					scope: 'scope.record',
					success: () => resolve(true),
					fail: () => {
						uni.showModal({
							title: '权限提示',
							content: '语音录入需要麦克风权限，请在设置中允许',
							showCancel: false
						})
						resolve(false)
					}
				})
				// #endif
			})
		},

		async doRecognize(filePath) {
			this.recognizing = true
			try {
				const text = await recognizeSpeech(filePath)
				this.voiceResult = text
				if (!text) {
					uni.showToast({ title: '未识别到语音内容，请重试', icon: 'none' })
					return
				}
				try {
					const res = await extractVoiceByDify({
						voiceResult: text,
						recordDate: this.recordDate,
						recordTime: this.recordTime
					})
					// request 成功时返回 { code, data, message }，指标数组在 data 里
					const list = res && Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : null)
					this.applyDifyExtracted(list)
				} catch (e) {
					this.parseVoiceResult(text)
				}
			} catch (err) {
				const msg = typeof err === 'string' ? err : (err.message || '语音识别出错')
				uni.showToast({ title: msg, icon: 'none' })
			} finally {
				this.recognizing = false
			}
		},

		applyDifyExtracted(list) {
			if (!list || !list.length) {
				this.parseVoiceResult(this.voiceResult)
				return
			}
			this.extractedTags = list.map((r) => {
				let label = r.label || r.type
				// 血压 value 为 { high, low } 时，补全易读 label（Dify 可能只给「血压 88 mmHg」）
				if (r.type === 'bp' && r.value && typeof r.value === 'object') {
					const h = r.value.high
					const l = r.value.low
					if (h != null && l != null && (!label || !String(label).includes('/'))) {
						label = `血压 ${h}/${l} mmHg`
					}
				}
				return {
					type: r.type,
					value: r.value,
					label,
					icon: ICON_BY_TYPE[r.type] || '📋',
					cls: ''
				}
			})
		},

		parseVoiceResult(text) {
			const tags = []
			const normalized = text.replace(/[，。！？、；：""''（）【】]/g, ' ')

			// 血压：120/80 或 "收缩压120 舒张压80" 或 "高压120低压80"
			const bpMatch = normalized.match(/(\d{2,3})\s*[\/\\]\s*(\d{2,3})/)
				|| normalized.match(/[收高]缩?压\s*[是为]?\s*(\d{2,3})\s*[，,]?\s*[舒低]张?压\s*[是为]?\s*(\d{2,3})/)
				|| normalized.match(/血压\s*[是为]?\s*(\d{2,3})\s*[\/\\,，\s]\s*(\d{2,3})/)
			if (bpMatch) {
				const high = parseFloat(bpMatch[1])
				const low = parseFloat(bpMatch[2])
				if (high > 50 && high < 250 && low > 30 && low < 150) {
					tags.push({
						type: 'bp', icon: '💓',
						label: `血压 ${high}/${low} mmHg`,
						value: { high, low }
					})
				}
			}

			// 心率：心率75、心跳80次、心率每分钟80
			const hrMatch = normalized.match(/心[率跳]\s*[是为]?\s*[每每]?\s*[分]?\s*[钟]?\s*(\d{2,3})/)
			if (hrMatch) {
				const v = parseFloat(hrMatch[1])
				if (v > 30 && v < 220) {
					tags.push({ type: 'heartRate', icon: '❤', label: `心率 ${v} 次/分`, value: v })
				}
			}

			// 体温：体温36.5、发烧38度、三十六度五
			const tempMatch = normalized.match(/体温\s*[是为]?\s*([\d]+\.?\d*)/)
				|| normalized.match(/([\d]+\.?\d*)\s*[度℃]/)
			if (tempMatch) {
				const v = parseFloat(tempMatch[1])
				if (v > 34 && v < 43) {
					tags.push({ type: 'temperature', icon: '🌡', label: `体温 ${v} °C`, value: v })
				}
			}

			// 血糖：血糖5.6、空腹血糖6.1
			const bgMatch = normalized.match(/血糖\s*[是为]?\s*([\d]+\.?\d*)/)
			if (bgMatch) {
				const v = parseFloat(bgMatch[1])
				if (v > 1 && v < 35) {
					tags.push({ type: 'bloodSugar', icon: '💧', label: `血糖 ${v} mmol/L`, value: v })
				}
			}

			// 睡眠：睡了8小时、睡眠7个小时、昨晚睡了6个半小时
			const sleepMatch = normalized.match(/睡[了眠觉]\s*[了]?\s*([\d]+\.?\d*)\s*[个]?\s*[半]?\s*小时/)
			if (sleepMatch) {
				let v = parseFloat(sleepMatch[1])
				if (normalized.includes('半小时') || normalized.includes('半个小时')) {
					v += 0.5
				}
				if (v > 0 && v < 24) {
					tags.push({ type: 'sleep', icon: '🌙', label: `睡眠 ${v} 小时`, value: v })
				}
			}

			// 体重：体重65公斤、65千克、体重65.5kg
			const weightMatch = normalized.match(/体重\s*[是为]?\s*([\d]+\.?\d*)/)
				|| normalized.match(/([\d]+\.?\d*)\s*[公千]斤/)
				|| normalized.match(/([\d]+\.?\d*)\s*[kK][gG]/)
			if (weightMatch && !tags.some(t => t.type === 'weight')) {
				const v = parseFloat(weightMatch[1])
				if (v > 20 && v < 300) {
					tags.push({ type: 'weight', icon: '⚖', label: `体重 ${v} kg`, value: v })
				}
			}

			// 身高：身高170cm、身高一米七
			const heightMatch = normalized.match(/身高\s*[是为]?\s*([\d]+\.?\d*)/)
				|| normalized.match(/([\d]+\.?\d*)\s*[cC][mM]/)
			if (heightMatch && !tags.some(t => t.type === 'height')) {
				const v = parseFloat(heightMatch[1])
				if (v > 50 && v < 250) {
					tags.push({ type: 'height', icon: '📏', label: `身高 ${v} cm`, value: v })
				}
			}

			// 呼吸频率：呼吸18次、呼吸频率20
			const breathMatch = normalized.match(/呼吸\s*[频率]*\s*[是为]?\s*(\d{1,2})/)
			if (breathMatch) {
				const v = parseFloat(breathMatch[1])
				if (v > 5 && v < 60) {
					tags.push({ type: 'breath', icon: '🫁', label: `呼吸 ${v} 次/分`, value: v })
				}
			}

			this.extractedTags = tags

			if (tags.length === 0 && this.voiceResult) {
				uni.showToast({ title: '未能从语音中提取到健康指标，请尝试说得更清楚', icon: 'none', duration: 3000 })
			}
		},

		async onSubmit() {
			const items = []
			if (this.formData.bp.high && this.formData.bp.low) {
				items.push({
					metricType: 'bp',
					bpHigh: parseFloat(this.formData.bp.high),
					bpLow: parseFloat(this.formData.bp.low)
				})
			} else if (this.formData.bp.high || this.formData.bp.low) {
				uni.showToast({ title: '请完整填写收缩压和舒张压', icon: 'none' })
				return
			}
			const singleKeys = ['heartRate', 'temperature', 'bloodSugar', 'sleep', 'breath', 'weight', 'height']
			for (const key of singleKeys) {
				const val = this.formData[key]
				if (val !== '' && val !== null && val !== undefined && String(val).trim() !== '') {
					items.push({ metricType: key, value: parseFloat(val) })
				}
			}
			if (items.length === 0) {
				uni.showToast({ title: '请至少填写一项健康指标', icon: 'none' })
				return
			}
			try {
				await submitBatchInput({
					recordDate: this.recordDate,
					recordTime: this.recordTime || undefined,
					notes: this.notes || undefined,
					items
				})
				uni.showToast({ title: '数据提交成功', icon: 'success' })
				this.resetForm()
				setTimeout(() => {
					uni.switchTab({ url: '/pages/home/home' })
				}, 800)
			} catch (e) {
				// request 已统一 showToast
			}
		},
		resetForm() {
			this.formData = {
				bp: { high: '', low: '' },
				heartRate: '',
				temperature: '',
				bloodSugar: '',
				sleep: '',
				breath: '',
				weight: '',
				height: ''
			}
			this.notes = ''
		},
		async onVoiceSubmit() {
			if (!this.voiceResult) return
			if (!this.extractedTags || this.extractedTags.length === 0) {
				uni.showToast({ title: '请先进行语音识别并确认提取结果', icon: 'none' })
				return
			}
			const extractedData = this.extractedTags.map(t => ({
				type: t.type,
				value: t.value,
				label: t.label
			}))
			const d = new Date()
			const recordDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
			const recordTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
			try {
				await submitVoiceInput({
					voiceResult: this.voiceResult,
					extractedData,
					recordDate,
					recordTime
				})
				uni.showToast({ title: '数据提交成功', icon: 'success' })
				this.voiceResult = ''
				this.extractedTags = []
				this.recordDuration = 0
				setTimeout(() => {
					uni.switchTab({ url: '/pages/home/home' })
				}, 800)
			} catch (e) {
				// request 已统一 showToast
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper {
	min-height: 100vh;
	background: #e2eef0;
	padding-top: 32rpx;
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

.metric-input-row {
	margin-bottom: 24rpx;
	.metric-label {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 12rpx;
	}
	.metric-icon { font-size: 28rpx; }
	.metric-name { font-size: 26rpx; color: #4E5969; font-weight: 500; }
	.metric-unit { font-size: 22rpx; color: #86909C; }
}

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
	transition: box-shadow 0.3s;
}
.mic-btn.recording {
	box-shadow: 0 0 0 20rpx rgba(124,58,237,0.1), 0 0 0 40rpx rgba(124,58,237,0.05);
}
.mic-icon { font-size: 72rpx; }
.voice-hint { font-size: 26rpx; color: #86909C; margin-bottom: 24rpx; text-align: center; }
.duration-text { font-size: 24rpx; color: #4A90D9; font-weight: 500; }

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
