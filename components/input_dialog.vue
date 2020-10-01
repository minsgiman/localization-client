<template>
    <div id="input_dlg" class="dialog">
      <modal_dialog @close="closeDlg" :dlg-style="{width:'480px', padding:'30px'}">
        <template slot="content">
          <div v-if="dlgStatus === 'name'" class="p-dlg-cont">
            <div class="ly_tit">
              <h2>{{title}}</h2>
            </div>
            <div class="content_wrap">
              <span>Project 이름을 입력하세요 : </span>
              <input v-model="projectName">
            </div>

            <div class="btn-box">
              <button type="button" class="btn-confirm btn-b" v-on:click="setDlgStatus('country')">다음</button>
              <button type="button" class="btn-cancel btn-b" v-on:click="closeDlg()">취소</button>
            </div>
          </div>
          <div v-if="dlgStatus === 'country'" class="p-dlg-cont">
            <div class="ly_tit">
              <h2>{{title}}</h2>
            </div>
            <div class="content_wrap">
              <span>Project의 언어를 선택하세요 : </span>
              <div id='check_country'>
                    <span class="check_wrap" v-for="lang in supportLanguages">
                        <input type="checkbox" :id="lang" :value="lang" v-model="selectLanguages">
                        <label :for="lang">{{langTitleMap[lang]}}</label>
                    </span>
              </div>
            </div>

            <div class="btn-box">
              <button type="button" class="btn-confirm btn-b" v-on:click="createProject()">확인</button>
              <button type="button" class="btn-cancel btn-b" v-on:click="closeDlg()">취소</button>
            </div>
          </div>
        </template>
      </modal_dialog>
    </div>
</template>

<script>
    import modal_dialog from './modal_dialog';

    function convertLangArrToStr (arr) {
        if (!arr) {
            return '';
        }
        let str = '', i, len = arr.length;
        for (i = 0; i < len; i+=1) {
            if (str) {
                str += (',' + arr[i]);
            } else {
                str += arr[i];
            }
        }
        return str;
    }

    export default {
        props : {
            title: {
                type: String,
                dafault: ''
            },
            inputType: {
                type: String,
                default: ''
            }
        },
        computed : {
            supportLanguages : function () {
                return process.env.suportLanguages;
            },
            langTitleMap : function () {
                return process.env.langTitleMap;
            }
        },
        data : function() {
            return {
                projectName: '',
                dlgStatus: '',
                selectLanguages: []
            }
        },
        created : function () {
            this.dlgStatus = 'name';
            this.selectLanguages = ['ko', 'ja', 'en'];
        },
        methods : {
            setDlgStatus: function (status) {
                this.dlgStatus = status;
            },
            async createProject() {
                if (!this.projectName) {
                    alert("프로젝트 이름을 입력해주세요.");
                    this.setDlgStatus('name');
                    return;
                }
                if (!this.selectLanguages.length) {
                    alert("언어를 선택해주세요.");
                    return;
                }

                try {
                    this.$store.dispatch('SET_LOADING', true);
                    const languages = convertLangArrToStr(this.selectLanguages);
                    const cResponse = await this.$store.dispatch('CREATE_PROJECT', {name: this.projectName, languages});
                    if (cResponse && cResponse.code === 'ok') {
                        await this.$store.dispatch('FETCH_PROJECT_LIST');
                        this.closeDlg();
                    } else {
                        alert("프로젝트 생성에 실패하였습니다.");
                    }
                    this.$store.dispatch('SET_LOADING', false);
                } catch(err) {
                    this.axiosNoAuthCheck(err) ? this.$router.push('/login') : alert(`error: ${err}`);
                }
            },
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            }
        },
        components: {
            modal_dialog
        }
    }
</script>
