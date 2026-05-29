if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const BASE_URL = "http://10.182.234.99:8088";
  const config = {
    BASE_URL,
    API_PREFIX: BASE_URL + "/api",
    TOKEN_KEY: "access_token",
    REFRESH_TOKEN_KEY: "refresh_token",
    USER_INFO_KEY: "user_info"
  };
  function getToken() {
    return uni.getStorageSync(config.TOKEN_KEY) || "";
  }
  function setToken(token) {
    uni.setStorageSync(config.TOKEN_KEY, token);
  }
  function getRefreshToken() {
    return uni.getStorageSync(config.REFRESH_TOKEN_KEY) || "";
  }
  function setRefreshToken(token) {
    uni.setStorageSync(config.REFRESH_TOKEN_KEY, token);
  }
  function getUserInfo() {
    const raw = uni.getStorageSync(config.USER_INFO_KEY);
    return raw ? typeof raw === "string" ? JSON.parse(raw) : raw : null;
  }
  function setUserInfo(info) {
    uni.setStorageSync(config.USER_INFO_KEY, JSON.stringify(info));
  }
  function clearAuth() {
    uni.removeStorageSync(config.TOKEN_KEY);
    uni.removeStorageSync(config.REFRESH_TOKEN_KEY);
    uni.removeStorageSync(config.USER_INFO_KEY);
  }
  function isLoggedIn() {
    return !!getToken();
  }
  let isRedirecting = false;
  function redirectToLogin() {
    if (isRedirecting)
      return;
    isRedirecting = true;
    clearAuth();
    uni.reLaunch({
      url: "/pages/login/login",
      complete: () => {
        setTimeout(() => {
          isRedirecting = false;
        }, 1e3);
      }
    });
  }
  const _imports_0 = "/static/splash.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$q = {
    data() {
      return {
        minDisplayTime: 2e3
      };
    },
    onLoad() {
      const startTime = Date.now();
      this.checkAuth().then((loggedIn) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, this.minDisplayTime - elapsed);
        setTimeout(() => {
          if (loggedIn) {
            uni.switchTab({ url: "/pages/home/home" });
          } else {
            uni.reLaunch({ url: "/pages/login/login" });
          }
        }, remaining);
      });
    },
    methods: {
      async checkAuth() {
        const token = getToken();
        if (!token)
          return false;
        const refreshToken = getRefreshToken();
        try {
          const res = await new Promise((resolve, reject) => {
            uni.request({
              url: config.API_PREFIX + "/auth/me",
              method: "GET",
              header: { "Authorization": "Bearer " + token },
              success: resolve,
              fail: reject
            });
          });
          if (res.data && res.data.code === 0)
            return true;
          if (!refreshToken)
            return false;
          return await this.tryRefresh(refreshToken);
        } catch {
          if (!refreshToken)
            return false;
          return await this.tryRefresh(refreshToken);
        }
      },
      async tryRefresh(refreshToken) {
        try {
          const res = await new Promise((resolve, reject) => {
            uni.request({
              url: config.API_PREFIX + "/auth/refresh",
              method: "POST",
              header: { "Content-Type": "application/json" },
              data: { refreshToken },
              success: resolve,
              fail: reject
            });
          });
          if (res.data && res.data.code === 0 && res.data.data) {
            const d = res.data.data;
            const newToken = d.token || d.accessToken;
            const newRefresh = d.refreshToken || d.refresh_token;
            if (newToken) {
              setToken(newToken);
              if (newRefresh)
                setRefreshToken(newRefresh);
              return true;
            }
          }
          return false;
        } catch {
          return false;
        }
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "splash-page" }, [
      vue.createElementVNode("image", {
        class: "splash-img",
        src: _imports_0,
        mode: "aspectFill"
      }),
      vue.createElementVNode("view", { class: "splash-footer" }, [
        vue.createElementVNode("text", { class: "app-name" }, "智慧健康"),
        vue.createElementVNode("text", { class: "app-slogan" }, "智慧养老健康管理系统")
      ])
    ]);
  }
  const PagesSplashSplash = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-b5d3b004"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/splash/splash.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  let isRefreshing = false;
  let pendingRequests = [];
  function retryPending(newToken) {
    pendingRequests.forEach((cb) => cb(newToken));
    pendingRequests = [];
  }
  async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      redirectToLogin();
      return Promise.reject("no refresh token");
    }
    try {
      const res = await new Promise((resolve, reject) => {
        uni.request({
          url: config.API_PREFIX + "/auth/refresh",
          method: "POST",
          header: { "Content-Type": "application/json" },
          data: { refreshToken },
          success: resolve,
          fail: reject
        });
      });
      const body = res.data;
      if (body && body.code === 0 && body.data) {
        const d = body.data;
        const newAccessToken = d.token || d.accessToken;
        const newRefreshToken = d.refreshToken || d.refresh_token;
        if (newAccessToken) {
          setToken(newAccessToken);
          if (newRefreshToken)
            setRefreshToken(newRefreshToken);
          return newAccessToken;
        }
      }
      formatAppLog("warn", "at api/request.js:40", "[request] refresh token failed, response:", JSON.stringify(body));
      redirectToLogin();
      return Promise.reject("refresh failed");
    } catch (err) {
      formatAppLog("warn", "at api/request.js:44", "[request] refresh token error:", err);
      redirectToLogin();
      return Promise.reject("refresh error");
    }
  }
  function request(options) {
    const {
      url,
      method = "GET",
      data,
      header = {},
      noAuth = false,
      showLoading = false,
      loadingText = "加载中..."
    } = options;
    return new Promise((resolve, reject) => {
      if (showLoading) {
        uni.showLoading({ title: loadingText, mask: true });
      }
      const token = getToken();
      const reqHeader = {
        "Content-Type": "application/json",
        ...header
      };
      if (!noAuth && token) {
        reqHeader["Authorization"] = "Bearer " + token;
      }
      uni.request({
        url: config.API_PREFIX + url,
        method,
        data,
        header: reqHeader,
        success: async (res) => {
          if (showLoading)
            uni.hideLoading();
          const is401 = res.statusCode === 401 || res.data && res.data.code === 401;
          if (is401) {
            if (noAuth) {
              reject({ code: 401, message: "未授权" });
              return;
            }
            if (!isRefreshing) {
              isRefreshing = true;
              try {
                const newToken = await refreshAccessToken();
                isRefreshing = false;
                retryPending(newToken);
                reqHeader["Authorization"] = "Bearer " + newToken;
                uni.request({
                  url: config.API_PREFIX + url,
                  method,
                  data,
                  header: reqHeader,
                  success: (retryRes) => {
                    if (retryRes.data && retryRes.data.code === 0) {
                      resolve(retryRes.data);
                    } else {
                      reject(retryRes.data || { message: "请求失败" });
                    }
                  },
                  fail: reject
                });
              } catch (err) {
                isRefreshing = false;
                pendingRequests = [];
                reject(err);
              }
            } else {
              pendingRequests.push((newToken) => {
                reqHeader["Authorization"] = "Bearer " + newToken;
                uni.request({
                  url: config.API_PREFIX + url,
                  method,
                  data,
                  header: reqHeader,
                  success: (retryRes) => {
                    if (retryRes.data && retryRes.data.code === 0) {
                      resolve(retryRes.data);
                    } else {
                      reject(retryRes.data || { message: "请求失败" });
                    }
                  },
                  fail: reject
                });
              });
            }
            return;
          }
          const body = res.data;
          if (body && body.code === 0) {
            resolve(body);
          } else {
            const msg = body && body.message || "请求失败";
            uni.showToast({ title: msg, icon: "none", duration: 2e3 });
            reject(body || { message: msg });
          }
        },
        fail: (err) => {
          if (showLoading)
            uni.hideLoading();
          uni.showToast({ title: "网络异常", icon: "none" });
          reject(err);
        }
      });
    });
  }
  function login(data) {
    return request({
      url: "/auth/login",
      method: "POST",
      data,
      noAuth: true
    });
  }
  function register(data) {
    return request({
      url: "/auth/register",
      method: "POST",
      data,
      noAuth: true
    });
  }
  function sendVerifyCode(data) {
    return request({
      url: "/auth/send-code",
      method: "POST",
      data,
      noAuth: true
    });
  }
  function logout() {
    return request({
      url: "/auth/logout",
      method: "POST"
    });
  }
  function getUserBasicInfo() {
    return request({
      url: "/auth/me",
      method: "GET"
    });
  }
  const _sfc_main$p = {
    name: "Login",
    data() {
      return {
        loginMode: "password",
        account: "",
        password: "",
        email: "",
        verifyCode: "",
        showPassword: false,
        rememberPassword: false,
        countdown: 0,
        timer: null,
        loading: false
      };
    },
    beforeDestroy() {
      if (this.timer)
        clearInterval(this.timer);
    },
    methods: {
      async getVerifyCode() {
        if (this.countdown > 0)
          return;
        if (!this.email) {
          uni.showToast({ title: "请输入邮箱", icon: "none" });
          return;
        }
        try {
          await sendVerifyCode({ email: this.email, scene: "login" });
          uni.showToast({ title: "验证码已发送", icon: "success" });
        } catch (e) {
          return;
        }
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0 && this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1e3);
      },
      async handleLogin() {
        if (this.loading)
          return;
        if (this.loginMode === "password") {
          if (!this.account || !this.password) {
            uni.showToast({ title: "请输入账号和密码", icon: "none" });
            return;
          }
          this.loading = true;
          try {
            const res = await login({ accountOrEmail: this.account, password: this.password });
            this.onLoginSuccess(res.data);
          } catch (e) {
          } finally {
            this.loading = false;
          }
        } else {
          if (!this.email || !this.verifyCode) {
            uni.showToast({ title: "请输入邮箱和验证码", icon: "none" });
            return;
          }
          this.loading = true;
          try {
            const res = await login({ accountOrEmail: this.email, code: this.verifyCode });
            this.onLoginSuccess(res.data);
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      },
      onLoginSuccess(data) {
        if (!data) {
          uni.showToast({ title: "登录响应异常", icon: "none" });
          return;
        }
        const accessToken = data.token || data.accessToken;
        const refresh = data.refreshToken || data.refresh_token;
        if (!accessToken) {
          formatAppLog("warn", "at pages/login/login.vue:202", "[login] 登录响应中无 token 字段:", JSON.stringify(data));
          uni.showToast({ title: "登录异常，未获取到令牌", icon: "none" });
          return;
        }
        setToken(accessToken);
        if (refresh)
          setRefreshToken(refresh);
        setUserInfo({
          userId: data.userId || data.uid || data.id,
          account: data.account,
          nickname: data.nickname
        });
        uni.switchTab({ url: "/pages/home/home" });
      },
      handleTry() {
        uni.switchTab({ url: "/pages/home/home" });
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "login-header" }, [
        vue.createElementVNode("view", { class: "login-logo" }, [
          vue.createElementVNode("text", { class: "logo-icon" }, "♥")
        ]),
        vue.createElementVNode("text", { class: "login-title" }, "智慧健康"),
        vue.createElementVNode("text", { class: "login-subtitle" }, "智慧养老健康管理系统")
      ]),
      vue.createElementVNode("view", { class: "login-body" }, [
        vue.createElementVNode("view", { class: "login-tabs" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["login-tab", { active: $data.loginMode === "password" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $data.loginMode = "password")
            },
            [
              vue.createElementVNode("text", null, "账号密码登录")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["login-tab", { active: $data.loginMode === "code" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $data.loginMode = "code")
            },
            [
              vue.createElementVNode("text", null, "验证码登录")
            ],
            2
            /* CLASS */
          )
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "form-block" },
          [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "✉"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.account = $event),
                    placeholder: "请输入邮箱或账号",
                    "placeholder-class": "placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.account]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input-field",
                  password: !$data.showPassword,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.password = $event),
                  placeholder: "请输入密码",
                  "placeholder-class": "placeholder"
                }, null, 8, ["password"]), [
                  [vue.vModelText, $data.password]
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "pwd-toggle",
                    onClick: _cache[4] || (_cache[4] = ($event) => $data.showPassword = !$data.showPassword)
                  },
                  vue.toDisplayString($data.showPassword ? "👁" : "👁‍🗨"),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "remember-row" }, [
              vue.createElementVNode("view", {
                class: "remember-check",
                onClick: _cache[5] || (_cache[5] = ($event) => $data.rememberPassword = !$data.rememberPassword)
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["checkbox", { checked: $data.rememberPassword }])
                  },
                  vue.toDisplayString($data.rememberPassword ? "✓" : ""),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "remember-text" }, "记住密码")
              ]),
              vue.createElementVNode("text", { class: "forgot-link" }, "忘记密码？")
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.loginMode === "password"]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "form-block" },
          [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "✉"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.email = $event),
                    type: "text",
                    placeholder: "请输入邮箱",
                    "placeholder-class": "placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.email]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper code-input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🛡"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.verifyCode = $event),
                    placeholder: "请输入验证码",
                    "placeholder-class": "placeholder",
                    maxlength: "6"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.verifyCode]
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["code-btn", { disabled: $data.countdown > 0 }]),
                    onClick: _cache[8] || (_cache[8] = (...args) => $options.getVerifyCode && $options.getVerifyCode(...args))
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.countdown > 0 ? $data.countdown + "s" : "获取验证码"),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.loginMode === "code"]
        ]),
        vue.createElementVNode("view", {
          class: "login-btn",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.handleLogin && $options.handleLogin(...args))
        }, [
          vue.createElementVNode("text", null, "登 录")
        ]),
        vue.createElementVNode("view", {
          class: "try-btn",
          onClick: _cache[10] || (_cache[10] = (...args) => $options.handleTry && $options.handleTry(...args))
        }, [
          vue.createElementVNode("text", null, "立即体验")
        ]),
        vue.createElementVNode("view", { class: "login-footer" }, [
          vue.createElementVNode("text", null, "还没有账号？"),
          vue.createElementVNode("navigator", {
            url: "/pages/register/register",
            class: "register-link"
          }, "立即注册")
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-e4e4508d"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/login/login.vue"]]);
  const _sfc_main$o = {
    name: "CustomNavbar",
    props: {
      title: { type: String, default: "" },
      showBack: { type: Boolean, default: true },
      bgColor: { type: String, default: "#ffffff" },
      titleColor: { type: String, default: "#1D2129" }
    },
    data() {
      return {
        statusBarH: 20
      };
    },
    created() {
      const sys = uni.getSystemInfoSync();
      this.statusBarH = sys.statusBarHeight || 20;
    },
    methods: {
      handleBack() {
        uni.navigateBack({ fail: () => {
          uni.switchTab({ url: "/pages/home/home" });
        } });
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "view",
          {
            class: "navbar",
            style: vue.normalizeStyle({ background: $props.bgColor, paddingTop: $data.statusBarH + "px" })
          },
          [
            vue.createElementVNode("view", { class: "navbar-inner" }, [
              $props.showBack ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "navbar-left",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: "nav-icon",
                    style: vue.normalizeStyle({ color: $props.titleColor })
                  },
                  "‹",
                  4
                  /* STYLE */
                )
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "navbar-left"
              })),
              vue.createElementVNode("view", { class: "navbar-title" }, [
                vue.createElementVNode(
                  "text",
                  {
                    style: vue.normalizeStyle({ color: $props.titleColor })
                  },
                  vue.toDisplayString($props.title),
                  5
                  /* TEXT, STYLE */
                )
              ]),
              vue.createElementVNode("view", { class: "navbar-right" }, [
                vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
              ])
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            style: vue.normalizeStyle({ height: $data.statusBarH + 44 + "px" })
          },
          null,
          4
          /* STYLE */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const CustomNavbar = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-e1c8316f"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/components/custom-navbar.vue"]]);
  const _sfc_main$n = {
    name: "Register",
    components: { CustomNavbar },
    data() {
      return {
        currentStep: 1,
        countdown: 0,
        timer: null,
        showPassword: false,
        registerLoading: false,
        formData: {
          email: "",
          verifyCode: "",
          account: "",
          password: "",
          confirmPassword: "",
          nickname: "",
          gender: "male",
          birthday: "",
          region: "",
          agreeTerms: true
        },
        strengthLevel: "",
        passwordMatch: null,
        regionList: [
          "北京市",
          "广东省 · 广州市",
          "上海市",
          "江苏省 · 南京市",
          "浙江省 · 杭州市",
          "四川省 · 成都市",
          "湖北省 · 武汉市",
          "山东省 · 济南市",
          "河南省 · 郑州市",
          "福建省 · 福州市",
          "其他"
        ]
      };
    },
    computed: {
      navBgColor() {
        return "linear-gradient(135deg, #4A90D9 0%, #3a7bc8 100%)";
      },
      strengthClass() {
        return this.strengthLevel || "";
      },
      strengthText() {
        if (!this.formData.password)
          return "";
        if (this.strengthLevel === "weak")
          return "密码强度：弱";
        if (this.strengthLevel === "medium")
          return "密码强度：中";
        if (this.strengthLevel === "strong")
          return "密码强度：强";
        return "";
      },
      matchClass() {
        if (this.passwordMatch === true)
          return "match";
        if (this.passwordMatch === false)
          return "mismatch";
        return "";
      },
      matchText() {
        if (!this.formData.confirmPassword)
          return "";
        return this.passwordMatch ? "密码一致 ✓" : "密码不一致 ✗";
      }
    },
    beforeDestroy() {
      if (this.timer)
        clearInterval(this.timer);
    },
    methods: {
      goStep(step) {
        if (step === 2 && this.currentStep === 1) {
          if (!this.formData.email) {
            uni.showToast({ title: "请输入邮箱", icon: "none" });
            return;
          }
          if (!this.formData.verifyCode || this.formData.verifyCode.length < 6) {
            uni.showToast({ title: "请输入6位验证码", icon: "none" });
            return;
          }
          if (!this.formData.account || this.formData.account.length < 6) {
            uni.showToast({ title: "账号至少6位，字母开头", icon: "none" });
            return;
          }
        }
        if (step === 3 && this.currentStep === 2) {
          if (!this.formData.password || this.formData.password.length < 6) {
            uni.showToast({ title: "密码至少6位", icon: "none" });
            return;
          }
          if (this.formData.password !== this.formData.confirmPassword) {
            uni.showToast({ title: "两次密码不一致", icon: "none" });
            return;
          }
        }
        this.currentStep = step;
      },
      async getVerifyCode() {
        if (this.countdown > 0)
          return;
        if (!this.formData.email) {
          uni.showToast({ title: "请输入邮箱", icon: "none" });
          return;
        }
        try {
          await sendVerifyCode({ email: this.formData.email, scene: "register" });
          uni.showToast({ title: "验证码已发送", icon: "success" });
        } catch (e) {
          return;
        }
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0 && this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1e3);
      },
      async handleRegister() {
        if (this.registerLoading)
          return;
        if (!this.formData.agreeTerms) {
          uni.showToast({ title: "请同意服务条款", icon: "none" });
          return;
        }
        if (!this.formData.nickname) {
          uni.showToast({ title: "请输入昵称", icon: "none" });
          return;
        }
        this.registerLoading = true;
        try {
          await register({
            account: this.formData.account,
            password: this.formData.password,
            email: this.formData.email,
            code: this.formData.verifyCode,
            nickname: this.formData.nickname
          });
          uni.showToast({ title: "注册成功", icon: "success" });
          setTimeout(() => {
            uni.redirectTo({ url: "/pages/login/login" });
          }, 1500);
        } catch (e) {
        } finally {
          this.registerLoading = false;
        }
      },
      checkStrength() {
        const pwd = this.formData.password;
        if (!pwd) {
          this.strengthLevel = "";
        } else if (pwd.length < 6) {
          this.strengthLevel = "weak";
        } else if (pwd.length < 10 || !/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) {
          this.strengthLevel = "medium";
        } else {
          this.strengthLevel = "strong";
        }
      },
      checkMatch() {
        if (!this.formData.confirmPassword) {
          this.passwordMatch = null;
          return;
        }
        this.passwordMatch = this.formData.password === this.formData.confirmPassword;
      },
      onBirthdayChange(e) {
        this.formData.birthday = e.detail.value;
      },
      onRegionChange(e) {
        this.formData.region = this.regionList[e.detail.value];
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "创建账号",
        "show-back": true,
        "bg-color": $options.navBgColor,
        "title-color": "#fff"
      }, null, 8, ["bg-color"]),
      vue.createElementVNode("view", { class: "register-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "注册智慧健康，开启健康管理之旅")
      ]),
      vue.createElementVNode("view", { class: "register-body" }, [
        vue.createElementVNode("view", { class: "step-indicator" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step-dot", { active: $data.currentStep === 1, done: $data.currentStep > 1 }])
            },
            null,
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step-dot", { active: $data.currentStep === 2, done: $data.currentStep > 2 }])
            },
            null,
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step-dot", { active: $data.currentStep === 3, done: $data.currentStep > 3 }])
            },
            null,
            2
            /* CLASS */
          )
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "step-content" },
          [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "邮箱地址"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "✉"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.formData.email = $event),
                    type: "text",
                    placeholder: "请输入邮箱地址",
                    "placeholder-class": "placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.email]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "验证码"),
              vue.createElementVNode("view", { class: "input-wrapper code-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🛡"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.verifyCode = $event),
                    placeholder: "请输入6位验证码",
                    "placeholder-class": "placeholder",
                    maxlength: "6"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.verifyCode]
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["code-btn", { disabled: $data.countdown > 0 }]),
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.getVerifyCode && $options.getVerifyCode(...args))
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.countdown > 0 ? $data.countdown + "s" : "获取验证码"),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "账号"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "@"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.formData.account = $event),
                    placeholder: "请设置账号（字母开头，6-20位）",
                    "placeholder-class": "placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.account]
                ])
              ]),
              vue.createElementVNode("text", { class: "input-hint" }, "账号用于登录，设置后不可更改")
            ]),
            vue.createElementVNode("view", {
              class: "btn-primary",
              onClick: _cache[4] || (_cache[4] = ($event) => $options.goStep(2))
            }, [
              vue.createElementVNode("text", null, "下一步")
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.currentStep === 1]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "step-content" },
          [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "设置密码"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input-field",
                  password: !$data.showPassword,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.formData.password = $event),
                  placeholder: "请设置密码（6-20位）",
                  "placeholder-class": "placeholder",
                  onInput: _cache[6] || (_cache[6] = (...args) => $options.checkStrength && $options.checkStrength(...args))
                }, null, 40, ["password"]), [
                  [vue.vModelText, $data.formData.password]
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "pwd-toggle",
                    onClick: _cache[7] || (_cache[7] = ($event) => $data.showPassword = !$data.showPassword)
                  },
                  vue.toDisplayString($data.showPassword ? "👁" : "👁‍🗨"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["strength-bar", $options.strengthClass])
                },
                [
                  vue.createElementVNode("view", { class: "bar-seg" }),
                  vue.createElementVNode("view", { class: "bar-seg" }),
                  vue.createElementVNode("view", { class: "bar-seg" })
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["strength-text", $options.strengthClass])
                },
                vue.toDisplayString($options.strengthText),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "确认密码"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input-field",
                  password: !$data.showPassword,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.formData.confirmPassword = $event),
                  placeholder: "请再次输入密码",
                  "placeholder-class": "placeholder",
                  onInput: _cache[9] || (_cache[9] = (...args) => $options.checkMatch && $options.checkMatch(...args))
                }, null, 40, ["password"]), [
                  [vue.vModelText, $data.formData.confirmPassword]
                ])
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["match-text", $options.matchClass])
                },
                vue.toDisplayString($options.matchText),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "btn-row" }, [
              vue.createElementVNode("view", {
                class: "btn-outline",
                onClick: _cache[10] || (_cache[10] = ($event) => $options.goStep(1))
              }, [
                vue.createElementVNode("text", null, "上一步")
              ]),
              vue.createElementVNode("view", {
                class: "btn-primary flex2",
                onClick: _cache[11] || (_cache[11] = ($event) => $options.goStep(3))
              }, [
                vue.createElementVNode("text", null, "下一步")
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.currentStep === 2]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "step-content" },
          [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "昵称"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "👤"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.formData.nickname = $event),
                    placeholder: "请输入昵称",
                    "placeholder-class": "placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.nickname]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "性别"),
              vue.createElementVNode("view", { class: "gender-select" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["gender-opt", { active: $data.formData.gender === "male" }]),
                    onClick: _cache[13] || (_cache[13] = ($event) => $data.formData.gender = "male")
                  },
                  [
                    vue.createElementVNode("text", null, "男")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["gender-opt", { active: $data.formData.gender === "female" }]),
                    onClick: _cache[14] || (_cache[14] = ($event) => $data.formData.gender = "female")
                  },
                  [
                    vue.createElementVNode("text", null, "女")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["gender-opt", { active: $data.formData.gender === "secret" }]),
                    onClick: _cache[15] || (_cache[15] = ($event) => $data.formData.gender = "secret")
                  },
                  [
                    vue.createElementVNode("text", null, "保密")
                  ],
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "出生日期"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.formData.birthday,
                onChange: _cache[16] || (_cache[16] = (...args) => $options.onBirthdayChange && $options.onBirthdayChange(...args))
              }, [
                vue.createElementVNode("view", { class: "input-wrapper picker-wrapper" }, [
                  vue.createElementVNode("text", { class: "input-icon" }, "🎂"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["picker-text", { placeholder: !$data.formData.birthday }])
                    },
                    vue.toDisplayString($data.formData.birthday || "请选择出生日期"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "地区"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $data.regionList,
                onChange: _cache[17] || (_cache[17] = (...args) => $options.onRegionChange && $options.onRegionChange(...args))
              }, [
                vue.createElementVNode("view", { class: "input-wrapper picker-wrapper" }, [
                  vue.createElementVNode("text", { class: "input-icon" }, "📍"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["picker-text", { placeholder: !$data.formData.region }])
                    },
                    vue.toDisplayString($data.formData.region || "请选择地区"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ], 40, ["range"])
            ]),
            vue.createElementVNode("view", {
              class: "terms",
              onClick: _cache[18] || (_cache[18] = ($event) => $data.formData.agreeTerms = !$data.formData.agreeTerms)
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["checkbox", { checked: $data.formData.agreeTerms }])
                },
                [
                  $data.formData.agreeTerms ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "✓")) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode("text", { class: "terms-text" }, [
                vue.createTextVNode("我已阅读并同意 "),
                vue.createElementVNode("text", { class: "link" }, "《服务条款》"),
                vue.createTextVNode("和"),
                vue.createElementVNode("text", { class: "link" }, "《隐私政策》")
              ])
            ]),
            vue.createElementVNode("view", { class: "btn-row" }, [
              vue.createElementVNode("view", {
                class: "btn-outline",
                onClick: _cache[19] || (_cache[19] = ($event) => $options.goStep(2))
              }, [
                vue.createElementVNode("text", null, "上一步")
              ]),
              vue.createElementVNode("view", {
                class: "btn-primary flex2",
                onClick: _cache[20] || (_cache[20] = (...args) => $options.handleRegister && $options.handleRegister(...args))
              }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($data.registerLoading ? "注册中..." : "完成注册"),
                  1
                  /* TEXT */
                )
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.currentStep === 3]
        ])
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-bac4a35d"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/register/register.vue"]]);
  const _sfc_main$m = {
    name: "CustomTabbar",
    props: {
      current: { type: Number, default: 0 }
    },
    data() {
      return {
        tabs: [
          { icon: "🏠", text: "首页", url: "/pages/home/home" },
          { icon: "🤖", text: "AI问答", url: "/pages/ai-consult/ai-consult" },
          { icon: "📋", text: "健康计划", url: "/pages/plan-overview/plan-overview" },
          { icon: "👤", text: "我的", url: "/pages/profile/profile" }
        ],
        keyboardUp: false
      };
    },
    mounted() {
      uni.onKeyboardHeightChange((res) => {
        this.keyboardUp = res.height > 0;
      });
    },
    methods: {
      switchTab(idx) {
        if (idx === this.current)
          return;
        uni.switchTab({ url: this.tabs[idx].url });
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "tabbar" },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.tabs, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: idx,
                  class: vue.normalizeClass(["tab-item", { active: $props.current === idx }]),
                  onClick: ($event) => $options.switchTab(idx)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "tab-icon" },
                    vue.toDisplayString(item.icon),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "tab-text" },
                    vue.toDisplayString(item.text),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, !$data.keyboardUp]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "tabbar-placeholder" },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, !$data.keyboardUp]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const CustomTabbar = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-c0af68ba"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/components/custom-tabbar.vue"]]);
  function getHealthScore() {
    return request({ url: "/health/score" });
  }
  function getHealthMetrics() {
    return request({ url: "/health/metrics" });
  }
  function getMetricDetail(type) {
    return request({ url: `/health/metrics/${type}` });
  }
  function submitBatchInput(data) {
    return request({
      url: "/health/input/batch",
      method: "POST",
      data,
      showLoading: true,
      loadingText: "正在提交..."
    });
  }
  function submitVoiceInput(data) {
    return request({
      url: "/health/input/voice",
      method: "POST",
      data,
      showLoading: true,
      loadingText: "正在提交..."
    });
  }
  function extractVoiceByDify(data) {
    return request({
      url: "/health/voice/extract",
      method: "POST",
      data,
      showLoading: true,
      loadingText: "正在提取健康指标..."
    });
  }
  function getHealthAdvice() {
    return request({ url: "/health/advice" });
  }
  const _sfc_main$l = {
    components: { CustomTabbar },
    data() {
      return {
        showInputMenu: false,
        dateText: "",
        displayName: "",
        healthScore: "--",
        bodyStatus: "--",
        metrics: [
          { type: "temperature", icon: "🌡", iconBg: "#FEF9C3", label: "体温", value: "--", unit: "°C", status: "暂无数据", statusColor: "#9CA3AF" },
          { type: "bp", icon: "❤", iconBg: "#ECFDF5", label: "血压", value: "--", unit: "/-- mmHg", status: "暂无数据", statusColor: "#9CA3AF" },
          { type: "bloodSugar", icon: "💧", iconBg: "#EFF6FF", label: "血糖", value: "--", unit: "mmol/L", status: "暂无数据", statusColor: "#9CA3AF" },
          { type: "bmi", icon: "⚖", iconBg: "#F3E8FF", label: "BMI", value: "--", unit: "kg/m²", status: "暂无数据", statusColor: "#9CA3AF" },
          { type: "heartRate", icon: "💗", iconBg: "#FEF2F2", label: "心率", value: "--", unit: "BPM", status: "暂无数据", statusColor: "#9CA3AF" },
          { type: "sleep", icon: "🌙", iconBg: "#EDE9FE", label: "睡眠时长", value: "--", unit: "小时", status: "暂无数据", statusColor: "#9CA3AF" }
        ],
        adviceList: [
          { icon: "📝", iconBg: "#EFF6FF", title: "开始记录", desc: "录入您的健康数据，获取个性化健康建议" },
          { icon: "🏃", iconBg: "#ECFDF5", title: "保持运动", desc: "建议每天进行30分钟中等强度有氧运动" },
          { icon: "🥗", iconBg: "#FEF9C3", title: "均衡饮食", desc: "合理膳食，多食新鲜蔬果，保持营养均衡" }
        ]
      };
    },
    computed: {
      greetingText() {
        const hour = (/* @__PURE__ */ new Date()).getHours();
        if (hour < 6)
          return "夜深了";
        if (hour < 9)
          return "早上好";
        if (hour < 12)
          return "上午好";
        if (hour < 14)
          return "中午好";
        if (hour < 18)
          return "下午好";
        return "晚上好";
      },
      scoreTitle() {
        if (this.healthScore === "--" || this.healthScore === null || this.healthScore === void 0)
          return "开始记录健康数据吧";
        const score = Number(this.healthScore);
        if (isNaN(score))
          return "开始记录健康数据吧";
        if (score >= 80)
          return "整体健康状况良好";
        if (score >= 60)
          return "健康状况一般，请注意";
        return "健康状况需关注";
      },
      scoreDesc() {
        if (this.healthScore === "--")
          return "录入健康数据后，系统将为您生成健康评分";
        return "坚持记录，保持规律的生活习惯";
      }
    },
    onShow() {
      uni.hideTabBar();
      this.loadUserName();
      this.loadHealthData();
      this.loadAdvice();
    },
    onLoad() {
      this.initDateText();
    },
    methods: {
      initDateText() {
        const d = /* @__PURE__ */ new Date();
        const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        this.dateText = `今天是 ${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日，${weekDays[d.getDay()]}`;
      },
      async loadUserName() {
        if (!isLoggedIn()) {
          this.displayName = "游客";
          return;
        }
        const local = getUserInfo();
        if (local && local.nickname) {
          this.displayName = local.nickname;
        }
        try {
          const res = await getUserBasicInfo();
          if (res.data && res.data.nickname) {
            this.displayName = res.data.nickname;
          } else if (res.data && res.data.account) {
            this.displayName = res.data.account;
          }
        } catch (e) {
          if (!this.displayName)
            this.displayName = "用户";
        }
      },
      toggleInputMenu() {
        this.showInputMenu = !this.showInputMenu;
      },
      async loadHealthData() {
        if (!isLoggedIn())
          return;
        try {
          const [scoreRes, metricsRes] = await Promise.all([getHealthScore(), getHealthMetrics()]);
          if (scoreRes.data) {
            this.healthScore = scoreRes.data.score ?? "--";
            this.bodyStatus = scoreRes.data.bodyStatus ?? "--";
          }
          if (metricsRes.data && Array.isArray(metricsRes.data)) {
            const iconMap = { temperature: "🌡", bp: "❤", bloodSugar: "💧", bmi: "⚖", heartRate: "💗", sleep: "🌙" };
            const iconBgMap = { temperature: "#FEF9C3", bp: "#ECFDF5", bloodSugar: "#EFF6FF", bmi: "#F3E8FF", heartRate: "#FEF2F2", sleep: "#EDE9FE" };
            const statusColorMap = { normal: "#059669", warn: "#D97706", danger: "#DC2626" };
            this.metrics = metricsRes.data.map((m) => ({
              type: m.type,
              icon: iconMap[m.type] || "📊",
              iconBg: iconBgMap[m.type] || "#F5F7FA",
              label: m.label || m.type,
              value: m.value ?? "--",
              unit: m.type === "bp" ? "mmHg" : m.unit || "",
              status: m.statusText || "暂无数据",
              statusColor: statusColorMap[m.status] || "#9CA3AF"
            }));
          }
        } catch (e) {
        }
      },
      async loadAdvice() {
        var _a, _b;
        if (!isLoggedIn())
          return;
        try {
          const res = await getHealthAdvice();
          if ((_b = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.suggestions) == null ? void 0 : _b.length) {
            const iconMap = { diet: "🥗", exercise: "🏃", lifestyle: "📝", medical: "🏥" };
            const iconBgMap = { diet: "#FEF9C3", exercise: "#ECFDF5", lifestyle: "#EFF6FF", medical: "#FEF2F2" };
            this.adviceList = res.data.suggestions.map((s) => ({
              icon: iconMap[s.category] || "💡",
              iconBg: iconBgMap[s.category] || "#F5F7FA",
              title: s.title || (s.category === "diet" ? "饮食" : s.category === "exercise" ? "运动" : s.category === "lifestyle" ? "生活" : "就医"),
              desc: (s.content || "").substring(0, 80) + ((s.content || "").length > 80 ? "..." : "")
            }));
          }
        } catch (e) {
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomTabbar = vue.resolveComponent("CustomTabbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createElementVNode("view", { class: "home-header" }, [
        vue.createElementVNode("view", { class: "greeting-row" }, [
          vue.createElementVNode("view", { class: "greeting-text" }, [
            vue.createElementVNode(
              "text",
              { class: "greeting-title" },
              vue.toDisplayString($options.greetingText) + "，" + vue.toDisplayString($data.displayName),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "greeting-date" },
              vue.toDisplayString($data.dateText),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "input-dropdown-wrap" }, [
            vue.createElementVNode("view", {
              class: "input-dropdown-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleInputMenu && $options.toggleInputMenu(...args))
            }, [
              vue.createElementVNode("text", null, "录入数据"),
              vue.createElementVNode("text", { class: "arrow" }, "▼")
            ]),
            $data.showInputMenu ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "input-dropdown-mask",
              onClick: _cache[1] || (_cache[1] = ($event) => $data.showInputMenu = false)
            })) : vue.createCommentVNode("v-if", true),
            $data.showInputMenu ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "input-dropdown-menu"
            }, [
              vue.createElementVNode("navigator", {
                url: "/pages/health-input/health-input",
                class: "menu-item",
                "hover-class": "none"
              }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "✎"),
                vue.createElementVNode("text", null, "手动录入")
              ]),
              vue.createElementVNode("navigator", {
                url: "/pages/health-input/health-input?tab=1",
                class: "menu-item",
                "hover-class": "none"
              }, [
                vue.createElementVNode("text", { class: "menu-icon" }, "🎤"),
                vue.createElementVNode("text", null, "语音记录")
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "score-card" }, [
          vue.createElementVNode("view", { class: "score-info" }, [
            vue.createElementVNode(
              "text",
              { class: "score-title" },
              vue.toDisplayString($options.scoreTitle),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "score-main" }, [
              vue.createElementVNode(
                "text",
                { class: "score-num" },
                vue.toDisplayString($data.healthScore),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "score-unit" }, "健康评分")
            ]),
            vue.createElementVNode(
              "text",
              { class: "score-desc" },
              vue.toDisplayString($options.scoreDesc),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "stats-row" }, [
              vue.createElementVNode("view", { class: "stat-col" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-val" },
                  vue.toDisplayString($data.bodyStatus),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-txt" }, "身体状态")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "donut-area" }, [
            vue.createElementVNode("view", { class: "donut-ring" }, [
              vue.createElementVNode("view", { class: "ring-seg ring-seg1" }),
              vue.createElementVNode("view", { class: "ring-seg ring-seg2" }),
              vue.createElementVNode("view", { class: "ring-seg ring-seg3" }),
              vue.createElementVNode("view", { class: "ring-seg ring-seg4" })
            ])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "home-body" }, [
        vue.createElementVNode("text", { class: "sec-title" }, "健康指标"),
        vue.createElementVNode("view", { class: "metrics-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.metrics, (m, idx) => {
              return vue.openBlock(), vue.createElementBlock("navigator", {
                key: idx,
                url: "/pages/health-detail/health-detail?type=" + m.type,
                class: "m-card",
                "hover-class": "m-card-hover"
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "m-icon-circle",
                    style: vue.normalizeStyle({ background: m.iconBg })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "m-emoji" },
                      vue.toDisplayString(m.icon),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "m-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "m-label" },
                    vue.toDisplayString(m.label),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "m-val-line" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "m-val" },
                      vue.toDisplayString(m.value),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "m-unit" },
                      vue.toDisplayString(m.unit),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "m-status",
                      style: vue.normalizeStyle({ color: m.statusColor })
                    },
                    vue.toDisplayString(m.status),
                    5
                    /* TEXT, STYLE */
                  )
                ])
              ], 8, ["url"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("text", { class: "sec-title" }, "今日建议"),
        vue.createElementVNode("view", { class: "advice-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.adviceList, (a, idx) => {
              return vue.openBlock(), vue.createElementBlock("navigator", {
                key: idx,
                url: "/pages/health-advice/health-advice",
                class: "advice-item",
                "hover-class": "advice-hover"
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "a-icon",
                    style: vue.normalizeStyle({ background: a.iconBg })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(a.icon),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "a-body" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "a-title" },
                    vue.toDisplayString(a.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "a-desc" },
                    vue.toDisplayString(a.desc),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createVNode(_component_CustomTabbar, { current: 0 })
    ]);
  }
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-07e72d3c"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/home/home.vue"]]);
  function sendMessage(data) {
    return request({ url: "/consult/chat", method: "POST", data });
  }
  function getConversationList() {
    return request({ url: "/consult/conversations" });
  }
  function getConversationDetail(id) {
    return request({ url: `/consult/conversations/${id}` });
  }
  function deleteConversation(id) {
    return request({ url: `/consult/conversations/${id}`, method: "DELETE" });
  }
  function uploadConsultFile(filePath, type = "image") {
    return new Promise((resolve, reject) => {
      const token = getToken();
      uni.uploadFile({
        url: config.API_PREFIX + "/consult/files/upload",
        filePath,
        name: "file",
        formData: { type },
        header: token ? { Authorization: "Bearer " + token } : {},
        success: (res) => {
          try {
            const body = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            if (body && body.code === 0) {
              resolve(body);
            } else {
              reject(body && body.message || "文件上传失败");
            }
          } catch (e) {
            reject("文件上传响应解析失败");
          }
        },
        fail: (err) => reject(err)
      });
    });
  }
  function transcribeConsultAudio(filePath) {
    return new Promise((resolve, reject) => {
      const token = getToken();
      uni.uploadFile({
        url: config.API_PREFIX + "/consult/audio-to-text",
        filePath,
        name: "file",
        header: token ? { Authorization: "Bearer " + token } : {},
        success: (res) => {
          try {
            const body = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            if (body && body.code === 0) {
              resolve(body);
            } else {
              reject(body && body.message || "语音转文字失败");
            }
          } catch (e) {
            reject("语音转文字响应解析失败");
          }
        },
        fail: (err) => reject(err)
      });
    });
  }
  function recognizeSpeech(filePath) {
    return new Promise((resolve, reject) => {
      const token = getToken();
      formatAppLog("log", "at api/speech.js:12", "[Speech] 开始上传音频文件:", filePath);
      uni.uploadFile({
        url: config.API_PREFIX + "/speech/recognize",
        filePath,
        name: "file",
        header: token ? { "Authorization": "Bearer " + token } : {},
        success: (res) => {
          formatAppLog("log", "at api/speech.js:20", "[Speech] 上传成功, statusCode:", res.statusCode);
          try {
            const body = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            formatAppLog("log", "at api/speech.js:23", "[Speech] 响应:", JSON.stringify(body));
            if (body.code === 0 && body.data && body.data.text) {
              resolve(body.data.text);
            } else {
              reject(body.message || "语音识别失败");
            }
          } catch (e) {
            formatAppLog("error", "at api/speech.js:31", "[Speech] 解析响应失败:", e);
            reject("解析识别结果失败");
          }
        },
        fail: (err) => {
          formatAppLog("error", "at api/speech.js:36", "[Speech] 上传失败:", err);
          reject("网络异常，上传失败");
        }
      });
    });
  }
  const _sfc_main$k = {
    components: { CustomTabbar },
    data() {
      return {
        consultMode: 0,
        showModeSheet: false,
        showSidebar: false,
        inputText: "",
        scrollIntoId: "",
        isLoading: false,
        isTyping: false,
        shouldStop: false,
        showQuickQ: true,
        tempImagePath: "",
        tempAudioPath: "",
        isRecording: false,
        isRecognizing: false,
        touchStartY: 0,
        isCanceled: false,
        recordStartTime: 0,
        recorderManager: null,
        recordFormat: "m4a",
        recordStarting: false,
        pendingStop: false,
        kbUp: false,
        kbHeight: 0,
        currentHistoryIdx: -1,
        currentConversationId: "",
        historyList: [],
        msgList: [],
        quickQuestions: [
          "我的血压偏高，日常饮食应该注意什么？",
          "最近睡眠质量不好，有什么改善方法？",
          "中医养生有哪些适合老年人的方法？"
        ]
      };
    },
    computed: {
      hasInput() {
        return (this.inputText || "").trim().length > 0;
      },
      bottomStyle() {
        if (this.kbUp && this.kbHeight > 0) {
          return { bottom: this.kbHeight + "px" };
        }
        return { bottom: "calc(110rpx + env(safe-area-inset-bottom))" };
      },
      scrollPadBottom() {
        if (this.kbUp && this.kbHeight > 0) {
          return this.kbHeight + 60;
        }
        return 200;
      }
    },
    onLoad() {
      const sys = uni.getSystemInfoSync();
      if ((sys.platform || "").toLowerCase().includes("android")) {
        this.recordFormat = "m4a";
      }
      this.pushWelcome();
      this.initRecorder();
      this.fetchConversations();
      uni.onKeyboardHeightChange((res) => {
        if (res.height > 0) {
          this.kbUp = true;
          this.kbHeight = res.height;
        } else {
          this.kbUp = false;
          this.kbHeight = 0;
        }
        this.$nextTick(() => this.scrollToEnd());
      });
    },
    methods: {
      initRecorder() {
        try {
          this.recorderManager = uni.getRecorderManager();
          this.recorderManager.onStop((res) => {
            this.isRecognizing = false;
            this.isRecording = false;
            if (this.isCanceled)
              return;
            if (!res || !res.tempFilePath) {
              uni.showToast({ title: "语音录制失败", icon: "none" });
              return;
            }
            this.tempAudioPath = res.tempFilePath;
            this.sendVoiceMessage();
          });
          this.recorderManager.onError(() => {
            this.isRecognizing = false;
            this.isRecording = false;
            uni.showToast({ title: "语音录制失败", icon: "none" });
          });
        } catch (e) {
          formatAppLog("warn", "at pages/ai-consult/ai-consult.vue:321", "[AI咨询] 初始化录音器失败", e);
        }
      },
      pushWelcome() {
        this.msgList = [{
          role: "ai",
          content: "您好！我是您的AI健康助手小Y，很高兴为您服务。请问有什么可以帮您的吗？"
        }];
      },
      async fetchConversations() {
        try {
          const res = await getConversationList();
          const rows = res.data && res.data.data || [];
          this.historyList = rows.map((item) => ({
            id: item.id,
            title: item.name || "新对话",
            time: this.formatTs(item.created_at || item.updated_at)
          }));
        } catch (e) {
          formatAppLog("warn", "at pages/ai-consult/ai-consult.vue:340", "[AI咨询] 获取会话列表失败", e);
        }
      },
      formatTs(ts) {
        if (!ts)
          return "";
        const ms = String(ts).length === 10 ? Number(ts) * 1e3 : Number(ts);
        const d = new Date(ms);
        const p = (n) => n < 10 ? "0" + n : "" + n;
        return `${d.getMonth() + 1}-${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
      },
      onInputFocus() {
        this.$nextTick(() => setTimeout(() => this.scrollToEnd(), 300));
      },
      onInputBlur() {
      },
      onScrollTouch() {
        if (this.kbUp) {
          uni.hideKeyboard();
        }
      },
      async sendMessage(overrideText) {
        const txt = (typeof overrideText === "string" ? overrideText : this.inputText || "").trim();
        const hasImage = !!this.tempImagePath;
        const hasAudio = !!this.tempAudioPath;
        if (!txt && !hasImage && !hasAudio) {
          uni.showToast({ title: "请输入消息或上传文件", icon: "none" });
          return;
        }
        const userMsg = { role: "user", content: txt || (hasImage ? "[图片消息]" : "[语音消息]") };
        if (hasImage)
          userMsg.imageUrl = this.tempImagePath;
        if (hasAudio)
          userMsg.audio = true;
        this.msgList.push(userMsg);
        const savedImagePath = this.tempImagePath;
        const savedAudioPath = this.tempAudioPath;
        this.inputText = "";
        this.tempImagePath = "";
        this.tempAudioPath = "";
        this.showQuickQ = false;
        this.$nextTick(() => this.scrollToEnd());
        this.isLoading = true;
        try {
          const files = [];
          if (hasImage) {
            const uploadRes = await uploadConsultFile(savedImagePath, "image");
            const uploadFileId = uploadRes.data && uploadRes.data.id;
            if (uploadFileId)
              files.push({ type: "image", uploadFileId });
          }
          if (hasAudio) {
            const uploadRes = await uploadConsultFile(savedAudioPath, "audio");
            const uploadFileId = uploadRes.data && uploadRes.data.id;
            if (uploadFileId)
              files.push({ type: "audio", uploadFileId });
          }
          const req = {
            message: txt || (hasImage ? "请结合图片进行分析" : "请结合语音内容进行分析"),
            conversationId: this.currentConversationId || void 0,
            files
          };
          const res = await sendMessage(req);
          const payload = res.data || {};
          this.currentConversationId = payload.conversation_id || this.currentConversationId;
          const answer = this.formatAiText(payload.answer) || "我已经收到你的消息，但暂时没有生成回答。";
          this.isLoading = false;
          await this.typewriterPush(answer);
          await this.fetchConversations();
        } catch (e) {
          const msg = e && e.message || (typeof e === "string" ? e : "发送失败，请稍后重试");
          this.isLoading = false;
          this.msgList.push({ role: "ai", content: "抱歉，当前无法完成本次问答：" + msg });
          this.scrollToEnd();
        }
      },
      async sendVoiceMessage() {
        if (!this.tempAudioPath)
          return;
        this.isLoading = true;
        try {
          const transRes = await transcribeConsultAudio(this.tempAudioPath);
          const text = transRes.data && transRes.data.text || "";
          if (!text.trim())
            throw new Error("语音识别结果为空");
          this.fillRecognizedText(text);
        } catch (e) {
          try {
            const text = await recognizeSpeech(this.tempAudioPath);
            if (!text || !text.trim())
              throw new Error("语音识别结果为空");
            uni.showToast({ title: "已切换备用识别通道", icon: "none" });
            this.fillRecognizedText(text);
          } catch (fallbackErr) {
            this.isLoading = false;
            this.tempAudioPath = "";
            uni.showToast({ title: "语音识别失败，请重试", icon: "none" });
          }
        }
      },
      fillRecognizedText(text) {
        this.tempAudioPath = "";
        this.isLoading = false;
        this.inputText = (text || "").trim();
        this.showQuickQ = false;
        this.$nextTick(() => {
          uni.showToast({ title: "识别完成，请确认后发送", icon: "none" });
        });
      },
      typewriterPush(fullText) {
        return new Promise((resolve) => {
          const aiMsg = { role: "ai", content: "" };
          this.msgList.push(aiMsg);
          this.isTyping = true;
          this.shouldStop = false;
          const idx = this.msgList.length - 1;
          let pos = 0;
          const step = () => {
            if (this.shouldStop || pos >= fullText.length) {
              this.msgList[idx] = { role: "ai", content: fullText };
              this.isTyping = false;
              this.scrollToEnd();
              resolve();
              return;
            }
            const chunk = Math.min(pos + 2, fullText.length);
            this.msgList[idx] = { role: "ai", content: fullText.substring(0, chunk) };
            pos = chunk;
            if (pos % 10 === 0)
              this.scrollToEnd();
            setTimeout(step, 30);
          };
          step();
        });
      },
      stopTyping() {
        this.shouldStop = true;
      },
      sendQuick(q) {
        this.inputText = q;
        this.sendMessage();
      },
      startNewChat() {
        uni.showModal({
          title: "新建对话",
          content: "确定要开始新的对话吗？",
          success: (res) => {
            if (res.confirm) {
              this.currentConversationId = "";
              this.currentHistoryIdx = -1;
              this.pushWelcome();
              this.showQuickQ = true;
            }
          }
        });
      },
      startRecording(e) {
        this.touchStartY = e.touches[0].clientY;
        this.isCanceled = false;
        this.recordStartTime = Date.now();
        this.isRecording = true;
        this.recordStarting = true;
        this.pendingStop = false;
        if (!this.recorderManager) {
          uni.showToast({ title: "当前设备不支持录音", icon: "none" });
          this.isRecording = false;
          this.recordStarting = false;
          return;
        }
        this.startRecorderInternal();
      },
      startRecorderInternal() {
        try {
          this.recorderManager.start({
            duration: 6e4,
            sampleRate: 16e3,
            numberOfChannels: 1,
            format: this.recordFormat
          });
          setTimeout(() => {
            this.recordStarting = false;
            if (this.pendingStop) {
              this.pendingStop = false;
              this.stopRecording();
            }
          }, 200);
        } catch (e) {
          this.recordStarting = false;
          this.isRecording = false;
          uni.showToast({ title: "录音启动失败", icon: "none" });
        }
      },
      ensureRecordPermission() {
        return new Promise((resolve) => {
          uni.authorize({
            scope: "scope.record",
            success: () => resolve(true),
            fail: () => {
              uni.showModal({
                title: "需要麦克风权限",
                content: "语音问答需要麦克风权限，请在系统设置中允许。",
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting({
                      success: (s) => resolve(!!(s.authSetting && s.authSetting["scope.record"])),
                      fail: () => resolve(false)
                    });
                  } else {
                    resolve(false);
                  }
                },
                fail: () => resolve(false)
              });
            }
          });
        });
      },
      onTouchMove(e) {
        if (!this.isRecording)
          return;
        this.isCanceled = this.touchStartY - e.touches[0].clientY > 50;
      },
      stopRecording() {
        if (!this.isRecording)
          return;
        if (this.recordStarting) {
          this.pendingStop = true;
          return;
        }
        if (this.isCanceled) {
          this.isRecording = false;
          this.recorderManager && this.recorderManager.stop();
          uni.showToast({ title: "已取消发送", icon: "none" });
          return;
        }
        if (Date.now() - this.recordStartTime < 1e3) {
          this.isRecording = false;
          this.recorderManager && this.recorderManager.stop();
          uni.showToast({ title: "说话时间太短", icon: "none" });
          return;
        }
        this.isRecognizing = true;
        this.recorderManager && this.recorderManager.stop();
      },
      chooseImage() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            this.tempImagePath = res.tempFilePaths[0];
          }
        });
      },
      switchMode(mode) {
        this.consultMode = mode;
        this.showModeSheet = false;
        if (mode === 1)
          uni.showToast({ title: "已切换到AI问诊模式", icon: "none" });
      },
      async loadHistory(idx) {
        this.currentHistoryIdx = idx;
        this.showSidebar = false;
        const row = this.historyList[idx];
        if (!row || !row.id)
          return;
        this.currentConversationId = row.id;
        try {
          const res = await getConversationDetail(row.id);
          const rows = res.data && res.data.data || [];
          const list = [];
          rows.forEach((item) => {
            if (item.query)
              list.push({ role: "user", content: item.query });
            if (item.answer)
              list.push({ role: "ai", content: this.formatAiText(item.answer) });
          });
          this.msgList = list;
          if (!this.msgList.length)
            this.pushWelcome();
          this.scrollToEnd();
        } catch (e) {
          uni.showToast({ title: "加载历史失败", icon: "none" });
        }
      },
      deleteHistory(idx) {
        uni.showModal({
          title: "删除对话",
          content: "确定删除？",
          success: async (r) => {
            if (!r.confirm)
              return;
            const row = this.historyList[idx];
            try {
              if (row && row.id)
                await deleteConversation(row.id);
              this.historyList.splice(idx, 1);
              if (this.currentConversationId === row.id) {
                this.currentConversationId = "";
                this.pushWelcome();
              }
            } catch (e) {
              uni.showToast({ title: "删除失败", icon: "none" });
            }
          }
        });
      },
      previewImg(url) {
        uni.previewImage({ urls: [url], current: url });
      },
      formatAiText(raw) {
        if (!raw || typeof raw !== "string")
          return "";
        return raw.replace(/\r\n/g, "\n").replace(/^#{1,6}\s*/gm, "").replace(/\*\*\*(.*?)\*\*\*/g, "$1").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`{1,3}(.*?)`{1,3}/g, "$1").replace(/^\s*[-*]\s+/gm, "• ").replace(/^\s*\d+\.\s+/gm, (m) => m).replace(/\n{3,}/g, "\n\n").trim();
      },
      scrollToEnd() {
        this.$nextTick(() => {
          this.scrollIntoId = "";
          setTimeout(() => {
            this.scrollIntoId = "mEnd";
          }, 50);
        });
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomTabbar = vue.resolveComponent("CustomTabbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["sidebar", { "sidebar-show": $data.showSidebar }])
        },
        [
          vue.createElementVNode("view", { class: "sidebar-header" }, [
            vue.createElementVNode("text", { class: "sidebar-title" }, "对话历史"),
            vue.createElementVNode("view", {
              class: "sidebar-close",
              onClick: _cache[0] || (_cache[0] = ($event) => $data.showSidebar = false)
            }, [
              vue.createElementVNode("text", { class: "close-x" }, "×")
            ])
          ]),
          vue.createElementVNode("scroll-view", {
            "scroll-y": "",
            class: "sidebar-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.historyList, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: idx,
                  class: vue.normalizeClass(["history-item", { active: $data.currentHistoryIdx === idx }]),
                  onClick: ($event) => $options.loadHistory(idx)
                }, [
                  vue.createElementVNode("view", { class: "hi-left" }, [
                    vue.createElementVNode("text", { class: "hi-icon" }, "💬"),
                    vue.createElementVNode("view", { class: "hi-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "hi-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "hi-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", {
                    class: "hi-del",
                    onClick: vue.withModifiers(($event) => $options.deleteHistory(idx), ["stop"])
                  }, [
                    vue.createElementVNode("text", null, "🗑")
                  ], 8, ["onClick"])
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            !$data.historyList.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createElementVNode("text", { class: "empty-icon-big" }, "📭"),
              vue.createElementVNode("text", { class: "empty-text" }, "暂无对话历史")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ],
        2
        /* CLASS */
      ),
      $data.showSidebar ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "sidebar-mask",
        onClick: _cache[1] || (_cache[1] = ($event) => $data.showSidebar = false)
      })) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "nav-header" }, [
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode("view", {
            class: "history-btn",
            onClick: _cache[2] || (_cache[2] = ($event) => $data.showSidebar = true)
          }, [
            vue.createElementVNode("text", { class: "h-icon" }, "🕐")
          ]),
          vue.createElementVNode("view", { class: "header-info" }, [
            vue.createElementVNode("text", { class: "bot-name" }, "小Y"),
            vue.createElementVNode("text", { class: "bot-status" }, "在线")
          ]),
          vue.createElementVNode("view", {
            class: "new-chat-btn",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.startNewChat && $options.startNewChat(...args))
          }, [
            vue.createElementVNode("text", { class: "nc-icon" }, "💬"),
            vue.createElementVNode("text", { class: "nc-text" }, "新对话")
          ])
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "msg-scroll",
        "scroll-y": "",
        "scroll-into-view": $data.scrollIntoId,
        "scroll-with-animation": true,
        style: vue.normalizeStyle({ paddingBottom: $options.scrollPadBottom + "px" }),
        onTouchstart: _cache[4] || (_cache[4] = (...args) => $options.onScrollTouch && $options.onScrollTouch(...args))
      }, [
        vue.createElementVNode("view", { class: "msg-inner" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.msgList, (msg, idx) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: idx,
                id: "m" + idx,
                class: vue.normalizeClass(["msg-row", msg.role === "user" ? "msg-right" : "msg-left"])
              }, [
                msg.role === "ai" ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 0 },
                  [
                    vue.createElementVNode("view", { class: "avatar ai-av" }, [
                      vue.createElementVNode("text", null, "🤖")
                    ]),
                    vue.createElementVNode("view", { class: "bubble-wrap" }, [
                      vue.createElementVNode("view", { class: "bubble bubble-ai" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "bubble-text" },
                          vue.toDisplayString(msg.content),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    vue.createElementVNode("view", { class: "bubble-wrap bubble-wrap-right" }, [
                      vue.createElementVNode("view", { class: "bubble bubble-user" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "bubble-text" },
                          vue.toDisplayString(msg.content),
                          1
                          /* TEXT */
                        )
                      ]),
                      msg.imageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "img-in-msg"
                      }, [
                        vue.createElementVNode("image", {
                          src: msg.imageUrl,
                          class: "chat-img",
                          mode: "widthFix",
                          onClick: ($event) => $options.previewImg(msg.imageUrl)
                        }, null, 8, ["src", "onClick"])
                      ])) : vue.createCommentVNode("v-if", true)
                    ]),
                    vue.createElementVNode("view", { class: "avatar user-av" }, [
                      vue.createElementVNode("text", null, "👤")
                    ])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                ))
              ], 10, ["id"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            id: "mLoading",
            class: "msg-row msg-left"
          }, [
            vue.createElementVNode("view", { class: "avatar ai-av" }, [
              vue.createElementVNode("text", null, "🤖")
            ]),
            vue.createElementVNode("view", { class: "bubble-wrap" }, [
              vue.createElementVNode("view", { class: "bubble bubble-ai loading-bubble" }, [
                vue.createElementVNode("view", { class: "loading-dots" }, [
                  vue.createElementVNode("text", { class: "dot" }),
                  vue.createElementVNode("text", { class: "dot" }),
                  vue.createElementVNode("text", { class: "dot" })
                ])
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            id: "mEnd",
            style: { "height": "20rpx" }
          })
        ])
      ], 44, ["scroll-into-view"]),
      $data.isTyping ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "stop-bar",
        onClick: _cache[5] || (_cache[5] = (...args) => $options.stopTyping && $options.stopTyping(...args))
      }, [
        vue.createElementVNode("view", { class: "stop-pill" }, [
          vue.createElementVNode("text", { class: "stop-icon-txt" }, "⏹"),
          vue.createElementVNode("text", { class: "stop-text" }, "停止生成")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: "bottom-fixed",
          style: vue.normalizeStyle($options.bottomStyle)
        },
        [
          $data.showQuickQ && !$data.isLoading && !$data.isTyping && !$data.kbUp ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "quick-questions"
          }, [
            vue.createElementVNode("scroll-view", {
              "scroll-x": "",
              class: "qq-scroll"
            }, [
              vue.createElementVNode("view", { class: "qq-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.quickQuestions, (q, i) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: i,
                      class: "qq-tag",
                      onClick: ($event) => $options.sendQuick(q)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(q),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $data.tempImagePath ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "img-preview-area"
          }, [
            vue.createElementVNode("view", { class: "img-preview-card" }, [
              vue.createElementVNode("image", {
                src: $data.tempImagePath,
                class: "preview-thumb",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", {
                class: "preview-del",
                onClick: _cache[6] || (_cache[6] = ($event) => $data.tempImagePath = "")
              }, [
                vue.createElementVNode("text", null, "×")
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "input-bar" }, [
            vue.createElementVNode("view", { class: "input-row" }, [
              !$options.hasInput ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "icon-btn",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.chooseImage && $options.chooseImage(...args))
              }, [
                vue.createElementVNode("text", { class: "ib-icon" }, "📷")
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "input-box" }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.inputText = $event),
                  class: "chat-input",
                  placeholder: $options.hasInput ? "请输入消息..." : "发消息或按住说话...",
                  "placeholder-class": "ph",
                  "confirm-type": "send",
                  "adjust-position": false,
                  onConfirm: _cache[9] || (_cache[9] = (...args) => $options.sendMessage && $options.sendMessage(...args)),
                  onFocus: _cache[10] || (_cache[10] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
                  onBlur: _cache[11] || (_cache[11] = (...args) => $options.onInputBlur && $options.onInputBlur(...args))
                }, null, 40, ["placeholder"]), [
                  [vue.vModelText, $data.inputText]
                ])
              ]),
              !$options.hasInput ? (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["icon-btn voice-area", { "voice-active": $data.isRecording || $data.isRecognizing }]),
                      onTouchstart: _cache[12] || (_cache[12] = (...args) => $options.startRecording && $options.startRecording(...args)),
                      onTouchmove: _cache[13] || (_cache[13] = (...args) => $options.onTouchMove && $options.onTouchMove(...args)),
                      onTouchend: _cache[14] || (_cache[14] = (...args) => $options.stopRecording && $options.stopRecording(...args))
                    },
                    [
                      vue.createElementVNode("text", { class: "ib-icon" }, "🎤")
                    ],
                    34
                    /* CLASS, NEED_HYDRATION */
                  ),
                  vue.createElementVNode("view", {
                    class: "icon-btn",
                    onClick: _cache[15] || (_cache[15] = ($event) => $data.showModeSheet = true)
                  }, [
                    vue.createElementVNode("text", { class: "ib-icon" }, "⊕")
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              )) : vue.createCommentVNode("v-if", true),
              $options.hasInput ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "send-btn",
                onClick: _cache[16] || (_cache[16] = (...args) => $options.sendMessage && $options.sendMessage(...args))
              }, [
                vue.createElementVNode("text", { class: "send-text" }, "发送")
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      $data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "recording-overlay"
      }, [
        vue.createElementVNode("view", { class: "recording-modal" }, [
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass(["rec-emoji", { "rec-cancel": $data.isCanceled }])
            },
            "🎤",
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "text",
            { class: "rec-status" },
            vue.toDisplayString($data.isCanceled ? "松开手指，取消发送" : $data.isRecognizing ? "正在识别..." : "正在录音..."),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            {
              class: "rec-tip",
              style: vue.normalizeStyle({ color: $data.isCanceled ? "#ff4d4f" : $data.isRecognizing ? "#67c23a" : "#4A90D9" })
            },
            vue.toDisplayString($data.isCanceled ? "手指上滑，取消发送" : $data.isRecognizing ? "请稍候" : "松开发送"),
            5
            /* TEXT, STYLE */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showModeSheet ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "sheet-mask",
        onClick: _cache[21] || (_cache[21] = ($event) => $data.showModeSheet = false)
      }, [
        vue.createElementVNode("view", {
          class: "sheet-panel",
          onClick: _cache[20] || (_cache[20] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("text", { class: "sheet-title" }, "切换模式"),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["sheet-opt", { active: $data.consultMode === 0 }]),
              onClick: _cache[17] || (_cache[17] = ($event) => $options.switchMode(0))
            },
            [
              vue.createElementVNode("text", { class: "so-icon" }, "💬"),
              vue.createElementVNode("view", { class: "so-info" }, [
                vue.createElementVNode("text", { class: "so-name" }, "智能问答"),
                vue.createElementVNode("text", { class: "so-desc" }, "自由提问，AI即时回答")
              ]),
              $data.consultMode === 0 ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "so-check"
              }, "✓")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["sheet-opt", { active: $data.consultMode === 1 }]),
              onClick: _cache[18] || (_cache[18] = ($event) => $options.switchMode(1))
            },
            [
              vue.createElementVNode("text", { class: "so-icon" }, "🩺"),
              vue.createElementVNode("view", { class: "so-info" }, [
                vue.createElementVNode("text", { class: "so-name" }, "AI主动问诊"),
                vue.createElementVNode("text", { class: "so-desc" }, "AI引导问答，系统化评估")
              ]),
              $data.consultMode === 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "so-check"
              }, "✓")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("view", {
            class: "sheet-cancel",
            onClick: _cache[19] || (_cache[19] = ($event) => $data.showModeSheet = false)
          }, [
            vue.createElementVNode("text", null, "取消")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      !$data.kbUp ? (vue.openBlock(), vue.createBlock(_component_CustomTabbar, {
        key: 4,
        current: 1
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAiConsultAiConsult = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-78fd8d65"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/ai-consult/ai-consult.vue"]]);
  function generatePlan() {
    return request({ url: "/plan/generate", method: "POST", showLoading: false });
  }
  function getCurrentPlan() {
    return request({ url: "/plan/current" });
  }
  function getExercisePlan() {
    return request({ url: "/plan/exercise" });
  }
  function updateExercisePlan(data) {
    return request({ url: "/plan/exercise", method: "PUT", data });
  }
  function getDietPlan() {
    return request({ url: "/plan/diet" });
  }
  function updateDietPlan(data) {
    return request({ url: "/plan/diet", method: "PUT", data });
  }
  function getMedicationPlan() {
    return request({ url: "/plan/medication" });
  }
  function getCheckupPlan() {
    return request({ url: "/plan/checkup" });
  }
  function addCheckupRecord(data) {
    return request({ url: "/plan/checkup", method: "POST", data });
  }
  function getTodayTasks() {
    return request({ url: "/plan/tasks/today" });
  }
  function completeTask(taskId) {
    return request({ url: `/plan/tasks/${taskId}/complete`, method: "POST" });
  }
  function getTaskHistory(params) {
    return request({ url: "/plan/tasks/history", data: params });
  }
  const _sfc_main$j = {
    components: { CustomTabbar },
    data() {
      return {
        aiLoading: false,
        tasks: []
      };
    },
    computed: {
      pendingTasks() {
        return this.tasks.filter((t) => !t.done);
      },
      doneTasks() {
        return this.tasks.filter((t) => t.done);
      },
      doneCount() {
        return this.doneTasks.length;
      },
      completionPercent() {
        if (!this.tasks.length)
          return 0;
        return Math.round(this.doneCount / this.tasks.length * 100);
      },
      ringStyle() {
        const deg = this.completionPercent / 100 * 360;
        return {
          background: `conic-gradient(#34C759 0deg ${deg}deg, transparent ${deg}deg 360deg)`
        };
      }
    },
    onShow() {
      uni.hideTabBar();
      this.loadTasks();
    },
    methods: {
      tagColor(type) {
        const m = { "运动": "#34C759", "饮食": "#FF9500", "用药": "#EF4444", "健康": "#4A90D9" };
        return m[type] || "#4A90D9";
      },
      typeLabel(type) {
        const m = { exercise: "运动", diet: "饮食", medication: "用药", health: "健康" };
        return m[type] || type;
      },
      async loadTasks() {
        try {
          const res = await getTodayTasks();
          this.tasks = (res.data || []).map((t) => ({
            id: t.id,
            title: t.title,
            type: this.typeLabel(t.taskType),
            time: t.taskTime || "",
            done: t.status === "done"
          }));
        } catch (e) {
          formatAppLog("error", "at pages/plan-overview/plan-overview.vue:137", "加载任务失败", e);
        }
      },
      async onAiGen() {
        if (this.aiLoading)
          return;
        this.aiLoading = true;
        const start = Date.now();
        const MIN_LOAD_MS = 8e3;
        try {
          await generatePlan();
          const rest = MIN_LOAD_MS - (Date.now() - start);
          if (rest > 0) {
            await new Promise((resolve) => setTimeout(resolve, rest));
          }
          uni.showToast({ title: "计划已生成", icon: "success" });
          await this.loadTasks();
        } catch (e) {
          uni.showToast({ title: "生成失败", icon: "none" });
        } finally {
          this.aiLoading = false;
        }
      },
      confirmComplete(item) {
        uni.showModal({
          title: "确认完成",
          content: `确定已完成「${item.title}」吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await completeTask(item.id);
                item.done = true;
                uni.showToast({ title: "已完成", icon: "success" });
              } catch (e) {
                uni.showToast({ title: "操作失败", icon: "none" });
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomTabbar = vue.resolveComponent("CustomTabbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      $data.aiLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-overlay"
      }, [
        vue.createElementVNode("view", { class: "loading-card" }, [
          vue.createElementVNode("view", { class: "spinner" }),
          vue.createElementVNode("text", { class: "loading-title" }, "AI正在生成健康计划"),
          vue.createElementVNode("text", { class: "loading-sub" }, "正在分析您的健康数据与用药记录...")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "plan-header" }, [
        vue.createElementVNode("text", { class: "plan-h-title" }, "健康计划"),
        vue.createElementVNode("text", { class: "plan-h-sub" }, "AI为您量身定制的七天健康管理方案"),
        vue.createElementVNode("view", {
          class: "ai-gen-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.onAiGen && $options.onAiGen(...args))
        }, [
          vue.createElementVNode("text", null, "✨ AI智能生成健康计划")
        ])
      ]),
      vue.createElementVNode("view", { class: "plan-body" }, [
        vue.createElementVNode("text", { class: "sec-title" }, "快捷入口"),
        vue.createElementVNode("view", { class: "quick-grid" }, [
          vue.createElementVNode("navigator", {
            url: "/pages/medication/medication",
            class: "quick-card",
            "hover-class": "quick-hover"
          }, [
            vue.createElementVNode("text", { class: "q-icon" }, "💊"),
            vue.createElementVNode("text", { class: "q-label" }, "用药管理"),
            vue.createElementVNode("text", { class: "q-count" }, "用药档案与记录")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/plan-edit/plan-edit",
            class: "quick-card",
            "hover-class": "quick-hover"
          }, [
            vue.createElementVNode("text", { class: "q-icon" }, "📅"),
            vue.createElementVNode("text", { class: "q-label" }, "当前计划"),
            vue.createElementVNode("text", { class: "q-count" }, "本周健康计划")
          ])
        ]),
        vue.createElementVNode("text", { class: "sec-title" }, "今日任务"),
        vue.createElementVNode("view", { class: "progress-card" }, [
          vue.createElementVNode("view", { class: "progress-ring-area" }, [
            vue.createElementVNode("view", { class: "ring-bg" }, [
              vue.createElementVNode(
                "view",
                {
                  class: "ring-fill",
                  style: vue.normalizeStyle($options.ringStyle)
                },
                null,
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "ring-center" }, [
                vue.createElementVNode(
                  "text",
                  { class: "ring-pct" },
                  vue.toDisplayString($options.completionPercent) + "%",
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "progress-info" }, [
            vue.createElementVNode(
              "text",
              { class: "pi-main" },
              vue.toDisplayString($options.doneCount) + "/" + vue.toDisplayString($data.tasks.length) + " 已完成",
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "pi-sub" }, "继续加油，完成今日健康任务"),
            vue.createElementVNode("view", { class: "pi-bar-wrap" }, [
              vue.createElementVNode("view", { class: "pi-bar-bg" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "pi-bar-fill",
                    style: vue.normalizeStyle({ width: $options.completionPercent + "%" })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ])
            ])
          ])
        ]),
        $options.pendingTasks.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "task-section"
        }, [
          vue.createElementVNode("text", { class: "task-sec-label" }, "待完成"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.pendingTasks, (t, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: "p" + i,
                class: "task-item",
                onClick: ($event) => $options.confirmComplete(t)
              }, [
                vue.createElementVNode("view", { class: "task-check" }, [
                  vue.createElementVNode("text", { class: "check-empty" })
                ]),
                vue.createElementVNode("view", { class: "task-body" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "task-name" },
                    vue.toDisplayString(t.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "task-time" },
                    vue.toDisplayString(t.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: "task-tag",
                    style: vue.normalizeStyle({ background: $options.tagColor(t.type) })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(t.type),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true),
        $options.doneTasks.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "task-section"
        }, [
          vue.createElementVNode("text", { class: "task-sec-label" }, "已完成"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.doneTasks, (t, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: "d" + i,
                class: "task-item task-done"
              }, [
                vue.createElementVNode("view", { class: "task-check checked" }, [
                  vue.createElementVNode("text", null, "✓")
                ]),
                vue.createElementVNode("view", { class: "task-body" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "task-name line-through" },
                    vue.toDisplayString(t.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "task-time" },
                    vue.toDisplayString(t.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: "task-tag",
                    style: vue.normalizeStyle({ background: $options.tagColor(t.type) })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(t.type),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createVNode(_component_CustomTabbar, { current: 2 })
    ]);
  }
  const PagesPlanOverviewPlanOverview = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-b97d5bf4"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-overview/plan-overview.vue"]]);
  const _sfc_main$i = {
    components: { CustomNavbar },
    data() {
      return {
        ringSize: 80,
        tasks: []
      };
    },
    computed: {
      dateText() {
        const d = /* @__PURE__ */ new Date();
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
      },
      pendingTasks() {
        return this.tasks.filter((t) => !t.done);
      },
      doneTasks() {
        return this.tasks.filter((t) => t.done);
      },
      doneCount() {
        return this.doneTasks.length;
      },
      completionPercent() {
        if (!this.tasks.length)
          return 0;
        return Math.round(this.doneCount / this.tasks.length * 100);
      }
    },
    onShow() {
      this.loadTasks();
    },
    mounted() {
      this.$nextTick(() => this.drawRing());
    },
    methods: {
      tagColor(type) {
        const m = { 运动: "#34C759", 饮食: "#FF9500", 用药: "#FF3B30", 健康: "#4A90D9" };
        return m[type] || "#4A90D9";
      },
      typeLabel(type) {
        const m = { exercise: "运动", diet: "饮食", medication: "用药", health: "健康" };
        return m[type] || type;
      },
      async loadTasks() {
        try {
          const res = await getTodayTasks();
          this.tasks = (res.data || []).map((t) => ({
            id: t.id,
            title: t.title,
            type: this.typeLabel(t.taskType),
            time: t.taskTime || "",
            done: t.status === "done"
          }));
          this.$nextTick(() => this.drawRing());
        } catch (e) {
          formatAppLog("error", "at pages/task-today/task-today.vue:133", "加载任务失败", e);
        }
      },
      async confirmComplete(item) {
        if (item.done)
          return;
        uni.showModal({
          title: "确认完成",
          content: `确定已完成任务「${item.title}」吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await completeTask(item.id);
                item.done = true;
                uni.showToast({ title: "已完成", icon: "success" });
                this.$nextTick(() => this.drawRing());
              } catch (e) {
                uni.showToast({ title: "操作失败", icon: "none" });
              }
            }
          }
        });
      },
      drawRing() {
        const ctx = uni.createCanvasContext("ringChart", this);
        const s = this.ringSize;
        const r = s / 2 - 6;
        const cx = s / 2, cy = s / 2;
        const percent = this.completionPercent / 100;
        ctx.setLineWidth(8);
        ctx.setLineCap("round");
        ctx.setStrokeStyle("#E5E6EB");
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
        if (percent > 0) {
          ctx.setStrokeStyle("#34C759");
          ctx.beginPath();
          ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * percent);
          ctx.stroke();
        }
        ctx.draw();
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page page-task-today" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "今日任务",
        showBack: true,
        bgColor: "#34C759",
        titleColor: "#fff"
      }),
      vue.createElementVNode("view", { class: "task-header" }, [
        vue.createElementVNode("view", { class: "header-row" }, [
          vue.createElementVNode(
            "text",
            { class: "date-text" },
            vue.toDisplayString($options.dateText),
            1
            /* TEXT */
          ),
          vue.createElementVNode("navigator", {
            url: "/pages/task-history/task-history",
            class: "link-history",
            "hover-class": "none"
          }, [
            vue.createElementVNode("text", null, "查看历史"),
            vue.createElementVNode("text", { class: "arr" }, "›")
          ])
        ]),
        vue.createElementVNode("view", { class: "progress-card" }, [
          vue.createElementVNode("view", { class: "progress-left" }, [
            vue.createElementVNode(
              "text",
              { class: "progress-percent" },
              vue.toDisplayString($options.completionPercent) + "%",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "progress-label" },
              vue.toDisplayString($options.doneCount) + "/" + vue.toDisplayString($data.tasks.length) + "完成",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "progress-right" }, [
            vue.createElementVNode(
              "canvas",
              {
                "canvas-id": "ringChart",
                id: "ringChart",
                class: "ring-canvas",
                style: vue.normalizeStyle({ width: $data.ringSize + "px", height: $data.ringSize + "px" })
              },
              null,
              4
              /* STYLE */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "task-body" }, [
        vue.createElementVNode("view", { class: "task-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "待完成"),
          vue.createElementVNode("view", { class: "task-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.pendingTasks, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: "pending-" + idx,
                  class: "task-card"
                }, [
                  vue.createElementVNode("view", {
                    class: "task-checkbox",
                    onClick: ($event) => $options.confirmComplete(item)
                  }, [
                    item.done ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      class: "check-icon"
                    }, "✓")) : vue.createCommentVNode("v-if", true)
                  ], 8, ["onClick"]),
                  vue.createElementVNode("view", { class: "task-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "task-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "task-meta" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "task-tag",
                          style: vue.normalizeStyle({ background: $options.tagColor(item.type) })
                        },
                        vue.toDisplayString(item.type),
                        5
                        /* TEXT, STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "task-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            !$options.pendingTasks.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-hint"
            }, [
              vue.createElementVNode("text", { class: "empty-txt" }, "🎉 今日任务已全部完成！")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "task-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "已完成"),
          vue.createElementVNode("view", { class: "task-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.doneTasks, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: "done-" + idx,
                  class: "task-card task-card-done"
                }, [
                  vue.createElementVNode("view", { class: "task-checkbox checked" }, [
                    vue.createElementVNode("text", { class: "check-icon" }, "✓")
                  ]),
                  vue.createElementVNode("view", { class: "task-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "task-title strikethrough" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "task-meta" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "task-tag",
                          style: vue.normalizeStyle({ background: $options.tagColor(item.type) })
                        },
                        vue.toDisplayString(item.type),
                        5
                        /* TEXT, STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "task-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            !$options.doneTasks.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-hint"
            }, [
              vue.createElementVNode("text", { class: "empty-txt" }, "暂无已完成任务")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ])
    ]);
  }
  const PagesTaskTodayTaskToday = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-9d6d08e3"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/task-today/task-today.vue"]]);
  function getUserProfile() {
    return request({ url: "/profile" });
  }
  function updateUserProfile(data) {
    return request({ url: "/profile", method: "PUT", data });
  }
  function uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      const token = getToken();
      uni.uploadFile({
        url: config.API_PREFIX + "/profile/avatar",
        filePath,
        name: "file",
        header: { "Authorization": "Bearer " + token },
        success: (res) => {
          try {
            const body = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            body.code === 0 ? resolve(body) : reject(body);
          } catch (e) {
            reject({ message: "解析响应失败" });
          }
        },
        fail: reject
      });
    });
  }
  function getAvatarUrl(avatarPath) {
    if (!avatarPath)
      return "";
    if (avatarPath.startsWith("http"))
      return avatarPath;
    return config.BASE_URL + "/" + avatarPath.replace(/^\//, "");
  }
  const _sfc_main$h = {
    components: { CustomTabbar },
    data() {
      return {
        userInfo: {}
      };
    },
    computed: {
      displayInitial() {
        const name = this.userInfo.nickname || this.userInfo.account || "";
        return name ? name.charAt(0) : "?";
      },
      avatarFullUrl() {
        return getAvatarUrl(this.userInfo.avatar);
      }
    },
    onShow() {
      uni.hideTabBar();
      this.loadUserInfo();
    },
    methods: {
      async loadUserInfo() {
        if (!isLoggedIn()) {
          this.userInfo = {};
          return;
        }
        const local = getUserInfo();
        if (local)
          this.userInfo = local;
        try {
          const res = await getUserBasicInfo();
          if (res.data) {
            this.userInfo = { ...this.userInfo, ...res.data };
          }
        } catch (e) {
        }
        try {
          const profileRes = await getUserProfile();
          if (profileRes.data) {
            const p = profileRes.data;
            if (p.avatar) {
              this.userInfo = { ...this.userInfo, avatar: p.avatar };
            }
            if (p.nickname && !this.userInfo.nickname) {
              this.userInfo.nickname = p.nickname;
            }
          }
        } catch (e) {
        }
      },
      noPage() {
        uni.showToast({ title: "功能开发中", icon: "none" });
      },
      doLogout() {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (!res.confirm)
              return;
            logout().catch(() => {
            });
            clearAuth();
            uni.reLaunch({ url: "/pages/login/login" });
          }
        });
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomTabbar = vue.resolveComponent("CustomTabbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page page-profile" }, [
      vue.createElementVNode("view", { class: "profile-header" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/profile-edit/profile-edit",
          class: "avatar-wrap",
          "hover-class": "none"
        }, [
          $data.userInfo.avatar ? (vue.openBlock(), vue.createElementBlock("image", {
            key: 0,
            src: $options.avatarFullUrl,
            class: "avatar-img",
            mode: "aspectFill"
          }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 1,
              class: "avatar-text"
            },
            vue.toDisplayString($options.displayInitial),
            1
            /* TEXT */
          ))
        ]),
        vue.createElementVNode(
          "text",
          { class: "user-name" },
          vue.toDisplayString($data.userInfo.nickname || $data.userInfo.account || "未登录"),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "badge" }, "健康达人")
      ]),
      vue.createElementVNode("view", { class: "menu-wrap" }, [
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("navigator", {
            url: "/pages/profile-edit/profile-edit",
            class: "menu-item",
            "hover-class": "none"
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#4A90D9" }
            }, "👤"),
            vue.createElementVNode("text", { class: "menu-title" }, "个人信息"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/medication/medication",
            class: "menu-item",
            "hover-class": "none"
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#34C759" }
            }, "📋"),
            vue.createElementVNode("text", { class: "menu-title" }, "健康档案"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.noPage && $options.noPage(...args))
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#FF9500" }
            }, "👨‍👩‍👧"),
            vue.createElementVNode("text", { class: "menu-title" }, "家庭成员"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ]),
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.noPage && $options.noPage(...args))
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#9B59B6" }
            }, "🔔"),
            vue.createElementVNode("text", { class: "menu-title" }, "消息通知"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.noPage && $options.noPage(...args))
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#1ABC9C" }
            }, "📤"),
            vue.createElementVNode("text", { class: "menu-title" }, "数据导出"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.noPage && $options.noPage(...args))
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#34495E" }
            }, "🔒"),
            vue.createElementVNode("text", { class: "menu-title" }, "隐私设置"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ]),
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("navigator", {
            url: "/pages/settings/settings",
            class: "menu-item",
            "hover-class": "none"
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#7F8C8D" }
            }, "⚙"),
            vue.createElementVNode("text", { class: "menu-title" }, "设置"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.noPage && $options.noPage(...args))
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#3498DB" }
            }, "❓"),
            vue.createElementVNode("text", { class: "menu-title" }, "帮助与反馈"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.noPage && $options.noPage(...args))
          }, [
            vue.createElementVNode("view", {
              class: "menu-icon",
              style: { "background": "#95A5A6" }
            }, "ℹ"),
            vue.createElementVNode("text", { class: "menu-title" }, "关于我们"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "logout-wrap" }, [
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.doLogout && $options.doLogout(...args))
        }, "退出登录")
      ]),
      vue.createVNode(_component_CustomTabbar, { current: 3 })
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-dd383ca2"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/profile/profile.vue"]]);
  function emptyDetail(conf) {
    return {
      ...conf,
      value: "--",
      statusText: "暂无数据",
      statusClass: "normal",
      records: []
    };
  }
  const METRIC_CONFIG$1 = {
    bp: { title: "血压详情", icon: "💓", unit: "/ mmHg", refRange: "收缩压 90-140 / 舒张压 60-90" },
    temperature: { title: "体温详情", icon: "🌡", unit: "°C", refRange: "36.0 - 37.3 °C" },
    bloodSugar: { title: "血糖详情", icon: "💧", unit: "mmol/L", refRange: "空腹 3.9 - 6.1 mmol/L" },
    bmi: { title: "BMI详情", icon: "⚖", unit: "kg/m²", refRange: "18.5 - 23.9" },
    heartRate: { title: "心率详情", icon: "💗", unit: "BPM", refRange: "60 - 100 BPM" },
    sleep: { title: "睡眠详情", icon: "🌙", unit: "小时", refRange: "7 - 9 小时" }
  };
  const ALL_DETAILS = {};
  for (const [k, v] of Object.entries(METRIC_CONFIG$1)) {
    ALL_DETAILS[k] = emptyDetail(v);
  }
  const _sfc_main$g = {
    components: { CustomNavbar },
    data() {
      return {
        metricType: "bp",
        detail: ALL_DETAILS.bp
      };
    },
    onLoad(options) {
      if (options && options.type && ALL_DETAILS[options.type]) {
        this.metricType = options.type;
        this.detail = { ...ALL_DETAILS[options.type] };
      }
    },
    onShow() {
      this.loadDetail();
    },
    methods: {
      async loadDetail() {
        try {
          const res = await getMetricDetail(this.metricType);
          if (res == null ? void 0 : res.data) {
            const d = res.data;
            this.detail = {
              ...METRIC_CONFIG$1[this.metricType],
              value: d.value || "--",
              statusText: d.statusText || "暂无数据",
              statusClass: d.statusClass || "normal",
              refRange: d.refRange || this.detail.refRange,
              records: (d.records || []).map((r) => {
                const t = (r.recordTime || "").toString();
                return {
                  date: r.recordDate || "",
                  time: t.length > 5 ? t.substring(0, 5) : t,
                  value: r.valueDisplay || "-",
                  statusClass: r.status === "danger" ? "high" : r.status || "normal",
                  status: r.statusText || ""
                };
              })
            };
          }
        } catch (e) {
        }
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: $data.detail.title,
        showBack: true,
        bgColor: "#4A90D9",
        titleColor: "#fff"
      }, null, 8, ["title"]),
      vue.createElementVNode("view", { class: "detail-header" }, [
        vue.createElementVNode("view", { class: "current-value-area" }, [
          vue.createElementVNode("view", { class: "icon-circle" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.detail.icon),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "val-row" }, [
            vue.createElementVNode(
              "text",
              { class: "big-value" },
              vue.toDisplayString($data.detail.value),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "big-unit" },
              vue.toDisplayString($data.detail.unit),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass("status-badge-" + $data.detail.statusClass)
            },
            [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.detail.statusText),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ]),
        vue.createElementVNode("view", { class: "reference-box" }, [
          vue.createElementVNode("text", { class: "ref-col" }, "正常范围"),
          vue.createElementVNode(
            "text",
            { class: "ref-col-bold" },
            vue.toDisplayString($data.detail.refRange),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "detail-body" }, [
        vue.createElementVNode("text", { class: "section-title" }, "最近 7 天记录"),
        vue.createElementVNode("view", { class: "record-list" }, [
          !$data.detail.records.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-record"
          }, [
            vue.createElementVNode("text", null, "暂无记录，请前往数据录入")
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.detail.records, (item, idx) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: idx,
                class: "record-item"
              }, [
                vue.createElementVNode("view", { class: "record-left" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "record-date" },
                    vue.toDisplayString(item.date),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "record-time" },
                    vue.toDisplayString(item.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["record-value", { "value-danger": item.statusClass !== "normal" }])
                  },
                  vue.toDisplayString(item.value),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["record-badge", "badge-" + item.statusClass])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.status),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesHealthDetailHealthDetail = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-ea663d6b"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/health-detail/health-detail.vue"]]);
  const _sfc_main$f = {
    name: "TabSwitch",
    props: {
      tabs: { type: Array, default: () => [] },
      modelValue: { type: Number, default: 0 }
    },
    emits: ["update:modelValue"]
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tab-switch" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.tabs, (item, idx) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: idx,
            class: vue.normalizeClass(["tab-item", { active: $props.modelValue === idx }]),
            onClick: ($event) => _ctx.$emit("update:modelValue", idx)
          }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(item),
              1
              /* TEXT */
            )
          ], 10, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const TabSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-b971217e"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/components/tab-switch.vue"]]);
  const ICON_BY_TYPE = {
    bp: "💓",
    heartRate: "❤",
    temperature: "🌡",
    bloodSugar: "💧",
    sleep: "🌙",
    breath: "🫁",
    weight: "⚖",
    height: "📏"
  };
  const METRIC_CONFIG = [
    { key: "bp", name: "血压", icon: "💓", unit: "mmHg", dual: true, ph1: "收缩压", ph2: "舒张压" },
    { key: "heartRate", name: "心率", icon: "❤", unit: "次/分", dual: false },
    { key: "temperature", name: "体温", icon: "🌡", unit: "°C", dual: false },
    { key: "bloodSugar", name: "血糖", icon: "💧", unit: "mmol/L", dual: false },
    { key: "sleep", name: "睡眠", icon: "🌙", unit: "小时", dual: false },
    { key: "breath", name: "呼吸", icon: "🫁", unit: "次/分", dual: false },
    { key: "weight", name: "体重", icon: "⚖", unit: "kg", dual: false },
    { key: "height", name: "身高", icon: "📏", unit: "cm", dual: false }
  ];
  const _sfc_main$e = {
    components: { CustomNavbar, TabSwitch },
    data() {
      return {
        tabIndex: 0,
        metricConfig: METRIC_CONFIG,
        formData: {
          bp: { high: "", low: "" },
          heartRate: "",
          temperature: "",
          bloodSugar: "",
          sleep: "",
          breath: "",
          weight: "",
          height: ""
        },
        recordDate: "",
        recordTime: "",
        notes: "",
        // 语音录入
        isRecording: false,
        recognizing: false,
        voiceResult: "",
        extractedTags: [],
        recordDuration: 0,
        recorderManager: null,
        recordTimer: null
      };
    },
    computed: {
      voiceHint() {
        if (this.isRecording)
          return "正在录音，再次点击停止...";
        if (this.recognizing)
          return "正在识别中，请稍候...";
        return "点击按钮开始语音记录（最长60秒）";
      }
    },
    onLoad(options) {
      if (options && options.tab === "1") {
        this.tabIndex = 1;
      }
      const d = /* @__PURE__ */ new Date();
      this.recordDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      this.recordTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      this.initRecorder();
    },
    onUnload() {
      this.clearRecordTimer();
      if (this.recorderManager && this.isRecording) {
        this.recorderManager.stop();
      }
    },
    methods: {
      initRecorder() {
        const rm = uni.getRecorderManager();
        rm.onStart(() => {
          this.isRecording = true;
          this.recordDuration = 0;
          this.startRecordTimer();
        });
        rm.onStop((res) => {
          this.isRecording = false;
          this.clearRecordTimer();
          formatAppLog("log", "at pages/health-input/health-input.vue:183", "[Recorder] onStop, tempFilePath:", res.tempFilePath, "duration:", res.duration, "fileSize:", res.fileSize);
          if (res.tempFilePath) {
            if (res.duration && res.duration < 1e3) {
              uni.showToast({ title: "录音时间过短，请至少录制1秒", icon: "none" });
              return;
            }
            this.doRecognize(res.tempFilePath);
          } else {
            uni.showToast({ title: "录音文件获取失败，请重试", icon: "none" });
          }
        });
        rm.onError((err) => {
          this.isRecording = false;
          this.clearRecordTimer();
          formatAppLog("error", "at pages/health-input/health-input.vue:198", "[Recorder] onError:", JSON.stringify(err));
          let msg = "录音失败";
          if (err.errMsg) {
            if (err.errMsg.indexOf("auth") !== -1 || err.errMsg.indexOf("permission") !== -1 || err.errMsg.indexOf("deny") !== -1) {
              msg = "没有录音权限，请在系统设置中开启";
            } else {
              msg = "录音失败: " + err.errMsg;
            }
          }
          uni.showToast({ title: msg, icon: "none", duration: 3e3 });
        });
        this.recorderManager = rm;
      },
      startRecordTimer() {
        this.recordTimer = setInterval(() => {
          this.recordDuration++;
          if (this.recordDuration >= 60) {
            this.recorderManager.stop();
          }
        }, 1e3);
      },
      clearRecordTimer() {
        if (this.recordTimer) {
          clearInterval(this.recordTimer);
          this.recordTimer = null;
        }
      },
      async toggleRecording() {
        if (this.recognizing)
          return;
        if (this.isRecording) {
          this.recorderManager.stop();
        } else {
          const hasPermission = await this.checkRecordPermission();
          if (!hasPermission)
            return;
          this.voiceResult = "";
          this.extractedTags = [];
          this.recordDuration = 0;
          this.recorderManager.start({
            format: "wav",
            sampleRate: 16e3,
            numberOfChannels: 1,
            encodeBitRate: 256e3,
            frameSize: 16e3,
            duration: 6e4
          });
        }
      },
      checkRecordPermission() {
        return new Promise((resolve) => {
          const os = uni.getSystemInfoSync().platform;
          if (os === "android") {
            const main = plus.android.runtimeMainActivity();
            main.getPackageName();
            const ContextCompat = plus.android.importClass("androidx.core.content.ContextCompat");
            plus.android.importClass("android.Manifest");
            const granted = ContextCompat.checkSelfPermission(main, "android.permission.RECORD_AUDIO");
            if (granted !== 0) {
              const ActivityCompat = plus.android.importClass("androidx.core.app.ActivityCompat");
              ActivityCompat.requestPermissions(main, ["android.permission.RECORD_AUDIO"], 1001);
              setTimeout(() => {
                const result = ContextCompat.checkSelfPermission(main, "android.permission.RECORD_AUDIO");
                if (result !== 0) {
                  uni.showModal({
                    title: "权限提示",
                    content: "语音录入需要麦克风权限，请在系统设置中允许本应用录音",
                    showCancel: false
                  });
                  resolve(false);
                } else {
                  resolve(true);
                }
              }, 2e3);
              return;
            }
            resolve(true);
          } else if (os === "ios") {
            const avAuth = plus.ios.importClass("AVCaptureDevice");
            const status = avAuth.authorizationStatusForMediaType("soun");
            if (status === 3) {
              resolve(true);
            } else if (status === 0) {
              avAuth.requestAccessForMediaType("soun", (granted) => {
                resolve(!!granted);
              });
            } else {
              uni.showModal({
                title: "权限提示",
                content: "语音录入需要麦克风权限，请在系统设置中允许本应用录音",
                showCancel: false
              });
              resolve(false);
            }
          } else {
            resolve(true);
          }
        });
      },
      async doRecognize(filePath) {
        this.recognizing = true;
        try {
          const text = await recognizeSpeech(filePath);
          this.voiceResult = text;
          if (!text) {
            uni.showToast({ title: "未识别到语音内容，请重试", icon: "none" });
            return;
          }
          try {
            const res = await extractVoiceByDify({
              voiceResult: text,
              recordDate: this.recordDate,
              recordTime: this.recordTime
            });
            const list = res && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : null;
            this.applyDifyExtracted(list);
          } catch (e) {
            this.parseVoiceResult(text);
          }
        } catch (err) {
          const msg = typeof err === "string" ? err : err.message || "语音识别出错";
          uni.showToast({ title: msg, icon: "none" });
        } finally {
          this.recognizing = false;
        }
      },
      applyDifyExtracted(list) {
        if (!list || !list.length) {
          this.parseVoiceResult(this.voiceResult);
          return;
        }
        this.extractedTags = list.map((r) => {
          let label = r.label || r.type;
          if (r.type === "bp" && r.value && typeof r.value === "object") {
            const h = r.value.high;
            const l = r.value.low;
            if (h != null && l != null && (!label || !String(label).includes("/"))) {
              label = `血压 ${h}/${l} mmHg`;
            }
          }
          return {
            type: r.type,
            value: r.value,
            label,
            icon: ICON_BY_TYPE[r.type] || "📋",
            cls: ""
          };
        });
      },
      parseVoiceResult(text) {
        const tags = [];
        const normalized = text.replace(/[，。！？、；：""''（）【】]/g, " ");
        const bpMatch = normalized.match(/(\d{2,3})\s*[\/\\]\s*(\d{2,3})/) || normalized.match(/[收高]缩?压\s*[是为]?\s*(\d{2,3})\s*[，,]?\s*[舒低]张?压\s*[是为]?\s*(\d{2,3})/) || normalized.match(/血压\s*[是为]?\s*(\d{2,3})\s*[\/\\,，\s]\s*(\d{2,3})/);
        if (bpMatch) {
          const high = parseFloat(bpMatch[1]);
          const low = parseFloat(bpMatch[2]);
          if (high > 50 && high < 250 && low > 30 && low < 150) {
            tags.push({
              type: "bp",
              icon: "💓",
              label: `血压 ${high}/${low} mmHg`,
              value: { high, low }
            });
          }
        }
        const hrMatch = normalized.match(/心[率跳]\s*[是为]?\s*[每每]?\s*[分]?\s*[钟]?\s*(\d{2,3})/);
        if (hrMatch) {
          const v = parseFloat(hrMatch[1]);
          if (v > 30 && v < 220) {
            tags.push({ type: "heartRate", icon: "❤", label: `心率 ${v} 次/分`, value: v });
          }
        }
        const tempMatch = normalized.match(/体温\s*[是为]?\s*([\d]+\.?\d*)/) || normalized.match(/([\d]+\.?\d*)\s*[度℃]/);
        if (tempMatch) {
          const v = parseFloat(tempMatch[1]);
          if (v > 34 && v < 43) {
            tags.push({ type: "temperature", icon: "🌡", label: `体温 ${v} °C`, value: v });
          }
        }
        const bgMatch = normalized.match(/血糖\s*[是为]?\s*([\d]+\.?\d*)/);
        if (bgMatch) {
          const v = parseFloat(bgMatch[1]);
          if (v > 1 && v < 35) {
            tags.push({ type: "bloodSugar", icon: "💧", label: `血糖 ${v} mmol/L`, value: v });
          }
        }
        const sleepMatch = normalized.match(/睡[了眠觉]\s*[了]?\s*([\d]+\.?\d*)\s*[个]?\s*[半]?\s*小时/);
        if (sleepMatch) {
          let v = parseFloat(sleepMatch[1]);
          if (normalized.includes("半小时") || normalized.includes("半个小时")) {
            v += 0.5;
          }
          if (v > 0 && v < 24) {
            tags.push({ type: "sleep", icon: "🌙", label: `睡眠 ${v} 小时`, value: v });
          }
        }
        const weightMatch = normalized.match(/体重\s*[是为]?\s*([\d]+\.?\d*)/) || normalized.match(/([\d]+\.?\d*)\s*[公千]斤/) || normalized.match(/([\d]+\.?\d*)\s*[kK][gG]/);
        if (weightMatch && !tags.some((t) => t.type === "weight")) {
          const v = parseFloat(weightMatch[1]);
          if (v > 20 && v < 300) {
            tags.push({ type: "weight", icon: "⚖", label: `体重 ${v} kg`, value: v });
          }
        }
        const heightMatch = normalized.match(/身高\s*[是为]?\s*([\d]+\.?\d*)/) || normalized.match(/([\d]+\.?\d*)\s*[cC][mM]/);
        if (heightMatch && !tags.some((t) => t.type === "height")) {
          const v = parseFloat(heightMatch[1]);
          if (v > 50 && v < 250) {
            tags.push({ type: "height", icon: "📏", label: `身高 ${v} cm`, value: v });
          }
        }
        const breathMatch = normalized.match(/呼吸\s*[频率]*\s*[是为]?\s*(\d{1,2})/);
        if (breathMatch) {
          const v = parseFloat(breathMatch[1]);
          if (v > 5 && v < 60) {
            tags.push({ type: "breath", icon: "🫁", label: `呼吸 ${v} 次/分`, value: v });
          }
        }
        this.extractedTags = tags;
        if (tags.length === 0 && this.voiceResult) {
          uni.showToast({ title: "未能从语音中提取到健康指标，请尝试说得更清楚", icon: "none", duration: 3e3 });
        }
      },
      async onSubmit() {
        const items = [];
        if (this.formData.bp.high && this.formData.bp.low) {
          items.push({
            metricType: "bp",
            bpHigh: parseFloat(this.formData.bp.high),
            bpLow: parseFloat(this.formData.bp.low)
          });
        } else if (this.formData.bp.high || this.formData.bp.low) {
          uni.showToast({ title: "请完整填写收缩压和舒张压", icon: "none" });
          return;
        }
        const singleKeys = ["heartRate", "temperature", "bloodSugar", "sleep", "breath", "weight", "height"];
        for (const key of singleKeys) {
          const val = this.formData[key];
          if (val !== "" && val !== null && val !== void 0 && String(val).trim() !== "") {
            items.push({ metricType: key, value: parseFloat(val) });
          }
        }
        if (items.length === 0) {
          uni.showToast({ title: "请至少填写一项健康指标", icon: "none" });
          return;
        }
        try {
          await submitBatchInput({
            recordDate: this.recordDate,
            recordTime: this.recordTime || void 0,
            notes: this.notes || void 0,
            items
          });
          uni.showToast({ title: "数据提交成功", icon: "success" });
          this.resetForm();
          setTimeout(() => {
            uni.switchTab({ url: "/pages/home/home" });
          }, 800);
        } catch (e) {
        }
      },
      resetForm() {
        this.formData = {
          bp: { high: "", low: "" },
          heartRate: "",
          temperature: "",
          bloodSugar: "",
          sleep: "",
          breath: "",
          weight: "",
          height: ""
        };
        this.notes = "";
      },
      async onVoiceSubmit() {
        if (!this.voiceResult)
          return;
        if (!this.extractedTags || this.extractedTags.length === 0) {
          uni.showToast({ title: "请先进行语音识别并确认提取结果", icon: "none" });
          return;
        }
        const extractedData = this.extractedTags.map((t) => ({
          type: t.type,
          value: t.value,
          label: t.label
        }));
        const d = /* @__PURE__ */ new Date();
        const recordDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const recordTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        try {
          await submitVoiceInput({
            voiceResult: this.voiceResult,
            extractedData,
            recordDate,
            recordTime
          });
          uni.showToast({ title: "数据提交成功", icon: "success" });
          this.voiceResult = "";
          this.extractedTags = [];
          this.recordDuration = 0;
          setTimeout(() => {
            uni.switchTab({ url: "/pages/home/home" });
          }, 800);
        } catch (e) {
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    const _component_TabSwitch = vue.resolveComponent("TabSwitch");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, { title: "数据录入" }),
      vue.createVNode(_component_TabSwitch, {
        tabs: ["手动录入", "语音录入"],
        modelValue: $data.tabIndex,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.tabIndex = $event)
      }, null, 8, ["modelValue"]),
      vue.withDirectives(vue.createElementVNode(
        "view",
        { class: "manual-panel" },
        [
          vue.createElementVNode("text", { class: "sec-label" }, "填写健康指标（可填写部分或全部）"),
          vue.createElementVNode("view", { class: "form-area" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.metricConfig, (m) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: m.key,
                  class: "metric-input-row"
                }, [
                  vue.createElementVNode("view", { class: "metric-label" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "metric-icon" },
                      vue.toDisplayString(m.icon),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "metric-name" },
                      vue.toDisplayString(m.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "metric-unit" },
                      "(" + vue.toDisplayString(m.unit) + ")",
                      1
                      /* TEXT */
                    )
                  ]),
                  m.dual ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "dual-input"
                  }, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "number",
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.bp.high = $event),
                      placeholder: m.ph1,
                      class: "input-field"
                    }, null, 8, ["placeholder"]), [
                      [vue.vModelText, $data.formData.bp.high]
                    ]),
                    vue.createElementVNode("text", { class: "separator" }, "/"),
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "number",
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.formData.bp.low = $event),
                      placeholder: m.ph2,
                      class: "input-field"
                    }, null, 8, ["placeholder"]), [
                      [vue.vModelText, $data.formData.bp.low]
                    ])
                  ])) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                    key: 1,
                    type: "digit",
                    "onUpdate:modelValue": ($event) => $data.formData[m.key] = $event,
                    placeholder: "请输入" + m.name,
                    class: "input-field"
                  }, null, 8, ["onUpdate:modelValue", "placeholder"])), [
                    [vue.vModelText, $data.formData[m.key]]
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "测量时间"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.recordDate,
                onChange: _cache[3] || (_cache[3] = ($event) => $data.recordDate = $event.detail.value)
              }, [
                vue.createElementVNode("view", { class: "picker-field" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.recordDate),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value"]),
              vue.createElementVNode("picker", {
                mode: "time",
                value: $data.recordTime,
                onChange: _cache[4] || (_cache[4] = ($event) => $data.recordTime = $event.detail.value),
                style: { "margin-top": "16rpx" }
              }, [
                vue.createElementVNode("view", { class: "picker-field" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.recordTime),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "备注"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.notes = $event),
                  placeholder: "可记录测量状态，如：饭后、运动后等",
                  "placeholder-class": "ph",
                  class: "notes-area"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.notes]
              ])
            ]),
            vue.createElementVNode("view", {
              class: "btn-submit",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.onSubmit && $options.onSubmit(...args))
            }, [
              vue.createElementVNode("text", null, "✓ 确认提交")
            ])
          ])
        ],
        512
        /* NEED_PATCH */
      ), [
        [vue.vShow, $data.tabIndex === 0]
      ]),
      vue.withDirectives(vue.createElementVNode(
        "view",
        { class: "voice-panel" },
        [
          vue.createElementVNode("view", { class: "voice-center" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["mic-btn", { recording: $data.isRecording }]),
                onClick: _cache[7] || (_cache[7] = (...args) => $options.toggleRecording && $options.toggleRecording(...args))
              },
              [
                vue.createElementVNode("text", { class: "mic-icon" }, "🎤")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "text",
              { class: "voice-hint" },
              vue.toDisplayString($options.voiceHint),
              1
              /* TEXT */
            ),
            $data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "wave-bars"
            }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(7, (i) => {
                  return vue.createElementVNode(
                    "view",
                    {
                      key: i,
                      class: "wave-bar",
                      style: vue.normalizeStyle({ animationDelay: i * 0.1 + "s" })
                    },
                    null,
                    4
                    /* STYLE */
                  );
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true),
            $data.recordDuration > 0 && !$data.isRecording ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 1,
                class: "duration-text"
              },
              "录音时长：" + vue.toDisplayString($data.recordDuration) + "s",
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "voice-result-card" }, [
            vue.createElementVNode("text", { class: "vr-label" }, "🔊 识别结果"),
            $data.recognizing ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "vr-text"
            }, "正在识别，请稍候...")) : $data.voiceResult ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 1,
                class: "vr-text"
              },
              '"' + vue.toDisplayString($data.voiceResult) + '"',
              1
              /* TEXT */
            )) : (vue.openBlock(), vue.createElementBlock("text", {
              key: 2,
              class: "vr-empty"
            }, "暂无识别结果，请点击上方按钮开始语音记录"))
          ]),
          vue.createElementVNode("view", { class: "extract-section" }, [
            vue.createElementVNode("text", { class: "sec-label" }, "AI 自动提取指标"),
            $data.extractedTags.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "tag-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.extractedTags, (t, i) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: i,
                      class: vue.normalizeClass(["ext-tag", t.cls || ""])
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(t.icon) + " " + vue.toDisplayString(t.label),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "extract-empty"
            }, [
              vue.createElementVNode("text", { class: "extract-empty-text" }, "暂无提取结果")
            ])),
            $data.extractedTags.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "warn-card"
            }, [
              vue.createElementVNode("text", { class: "warn-icon" }, "ℹ"),
              vue.createElementVNode("text", { class: "warn-text" }, "请确认AI提取的数据是否准确，确认后点击提交")
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["btn-submit voice-submit", { disabled: !$data.voiceResult || $data.extractedTags.length === 0 }]),
              onClick: _cache[8] || (_cache[8] = (...args) => $options.onVoiceSubmit && $options.onVoiceSubmit(...args))
            },
            [
              vue.createElementVNode("text", null, "✓ 确认并提交")
            ],
            2
            /* CLASS */
          )
        ],
        512
        /* NEED_PATCH */
      ), [
        [vue.vShow, $data.tabIndex === 1]
      ])
    ]);
  }
  const PagesHealthInputHealthInput = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-5e69f1fd"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/health-input/health-input.vue"]]);
  const _sfc_main$d = {
    components: { CustomNavbar, TabSwitch },
    data() {
      return {
        tabIndex: 0,
        totalScore: null,
        warningText: "",
        dietAdvice: [],
        exerciseAdvice: [],
        lifeAdvice: [],
        medicalAdvice: []
      };
    },
    onShow() {
      this.loadAdvice();
    },
    methods: {
      async loadAdvice() {
        try {
          const res = await getHealthAdvice();
          const data = res == null ? void 0 : res.data;
          if (!data)
            return;
          if (data.totalScore != null) {
            this.totalScore = typeof data.totalScore === "number" ? Math.round(data.totalScore) : data.totalScore;
          }
          const list = data.suggestions;
          if (list && Array.isArray(list) && list.length) {
            const colorMap = { diet: "#FEF9C3", exercise: "#ECFDF5", lifestyle: "#EFF6FF", medical: "#FEF2F2" };
            const iconMap = { diet: "🥗", exercise: "🏃", lifestyle: "📝", medical: "🏥" };
            this.dietAdvice = [];
            this.exerciseAdvice = [];
            this.lifeAdvice = [];
            this.medicalAdvice = [];
            for (const s of list) {
              const item = {
                icon: iconMap[s.category] || "💡",
                color: colorMap[s.category] || "#F5F7FA",
                title: s.title || "",
                desc: s.content || "",
                tags: []
              };
              if (s.category === "diet")
                this.dietAdvice.push(item);
              else if (s.category === "exercise")
                this.exerciseAdvice.push(item);
              else if (s.category === "lifestyle")
                this.lifeAdvice.push(item);
              else if (s.category === "medical")
                this.medicalAdvice.push(item);
            }
          }
        } catch (e) {
        }
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    const _component_TabSwitch = vue.resolveComponent("TabSwitch");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, { title: "健康建议" }),
      vue.createElementVNode("view", { class: "header-area" }, [
        $data.totalScore != null ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "score-badge"
          },
          "健康评分 " + vue.toDisplayString($data.totalScore),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("text", { class: "header-icon" }, "💡"),
        vue.createElementVNode("text", { class: "header-desc" }, "基于您的健康数据，为您提供个性化建议")
      ]),
      vue.createVNode(_component_TabSwitch, {
        tabs: ["饮食", "运动", "生活", "就医"],
        modelValue: $data.tabIndex,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.tabIndex = $event)
      }, null, 8, ["modelValue"]),
      vue.createElementVNode("view", { class: "content" }, [
        $data.warningText ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "warning-card"
        }, [
          vue.createElementVNode("text", { class: "warning-title" }, "⚠ 异常指标提醒"),
          vue.createElementVNode(
            "text",
            { class: "warning-text" },
            vue.toDisplayString($data.warningText),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "advice-list" },
          [
            !$data.dietAdvice.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-hint"
            }, "暂无饮食建议，请先录入健康数据")) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.dietAdvice, (item, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i,
                  class: "advice-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "advice-icon",
                      style: vue.normalizeStyle({ background: item.color })
                    },
                    vue.toDisplayString(item.icon),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createElementVNode("view", { class: "advice-body" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "advice-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "advice-desc" },
                      vue.toDisplayString(item.desc),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "advice-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item.tags, (t, j) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: j,
                              class: "tag"
                            },
                            vue.toDisplayString(t),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.tabIndex === 0]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "advice-list" },
          [
            !$data.exerciseAdvice.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-hint"
            }, "暂无运动建议，请先录入健康数据")) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.exerciseAdvice, (item, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i,
                  class: "advice-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "advice-icon",
                      style: vue.normalizeStyle({ background: item.color })
                    },
                    vue.toDisplayString(item.icon),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createElementVNode("view", { class: "advice-body" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "advice-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "advice-desc" },
                      vue.toDisplayString(item.desc),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "advice-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item.tags, (t, j) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: j,
                              class: "tag"
                            },
                            vue.toDisplayString(t),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.tabIndex === 1]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "advice-list" },
          [
            !$data.lifeAdvice.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-hint"
            }, "暂无生活建议，请先录入健康数据")) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.lifeAdvice, (item, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i,
                  class: "advice-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "advice-icon",
                      style: vue.normalizeStyle({ background: item.color })
                    },
                    vue.toDisplayString(item.icon),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createElementVNode("view", { class: "advice-body" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "advice-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "advice-desc" },
                      vue.toDisplayString(item.desc),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "advice-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item.tags, (t, j) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: j,
                              class: "tag"
                            },
                            vue.toDisplayString(t),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.tabIndex === 2]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "advice-list" },
          [
            !$data.medicalAdvice.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-hint"
            }, "暂无就医建议，请先录入健康数据")) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.medicalAdvice, (item, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i,
                  class: "advice-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "advice-icon",
                      style: vue.normalizeStyle({ background: item.color })
                    },
                    vue.toDisplayString(item.icon),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createElementVNode("view", { class: "advice-body" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "advice-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "advice-desc" },
                      vue.toDisplayString(item.desc),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "advice-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item.tags, (t, j) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: j,
                              class: "tag"
                            },
                            vue.toDisplayString(t),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.tabIndex === 3]
        ])
      ])
    ]);
  }
  const PagesHealthAdviceHealthAdvice = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-f71751e5"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/health-advice/health-advice.vue"]]);
  const _sfc_main$c = {
    name: "AiHistory",
    components: { CustomNavbar },
    data() {
      return {
        navbarBg: "#e2eef0",
        searchKeyword: "",
        filterActive: 0,
        filterTags: [
          { label: "全部", value: "" },
          { label: "智能问答", value: "chat" },
          { label: "AI问诊", value: "inquiry" }
        ],
        historyList: []
      };
    },
    methods: {
      goDetail(item) {
        uni.navigateTo({
          url: "/pages/ai-history-detail/ai-history-detail?id=" + (item.id || "") + "&title=" + encodeURIComponent(item.title || "") + "&mode=" + (item.mode || "chat")
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "咨询历史",
        "show-back": true,
        "bg-color": $data.navbarBg
      }, null, 8, ["bg-color"]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "search-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKeyword = $event),
              placeholder: "搜索咨询记录",
              "placeholder-class": "placeholder"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKeyword]
          ])
        ]),
        vue.createElementVNode("view", { class: "filter-tags" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.filterTags, (tag, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: vue.normalizeClass(["tag", { active: $data.filterActive === i }]),
                onClick: ($event) => $data.filterActive = i
              }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(tag.label),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "history-list" }, [
          !$data.historyList.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📭"),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无咨询记录")
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.historyList, (item, idx) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: idx,
                class: "history-card",
                onClick: ($event) => $options.goDetail(item)
              }, [
                vue.createElementVNode("view", { class: "card-icon" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.mode === "chat" ? "💬" : "📋"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "card-main" }, [
                  vue.createElementVNode("view", { class: "card-title-row" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "card-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["card-badge", item.mode])
                      },
                      vue.toDisplayString(item.modeText),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "card-summary" },
                    vue.toDisplayString(item.summary),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "card-meta" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.time),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.count) + "条消息",
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesAiHistoryAiHistory = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-ecdf042d"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/ai-history/ai-history.vue"]]);
  const _sfc_main$b = {
    name: "AiHistoryDetail",
    components: { CustomNavbar },
    data() {
      return {
        navbarBg: "#e2eef0",
        pageTitle: "咨询详情",
        modeLabel: "问答模式",
        summaryList: [],
        chatTime: "",
        chatReplay: []
      };
    },
    onLoad(options) {
      if (options.title) {
        this.pageTitle = decodeURIComponent(options.title);
      }
      this.modeLabel = options.mode === "inquiry" ? "问诊模式" : "问答模式";
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: $data.pageTitle,
        "show-back": true,
        "bg-color": $data.navbarBg
      }, {
        right: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "navbar-badge" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.modeLabel),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["title", "bg-color"]),
      vue.createElementVNode("view", { class: "content" }, [
        $data.summaryList.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "summary-card"
        }, [
          vue.createElementVNode("text", { class: "summary-title" }, "AI总结"),
          vue.createElementVNode("view", { class: "summary-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.summaryList, (s, i) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    class: "summary-item",
                    key: i
                  },
                  "• " + vue.toDisplayString(s),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "replay-section" }, [
          $data.chatTime ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "time-marker"
          }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.chatTime),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.chatReplay, (msg, idx) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: idx,
                  class: vue.normalizeClass(["msg-row", msg.role === "user" ? "msg-user" : "msg-ai"])
                },
                [
                  msg.role === "ai" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "ai-avatar"
                  }, [
                    vue.createElementVNode("text", null, "🤖")
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "msg-bubble" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "msg-content" },
                      vue.toDisplayString(msg.content),
                      1
                      /* TEXT */
                    )
                  ])
                ],
                2
                /* CLASS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          !$data.chatReplay.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-replay"
          }, [
            vue.createElementVNode("text", null, "暂无对话记录")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesAiHistoryDetailAiHistoryDetail = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-3c13b7ea"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/ai-history-detail/ai-history-detail.vue"]]);
  const _sfc_main$a = {
    components: { CustomNavbar },
    data() {
      return {
        plans: [
          { icon: "🏃", title: "运动计划", desc: "制定并追踪运动计划", progress: 0, bgColor: "#E8F5E9", barColor: "#34C759", tagBg: "#E8F5E9", tagColor: "#34C759", tags: [], url: "/pages/plan-exercise/plan-exercise" },
          { icon: "🥗", title: "饮食计划", desc: "均衡营养，合理安排饮食", progress: 0, bgColor: "#FFF3E0", barColor: "#FF9500", tagBg: "#FFF3E0", tagColor: "#FF9500", tags: [], url: "/pages/plan-diet/plan-diet" },
          { icon: "💊", title: "用药计划", desc: "按时服药，定期复查", progress: 0, bgColor: "#FFEBEE", barColor: "#EF4444", tagBg: "#FFEBEE", tagColor: "#EF4444", tags: [], url: "/pages/plan-medication/plan-medication" },
          { icon: "🏥", title: "复查计划", desc: "定期体检，跟踪健康指标变化", progress: 0, bgColor: "#E3F2FD", barColor: "#4A90D9", tagBg: "#E3F2FD", tagColor: "#4A90D9", tags: [], url: "/pages/plan-checkup/plan-checkup" }
        ]
      };
    },
    onShow() {
      this.loadOverview();
    },
    methods: {
      goDetail(url) {
        uni.navigateTo({ url });
      },
      async loadOverview() {
        try {
          const planRes = await getCurrentPlan();
          if (!planRes.data)
            return;
          const [exRes, dietRes, ckRes] = await Promise.all([
            getExercisePlan(),
            getDietPlan(),
            getCheckupPlan()
          ]);
          const exList = exRes.data || [];
          if (exList.length) {
            const names = [...new Set(exList.map((e) => e.name))].slice(0, 3);
            this.plans[0].tags = names;
            this.plans[0].progress = Math.min(100, Math.round(exList.length / 10 * 100));
          }
          const meals = dietRes.data && dietRes.data.meals || [];
          if (meals.length) {
            this.plans[1].tags = ["已安排" + meals.length + "餐"];
            this.plans[1].progress = Math.min(100, Math.round(meals.length / 21 * 100));
          }
          this.plans[2].progress = 50;
          this.plans[2].tags = ["查看用药详情"];
          const ckList = ckRes.data || [];
          if (ckList.length) {
            this.plans[3].tags = ["共" + ckList.length + "项复查"];
            this.plans[3].progress = Math.round(ckList.filter((c) => c.status === "done").length / ckList.length * 100);
          }
        } catch (e) {
          formatAppLog("error", "at pages/plan-edit/plan-edit.vue:91", "加载计划概览失败", e);
        }
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "当前计划",
        showBack: true,
        bgColor: "#4A90D9",
        titleColor: "#fff"
      }),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "plan-scroll"
      }, [
        vue.createElementVNode("view", { class: "plan-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.plans, (p, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "plan-card",
                onClick: ($event) => $options.goDetail(p.url)
              }, [
                vue.createElementVNode("view", { class: "card-top" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "card-icon-wrap",
                      style: vue.normalizeStyle({ background: p.bgColor })
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        { class: "card-icon" },
                        vue.toDisplayString(p.icon),
                        1
                        /* TEXT */
                      )
                    ],
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode("view", { class: "card-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "card-title" },
                      vue.toDisplayString(p.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "card-desc" },
                      vue.toDisplayString(p.desc),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("text", { class: "card-arrow" }, "›")
                ]),
                vue.createElementVNode("view", { class: "card-progress" }, [
                  vue.createElementVNode("view", { class: "progress-bar-bg" }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: "progress-bar-fill",
                        style: vue.normalizeStyle({ width: p.progress + "%", background: p.barColor })
                      },
                      null,
                      4
                      /* STYLE */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "progress-text" },
                    vue.toDisplayString(p.progress) + "%",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "card-tags" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(p.tags, (tag, ti) => {
                      return vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: ti,
                          class: "tag-item",
                          style: vue.normalizeStyle({ background: p.tagBg, color: p.tagColor })
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(tag),
                            1
                            /* TEXT */
                          )
                        ],
                        4
                        /* STYLE */
                      );
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesPlanEditPlanEdit = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-3819ddb0"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-edit/plan-edit.vue"]]);
  function getMedProfile() {
    return request({ url: "/medication/profile" });
  }
  function updateMedProfile(data) {
    return request({ url: "/medication/profile", method: "PUT", data });
  }
  function getShortTermMeds() {
    return request({ url: "/medication/short-term" });
  }
  function submitShortTermMeds(data) {
    return request({ url: "/medication/short-term", method: "POST", data });
  }
  function getLongTermMeds() {
    return request({ url: "/medication/long-term" });
  }
  function submitLongTermMeds(data) {
    return request({ url: "/medication/long-term", method: "POST", data });
  }
  function getMedRecordDetail(id) {
    return request({ url: `/medication/record/${id}` });
  }
  function deleteMedRecord(id) {
    return request({ url: `/medication/record/${id}`, method: "DELETE" });
  }
  function emptyShort() {
    return { name: "", frequency: "", contraindication: "", dosage: "", date: "", endDate: "", onTime: "", sideEffect: "", doctor: "", remark: "" };
  }
  function emptyLong() {
    return { name: "", purpose: "", contraindication: "", frequency: "", dosage: "", date: "", endDate: "", onTime: "", sideEffect: "", doctor: "", followUpNote: "" };
  }
  const _sfc_main$9 = {
    components: { CustomNavbar },
    data() {
      return {
        tabIdx: 0,
        tabList: ["用药人档案", "短期用药记录", "慢性病长期用药"],
        genderList: ["男", "女"],
        freqOptions: [
          { label: "上午(8:00)", value: "上午(8:00)" },
          { label: "中午(11:00)", value: "中午(11:00)" },
          { label: "晚上(18:00)", value: "晚上(18:00)" },
          { label: "睡前(22:00)", value: "睡前(22:00)" }
        ],
        editMode: false,
        profile: {
          name: "",
          gender: "",
          age: "",
          drugAllergy: "",
          otherAllergy: "",
          chronicDisease: "",
          majorHistory: "",
          longTermMeds: "",
          emergencyContactName: "",
          emergencyContactPhone: ""
        },
        shortTermMeds: [emptyShort()],
        longTermMeds: [emptyLong()],
        shortTermHistory: [],
        longTermHistory: []
      };
    },
    onShow() {
      if (!isLoggedIn())
        return;
      this.loadProfile();
      this.loadShortHistory();
      this.loadLongHistory();
    },
    methods: {
      switchTab(i) {
        this.tabIdx = i;
      },
      onGenderChange(e) {
        this.profile.gender = this.genderList[e.detail.value];
      },
      isFreqSelected(item, val) {
        if (!item.frequency)
          return false;
        return item.frequency.split(",").includes(val);
      },
      toggleFreq(item, val) {
        const arr = item.frequency ? item.frequency.split(",").filter((s) => s) : [];
        const idx = arr.indexOf(val);
        if (idx >= 0) {
          arr.splice(idx, 1);
        } else {
          arr.push(val);
        }
        item.frequency = arr.join(",");
      },
      async loadProfile() {
        try {
          const res = await getMedProfile();
          if (res == null ? void 0 : res.data) {
            const d = res.data;
            this.profile = {
              name: d.name || "",
              gender: d.gender || "",
              age: d.age || "",
              drugAllergy: d.drugAllergy || "",
              otherAllergy: d.otherAllergy || "",
              chronicDisease: d.chronicDisease || "",
              majorHistory: d.majorHistory || "",
              longTermMeds: d.longTermMeds || "",
              emergencyContactName: d.emergencyContactName || "",
              emergencyContactPhone: d.emergencyContactPhone || ""
            };
          }
        } catch (e) {
        }
      },
      async saveProfile() {
        try {
          await updateMedProfile(this.profile);
          this.editMode = false;
          uni.showToast({ title: "档案已保存", icon: "success" });
        } catch (e) {
          uni.showToast({ title: "保存失败", icon: "none" });
        }
      },
      async loadShortHistory() {
        try {
          const res = await getShortTermMeds();
          if ((res == null ? void 0 : res.data) && Array.isArray(res.data)) {
            this.shortTermHistory = res.data;
          }
        } catch (e) {
        }
      },
      async loadLongHistory() {
        try {
          const res = await getLongTermMeds();
          if ((res == null ? void 0 : res.data) && Array.isArray(res.data)) {
            this.longTermHistory = res.data;
          }
        } catch (e) {
        }
      },
      addShort() {
        this.shortTermMeds.push(emptyShort());
      },
      removeShort(i) {
        uni.showModal({
          title: "确认删除",
          content: `确定删除药品 #${i + 1} 吗？`,
          success: (res) => {
            if (res.confirm)
              this.shortTermMeds.splice(i, 1);
          }
        });
      },
      async submitShort() {
        const valid = this.shortTermMeds.some((m) => m.name && m.name.trim());
        if (!valid) {
          uni.showToast({ title: "请至少填写一个药品名称", icon: "none" });
          return;
        }
        try {
          await submitShortTermMeds({ records: this.shortTermMeds });
          uni.showToast({ title: "短期记录已提交", icon: "success" });
          this.shortTermMeds = [emptyShort()];
          this.loadShortHistory();
        } catch (e) {
          uni.showToast({ title: (e == null ? void 0 : e.message) || "提交失败", icon: "none" });
        }
      },
      addLong() {
        this.longTermMeds.push(emptyLong());
      },
      removeLong(i) {
        uni.showModal({
          title: "确认删除",
          content: `确定删除药品 #${i + 1} 吗？`,
          success: (res) => {
            if (res.confirm)
              this.longTermMeds.splice(i, 1);
          }
        });
      },
      async submitLong() {
        const valid = this.longTermMeds.some((m) => m.name && m.name.trim());
        if (!valid) {
          uni.showToast({ title: "请至少填写一个药品名称", icon: "none" });
          return;
        }
        try {
          await submitLongTermMeds({ records: this.longTermMeds });
          uni.showToast({ title: "慢性病记录已提交", icon: "success" });
          this.longTermMeds = [emptyLong()];
          this.loadLongHistory();
        } catch (e) {
          uni.showToast({ title: (e == null ? void 0 : e.message) || "提交失败", icon: "none" });
        }
      },
      goDetail(id) {
        uni.navigateTo({ url: "/pages/medication-detail/medication-detail?id=" + id });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "用药管理",
        showBack: true,
        bgColor: "#4A90D9",
        titleColor: "#fff"
      }),
      vue.createElementVNode("view", { class: "tab-bar" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.tabList, (tab, i) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: i,
              class: vue.normalizeClass(["tab-item", { active: $data.tabIdx === i }]),
              onClick: ($event) => $options.switchTab(i)
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(tab),
                1
                /* TEXT */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "content-scroll"
      }, [
        $data.tabIdx === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "tab-content"
        }, [
          vue.createElementVNode("view", { class: "form-card" }, [
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "姓名"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "form-input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.profile.name = $event),
                placeholder: "请输入姓名",
                disabled: !$data.editMode
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "性别"),
              vue.createElementVNode("picker", {
                range: $data.genderList,
                onChange: _cache[1] || (_cache[1] = (...args) => $options.onGenderChange && $options.onGenderChange(...args)),
                disabled: !$data.editMode
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "form-input picker-val" },
                  vue.toDisplayString($data.profile.gender || "请选择"),
                  1
                  /* TEXT */
                )
              ], 40, ["range", "disabled"])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "年龄"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "form-input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.profile.age = $event),
                placeholder: "请输入年龄",
                type: "number",
                disabled: !$data.editMode
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.age]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "药物过敏史"),
              vue.withDirectives(vue.createElementVNode("textarea", {
                class: "form-textarea",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.profile.drugAllergy = $event),
                placeholder: "无/具体药物名称",
                disabled: !$data.editMode,
                "auto-height": true
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.drugAllergy]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "食物/其他过敏史"),
              vue.withDirectives(vue.createElementVNode("textarea", {
                class: "form-textarea",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.profile.otherAllergy = $event),
                placeholder: "无/具体过敏源",
                disabled: !$data.editMode,
                "auto-height": true
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.otherAllergy]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "基础慢性病记录"),
              vue.withDirectives(vue.createElementVNode("textarea", {
                class: "form-textarea",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.profile.chronicDisease = $event),
                placeholder: "例：高血压、糖尿病",
                disabled: !$data.editMode,
                "auto-height": true
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.chronicDisease]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "既往重大病史/手术史"),
              vue.withDirectives(vue.createElementVNode("textarea", {
                class: "form-textarea",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.profile.majorHistory = $event),
                placeholder: "无/具体病史或手术",
                disabled: !$data.editMode,
                "auto-height": true
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.majorHistory]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "长期固定服用药品"),
              vue.withDirectives(vue.createElementVNode("textarea", {
                class: "form-textarea",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.profile.longTermMeds = $event),
                placeholder: "药品名称、剂量",
                disabled: !$data.editMode,
                "auto-height": true
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.longTermMeds]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "紧急联系人姓名"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "form-input",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.profile.emergencyContactName = $event),
                placeholder: "请输入联系人姓名",
                disabled: !$data.editMode
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.emergencyContactName]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "紧急联系人电话"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "form-input",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.profile.emergencyContactPhone = $event),
                placeholder: "请输入手机号码",
                type: "number",
                disabled: !$data.editMode
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.emergencyContactPhone]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "btn-group" }, [
            !$data.editMode ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "btn-primary",
              onClick: _cache[10] || (_cache[10] = ($event) => $data.editMode = true)
            }, [
              vue.createElementVNode("text", null, "✏️ 编辑档案")
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "btn-primary",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.saveProfile && $options.saveProfile(...args))
            }, [
              vue.createElementVNode("text", null, "💾 保存档案")
            ]))
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.tabIdx === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "tab-content"
        }, [
          $data.shortTermHistory.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "history-section"
          }, [
            vue.createElementVNode("text", { class: "history-title" }, "已有记录"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.shortTermHistory, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: "sh" + idx,
                  class: "history-card",
                  onClick: ($event) => $options.goDetail(item.id)
                }, [
                  vue.createElementVNode("view", { class: "hc-top" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "hc-name" },
                      "💊 " + vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "hc-date" },
                      vue.toDisplayString(item.recordDate) + vue.toDisplayString(item.recordEndDate ? " ~ " + item.recordEndDate : ""),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "hc-info" }, [
                    item.dosage ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "hc-tag"
                      },
                      vue.toDisplayString(item.dosage),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    item.frequency ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 1,
                        class: "hc-tag"
                      },
                      vue.toDisplayString(item.frequency),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    item.onTime ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 2,
                        class: vue.normalizeClass(["hc-tag", item.onTime === "是" ? "tag-green" : "tag-orange"])
                      },
                      vue.toDisplayString(item.onTime === "是" ? "按时服用" : item.onTime),
                      3
                      /* TEXT, CLASS */
                    )) : vue.createCommentVNode("v-if", true)
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("text", { class: "section-label" }, "添加新记录"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.shortTermMeds, (item, idx) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: "s" + idx,
                class: "med-card"
              }, [
                vue.createElementVNode("view", { class: "med-card-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "med-no" },
                    "药品 #" + vue.toDisplayString(idx + 1),
                    1
                    /* TEXT */
                  ),
                  $data.shortTermMeds.length > 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "med-del",
                    onClick: ($event) => $options.removeShort(idx)
                  }, "✕ 删除", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "药品名称"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.name = $event,
                    placeholder: "请输入药品名称"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.name]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row field-row-wrap" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "医嘱频次"),
                  vue.createElementVNode("view", { class: "freq-tags" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.freqOptions, (opt) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: opt.value,
                          class: vue.normalizeClass(["freq-tag", { "freq-active": $options.isFreqSelected(item, opt.value) }]),
                          onClick: ($event) => $options.toggleFreq(item, opt.value)
                        }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(opt.label),
                            1
                            /* TEXT */
                          )
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "用药禁忌"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.contraindication = $event,
                    placeholder: "无/具体禁忌"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.contraindication]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "单次剂量"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.dosage = $event,
                    placeholder: "如：1片/5ml"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.dosage]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "用药起始日期"),
                  vue.createElementVNode("picker", {
                    mode: "date",
                    onChange: (e) => item.date = e.detail.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.date || "选择起始日期"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["onChange"])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "用药结束日期"),
                  vue.createElementVNode("picker", {
                    mode: "date",
                    start: item.date || "",
                    onChange: (e) => item.endDate = e.detail.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.endDate || "选择结束日期"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["start", "onChange"])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "是否按时服用"),
                  vue.createElementVNode("picker", {
                    range: ["是", "否", "未记录"],
                    onChange: (e) => item.onTime = ["是", "否", "未记录"][e.detail.value]
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.onTime || "请选择"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["onChange"])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "不良反应"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.sideEffect = $event,
                    placeholder: "无/具体不良反应"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.sideEffect]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "开具医师"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.doctor = $event,
                    placeholder: "医师姓名"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.doctor]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "备注"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.remark = $event,
                    placeholder: "其他说明"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.remark]
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createElementVNode("view", {
            class: "add-row",
            onClick: _cache[12] || (_cache[12] = (...args) => $options.addShort && $options.addShort(...args))
          }, [
            vue.createElementVNode("text", null, "+ 添加药品")
          ]),
          vue.createElementVNode("view", { class: "btn-group" }, [
            vue.createElementVNode("view", {
              class: "btn-primary",
              onClick: _cache[13] || (_cache[13] = (...args) => $options.submitShort && $options.submitShort(...args))
            }, [
              vue.createElementVNode("text", null, "📤 提交短期用药记录")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.tabIdx === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "tab-content"
        }, [
          $data.longTermHistory.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "history-section"
          }, [
            vue.createElementVNode("text", { class: "history-title" }, "已有记录"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.longTermHistory, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: "lh" + idx,
                  class: "history-card",
                  onClick: ($event) => $options.goDetail(item.id)
                }, [
                  vue.createElementVNode("view", { class: "hc-top" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "hc-name" },
                      "💊 " + vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "hc-date" },
                      vue.toDisplayString(item.recordDate) + vue.toDisplayString(item.recordEndDate ? " ~ " + item.recordEndDate : ""),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "hc-info" }, [
                    item.purpose ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "hc-tag tag-blue"
                      },
                      vue.toDisplayString(item.purpose),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    item.dosage ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 1,
                        class: "hc-tag"
                      },
                      vue.toDisplayString(item.dosage),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    item.frequency ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 2,
                        class: "hc-tag"
                      },
                      vue.toDisplayString(item.frequency),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("text", { class: "section-label" }, "添加新记录"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.longTermMeds, (item, idx) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: "l" + idx,
                class: "med-card"
              }, [
                vue.createElementVNode("view", { class: "med-card-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "med-no" },
                    "药品 #" + vue.toDisplayString(idx + 1),
                    1
                    /* TEXT */
                  ),
                  $data.longTermMeds.length > 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "med-del",
                    onClick: ($event) => $options.removeLong(idx)
                  }, "✕ 删除", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "药品名称"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.name = $event,
                    placeholder: "请输入药品名称"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.name]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "治疗病症/用途"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.purpose = $event,
                    placeholder: "如：高血压"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.purpose]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "用药禁忌"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.contraindication = $event,
                    placeholder: "无/具体禁忌"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.contraindication]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row field-row-wrap" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "医嘱频次"),
                  vue.createElementVNode("view", { class: "freq-tags" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.freqOptions, (opt) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: opt.value,
                          class: vue.normalizeClass(["freq-tag", { "freq-active": $options.isFreqSelected(item, opt.value) }]),
                          onClick: ($event) => $options.toggleFreq(item, opt.value)
                        }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(opt.label),
                            1
                            /* TEXT */
                          )
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "单次剂量"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.dosage = $event,
                    placeholder: "如：1片"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.dosage]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "用药起始日期"),
                  vue.createElementVNode("picker", {
                    mode: "date",
                    onChange: (e) => item.date = e.detail.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.date || "选择起始日期"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["onChange"])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "用药结束日期"),
                  vue.createElementVNode("picker", {
                    mode: "date",
                    start: item.date || "",
                    onChange: (e) => item.endDate = e.detail.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.endDate || "选择结束日期"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["start", "onChange"])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "是否按时服用"),
                  vue.createElementVNode("picker", {
                    range: ["是", "否", "未记录"],
                    onChange: (e) => item.onTime = ["是", "否", "未记录"][e.detail.value]
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.onTime || "请选择"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["onChange"])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "不良反应"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.sideEffect = $event,
                    placeholder: "无/具体不良反应"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.sideEffect]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "开具医师"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.doctor = $event,
                    placeholder: "医师姓名"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.doctor]
                  ])
                ]),
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "复诊/调整备注"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.followUpNote = $event,
                    placeholder: "复诊计划或剂量调整说明"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.followUpNote]
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createElementVNode("view", {
            class: "add-row",
            onClick: _cache[14] || (_cache[14] = (...args) => $options.addLong && $options.addLong(...args))
          }, [
            vue.createElementVNode("text", null, "+ 添加药品")
          ]),
          vue.createElementVNode("view", { class: "btn-group" }, [
            vue.createElementVNode("view", {
              class: "btn-primary",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.submitLong && $options.submitLong(...args))
            }, [
              vue.createElementVNode("text", null, "📤 提交慢性病用药记录")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesMedicationMedication = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-48d5af11"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/medication/medication.vue"]]);
  const _sfc_main$8 = {
    components: { CustomNavbar },
    data() {
      return {
        recordId: null,
        drugName: "",
        medTypeText: "",
        infoRows: []
      };
    },
    onLoad(options) {
      if (options && options.id) {
        this.recordId = options.id;
        this.loadDetail();
      }
    },
    methods: {
      async loadDetail() {
        try {
          const res = await getMedRecordDetail(this.recordId);
          if (res == null ? void 0 : res.data) {
            const d = res.data;
            this.drugName = d.name || "未知药品";
            this.medTypeText = d.medType === "long_term" ? "慢性病长期用药" : "短期用药";
            const rows = [];
            if (d.purpose)
              rows.push({ label: "治疗病症/用途", value: d.purpose });
            if (d.dosage)
              rows.push({ label: "单次剂量", value: d.dosage });
            if (d.frequency)
              rows.push({ label: "医嘱频次", value: d.frequency });
            if (d.contraindication)
              rows.push({ label: "用药禁忌", value: d.contraindication, cls: "warn" });
            if (d.recordDate)
              rows.push({ label: "用药日期", value: d.recordDate });
            if (d.onTime)
              rows.push({ label: "是否按时服用", value: d.onTime, cls: d.onTime === "是" ? "good" : "warn" });
            if (d.sideEffect)
              rows.push({ label: "不良反应", value: d.sideEffect, cls: "warn" });
            if (d.doctor)
              rows.push({ label: "开具医师", value: d.doctor });
            if (d.remark)
              rows.push({ label: "备注", value: d.remark });
            if (d.followUpNote)
              rows.push({ label: "复诊/调整备注", value: d.followUpNote });
            this.infoRows = rows;
          }
        } catch (e) {
          uni.showToast({ title: "加载失败", icon: "none" });
        }
      },
      onDelete() {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除「${this.drugName}」的用药记录吗？`,
          success: async (res) => {
            if (!res.confirm)
              return;
            try {
              await deleteMedRecord(this.recordId);
              uni.showToast({ title: "已删除", icon: "success" });
              setTimeout(() => uni.navigateBack(), 800);
            } catch (e) {
              uni.showToast({ title: "删除失败", icon: "none" });
            }
          }
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: $data.drugName || "用药详情",
        "show-back": true,
        bgColor: "#4A90D9",
        titleColor: "#fff"
      }, null, 8, ["title"]),
      vue.createElementVNode("view", { class: "drug-header" }, [
        vue.createElementVNode("text", { class: "drug-icon" }, "💊"),
        vue.createElementVNode(
          "text",
          { class: "drug-name" },
          vue.toDisplayString($data.drugName),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          { class: "drug-type" },
          vue.toDisplayString($data.medTypeText),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "info-card" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.infoRows, (row, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "info-row"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "info-label" },
                  vue.toDisplayString(row.label),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["info-value", row.cls || ""])
                  },
                  vue.toDisplayString(row.value),
                  3
                  /* TEXT, CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          !$data.infoRows.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-hint"
          }, [
            vue.createElementVNode("text", null, "暂无药品信息")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          class: "stop-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.onDelete && $options.onDelete(...args))
        }, [
          vue.createElementVNode("text", null, "删除该记录")
        ])
      ])
    ]);
  }
  const PagesMedicationDetailMedicationDetail = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-2eec67f9"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/medication-detail/medication-detail.vue"]]);
  const _sfc_main$7 = {
    components: { CustomNavbar },
    data() {
      const today = /* @__PURE__ */ new Date();
      const y = today.getFullYear();
      const m = today.getMonth();
      const d = today.getDate();
      const todayStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const days = [];
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        days.push({
          date: dateStr,
          day: i,
          isToday: i === d,
          hasTask: false
        });
      }
      return {
        selectedDay: todayStr,
        calendarDays: days,
        currentMonth: `${y}年${m + 1}月`,
        stats: { completionRate: "--", streak: 0, totalTasks: 0 },
        selectedDayTasks: []
      };
    },
    onShow() {
      this.loadHistory();
    },
    methods: {
      async loadHistory() {
        try {
          const res = await getTaskHistory({ date: this.selectedDay });
          const data = res.data || {};
          this.stats = {
            completionRate: data.completionRate || "--",
            streak: data.streak || 0,
            totalTasks: data.totalTasks || 0
          };
          const taskDates = data.taskDates || [];
          this.calendarDays.forEach((d) => {
            d.hasTask = taskDates.includes(d.date);
          });
          this.selectedDayTasks = (data.tasks || []).map((t) => ({
            title: t.title,
            time: t.taskTime || "",
            status: t.status
          }));
        } catch (e) {
          formatAppLog("error", "at pages/task-history/task-history.vue:105", "加载历史任务失败", e);
        }
      },
      selectDay(d) {
        this.selectedDay = d.date;
        this.loadHistory();
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page page-task-history" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "历史任务",
        "show-back": true
      }),
      vue.createElementVNode("view", { class: "page-body" }, [
        vue.createElementVNode("view", { class: "calendar-wrap" }, [
          vue.createElementVNode(
            "text",
            { class: "cal-month" },
            vue.toDisplayString($data.currentMonth),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "cal-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.calendarDays, (d, idx) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: idx,
                  class: "cal-day-wrap",
                  onClick: ($event) => $options.selectDay(d)
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["cal-day", { today: d.isToday, selected: d.date === $data.selectedDay }])
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        { class: "day-num" },
                        vue.toDisplayString(d.day),
                        1
                        /* TEXT */
                      ),
                      d.hasTask ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "day-dot"
                      })) : vue.createCommentVNode("v-if", true)
                    ],
                    2
                    /* CLASS */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "stats-row" }, [
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($data.stats.completionRate),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "完成率")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($data.stats.streak),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "连续打卡")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($data.stats.totalTasks),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "总任务")
          ])
        ]),
        vue.createElementVNode("view", { class: "day-tasks" }, [
          vue.createElementVNode("text", { class: "day-tasks-title" }, "选中日期任务"),
          !$data.selectedDayTasks.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-hint"
          }, [
            vue.createElementVNode("text", { class: "empty-txt" }, "该日期暂无任务记录")
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.selectedDayTasks, (t, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "task-item",
                key: i
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["task-status-dot", t.status])
                  },
                  null,
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "task-item-title" },
                  vue.toDisplayString(t.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "task-item-time" },
                  vue.toDisplayString(t.time),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesTaskHistoryTaskHistory = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-6ca84a2e"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/task-history/task-history.vue"]]);
  const _sfc_main$6 = {
    components: { CustomNavbar },
    data() {
      return {
        avatarUrl: "",
        saving: false,
        form: {
          account: "",
          email: "",
          nickname: "",
          gender: "保密",
          birthday: "",
          region: "",
          signature: ""
        }
      };
    },
    onLoad() {
      this.loadProfile();
    },
    methods: {
      async loadProfile() {
        try {
          const res = await getUserProfile();
          const d = res.data || {};
          this.form.account = d.account || "";
          this.form.email = d.email || "";
          this.form.nickname = d.nickname || "";
          const genderMap = { 0: "保密", 1: "男", 2: "女" };
          this.form.gender = genderMap[d.gender] || "保密";
          this.form.birthday = d.birthday || "";
          this.form.region = d.region || "";
          this.form.signature = d.signature || "";
          if (d.avatar) {
            this.avatarUrl = getAvatarUrl(d.avatar);
          }
        } catch (e) {
        }
      },
      chooseAvatar() {
        uni.chooseImage({
          count: 1,
          success: async (res) => {
            const tempPath = res.tempFilePaths[0];
            try {
              uni.showLoading({ title: "上传中...", mask: true });
              const uploadRes = await uploadAvatar(tempPath);
              uni.hideLoading();
              if (uploadRes.data && uploadRes.data.avatar) {
                this.avatarUrl = getAvatarUrl(uploadRes.data.avatar);
              } else {
                this.avatarUrl = tempPath;
              }
              uni.showToast({ title: "头像上传成功", icon: "success" });
            } catch (e) {
              uni.hideLoading();
              uni.showToast({ title: "上传失败", icon: "none" });
            }
          }
        });
      },
      onBirthChange(e) {
        this.form.birthday = e.detail.value;
      },
      async onSave() {
        if (this.saving)
          return;
        if (!this.form.nickname) {
          uni.showToast({ title: "请输入昵称", icon: "none" });
          return;
        }
        this.saving = true;
        const genderMap = { "男": 1, "女": 2, "保密": 0 };
        try {
          await updateUserProfile({
            nickname: this.form.nickname,
            gender: genderMap[this.form.gender] ?? 0,
            birthday: this.form.birthday || void 0,
            region: this.form.region || void 0,
            signature: this.form.signature || void 0
          });
          uni.showToast({ title: "保存成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1e3);
        } catch (e) {
        } finally {
          this.saving = false;
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page page-profile-edit" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "个人信息",
        "show-back": true
      }, {
        right: vue.withCtx(() => [
          vue.createElementVNode("text", {
            class: "nav-save",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.onSave && $options.onSave(...args))
          }, "保存")
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createElementVNode("view", { class: "page-body" }, [
        vue.createElementVNode("view", { class: "avatar-section" }, [
          vue.createElementVNode("view", {
            class: "avatar-upload",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.chooseAvatar && $options.chooseAvatar(...args))
          }, [
            $data.avatarUrl ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 0,
              src: $data.avatarUrl,
              class: "avatar-preview",
              mode: "aspectFill"
            }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "avatar-placeholder"
            }, [
              vue.createElementVNode("text", { class: "avatar-icon" }, "📷"),
              vue.createElementVNode("text", { class: "avatar-hint" }, "点击更换头像")
            ]))
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "基本信息"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "账号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input input-disabled",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.account = $event),
                disabled: "",
                placeholder: "账号不可修改"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.account]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "邮箱"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input input-disabled",
                type: "text",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.email = $event),
                disabled: "",
                placeholder: "邮箱不可修改"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.email]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "昵称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.nickname = $event),
                placeholder: "请输入昵称"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.nickname]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "性别"),
            vue.createElementVNode("view", { class: "pill-group" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(["男", "女", "保密"], (g) => {
                  return vue.createElementVNode("view", {
                    key: g,
                    class: vue.normalizeClass(["pill", { active: $data.form.gender === g }]),
                    onClick: ($event) => $data.form.gender = g
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(g),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "出生日期"),
            vue.createElementVNode("picker", {
              mode: "date",
              value: $data.form.birthday,
              onChange: _cache[5] || (_cache[5] = (...args) => $options.onBirthChange && $options.onBirthChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker-value" },
                vue.toDisplayString($data.form.birthday || "请选择日期"),
                1
                /* TEXT */
              )
            ], 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "地区"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.region = $event),
                placeholder: "如：广东省深圳市"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.region]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "个性签名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.form.signature = $event),
                placeholder: "请输入个性签名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.signature]
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesProfileEditProfileEdit = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-b59caf64"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/profile-edit/profile-edit.vue"]]);
  const _sfc_main$5 = {
    components: { CustomNavbar },
    data() {
      return {
        fontSize: "中",
        cacheText: "清除",
        settings: {
          medicationRemind: true,
          sportRemind: true,
          recheckRemind: false,
          darkMode: false,
          fingerprint: false,
          dataEncrypt: true
        }
      };
    },
    methods: {
      clearCache() {
        this.cacheText = "已清除";
        uni.showToast({ title: "已清除", icon: "success" });
        setTimeout(() => {
          this.cacheText = "清除";
        }, 1500);
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page page-settings" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "设置",
        "show-back": true
      }),
      vue.createElementVNode("view", { class: "page-body" }, [
        vue.createElementVNode("view", { class: "setting-group" }, [
          vue.createElementVNode("text", { class: "group-title" }, "提醒设置"),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "用药提醒"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle", { on: $data.settings.medicationRemind }]),
                onClick: _cache[0] || (_cache[0] = ($event) => $data.settings.medicationRemind = !$data.settings.medicationRemind)
              },
              [
                vue.createElementVNode("view", { class: "toggle-thumb" })
              ],
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "运动提醒"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle", { on: $data.settings.sportRemind }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $data.settings.sportRemind = !$data.settings.sportRemind)
              },
              [
                vue.createElementVNode("view", { class: "toggle-thumb" })
              ],
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "复查提醒"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle", { on: $data.settings.recheckRemind }]),
                onClick: _cache[2] || (_cache[2] = ($event) => $data.settings.recheckRemind = !$data.settings.recheckRemind)
              },
              [
                vue.createElementVNode("view", { class: "toggle-thumb" })
              ],
              2
              /* CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "setting-group" }, [
          vue.createElementVNode("text", { class: "group-title" }, "显示设置"),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "字体大小"),
            vue.createElementVNode("view", { class: "font-btns" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(["小", "中", "大"], (s) => {
                  return vue.createElementVNode("view", {
                    key: s,
                    class: vue.normalizeClass(["font-btn", { active: $data.fontSize === s }]),
                    onClick: ($event) => $data.fontSize = s
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(s),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "深色模式"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle", { on: $data.settings.darkMode }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $data.settings.darkMode = !$data.settings.darkMode)
              },
              [
                vue.createElementVNode("view", { class: "toggle-thumb" })
              ],
              2
              /* CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "setting-group" }, [
          vue.createElementVNode("text", { class: "group-title" }, "隐私安全"),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "指纹解锁"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle", { on: $data.settings.fingerprint }]),
                onClick: _cache[4] || (_cache[4] = ($event) => $data.settings.fingerprint = !$data.settings.fingerprint)
              },
              [
                vue.createElementVNode("view", { class: "toggle-thumb" })
              ],
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "数据加密"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle", { on: $data.settings.dataEncrypt }]),
                onClick: _cache[5] || (_cache[5] = ($event) => $data.settings.dataEncrypt = !$data.settings.dataEncrypt)
              },
              [
                vue.createElementVNode("view", { class: "toggle-thumb" })
              ],
              2
              /* CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "setting-group" }, [
          vue.createElementVNode("text", { class: "group-title" }, "其他"),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "清除缓存"),
            vue.createElementVNode("view", {
              class: "cache-action",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.clearCache && $options.clearCache(...args))
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.cacheText),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "检查更新"),
            vue.createElementVNode("view", { class: "setting-value" }, "检查")
          ]),
          vue.createElementVNode("view", { class: "setting-item" }, [
            vue.createElementVNode("text", { class: "item-label" }, "当前版本"),
            vue.createElementVNode("text", { class: "setting-value" }, "v1.0.0")
          ])
        ])
      ])
    ]);
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-7fad0a1c"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/settings/settings.vue"]]);
  const _sfc_main$4 = {
    components: { CustomNavbar },
    data() {
      return {
        aerobicPct: 0,
        totalCalories: 0,
        editMode: false,
        weekPlan: (() => {
          const names = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
          const today = /* @__PURE__ */ new Date();
          const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
          return names.map((name, i) => {
            const diff = i + 1 - dayOfWeek;
            const d = new Date(today);
            d.setDate(today.getDate() + diff);
            return {
              name,
              date: d.getMonth() + 1 + "/" + d.getDate(),
              isToday: i + 1 === dayOfWeek,
              exercises: []
            };
          });
        })()
      };
    },
    onShow() {
      this.loadPlan();
    },
    computed: {
      ringAerobicStyle() {
        const deg = this.aerobicPct / 100 * 360;
        return {
          background: `conic-gradient(#34C759 0deg ${deg}deg, #FF9500 ${deg}deg 360deg)`
        };
      }
    },
    methods: {
      async loadPlan() {
        try {
          const res = await getExercisePlan();
          const list = res.data || [];
          this.weekPlan.forEach((d) => d.exercises = []);
          list.forEach((item) => {
            const idx = item.dayOfWeek - 1;
            if (idx >= 0 && idx < 7) {
              this.weekPlan[idx].exercises.push({
                name: item.name,
                duration: item.duration,
                intensity: item.intensity || "",
                isAerobic: item.isAerobic !== false
              });
            }
          });
          this.calcStats();
        } catch (e) {
          formatAppLog("error", "at pages/plan-exercise/plan-exercise.vue:156", "加载运动计划失败", e);
        }
      },
      calcStats() {
        let aerobic = 0, anaerobic = 0, cal = 0;
        this.weekPlan.forEach((d) => {
          d.exercises.forEach((ex) => {
            if (ex.isAerobic)
              aerobic++;
            else
              anaerobic++;
            const mins = parseInt(ex.duration) || 0;
            cal += ex.isAerobic ? mins * 7 : mins * 5;
          });
        });
        const total = aerobic + anaerobic;
        this.aerobicPct = total > 0 ? Math.round(aerobic / total * 100) : 0;
        this.totalCalories = cal;
      },
      async saveEdit() {
        const exercises = [];
        this.weekPlan.forEach((day, i) => {
          day.exercises.forEach((ex, j) => {
            if (ex.name && ex.name.trim()) {
              exercises.push({
                dayOfWeek: i + 1,
                name: ex.name,
                duration: ex.duration,
                intensity: ex.intensity,
                isAerobic: ex.isAerobic,
                sortOrder: j
              });
            }
          });
        });
        try {
          await updateExercisePlan(exercises);
          this.editMode = false;
          this.calcStats();
          uni.showToast({ title: "已保存", icon: "success" });
        } catch (e) {
          uni.showToast({ title: "保存失败", icon: "none" });
        }
      },
      addExercise(dayIdx) {
        this.weekPlan[dayIdx].exercises.push({
          name: "",
          duration: "",
          intensity: "",
          isAerobic: true
        });
      },
      removeExercise(dayIdx, exIdx) {
        this.weekPlan[dayIdx].exercises.splice(exIdx, 1);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "运动计划",
        showBack: true,
        bgColor: "#34C759",
        titleColor: "#fff"
      }),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "ex-scroll"
      }, [
        vue.createElementVNode("view", { class: "stat-area" }, [
          vue.createElementVNode("view", { class: "ring-wrap" }, [
            vue.createElementVNode("view", { class: "ring-outer" }, [
              vue.createElementVNode(
                "view",
                {
                  class: "ring-aerobic",
                  style: vue.normalizeStyle($options.ringAerobicStyle)
                },
                null,
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "ring-hole" }, [
                vue.createElementVNode("text", { class: "ring-label" }, "有氧/无氧"),
                vue.createElementVNode(
                  "text",
                  { class: "ring-ratio" },
                  vue.toDisplayString($data.aerobicPct) + "% / " + vue.toDisplayString(100 - $data.aerobicPct) + "%",
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "ring-legend" }, [
              vue.createElementVNode("view", { class: "legend-item" }, [
                vue.createElementVNode("view", {
                  class: "legend-dot",
                  style: { "background": "#34C759" }
                }),
                vue.createElementVNode("text", null, "有氧运动")
              ]),
              vue.createElementVNode("view", { class: "legend-item" }, [
                vue.createElementVNode("view", {
                  class: "legend-dot",
                  style: { "background": "#FF9500" }
                }),
                vue.createElementVNode("text", null, "无氧运动")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "calorie-box" }, [
            vue.createElementVNode(
              "text",
              { class: "cal-num" },
              vue.toDisplayString($data.totalCalories),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "cal-unit" }, "kcal"),
            vue.createElementVNode("text", { class: "cal-label" }, "本周预计消耗")
          ])
        ]),
        vue.createElementVNode("view", { class: "action-bar" }, [
          vue.createElementVNode("text", { class: "section-title" }, "本周运动安排"),
          !$data.editMode ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "edit-btn",
            onClick: _cache[0] || (_cache[0] = ($event) => $data.editMode = true)
          }, "✏️ 编辑")) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "edit-btn save",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.saveEdit && $options.saveEdit(...args))
          }, "💾 保存"))
        ]),
        vue.createElementVNode("view", { class: "timeline" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.weekPlan, (day, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "day-row"
              }, [
                vue.createElementVNode("view", { class: "day-left" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "day-name" },
                    vue.toDisplayString(day.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "day-date" },
                    vue.toDisplayString(day.date),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "day-line" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "line-dot",
                      style: vue.normalizeStyle({ background: day.isToday ? "#34C759" : "#C9CDD4" })
                    },
                    null,
                    4
                    /* STYLE */
                  ),
                  i < $data.weekPlan.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "line-bar"
                  })) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "day-right" }, [
                  !$data.editMode ? (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 0 },
                    [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(day.exercises, (ex, j) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: j,
                              class: vue.normalizeClass(["exercise-item", { aerobic: ex.isAerobic, anaerobic: !ex.isAerobic }])
                            },
                            [
                              vue.createElementVNode(
                                "text",
                                { class: "ex-name" },
                                vue.toDisplayString(ex.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                { class: "ex-detail" },
                                vue.toDisplayString(ex.duration) + " · " + vue.toDisplayString(ex.intensity),
                                1
                                /* TEXT */
                              )
                            ],
                            2
                            /* CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      )),
                      !day.exercises.length ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "rest-text"
                      }, "🛌 休息日")) : vue.createCommentVNode("v-if", true)
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 1 },
                    [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(day.exercises, (ex, j) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            key: j,
                            class: "exercise-edit-card"
                          }, [
                            vue.createElementVNode("view", { class: "edit-row" }, [
                              vue.createElementVNode("text", { class: "edit-label" }, "名称"),
                              vue.withDirectives(vue.createElementVNode("input", {
                                class: "edit-input",
                                "onUpdate:modelValue": ($event) => ex.name = $event
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vue.vModelText, ex.name]
                              ])
                            ]),
                            vue.createElementVNode("view", { class: "edit-row" }, [
                              vue.createElementVNode("text", { class: "edit-label" }, "时长"),
                              vue.withDirectives(vue.createElementVNode("input", {
                                class: "edit-input",
                                "onUpdate:modelValue": ($event) => ex.duration = $event
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vue.vModelText, ex.duration]
                              ])
                            ]),
                            vue.createElementVNode("view", { class: "edit-row" }, [
                              vue.createElementVNode("text", { class: "edit-label" }, "强度"),
                              vue.withDirectives(vue.createElementVNode("input", {
                                class: "edit-input",
                                "onUpdate:modelValue": ($event) => ex.intensity = $event
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vue.vModelText, ex.intensity]
                              ])
                            ]),
                            vue.createElementVNode("view", { class: "edit-row" }, [
                              vue.createElementVNode("text", { class: "edit-label" }, "类型"),
                              vue.createElementVNode("view", {
                                class: "type-toggle",
                                onClick: ($event) => ex.isAerobic = !ex.isAerobic
                              }, [
                                vue.createElementVNode(
                                  "text",
                                  {
                                    class: vue.normalizeClass({ "type-active": ex.isAerobic })
                                  },
                                  "有氧",
                                  2
                                  /* CLASS */
                                ),
                                vue.createElementVNode("text", null, " / "),
                                vue.createElementVNode(
                                  "text",
                                  {
                                    class: vue.normalizeClass({ "type-active": !ex.isAerobic })
                                  },
                                  "无氧",
                                  2
                                  /* CLASS */
                                )
                              ], 8, ["onClick"])
                            ]),
                            vue.createElementVNode("text", {
                              class: "del-ex",
                              onClick: ($event) => $options.removeExercise(i, j)
                            }, "✕ 删除", 8, ["onClick"])
                          ]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      )),
                      vue.createElementVNode("view", {
                        class: "add-ex-btn",
                        onClick: ($event) => $options.addExercise(i)
                      }, [
                        vue.createElementVNode("text", null, "+ 添加运动")
                      ], 8, ["onClick"])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesPlanExercisePlanExercise = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-a0098282"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-exercise/plan-exercise.vue"]]);
  const _sfc_main$3 = {
    components: { CustomNavbar },
    onShow() {
      this.loadPlan();
    },
    data() {
      const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      const today = /* @__PURE__ */ new Date();
      const weekMeals = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - today.getDay() + 1 + i);
        weekMeals.push({
          name: dayNames[i],
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          isToday: d.toDateString() === today.toDateString(),
          meals: []
        });
      }
      return {
        dailyTarget: 2e3,
        consumed: 0,
        exerciseBurn: 0,
        carb: 0,
        carbTarget: 250,
        protein: 0,
        proteinTarget: 75,
        fat: 0,
        fatTarget: 60,
        editMode: false,
        weekMeals
      };
    },
    computed: {
      remaining() {
        return Math.max(0, this.dailyTarget - this.consumed);
      },
      intakeRingStyle() {
        const pct = this.dailyTarget ? Math.min(100, this.consumed / this.dailyTarget * 100) : 0;
        const deg = pct / 100 * 360;
        return {
          background: `conic-gradient(#FF9500 0deg ${deg}deg, #E5E6EB ${deg}deg 360deg)`
        };
      },
      carbPct() {
        return this.carbTarget ? Math.min(100, this.carb / this.carbTarget * 100) : 0;
      },
      proteinPct() {
        return this.proteinTarget ? Math.min(100, this.protein / this.proteinTarget * 100) : 0;
      },
      fatPct() {
        return this.fatTarget ? Math.min(100, this.fat / this.fatTarget * 100) : 0;
      },
      carbText() {
        return this.carb || this.carbTarget ? `${this.carb}/${this.carbTarget}g` : "--";
      },
      proteinText() {
        return this.protein || this.proteinTarget ? `${this.protein}/${this.proteinTarget}g` : "--";
      },
      fatText() {
        return this.fat || this.fatTarget ? `${this.fat}/${this.fatTarget}g` : "--";
      }
    },
    methods: {
      async loadPlan() {
        try {
          const res = await getDietPlan();
          const data = res.data || {};
          const meals = data.meals || [];
          const target = data.target;
          this.weekMeals.forEach((d) => d.meals = []);
          const typeMap = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snack: "加餐" };
          meals.forEach((item) => {
            const idx = item.dayOfWeek - 1;
            if (idx >= 0 && idx < 7) {
              this.weekMeals[idx].meals.push({
                type: typeMap[item.mealType] || item.mealType,
                mealType: item.mealType,
                calories: item.calories || 0,
                foods: item.foods ? item.foods.split("、") : []
              });
            }
          });
          if (target) {
            this.dailyTarget = target.dailyCalories || 1800;
            this.carbTarget = target.carbTarget || 225;
            this.proteinTarget = target.proteinTarget || 68;
            this.fatTarget = target.fatTarget || 55;
          }
          this.calcConsumed();
        } catch (e) {
          formatAppLog("error", "at pages/plan-diet/plan-diet.vue:170", "加载饮食计划失败", e);
        }
      },
      calcConsumed() {
        const today = /* @__PURE__ */ new Date();
        const todayIdx = (today.getDay() + 6) % 7;
        const todayMeals = this.weekMeals[todayIdx] ? this.weekMeals[todayIdx].meals : [];
        this.consumed = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
      },
      updateFoods(dayIdx, mealIdx, val) {
        const arr = val.split("、").filter((s) => s.trim());
        this.weekMeals[dayIdx].meals[mealIdx].foods = arr.length ? arr : [];
      },
      async saveEdit() {
        const typeRMap = { "早餐": "breakfast", "午餐": "lunch", "晚餐": "dinner", "加餐": "snack" };
        const meals = [];
        this.weekMeals.forEach((day, i) => {
          day.meals.forEach((m, j) => {
            meals.push({
              dayOfWeek: i + 1,
              mealType: m.mealType || typeRMap[m.type] || "breakfast",
              calories: m.calories,
              foods: Array.isArray(m.foods) ? m.foods.join("、") : m.foods,
              sortOrder: j
            });
          });
        });
        try {
          await updateDietPlan({
            meals,
            target: {
              dailyCalories: this.dailyTarget,
              carbTarget: this.carbTarget,
              proteinTarget: this.proteinTarget,
              fatTarget: this.fatTarget
            }
          });
          this.editMode = false;
          uni.showToast({ title: "已保存", icon: "success" });
        } catch (e) {
          uni.showToast({ title: "保存失败", icon: "none" });
        }
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "饮食计划",
        showBack: true,
        bgColor: "#FF9500",
        titleColor: "#fff"
      }),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "diet-scroll"
      }, [
        vue.createElementVNode("view", { class: "stat-card" }, [
          vue.createElementVNode("view", { class: "stat-top" }, [
            vue.createElementVNode("view", { class: "stat-col" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-val" },
                vue.toDisplayString($data.consumed),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "已摄入(kcal)")
            ]),
            vue.createElementVNode("view", { class: "stat-ring-col" }, [
              vue.createElementVNode("view", { class: "ring-outer-d" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "ring-fill-d",
                    style: vue.normalizeStyle($options.intakeRingStyle)
                  },
                  null,
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "ring-center-d" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "ring-val-d" },
                    vue.toDisplayString($options.remaining),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "ring-unit-d" }, "kcal")
                ])
              ]),
              vue.createElementVNode("text", { class: "stat-sub" }, "还可摄入")
            ]),
            vue.createElementVNode("view", { class: "stat-col" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-val" },
                vue.toDisplayString($data.exerciseBurn),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "运动消耗(kcal)")
            ])
          ]),
          vue.createElementVNode("view", { class: "nutrient-bars" }, [
            vue.createElementVNode("view", { class: "nut-row" }, [
              vue.createElementVNode("text", { class: "nut-name" }, "碳水"),
              vue.createElementVNode("view", { class: "nut-bar-bg" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "nut-bar-fill",
                    style: vue.normalizeStyle({ width: $options.carbPct + "%", background: "#FF9500" })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "nut-pct" },
                vue.toDisplayString($options.carbText),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "nut-row" }, [
              vue.createElementVNode("text", { class: "nut-name" }, "蛋白质"),
              vue.createElementVNode("view", { class: "nut-bar-bg" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "nut-bar-fill",
                    style: vue.normalizeStyle({ width: $options.proteinPct + "%", background: "#4A90D9" })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "nut-pct" },
                vue.toDisplayString($options.proteinText),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "nut-row" }, [
              vue.createElementVNode("text", { class: "nut-name" }, "脂肪"),
              vue.createElementVNode("view", { class: "nut-bar-bg" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "nut-bar-fill",
                    style: vue.normalizeStyle({ width: $options.fatPct + "%", background: "#EF4444" })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "nut-pct" },
                vue.toDisplayString($options.fatText),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "week-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "本周饮食安排"),
          !$data.editMode ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "edit-hint",
            onClick: _cache[0] || (_cache[0] = ($event) => $data.editMode = true)
          }, "✏️ 编辑")) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "edit-hint save",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.saveEdit && $options.saveEdit(...args))
          }, "💾 保存"))
        ]),
        vue.createElementVNode("view", { class: "timeline" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.weekMeals, (day, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "day-row"
              }, [
                vue.createElementVNode("view", { class: "day-left" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "day-name" },
                    vue.toDisplayString(day.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "day-date" },
                    vue.toDisplayString(day.date),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "day-line" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "line-dot",
                      style: vue.normalizeStyle({ background: day.isToday ? "#FF9500" : "#C9CDD4" })
                    },
                    null,
                    4
                    /* STYLE */
                  ),
                  i < $data.weekMeals.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "line-bar"
                  })) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "day-right" }, [
                  !day.meals.length ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "rest-text"
                  }, "暂无饮食安排")) : vue.createCommentVNode("v-if", true),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(day.meals, (meal, mi) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: mi,
                        class: "meal-box"
                      }, [
                        vue.createElementVNode("view", { class: "meal-header" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "meal-type" },
                            vue.toDisplayString(meal.type),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "meal-cal" },
                            vue.toDisplayString(meal.calories) + " kcal",
                            1
                            /* TEXT */
                          )
                        ]),
                        !$data.editMode ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "meal-foods"
                        }, [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(meal.foods, (f, fi) => {
                              return vue.openBlock(), vue.createElementBlock(
                                "text",
                                {
                                  key: fi,
                                  class: "food-tag"
                                },
                                vue.toDisplayString(f),
                                1
                                /* TEXT */
                              );
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])) : (vue.openBlock(), vue.createElementBlock("view", {
                          key: 1,
                          class: "meal-foods"
                        }, [
                          vue.createElementVNode("input", {
                            class: "meal-edit-input",
                            value: meal.foods.join("、"),
                            onInput: (e) => $options.updateFoods(i, mi, e.detail.value)
                          }, null, 40, ["value", "onInput"])
                        ]))
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesPlanDietPlanDiet = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-12372653"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-diet/plan-diet.vue"]]);
  const _sfc_main$2 = {
    components: { CustomNavbar },
    data() {
      return {
        selectedDay: ((/* @__PURE__ */ new Date()).getDay() + 6) % 7,
        weekDays: [
          { short: "一", date: "" },
          { short: "二", date: "" },
          { short: "三", date: "" },
          { short: "四", date: "" },
          { short: "五", date: "" },
          { short: "六", date: "" },
          { short: "日", date: "" }
        ],
        allMeds: {}
      };
    },
    created() {
      const today = /* @__PURE__ */ new Date();
      const dayOfWeek = (today.getDay() + 6) % 7;
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - dayOfWeek + i);
        this.weekDays[i].date = d.getMonth() + 1 + "/" + d.getDate();
      }
    },
    onShow() {
      this.loadMeds();
    },
    computed: {
      currentMeds() {
        const list = this.allMeds[this.selectedDay];
        return Array.isArray(list) ? list : [];
      }
    },
    methods: {
      async loadMeds() {
        try {
          const res = await getMedicationPlan();
          const list = res.data || [];
          const meds = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
          list.forEach((item) => {
            const wi = item.weekIndex;
            if (wi >= 0 && wi <= 6) {
              meds[wi].push({
                time: item.time,
                period: item.period,
                name: item.name,
                dosage: item.dosage,
                status: item.status || "pending",
                recordId: item.recordId
              });
            }
          });
          for (let i = 0; i < 7; i++) {
            meds[i].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
          }
          this.allMeds = meds;
        } catch (e) {
          formatAppLog("error", "at pages/plan-medication/plan-medication.vue:110", "加载用药计划失败", e);
        }
      },
      toggleMed(idx) {
        const m = this.currentMeds[idx];
        if (m.status !== "pending")
          return;
        uni.showModal({
          title: "确认服药",
          content: `确定已服用「${m.name}」${m.dosage} 吗？`,
          success: (res) => {
            if (res.confirm) {
              m.status = "done";
              uni.showToast({ title: "已标记服用", icon: "success" });
            }
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "用药计划",
        showBack: true,
        bgColor: "#EF4444",
        titleColor: "#fff"
      }),
      vue.createElementVNode("scroll-view", {
        "scroll-x": "",
        class: "week-scroll"
      }, [
        vue.createElementVNode("view", { class: "week-bar" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.weekDays, (d, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: vue.normalizeClass(["week-btn", { active: $data.selectedDay === i }]),
                onClick: ($event) => $data.selectedDay = i
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "wb-name" },
                  vue.toDisplayString(d.short),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "wb-date" },
                  vue.toDisplayString(d.date),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "med-scroll"
      }, [
        vue.createElementVNode("view", { class: "med-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.currentMeds, (m, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "med-item"
              }, [
                vue.createElementVNode("view", { class: "med-time-col" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "med-time" },
                    vue.toDisplayString(m.time),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "med-period" },
                    vue.toDisplayString(m.period),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "med-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "med-name" },
                    vue.toDisplayString(m.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "med-dosage" },
                    vue.toDisplayString(m.dosage),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", {
                  class: vue.normalizeClass(["med-status", m.status]),
                  onClick: ($event) => $options.toggleMed(i)
                }, [
                  m.status === "done" ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "✓ 已服")) : m.status === "pending" ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "待服用")) : (vue.openBlock(), vue.createElementBlock("text", { key: 2 }, "未服用"))
                ], 10, ["onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          !$options.currentMeds.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-hint"
          }, [
            vue.createElementVNode("text", null, "🎉 今日无用药计划")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("navigator", {
          url: "/pages/medication/medication",
          class: "goto-med-btn",
          "hover-class": "goto-hover"
        }, [
          vue.createElementVNode("text", null, "💊 前往用药管理")
        ])
      ])
    ]);
  }
  const PagesPlanMedicationPlanMedication = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-87c692a3"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-medication/plan-medication.vue"]]);
  const _sfc_main$1 = {
    components: { CustomNavbar },
    data() {
      return {
        showAddModal: false,
        newRecord: { date: "", hospital: "", itemsStr: "", note: "" },
        records: []
      };
    },
    onShow() {
      this.loadRecords();
    },
    methods: {
      async loadRecords() {
        try {
          const res = await getCheckupPlan();
          this.records = (res.data || []).map((r) => {
            const parts = r.checkupDate.split("-");
            return {
              id: r.id,
              day: parseInt(parts[2]),
              month: parseInt(parts[1]) + "月",
              hospital: r.hospital,
              items: r.items ? r.items.split("、") : [],
              note: r.note || "",
              status: r.status
            };
          });
        } catch (e) {
          formatAppLog("error", "at pages/plan-checkup/plan-checkup.vue:100", "加载复查记录失败", e);
        }
      },
      async addRecord() {
        if (!this.newRecord.date || !this.newRecord.hospital || !this.newRecord.itemsStr) {
          uni.showToast({ title: "请填写完整", icon: "none" });
          return;
        }
        try {
          await addCheckupRecord({
            checkupDate: this.newRecord.date,
            hospital: this.newRecord.hospital,
            items: this.newRecord.itemsStr,
            note: this.newRecord.note
          });
          this.showAddModal = false;
          this.newRecord = { date: "", hospital: "", itemsStr: "", note: "" };
          uni.showToast({ title: "已添加", icon: "success" });
          await this.loadRecords();
        } catch (e) {
          uni.showToast({ title: "添加失败", icon: "none" });
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "复查计划",
        showBack: true,
        bgColor: "#4A90D9",
        titleColor: "#fff"
      }),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        class: "ck-scroll"
      }, [
        vue.createElementVNode("view", { class: "ck-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.records, (r, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "ck-card"
              }, [
                vue.createElementVNode("view", { class: "ck-date-col" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "ck-day" },
                    vue.toDisplayString(r.day),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "ck-month" },
                    vue.toDisplayString(r.month),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "ck-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "ck-hospital" },
                    vue.toDisplayString(r.hospital),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "ck-tags" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(r.items, (t, ti) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: ti,
                          class: "ck-tag"
                        }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(t),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  r.note ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "ck-note"
                    },
                    vue.toDisplayString(r.note),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["ck-status", r.status])
                  },
                  [
                    r.status === "done" ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "已完成")) : r.status === "upcoming" ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "待复查")) : (vue.openBlock(), vue.createElementBlock("text", { key: 2 }, "已过期"))
                  ],
                  2
                  /* CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", {
          class: "add-ck-card",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.showAddModal = true)
        }, [
          vue.createElementVNode("text", { class: "add-icon" }, "+"),
          vue.createElementVNode("text", { class: "add-text" }, "添加复查计划")
        ])
      ]),
      $data.showAddModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-mask",
        onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => $data.showAddModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-card" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "新增复查"),
          vue.createElementVNode("view", { class: "modal-row" }, [
            vue.createElementVNode("text", { class: "modal-label" }, "复查日期"),
            vue.createElementVNode(
              "picker",
              {
                mode: "date",
                onChange: _cache[1] || (_cache[1] = (e) => $data.newRecord.date = e.detail.value)
              },
              [
                vue.createElementVNode(
                  "view",
                  { class: "modal-input picker-v" },
                  vue.toDisplayString($data.newRecord.date || "选择日期"),
                  1
                  /* TEXT */
                )
              ],
              32
              /* NEED_HYDRATION */
            )
          ]),
          vue.createElementVNode("view", { class: "modal-row" }, [
            vue.createElementVNode("text", { class: "modal-label" }, "医院/诊所"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.newRecord.hospital = $event),
                placeholder: "请输入"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newRecord.hospital]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-row" }, [
            vue.createElementVNode("text", { class: "modal-label" }, "检查项目"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.newRecord.itemsStr = $event),
                placeholder: "多项用顿号分隔"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newRecord.itemsStr]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-row" }, [
            vue.createElementVNode("text", { class: "modal-label" }, "备注"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.newRecord.note = $event),
                placeholder: "选填"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newRecord.note]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "m-btn cancel",
              onClick: _cache[5] || (_cache[5] = ($event) => $data.showAddModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "m-btn confirm",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.addRecord && $options.addRecord(...args))
            }, [
              vue.createElementVNode("text", null, "确认添加")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesPlanCheckupPlanCheckup = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-f8be226f"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-checkup/plan-checkup.vue"]]);
  __definePage("pages/splash/splash", PagesSplashSplash);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/ai-consult/ai-consult", PagesAiConsultAiConsult);
  __definePage("pages/plan-overview/plan-overview", PagesPlanOverviewPlanOverview);
  __definePage("pages/task-today/task-today", PagesTaskTodayTaskToday);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/health-detail/health-detail", PagesHealthDetailHealthDetail);
  __definePage("pages/health-input/health-input", PagesHealthInputHealthInput);
  __definePage("pages/health-advice/health-advice", PagesHealthAdviceHealthAdvice);
  __definePage("pages/ai-history/ai-history", PagesAiHistoryAiHistory);
  __definePage("pages/ai-history-detail/ai-history-detail", PagesAiHistoryDetailAiHistoryDetail);
  __definePage("pages/plan-edit/plan-edit", PagesPlanEditPlanEdit);
  __definePage("pages/medication/medication", PagesMedicationMedication);
  __definePage("pages/medication-detail/medication-detail", PagesMedicationDetailMedicationDetail);
  __definePage("pages/task-history/task-history", PagesTaskHistoryTaskHistory);
  __definePage("pages/profile-edit/profile-edit", PagesProfileEditProfileEdit);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  __definePage("pages/plan-exercise/plan-exercise", PagesPlanExercisePlanExercise);
  __definePage("pages/plan-diet/plan-diet", PagesPlanDietPlanDiet);
  __definePage("pages/plan-medication/plan-medication", PagesPlanMedicationPlanMedication);
  __definePage("pages/plan-checkup/plan-checkup", PagesPlanCheckupPlanCheckup);
  const _sfc_main = {
    onLaunch() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow() {
      uni.hideTabBar();
    },
    onHide() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
