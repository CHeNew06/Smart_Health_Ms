<template>
	<view class="page-wrapper">
		<CustomNavbar title="用药管理" :showBack="true" bgColor="#4A90D9" titleColor="#fff" />

		<!-- Tab Bar -->
		<view class="tab-bar">
			<view v-for="(tab, i) in tabList" :key="i"
				:class="['tab-item', { active: tabIdx === i }]"
				@click="switchTab(i)">
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
						<textarea class="form-textarea" v-model="profile.drugAllergy" placeholder="无/具体药物名称" :disabled="!editMode" :auto-height="true" />
					</view>
					<view class="form-row">
						<text class="form-label">食物/其他过敏史</text>
						<textarea class="form-textarea" v-model="profile.otherAllergy" placeholder="无/具体过敏源" :disabled="!editMode" :auto-height="true" />
					</view>
					<view class="form-row">
						<text class="form-label">基础慢性病记录</text>
						<textarea class="form-textarea" v-model="profile.chronicDisease" placeholder="例：高血压、糖尿病" :disabled="!editMode" :auto-height="true" />
					</view>
					<view class="form-row">
						<text class="form-label">既往重大病史/手术史</text>
						<textarea class="form-textarea" v-model="profile.majorHistory" placeholder="无/具体病史或手术" :disabled="!editMode" :auto-height="true" />
					</view>
					<view class="form-row">
						<text class="form-label">长期固定服用药品</text>
						<textarea class="form-textarea" v-model="profile.longTermMeds" placeholder="药品名称、剂量" :disabled="!editMode" :auto-height="true" />
					</view>
					<view class="form-row">
						<text class="form-label">紧急联系人姓名</text>
						<input class="form-input" v-model="profile.emergencyContactName" placeholder="请输入联系人姓名" :disabled="!editMode" />
					</view>
					<view class="form-row">
						<text class="form-label">紧急联系人电话</text>
						<input class="form-input" v-model="profile.emergencyContactPhone" placeholder="请输入手机号码" type="number" :disabled="!editMode" />
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
				<!-- 已有记录列表 -->
				<view v-if="shortTermHistory.length" class="history-section">
					<text class="history-title">已有记录</text>
				<view v-for="(item, idx) in shortTermHistory" :key="'sh'+idx" class="history-card"
					@click="goDetail(item.id)">
					<view class="hc-top">
						<text class="hc-name">💊 {{ item.name }}</text>
						<text class="hc-date">{{ item.recordDate }}{{ item.recordEndDate ? ' ~ ' + item.recordEndDate : '' }}</text>
					</view>
						<view class="hc-info">
							<text v-if="item.dosage" class="hc-tag">{{ item.dosage }}</text>
							<text v-if="item.frequency" class="hc-tag">{{ item.frequency }}</text>
							<text v-if="item.onTime" class="hc-tag" :class="item.onTime === '是' ? 'tag-green' : 'tag-orange'">{{ item.onTime === '是' ? '按时服用' : item.onTime }}</text>
						</view>
					</view>
				</view>

				<text class="section-label">添加新记录</text>
				<view v-for="(item, idx) in shortTermMeds" :key="'s'+idx" class="med-card">
					<view class="med-card-header">
						<text class="med-no">药品 #{{ idx + 1 }}</text>
						<text v-if="shortTermMeds.length > 1" class="med-del" @click="removeShort(idx)">✕ 删除</text>
					</view>
					<view class="field-row">
						<text class="field-label">药品名称</text>
						<input class="field-input" v-model="item.name" placeholder="请输入药品名称" />
					</view>
				<view class="field-row field-row-wrap">
					<text class="field-label">医嘱频次</text>
					<view class="freq-tags">
						<view v-for="opt in freqOptions" :key="opt.value"
							:class="['freq-tag', { 'freq-active': isFreqSelected(item, opt.value) }]"
							@click="toggleFreq(item, opt.value)">
							<text>{{ opt.label }}</text>
						</view>
					</view>
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
				<text class="field-label">用药起始日期</text>
				<picker mode="date" @change="e => item.date = e.detail.value">
					<view class="field-input picker-val">{{ item.date || '选择起始日期' }}</view>
				</picker>
			</view>
			<view class="field-row">
				<text class="field-label">用药结束日期</text>
				<picker mode="date" :start="item.date || ''" @change="e => item.endDate = e.detail.value">
					<view class="field-input picker-val">{{ item.endDate || '选择结束日期' }}</view>
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
				<!-- 已有记录列表 -->
				<view v-if="longTermHistory.length" class="history-section">
					<text class="history-title">已有记录</text>
				<view v-for="(item, idx) in longTermHistory" :key="'lh'+idx" class="history-card"
					@click="goDetail(item.id)">
					<view class="hc-top">
						<text class="hc-name">💊 {{ item.name }}</text>
						<text class="hc-date">{{ item.recordDate }}{{ item.recordEndDate ? ' ~ ' + item.recordEndDate : '' }}</text>
					</view>
						<view class="hc-info">
							<text v-if="item.purpose" class="hc-tag tag-blue">{{ item.purpose }}</text>
							<text v-if="item.dosage" class="hc-tag">{{ item.dosage }}</text>
							<text v-if="item.frequency" class="hc-tag">{{ item.frequency }}</text>
						</view>
					</view>
				</view>

				<text class="section-label">添加新记录</text>
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
				<view class="field-row field-row-wrap">
					<text class="field-label">医嘱频次</text>
					<view class="freq-tags">
						<view v-for="opt in freqOptions" :key="opt.value"
							:class="['freq-tag', { 'freq-active': isFreqSelected(item, opt.value) }]"
							@click="toggleFreq(item, opt.value)">
							<text>{{ opt.label }}</text>
						</view>
					</view>
				</view>
				<view class="field-row">
					<text class="field-label">单次剂量</text>
					<input class="field-input" v-model="item.dosage" placeholder="如：1片" />
				</view>
				<view class="field-row">
					<text class="field-label">用药起始日期</text>
					<picker mode="date" @change="e => item.date = e.detail.value">
						<view class="field-input picker-val">{{ item.date || '选择起始日期' }}</view>
					</picker>
				</view>
				<view class="field-row">
					<text class="field-label">用药结束日期</text>
					<picker mode="date" :start="item.date || ''" @change="e => item.endDate = e.detail.value">
						<view class="field-input picker-val">{{ item.endDate || '选择结束日期' }}</view>
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
import { getMedProfile, updateMedProfile, getShortTermMeds, submitShortTermMeds, getLongTermMeds, submitLongTermMeds } from '@/api/medication'
import { isLoggedIn } from '@/utils/auth'

