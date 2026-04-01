<template>
	<view class="tab-switch">
		<view
			v-for="(item, idx) in tabs"
			:key="idx"
			class="tab-item"
			:class="{ active: modelValue === idx }"
			@click="$emit('update:modelValue', idx)"
		>
			<text>{{ item }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TabSwitch',
		props: {
			tabs: { type: Array, default: () => [] },
			modelValue: { type: Number, default: 0 }
		},
		emits: ['update:modelValue']
	}
</script>

<style lang="scss" scoped>
	.tab-switch {
		display: flex;
		background: #F0F1F3;
		border-radius: 16rpx;
		padding: 4rpx;
		margin: 0 32rpx 24rpx;
	}
	.tab-item {
		flex: 1;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12rpx;
		font-size: 26rpx;
		color: #86909C;
		font-weight: 500;
		transition: all 0.2s;
	}
	.tab-item.active {
		background: #fff;
		color: $theme-primary;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
	}
</style>
