<script>
	export default {
		onLaunch() {
			console.log('App Launch')
		},
		onShow() {
			uni.hideTabBar()
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import './uni.scss';

	page {
		background-color: $uni-bg-color;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		line-height: 1.5;
	}

	/* 全局工具类 */
	.page-wrapper {
		min-height: 100vh;
		background: $uni-bg-color;
	}
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: $uni-text-color;
		padding: 24rpx 32rpx 16rpx;
	}
	.card {
		background: #fff;
		border-radius: $uni-radius-base;
		padding: 24rpx;
		margin: 0 32rpx 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
	}

	/* 按钮 */
	.btn-primary {
		background: $theme-primary;
		color: #fff;
		height: 88rpx;
		border-radius: $uni-radius-base;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: 600;
	}
	.btn-primary:active {
		background: $theme-primary-dark;
	}
	.btn-outline {
		background: transparent;
		color: $theme-primary;
		height: 88rpx;
		border: 2rpx solid $theme-primary;
		border-radius: $uni-radius-base;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: 600;
	}

	/* 输入框 */
	.input-group {
		margin-bottom: 28rpx;
	}
	.input-group .input-label {
		font-size: 26rpx;
		color: $uni-text-color-secondary;
		margin-bottom: 12rpx;
		font-weight: 500;
	}
	.input-wrap {
		display: flex;
		align-items: center;
		height: 88rpx;
		background: $uni-bg-color;
		border: 2rpx solid $uni-border-color;
		border-radius: $uni-radius-base;
		padding: 0 24rpx;
	}
	.input-wrap:focus-within {
		border-color: $theme-primary;
		background: #fff;
	}
	.input-wrap .input-icon {
		font-size: 32rpx;
		color: $uni-text-color-placeholder;
		margin-right: 16rpx;
		width: 40rpx;
		text-align: center;
	}
	.input-wrap input {
		flex: 1;
		font-size: 28rpx;
		color: $uni-text-color;
	}

	/* 徽章 */
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		font-weight: 600;
	}
	.badge-success { background: #ECFDF5; color: #059669; }
	.badge-warning { background: #FFFBEB; color: #D97706; }
	.badge-danger { background: #FEF2F2; color: #DC2626; }
	.badge-primary { background: $theme-primary-bg; color: $theme-primary; }
	.badge-info { background: #EDE9FE; color: #7C3AED; }
</style>