function emptyShort() {
	return { name: '', frequency: '', contraindication: '', dosage: '', date: '', endDate: '', onTime: '', sideEffect: '', doctor: '', remark: '' }
}
function emptyLong() {
	return { name: '', purpose: '', contraindication: '', frequency: '', dosage: '', date: '', endDate: '', onTime: '', sideEffect: '', doctor: '', followUpNote: '' }
}

export default {
	components: { CustomNavbar },
	data() {
		return {
			tabIdx: 0,
			tabList: ['用药人档案', '短期用药记录', '慢性病长期用药'],
			genderList: ['男', '女'],
			freqOptions: [
				{ label: '上午(8:00)', value: '上午(8:00)' },
				{ label: '中午(11:00)', value: '中午(11:00)' },
				{ label: '晚上(18:00)', value: '晚上(18:00)' },
				{ label: '睡前(22:00)', value: '睡前(22:00)' }
			],
			editMode: false,
			profile: {
				name: '',
				gender: '',
				age: '',
				drugAllergy: '',
				otherAllergy: '',
				chronicDisease: '',
				majorHistory: '',
				longTermMeds: '',
				emergencyContactName: '',
				emergencyContactPhone: ''
			},
			shortTermMeds: [emptyShort()],
			longTermMeds: [emptyLong()],
			shortTermHistory: [],
			longTermHistory: []
		}
	},
	onShow() {
		if (!isLoggedIn()) return
		this.loadProfile()
		this.loadShortHistory()
		this.loadLongHistory()
	},
	methods: {
		switchTab(i) {
			this.tabIdx = i
		},
		onGenderChange(e) {
			this.profile.gender = this.genderList[e.detail.value]
		},
		isFreqSelected(item, val) {
			if (!item.frequency) return false
			return item.frequency.split(',').includes(val)
		},
		toggleFreq(item, val) {
			const arr = item.frequency ? item.frequency.split(',').filter(s => s) : []
			const idx = arr.indexOf(val)
			if (idx >= 0) {
				arr.splice(idx, 1)
			} else {
				arr.push(val)
			}
			item.frequency = arr.join(',')
		},

		async loadProfile() {
			try {
				const res = await getMedProfile()
				if (res?.data) {
					const d = res.data
					this.profile = {
						name: d.name || '',
						gender: d.gender || '',
						age: d.age || '',
						drugAllergy: d.drugAllergy || '',
						otherAllergy: d.otherAllergy || '',
						chronicDisease: d.chronicDisease || '',
						majorHistory: d.majorHistory || '',
						longTermMeds: d.longTermMeds || '',
						emergencyContactName: d.emergencyContactName || '',
						emergencyContactPhone: d.emergencyContactPhone || ''
					}
				}
			} catch (e) {}
		},

		async saveProfile() {
			try {
				await updateMedProfile(this.profile)
				this.editMode = false
				uni.showToast({ title: '档案已保存', icon: 'success' })
			} catch (e) {
				uni.showToast({ title: '保存失败', icon: 'none' })
			}
		},

		async loadShortHistory() {
			try {
				const res = await getShortTermMeds()
				if (res?.data && Array.isArray(res.data)) {
					this.shortTermHistory = res.data
				}
			} catch (e) {}
		},

		async loadLongHistory() {
			try {
				const res = await getLongTermMeds()
				if (res?.data && Array.isArray(res.data)) {
					this.longTermHistory = res.data
				}
			} catch (e) {}
		},

		addShort() { this.shortTermMeds.push(emptyShort()) },
		removeShort(i) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除药品 #${i + 1} 吗？`,
				success: (res) => { if (res.confirm) this.shortTermMeds.splice(i, 1) }
			})
		},
		async submitShort() {
			const valid = this.shortTermMeds.some(m => m.name && m.name.trim())
			if (!valid) {
				uni.showToast({ title: '请至少填写一个药品名称', icon: 'none' })
				return
			}
			try {
				await submitShortTermMeds({ records: this.shortTermMeds })
				uni.showToast({ title: '短期记录已提交', icon: 'success' })
				this.shortTermMeds = [emptyShort()]
				this.loadShortHistory()
			} catch (e) {
				uni.showToast({ title: e?.message || '提交失败', icon: 'none' })
			}
		},

		addLong() { this.longTermMeds.push(emptyLong()) },
		removeLong(i) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除药品 #${i + 1} 吗？`,
				success: (res) => { if (res.confirm) this.longTermMeds.splice(i, 1) }
			})
		},
		async submitLong() {
			const valid = this.longTermMeds.some(m => m.name && m.name.trim())
			if (!valid) {
				uni.showToast({ title: '请至少填写一个药品名称', icon: 'none' })
				return
			}
			try {
				await submitLongTermMeds({ records: this.longTermMeds })
				uni.showToast({ title: '慢性病记录已提交', icon: 'success' })
				this.longTermMeds = [emptyLong()]
				this.loadLongHistory()
			} catch (e) {
				uni.showToast({ title: e?.message || '提交失败', icon: 'none' })
			}
		},

		goDetail(id) {
			uni.navigateTo({ url: '/pages/medication-detail/medication-detail?id=' + id })
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
.form-card {
	background: #fff; border-radius: 20rpx; padding: 24rpx;
	box-sizing: border-box; overflow: hidden;
}
.form-row {
	padding: 20rpx 0; border-bottom: 1rpx solid #F2F3F5;
	box-sizing: border-box;
	&:last-child { border-bottom: none; }
}
.form-label { display: block; font-size: 24rpx; color: #86909C; margin-bottom: 8rpx; }
.form-input {
	font-size: 28rpx; color: #1D2129; width: 100%;
	box-sizing: border-box; max-width: 100%;
	background: #F7F8FA; border-radius: 12rpx;
	padding: 16rpx 20rpx; height: 72rpx;
}
.form-textarea {
	font-size: 28rpx; color: #1D2129; width: 100%;
	box-sizing: border-box; max-width: 100%;
	min-height: 56rpx; background: #F7F8FA; border-radius: 12rpx;
	padding: 16rpx 20rpx; line-height: 1.5;
}
.picker-val {
	font-size: 28rpx; color: #1D2129; padding: 4rpx 0;
	box-sizing: border-box; max-width: 100%;
}

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

/* History section */
.history-section { margin-bottom: 32rpx; }
.history-title {
	display: block; font-size: 30rpx; font-weight: 600;
	color: #1D2129; margin-bottom: 16rpx;
}
.section-label {
	display: block; font-size: 30rpx; font-weight: 600;
	color: #1D2129; margin-bottom: 16rpx;
}
.history-card {
	background: #fff; border-radius: 16rpx;
	padding: 24rpx; margin-bottom: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.hc-top {
	display: flex; justify-content: space-between; align-items: center;
	margin-bottom: 12rpx;
}
.hc-name { font-size: 28rpx; font-weight: 600; color: #1D2129; }
.hc-date { font-size: 24rpx; color: #86909C; }
.hc-info { display: flex; flex-wrap: wrap; gap: 12rpx; }
.hc-tag {
	display: inline-block; padding: 6rpx 16rpx;
	background: #F2F3F5; border-radius: 8rpx;
	font-size: 22rpx; color: #4E5969;
}
.hc-tag.tag-green { background: #ECFDF5; color: #059669; }
.hc-tag.tag-orange { background: #FFFBEB; color: #D97706; }
.hc-tag.tag-blue { background: #EAF2FB; color: #4A90D9; }

/* 医嘱频次多选 */
.field-row-wrap { flex-wrap: wrap; }
.freq-tags { display: flex; flex-wrap: wrap; gap: 12rpx; flex: 1; }
.freq-tag {
	padding: 12rpx 24rpx; border-radius: 12rpx;
	background: #F2F3F5; font-size: 24rpx; color: #4E5969;
	border: 2rpx solid transparent; transition: all 0.2s;
}
.freq-tag.freq-active {
	background: #EAF2FB; color: #4A90D9;
	border-color: #4A90D9; font-weight: 500;
}
</style>
