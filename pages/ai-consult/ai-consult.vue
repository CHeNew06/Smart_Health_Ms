<template>
	<view class="chat-page">
		<!-- 左侧历史侧边栏 -->
		<view class="sidebar" :class="{ 'sidebar-show': showSidebar }">
			<view class="sidebar-header">
				<text class="sidebar-title">对话历史</text>
				<view class="sidebar-close" @click="showSidebar = false">
					<text class="close-x">×</text>
				</view>
			</view>
			<scroll-view scroll-y class="sidebar-list">
				<view
					v-for="(item, idx) in historyList"
					:key="idx"
					class="history-item"
					:class="{ active: currentHistoryIdx === idx }"
					@click="loadHistory(idx)"
				>
					<view class="hi-left">
						<text class="hi-icon">💬</text>
						<view class="hi-info">
							<text class="hi-title">{{ item.title }}</text>
							<text class="hi-time">{{ item.time }}</text>
						</view>
					</view>
					<view class="hi-del" @click.stop="deleteHistory(idx)">
						<text>🗑</text>
					</view>
				</view>
				<view v-if="!historyList.length" class="empty-state">
					<text class="empty-icon-big">📭</text>
					<text class="empty-text">暂无对话历史</text>
				</view>
			</scroll-view>
		</view>
		<view v-if="showSidebar" class="sidebar-mask" @click="showSidebar = false"></view>

		<!-- 顶部栏 -->
		<view class="nav-header">
			<view class="header-content">
				<view class="history-btn" @click="showSidebar = true">
					<text class="h-icon">🕐</text>
				</view>
				<view class="header-info">
					<text class="bot-name">小Y</text>
					<text class="bot-status">在线</text>
				</view>
				<view class="new-chat-btn" @click="startNewChat">
					<text class="nc-icon">💬</text>
					<text class="nc-text">新对话</text>
				</view>
			</view>
		</view>

		<!-- 消息列表 -->
		<scroll-view
			class="msg-scroll"
			scroll-y
			:scroll-into-view="scrollIntoId"
			:scroll-with-animation="true"
			:style="{ paddingBottom: scrollPadBottom + 'px' }"
			@touchstart="onScrollTouch"
		>
			<view class="msg-inner">
				<view
					v-for="(msg, idx) in msgList"
					:key="idx"
					:id="'m' + idx"
					class="msg-row"
					:class="msg.role === 'user' ? 'msg-right' : 'msg-left'"
				>
					<template v-if="msg.role === 'ai'">
						<view class="avatar ai-av"><text>🤖</text></view>
						<view class="bubble-wrap">
							<view class="bubble bubble-ai">
								<text class="bubble-text">{{ msg.content }}</text>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="bubble-wrap bubble-wrap-right">
							<view class="bubble bubble-user">
								<text class="bubble-text">{{ msg.content }}</text>
							</view>
							<view v-if="msg.imageUrl" class="img-in-msg">
								<image :src="msg.imageUrl" class="chat-img" mode="widthFix" @click="previewImg(msg.imageUrl)" />
							</view>
						</view>
						<view class="avatar user-av"><text>👤</text></view>
					</template>
				</view>

				<!-- 加载动画 -->
				<view v-if="isLoading" id="mLoading" class="msg-row msg-left">
					<view class="avatar ai-av"><text>🤖</text></view>
					<view class="bubble-wrap">
						<view class="bubble bubble-ai loading-bubble">
							<view class="loading-dots">
								<text class="dot"></text><text class="dot"></text><text class="dot"></text>
							</view>
						</view>
					</view>
				</view>

				<!-- 底部占位，确保最后一条消息可见 -->
				<view :id="'mEnd'" style="height: 20rpx;"></view>
			</view>
		</scroll-view>

		<!-- 停止生成 -->
		<view v-if="isTyping" class="stop-bar" @click="stopTyping">
			<view class="stop-pill">
				<text class="stop-icon-txt">⏹</text>
				<text class="stop-text">停止生成</text>
			</view>
		</view>

		<!-- 底部固定区域 -->
		<view class="bottom-fixed" :style="bottomStyle">
			<!-- 快捷问题 -->
			<view class="quick-questions" v-if="showQuickQ && !isLoading && !isTyping && !kbUp">
				<scroll-view scroll-x class="qq-scroll">
					<view class="qq-list">
						<view v-for="(q, i) in quickQuestions" :key="i" class="qq-tag" @click="sendQuick(q)">
							<text>{{ q }}</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 图片预览 -->
			<view v-if="tempImagePath" class="img-preview-area">
				<view class="img-preview-card">
					<image :src="tempImagePath" class="preview-thumb" mode="aspectFill" />
					<view class="preview-del" @click="tempImagePath = ''"><text>×</text></view>
				</view>
			</view>

			<!-- 输入栏 -->
			<view class="input-bar">
				<view class="input-row">
					<view v-if="!hasInput" class="icon-btn" @click="chooseImage">
						<text class="ib-icon">📷</text>
					</view>
					<view class="input-box">
						<input
							type="text"
							v-model="inputText"
							class="chat-input"
							:placeholder="hasInput ? '请输入消息...' : '发消息或按住说话...'"
							placeholder-class="ph"
							confirm-type="send"
							:adjust-position="false"
							@confirm="sendMessage"
							@focus="onInputFocus"
							@blur="onInputBlur"
						/>
					</view>
					<template v-if="!hasInput">
						<view
							class="icon-btn voice-area"
							:class="{ 'voice-active': isRecording || isRecognizing }"
							@touchstart="startRecording"
							@touchmove="onTouchMove"
							@touchend="stopRecording"
						>
							<text class="ib-icon">🎤</text>
						</view>
						<view class="icon-btn" @click="showModeSheet = true">
							<text class="ib-icon">⊕</text>
						</view>
					</template>
					<view v-if="hasInput" class="send-btn" @click="sendMessage">
						<text class="send-text">发送</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 录音弹窗 -->
		<view v-if="isRecording" class="recording-overlay">
			<view class="recording-modal">
				<text class="rec-emoji" :class="{ 'rec-cancel': isCanceled }">🎤</text>
				<text class="rec-status">{{ isCanceled ? '松开手指，取消发送' : (isRecognizing ? '正在识别...' : '正在录音...') }}</text>
				<text class="rec-tip" :style="{ color: isCanceled ? '#ff4d4f' : (isRecognizing ? '#67c23a' : '#4A90D9') }">
					{{ isCanceled ? '手指上滑，取消发送' : (isRecognizing ? '请稍候' : '松开发送') }}
				</text>
			</view>
		</view>

		<!-- 模式切换 -->
		<view v-if="showModeSheet" class="sheet-mask" @click="showModeSheet = false">
			<view class="sheet-panel" @click.stop>
				<text class="sheet-title">切换模式</text>
				<view class="sheet-opt" :class="{ active: consultMode === 0 }" @click="switchMode(0)">
					<text class="so-icon">💬</text>
					<view class="so-info">
						<text class="so-name">智能问答</text>
						<text class="so-desc">自由提问，AI即时回答</text>
					</view>
					<text v-if="consultMode === 0" class="so-check">✓</text>
				</view>
				<view class="sheet-opt" :class="{ active: consultMode === 1 }" @click="switchMode(1)">
					<text class="so-icon">🩺</text>
					<view class="so-info">
						<text class="so-name">AI主动问诊</text>
						<text class="so-desc">AI引导问答，系统化评估</text>
					</view>
					<text v-if="consultMode === 1" class="so-check">✓</text>
				</view>
				<view class="sheet-cancel" @click="showModeSheet = false"><text>取消</text></view>
			</view>
		</view>

		<CustomTabbar v-if="!kbUp" :current="1" />
	</view>
