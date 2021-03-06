<template>
    <div class="check-dlg dialog">
        <modal_dialog
            @close="closeDlg"
            :dlg-style="{ width: '400px', padding: '30px' }"
        >
            <template slot="content">
                <div class="ly_tit">
                    <h2>{{ title }}</h2>
                </div>
                <div class="content_wrap">
                    <span class="cont-tit">* Project의 언어를 선택하세요</span>
                    <div class="check-cont">
                        <span
                            class="check-cont__inputs"
                            v-for="lang in supportLanguages"
                        >
                            <input
                                type="checkbox"
                                :id="lang"
                                :value="lang"
                                v-model="selectLanguages"
                            />
                            <label :for="lang">{{ langTitleMap[lang] }}</label>
                        </span>
                    </div>
                    <div class="base-select-cont">
                        <p class="base-select-cont__tit">
                            * Base언어를 선택하세요
                        </p>
                        <multiselect
                            v-model="selectBaseLang"
                            :options="selectLanguages"
                            :searchable="false"
                            :close-on-select="true"
                            :show-labels="false"
                            :allow-empty="false"
                            placeholder="Pick a value"
                        ></multiselect>
                    </div>
                </div>
                <div class="btn-box">
                    <button
                        type="button"
                        class="btn-confirm btn-b"
                        v-on:click="updateProject()"
                    >
                        확인
                    </button>
                    <button
                        type="button"
                        class="btn-cancel btn-b"
                        v-on:click="closeDlg()"
                    >
                        취소
                    </button>
                </div>
            </template>
        </modal_dialog>
    </div>
</template>

<script>
import modal_dialog from "./modal_dialog";

function convertLangArrToStr(arr) {
    if (!arr) {
        return "";
    }
    let str = "",
        i,
        len = arr.length;
    for (i = 0; i < len; i += 1) {
        if (str) {
            str += "," + arr[i];
        } else {
            str += arr[i];
        }
    }
    return str;
}

export default {
    props: {
        title: {
            type: String,
            dafault: ""
        },
        project: {
            type: Object,
            default: {}
        }
    },
    computed: {
        supportLanguages: function() {
            return process.env.suportLanguages;
        },
        langTitleMap: function() {
            return process.env.langTitleMap;
        }
    },
    data: function() {
        return {
            selectLanguages: [],
            selectBaseLang: ""
        };
    },
    created: function() {
        this.selectLanguages = this.project.languages.split(",");
        this.selectBaseLang = this.project.baseLang;
    },
    methods: {
        async updateProject() {
            if (!this.selectLanguages.length) {
                alert("언어를 선택해주세요.");
                return;
            }

            const languages = convertLangArrToStr(this.selectLanguages);

            if (
                !this.selectBaseLang ||
                languages.indexOf(this.selectBaseLang) === -1
            ) {
                alert("base언어를 올바르게 선택해주세요.");
                return;
            }

            try {
                this.$store.dispatch("SET_LOADING", true);
                const uResponse = await this.$store.dispatch("UPDATE_PROJECT", {
                    name: this.project.name,
                    languages,
                    base: this.selectBaseLang
                });
                if (uResponse && uResponse.code === "ok") {
                    await this.$store.dispatch("FETCH_PROJECT_LIST");
                    this.closeDlg();
                } else {
                    alert("프로젝트 언어변경에 실패하였습니다.");
                }
                this.$store.dispatch("SET_LOADING", false);
            } catch (err) {
                this.axiosNoAuthCheck(err)
                    ? this.$router.push("/login")
                    : alert(`error: ${err}`);
            }
        },
        closeDlg: function() {
            this.$emit("destroy");
            this.$destroy();
        }
    },
    components: {
        modal_dialog
    }
};
</script>
