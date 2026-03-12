<template>
	<view class="tabbar" v-show="!keyboardUp">
		<view
			v-for="(item, idx) in tabs"
			:key="idx"
			class="tab-item"
			:class="{ active: current === idx }"
			@click="switchTab(idx)"
		>
			<text class="tab-icon">{{ item.icon }}</text>
			<text class="tab-text">{{ item.text }}</text>
		</view>
	</view>
	<view class="tabbar-placeholder" v-show="!keyboardUp"></view>
</template>

<script>
export default {
	name: 'CustomTabbar',
	props: {
		current: { type: Number, default: 0 }
	},
	data() {
		return {
			tabs: [
				{ icon: '🏠', text: '首页', url: '/pages/home/home' },
				{ icon: '🤖', text: 'AI问答', url: '/pages/ai-consult/ai-consult' },
				{ icon: '📋', text: '健康计划', url: '/pages/plan-overview/plan-overview' },
				{ icon: '👤', text: '我的', url: '/pages/profile/profile' }
			],
			keyboardUp: false
		}
	},
	mounted() {
		uni.onKeyboardHeightChange((res) => {
			this.keyboardUp = res.height > 0
		})
	},
	methods: {
		switchTab(idx) {
			if (idx === this.current) return
			uni.switchTab({ url: this.tabs[idx].url })
		}
	}
}
</script>

<style lang="scss" scoped>
.tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 110rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.06);
	z-index: 999;
}
.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
}
.tab-icon {
	font-size: 40rpx;
	line-height: 1.2;
}
.tab-text {
	font-size: 22rpx;
	color: #999;
}
.tab-item.active .tab-text {
	color: #4A90D9;
	font-weight: 600;
}
.tabbar-placeholder {
	height: calc(110rpx + env(safe-area-inset-bottom));
}
</style>
