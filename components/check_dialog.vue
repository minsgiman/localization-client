<template>
    <div id="input_dlg">
        <div class="dimmed"></div>
        <div class="ly_pop ly_medium" style="z-index:1500;">
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

            <div class="btn_box">
                <button type="button" class="btn_confirm btn_b" v-on:click="updateProject()">확인</button>
                <button type="button" class="btn_cancel btn_b" v-on:click="closeDlg()">취소</button>
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
            project: {
                type: Object,
                default: {}
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
                selectLanguages: []
            }
        },
        created : function () {
            this.selectLanguages = this.project.languages.split(',');
            gEventBus.$on('UPDATE_PROJECT', this.onUpdateProject);
        },
        beforeDestroy : function () {
            gEventBus.$off('UPDATE_PROJECT');
        },
        mounted : function () {
        },
        methods : {
            updateProject: function () {
                if (!this.selectLanguages.length) {
                    alert("언어를 선택해주세요.");
                    return;
                }
                const languages = convertLangArrToStr(this.selectLanguages);
                this.$store.dispatch('UPDATE_PROJECT', {
                    name: this.project.name,
                    uuid: this.project.uuid,
                    languages: languages
                });
            },
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            },
            onUpdateProject: function(result) {
                if(result) {
                    this.closeDlg();
                } else {
                    alert("프로젝트 언어변경에 실패하였습니다.");
                }
            },
        }
    }
</script>

<style lang="scss">
    #input_dlg {
        position:fixed; top:100px;
        .dimmed{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:130;display: block;}
        @media only screen and (max-width:1600px) {
            .dimmed_content{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:80; display: none;}
        }
        .ly_pop{
            position:fixed;top:30%;left:35%;width:34%;padding: 10px 30px 30px 30px; z-index:200;background:#fff;box-sizing:border-box;
            .ly_tit{
                margin-top:20px;
            }
            .content_wrap{
                margin-top:40px;font-size:19px;
                input{
                    font-size:19px;
                    height:30px;
                }
                .check_wrap {
                    position:relative;
                    display:inline-block;
                    width:110px;
                    margin-right:20px;
                    input {
                        position:absolute;
                        left:5px;
                    }
                    label {
                        position:absolute;
                        left:27px;
                        top:5px;
                    }
                }
            }
            .btn_box{
                margin-top:50px;text-align:center; clear: both;
                .btn_b{
                    height:50px;width: 150px; font-size:16px;color:#fff;border-radius: 25px; padding: 0; margin: 0 5px;cursor:pointer;
                }
                .btn_confirm {
                    background: #4b96e6;
                }
                .btn_cancel {
                    background: #777;
                }
            }
        }
    }
</style>
