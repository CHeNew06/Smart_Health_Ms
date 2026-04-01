<template>
  <view class="page">
    <view class="login-header">
      <view class="login-logo">
        <text class="logo-icon">♥</text>
      </view>
      <text class="login-title">智慧健康</text>
      <text class="login-subtitle">智慧养老健康管理系统</text>
    </view>

    <view class="login-body">
      <!-- Tabs -->
      <view class="login-tabs">
        <view
          class="login-tab"
          :class="{ active: loginMode === 'password' }"
          @click="loginMode = 'password'"
        >
          <text>账号密码登录</text>
        </view>
        <view
          class="login-tab"
          :class="{ active: loginMode === 'code' }"
          @click="loginMode = 'code'"
        >
          <text>验证码登录</text>
        </view>
      </view>

      <!-- Password Mode -->
      <view v-show="loginMode === 'password'" class="form-block">
        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">✉</text>
            <input
              class="input-field"
              v-model="account"
              placeholder="请输入邮箱或账号"
              placeholder-class="placeholder"
            />
          </view>
        </view>
        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input
              class="input-field"
              :password="!showPassword"
              v-model="password"
              placeholder="请输入密码"
              placeholder-class="placeholder"
            />
            <text class="pwd-toggle" @click="showPassword = !showPassword">
              {{ showPassword ? '👁' : '👁‍🗨' }}
            </text>
          </view>
        </view>
        <view class="remember-row">
          <view class="remember-check" @click="rememberPassword = !rememberPassword">
            <text class="checkbox" :class="{ checked: rememberPassword }">{{ rememberPassword ? '✓' : '' }}</text>
            <text class="remember-text">记住密码</text>
          </view>
          <text class="forgot-link">忘记密码？</text>
        </view>
      </view>

      <!-- Code Mode -->
      <view v-show="loginMode === 'code'" class="form-block">
        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-icon">✉</text>
            <input
              class="input-field"
              v-model="email"
              type="text"
              placeholder="请输入邮箱"
              placeholder-class="placeholder"
            />
          </view>
        </view>
        <view class="input-group">
          <view class="input-wrapper code-input-wrapper">
            <text class="input-icon">🛡</text>
            <input
              class="input-field"
              v-model="verifyCode"
              placeholder="请输入验证码"
              placeholder-class="placeholder"
              maxlength="6"
            />
            <view
              class="code-btn"
              :class="{ disabled: countdown > 0 }"
              @click="getVerifyCode"
            >
              <text>{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="login-btn" @click="handleLogin">
        <text>登 录</text>
      </view>

      <view class="try-btn" @click="handleTry">
        <text>立即体验</text>
      </view>

      <view class="login-footer">
        <text>还没有账号？</text><navigator url="/pages/register/register" class="register-link">立即注册</navigator>
      </view>
    </view>
  </view>
</template>

<script>
import { login, sendVerifyCode } from '@/api/auth'
import { setToken, setRefreshToken, setUserInfo } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      loginMode: 'password',
      account: '',
      password: '',
      email: '',
      verifyCode: '',
      showPassword: false,
      rememberPassword: false,
      countdown: 0,
      timer: null,
      loading: false
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    async getVerifyCode() {
      if (this.countdown > 0) return
      if (!this.email) {
        uni.showToast({ title: '请输入邮箱', icon: 'none' })
        return
      }
      try {
        await sendVerifyCode({ email: this.email, scene: 'login' })
        uni.showToast({ title: '验证码已发送', icon: 'success' })
      } catch (e) {
        return
      }
      this.countdown = 60
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0 && this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    async handleLogin() {
      if (this.loading) return
      if (this.loginMode === 'password') {
        if (!this.account || !this.password) {
          uni.showToast({ title: '请输入账号和密码', icon: 'none' })
          return
        }
        this.loading = true
        try {
          const res = await login({ accountOrEmail: this.account, password: this.password })
          this.onLoginSuccess(res.data)
        } catch (e) {
          // request 内部已处理 toast
        } finally {
          this.loading = false
        }
      } else {
        if (!this.email || !this.verifyCode) {
          uni.showToast({ title: '请输入邮箱和验证码', icon: 'none' })
          return
        }
        this.loading = true
        try {
          const res = await login({ accountOrEmail: this.email, code: this.verifyCode })
          this.onLoginSuccess(res.data)
        } catch (e) {
          // request 内部已处理 toast
        } finally {
          this.loading = false
        }
      }
    },
    onLoginSuccess(data) {
      if (!data) {
        uni.showToast({ title: '登录响应异常', icon: 'none' })
        return
      }
      const accessToken = data.token || data.accessToken
      const refresh = data.refreshToken || data.refresh_token
      if (!accessToken) {
        console.warn('[login] 登录响应中无 token 字段:', JSON.stringify(data))
        uni.showToast({ title: '登录异常，未获取到令牌', icon: 'none' })
        return
      }
      setToken(accessToken)
      if (refresh) setRefreshToken(refresh)
      setUserInfo({
        userId: data.userId || data.uid || data.id,
        account: data.account,
        nickname: data.nickname
      })
      uni.switchTab({ url: '/pages/home/home' })
    },
    handleTry() {
      uni.switchTab({ url: '/pages/home/home' })
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-primary: #4A90D9;
$theme-primary-dark: #3a7bc8;
$theme-light: #e2eef0;
$input-bg: #F5F7FA;
$input-border: #E5E6EB;

.page {
  min-height: 100vh;
  background: $theme-light;
}

.login-header {
  background: linear-gradient(135deg, $theme-primary 0%, $theme-primary-dark 100%);
  padding: 120rpx 48rpx 80rpx;
  text-align: center;
  color: #fff;
}

.login-logo {
  width: 144rpx;
  height: 144rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28rpx;
}

.logo-icon {
  font-size: 64rpx;
  color: #fff;
}

.login-title {
  font-size: 48rpx;
  font-weight: 700;
  display: block;
}

.login-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
  margin-top: 12rpx;
  display: block;
}

.login-body {
  margin-top: -40rpx;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 56rpx 48rpx;
  position: relative;
}

.login-tabs {
  display: flex;
  background: $input-bg;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-bottom: 48rpx;
}

.login-tab {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  color: #9CA3AF;
  border-radius: 16rpx;
  transition: all 0.2s;

  &.active {
    background: #fff;
    color: $theme-primary;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }
}

.form-block {
  margin-bottom: 16rpx;
}

.input-group {
  margin-bottom: 32rpx;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  &.code-input-wrapper .input-field {
    padding-right: 200rpx;
  }
}

.input-icon {
  position: absolute;
  left: 28rpx;
  font-size: 30rpx;
  z-index: 1;
}

.input-field {
  width: 100%;
  height: 88rpx;
  background: $input-bg;
  border: 2rpx solid $input-border;
  border-radius: 16rpx;
  padding: 0 28rpx 0 80rpx;
  font-size: 28rpx;
  color: #1F2937;
}

.placeholder {
  color: #9CA3AF;
}

.pwd-toggle {
  position: absolute;
  right: 28rpx;
  font-size: 30rpx;
  padding: 10rpx;
}

.code-btn {
  position: absolute;
  right: 16rpx;
  padding: 12rpx 24rpx;
  background: rgba($theme-primary, 0.1);
  color: $theme-primary;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 500;

  &.disabled {
    opacity: 0.5;
  }
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  font-size: 26rpx;
}

.remember-check {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.checkbox {
  width: 44rpx;
  height: 44rpx;
  border: 2rpx solid #D1D5DB;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;

  &.checked {
    background: $theme-primary;
    border-color: $theme-primary;
  }
}

.remember-text {
  color: #4B5563;
}

.forgot-link {
  color: $theme-primary;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: $theme-primary;
  color: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  margin-top: 16rpx;
}

.try-btn {
  width: 100%;
  height: 88rpx;
  background: #fff;
  color: $theme-primary;
  border: 2rpx solid $theme-primary;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  margin-top: 32rpx;
}

.login-footer {
  text-align: center;
  padding: 40rpx 0 0;
  font-size: 26rpx;
  color: #6B7280;
}

.register-link {
  color: $theme-primary;
  font-weight: 500;
  margin-left: 8rpx;
}
</style>
