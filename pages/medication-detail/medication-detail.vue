<template>
	<view class="page-wrapper">
		<CustomNavbar :title="drugName || '用药详情'" :show-back="true" bgColor="#4A90D9" titleColor="#fff" />

		<!-- Header with drug info -->
		<view class="drug-header">
			<text class="drug-icon">💊</text>
			<text class="drug-name">{{ drugName }}</text>
			<text class="drug-type">{{ medTypeText }}</text>
		</view>

		<view class="content">
			<!-- Info card -->
			<view class="info-card">
				<view v-for="(row, i) in infoRows" :key="i" class="info-row">
					<text class="info-label">{{ row.label }}</text>
					<text class="info-value" :class="row.cls || ''">{{ row.value }}</text>
				</view>
				<view v-if="!infoRows.length" class="empty-hint"><text>暂无药品信息</text></view>
			</view>

			<!-- Delete button -->
			<view class="stop-btn" @click="onDelete">
				<text>删除该记录</text>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'
import { getMedRecordDetail, deleteMedRecord } from '@/api/medication'

export default {
	components: { CustomNavbar },
	data() {
		return {
			recordId: null,
			drugName: '',
			medTypeText: '',
			infoRows: []
		}
	},
	onLoad(options) {
		if (options && options.id) {
			this.recordId = options.id
			this.loadDetail()
		}
	},
	methods: {
		async loadDetail() {
			try {
				const res = await getMedRecordDetail(this.recordId)
				if (res?.data) {
					const d = res.data
					this.drugName = d.name || '未知药品'
					this.medTypeText = d.medType === 'long_term' ? '慢性病长期用药' : '短期用药'

					const rows = []
					if (d.purpose) rows.push({ label: '治疗病症/用途', value: d.purpose })
					if (d.dosage) rows.push({ label: '单次剂量', value: d.dosage })
					if (d.frequency) rows.push({ label: '医嘱频次', value: d.frequency })
					if (d.contraindication) rows.push({ label: '用药禁忌', value: d.contraindication, cls: 'warn' })
					if (d.recordDate) rows.push({ label: '用药日期', value: d.recordDate })
					if (d.onTime) rows.push({ label: '是否按时服用', value: d.onTime, cls: d.onTime === '是' ? 'good' : 'warn' })
					if (d.sideEffect) rows.push({ label: '不良反应', value: d.sideEffect, cls: 'warn' })
					if (d.doctor) rows.push({ label: '开具医师', value: d.doctor })
					if (d.remark) rows.push({ label: '备注', value: d.remark })
					if (d.followUpNote) rows.push({ label: '复诊/调整备注', value: d.followUpNote })

					this.infoRows = rows
				}
			} catch (e) {
				uni.showToast({ title: '加载失败', icon: 'none' })
			}
		},
		onDelete() {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除「${this.drugName}」的用药记录吗？`,
				success: async (res) => {
					if (!res.confirm) return
					try {
						await deleteMedRecord(this.recordId)
						uni.showToast({ title: '已删除', icon: 'success' })
						setTimeout(() => uni.navigateBack(), 800)
					} catch (e) {
						uni.showToast({ title: '删除失败', icon: 'none' })
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
.drug-type {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
	background: rgba(0,0,0,0.06);
	padding: 6rpx 20rpx;
	border-radius: 20rpx;
	display: inline-block;
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
	flex-shrink: 0;
	margin-right: 20rpx;
}
.info-value {
	font-size: 28rpx;
	color: $uni-text-color;
	font-weight: 500;
	text-align: right;
	flex: 1;
	&.good { color: #059669; }
	&.warn { color: #D97706; }
}
.empty-hint {
	padding: 48rpx;
	text-align: center;
	font-size: 28rpx;
	color: #86909C;
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