</template>

<script>
import CustomTabbar from '@/components/custom-tabbar.vue'

export default {
	components: { CustomTabbar },
	data() {
		return {
			consultMode: 0,
			showModeSheet: false,
			showSidebar: false,
			inputText: '',
			scrollIntoId: '',
			isLoading: false,
			isTyping: false,
			shouldStop: false,
			showQuickQ: true,
			tempImagePath: '',
			isRecording: false,
			isRecognizing: false,
			touchStartY: 0,
			isCanceled: false,
			recordStartTime: 0,
			kbUp: false,
			kbHeight: 0,
			currentHistoryIdx: -1,
			historyList: [],
			msgList: [],
			quickQuestions: [
				'我的血压偏高，日常饮食应该注意什么？',
				'最近睡眠质量不好，有什么改善方法？',
				'中医养生有哪些适合老年人的方法？'
			]
		}
	},
	computed: {
		hasInput() {
			return (this.inputText || '').trim().length > 0
		},
		bottomStyle() {
			if (this.kbUp && this.kbHeight > 0) {
				return { bottom: this.kbHeight + 'px' }
			}
			return { bottom: 'calc(110rpx + env(safe-area-inset-bottom))' }
		},
		scrollPadBottom() {
			if (this.kbUp && this.kbHeight > 0) {
				return this.kbHeight + 60
			}
			return 200
		}
	},
	onLoad() {
		this.pushWelcome()
		uni.onKeyboardHeightChange((res) => {
			if (res.height > 0) {
				this.kbUp = true
				this.kbHeight = res.height
			} else {
				this.kbUp = false
				this.kbHeight = 0
			}
			this.$nextTick(() => this.scrollToEnd())
		})
	},
	methods: {
		pushWelcome() {
			this.msgList = [{
				role: 'ai',
				content: '您好！我是您的AI健康助手小Y，很高兴为您服务。请问有什么可以帮您的吗？'
			}]
		},
		onInputFocus() {
			this.$nextTick(() => setTimeout(() => this.scrollToEnd(), 300))
		},
		onInputBlur() {},
		onScrollTouch() {
			if (this.kbUp) {
				uni.hideKeyboard()
			}
		},
		sendMessage() {
			const txt = (this.inputText || '').trim()
			if (!txt && !this.tempImagePath) {
				uni.showToast({ title: '请输入消息', icon: 'none' })
				return
			}
			const userMsg = { role: 'user', content: txt || '[图片]' }
			if (this.tempImagePath) {
				userMsg.imageUrl = this.tempImagePath
				this.tempImagePath = ''
			}
			this.msgList.push(userMsg)
			this.inputText = ''
			this.showQuickQ = false
			this.$nextTick(() => this.scrollToEnd())

			this.shouldStop = false
			this.isLoading = true
			setTimeout(() => {
				this.isLoading = false
				const aiMsg = { role: 'ai', content: '' }
				this.msgList.push(aiMsg)
				this.typeMessage(
					'好的，我正在为您分析相关信息。根据您的描述，建议您：\n1. 保持规律的作息时间\n2. 适量进行有氧运动\n3. 注意饮食清淡\n4. 定期监测身体指标\n\n如果症状持续，建议及时就医检查。',
					this.msgList.length - 1
				)
			}, 1200)
		},
		typeMessage(fullText, msgIdx, charIdx = 0) {
			if (this.shouldStop) {
				if (this.msgList[msgIdx]) this.msgList[msgIdx].content += '\n\n[回答已终止]'
				this.isTyping = false
				this.shouldStop = false
				return
			}
			this.isTyping = true
			if (charIdx <= fullText.length) {
				this.msgList[msgIdx].content = fullText.slice(0, charIdx)
				if (charIdx % 10 === 0) this.$nextTick(() => this.scrollToEnd())
				setTimeout(() => this.typeMessage(fullText, msgIdx, charIdx + 1), 45)
			} else {
				this.isTyping = false
				this.scrollToEnd()
			}
		},
		stopTyping() { this.shouldStop = true },
		sendQuick(q) { this.inputText = q; this.sendMessage() },
		startNewChat() {
			uni.showModal({
				title: '新建对话',
				content: '确定要开始新的对话吗？',
				success: (res) => { if (res.confirm) { this.pushWelcome(); this.showQuickQ = true } }
			})
		},
		startRecording(e) {
			this.touchStartY = e.touches[0].clientY
			this.isCanceled = false
			this.recordStartTime = Date.now()
			this.isRecording = true
		},
		onTouchMove(e) {
			if (!this.isRecording) return
			this.isCanceled = (this.touchStartY - e.touches[0].clientY) > 50
		},
		stopRecording() {
			if (!this.isRecording) return
			if (this.isCanceled) { this.isRecording = false; uni.showToast({ title: '已取消发送', icon: 'none' }); return }
			if (Date.now() - this.recordStartTime < 1000) { this.isRecording = false; uni.showToast({ title: '说话时间太短', icon: 'none' }); return }
			this.isRecognizing = true
			setTimeout(() => { this.isRecording = false; this.isRecognizing = false; this.inputText = '' }, 1500)
		},
		chooseImage() {
			uni.chooseImage({
				count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'],
				success: (res) => { this.tempImagePath = res.tempFilePaths[0] }
			})
		},
		switchMode(mode) {
			this.consultMode = mode; this.showModeSheet = false
			if (mode === 1) uni.showToast({ title: '已切换到AI问诊模式', icon: 'none' })
		},
		loadHistory(idx) { this.currentHistoryIdx = idx; this.showSidebar = false },
		deleteHistory(idx) {
			uni.showModal({ title: '删除对话', content: '确定删除？', success: (r) => { if (r.confirm) { this.historyList.splice(idx, 1) } } })
		},
		previewImg(url) { uni.previewImage({ urls: [url], current: url }) },
		scrollToEnd() {
			this.$nextTick(() => {
				this.scrollIntoId = ''
				setTimeout(() => { this.scrollIntoId = 'mEnd' }, 50)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.chat-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #F5F7FA;
}

/* ========== 侧边栏 ========== */
.sidebar {
	position: fixed; top: 0; left: -85%; width: 85%; height: 100vh;
	background: #fff; z-index: 1000; transition: left 0.3s;
	box-shadow: 4rpx 0 20rpx rgba(0,0,0,0.1);
}
.sidebar-show { left: 0; }
.sidebar-header {
	display: flex; justify-content: space-between; align-items: center;
	padding: 60rpx 32rpx 24rpx; border-bottom: 1rpx solid #eee; background: #f8f8f8;
}
.sidebar-title { font-size: 34rpx; font-weight: 600; color: #333; }
.sidebar-close { width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; }
.close-x { font-size: 44rpx; color: #666; }
.sidebar-list { height: calc(100vh - 120rpx); }
.history-item {
	display: flex; align-items: center; justify-content: space-between;
	padding: 28rpx 32rpx; border-bottom: 1rpx solid #f5f5f5;
	&.active { background: #f0f7ff; }
}
.hi-left { display: flex; align-items: center; gap: 16rpx; flex: 1; }
.hi-icon { font-size: 32rpx; }
.hi-info { flex: 1; }
.hi-title { display: block; font-size: 28rpx; font-weight: 500; color: #333; }
.hi-time { display: block; font-size: 22rpx; color: #999; margin-top: 4rpx; }
.hi-del { padding: 16rpx; font-size: 28rpx; opacity: 0.5; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
.empty-icon-big { font-size: 80rpx; margin-bottom: 16rpx; }
.empty-text { font-size: 28rpx; color: #999; }
.sidebar-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999; }

/* ========== 顶部栏 ========== */
.nav-header {
	position: fixed; top: 0; left: 0; right: 0; z-index: 100;
	background: #fff; padding-top: var(--status-bar-height, 44px); padding-bottom: 12rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.06);
}
.header-content { display: flex; align-items: center; height: 88rpx; padding: 0 24rpx; }
.history-btn { padding: 12rpx; margin-right: 12rpx; }
.h-icon { font-size: 40rpx; }
.header-info {
	.bot-name { display: block; font-size: 32rpx; font-weight: 700; color: #1D2129; }
	.bot-status { display: block; font-size: 22rpx; color: #34C759; }
}
.new-chat-btn {
	margin-left: auto; display: flex; align-items: center; gap: 8rpx;
	background: #4A90D9; padding: 14rpx 28rpx; border-radius: 32rpx; color: #fff;
}
.nc-icon { font-size: 28rpx; }
.nc-text { font-size: 24rpx; }

/* ========== 消息列表 ========== */
.msg-scroll {
	flex: 1;
	box-sizing: border-box;
}
.msg-inner {
	padding-top: calc(var(--status-bar-height, 44px) + 130rpx);
	padding-left: 3%; padding-right: 3%;
}
.msg-row { display: flex; margin-bottom: 32rpx; align-items: flex-start; }
.msg-left { flex-direction: row; }
.msg-right { flex-direction: row; justify-content: flex-end; }

.avatar {
	width: 76rpx; height: 76rpx; border-radius: 50%;
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0; font-size: 38rpx;
}
.ai-av { background: #4A90D9; margin-right: 16rpx; }
.user-av { background: #E0E0E0; margin-left: 16rpx; }

.bubble-wrap { max-width: calc(100% - 100rpx); }
.bubble-wrap-right { display: flex; flex-direction: column; align-items: flex-end; max-width: calc(100% - 100rpx); }

.bubble {
	padding: 24rpx 28rpx; border-radius: 24rpx;
	font-size: 28rpx; line-height: 1.6;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04);
}
.bubble-ai { background: #fff; color: #1D2129; border-top-left-radius: 6rpx; }
.bubble-user { background: #4A90D9; color: #fff; border-top-right-radius: 6rpx; }
.bubble-text { white-space: pre-wrap; word-break: break-word; }

.img-in-msg { margin-top: 12rpx; border-radius: 16rpx; overflow: hidden; }
.chat-img { width: 360rpx; border-radius: 16rpx; }

.loading-bubble { min-width: 120rpx; padding: 24rpx 32rpx; }
.loading-dots { display: flex; align-items: center; justify-content: center; gap: 8rpx; }
.dot {
	width: 14rpx; height: 14rpx; background: #999; border-radius: 50%;
	display: inline-block; animation: dotBounce 1.4s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce {
	0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
	40% { transform: scale(1); opacity: 1; }
}

/* 停止生成 */
.stop-bar { position: fixed; bottom: 320rpx; left: 50%; transform: translateX(-50%); z-index: 100; }
.stop-pill {
	display: flex; align-items: center; gap: 8rpx;
	background: rgba(0,0,0,0.6); padding: 14rpx 32rpx; border-radius: 40rpx;
}
.stop-icon-txt { font-size: 28rpx; }
.stop-text { color: #fff; font-size: 26rpx; }

/* ========== 底部固定区域 ========== */
.bottom-fixed {
	position: fixed; left: 0; right: 0; z-index: 100; background: #F5F7FA;
}

.quick-questions { padding: 12rpx 24rpx; }
.qq-scroll { white-space: nowrap; }
.qq-list { display: flex; gap: 16rpx; }
.qq-tag {
	display: inline-flex; padding: 14rpx 24rpx; background: #fff;
	border: 2rpx solid #E5E6EB; border-radius: 32rpx;
	font-size: 24rpx; color: #4E5969; flex-shrink: 0; white-space: nowrap;
}

.img-preview-area { padding: 12rpx 24rpx 0; }
.img-preview-card { position: relative; display: inline-block; }
.preview-thumb { width: 160rpx; height: 160rpx; border-radius: 12rpx; display: block; }
.preview-del {
	position: absolute; top: -14rpx; right: -14rpx;
	width: 44rpx; height: 44rpx; background: rgba(0,0,0,0.5);
	color: #fff; border-radius: 50%; display: flex;
	align-items: center; justify-content: center; font-size: 28rpx;
}

.input-bar { background: #fff; padding: 14rpx 20rpx; box-shadow: 0 -2rpx 6rpx rgba(0,0,0,0.04); }
.input-row { display: flex; align-items: center; gap: 12rpx; }
.icon-btn { padding: 10rpx; flex-shrink: 0; }
.ib-icon { font-size: 40rpx; }
.voice-area { border-radius: 50%; }
.voice-active { background: rgba(74,144,217,0.15); animation: pulseAnim 1.5s infinite; }
@keyframes pulseAnim {
	0% { box-shadow: 0 0 0 0 rgba(74,144,217,0.3); }
	70% { box-shadow: 0 0 0 16rpx rgba(74,144,217,0); }
	100% { box-shadow: 0 0 0 0 rgba(74,144,217,0); }
}
.input-box {
	flex: 1; height: 72rpx; background: #F5F7FA; border: 2rpx solid #E5E6EB;
	border-radius: 36rpx; padding: 0 24rpx; display: flex; align-items: center;
}
.chat-input { flex: 1; font-size: 28rpx; color: #1D2129; background: transparent; }
.ph { color: #C9CDD4; }
.send-btn { background: #4A90D9; padding: 14rpx 36rpx; border-radius: 36rpx; flex-shrink: 0; }
.send-text { color: #fff; font-size: 28rpx; font-weight: 500; }

/* ========== 录音弹窗 ========== */
.recording-overlay {
	position: fixed; inset: 0; background: rgba(0,0,0,0.3);
	z-index: 999; display: flex; align-items: center; justify-content: center;
}
.recording-modal {
	background: rgba(0,0,0,0.7); border-radius: 24rpx; padding: 60rpx;
	display: flex; flex-direction: column; align-items: center; gap: 24rpx; min-width: 300rpx;
}
.rec-emoji { font-size: 96rpx; animation: scaleAnim 1s infinite; }
.rec-emoji.rec-cancel { opacity: 0.4; animation: none; transform: scale(0.8); }
@keyframes scaleAnim {
	0%, 100% { transform: scale(1); opacity: 0.8; }
	50% { transform: scale(1.15); opacity: 1; }
}
.rec-status { color: #fff; font-size: 30rpx; }
.rec-tip { font-size: 26rpx; font-weight: 500; }

/* ========== 模式切换 ========== */
.sheet-mask {
	position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000;
	display: flex; align-items: flex-end;
}
.sheet-panel {
	width: 100%; background: #fff; border-radius: 32rpx 32rpx 0 0;
	padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom));
}
.sheet-title { display: block; font-size: 30rpx; font-weight: 600; color: #1D2129; text-align: center; margin-bottom: 24rpx; }
.sheet-opt {
	display: flex; align-items: center; gap: 20rpx;
	padding: 28rpx 20rpx; border-radius: 16rpx; margin-bottom: 12rpx;
	&.active { background: rgba(74,144,217,0.08); }
}
.so-icon { font-size: 40rpx; }
.so-info { flex: 1; }
.so-name { display: block; font-size: 30rpx; font-weight: 600; color: #1D2129; }
.so-desc { display: block; font-size: 24rpx; color: #86909C; margin-top: 4rpx; }
.so-check { font-size: 32rpx; color: #4A90D9; font-weight: 700; }
.sheet-cancel {
	height: 88rpx; margin-top: 12rpx; display: flex; align-items: center;
	justify-content: center; font-size: 30rpx; color: #86909C; border-top: 1rpx solid #E5E6EB;
}
</style>
