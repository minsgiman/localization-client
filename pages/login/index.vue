<template>
    <div class="login-cont">
        <div
            class="toggle cont_min"
            style="min-height: 535px; background-color:#ffffff;"
        >
            <div class="wrap_login" style="background-color:#ffffff;">
                <div
                    v-show="showTitle"
                    class="logo_header"
                    style="background-color:#ffffff;"
                >
                    <img
                        style="width:236px;height:25px;"
                        src="~assets/img/bi-toastcam.svg"
                    /><br />
                </div>
                <div
                    v-show="showError"
                    class="logo_header"
                    style="background-color:#ffffff;"
                >
                    <img
                        style="width:236px;height:25px;"
                        src="~assets/img/bi-toastcam.svg"
                    /><br />
                    <div>
                        <span
                            style="display:inline-block; width:20px; height:20px; margin-bottom:-5px; background: url(~assets/img/ic-login-fail.png) no-repeat; background-size:20px 20px;"
                        ></span>
                        <span
                            style="display:inline-block; margin-top:20px; margin-bottom:4px; padding-left:6px; font-weight:500;"
                            class="err_txt"
                            >로그인에 실패하였습니다.</span
                        >
                    </div>
                    <span
                        class="txt2"
                        style="width:238px; display:inline-block; line-height:1.5; color:#666666"
                        >없는 아이디이거나 아이디 또는 비밀번호가 일치하지
                        않습니다.</span
                    >
                </div>
                <div class="container_login" style="background-color:#ffffff;">
                    <div class="login_cnt">
                        <div>
                            <div class="login_area">
                                <div id="idArea">
                                    <div
                                        class="input_txt_area input_email_id"
                                        id="idInput"
                                    >
                                        <input
                                            id="id"
                                            placeholder="ID"
                                            type="text"
                                            value=""
                                            autocapitalize="none"
                                            v-model="valId"
                                        />
                                        <button
                                            v-show="valId"
                                            @click="
                                                () => {
                                                    this.valId = '';
                                                }
                                            "
                                            id="idBtn"
                                            type="button"
                                            class="btn_del"
                                            tabindex="-1"
                                        >
                                            <img
                                                src="~assets/img/btn-input-text-delete.png"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div class="input_txt_area" id="pwInput">
                                    <input
                                        id="pw"
                                        placeholder="password"
                                        type="password"
                                        maxlength="15"
                                        v-model="valPw"
                                    />
                                    <button
                                        v-show="valPw"
                                        @click="
                                            () => {
                                                this.valPw = '';
                                            }
                                        "
                                        id="pwBtn"
                                        type="button"
                                        class="btn_del"
                                        tabindex="-1"
                                    >
                                        <img
                                            src="~assets/img/btn-input-text-delete.png"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div class="login_area">
                                <div class="btn_mainarea">
                                    <button
                                        type="button"
                                        class="btn_v1"
                                        @click="login()"
                                    >
                                        로그인
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            valId: "",
            valPw: "",
            showTitle: true,
            showError: false
        };
    },
    mounted() {
        this.$store.dispatch("REQUEST_LOGOUT");
    },
    methods: {
        async login() {
            if (!this.valId || !this.valPw) {
                this.showTitle = false;
                this.showError = true;
                return;
            }

            try {
                const loginRes = await this.$store.dispatch("REQUEST_LOGIN", {
                    id: this.valId,
                    password: this.valPw
                });
                if (!loginRes || !loginRes.token || loginRes.code !== "ok") {
                    this.showTitle = false;
                    this.showError = true;
                    return;
                }

                localStorage.setItem(process.env.tokenKey, loginRes.token);
                const userRes = await this.$store.dispatch("FETCH_USER");
                if (userRes) {
                    this.$router.push("/");
                } else {
                    this.showTitle = false;
                    this.showError = true;
                }
            } catch (err) {
                this.axiosNoAuthCheck(err)
                    ? this.$router.push("/login")
                    : alert(`error: ${err}`);
            }
        }
    }
};
</script>
<style lang="scss">
.login-cont {
    .wrap_login {
        padding: 0 20px;
    }
    .logo_header {
        padding: 70px 0 17px;
        background-color: #f5f5f5;
        border-bottom: 0;
        line-height: 1;
        zoom: 1;
        text-align: center;
        .err_txt {
            display: block;
            padding: 0 10px;
            font-size: 14px;
            color: #ef351c;
            line-height: 36px;
        }
        .txt_end span {
            color: #4b96e6;
        }
    }
    .container_login {
        overflow: visible;
        min-height: 335px;
        background-color: #f5f5f5;
        .login_cnt {
            margin: 0 auto;
            max-width: 330px;
            position: relative;
            .login_area {
                position: relative;
                z-index: 100;
                margin-top: 16px;
            }
        }
        .btn_v1 {
            width: 100%;
            background-color: #4a96e6;
            color: #fff;
            display: block;
            height: 46px;
            line-height: 46px;
            text-align: center;
            font-size: 15px;
            font-weight: normal;
            cursor: pointer;
            margin-top: 12px;
        }
    }
}
</style>
