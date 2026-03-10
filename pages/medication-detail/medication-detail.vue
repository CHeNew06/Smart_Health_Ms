<template>
	<view class="page-wrapper">
		<CustomNavbar :title="drugName" :show-back="true">
			<template #right>
				<text class="nav-edit" @click="onEdit">编辑</text>
			</template>
		</CustomNavbar>

		<!-- Header with drug info -->
		<view class="drug-header">
			<text class="drug-icon">💊</text>
			<text class="drug-name">{{ drugName }}</text>
			<text class="drug-dosage">{{ drugDosage }}</text>
		</view>

		<view class="content">
			<!-- Info card -->
			<view class="info-card">
				<view v-for="(row, i) in infoRows" :key="i" class="info-row">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value">{{ row.value }}</text>
				</view>
			</view>

			<!-- Reminder card -->
			<view class="reminder-card">
				<text class="card-title">服药提醒</text>
				<view v-for="(r, i) in reminders" :key="i" class="reminder-row">
					<text class="reminder-time">{{ r.time }}</text>
					<text class="reminder-desc">{{ r.desc }}</text>
					<switch :checked="r.enabled" @change="toggleReminder(i)" color="#4A90D9" />
				</view>
			</view>

			<!-- Recent medication history -->
			<view class="history-card">
				<text class="card-title">近期用药记录</text>
				<view v-for="(h, i) in historyList" :key="i" class="history-row">
					<text class="history-date">{{ h.date }}</text>
					<text class="history-time">{{ h.time }}</text>
					<text class="history-status" :class="h.status === 'taken' ? 'taken' : 'missed'">
						{{ h.status === 'taken' ? '已服用' : '漏服' }}
					</text>
				</view>
			</view>

			<!-- Stop medication button -->
			<view class="stop-btn" @click="onStopMedication">
				<text>停止用药</text>
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
				drugName: '阿司匹林肠溶片',
				drugDosage: '每次100mg',
				infoRows: [
					{ label: '药品类型', value: '抗血小板药' },
					{ label: '用药频次', value: '每日两次' },
					{ label: '每次剂量', value: '100mg' },
					{ label: '开始日期', value: '2024-01-15' },
					{ label: '处方医生', value: '张医生' },
					{ label: '购买方式', value: '医院处方' }
				],
				reminders: [
					{ time: '08:00', desc: '早餐后', enabled: true },
					{ time: '20:00', desc: '晚餐后', enabled: true }
				],
				historyList: [
					{ date: '03-08', time: '08:05', status: 'taken' },
					{ date: '03-08', time: '20:12', status: 'taken' },
					{ date: '03-07', time: '08:00', status: 'taken' },
					{ date: '03-07', time: '20:00', status: 'missed' },
					{ date: '03-06', time: '08:10', status: 'taken' }
				]
			}
		},
		methods: {
			onEdit() {
				uni.showToast({ title: '编辑', icon: 'none' })
			},
			toggleReminder(idx) {
				this.reminders[idx].enabled = !this.reminders[idx].enabled
			},
			onStopMedication() {
				uni.showModal({
					title: '确认',
					content: '确定要停止服用该药物吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({ title: '已停止用药', icon: 'success' })
							setTimeout(() => uni.navigateBack(), 1000)
						}
					}
				})
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
	.nav-edit {
		font-size: 28rpx;
		color: $theme-primary;
		font-weight: 500;
	}
	.drug-header {
		background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
		padding: 48rpx 32rpx;
		text-align: center;
	}
	.drug-icon {
		display: block;
		font-size: 80rpx;
		margin-bottom: 16rpx;
	}
	.drug-name {
		display: block;
		font-size: 40rpx;
		font-weight: 700;
		color: $uni-text-color;
		margin-bottom: 8rpx;
	}
	.drug-dosage {
		font-size: 28rpx;
		color: $uni-text-color-secondary;
	}
	.content {
		padding: 24rpx 32rpx;
	}
	.info-card {
		background: #fff;
		border-radius: $uni-radius-base;
		padding: 0 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}
	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
		&:last-child { border-bottom: none; }
	}
	.info-label {
		font-size: 28rpx;
		color: $uni-text-color-secondary;
	}
	.info-value {
		font-size: 28rpx;
		color: $uni-text-color;
		font-weight: 500;
	}
	.reminder-card,
	.history-card {
		background: #fff;
		border-radius: $uni-radius-base;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}
	.card-title {
		display: block;
		font-size: 30rpx;
		font-weight: 600;
		color: $uni-text-color;
		margin-bottom: 24rpx;
	}
	.reminder-row {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
		&:last-child { border-bottom: none; }
	}
	.reminder-time {
		width: 100rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: $theme-primary;
		flex-shrink: 0;
	}
	.reminder-desc {
		flex: 1;
		font-size: 28rpx;
		color: $uni-text-color-secondary;
	}
	.history-row {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
		font-size: 26rpx;
		&:last-child { border-bottom: none; }
	}
	.history-date {
		width: 100rpx;
		color: $uni-text-color-secondary;
	}
	.history-time {
		width: 100rpx;
		color: $uni-text-color-secondary;
	}
	.history-status {
		margin-left: auto;
		&.taken { color: #2E7D32; }
		&.missed { color: #8F959E; }
	}
	.stop-btn {
		border: 2rpx solid #FF3B30;
		border-radius: $uni-radius-base;
		padding: 32rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FF3B30;
		font-weight: 600;
		margin-top: 16rpx;
	}
</style>
