<template>
	<view class="page-wrapper">
		<CustomNavbar title="用药管理" />
		<view class="content">
			<!-- Today's medication -->
			<view class="today-section">
				<text class="section-title">今日用药</text>
				<view
					v-for="(m, i) in todayMeds"
					:key="i"
					class="take-item"
					@click="m.status === 'pending' ? confirmTake(i) : null"
				>
					<text class="take-time">{{ m.time }}</text>
					<view class="take-body">
						<text class="take-name">{{ m.name }}</text>
						<text class="take-dosage">{{ m.dosage }}</text>
					</view>
					<view class="take-status" :class="'status-' + m.status">
						<text>{{ m.status === 'done' ? '已服用' : m.status === 'pending' ? '待服用' : '漏服' }}</text>
					</view>
				</view>
			</view>

			<!-- Long-term medication list -->
			<text class="list-title">长期用药</text>
			<navigator
				v-for="(m, i) in longTermMeds"
				:key="i"
				:url="'/pages/medication-detail/medication-detail?id=' + m.id"
				class="med-card"
				hover-class="med-card-hover"
			>
				<text class="med-icon">💊</text>
				<view class="med-body">
					<text class="med-name">{{ m.name }}</text>
					<view class="med-schedule">
						<text v-for="(s, j) in m.schedule" :key="j" class="schedule-tag">{{ s }}</text>
					</view>
					<text class="med-info">{{ m.info }}</text>
				</view>
			</navigator>

			<!-- Side effect feedback -->
			<view class="feedback-btn" @click="onFeedback">
				<text>⚠ 不良反应反馈</text>
			</view>

			<!-- Add medication -->
			<view class="add-med-btn" @click="addMedication">
				<text>＋ 添加药物</text>
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
			todayMeds: [
				{ time: '08:00', name: '阿司匹林肠溶片', dosage: '100mg', status: 'done' },
				{ time: '12:00', name: '二甲双胍', dosage: '500mg', status: 'pending' },
				{ time: '20:00', name: '阿托伐他汀', dosage: '20mg', status: 'missed' }
			],
			longTermMeds: [
				{ id: 1, name: '阿司匹林肠溶片', schedule: ['早', '晚'], info: '每次100mg，餐后服用' },
				{ id: 2, name: '二甲双胍缓释片', schedule: ['早', '中', '晚'], info: '每次500mg，随餐服用' },
				{ id: 3, name: '阿托伐他汀钙片', schedule: ['晚'], info: '每次20mg，睡前服用' }
			]
		}
	},
	methods: {
		confirmTake(idx) {
			const med = this.todayMeds[idx]
			if (med.status !== 'pending') return
			uni.showModal({
				title: '确认服药',
				content: `确定已服用「${med.name}」${med.dosage} 吗？`,
				success: (res) => {
					if (res.confirm) {
						this.todayMeds[idx].status = 'done'
						uni.showToast({ title: '已标记服用', icon: 'success' })
					}
				}
			})
		},
		onFeedback() {
			uni.showToast({ title: '不良反应反馈', icon: 'none' })
		},
		addMedication() {
			uni.showToast({ title: '添加药物', icon: 'none' })
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
.today-section {
	background: rgba(226, 238, 240, 0.8);
	border-radius: $uni-radius-base;
	padding: 28rpx;
	margin-bottom: 32rpx;
}
.section-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 20rpx;
}
.take-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 2rpx solid rgba(74, 144, 217, 0.15);
	&:last-child { border-bottom: none; }
}
.take-time {
	width: 100rpx;
	font-size: 28rpx;
	font-weight: 600;
	color: $theme-primary;
	flex-shrink: 0;
}
.take-body { flex: 1; min-width: 0; }
.take-name {
	display: block;
	font-size: 28rpx;
	color: $uni-text-color;
	margin-bottom: 4rpx;
}
.take-dosage { font-size: 24rpx; color: $uni-text-color-secondary; }
.take-status {
	padding: 10rpx 24rpx;
	border-radius: 24rpx;
	font-size: 24rpx;
	font-weight: 500;
	&.status-done { background: #E8F5E9; color: #2E7D32; }
	&.status-pending { background: $theme-primary-bg; color: $theme-primary; }
	&.status-missed { background: #E5E6EB; color: #8F959E; }
}
.list-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 20rpx;
}
.med-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: $uni-radius-base;
	padding: 28rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}
.med-card-hover { transform: translateY(-2rpx); }
.med-icon {
	font-size: 48rpx;
	width: 80rpx;
	text-align: center;
	margin-right: 24rpx;
}
.med-body { flex: 1; min-width: 0; }
.med-name {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 10rpx;
}
.med-schedule {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
	margin-bottom: 8rpx;
}
.schedule-tag {
	padding: 4rpx 14rpx;
	background: $theme-primary-bg;
	color: $theme-primary;
	border-radius: 12rpx;
	font-size: 22rpx;
}
.med-info { font-size: 24rpx; color: $uni-text-color-secondary; }
.feedback-btn {
	background: #FFF8E1;
	border: 2rpx solid #FFC107;
	border-radius: $uni-radius-base;
	padding: 28rpx;
	text-align: center;
	font-size: 28rpx;
	color: #E65100;
	font-weight: 500;
	margin-bottom: 24rpx;
}
.add-med-btn {
	background: $theme-primary;
	border-radius: $uni-radius-base;
	padding: 32rpx;
	text-align: center;
	font-size: 30rpx;
	color: #fff;
	font-weight: 600;
}
</style>
