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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$q = {
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
        timer: null
      };
    },
    beforeDestroy() {
      if (this.timer)
        clearInterval(this.timer);
    },
    methods: {
      getVerifyCode() {
        if (this.countdown > 0)
          return;
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0 && this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1e3);
      },
      handleLogin() {
        uni.switchTab({ url: "/pages/home/home" });
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
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
        vue.createElementVNode("view", { class: "divider" }, [
          vue.createElementVNode("view", { class: "divider-line" }),
          vue.createElementVNode("text", { class: "divider-text" }, "其他登录方式"),
          vue.createElementVNode("view", { class: "divider-line" })
        ]),
        vue.createElementVNode("view", { class: "social-login" }, [
          vue.createElementVNode("view", { class: "social-btn" }, [
            vue.createElementVNode("text", null, "微")
          ]),
          vue.createElementVNode("view", { class: "social-btn" }, [
            vue.createElementVNode("text", null, "Q")
          ]),
          vue.createElementVNode("view", { class: "social-btn" }, [
            vue.createElementVNode("text", null, "📱")
          ])
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
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-e4e4508d"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/login/login.vue"]]);
  const _sfc_main$p = {
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
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
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
  const CustomNavbar = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-e1c8316f"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/components/custom-navbar.vue"]]);
  const _sfc_main$o = {
    name: "Register",
    components: { CustomNavbar },
    data() {
      return {
        currentStep: 1,
        countdown: 0,
        timer: null,
        showPassword: false,
        formData: {
          email: "",
          verifyCode: "",
          account: "",
          password: "",
          confirmPassword: "",
          nickname: "",
          gender: "male",
          birthday: "1958-05-15",
          region: "",
          agreeTerms: true
        },
        strengthLevel: "",
        // weak | medium | strong
        passwordMatch: null,
        // true | false | null
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
        this.currentStep = step;
      },
      getVerifyCode() {
        if (this.countdown > 0)
          return;
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0 && this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1e3);
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
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
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
              vue.createElementVNode("navigator", {
                url: "/pages/login/login",
                "open-type": "redirectTo",
                class: "btn-primary flex2"
              }, [
                vue.createElementVNode("text", null, "完成注册")
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
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-bac4a35d"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/register/register.vue"]]);
  const _sfc_main$n = {
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
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
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
  const CustomTabbar = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-c0af68ba"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/components/custom-tabbar.vue"]]);
  const _sfc_main$m = {
    components: { CustomTabbar },
    data() {
      return {
        showInputMenu: false,
        dateText: "",
        metrics: [
          { icon: "🌡", iconBg: "#FEF9C3", label: "体温", value: "37.6", unit: "°C", status: "偏高", statusColor: "#F59E0B" },
          { icon: "❤", iconBg: "#ECFDF5", label: "血压", value: "125", unit: "/77 mmHg", status: "正常", statusColor: "#16A34A" },
          { icon: "💧", iconBg: "#EFF6FF", label: "血糖", value: "5.8", unit: "mmol/L", status: "正常", statusColor: "#16A34A" },
          { icon: "⚖", iconBg: "#F3E8FF", label: "BMI", value: "21.9", unit: "kg/m²", status: "标准", statusColor: "#2563EB" },
          { icon: "💗", iconBg: "#FEF2F2", label: "心率", value: "83", unit: "BPM", status: "正常", statusColor: "#16A34A" },
          { icon: "🌙", iconBg: "#EDE9FE", label: "睡眠时长", value: "7.5", unit: "小时", status: "良好", statusColor: "#2563EB" }
        ],
        adviceList: [
          { icon: "🌡", iconBg: "#FEF9C3", title: "关注体温", desc: "体温偏高，建议多休息，必要时就医检查" },
          { icon: "🏃", iconBg: "#ECFDF5", title: "保持运动", desc: "建议每天进行30分钟中等强度有氧运动" },
          { icon: "🥗", iconBg: "#EFF6FF", title: "均衡饮食", desc: "减少钠盐摄入，每日不超过5g，多食新鲜蔬果" }
        ]
      };
    },
    onShow() {
      uni.hideTabBar();
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
      toggleInputMenu() {
        this.showInputMenu = !this.showInputMenu;
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomTabbar = vue.resolveComponent("CustomTabbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createElementVNode("view", { class: "home-header" }, [
        vue.createElementVNode("view", { class: "greeting-row" }, [
          vue.createElementVNode("view", { class: "greeting-text" }, [
            vue.createElementVNode("text", { class: "greeting-title" }, "早上好，张老先生"),
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
            vue.createElementVNode("text", { class: "score-title" }, "整体健康状况良好"),
            vue.createElementVNode("view", { class: "score-main" }, [
              vue.createElementVNode("text", { class: "score-num" }, "86"),
              vue.createElementVNode("text", { class: "score-unit" }, "健康评分")
            ]),
            vue.createElementVNode("text", { class: "score-desc" }, "较上周提升3分，继续保持规律的生活习惯"),
            vue.createElementVNode("view", { class: "stats-row" }, [
              vue.createElementVNode("view", { class: "stat-col" }, [
                vue.createElementVNode("text", { class: "stat-val" }, "7"),
                vue.createElementVNode("text", { class: "stat-txt" }, "连续打卡天数")
              ]),
              vue.createElementVNode("view", { class: "stat-col" }, [
                vue.createElementVNode("text", { class: "stat-val" }, "92%"),
                vue.createElementVNode("text", { class: "stat-txt" }, "本周完成率")
              ]),
              vue.createElementVNode("view", { class: "stat-col" }, [
                vue.createElementVNode("text", { class: "stat-val" }, "正常"),
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
                url: "/pages/health-detail/health-detail",
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
              ]);
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
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-07e72d3c"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/home/home.vue"]]);
  const _sfc_main$l = {
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
        isRecording: false,
        isRecognizing: false,
        touchStartY: 0,
        isCanceled: false,
        recordStartTime: 0,
        kbUp: false,
        kbHeight: 0,
        currentHistoryIdx: -1,
        historyList: [
          { title: "血压偏高咨询", time: "今天 09:30" },
          { title: "睡眠质量改善", time: "昨天 15:20" },
          { title: "饮食注意事项", time: "3月7日 10:15" }
        ],
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
      this.pushWelcome();
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
      pushWelcome() {
        this.msgList = [{
          role: "ai",
          content: "您好！我是您的AI健康助手小Y，很高兴为您服务。请问有什么可以帮您的吗？"
        }];
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
      sendMessage() {
        const txt = (this.inputText || "").trim();
        if (!txt && !this.tempImagePath) {
          uni.showToast({ title: "请输入消息", icon: "none" });
          return;
        }
        const userMsg = { role: "user", content: txt || "[图片]" };
        if (this.tempImagePath) {
          userMsg.imageUrl = this.tempImagePath;
          this.tempImagePath = "";
        }
        this.msgList.push(userMsg);
        this.inputText = "";
        this.showQuickQ = false;
        this.$nextTick(() => this.scrollToEnd());
        this.shouldStop = false;
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          const aiMsg = { role: "ai", content: "" };
          this.msgList.push(aiMsg);
          this.typeMessage(
            "好的，我正在为您分析相关信息。根据您的描述，建议您：\n1. 保持规律的作息时间\n2. 适量进行有氧运动\n3. 注意饮食清淡\n4. 定期监测身体指标\n\n如果症状持续，建议及时就医检查。",
            this.msgList.length - 1
          );
        }, 1200);
      },
      typeMessage(fullText, msgIdx, charIdx = 0) {
        if (this.shouldStop) {
          if (this.msgList[msgIdx])
            this.msgList[msgIdx].content += "\n\n[回答已终止]";
          this.isTyping = false;
          this.shouldStop = false;
          return;
        }
        this.isTyping = true;
        if (charIdx <= fullText.length) {
          this.msgList[msgIdx].content = fullText.slice(0, charIdx);
          if (charIdx % 10 === 0)
            this.$nextTick(() => this.scrollToEnd());
          setTimeout(() => this.typeMessage(fullText, msgIdx, charIdx + 1), 45);
        } else {
          this.isTyping = false;
          this.scrollToEnd();
        }
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
      },
      onTouchMove(e) {
        if (!this.isRecording)
          return;
        this.isCanceled = this.touchStartY - e.touches[0].clientY > 50;
      },
      stopRecording() {
        if (!this.isRecording)
          return;
        if (this.isCanceled) {
          this.isRecording = false;
          uni.showToast({ title: "已取消发送", icon: "none" });
          return;
        }
        if (Date.now() - this.recordStartTime < 1e3) {
          this.isRecording = false;
          uni.showToast({ title: "说话时间太短", icon: "none" });
          return;
        }
        this.isRecognizing = true;
        setTimeout(() => {
          this.isRecording = false;
          this.isRecognizing = false;
          this.inputText = "我最近血压有点偏高，需要注意什么？";
        }, 1500);
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
      loadHistory(idx) {
        this.currentHistoryIdx = idx;
        this.showSidebar = false;
      },
      deleteHistory(idx) {
        uni.showModal({ title: "删除对话", content: "确定删除？", success: (r) => {
          if (r.confirm) {
            this.historyList.splice(idx, 1);
          }
        } });
      },
      previewImg(url) {
        uni.previewImage({ urls: [url], current: url });
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
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesAiConsultAiConsult = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-78fd8d65"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/ai-consult/ai-consult.vue"]]);
  const _sfc_main$k = {
    components: { CustomTabbar },
    data() {
      return {
        aiLoading: false,
        tasks: [
          { id: 1, title: "晨跑30分钟", type: "运动", time: "07:00", done: false },
          { id: 2, title: "早餐营养搭配", type: "饮食", time: "08:00", done: false },
          { id: 3, title: "服用降压药", type: "用药", time: "09:00", done: false },
          { id: 4, title: "测量血压", type: "健康", time: "09:30", done: false },
          { id: 5, title: "午间散步20分钟", type: "运动", time: "12:30", done: true },
          { id: 6, title: "午餐清淡饮食", type: "饮食", time: "12:00", done: true },
          { id: 7, title: "下午服药", type: "用药", time: "15:00", done: true },
          { id: 8, title: "晚间太极拳", type: "运动", time: "18:00", done: true },
          { id: 9, title: "晚间用药", type: "用药", time: "20:00", done: true }
        ]
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
    },
    methods: {
      tagColor(type) {
        const m = { "运动": "#34C759", "饮食": "#FF9500", "用药": "#EF4444", "健康": "#4A90D9" };
        return m[type] || "#4A90D9";
      },
      onAiGen() {
        if (this.aiLoading)
          return;
        this.aiLoading = true;
        setTimeout(() => {
          this.aiLoading = false;
          uni.showToast({ title: "计划已生成", icon: "success" });
        }, 3e3);
      },
      confirmComplete(item) {
        uni.showModal({
          title: "确认完成",
          content: `确定已完成「${item.title}」吗？`,
          success: (res) => {
            if (res.confirm) {
              item.done = true;
              uni.showToast({ title: "已完成", icon: "success" });
            }
          }
        });
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesPlanOverviewPlanOverview = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-b97d5bf4"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/plan-overview/plan-overview.vue"]]);
  const _sfc_main$j = {
    components: { CustomNavbar },
    data() {
      return {
        ringSize: 80,
        tasks: [
          { id: 1, title: "晨跑30分钟", type: "运动", time: "08:00", done: false },
          { id: 2, title: "早餐营养搭配", type: "饮食", time: "08:30", done: false },
          { id: 3, title: "服用降压药", type: "用药", time: "09:00", done: false },
          { id: 4, title: "测量血压", type: "健康", time: "09:30", done: false },
          { id: 5, title: "午间散步", type: "运动", time: "12:30", done: true },
          { id: 6, title: "午餐清淡", type: "饮食", time: "12:00", done: true },
          { id: 7, title: "下午茶点", type: "饮食", time: "15:00", done: true },
          { id: 8, title: "测量血糖", type: "健康", time: "16:00", done: true },
          { id: 9, title: "晚间用药", type: "用药", time: "19:00", done: true }
        ]
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
    mounted() {
      this.$nextTick(() => this.drawRing());
    },
    methods: {
      tagColor(type) {
        const m = { 运动: "#34C759", 饮食: "#FF9500", 用药: "#FF3B30", 健康: "#4A90D9" };
        return m[type] || "#4A90D9";
      },
      confirmComplete(item) {
        if (item.done)
          return;
        uni.showModal({
          title: "确认完成",
          content: `确定已完成任务「${item.title}」吗？`,
          success: (res) => {
            if (res.confirm) {
              item.done = true;
              uni.showToast({ title: "已完成", icon: "success" });
              this.$nextTick(() => this.drawRing());
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
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesTaskTodayTaskToday = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-9d6d08e3"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/task-today/task-today.vue"]]);
  const _sfc_main$i = {
    components: { CustomTabbar },
    onShow() {
      uni.hideTabBar();
    },
    methods: {
      noPage() {
        uni.showToast({ title: "功能开发中", icon: "none" });
      },
      doLogout() {
        uni.reLaunch({ url: "/pages/login/login" });
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomTabbar = vue.resolveComponent("CustomTabbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page page-profile" }, [
      vue.createElementVNode("view", { class: "profile-header" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/profile-edit/profile-edit",
          class: "avatar-wrap",
          "hover-class": "none"
        }, [
          vue.createElementVNode("text", { class: "avatar-text" }, "张")
        ]),
        vue.createElementVNode("text", { class: "user-name" }, "张老先生"),
        vue.createElementVNode("view", { class: "badge" }, "健康达人")
      ]),
      vue.createElementVNode("view", { class: "stats-row" }, [
        vue.createElementVNode("view", { class: "stat-item" }, [
          vue.createElementVNode("text", { class: "stat-num" }, "128"),
          vue.createElementVNode("text", { class: "stat-desc" }, "已记录天数")
        ]),
        vue.createElementVNode("view", { class: "stat-item" }, [
          vue.createElementVNode("text", { class: "stat-num" }, "7"),
          vue.createElementVNode("text", { class: "stat-desc" }, "连续打卡")
        ]),
        vue.createElementVNode("view", { class: "stat-item" }, [
          vue.createElementVNode("text", { class: "stat-num" }, "86"),
          vue.createElementVNode("text", { class: "stat-desc" }, "健康评分")
        ])
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
            url: "/pages/health-detail/health-detail",
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
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-dd383ca2"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/profile/profile.vue"]]);
  const _sfc_main$h = {
    components: { CustomNavbar },
    data() {
      return {
        records: [
          { date: "今天", time: "08:30", value: "145/92", status: "偏高", statusClass: "high" },
          { date: "昨天", time: "08:15", value: "138/88", status: "临界", statusClass: "warn" },
          { date: "3月7日", time: "09:00", value: "132/85", status: "正常", statusClass: "normal" },
          { date: "3月6日", time: "08:45", value: "128/82", status: "正常", statusClass: "normal" },
          { date: "3月5日", time: "07:50", value: "135/86", status: "正常", statusClass: "normal" },
          { date: "3月4日", time: "08:20", value: "142/91", status: "偏高", statusClass: "high" },
          { date: "3月3日", time: "08:10", value: "130/84", status: "正常", statusClass: "normal" }
        ]
      };
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, {
        title: "血压详情",
        showBack: true,
        bgColor: "#4A90D9",
        titleColor: "#fff"
      }),
      vue.createElementVNode("view", { class: "detail-header" }, [
        vue.createElementVNode("view", { class: "current-value-area" }, [
          vue.createElementVNode("view", { class: "icon-circle" }, [
            vue.createElementVNode("text", null, "💓")
          ]),
          vue.createElementVNode("view", { class: "val-row" }, [
            vue.createElementVNode("text", { class: "big-value" }, "145"),
            vue.createElementVNode("text", { class: "big-unit" }, " / 92 mmHg")
          ]),
          vue.createElementVNode("view", { class: "status-badge-danger" }, [
            vue.createElementVNode("text", null, "偏高 ↑")
          ])
        ]),
        vue.createElementVNode("view", { class: "reference-box" }, [
          vue.createElementVNode("text", { class: "ref-col" }, "正常范围"),
          vue.createElementVNode("text", { class: "ref-col-bold" }, "收缩压 90-140"),
          vue.createElementVNode("text", { class: "ref-col-bold" }, "舒张压 60-90")
        ])
      ]),
      vue.createElementVNode("view", { class: "detail-body" }, [
        vue.createElementVNode("navigator", {
          url: "/pages/health-trend/health-trend",
          class: "trend-entry",
          "hover-class": "trend-entry-hover"
        }, [
          vue.createElementVNode("text", { class: "trend-icon" }, "📈"),
          vue.createElementVNode("text", { class: "trend-text" }, "查看趋势图表")
        ]),
        vue.createElementVNode("text", { class: "section-title" }, "最近 7 天记录"),
        vue.createElementVNode("view", { class: "record-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.records, (item, idx) => {
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
                    class: vue.normalizeClass(["record-value", { "value-danger": item.status !== "正常" }])
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
  const PagesHealthDetailHealthDetail = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-ea663d6b"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/health-detail/health-detail.vue"]]);
  const _sfc_main$g = {
    name: "TabSwitch",
    props: {
      tabs: { type: Array, default: () => [] },
      modelValue: { type: Number, default: 0 }
    },
    emits: ["update:modelValue"]
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
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
  const TabSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-b971217e"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/components/tab-switch.vue"]]);
  const _sfc_main$f = {
    components: { CustomNavbar, TabSwitch },
    data() {
      return {
        tabIndex: 0,
        metricTypes: [
          { name: "血压", icon: "💓", unit: "mmHg", dual: true, ph1: "收缩压", ph2: "舒张压" },
          { name: "心率", icon: "❤", unit: "次/分", dual: false },
          { name: "体温", icon: "🌡", unit: "°C", dual: false },
          { name: "血糖", icon: "💧", unit: "mmol/L", dual: false },
          { name: "睡眠", icon: "🌙", unit: "小时", dual: false },
          { name: "呼吸", icon: "🫁", unit: "次/分", dual: false },
          { name: "体重", icon: "⚖", unit: "kg", dual: false },
          { name: "身高", icon: "📏", unit: "cm", dual: false }
        ],
        selectedMetric: 0,
        bpHigh: "",
        bpLow: "",
        singleValue: "",
        recordDate: "",
        recordTime: "",
        notes: "",
        isRecording: false,
        voiceResult: "",
        extractedTags: []
      };
    },
    computed: {
      currentMetric() {
        return this.metricTypes[this.selectedMetric];
      }
    },
    onLoad(options) {
      if (options && options.tab === "1") {
        this.tabIndex = 1;
      }
      const d = /* @__PURE__ */ new Date();
      this.recordDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      this.recordTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    },
    methods: {
      toggleRecording() {
        this.isRecording = !this.isRecording;
        if (this.isRecording) {
          this.voiceResult = "";
          this.extractedTags = [];
          setTimeout(() => {
            this.isRecording = false;
            this.voiceResult = "今天早上量了血压，收缩压145，舒张压92，心率72次，感觉有点头晕";
            this.extractedTags = [
              { icon: "💓", label: "血压: 145/92 mmHg", type: "normal" },
              { icon: "❤", label: "心率: 72 次/分", type: "normal" },
              { icon: "⚠", label: "症状: 头晕", type: "danger" }
            ];
          }, 3e3);
        }
      },
      onSubmit() {
        uni.showToast({ title: "提交成功", icon: "success" });
      },
      onVoiceSubmit() {
        if (!this.voiceResult)
          return;
        uni.showToast({ title: "已确认录入", icon: "success" });
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
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
          vue.createElementVNode("text", { class: "sec-label" }, "选择指标类型"),
          vue.createElementVNode("view", { class: "metric-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.metricTypes, (m, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i,
                  class: vue.normalizeClass(["metric-opt", { active: $data.selectedMetric === i }]),
                  onClick: ($event) => $data.selectedMetric = i
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "mt-icon" },
                    vue.toDisplayString(m.icon),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "mt-name" },
                    vue.toDisplayString(m.name),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "form-area" }, [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "数值"),
              $options.currentMetric.dual ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "dual-input"
              }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "number",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.bpHigh = $event),
                  placeholder: $options.currentMetric.ph1,
                  class: "input-field"
                }, null, 8, ["placeholder"]), [
                  [vue.vModelText, $data.bpHigh]
                ]),
                vue.createElementVNode("text", { class: "separator" }, "/"),
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "number",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.bpLow = $event),
                  placeholder: $options.currentMetric.ph2,
                  class: "input-field"
                }, null, 8, ["placeholder"]), [
                  [vue.vModelText, $data.bpLow]
                ])
              ])) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                type: "digit",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.singleValue = $event),
                placeholder: "请输入" + $options.currentMetric.name,
                class: "input-field"
              }, null, 8, ["placeholder"])), [
                [vue.vModelText, $data.singleValue]
              ]),
              vue.createElementVNode(
                "text",
                { class: "unit-hint" },
                "单位：" + vue.toDisplayString($options.currentMetric.unit),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("text", { class: "input-label" }, "测量时间"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.recordDate,
                onChange: _cache[4] || (_cache[4] = ($event) => $data.recordDate = $event.detail.value)
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
                onChange: _cache[5] || (_cache[5] = ($event) => $data.recordTime = $event.detail.value),
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
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.notes = $event),
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
              onClick: _cache[7] || (_cache[7] = (...args) => $options.onSubmit && $options.onSubmit(...args))
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
                onClick: _cache[8] || (_cache[8] = (...args) => $options.toggleRecording && $options.toggleRecording(...args))
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
              vue.toDisplayString($data.isRecording ? "正在录音..." : "点击按钮开始语音记录"),
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
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "voice-result-card" }, [
            vue.createElementVNode("text", { class: "vr-label" }, "🔊 识别结果"),
            $data.voiceResult ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "vr-text"
              },
              '"' + vue.toDisplayString($data.voiceResult) + '"',
              1
              /* TEXT */
            )) : (vue.openBlock(), vue.createElementBlock("text", {
              key: 1,
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
                      class: vue.normalizeClass(["ext-tag", t.type])
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
              class: vue.normalizeClass(["btn-submit voice-submit", { disabled: !$data.voiceResult }]),
              onClick: _cache[9] || (_cache[9] = (...args) => $options.onVoiceSubmit && $options.onVoiceSubmit(...args))
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
  const PagesHealthInputHealthInput = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-5e69f1fd"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/health-input/health-input.vue"]]);
  const _sfc_main$e = {
    components: { CustomNavbar },
    data() {
      return {
        metricTypes: [
          { id: "bp", name: "血压" },
          { id: "hr", name: "心率" },
          { id: "glu", name: "血糖" },
          { id: "temp", name: "体温" },
          { id: "sleep", name: "睡眠" },
          { id: "breath", name: "呼吸" },
          { id: "weight", name: "体重" }
        ],
        selectedMetric: "bp",
        timeRanges: [
          { id: 7, name: "7天" },
          { id: 14, name: "14天" },
          { id: 30, name: "30天" }
        ],
        selectedRange: 7,
        canvasWidth: 320,
        canvasHeight: 200,
        allData: {
          bp: {
            refText: "收缩压90-140 mmHg，舒张压60-90 mmHg",
            stats: { avg: "132/84", max: "145/92", min: "118/72" },
            analysis: "近7天血压呈小幅波动趋势，建议保持规律作息，低盐饮食，适度运动。如持续偏高请及时就医。",
            data7: [128, 135, 130, 142, 132, 138, 145],
            data14: [122, 130, 126, 134, 128, 135, 130, 125, 138, 132, 142, 132, 138, 145],
            data30: [120, 125, 130, 128, 132, 126, 134, 130, 128, 135, 132, 130, 138, 125, 128, 140, 135, 130, 126, 132, 128, 135, 130, 125, 138, 132, 142, 132, 138, 145],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 140,
            warnLow: 90
          },
          hr: {
            refText: "静息心率60-100 次/分",
            stats: { avg: "72", max: "88", min: "62" },
            analysis: "心率整体平稳，偶有运动后升高属于正常现象。",
            data7: [68, 72, 65, 78, 70, 88, 72],
            data14: [70, 68, 72, 65, 78, 70, 68, 72, 74, 80, 70, 78, 88, 72],
            data30: [72, 68, 70, 65, 74, 68, 72, 70, 75, 68, 72, 66, 78, 70, 72, 68, 74, 70, 72, 68, 70, 68, 72, 74, 80, 70, 78, 70, 88, 72],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 100,
            warnLow: 60
          },
          glu: {
            refText: "空腹血糖3.9-6.1 mmol/L",
            stats: { avg: "5.6", max: "7.2", min: "4.8" },
            analysis: "血糖偶有偏高，注意控制碳水化合物摄入，规律进餐。",
            data7: [5.2, 5.8, 5.4, 6.5, 5.1, 7.2, 5.6],
            data14: [4.9, 5.2, 5.5, 5.8, 5.4, 5, 6.5, 5.2, 5.8, 5.1, 6, 5.4, 7.2, 5.6],
            data30: [5, 5.2, 4.8, 5.5, 5.3, 5, 5.8, 5.2, 5.4, 5.6, 5.1, 5.3, 6, 5.5, 5.2, 5.8, 5.4, 5, 5.6, 5.3, 5.2, 5.5, 5.8, 5.1, 6, 5.4, 6.5, 5.4, 7.2, 5.6],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 6.1,
            warnLow: 3.9
          },
          temp: {
            refText: "正常体温36.0-37.2 °C",
            stats: { avg: "36.5", max: "37.0", min: "36.1" },
            analysis: "体温在正常范围内波动，无异常情况。",
            data7: [36.3, 36.5, 36.4, 36.8, 36.2, 37, 36.5],
            data14: [36.2, 36.3, 36.5, 36.4, 36.6, 36.3, 36.8, 36.2, 36.5, 36.4, 36.6, 36.2, 37, 36.5],
            data30: [36.3, 36.2, 36.4, 36.5, 36.3, 36.4, 36.6, 36.3, 36.5, 36.2, 36.4, 36.5, 36.3, 36.6, 36.2, 36.5, 36.4, 36.3, 36.6, 36.2, 36.5, 36.3, 36.5, 36.4, 36.6, 36.2, 36.8, 36.4, 37, 36.5],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 37.2,
            warnLow: 36
          },
          sleep: {
            refText: "建议睡眠时长7-9小时",
            stats: { avg: "6.8", max: "8.5", min: "5.0" },
            analysis: "部分天数睡眠时长不足，建议固定作息时间，减少睡前使用电子设备。",
            data7: [6.5, 7, 5.5, 8, 6, 8.5, 7],
            data14: [7, 6.5, 7.5, 5, 6, 7, 6.5, 8, 5.5, 7, 6, 8, 8.5, 7],
            data30: [7, 6.5, 7.5, 5.5, 6, 7, 8, 6.5, 7.5, 5, 6.5, 7, 7.5, 6, 7, 8, 5.5, 7, 6.5, 7.5, 6, 7, 6.5, 8, 5.5, 7, 6, 8, 8.5, 7],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 9,
            warnLow: 7
          },
          breath: {
            refText: "正常呼吸频率12-20 次/分",
            stats: { avg: "16", max: "19", min: "14" },
            analysis: "呼吸频率在正常范围内，无需担忧。",
            data7: [16, 15, 17, 14, 18, 19, 16],
            data14: [15, 16, 14, 17, 16, 15, 18, 14, 16, 17, 15, 18, 19, 16],
            data30: [16, 15, 14, 17, 16, 15, 18, 16, 14, 15, 17, 16, 15, 14, 16, 18, 15, 16, 17, 14, 16, 15, 16, 14, 17, 15, 18, 15, 19, 16],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 20,
            warnLow: 12
          },
          weight: {
            refText: "根据BMI维持健康体重",
            stats: { avg: "68.2", max: "69.0", min: "67.5" },
            analysis: "体重波动较小，维持良好。建议继续保持当前饮食和运动习惯。",
            data7: [68, 68.5, 67.8, 68.2, 67.5, 69, 68.2],
            data14: [68.5, 68, 68.3, 67.8, 68, 68.5, 67.8, 68.2, 68, 67.5, 68.5, 68.2, 69, 68.2],
            data30: [69, 68.5, 68.8, 68, 68.3, 68.5, 67.8, 68, 68.5, 67.8, 68.2, 68, 68.5, 68.3, 68, 67.8, 68.5, 68, 68.2, 68.3, 67.8, 68.5, 68, 68.3, 68, 67.5, 68.5, 68.2, 69, 68.2],
            labels7: ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"],
            warnHigh: 999,
            warnLow: 0
          }
        }
      };
    },
    computed: {
      currentMetricData() {
        return this.allData[this.selectedMetric] || this.allData.bp;
      },
      chartData() {
        const d = this.currentMetricData;
        if (this.selectedRange === 7)
          return d.data7;
        if (this.selectedRange === 14)
          return d.data14;
        return d.data30;
      }
    },
    mounted() {
      const info = uni.getSystemInfoSync();
      this.canvasWidth = info.windowWidth - 64;
      this.canvasHeight = 200;
      this.$nextTick(() => {
        this.drawChart();
      });
    },
    methods: {
      selectMetric(id) {
        this.selectedMetric = id;
        this.$nextTick(() => this.drawChart());
      },
      selectRange(id) {
        this.selectedRange = id;
        this.$nextTick(() => this.drawChart());
      },
      drawChart() {
        const ctx = uni.createCanvasContext("trendChart", this);
        const w = this.canvasWidth;
        const h = this.canvasHeight;
        const data = this.chartData;
        if (!data || data.length === 0)
          return;
        const padTop = 25, padBottom = 30, padLeft = 40, padRight = 15;
        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const yMin = min - range * 0.15;
        const yMax = max + range * 0.15;
        const yRange = yMax - yMin;
        ctx.clearRect(0, 0, w, h);
        const md = this.currentMetricData;
        if (md.warnHigh < 999) {
          const warnY = padTop + chartH * (1 - (md.warnHigh - yMin) / yRange);
          if (warnY > padTop && warnY < h - padBottom) {
            ctx.setStrokeStyle("rgba(239,68,68,0.3)");
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(padLeft, warnY);
            ctx.lineTo(w - padRight, warnY);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
        ctx.setFontSize(10);
        ctx.setFillStyle("#86909C");
        const ySteps = 4;
        for (let i = 0; i <= ySteps; i++) {
          const val = yMin + yRange / ySteps * i;
          const y = padTop + chartH * (1 - i / ySteps);
          ctx.fillText(val.toFixed(Number.isInteger(val) ? 0 : 1), 2, y + 3);
          ctx.setStrokeStyle("#f0f0f0");
          ctx.beginPath();
          ctx.moveTo(padLeft, y);
          ctx.lineTo(w - padRight, y);
          ctx.stroke();
        }
        const step = chartW / (data.length - 1 || 1);
        const showEvery = data.length <= 7 ? 1 : data.length <= 14 ? 2 : 5;
        for (let i = 0; i < data.length; i++) {
          if (i % showEvery === 0 || i === data.length - 1) {
            const x = padLeft + i * step;
            let label = "";
            if (data.length <= 7 && md.labels7 && md.labels7[i]) {
              label = md.labels7[i];
            } else {
              label = "" + (i + 1);
            }
            ctx.setFillStyle("#86909C");
            ctx.setFontSize(9);
            ctx.fillText(label, x - 10, h - 8);
          }
        }
        const grd = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
        grd.addColorStop(0, "rgba(74,144,217,0.25)");
        grd.addColorStop(1, "rgba(74,144,217,0)");
        ctx.beginPath();
        ctx.moveTo(padLeft, h - padBottom);
        for (let i = 0; i < data.length; i++) {
          const x = padLeft + i * step;
          const y = padTop + chartH * (1 - (data[i] - yMin) / yRange);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(padLeft + (data.length - 1) * step, h - padBottom);
        ctx.closePath();
        ctx.setFillStyle(grd);
        ctx.fill();
        ctx.setStrokeStyle("#4A90D9");
        ctx.setLineWidth(2);
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          const x = padLeft + i * step;
          const y = padTop + chartH * (1 - (data[i] - yMin) / yRange);
          if (i === 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        for (let i = 0; i < data.length; i++) {
          const x = padLeft + i * step;
          const y = padTop + chartH * (1 - (data[i] - yMin) / yRange);
          const isWarn = data[i] > md.warnHigh || data[i] < md.warnLow;
          ctx.setFillStyle("#fff");
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.setStrokeStyle(isWarn ? "#EF4444" : "#4A90D9");
          ctx.setLineWidth(2);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.stroke();
          if (isWarn) {
            ctx.setFillStyle(isWarn ? "#EF4444" : "#4A90D9");
            ctx.setFontSize(9);
            ctx.fillText(data[i].toString(), x - 8, y - 8);
          }
        }
        ctx.draw();
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, { title: "指标趋势" }),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("scroll-view", {
          "scroll-x": "",
          class: "metric-scroll",
          "show-scrollbar": false
        }, [
          vue.createElementVNode("view", { class: "metric-pills" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.metricTypes, (m, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i,
                  class: vue.normalizeClass(["pill", { active: $data.selectedMetric === m.id }]),
                  onClick: ($event) => $options.selectMetric(m.id)
                }, vue.toDisplayString(m.name), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "time-range" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.timeRanges, (t, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: vue.normalizeClass(["time-btn", { active: $data.selectedRange === t.id }]),
                onClick: ($event) => $options.selectRange(t.id)
              }, vue.toDisplayString(t.name), 11, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "chart-area" }, [
          vue.createElementVNode(
            "canvas",
            {
              "canvas-id": "trendChart",
              id: "trendChart",
              class: "trend-canvas",
              style: vue.normalizeStyle({ width: $data.canvasWidth + "px", height: $data.canvasHeight + "px" })
            },
            null,
            4
            /* STYLE */
          )
        ]),
        vue.createElementVNode("view", { class: "ref-box" }, [
          vue.createElementVNode("text", { class: "ref-title" }, "参考范围"),
          vue.createElementVNode(
            "text",
            { class: "ref-text" },
            vue.toDisplayString($options.currentMetricData.refText),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "stats-row" }, [
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($options.currentMetricData.stats.avg),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "平均值")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($options.currentMetricData.stats.max),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "最高值")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($options.currentMetricData.stats.min),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "最低值")
          ])
        ]),
        vue.createElementVNode("view", { class: "trend-card" }, [
          vue.createElementVNode("text", { class: "trend-title" }, "趋势分析"),
          vue.createElementVNode(
            "text",
            { class: "trend-text" },
            vue.toDisplayString($options.currentMetricData.analysis),
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const PagesHealthTrendHealthTrend = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-067ba3e8"], ["__file", "E:/Javaproject/Smart health M/Smart_Health_Ms_Head/pages/health-trend/health-trend.vue"]]);
  const _sfc_main$d = {
    components: { CustomNavbar, TabSwitch },
    data() {
      return {
        tabIndex: 0,
        dietAdvice: [
          { icon: "🥗", color: "#E8F5E9", title: "低盐饮食", desc: "每日食盐摄入控制在6克以内，有助于控制血压。", tags: ["控盐", "清淡"] },
          { icon: "🥦", color: "#E3F2FD", title: "增加蔬果", desc: "多吃富含钾的蔬菜水果，如香蕉、菠菜等。", tags: ["钾元素", "膳食纤维"] },
          { icon: "🚫", color: "#FFF3E0", title: "减少腌制食品", desc: "避免腊肉、咸菜等高钠食物。", tags: ["低钠"] }
        ],
        exerciseAdvice: [
          { icon: "🚶", color: "#E8F5E9", title: "每日步行", desc: "建议每日步行30分钟，中等强度为宜。", tags: ["有氧", "轻度"] },
          { icon: "🧘", color: "#F3E5F5", title: "放松训练", desc: "可尝试深呼吸、太极等，帮助稳定血压。", tags: ["减压"] }
        ],
        lifeAdvice: [
          { icon: "😴", color: "#E3F2FD", title: "规律作息", desc: "保持7-8小时睡眠，避免熬夜。", tags: ["睡眠"] },
          { icon: "🚭", color: "#FFEBEE", title: "戒烟限酒", desc: "吸烟饮酒会影响血压控制，建议戒除或限制。", tags: ["健康习惯"] }
        ],
        medicalAdvice: [
          { icon: "📋", color: "#FFF8E1", title: "定期复诊", desc: "血压偏高时建议每2-4周复诊一次，遵医嘱用药。", tags: ["复诊"] },
          { icon: "💊", color: "#E8EAF6", title: "规范用药", desc: "如已服用降压药，请按时规律服药，勿自行停药。", tags: ["用药"] }
        ]
      };
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CustomNavbar = vue.resolveComponent("CustomNavbar");
    const _component_TabSwitch = vue.resolveComponent("TabSwitch");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-wrapper" }, [
      vue.createVNode(_component_CustomNavbar, { title: "健康建议" }),
      vue.createElementVNode("view", { class: "header-area" }, [
        vue.createElementVNode("text", { class: "header-icon" }, "💡"),
        vue.createElementVNode("text", { class: "header-desc" }, "基于您的健康数据，为您提供个性化建议")
      ]),
      vue.createVNode(_component_TabSwitch, {
        tabs: ["饮食", "运动", "生活", "就医"],
        modelValue: $data.tabIndex,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.tabIndex = $event)
      }, null, 8, ["modelValue"]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "warning-card" }, [
          vue.createElementVNode("text", { class: "warning-title" }, "⚠ 异常指标提醒"),
          vue.createElementVNode("text", { class: "warning-text" }, "您的血压近期偏高，建议减少盐分摄入并规律监测。")
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "advice-list" },
          [
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
        historyList: [
          {
            id: "1",
            title: "血压偏高咨询",
            mode: "chat",
            modeText: "智能问答",
            summary: "咨询了关于血压偏高的注意事项和测量频率建议",
            time: "03-09 14:30",
            count: 6
          },
          {
            id: "2",
            title: "血糖管理建议",
            mode: "chat",
            modeText: "智能问答",
            summary: "询问了日常饮食和运动对血糖的影响",
            time: "03-08 09:15",
            count: 8
          },
          {
            id: "3",
            title: "心血管风险评估",
            mode: "inquiry",
            modeText: "AI问诊",
            summary: "完成5步主动问诊，AI给出风险评估",
            time: "03-07 16:20",
            count: 12
          },
          {
            id: "4",
            title: "睡眠质量咨询",
            mode: "chat",
            modeText: "智能问答",
            summary: "咨询了改善睡眠的方法和作息建议",
            time: "03-06 21:00",
            count: 4
          },
          {
            id: "5",
            title: "头痛症状问诊",
            mode: "inquiry",
            modeText: "AI问诊",
            summary: "通过AI问诊排查头痛可能原因",
            time: "03-05 10:45",
            count: 10
          }
        ]
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
        pageTitle: "血压偏高咨询",
        modeLabel: "问答模式",
        chatReplay: [
          { role: "user", content: "我最近血压偏高，需要注意什么？" },
          {
            role: "ai",
            content: "您好，血压偏高建议先从生活方式调整入手：\n1. 低盐饮食，每日盐摄入控制在6克以内；\n2. 适量运动，如快走、游泳；\n3. 保持情绪稳定，避免熬夜；\n4. 定期监测血压。若持续偏高，建议就医评估是否需要用药。"
          },
          { role: "user", content: "每天测量几次比较合适？" },
          {
            role: "ai",
            content: "一般建议早晚各测一次：早晨起床后、排空膀胱后、服药前测量；晚上睡前测量。每次测2-3遍取平均值，记录便于医生参考。"
          }
        ]
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
        vue.createElementVNode("view", { class: "summary-card" }, [
          vue.createElementVNode("text", { class: "summary-title" }, "AI总结"),
          vue.createElementVNode("view", { class: "summary-list" }, [
            vue.createElementVNode("text", { class: "summary-item" }, "• 建议低盐饮食，每日盐摄入控制在6克以内"),
            vue.createElementVNode("text", { class: "summary-item" }, "• 适量运动，如快走、游泳"),
            vue.createElementVNode("text", { class: "summary-item" }, "• 保持情绪稳定，避免熬夜"),
            vue.createElementVNode("text", { class: "summary-item" }, "• 早晚各测一次血压，记录便于医生参考")
          ])
        ]),
        vue.createElementVNode("view", { class: "replay-section" }, [
          vue.createElementVNode("view", { class: "time-marker" }, [
            vue.createElementVNode("text", null, "03-09 14:30")
          ]),
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
          ))
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
          {
            icon: "🏃",
            title: "运动计划",
            desc: "每日运动30分钟，有氧+无氧结合",
            progress: 65,
            bgColor: "#E8F5E9",
            barColor: "#34C759",
            tagBg: "#E8F5E9",
            tagColor: "#34C759",
            tags: ["晨跑", "太极拳", "散步"],
            url: "/pages/plan-exercise/plan-exercise"
          },
          {
            icon: "🥗",
            title: "饮食计划",
            desc: "均衡营养，低盐低脂饮食",
            progress: 50,
            bgColor: "#FFF3E0",
            barColor: "#FF9500",
            tagBg: "#FFF3E0",
            tagColor: "#FF9500",
            tags: ["低盐", "高蛋白", "粗粮"],
            url: "/pages/plan-diet/plan-diet"
          },
          {
            icon: "💊",
            title: "用药计划",
            desc: "按时服药，定期复查",
            progress: 80,
            bgColor: "#FFEBEE",
            barColor: "#EF4444",
            tagBg: "#FFEBEE",
            tagColor: "#EF4444",
            tags: ["降压药", "降糖药", "维生素"],
            url: "/pages/plan-medication/plan-medication"
          },
          {
            icon: "🏥",
            title: "复查计划",
            desc: "定期体检，跟踪健康指标变化",
            progress: 30,
            bgColor: "#E3F2FD",
            barColor: "#4A90D9",
            tagBg: "#E3F2FD",
            tagColor: "#4A90D9",
            tags: ["血常规", "心电图", "肝功能"],
            url: "/pages/plan-checkup/plan-checkup"
          }
        ]
      };
    },
    methods: {
      goDetail(url) {
        uni.navigateTo({ url });
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
  function emptyShort() {
    return { name: "", frequency: "", contraindication: "", dosage: "", date: "", onTime: "", sideEffect: "", doctor: "", remark: "" };
  }
  function emptyLong() {
    return { name: "", purpose: "", contraindication: "", frequency: "", dosage: "", date: "", onTime: "", sideEffect: "", doctor: "", followUpNote: "" };
  }
  const _sfc_main$9 = {
    components: { CustomNavbar },
    data() {
      return {
        tabIdx: 0,
        tabList: ["用药人档案", "短期用药记录", "慢性病长期用药"],
        genderList: ["男", "女"],
        editMode: false,
        profile: {
          name: "张三",
          gender: "男",
          age: "72",
          drugAllergy: "青霉素",
          otherAllergy: "无",
          chronicDisease: "高血压、2型糖尿病",
          majorHistory: "2018年心脏支架手术",
          longTermMeds: "氨氯地平 5mg/日、二甲双胍 500mg×2/日",
          emergencyContact: "张小明 138-0000-1234"
        },
        shortTermMeds: [emptyShort(), emptyShort(), emptyShort()],
        longTermMeds: [emptyLong(), emptyLong(), emptyLong()]
      };
    },
    methods: {
      onGenderChange(e) {
        this.profile.gender = this.genderList[e.detail.value];
      },
      saveProfile() {
        this.editMode = false;
        uni.showToast({ title: "档案已保存", icon: "success" });
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
      submitShort() {
        uni.showToast({ title: "短期记录已提交", icon: "success" });
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
      submitLong() {
        uni.showToast({ title: "慢性病记录已提交", icon: "success" });
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
              onClick: ($event) => $data.tabIdx = i
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
                disabled: !$data.editMode
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
                disabled: !$data.editMode
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
                disabled: !$data.editMode
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
                disabled: !$data.editMode
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
                disabled: !$data.editMode
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.longTermMeds]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("text", { class: "form-label" }, "紧急联系人"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "form-input",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.profile.emergencyContact = $event),
                placeholder: "姓名 + 电话",
                disabled: !$data.editMode
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.profile.emergencyContact]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "btn-group" }, [
            !$data.editMode ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "btn-primary",
              onClick: _cache[9] || (_cache[9] = ($event) => $data.editMode = true)
            }, [
              vue.createElementVNode("text", null, "✏️ 编辑档案")
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "btn-primary",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.saveProfile && $options.saveProfile(...args))
            }, [
              vue.createElementVNode("text", null, "💾 保存档案")
            ]))
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.tabIdx === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "tab-content"
        }, [
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
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "医嘱频次"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.frequency = $event,
                    placeholder: "如：每日3次"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.frequency]
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
                  vue.createElementVNode("text", { class: "field-label" }, "用药日期"),
                  vue.createElementVNode("picker", {
                    mode: "date",
                    onChange: (e) => item.date = e.detail.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.date || "选择日期"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["onChange"])
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
            onClick: _cache[11] || (_cache[11] = (...args) => $options.addShort && $options.addShort(...args))
          }, [
            vue.createElementVNode("text", null, "+ 添加药品")
          ]),
          vue.createElementVNode("view", { class: "btn-group" }, [
            vue.createElementVNode("view", {
              class: "btn-primary",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.submitShort && $options.submitShort(...args))
            }, [
              vue.createElementVNode("text", null, "📤 提交短期用药记录")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.tabIdx === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "tab-content"
        }, [
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
                vue.createElementVNode("view", { class: "field-row" }, [
                  vue.createElementVNode("text", { class: "field-label" }, "医嘱频次"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "field-input",
                    "onUpdate:modelValue": ($event) => item.frequency = $event,
                    placeholder: "如：每日2次"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.frequency]
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
                  vue.createElementVNode("text", { class: "field-label" }, "用药日期"),
                  vue.createElementVNode("picker", {
                    mode: "date",
                    onChange: (e) => item.date = e.detail.value
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "field-input picker-val" },
                      vue.toDisplayString(item.date || "选择日期"),
                      1
                      /* TEXT */
                    )
                  ], 40, ["onChange"])
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
            onClick: _cache[13] || (_cache[13] = (...args) => $options.addLong && $options.addLong(...args))
          }, [
            vue.createElementVNode("text", null, "+ 添加药品")
          ]),
          vue.createElementVNode("view", { class: "btn-group" }, [
            vue.createElementVNode("view", {
              class: "btn-primary",
              onClick: _cache[14] || (_cache[14] = (...args) => $options.submitLong && $options.submitLong(...args))
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
        drugName: "阿司匹林肠溶片",
        drugDosage: "每次100mg",
        infoRows: [
          { label: "药品类型", value: "抗血小板药" },
          { label: "用药频次", value: "每日两次" },
          { label: "每次剂量", value: "100mg" },
          { label: "开始日期", value: "2024-01-15" },
          { label: "处方医生", value: "张医生" },
          { label: "购买方式", value: "医院处方" }
        ],
        reminders: [
          { time: "08:00", desc: "早餐后", enabled: true },
          { time: "20:00", desc: "晚餐后", enabled: true }
        ],
        historyList: [
          { date: "03-08", time: "08:05", status: "taken" },
          { date: "03-08", time: "20:12", status: "taken" },
          { date: "03-07", time: "08:00", status: "taken" },
          { date: "03-07", time: "20:00", status: "missed" },
          { date: "03-06", time: "08:10", status: "taken" }
        ]
      };
    },
    methods: {
      onEdit() {
        uni.showToast({ title: "编辑", icon: "none" });
      },
      toggleReminder(idx) {
        this.reminders[idx].enabled = !this.reminders[idx].enabled;
      },
      onStopMedication() {
        uni.showModal({
          title: "确认",
          content: "确定要停止服用该药物吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "已停止用药", icon: "success" });
              setTimeout(() => uni.navigateBack(), 1e3);
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
        title: $data.drugName,
        "show-back": true
      }, {
        right: vue.withCtx(() => [
          vue.createElementVNode("text", {
            class: "nav-edit",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.onEdit && $options.onEdit(...args))
          }, "编辑")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["title"]),
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
          { class: "drug-dosage" },
          vue.toDisplayString($data.drugDosage),
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
                  { class: "info-value" },
                  vue.toDisplayString(row.value),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "reminder-card" }, [
          vue.createElementVNode("text", { class: "card-title" }, "服药提醒"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.reminders, (r, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "reminder-row"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "reminder-time" },
                  vue.toDisplayString(r.time),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "reminder-desc" },
                  vue.toDisplayString(r.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("switch", {
                  checked: r.enabled,
                  onChange: ($event) => $options.toggleReminder(i),
                  color: "#4A90D9"
                }, null, 40, ["checked", "onChange"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "history-card" }, [
          vue.createElementVNode("text", { class: "card-title" }, "近期用药记录"),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.historyList, (h, i) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: i,
                class: "history-row"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "history-date" },
                  vue.toDisplayString(h.date),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "history-time" },
                  vue.toDisplayString(h.time),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["history-status", h.status === "taken" ? "taken" : "missed"])
                  },
                  vue.toDisplayString(h.status === "taken" ? "已服用" : "漏服"),
                  3
                  /* TEXT, CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", {
          class: "stop-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.onStopMedication && $options.onStopMedication(...args))
        }, [
          vue.createElementVNode("text", null, "停止用药")
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
          hasTask: [1, 3, 5, 7, 10, 15, 20].indexOf(i) >= 0
        });
      }
      return {
        selectedDay: todayStr,
        calendarDays: days,
        currentMonth: `${y}年${m + 1}月`,
        selectedDayTasks: [
          { title: "晨跑30分钟", time: "08:00", status: "done" },
          { title: "服用降压药", time: "09:00", status: "done" },
          { title: "测量血压", time: "14:00", status: "missed" }
        ]
      };
    },
    methods: {
      selectDay(d) {
        this.selectedDay = d.date;
        this.selectedDayTasks = [
          { title: "晨跑30分钟", time: "08:00", status: "done" },
          { title: "服用降压药", time: "09:00", status: "done" },
          { title: "测量血压", time: "14:00", status: d.day % 3 === 0 ? "done" : "missed" }
        ];
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
            vue.createElementVNode("text", { class: "stat-value" }, "82%"),
            vue.createElementVNode("text", { class: "stat-label" }, "完成率")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("text", { class: "stat-value" }, "7"),
            vue.createElementVNode("text", { class: "stat-label" }, "连续打卡")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("text", { class: "stat-value" }, "156"),
            vue.createElementVNode("text", { class: "stat-label" }, "总任务")
          ])
        ]),
        vue.createElementVNode("view", { class: "day-tasks" }, [
          vue.createElementVNode("text", { class: "day-tasks-title" }, "选中日期任务"),
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
        form: {
          name: "张老先生",
          gender: "男",
          birthDate: "1950-01-15",
          height: "168",
          weight: "65",
          phone: "13800138000",
          email: "",
          address: "",
          emergencyName: "",
          emergencyRel: "",
          emergencyPhone: ""
        }
      };
    },
    methods: {
      chooseAvatar() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            uni.showToast({ title: "已选择头像", icon: "none" });
          }
        });
      },
      onBirthChange(e) {
        this.form.birthDate = e.detail.value;
      },
      onSave() {
        uni.showToast({ title: "保存成功", icon: "success" });
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
            vue.createElementVNode("text", { class: "avatar-icon" }, "📷"),
            vue.createElementVNode("text", { class: "avatar-hint" }, "点击更换头像")
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "基本信息"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "姓名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.name = $event),
                placeholder: "请输入姓名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.name]
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
              value: $data.form.birthDate,
              onChange: _cache[3] || (_cache[3] = (...args) => $options.onBirthChange && $options.onBirthChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker-value" },
                vue.toDisplayString($data.form.birthDate || "请选择日期"),
                1
                /* TEXT */
              )
            ], 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "身高"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "digit",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.height = $event),
                placeholder: "cm"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.height]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "体重"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "digit",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.form.weight = $event),
                placeholder: "kg"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.weight]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "联系方式"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "手机号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.phone = $event),
                placeholder: "请输入手机号"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.phone]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "邮箱"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "text",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.form.email = $event),
                placeholder: "请输入邮箱"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.email]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "地址"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.form.address = $event),
                placeholder: "请输入地址"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.address]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "紧急联系人"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "姓名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.form.emergencyName = $event),
                placeholder: "请输入联系人姓名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.emergencyName]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "关系"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.form.emergencyRel = $event),
                placeholder: "如：子女、配偶"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.emergencyRel]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "电话"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.form.emergencyPhone = $event),
                placeholder: "请输入联系电话"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.emergencyPhone]
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
        aerobicPct: 65,
        totalCalories: 2350,
        weekPlan: [
          {
            name: "周一",
            date: "3/3",
            isToday: false,
            exercises: [
              { name: "晨跑", duration: "30分钟", intensity: "5km · 中等", isAerobic: true },
              { name: "拉伸", duration: "15分钟", intensity: "低强度", isAerobic: true }
            ]
          },
          {
            name: "周二",
            date: "3/4",
            isToday: false,
            exercises: [
              { name: "哑铃训练", duration: "40分钟", intensity: "中等强度", isAerobic: false },
              { name: "平板支撑", duration: "10分钟", intensity: "高强度", isAerobic: false }
            ]
          },
          {
            name: "周三",
            date: "3/5",
            isToday: false,
            exercises: [
              { name: "太极拳", duration: "45分钟", intensity: "低强度", isAerobic: true },
              { name: "散步", duration: "30分钟", intensity: "2km · 低强度", isAerobic: true }
            ]
          },
          {
            name: "周四",
            date: "3/6",
            isToday: false,
            exercises: [
              { name: "游泳", duration: "40分钟", intensity: "1km · 中等", isAerobic: true }
            ]
          },
          {
            name: "周五",
            date: "3/7",
            isToday: false,
            exercises: [
              { name: "弹力带训练", duration: "30分钟", intensity: "中等强度", isAerobic: false },
              { name: "瑜伽", duration: "30分钟", intensity: "低强度", isAerobic: true }
            ]
          },
          {
            name: "周六",
            date: "3/8",
            isToday: false,
            exercises: []
          },
          {
            name: "周日",
            date: "3/9",
            isToday: true,
            exercises: [
              { name: "快走", duration: "40分钟", intensity: "4km · 中等", isAerobic: true },
              { name: "八段锦", duration: "20分钟", intensity: "低强度", isAerobic: true }
            ]
          }
        ]
      };
    },
    computed: {
      ringAerobicStyle() {
        const deg = this.aerobicPct / 100 * 360;
        return {
          background: `conic-gradient(#34C759 0deg ${deg}deg, #FF9500 ${deg}deg 360deg)`
        };
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
        vue.createElementVNode("text", { class: "section-title" }, "本周运动安排"),
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
    data() {
      return {
        dailyTarget: 2e3,
        consumed: 1650,
        editMode: false,
        weekMeals: [
          {
            name: "周一",
            date: "3/3",
            isToday: false,
            meals: [
              { type: "早餐", calories: 380, foods: ["燕麦粥", "鸡蛋", "牛奶"] },
              { type: "午餐", calories: 550, foods: ["糙米饭", "清蒸鱼", "时蔬"] },
              { type: "晚餐", calories: 420, foods: ["杂粮粥", "凉拌菜", "豆腐"] }
            ]
          },
          {
            name: "周二",
            date: "3/4",
            isToday: false,
            meals: [
              { type: "早餐", calories: 350, foods: ["全麦面包", "酸奶", "苹果"] },
              { type: "午餐", calories: 520, foods: ["荞麦面", "鸡胸肉", "西兰花"] },
              { type: "晚餐", calories: 400, foods: ["小米粥", "蒸南瓜", "青菜"] }
            ]
          },
          {
            name: "周三",
            date: "3/5",
            isToday: false,
            meals: [
              { type: "早餐", calories: 360, foods: ["紫薯", "豆浆", "坚果"] },
              { type: "午餐", calories: 530, foods: ["米饭", "番茄牛腩", "菠菜"] },
              { type: "晚餐", calories: 380, foods: ["玉米粥", "清炒虾仁", "黄瓜"] }
            ]
          },
          {
            name: "周四",
            date: "3/6",
            isToday: false,
            meals: [
              { type: "早餐", calories: 370, foods: ["燕麦", "蓝莓", "核桃"] },
              { type: "午餐", calories: 540, foods: ["糙米", "白切鸡", "油菜"] },
              { type: "晚餐", calories: 410, foods: ["红薯", "清蒸鲈鱼", "豆芽"] }
            ]
          },
          {
            name: "周五",
            date: "3/7",
            isToday: false,
            meals: [
              { type: "早餐", calories: 340, foods: ["鸡蛋饼", "牛奶", "香蕉"] },
              { type: "午餐", calories: 560, foods: ["面条", "红烧排骨", "芹菜"] },
              { type: "晚餐", calories: 390, foods: ["杂粮饭", "蒸蛋", "木耳"] }
            ]
          },
          {
            name: "周六",
            date: "3/8",
            isToday: false,
            meals: [
              { type: "早餐", calories: 400, foods: ["包子", "豆浆", "小菜"] },
              { type: "午餐", calories: 500, foods: ["饺子", "紫菜蛋汤"] },
              { type: "晚餐", calories: 380, foods: ["粥", "咸鸭蛋", "青菜"] }
            ]
          },
          {
            name: "周日",
            date: "3/9",
            isToday: true,
            meals: [
              { type: "早餐", calories: 380, foods: ["燕麦粥", "鸡蛋", "橙子"] },
              { type: "午餐", calories: 550, foods: ["米饭", "蒸鱼", "丝瓜"] },
              { type: "晚餐", calories: 420, foods: ["红豆粥", "凉拌木耳", "豆干"] }
            ]
          }
        ]
      };
    },
    computed: {
      remaining() {
        return Math.max(0, this.dailyTarget - this.consumed);
      },
      intakeRingStyle() {
        const pct = Math.min(100, this.consumed / this.dailyTarget * 100);
        const deg = pct / 100 * 360;
        return {
          background: `conic-gradient(#FF9500 0deg ${deg}deg, #E5E6EB ${deg}deg 360deg)`
        };
      }
    },
    methods: {
      updateFoods(dayIdx, mealIdx, val) {
        this.weekMeals[dayIdx].meals[mealIdx].foods = val.split("、").filter((s) => s.trim());
      },
      saveEdit() {
        this.editMode = false;
        uni.showToast({ title: "已保存", icon: "success" });
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
              vue.createElementVNode("text", { class: "stat-val" }, "1650"),
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
              vue.createElementVNode("text", { class: "stat-val" }, "350"),
              vue.createElementVNode("text", { class: "stat-label" }, "运动消耗(kcal)")
            ])
          ]),
          vue.createElementVNode("view", { class: "nutrient-bars" }, [
            vue.createElementVNode("view", { class: "nut-row" }, [
              vue.createElementVNode("text", { class: "nut-name" }, "碳水"),
              vue.createElementVNode("view", { class: "nut-bar-bg" }, [
                vue.createElementVNode("view", {
                  class: "nut-bar-fill",
                  style: { "width": "62%", "background": "#FF9500" }
                })
              ]),
              vue.createElementVNode("text", { class: "nut-pct" }, "155/250g")
            ]),
            vue.createElementVNode("view", { class: "nut-row" }, [
              vue.createElementVNode("text", { class: "nut-name" }, "蛋白质"),
              vue.createElementVNode("view", { class: "nut-bar-bg" }, [
                vue.createElementVNode("view", {
                  class: "nut-bar-fill",
                  style: { "width": "48%", "background": "#4A90D9" }
                })
              ]),
              vue.createElementVNode("text", { class: "nut-pct" }, "36/75g")
            ]),
            vue.createElementVNode("view", { class: "nut-row" }, [
              vue.createElementVNode("text", { class: "nut-name" }, "脂肪"),
              vue.createElementVNode("view", { class: "nut-bar-bg" }, [
                vue.createElementVNode("view", {
                  class: "nut-bar-fill",
                  style: { "width": "55%", "background": "#EF4444" }
                })
              ]),
              vue.createElementVNode("text", { class: "nut-pct" }, "33/60g")
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
        selectedDay: 6,
        weekDays: [
          { short: "一", date: "3/3" },
          { short: "二", date: "3/4" },
          { short: "三", date: "3/5" },
          { short: "四", date: "3/6" },
          { short: "五", date: "3/7" },
          { short: "六", date: "3/8" },
          { short: "日", date: "3/9" }
        ],
        allMeds: {
          0: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" },
            { time: "12:30", period: "午餐后", name: "阿卡波糖", dosage: "50mg × 1片", status: "done" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" }
          ],
          1: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" },
            { time: "12:30", period: "午餐后", name: "阿卡波糖", dosage: "50mg × 1片", status: "done" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" }
          ],
          2: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" }
          ],
          3: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" },
            { time: "12:30", period: "午餐后", name: "阿卡波糖", dosage: "50mg × 1片", status: "done" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" }
          ],
          4: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" }
          ],
          5: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" },
            { time: "12:30", period: "午餐后", name: "阿卡波糖", dosage: "50mg × 1片", status: "done" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "done" }
          ],
          6: [
            { time: "08:00", period: "早餐后", name: "氨氯地平", dosage: "5mg × 1片", status: "done" },
            { time: "08:00", period: "早餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "pending" },
            { time: "12:30", period: "午餐后", name: "阿卡波糖", dosage: "50mg × 1片", status: "pending" },
            { time: "20:00", period: "晚餐后", name: "二甲双胍", dosage: "500mg × 1片", status: "missed" },
            { time: "21:00", period: "睡前", name: "维生素D", dosage: "400IU × 1粒", status: "pending" }
          ]
        }
      };
    },
    computed: {
      currentMeds() {
        return this.allMeds[this.selectedDay] || [];
      }
    },
    methods: {
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
        records: [
          {
            day: "15",
            month: "3月",
            hospital: "市第一人民医院",
            items: ["血常规", "肝功能", "肾功能"],
            note: "空腹抽血",
            status: "upcoming"
          },
          {
            day: "22",
            month: "3月",
            hospital: "中心医院心内科",
            items: ["心电图", "心脏彩超"],
            note: "携带既往报告",
            status: "upcoming"
          },
          {
            day: "05",
            month: "4月",
            hospital: "市第一人民医院",
            items: ["糖化血红蛋白", "尿常规"],
            note: "",
            status: "upcoming"
          },
          {
            day: "01",
            month: "3月",
            hospital: "社区卫生中心",
            items: ["血压", "血糖"],
            note: "",
            status: "done"
          },
          {
            day: "15",
            month: "2月",
            hospital: "市第一人民医院",
            items: ["血常规", "血脂"],
            note: "",
            status: "done"
          }
        ]
      };
    },
    methods: {
      addRecord() {
        if (!this.newRecord.date || !this.newRecord.hospital || !this.newRecord.itemsStr) {
          uni.showToast({ title: "请填写完整", icon: "none" });
          return;
        }
        const parts = this.newRecord.date.split("-");
        this.records.unshift({
          day: parts[2],
          month: parseInt(parts[1]) + "月",
          hospital: this.newRecord.hospital,
          items: this.newRecord.itemsStr.split("、").filter((s) => s.trim()),
          note: this.newRecord.note,
          status: "upcoming"
        });
        this.showAddModal = false;
        this.newRecord = { date: "", hospital: "", itemsStr: "", note: "" };
        uni.showToast({ title: "已添加", icon: "success" });
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
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/ai-consult/ai-consult", PagesAiConsultAiConsult);
  __definePage("pages/plan-overview/plan-overview", PagesPlanOverviewPlanOverview);
  __definePage("pages/task-today/task-today", PagesTaskTodayTaskToday);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/health-detail/health-detail", PagesHealthDetailHealthDetail);
  __definePage("pages/health-input/health-input", PagesHealthInputHealthInput);
  __definePage("pages/health-trend/health-trend", PagesHealthTrendHealthTrend);
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
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
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
