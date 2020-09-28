<template>
    <div id="input_dlg" class="dialog">
        <div class="dimmed"></div>
        <div v-show="dlgStatus === 'name'" class="ly_pop ly_medium" style="z-index:1500;">
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
        <div v-show="dlgStatus === 'country'" class="ly_pop ly_medium" style="z-index:1500;">
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
    </div>
</template>

<script>
    import gEventBus from '@/store/gEventBus';

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
            gEventBus.$on('CREATE_PROJECT', this.onCreateProject);
        },
        beforeDestroy : function () {
            gEventBus.$off('CREATE_PROJECT');
        },
        mounted : function () {

        },
        methods : {
            setDlgStatus: function (status) {
                this.dlgStatus = status;
            },
            createProject: function () {
                if (!this.projectName) {
                    alert("프로젝트 이름을 입력해주세요.");
                    this.setDlgStatus('name');
                    return;
                }
                if (!this.selectLanguages.length) {
                    alert("언어를 선택해주세요.");
                    return;
                }
                const languages = convertLangArrToStr(this.selectLanguages);
                this.$store.dispatch('CREATE_PROJECT', {
                    name: this.projectName,
                    languages: languages
                });
            },
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            },
            onCreateProject: function(result) {
                if(result) {
                    this.closeDlg();
                } else {
                    alert("프로젝트 생성에 실패하였습니다.");
                }
            },
        }
    }
</script>
