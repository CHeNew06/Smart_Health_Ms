<template>
  <view class="page">
    <CustomNavbar title="创建账号" :show-back="true" :bg-color="navBgColor" title-color="#fff" />

    <view class="register-header">
      <text class="header-title">注册智慧健康，开启健康管理之旅</text>
    </view>

    <view class="register-body">
      <!-- Step Indicator -->
      <view class="step-indicator">
        <view class="step-dot" :class="{ active: currentStep === 1, done: currentStep > 1 }"></view>
        <view class="step-dot" :class="{ active: currentStep === 2, done: currentStep > 2 }"></view>
        <view class="step-dot" :class="{ active: currentStep === 3, done: currentStep > 3 }"></view>
      </view>

      <!-- Step 1: Email + Verification + Account -->
      <view v-show="currentStep === 1" class="step-content">
        <view class="input-group">
          <text class="input-label">邮箱地址</text>
          <view class="input-wrapper">
            <text class="input-icon">✉</text>
            <input
              class="input-field"
              v-model="formData.email"
              type="text"
              placeholder="请输入邮箱地址"
              placeholder-class="placeholder"
            />
          </view>
        </view>
        <view class="input-group">
          <text class="input-label">验证码</text>
          <view class="input-wrapper code-wrapper">
            <text class="input-icon">🛡</text>
            <input
              class="input-field"
              v-model="formData.verifyCode"
              placeholder="请输入6位验证码"
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
        <view class="input-group">
          <text class="input-label">账号</text>
          <view class="input-wrapper">
            <text class="input-icon">@</text>
            <input
              class="input-field"
              v-model="formData.account"
              placeholder="请设置账号（字母开头，6-20位）"
              placeholder-class="placeholder"
            />
          </view>
          <text class="input-hint">账号用于登录，设置后不可更改</text>
        </view>
        <view class="btn-primary" @click="goStep(2)">
          <text>下一步</text>
        </view>
      </view>

      <!-- Step 2: Password -->
      <view v-show="currentStep === 2" class="step-content">
        <view class="input-group">
          <text class="input-label">设置密码</text>
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input
              class="input-field"
              :password="!showPassword"
              v-model="formData.password"
              placeholder="请设置密码（6-20位）"
              placeholder-class="placeholder"
              @input="checkStrength"
            />
            <text class="pwd-toggle" @click="showPassword = !showPassword">
              {{ showPassword ? '👁' : '👁‍🗨' }}
            </text>
          </view>
          <view class="strength-bar" :class="strengthClass">
            <view class="bar-seg"></view>
            <view class="bar-seg"></view>
            <view class="bar-seg"></view>
          </view>
          <text class="strength-text" :class="strengthClass">{{ strengthText }}</text>
        </view>
        <view class="input-group">
          <text class="input-label">确认密码</text>
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input
              class="input-field"
              :password="!showPassword"
              v-model="formData.confirmPassword"
              placeholder="请再次输入密码"
              placeholder-class="placeholder"
              @input="checkMatch"
            />
          </view>
          <text class="match-text" :class="matchClass">{{ matchText }}</text>
        </view>
        <view class="btn-row">
          <view class="btn-outline" @click="goStep(1)">
            <text>上一步</text>
          </view>
          <view class="btn-primary flex2" @click="goStep(3)">
            <text>下一步</text>
          </view>
        </view>
      </view>

      <!-- Step 3: Personal Info -->
      <view v-show="currentStep === 3" class="step-content">
        <view class="input-group">
          <text class="input-label">昵称</text>
          <view class="input-wrapper">
            <text class="input-icon">👤</text>
            <input
              class="input-field"
              v-model="formData.nickname"
              placeholder="请输入昵称"
              placeholder-class="placeholder"
            />
          </view>
        </view>
        <view class="input-group">
          <text class="input-label">性别</text>
          <view class="gender-select">
            <view
              class="gender-opt"
              :class="{ active: formData.gender === 'male' }"
              @click="formData.gender = 'male'"
            >
              <text>男</text>
            </view>
            <view
              class="gender-opt"
              :class="{ active: formData.gender === 'female' }"
              @click="formData.gender = 'female'"
            >
              <text>女</text>
            </view>
            <view
              class="gender-opt"
              :class="{ active: formData.gender === 'secret' }"
              @click="formData.gender = 'secret'"
            >
              <text>保密</text>
            </view>
          </view>
        </view>
        <view class="input-group">
          <text class="input-label">出生日期</text>
          <picker mode="date" :value="formData.birthday" @change="onBirthdayChange">
            <view class="input-wrapper picker-wrapper">
              <text class="input-icon">🎂</text>
              <text class="picker-text" :class="{ placeholder: !formData.birthday }">
                {{ formData.birthday || '请选择出生日期' }}
              </text>
            </view>
          </picker>
        </view>
        <view class="input-group">
          <text class="input-label">地区</text>
          <picker mode="selector" :range="regionList" @change="onRegionChange">
            <view class="input-wrapper picker-wrapper">
              <text class="input-icon">📍</text>
              <text class="picker-text" :class="{ placeholder: !formData.region }">
                {{ formData.region || '请选择地区' }}
              </text>
            </view>
          </picker>
        </view>
        <view class="terms" @click="formData.agreeTerms = !formData.agreeTerms">
          <view class="checkbox" :class="{ checked: formData.agreeTerms }">
            <text v-if="formData.agreeTerms">✓</text>
          </view>
          <text class="terms-text">我已阅读并同意 <text class="link">《服务条款》</text>和<text class="link">《隐私政策》</text></text>
        </view>
        <view class="btn-row">
          <view class="btn-outline" @click="goStep(2)">
            <text>上一步</text>
          </view>
          <view class="btn-primary flex2" @click="handleRegister">
            <text>{{ registerLoading ? '注册中...' : '完成注册' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar.vue'
import { sendVerifyCode, register } from '@/api/auth'

export default {
  name: 'Register',
  components: { CustomNavbar },
  data() {
    return {
      currentStep: 1,
      countdown: 0,
      timer: null,
      showPassword: false,
      registerLoading: false,
      formData: {
        email: '',
        verifyCode: '',
        account: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        gender: 'male',
        birthday: '',
        region: '',
        agreeTerms: true
      },
      strengthLevel: '',
      passwordMatch: null,
      regionList: [
        '北京市',
        '广东省 · 广州市',
        '上海市',
        '江苏省 · 南京市',
        '浙江省 · 杭州市',
        '四川省 · 成都市',
        '湖北省 · 武汉市',
        '山东省 · 济南市',
        '河南省 · 郑州市',
        '福建省 · 福州市',
        '其他'
      ]
    }
  },
  computed: {
    navBgColor() {
      return 'linear-gradient(135deg, #4A90D9 0%, #3a7bc8 100%)'
    },
    strengthClass() {
      return this.strengthLevel || ''
    },
    strengthText() {
      if (!this.formData.password) return ''
      if (this.strengthLevel === 'weak') return '密码强度：弱'
      if (this.strengthLevel === 'medium') return '密码强度：中'
      if (this.strengthLevel === 'strong') return '密码强度：强'
      return ''
    },
    matchClass() {
      if (this.passwordMatch === true) return 'match'
      if (this.passwordMatch === false) return 'mismatch'
      return ''
    },
    matchText() {
      if (!this.formData.confirmPassword) return ''
      return this.passwordMatch ? '密码一致 ✓' : '密码不一致 ✗'
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    goStep(step) {
      if (step === 2 && this.currentStep === 1) {
        if (!this.formData.email) {
          uni.showToast({ title: '请输入邮箱', icon: 'none' })
          return
        }
        if (!this.formData.verifyCode || this.formData.verifyCode.length < 6) {
          uni.showToast({ title: '请输入6位验证码', icon: 'none' })
          return
        }
        if (!this.formData.account || this.formData.account.length < 6) {
          uni.showToast({ title: '账号至少6位，字母开头', icon: 'none' })
          return
        }
      }
      if (step === 3 && this.currentStep === 2) {
        if (!this.formData.password || this.formData.password.length < 6) {
          uni.showToast({ title: '密码至少6位', icon: 'none' })
          return
        }
        if (this.formData.password !== this.formData.confirmPassword) {
          uni.showToast({ title: '两次密码不一致', icon: 'none' })
          return
        }
      }
      this.currentStep = step
    },
    async getVerifyCode() {
      if (this.countdown > 0) return
      if (!this.formData.email) {
        uni.showToast({ title: '请输入邮箱', icon: 'none' })
        return
      }
      try {
        await sendVerifyCode({ email: this.formData.email, scene: 'register' })
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
    async handleRegister() {
      if (this.registerLoading) return
      if (!this.formData.agreeTerms) {
        uni.showToast({ title: '请同意服务条款', icon: 'none' })
        return
      }
      if (!this.formData.nickname) {
        uni.showToast({ title: '请输入昵称', icon: 'none' })
        return
      }
      this.registerLoading = true
      try {
        await register({
          account: this.formData.account,
          password: this.formData.password,
          email: this.formData.email,
          code: this.formData.verifyCode,
          nickname: this.formData.nickname
        })
        uni.showToast({ title: '注册成功', icon: 'success' })
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/login/login' })
        }, 1500)
      } catch (e) {
        // request 内部已处理 toast
      } finally {
        this.registerLoading = false
      }
    },
    checkStrength() {
      const pwd = this.formData.password
      if (!pwd) {
        this.strengthLevel = ''
      } else if (pwd.length < 6) {
        this.strengthLevel = 'weak'
      } else if (pwd.length < 10 || !/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) {
        this.strengthLevel = 'medium'
      } else {
        this.strengthLevel = 'strong'
      }
    },
    checkMatch() {
      if (!this.formData.confirmPassword) {
        this.passwordMatch = null
        return
      }
      this.passwordMatch = this.formData.password === this.formData.confirmPassword
    },
    onBirthdayChange(e) {
      this.formData.birthday = e.detail.value
    },
    onRegionChange(e) {
      this.formData.region = this.regionList[e.detail.value]
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-primary: #4A90D9;
$theme-primary-dark: #3a7bc8;
$input-bg: #F5F7FA;
$input-border: #E5E6EB;
$success: #10B981;
$warning: #F59E0B;
$danger: #EF4444;

.page {
  min-height: 100vh;
  background: #e2eef0;
}

.register-header {
  background: linear-gradient(135deg, $theme-primary 0%, $theme-primary-dark 100%);
  padding: 40rpx 48rpx 72rpx;
  color: #fff;
}

.header-title {
  font-size: 26rpx;
  opacity: 0.9;
}

.register-body {
  margin-top: -32rpx;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 56rpx 48rpx;
  min-height: 800rpx;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.step-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #E5E7EB;
  transition: all 0.3s;

  &.active {
    width: 48rpx;
    border-radius: 8rpx;
    background: $theme-primary;
  }

  &.done {
    background: rgba($theme-primary, 0.5);
  }
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.input-group {
  margin-bottom: 32rpx;
}

.input-label {
  display: block;
  font-size: 26rpx;
  color: #4B5563;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  &.code-wrapper .input-field {
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

.picker-wrapper {
  height: 88rpx;
  background: $input-bg;
  border: 2rpx solid $input-border;
  border-radius: 16rpx;
}

.picker-text {
  flex: 1;
  padding-left: 60rpx;
  font-size: 28rpx;
  color: #1F2937;

  &.placeholder {
    color: #9CA3AF;
  }
}

.input-hint {
  font-size: 22rpx;
  color: #9CA3AF;
  margin-top: 8rpx;
  display: block;
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

.pwd-toggle {
  position: absolute;
  right: 28rpx;
  font-size: 30rpx;
  padding: 10rpx;
}

.strength-bar {
  display: flex;
  gap: 8rpx;
  margin-top: 12rpx;
}

.bar-seg {
  flex: 1;
  height: 8rpx;
  border-radius: 4rpx;
  background: #E5E7EB;
}

.strength-bar.weak .bar-seg:nth-child(1) {
  background: $danger;
}

.strength-bar.medium .bar-seg:nth-child(1),
.strength-bar.medium .bar-seg:nth-child(2) {
  background: $warning;
}

.strength-bar.strong .bar-seg:nth-child(1),
.strength-bar.strong .bar-seg:nth-child(2),
.strength-bar.strong .bar-seg:nth-child(3) {
  background: $success;
}

.strength-text {
  font-size: 22rpx;
  margin-top: 8rpx;
  display: block;

  &.weak { color: $danger; }
  &.medium { color: $warning; }
  &.strong { color: $success; }
}

.match-text {
  font-size: 22rpx;
  margin-top: 8rpx;

  &.match { color: $success; }
  &.mismatch { color: $danger; }
}

.gender-select {
  display: flex;
  gap: 20rpx;
}

.gender-opt {
  flex: 1;
  height: 88rpx;
  border: 2rpx solid $input-border;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #6B7280;
  background: $input-bg;

  &.active {
    border-color: $theme-primary;
    background: rgba($theme-primary, 0.1);
    color: $theme-primary;
    font-weight: 500;
  }
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  font-size: 24rpx;
  color: #6B7280;
  margin-bottom: 40rpx;
  line-height: 1.6;
}

.terms .checkbox {
  width: 44rpx;
  height: 44rpx;
  border: 2rpx solid #D1D5DB;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;
  flex-shrink: 0;

  &.checked {
    background: $theme-primary;
    border-color: $theme-primary;
  }
}

.terms-text {
  flex: 1;
}

.link {
  color: $theme-primary;
}

.btn-primary {
  height: 88rpx;
  background: $theme-primary;
  color: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;

  &.flex2 {
    flex: 2;
  }
}

.btn-outline {
  flex: 1;
  height: 88rpx;
  background: transparent;
  color: $theme-primary;
  border: 2rpx solid $theme-primary;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
}

.btn-row {
  display: flex;
  gap: 20rpx;
  margin-top: 16rpx;
}
</style>
