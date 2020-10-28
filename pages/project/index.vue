<template>
    <div id="project_view" class="project-cont">
        <div>
            <h3 class="select_title">{{ projectName }} 프로젝트</h3>

            <div class="btn_wrap">
                <button
                    class="btn-download green rounded"
                    v-on:click="showLangSelectDlg('json')"
                >
                    JSON 다운로드
                </button>
                <button
                    class="btn-download purple rounded"
                    v-on:click="showLangSelectDlg('xml')"
                >
                    xml 다운로드
                </button>
                <button
                    class="btn-download cyan rounded"
                    v-on:click="translateExcelDownload()"
                >
                    excel 다운로드
                </button>
                <button
                    class="btn-download red rounded"
                    v-on:click="showLangSelectDlg('ascii')"
                >
                    ASCII 다운로드
                </button>
            </div>

            <div class="user_input_item">
                <span class="title_badge"></span>
                <h4>번역추가</h4>
                <div class="info_wrap">
                    <span
                        class="lang_input_wrap"
                        v-for="lang in projectLanguages"
                    >
                        <span class="ip_info">{{ langTitleMap[lang] }}</span>
                        <input
                            class="ip_txt"
                            type="text"
                            v-model="inputLocaleObj[lang]"
                        />
                    </span>
                    <span class="simple-btn-wrap">
                        <button class="btn-simple" v-on:click="addTranslate()">
                            추가
                        </button>
                    </span>
                </div>
            </div>

            <div class="user_input_item">
                <span class="title_badge"></span>
                <h4>Excel로 번역추가</h4>
                <div class="info_wrap">
                    <div class="container">
                        <div class="upload_form_cont">
                            <form id="upload_form">
                                <span>
                                    <span
                                        ><label for="uploadFile"
                                            >xlsx 파일을 선택해주세요.</label
                                        ></span
                                    >
                                    <span
                                        ><input type="file" id="uploadFile"
                                    /></span>
                                </span>
                                <span id="upload_wrap" @click="uploadForm()"
                                    >업로드</span
                                >
                            </form>
                            <span class="simple-btn-wrap">
                                <button
                                    class="btn-simple"
                                    v-on:click="sampleDownload()"
                                >
                                    샘플 다운로드
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="user_input_item">
                <span class="title_badge"></span>
                <h4>
                    번역어 조회 (선택한 언어 :
                    <span class="select_lang_name">{{
                        langTitleMap[selectedLang]
                    }}</span
                    >)
                </h4>
                <select v-model="selectedLang">
                    <option disabled value="">Please select one</option>
                    <option
                        v-bind:value="lang"
                        v-for="lang in projectLanguages"
                    >
                        {{ langTitleMap[lang] }}
                    </option>
                    <option value="all">모두보기</option>
                </select>

                <span style="margin-left:20px;">정렬방법 : </span>
                <select v-model="selectSortType" @change="sortTypeChange">
                    <option disabled value="">Please select one</option>
                    <option value="strid">StringID 순</option>
                    <option value="strid-rev">StringID 역순</option>
                    <option value="base">Base 순</option>
                    <option value="base-rev">Base 역순</option>
                    <option value="key">등록순</option>
                    <option value="key-rev">등록역순</option>
                </select>
                <button
                    class="remove_all_btn"
                    @click="showAllTrRemoveDlg = true"
                >
                    전체삭제
                </button>
                <button class="remove_all_btn" @click="showLogList()">
                    로그보기
                </button>
            </div>
            <div class="tr-search_wrap">
                <div class="input_txt_area">
                    <input
                        type="text"
                        v-model="trSearch"
                        placeholder="번역검색(By Base)"
                    />
                    <button
                        v-show="trSearch"
                        @click="
                            () => {
                                this.trSearch = '';
                            }
                        "
                        class="btn_del"
                        tabindex="-1"
                    >
                        <img src="~assets/img/btn-input-text-delete.png" />
                    </button>
                </div>
            </div>
            <div v-if="renderTranslateList" class="locale_item_wrap">
                <table class="table-locale" cellpadding="30">
                    <tr>
                        <th width="8%">No.</th>
                        <th width="10%">StringID</th>
                        <th width="8%">tag</th>
                        <th :width="selectedLang !== 'all' ? '23%' : '10%'">
                            Base({{ langTitleMap[defaultLang] }})
                        </th>
                        <th v-if="selectedLang !== 'all'" width="28%">
                            번역어
                        </th>
                        <th
                            v-if="selectedLang === 'all'"
                            width="10%"
                            v-for="lang in projectLanguages"
                        >
                            {{ langTitleMap[lang] }}
                        </th>
                        <th width="17%">Button</th>
                    </tr>

                    <locale_item_cell
                        v-for="(item, index) in translateList"
                        v-if="
                            !trSearch ||
                                (trSearch &&
                                    includeCheck(trSearch, item[defaultLang]))
                        "
                        :uid="item.uid"
                        :pLocaleObj="item"
                        :pSelectLang="selectedLang"
                        :pIdx="index"
                        :key="item.uid"
                        v-on:deleteTranslate="
                            onDeleteTranslate(
                                item.uid,
                                item.strid,
                                item[defaultLang]
                            )
                        "
                    >
                    </locale_item_cell>
                </table>
            </div>

            <img
                class="go_bottom"
                src="~assets/img/btn-next-10-p-default.png"
                @click="goBottom"
            />
            <img
                class="go_top"
                src="~assets/img/btn-next-10-p-default.png"
                @click="goTop"
            />
        </div>
        <div v-show="showSelectLang == true" class="lang-select-container">
            <h2>다운로드 할 언어를 선택하세요</h2>
            <ul>
                <li v-for="lang in projectLanguages">
                    <input
                        type="radio"
                        :id="lang"
                        :value="lang"
                        name="langSelector"
                        :checked="lang === selectedLang"
                    />
                    <label :for="lang">{{ langTitleMap[lang] }}</label>
                    <div class="check"></div>
                </li>
            </ul>
            <div class="btn-box">
                <button
                    class="btn-confirm btn-b"
                    v-on:click="translateJsonDownload()"
                >
                    다운로드
                </button>
                <button
                    class="btn-cancel btn-b"
                    v-on:click="showSelectLang = false"
                >
                    취소
                </button>
            </div>
        </div>
        <tr_remove_dlg
            v-if="showTrRemoveDlg"
            v-bind:deleteId="deleteId"
            v-bind:deleteStrId="deleteStrId"
            v-bind:deleteBase="deleteBase"
            v-on:destroy="onTrRemoveDlgDestroy()"
        >
        </tr_remove_dlg>
        <all_remove_dlg
            v-if="showAllTrRemoveDlg"
            v-on:destroy="onAllTrRemoveDlgDestroy()"
        >
        </all_remove_dlg>
        <loglist_dlg
            v-if="showLogListDlg"
            v-bind:loglist="loglist"
            v-on:destroy="onLogListDlgDestroy()"
        >
        </loglist_dlg>
    </div>
