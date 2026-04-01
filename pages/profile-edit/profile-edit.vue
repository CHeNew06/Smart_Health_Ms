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
					<image v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" mode="aspectFill" />
					<view v-else class="avatar-placeholder">
						<text class="avatar-icon">📷</text>
						<text class="avatar-hint">点击更换头像</text>
					</view>
				</view>
			</view>

			<!-- Form sections -->
			<view class="form-section">
				<text class="section-title">基本信息</text>
				<view class="form-item">
					<text class="label">账号</text>
					<input class="input input-disabled" v-model="form.account" disabled placeholder="账号不可修改" />
				</view>
				<view class="form-item">
					<text class="label">邮箱</text>
					<input class="input input-disabled" type="text" v-model="form.email" disabled placeholder="邮箱不可修改" />
				</view>
				<view class="form-item">
					<text class="label">昵称</text>
					<input class="input" v-model="form.nickname" placeholder="请输入昵称" />
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
					<picker mode="date" :value="form.birthday" @change="onBirthChange">
						<view class="picker-value">{{ form.birthday || '请选择日期' }}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="label">地区</text>
					<input class="input" v-model="form.region" placeholder="如：广东省深圳市" />
				</view>
				<view class="form-item">
					<text class="label">个性签名</text>
					<input class="input" v-model="form.signature" placeholder="请输入个性签名" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'
import { getUserProfile, updateUserProfile, uploadAvatar, getAvatarUrl } from '@/api/user'

export default {
	components: { CustomNavbar },
	data() {
		return {
			avatarUrl: '',
			saving: false,
			form: {
				account: '',
				email: '',
				nickname: '',
				gender: '保密',
				birthday: '',
				region: '',
				signature: ''
			}
		}
	},
	onLoad() {
		this.loadProfile()
	},
	methods: {
		async loadProfile() {
			try {
				const res = await getUserProfile()
				const d = res.data || {}
				this.form.account = d.account || ''
				this.form.email = d.email || ''
				this.form.nickname = d.nickname || ''
				const genderMap = { 0: '保密', 1: '男', 2: '女' }
				this.form.gender = genderMap[d.gender] || '保密'
				this.form.birthday = d.birthday || ''
				this.form.region = d.region || ''
				this.form.signature = d.signature || ''
				if (d.avatar) {
					this.avatarUrl = getAvatarUrl(d.avatar)
				}
			} catch (e) {
				// 加载失败静默处理
			}
		},
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				success: async (res) => {
					const tempPath = res.tempFilePaths[0]
					try {
						uni.showLoading({ title: '上传中...', mask: true })
						const uploadRes = await uploadAvatar(tempPath)
						uni.hideLoading()
						if (uploadRes.data && uploadRes.data.avatar) {
							this.avatarUrl = getAvatarUrl(uploadRes.data.avatar)
						} else {
							this.avatarUrl = tempPath
						}
						uni.showToast({ title: '头像上传成功', icon: 'success' })
					} catch (e) {
						uni.hideLoading()
						uni.showToast({ title: '上传失败', icon: 'none' })
					}
				}
			})
		},
		onBirthChange(e) {
			this.form.birthday = e.detail.value
		},
		async onSave() {
			if (this.saving) return
			if (!this.form.nickname) {
				uni.showToast({ title: '请输入昵称', icon: 'none' })
				return
			}
			this.saving = true
			const genderMap = { '男': 1, '女': 2, '保密': 0 }
			try {
				await updateUserProfile({
					nickname: this.form.nickname,
					gender: genderMap[this.form.gender] ?? 0,
					birthday: this.form.birthday || undefined,
					region: this.form.region || undefined,
					signature: this.form.signature || undefined
				})
				uni.showToast({ title: '保存成功', icon: 'success' })
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			} catch (e) {
				// request 内部已处理 toast
			} finally {
				this.saving = false
			}
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
	overflow: hidden;
}
.avatar-preview {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
}
.avatar-placeholder {
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
.input-disabled {
	color: #86909C;
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
