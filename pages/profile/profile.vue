<template>
	<view class="page page-profile">
		<!-- Header -->
		<view class="profile-header">
			<navigator url="/pages/profile-edit/profile-edit" class="avatar-wrap" hover-class="none">
				<image v-if="userInfo.avatar" :src="avatarFullUrl" class="avatar-img" mode="aspectFill" />
				<text v-else class="avatar-text">{{ displayInitial }}</text>
			</navigator>
			<text class="user-name">{{ userInfo.nickname || userInfo.account || '未登录' }}</text>
			<view class="badge">健康达人</view>
		</view>

		<!-- Menu groups -->
		<view class="menu-wrap">
			<view class="menu-group">
				<navigator url="/pages/profile-edit/profile-edit" class="menu-item" hover-class="none">
					<view class="menu-icon" style="background:#4A90D9;">👤</view>
					<text class="menu-title">个人信息</text>
					<text class="menu-arrow">›</text>
				</navigator>
				<navigator url="/pages/medication/medication" class="menu-item" hover-class="none">
					<view class="menu-icon" style="background:#34C759;">📋</view>
					<text class="menu-title">健康档案</text>
					<text class="menu-arrow">›</text>
				</navigator>
				<view class="menu-item" @click="noPage">
					<view class="menu-icon" style="background:#FF9500;">👨‍👩‍👧</view>
					<text class="menu-title">家庭成员</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			<view class="menu-group">
				<view class="menu-item" @click="noPage">
					<view class="menu-icon" style="background:#9B59B6;">🔔</view>
					<text class="menu-title">消息通知</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="noPage">
					<view class="menu-icon" style="background:#1ABC9C;">📤</view>
					<text class="menu-title">数据导出</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="noPage">
					<view class="menu-icon" style="background:#34495E;">🔒</view>
					<text class="menu-title">隐私设置</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			<view class="menu-group">
				<navigator url="/pages/settings/settings" class="menu-item" hover-class="none">
					<view class="menu-icon" style="background:#7F8C8D;">⚙</view>
					<text class="menu-title">设置</text>
					<text class="menu-arrow">›</text>
				</navigator>
				<view class="menu-item" @click="noPage">
					<view class="menu-icon" style="background:#3498DB;">❓</view>
					<text class="menu-title">帮助与反馈</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="noPage">
					<view class="menu-icon" style="background:#95A5A6;">ℹ</view>
					<text class="menu-title">关于我们</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- Logout -->
		<view class="logout-wrap">
			<button class="logout-btn" @click="doLogout">退出登录</button>
		</view>
		<CustomTabbar :current="3" />
	</view>
</template>

<script>
import CustomTabbar from '@/components/custom-tabbar.vue'
import { getUserBasicInfo, logout } from '@/api/auth'
import { getUserProfile, getAvatarUrl } from '@/api/user'
import { clearAuth, isLoggedIn, getUserInfo } from '@/utils/auth'

export default {
	components: { CustomTabbar },
	data() {
		return {
			userInfo: {}
		}
	},
	computed: {
		displayInitial() {
			const name = this.userInfo.nickname || this.userInfo.account || ''
			return name ? name.charAt(0) : '?'
		},
		avatarFullUrl() {
			return getAvatarUrl(this.userInfo.avatar)
		}
	},
	onShow() {
		uni.hideTabBar()
		this.loadUserInfo()
	},
	methods: {
		async loadUserInfo() {
			if (!isLoggedIn()) {
				this.userInfo = {}
				return
			}
			const local = getUserInfo()
			if (local) this.userInfo = local
			try {
				const res = await getUserBasicInfo()
				if (res.data) {
					this.userInfo = { ...this.userInfo, ...res.data }
				}
			} catch (e) {}
			try {
				const profileRes = await getUserProfile()
				if (profileRes.data) {
					const p = profileRes.data
					if (p.avatar) {
						this.userInfo = { ...this.userInfo, avatar: p.avatar }
					}
					if (p.nickname && !this.userInfo.nickname) {
						this.userInfo.nickname = p.nickname
					}
				}
			} catch (e) {}
		},
		noPage() {
			uni.showToast({ title: '功能开发中', icon: 'none' })
		},
		doLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (!res.confirm) return
					logout().catch(() => {})
					clearAuth()
					uni.reLaunch({ url: '/pages/login/login' })
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #e2eef0;
	padding-bottom: 120rpx;
}
.profile-header {
	background: linear-gradient(135deg, #4A90D9 0%, #3A7BC8 100%);
	padding: calc(var(--status-bar-height, 44px) + 40rpx) 32rpx 48rpx;
	text-align: center;
	border-radius: 0 0 32rpx 32rpx;
}
.avatar-wrap {
	width: 128rpx;
	height: 128rpx;
	background: rgba(255,255,255,0.3);
	border-radius: 50%;
	margin: 0 auto 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.avatar-img {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
}
.avatar-text {
	font-size: 48rpx;
	color: #fff;
	font-weight: 600;
}
.user-name {
	font-size: 36rpx;
	color: #fff;
	font-weight: 600;
	display: block;
	margin-bottom: 12rpx;
}
.badge {
	display: inline-block;
	padding: 8rpx 24rpx;
	background: rgba(255,255,255,0.25);
	border-radius: 32rpx;
	font-size: 24rpx;
	color: #fff;
}
.menu-wrap {
	padding: 0 24rpx;
}
.menu-group {
	background: #fff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
}
.menu-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #E5E6EB;
	&:last-child { border-bottom: none; }
}
.menu-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	font-size: 32rpx;
}
.menu-title { flex: 1; font-size: 30rpx; color: #1D2129; }
.menu-arrow { font-size: 32rpx; color: #C9CDD4; }
.logout-wrap {
	padding: 48rpx 24rpx;
}
.logout-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: transparent;
	border: 2rpx solid #FF3B30;
	color: #FF3B30;
	border-radius: 16rpx;
	font-size: 30rpx;
}
</style>
