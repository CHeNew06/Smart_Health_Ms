<template>
	<view class="page-wrapper">
		<CustomNavbar title="用药管理" :showBack="true" bgColor="#4A90D9" titleColor="#fff" />

		<!-- Tab Bar -->
		<view class="tab-bar">
			<view v-for="(tab, i) in tabList" :key="i"
				:class="['tab-item', { active: tabIdx === i }]"
				@click="tabIdx = i">
				<text>{{ tab }}</text>
			</view>
		</view>

		<scroll-view scroll-y class="content-scroll">
			<!-- Tab 0: 用药人档案 -->
			<view v-if="tabIdx === 0" class="tab-content">
				<view class="form-card">
					<view class="form-row">
						<text class="form-label">姓名</text>
						<input class="form-input" v-model="profile.name" placeholder="请输入姓名" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">性别</text>
						<picker :range="genderList" @change="onGenderChange" :disabled="!editMode">
							<view class="form-input picker-val">{{ profile.gender || '请选择' }}</view>
						</picker>
					</view>
					<view class="form-row">
						<text class="form-label">年龄</text>
						<input class="form-input" v-model="profile.age" placeholder="请输入年龄" type="number" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">药物过敏史</text>
						<textarea class="form-textarea" v-model="profile.drugAllergy" placeholder="无/具体药物名称" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">食物/其他过敏史</text>
						<textarea class="form-textarea" v-model="profile.otherAllergy" placeholder="无/具体过敏源" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">基础慢性病记录</text>
						<textarea class="form-textarea" v-model="profile.chronicDisease" placeholder="例：高血压、糖尿病" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">既往重大病史/手术史</text>
						<textarea class="form-textarea" v-model="profile.majorHistory" placeholder="无/具体病史或手术" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">长期固定服用药品</text>
						<textarea class="form-textarea" v-model="profile.longTermMeds" placeholder="药品名称、剂量" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">紧急联系人</text>
						<input class="form-input" v-model="profile.emergencyContact" placeholder="姓名 + 电话" :disabled="!editMode" />
					</view>
				</view>
				<view class="btn-group">
					<view v-if="!editMode" class="btn-primary" @click="editMode = true">
						<text>✏️ 编辑档案</text>
					</view>
					<view v-else class="btn-primary" @click="saveProfile">
						<text>💾 保存档案</text>
					</view>
				</view>
			</view>

			<!-- Tab 1: 短期用药记录 -->
			<view v-if="tabIdx === 1" class="tab-content">
				<view v-for="(item, idx) in shortTermMeds" :key="'s'+idx" class="med-card">
					<view class="med-card-header">
						<text class="med-no">药品 #{{ idx + 1 }}</text>
						<text v-if="shortTermMeds.length > 1" class="med-del" @click="removeShort(idx)">✕ 删除</text>
					</view>
					<view class="field-row">
						<text class="field-label">药品名称</text>
						<input class="field-input" v-model="item.name" placeholder="请输入药品名称" />
					</view>
					<view class="field-row">
						<text class="field-label">医嘱频次</text>
						<input class="field-input" v-model="item.frequency" placeholder="如：每日3次" />
					</view>
					<view class="field-row">
						<text class="field-label">用药禁忌</text>
						<input class="field-input" v-model="item.contraindication" placeholder="无/具体禁忌" />
					</view>
					<view class="field-row">
						<text class="field-label">单次剂量</text>
						<input class="field-input" v-model="item.dosage" placeholder="如：1片/5ml" />
					</view>
					<view class="field-row">
						<text class="field-label">用药日期</text>
						<picker mode="date" @change="e => item.date = e.detail.value">
							<view class="field-input picker-val">{{ item.date || '选择日期' }}</view>
						</picker>
					</view>
					<view class="field-row">
						<text class="field-label">是否按时服用</text>
						<picker :range="['是', '否', '未记录']" @change="e => item.onTime = ['是','否','未记录'][e.detail.value]">
							<view class="field-input picker-val">{{ item.onTime || '请选择' }}</view>
						</picker>
					</view>
					<view class="field-row">
						<text class="field-label">不良反应</text>
						<input class="field-input" v-model="item.sideEffect" placeholder="无/具体不良反应" />
					</view>
					<view class="field-row">
						<text class="field-label">开具医师</text>
						<input class="field-input" v-model="item.doctor" placeholder="医师姓名" />
					</view>
					<view class="field-row">
						<text class="field-label">备注</text>
						<input class="field-input" v-model="item.remark" placeholder="其他说明" />
					</view>
				</view>
				<view class="add-row" @click="addShort">
					<text>+ 添加药品</text>
				</view>
				<view class="btn-group">
					<view class="btn-primary" @click="submitShort">
						<text>📤 提交短期用药记录</text>
					</view>
				</view>
			</view>

			<!-- Tab 2: 慢性病长期用药记录 -->
			<view v-if="tabIdx === 2" class="tab-content">
				<view v-for="(item, idx) in longTermMeds" :key="'l'+idx" class="med-card">
					<view class="med-card-header">
						<text class="med-no">药品 #{{ idx + 1 }}</text>
						<text v-if="longTermMeds.length > 1" class="med-del" @click="removeLong(idx)">✕ 删除</text>
					</view>
					<view class="field-row">
						<text class="field-label">药品名称</text>
						<input class="field-input" v-model="item.name" placeholder="请输入药品名称" />
					</view>
					<view class="field-row">
						<text class="field-label">治疗病症/用途</text>
						<input class="field-input" v-model="item.purpose" placeholder="如：高血压" />
					</view>
					<view class="field-row">
						<text class="field-label">用药禁忌</text>
						<input class="field-input" v-model="item.contraindication" placeholder="无/具体禁忌" />
					</view>
					<view class="field-row">
						<text class="field-label">医嘱频次</text>
						<input class="field-input" v-model="item.frequency" placeholder="如：每日2次" />
					</view>
					<view class="field-row">
						<text class="field-label">单次剂量</text>
						<input class="field-input" v-model="item.dosage" placeholder="如：1片" />
					</view>
					<view class="field-row">
						<text class="field-label">用药日期</text>
						<picker mode="date" @change="e => item.date = e.detail.value">
							<view class="field-input picker-val">{{ item.date || '选择日期' }}</view>
						</picker>
					</view>
					<view class="field-row">
						<text class="field-label">是否按时服用</text>
						<picker :range="['是', '否', '未记录']" @change="e => item.onTime = ['是','否','未记录'][e.detail.value]">
							<view class="field-input picker-val">{{ item.onTime || '请选择' }}</view>
						</picker>
					</view>
					<view class="field-row">
						<text class="field-label">不良反应</text>
						<input class="field-input" v-model="item.sideEffect" placeholder="无/具体不良反应" />
					</view>
					<view class="field-row">
						<text class="field-label">开具医师</text>
						<input class="field-input" v-model="item.doctor" placeholder="医师姓名" />
					</view>
					<view class="field-row">
						<text class="field-label">复诊/调整备注</text>
						<input class="field-input" v-model="item.followUpNote" placeholder="复诊计划或剂量调整说明" />
					</view>
				</view>
				<view class="add-row" @click="addLong">
					<text>+ 添加药品</text>
				</view>
				<view class="btn-group">
					<view class="btn-primary" @click="submitLong">
						<text>📤 提交慢性病用药记录</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'

