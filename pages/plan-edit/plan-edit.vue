<template>
	<view class="page-wrapper">
		<CustomNavbar title="计划编辑" :show-back="true">
			<template #right>
				<text class="nav-save" @click="onSave">保存</text>
			</template>
		</CustomNavbar>
		<TabSwitch :tabs="['运动', '饮食', '用药', '复查']" v-model="tabIndex" />

		<view class="content">
			<!-- 运动 Tab -->
			<view v-show="tabIndex === 0" class="tab-content">
				<view v-for="(item, i) in exerciseItems" :key="i" class="exercise-item">
					<text class="ex-icon">{{ item.icon }}</text>
					<view class="ex-body">
						<text class="ex-name">{{ item.name }}</text>
						<text class="ex-detail">{{ item.detail }}</text>
					</view>
				</view>
				<view class="add-btn" @click="addExercise">
					<text>＋ 添加运动</text>
				</view>
			</view>

			<!-- 饮食 Tab -->
			<view v-show="tabIndex === 1" class="tab-content">
				<view v-for="(meal, mi) in mealCards" :key="mi" class="meal-card">
					<text class="meal-title">{{ meal.title }}</text>
					<view class="food-tags">
						<text
							v-for="(f, fi) in meal.foods"
							:key="fi"
							class="food-tag"
							:class="f.recommended ? 'recommended' : 'avoid'"
						>{{ f.name }}</text>
					</view>
				</view>
				<view class="add-btn" @click="addFood">
					<text>＋ 添加食物</text>
				</view>
			</view>

			<!-- 用药 Tab -->
			<view v-show="tabIndex === 2" class="tab-content">
				<view class="form-row">
					<text class="form-label">药物名称</text>
					<input class="form-input" placeholder="请输入药物名称" v-model="medForm.name" />
				</view>
				<view class="form-row">
					<text class="form-label">剂量</text>
					<input class="form-input" placeholder="如 100mg" v-model="medForm.dose" />
				</view>
				<view class="form-row">
					<text class="form-label">频次</text>
					<input class="form-input" placeholder="如 每日两次" v-model="medForm.freq" />
				</view>
				<view class="form-row">
					<text class="form-label">时间</text>
					<input class="form-input" placeholder="如 早晚饭后" v-model="medForm.time" />
				</view>
				<navigator url="/pages/medication/medication" class="med-link" hover-class="none">
					<text>前往用药管理 ›</text>
				</navigator>
			</view>

			<!-- 复查 Tab -->
			<view v-show="tabIndex === 3" class="tab-content">
				<view v-for="(item, i) in checkupItems" :key="i" class="checkup-item">
					<view class="checkup-date">{{ item.date }}</view>
					<text class="checkup-type" :class="item.typeClass">{{ item.type }}</text>
					<text class="checkup-hospital">{{ item.hospital }}</text>
				</view>
				<view class="add-btn" @click="addCheckup">
					<text>＋ 添加复查</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/custom-navbar.vue'
	import TabSwitch from '@/components/tab-switch.vue'
	export default {
		components: { CustomNavbar, TabSwitch },
		data() {
			return {
				tabIndex: 0,
				exerciseItems: [
					{ icon: '🏃', name: '快走', detail: '30分钟/次，每周5次' },
					{ icon: '🧘', name: '太极拳', detail: '20分钟/次，每周3次' },
					{ icon: '🚶', name: '散步', detail: '45分钟/次，每日' }
				],
				mealCards: [
					{ title: '早餐', foods: [
						{ name: '燕麦粥', recommended: true },
						{ name: '水煮蛋', recommended: true },
						{ name: '油条', recommended: false }
					]},
					{ title: '午餐', foods: [
						{ name: '糙米饭', recommended: true },
						{ name: '清蒸鱼', recommended: true },
						{ name: '青菜', recommended: true }
					]},
					{ title: '晚餐', foods: [
						{ name: '杂粮粥', recommended: true },
						{ name: '炒腊肉', recommended: false }
					]}
				],
				medForm: { name: '', dose: '', freq: '', time: '' },
				checkupItems: [
					{ date: '2025-04-15', type: '血常规', typeClass: 'type-a', hospital: '市人民医院' },
					{ date: '2025-05-20', type: '肝肾功能', typeClass: 'type-b', hospital: '市人民医院' }
				]
			}
		},
		methods: {
			onSave() {
				uni.showToast({ title: '保存成功', icon: 'success' })
			},
			addExercise() {
				this.exerciseItems.push({ icon: '⚽', name: '新运动', detail: '请编辑' })
			},
			addFood() {
				uni.showToast({ title: '添加食物', icon: 'none' })
			},
			addCheckup() {
				this.checkupItems.push({
					date: new Date().toISOString().slice(0, 10),
					type: '新复查',
					typeClass: 'type-a',
					hospital: '请选择医院'
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
	.nav-save {
		font-size: 28rpx;
		color: $theme-primary;
		font-weight: 500;
	}
	.content {
		padding: 24rpx 32rpx;
	}
	.tab-content {
		background: #fff;
		border-radius: $uni-radius-base;
		padding: 28rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}
	.exercise-item {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
		&:last-of-type { border-bottom: none; }
	}
	.ex-icon {
		font-size: 44rpx;
		width: 72rpx;
		text-align: center;
		margin-right: 20rpx;
	}
	.ex-body {
		flex: 1;
	}
	.ex-name {
		display: block;
		font-size: 30rpx;
		font-weight: 600;
		color: $uni-text-color;
		margin-bottom: 6rpx;
	}
	.ex-detail {
		font-size: 24rpx;
		color: $uni-text-color-secondary;
	}
	.meal-card {
		padding: 24rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
		&:last-of-type { border-bottom: none; }
	}
	.meal-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: $uni-text-color;
		margin-bottom: 16rpx;
	}
	.food-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
	}
	.food-tag {
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		&.recommended {
			background: #E8F5E9;
			color: #2E7D32;
		}
		&.avoid {
			background: #FFEBEE;
			color: #C62828;
		}
	}
	.form-row {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
	}
	.form-label {
		width: 160rpx;
		font-size: 28rpx;
		color: $uni-text-color-secondary;
		flex-shrink: 0;
	}
	.form-input {
		flex: 1;
		font-size: 28rpx;
		color: $uni-text-color;
	}
	.med-link {
		margin-top: 24rpx;
		font-size: 28rpx;
		color: $theme-primary;
	}
	.checkup-item {
		padding: 24rpx 0;
		border-bottom: 2rpx solid #F0F1F3;
		&:last-of-type { border-bottom: none; }
	}
	.checkup-date {
		font-size: 26rpx;
		color: $uni-text-color-secondary;
		margin-bottom: 8rpx;
	}
	.checkup-type {
		display: inline-block;
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		margin-right: 12rpx;
		&.type-a { background: #E3F2FD; color: #1565C0; }
		&.type-b { background: #F3E5F5; color: #7B1FA2; }
	}
	.checkup-hospital {
		font-size: 26rpx;
		color: $uni-text-color-secondary;
	}
	.add-btn {
		margin-top: 24rpx;
		padding: 24rpx;
		text-align: center;
		border: 2rpx dashed $theme-primary;
		border-radius: 16rpx;
		color: $theme-primary;
		font-size: 28rpx;
	}
</style>
