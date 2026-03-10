<template>
	<view class="navbar" :style="{ background: bgColor, paddingTop: statusBarH + 'px' }">
		<view class="navbar-inner">
			<view class="navbar-left" @click="handleBack" v-if="showBack">
				<text class="nav-icon" :style="{ color: titleColor }">‹</text>
			</view>
			<view class="navbar-left" v-else></view>
			<view class="navbar-title">
				<text :style="{ color: titleColor }">{{ title }}</text>
			</view>
			<view class="navbar-right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
	<view :style="{ height: (statusBarH + 44) + 'px' }"></view>
</template>

<script>
	export default {
		name: 'CustomNavbar',
		props: {
			title: { type: String, default: '' },
			showBack: { type: Boolean, default: true },
			bgColor: { type: String, default: '#ffffff' },
			titleColor: { type: String, default: '#1D2129' }
		},
		data() {
			return {
				statusBarH: 20
			}
		},
		created() {
			const sys = uni.getSystemInfoSync()
			this.statusBarH = sys.statusBarHeight || 20
		},
		methods: {
			handleBack() {
				uni.navigateBack({ fail: () => { uni.switchTab({ url: '/pages/home/home' }) } })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
	}
	.navbar-inner {
		height: 88rpx;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
	}
	.navbar-left {
		width: 80rpx;
		display: flex;
		align-items: center;
	}
	.nav-icon {
		font-size: 48rpx;
		font-weight: 300;
	}
	.navbar-title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-weight: 600;
	}
	.navbar-right {
		width: 80rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
