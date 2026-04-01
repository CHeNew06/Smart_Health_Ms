<template>
	<view class="page page-settings">
		<CustomNavbar title="设置" :show-back="true" />
		<view class="page-body">
			<!-- 提醒设置 -->
			<view class="setting-group">
				<text class="group-title">提醒设置</text>
				<view class="setting-item">
					<text class="item-label">用药提醒</text>
					<view class="toggle" :class="{ on: settings.medicationRemind }" @click="settings.medicationRemind = !settings.medicationRemind">
						<view class="toggle-thumb"></view>
					</view>
				</view>
				<view class="setting-item">
					<text class="item-label">运动提醒</text>
					<view class="toggle" :class="{ on: settings.sportRemind }" @click="settings.sportRemind = !settings.sportRemind">
						<view class="toggle-thumb"></view>
					</view>
				</view>
				<view class="setting-item">
					<text class="item-label">复查提醒</text>
					<view class="toggle" :class="{ on: settings.recheckRemind }" @click="settings.recheckRemind = !settings.recheckRemind">
						<view class="toggle-thumb"></view>
					</view>
				</view>
			</view>

			<!-- 显示设置 -->
			<view class="setting-group">
				<text class="group-title">显示设置</text>
				<view class="setting-item">
					<text class="item-label">字体大小</text>
					<view class="font-btns">
						<view
							v-for="s in ['小','中','大']"
							:key="s"
							class="font-btn"
							:class="{ active: fontSize === s }"
							@click="fontSize = s"
						>
							<text>{{ s }}</text>
						</view>
					</view>
				</view>
				<view class="setting-item">
					<text class="item-label">深色模式</text>
					<view class="toggle" :class="{ on: settings.darkMode }" @click="settings.darkMode = !settings.darkMode">
						<view class="toggle-thumb"></view>
					</view>
				</view>
			</view>

			<!-- 隐私安全 -->
			<view class="setting-group">
				<text class="group-title">隐私安全</text>
				<view class="setting-item">
					<text class="item-label">指纹解锁</text>
					<view class="toggle" :class="{ on: settings.fingerprint }" @click="settings.fingerprint = !settings.fingerprint">
						<view class="toggle-thumb"></view>
					</view>
				</view>
				<view class="setting-item">
					<text class="item-label">数据加密</text>
					<view class="toggle" :class="{ on: settings.dataEncrypt }" @click="settings.dataEncrypt = !settings.dataEncrypt">
						<view class="toggle-thumb"></view>
					</view>
				</view>
			</view>

			<!-- 其他 -->
			<view class="setting-group">
				<text class="group-title">其他</text>
				<view class="setting-item">
					<text class="item-label">清除缓存</text>
					<view class="cache-action" @click="clearCache">
						<text>{{ cacheText }}</text>
					</view>
				</view>
				<view class="setting-item">
					<text class="item-label">检查更新</text>
					<view class="setting-value">检查</view>
				</view>
				<view class="setting-item">
					<text class="item-label">当前版本</text>
					<text class="setting-value">v1.0.0</text>
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
			fontSize: '中',
			cacheText: '清除',
			settings: {
				medicationRemind: true,
				sportRemind: true,
				recheckRemind: false,
				darkMode: false,
				fingerprint: false,
				dataEncrypt: true
			}
		}
	},
	methods: {
		clearCache() {
			this.cacheText = '已清除'
			uni.showToast({ title: '已清除', icon: 'success' })
			setTimeout(() => {
				this.cacheText = '清除'
			}, 1500)
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
.setting-group {
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}
.group-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1D2129;
	display: block;
	margin-bottom: 20rpx;
}
.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #E5E6EB;
	&:last-child { border-bottom: none; }
}
.item-label {
	font-size: 28rpx;
	color: #1D2129;
}
.toggle {
	width: 96rpx;
	height: 52rpx;
	background: #E5E6EB;
	border-radius: 26rpx;
	position: relative;
	transition: background 0.2s;
	&.on {
		background: #4A90D9;
		.toggle-thumb { transform: translateX(44rpx); }
	}
}
.toggle-thumb {
	position: absolute;
	top: 4rpx;
	left: 4rpx;
	width: 44rpx;
	height: 44rpx;
	background: #fff;
	border-radius: 50%;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
	transition: transform 0.2s;
}
.font-btns {
	display: flex;
	gap: 16rpx;
}
.font-btn {
	padding: 12rpx 28rpx;
	background: #F5F7FA;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #4E5969;
	&.active {
		background: #4A90D9;
		color: #fff;
	}
}
.cache-action,
.setting-value {
	font-size: 28rpx;
	color: #4A90D9;
}
.setting-value {
	color: #4E5969;
}
</style>