</template>

<script>
import tr_remove_dlg from "@/components/tr_remove_dialog.vue";
import all_remove_dlg from "@/components/translate_remove_dialog";
import locale_item_cell from "@/components/locale_item_cell";
import loglist_dlg from "@/components/loglist_dialog";

function convertLangStrToArr(str) {
    if (!str) {
        return [];
    }
    return str.split(",");
}

function getUrlParameter(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

export default {
    data: function() {
        return {
            showTrRemoveDlg: false,
            showSelectLang: false,
            showAllTrRemoveDlg: false,
            showLogListDlg: false,
            loglist: [],
            selectDownloadType: "",
            renderTranslateList: true,
            inputLocaleObj: {},
            deleteId: "",
            deleteStrId: "",
            deleteBase: "",
            selectedLang: "",
            selectSortType: "",
            trSearch: ""
        };
    },
    watch: {
        trSearch: function(val) {}
    },
    computed: {
        projectName: function() {
            return this.$store.state.currentProject.name;
        },
        projectUUID: function() {
            return this.$store.state.currentProject.uuid;
        },
        projectLanguages: function() {
            return convertLangStrToArr(
                this.$store.state.currentProject.languages
            );
        },
        projectList: function() {
            return this.$store.state.projectList;
        },
        translateList: function() {
            return this.$store.state.currentTranslateList;
        },
        supportLanguages: function() {
            return process.env.suportLanguages;
        },
        langTitleMap: function() {
            return process.env.langTitleMap;
        },
        defaultLang: function() {
            return this.$store.state.currentProject.baseLang;
        }
    },
    async created() {
        this.selectedLang = "all";
        this.selectSortType = this.$store.state.selectSortType;

        try {
            if (this.projectList.length) {
                this.setCurrentProject();
            } else {
                const projectList = await this.$store.dispatch(
                    "FETCH_PROJECT_LIST"
                );
                if (projectList.length) {
                    this.setCurrentProject();
                }
            }

            this.$store.dispatch("SET_LOADING", true);
            this.renderTranslateList = false;
            await this.$store.dispatch("FETCH_TRANSLATE_LIST");
            setTimeout(() => {
                this.renderTranslateList = true;
                this.$store.dispatch("SET_LOADING", false);
            }, 0);
        } catch (err) {
            this.axiosNoAuthCheck(err)
                ? this.$router.push("/login")
                : alert(`error: ${err}`);
        }
    },
    beforeDestroy: function() {
        this.renderTranslateList = false;
        this.$store.dispatch("SET_TRANSLATE_LIST", []);
    },
    methods: {
        setCurrentProject: function() {
            const name = getUrlParameter("name", location.href);
            this.$store.dispatch("SET_CURRENT_PROJECT", { name });
        },
        includeCheck: function(search, translate) {
            return translate.indexOf(search) !== -1;
        },
        sortTypeChange: function(event) {
            this.$store.dispatch("SET_LOADING", true);
            setTimeout(() => {
                this.$store.dispatch("SORT_TRANSLATE_LIST", event.target.value);
                setTimeout(() => {
                    this.$store.dispatch("SET_LOADING", false);
                }, 100);
            }, 100);
        },
        showLogList: function() {
            this.$store
                .dispatch("FETCH_LOG_LIST")
                .then(loglist => {
                    this.loglist = loglist.reverse();
                    this.showLogListDlg = true;
                })
                .catch(err => {
                    this.axiosNoAuthCheck(err)
                        ? this.$router.push("/login")
                        : alert(`error: ${err}`);
                });
        },
        sampleDownload: function() {
            this.$store.dispatch("FETCH_SAMPLE_FILE");
        },

        uploadForm: function() {
            const elId = "uploadFile";
            const fileInputEl = document.getElementById(elId);
            let val = fileInputEl.value;

            if (val.indexOf(".xlsx") === -1) {
                alert(".xlsx 파일을 업로드 해주세요.");
                return;
            }

            this.$store
                .dispatch("UPLOAD_FORM", {
                    projectName: this.projectName,
                    elId
                })
                .then(res => {
                    if (res && res.code === "ok") {
                        fileInputEl.value = "";
                    } else {
                        alert("번역어 업로드에 실패하였습니다.");
                    }
                })
                .catch(err => {
                    this.$store.dispatch("SET_LOADING", false);
                    alert(`error: ${err}`);
                });
        },

        addTranslate: function() {
            let key,
                data = {};
            for (key in this.inputLocaleObj) {
                data[key] = this.inputLocaleObj[key];
            }
            this.$store
                .dispatch("ADD_TRANSLATE", data)
                .then(res => {
                    if (res && res.code === "ok") {
                        for (let key in this.inputLocaleObj) {
                            this.inputLocaleObj[key] = "";
                        }
                    } else {
                        alert("번역어 생성에 실패하였습니다.");
                    }
                })
                .catch(err => {
                    this.axiosNoAuthCheck(err)
                        ? this.$router.push("/login")
                        : alert(`error: ${err}`);
                });
        },
        showLangSelectDlg: function(type) {
            this.showSelectLang = true;
            this.selectDownloadType = type;
        },
        translateExcelDownload: function() {
            this.selectDownloadType = "xlsx";
            this.$store.dispatch("FETCH_TRANSLATE_FILE", {
                projectName: this.projectName,
                lang: "ko",
                type: this.selectDownloadType
            });
        },
        translateJsonDownload: function() {
            var selectLang = document.querySelector(
                'input[name="langSelector"]:checked'
            ).value;
            this.$store.dispatch("FETCH_TRANSLATE_FILE", {
                projectName: this.projectName,
                lang: selectLang,
                type: this.selectDownloadType
            });
            this.showSelectLang = false;
        },
        goTop: function() {
            window.scrollTo(0, 0);
        },
        goBottom: function() {
            window.scrollTo(
                0,
                document.getElementById("project_view").scrollHeight
            );
        },
        onDeleteTranslate: function(id, strid, base) {
            this.deleteId = id;
            this.deleteStrId = strid;
            this.deleteBase = base;
            this.showTrRemoveDlg = true;
        },
        onTrRemoveDlgDestroy: function() {
            this.showTrRemoveDlg = false;
        },
        onAllTrRemoveDlgDestroy: function() {
            this.showAllTrRemoveDlg = false;
        },
        onLogListDlgDestroy: function() {
            this.showLogListDlg = false;
        }
    },
    components: {
        tr_remove_dlg,
        all_remove_dlg,
        loglist_dlg,
        locale_item_cell
    }
};
</script>

<style lang="scss">
.project-cont {
    width: 100%;
    position: absolute;

    .locale_item_wrap {
        position: relative;
    }

    .upload_form_cont {
        color: #000;
        overflow: hidden;
    }
    #upload_form {
        float: left;
        width: 700px;
    }
    #upload_form > div {
        margin-bottom: 10px;
    }
    .clear_both {
        clear: both;
    }
    input {
        border-radius: 10px;
        -moz-border-radius: 10px;
        -ms-border-radius: 10px;
        -o-border-radius: 10px;
        -webkit-border-radius: 10px;

        border: 1px solid #ccc;
        font-size: 14pt;
        padding: 5px 10px;
    }
    input[type="button"] {
        background: -moz-linear-gradient(#ffffff, #dfdfdf);
        background: -ms-linear-gradient(#ffffff, #dfdfdf);
        background: -webkit-gradient(
            linear,
            left top,
            left bottom,
            color-stop(0%, #ffffff),
            color-stop(100%, #dfdfdf)
        );
        background: -webkit-linear-gradient(#ffffff, #dfdfdf);
        background: -o-linear-gradient(#ffffff, #dfdfdf);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dfdfdf');
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dfdfdf')";
        background: linear-gradient(#ffffff, #dfdfdf);
    }
    #uploadFile {
        width: 400px;
    }
    #upload_wrap {
        display: inline-block;
        width: 100px;
        height: 26px;
        padding-top: 10px;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        color: #fff;
        font-size: 16px;
        background-color: #4b96e6;
        border-radius: 22px;
        cursor: pointer;
    }
    .go_bottom {
        position: fixed;
        display: block;
        width: 30px;
        height: 30px;
        right: 30px;
        top: 30px;
        background-color: red;
        transform: rotate(90deg);
        border: 1px solid red;
        border-radius: 30px;
        cursor: pointer;
        z-index: 999999;
    }

    .go_top {
        position: fixed;
        display: block;
        width: 30px;
        height: 30px;
        right: 30px;
        bottom: 30px;
        background-color: rgba(0.1, 0.1, 0.1, 0.2);
        transform: rotate(270deg);
        border: 1px solid gray;
        border-radius: 30px;
        cursor: pointer;
        z-index: 999999;
    }

    .select_title {
        margin-top: 30px;
        margin-left: 50px;
        font-size: 1.3em;
    }

    .user_input_item {
        width: 1280px;
        margin-left: 100px;
        margin-top: 14px;
        padding-top: 20px;
        padding-bottom: 20px;
        height: auto;
        .title_badge {
            width: 8px;
            height: 8px;
            background: #4b96e6;
            border-radius: 2px;
            display: inline-block;
            margin-bottom: 4px;
            margin-right: 6px;
        }
        h4 {
            text-align: left;
            font-size: 20px;
            font-weight: 400;
            display: inline-block;
            span {
                color: #4b96e6;
            }
        }
        .info_wrap {
            position: relative;
            margin-top: 20px;
            padding-top: 28px;
            padding-bottom: 28px;
            padding-right: 188px;
            padding-left: 35px;
            border-top: 2px solid #4a4a4a;
            border-bottom: 1px solid #e0e0e0;
            .lang_input_wrap {
                display: inline-block;
                width: 265px;
            }
        }

        .ip_info {
            font-size: 14px;
            color: #333333;
            font-weight: bold;
            line-height: 44px;
            input {
                position: relative;
                font-weight: 400;
                float: right;
                right: 2px;
                height: 19px;
                margin-top: -4px;
            }
        }
        .ip_txt {
            width: 160px;
            height: 32px;
            font-size: 14px;
            margin-left: 4px;
            margin-right: 24px;
            margin-bottom: 15px;
        }
        .simple-btn-wrap {
            position: absolute;
            right: 110px;
            top: 33px;
            width: 110px;
            display: inline-block;
        }
        .remove_all_btn {
            background-color: maroon;
            color: white;
            font-size: 14px;
            width: 150px;
            height: 26px;
            border-radius: 30px;
            margin-left: 20px;
        }
        .select_lang_name {
            color: #4b96e6;
        }
        select {
            font-size: 14px;
        }
    }

    .tr-search_wrap {
        margin: 0 0 20px 100px;
        .input_txt_area {
            width: 500px;
            input {
                border: none;
                padding: 2px;
                font-size: 16px;
            }
        }
    }

    .btn_wrap {
        margin: 20px 150px 30px 95px;
        display: inline-block;
    }
}
</style>