function emptyShort() {
	return { name: '', frequency: '', contraindication: '', dosage: '', date: '', onTime: '', sideEffect: '', doctor: '', remark: '' }
}
function emptyLong() {
	return { name: '', purpose: '', contraindication: '', frequency: '', dosage: '', date: '', onTime: '', sideEffect: '', doctor: '', followUpNote: '' }
}

export default {
	components: { CustomNavbar },
	data() {
		return {
			tabIdx: 0,
			tabList: ['用药人档案', '短期用药记录', '慢性病长期用药'],
			genderList: ['男', '女'],
			editMode: false,
			profile: {
				name: '张三',
				gender: '男',
				age: '72',
				drugAllergy: '青霉素',
				otherAllergy: '无',
				chronicDisease: '高血压、2型糖尿病',
				majorHistory: '2018年心脏支架手术',
				longTermMeds: '氨氯地平 5mg/日、二甲双胍 500mg×2/日',
				emergencyContact: '张小明 138-0000-1234'
			},
			shortTermMeds: [emptyShort(), emptyShort(), emptyShort()],
			longTermMeds: [emptyLong(), emptyLong(), emptyLong()]
		}
	},
	methods: {
		onGenderChange(e) {
			this.profile.gender = this.genderList[e.detail.value]
		},
		saveProfile() {
			this.editMode = false
			uni.showToast({ title: '档案已保存', icon: 'success' })
		},
		addShort() { this.shortTermMeds.push(emptyShort()) },
		removeShort(i) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除药品 #${i + 1} 吗？`,
				success: (res) => { if (res.confirm) this.shortTermMeds.splice(i, 1) }
			})
		},
		submitShort() {
			uni.showToast({ title: '短期记录已提交', icon: 'success' })
		},
		addLong() { this.longTermMeds.push(emptyLong()) },
		removeLong(i) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除药品 #${i + 1} 吗？`,
				success: (res) => { if (res.confirm) this.longTermMeds.splice(i, 1) }
			})
		},
		submitLong() {
			uni.showToast({ title: '慢性病记录已提交', icon: 'success' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrapper { min-height: 100vh; background: #e2eef0; }

/* Tab Bar */
.tab-bar {
	display: flex; background: #fff;
	border-bottom: 1rpx solid #E5E6EB;
	padding: 0 12rpx;
}
.tab-item {
	flex: 1; text-align: center; padding: 24rpx 8rpx;
	font-size: 26rpx; color: #86909C;
	border-bottom: 4rpx solid transparent;
}
.tab-item.active { color: #4A90D9; font-weight: 600; border-bottom-color: #4A90D9; }

/* Scroll */
.content-scroll { height: calc(100vh - var(--status-bar-height, 44px) - 44px - 90rpx); }
.tab-content { padding: 24rpx 28rpx; }

/* Profile Form */
.form-card { background: #fff; border-radius: 20rpx; padding: 24rpx; }
.form-row {
	padding: 20rpx 0; border-bottom: 1rpx solid #F2F3F5;
	&:last-child { border-bottom: none; }
}
.form-label { display: block; font-size: 24rpx; color: #86909C; margin-bottom: 8rpx; }
.form-input {
	font-size: 28rpx; color: #1D2129; width: 100%;
	background: transparent; padding: 4rpx 0;
}
.form-textarea {
	font-size: 28rpx; color: #1D2129; width: 100%;
	min-height: 80rpx; background: transparent; padding: 4rpx 0;
}
.picker-val { font-size: 28rpx; color: #1D2129; padding: 4rpx 0; }

/* Btn */
.btn-group { padding: 32rpx 0 120rpx; }
.btn-primary {
	background: #4A90D9; border-radius: 16rpx;
	padding: 26rpx; text-align: center; color: #fff;
	font-size: 28rpx; font-weight: 600;
}

/* Med Card */
.med-card {
	background: #fff; border-radius: 20rpx;
	padding: 24rpx; margin-bottom: 20rpx;
}
.med-card-header {
	display: flex; justify-content: space-between; align-items: center;
	margin-bottom: 16rpx; padding-bottom: 12rpx;
	border-bottom: 1rpx solid #F2F3F5;
}
.med-no { font-size: 28rpx; font-weight: 600; color: #4A90D9; }
.med-del { font-size: 24rpx; color: #EF4444; }

.field-row {
	display: flex; align-items: center; padding: 14rpx 0;
	border-bottom: 1rpx solid #F2F3F5;
	&:last-child { border-bottom: none; }
}
.field-label { width: 180rpx; font-size: 24rpx; color: #86909C; flex-shrink: 0; }
.field-input { flex: 1; font-size: 26rpx; color: #1D2129; }

/* Add row */
.add-row {
	display: flex; justify-content: center; align-items: center;
	padding: 24rpx; border: 2rpx dashed #C9CDD4; border-radius: 16rpx;
	margin: 12rpx 0; font-size: 28rpx; color: #4A90D9; font-weight: 500;
}
</style>
