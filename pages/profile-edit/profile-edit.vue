<template>
	<view class="page page-profile-edit">
		<CustomNavbar title="个人信息" :show-back="true">
			<template #right>
				<text class="nav-save" @click="onSave">保存</text>
			</template>
		</CustomNavbar>
		<view class="page-body">
			<!-- Avatar -->
			<view class="avatar-section">
				<view class="avatar-upload" @click="chooseAvatar">
					<text class="avatar-icon">📷</text>
					<text class="avatar-hint">点击更换头像</text>
				</view>
			</view>

			<!-- Form sections -->
			<view class="form-section">
				<text class="section-title">基本信息</text>
				<view class="form-item">
					<text class="label">姓名</text>
					<input class="input" v-model="form.name" placeholder="请输入姓名" />
				</view>
				<view class="form-item">
					<text class="label">性别</text>
					<view class="pill-group">
						<view
							v-for="g in ['男','女','保密']"
							:key="g"
							class="pill"
							:class="{ active: form.gender === g }"
							@click="form.gender = g"
						>
							<text>{{ g }}</text>
						</view>
					</view>
				</view>
				<view class="form-item">
					<text class="label">出生日期</text>
					<picker mode="date" :value="form.birthDate" @change="onBirthChange">
						<view class="picker-value">{{ form.birthDate || '请选择日期' }}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="label">身高</text>
					<input class="input" type="digit" v-model="form.height" placeholder="cm" />
				</view>
				<view class="form-item">
					<text class="label">体重</text>
					<input class="input" type="digit" v-model="form.weight" placeholder="kg" />
				</view>
			</view>

			<view class="form-section">
				<text class="section-title">联系方式</text>
				<view class="form-item">
					<text class="label">手机号</text>
					<input class="input" type="number" v-model="form.phone" placeholder="请输入手机号" />
				</view>
				<view class="form-item">
					<text class="label">邮箱</text>
					<input class="input" type="text" v-model="form.email" placeholder="请输入邮箱" />
				</view>
				<view class="form-item">
					<text class="label">地址</text>
					<input class="input" v-model="form.address" placeholder="请输入地址" />
				</view>
			</view>

			<view class="form-section">
				<text class="section-title">紧急联系人</text>
				<view class="form-item">
					<text class="label">姓名</text>
					<input class="input" v-model="form.emergencyName" placeholder="请输入联系人姓名" />
				</view>
				<view class="form-item">
					<text class="label">关系</text>
					<input class="input" v-model="form.emergencyRel" placeholder="如：子女、配偶" />
				</view>
				<view class="form-item">
					<text class="label">电话</text>
					<input class="input" type="number" v-model="form.emergencyPhone" placeholder="请输入联系电话" />
				</view>
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
			form: {
				name: '张老先生',
				gender: '男',
				birthDate: '1950-01-15',
				height: '168',
				weight: '65',
				phone: '13800138000',
				email: '',
				address: '',
				emergencyName: '',
				emergencyRel: '',
				emergencyPhone: ''
			}
		}
	},
	methods: {
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					uni.showToast({ title: '已选择头像', icon: 'none' })
				}
			})
		},
		onBirthChange(e) {
			this.form.birthDate = e.detail.value
		},
		onSave() {
			uni.showToast({ title: '保存成功', icon: 'success' })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #e2eef0;
}
.nav-save {
	font-size: 30rpx;
	color: #4A90D9;
}
.page-body {
	padding: 24rpx;
}
.avatar-section {
	display: flex;
	justify-content: center;
	margin-bottom: 32rpx;
}
.avatar-upload {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	background: #fff;
	border: 4rpx dashed #C9CDD4;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.avatar-icon {
	font-size: 64rpx;
	margin-bottom: 8rpx;
}
.avatar-hint {
	font-size: 22rpx;
	color: #4E5969;
}
.form-section {
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}
.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1D2129;
	display: block;
	margin-bottom: 24rpx;
	padding-left: 8rpx;
	border-left: 6rpx solid #4A90D9;
}
.form-item {
	margin-bottom: 24rpx;
	&:last-child { margin-bottom: 0; }
}
.label {
	font-size: 26rpx;
	color: #4E5969;
	display: block;
	margin-bottom: 12rpx;
}
.input {
	height: 72rpx;
	background: #F5F7FA;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}
.pill-group {
	display: flex;
	gap: 16rpx;
}
.pill {
	padding: 16rpx 32rpx;
	background: #F5F7FA;
	border-radius: 32rpx;
	font-size: 28rpx;
	color: #4E5969;
	&.active {
		background: #4A90D9;
		color: #fff;
	}
}
.picker-value {
	height: 72rpx;
	line-height: 72rpx;
	background: #F5F7FA;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #1D2129;
}
</style>
