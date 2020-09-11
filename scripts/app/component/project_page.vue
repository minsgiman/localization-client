<template>
    <div id="project_view">
        <div>
            <h3 class="select_title">{{projectName}} 프로젝트</h3>

            <div class="btn_wrap">
                <button class="btn_json_down btn green rounded" v-on:click="showLangSelectDlg('json')">JSON 다운로드</button>
                <button class="btn_json_down btn purple rounded" v-on:click="showLangSelectDlg('xml')">xml 다운로드</button>
                <button class="btn_json_down btn cyan rounded" v-on:click="translateExcelDownload()">excel 다운로드</button>
                <button class="btn_json_down btn red rounded" v-on:click="showLangSelectDlg('ascii')">ASCII 다운로드</button>
            </div>

            <div class="user_input_item">
                <span class="title_badge"></span>
                <h4>번역추가</h4>
                <div class="info_wrap">
                    <span class="lang_input_wrap" v-for="lang in projectLanguages">
                        <span class="ip_info">{{langTitleMap[lang]}}</span>
                        <input class="ip_txt" type="text" v-model="inputLocaleObj[lang]">
                    </span>
                    <span class="add_btn">
                        <button class="gateway_regist" v-on:click="addTranslate()">추가</button>
                    </span>
                </div>
            </div>

            <div class="user_input_item">
                <span class="title_badge"></span>
                <h4>Excel로 번역추가</h4>
                <div class="info_wrap">
                    <div class="container">
                        <div class="upload_form_cont">
                            <form id="upload_form" @submit="checkForm" enctype="multipart/form-data" method="post" v-bind:action="action">
                                <span>
                                    <span><label for="uploadFile">xlsx 파일을 선택해주세요.</label></span>
                                    <span><input type="file" v-bind:name="projectName" id="uploadFile"/></span>
                                </span>
                                <span id="upload_wrap">
                                    <label for="submit_file">업로드</label>
                                    <input type="submit" id="submit_file" name="Upload"/>
                                </span>
                            </form>
                            <span class="add_btn">
                                <button class="gateway_regist" v-on:click="sampleDownload()">샘플 다운로드</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="user_input_item">
                <span class="title_badge"></span>
                <h4>번역어 조회 (선택한 언어 : <span class="select_lang_name">{{langTitleMap[selectedLang]}}</span>)</h4>
                <select v-model="selectedLang">
                    <option disabled value="">Please select one</option>
                    <option v-bind:value="lang" v-for="lang in projectLanguages">
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
                <input class="tag_search" v-model="tagSearch" placeholder="태그검색" type="text">
                <button class="empty_tag" @click="setUseEmptyTag(true)">Empty태그보기</button>
                <button class="remove_all_btn" @click="showAllTrRemoveDlg = true;">전체삭제</button>
                <button class="remove_all_btn" @click="showLogList()">로그보기</button>
            </div>

            <div v-if="renderTranslateList" class="locale_item_wrap">
                <table cellpadding="30">
                    <tr>
                        <th width="8%">No.</th>
                        <th width="10%">StringID</th>
                        <th width="8%">tag</th>
                        <th :width="selectedLang !== 'all' ? '23%' : '10%'">Base({{langTitleMap[defaultLang]}})</th>
                        <th v-if="selectedLang !== 'all'" width="28%">번역어</th>
                        <th v-if="selectedLang === 'all'" width="10%" v-for="lang in projectLanguages">{{langTitleMap[lang]}}</th>
                        <th width="17%">Button</th>
                    </tr>

                    <locale_item_cell v-for="(item, index) in translateList"
                                      v-if="(!useEmptyTag && !tagSearch) || (useEmptyTag && !item.tag) || (!useEmptyTag && tagSearch && tagSearch === item.tag)"
                                      :uid="item.uid" :pLocaleObj="item" :pSelectLang="selectedLang" :pIdx="index" :key="item.uid"
                                      v-on:deleteTranslate="onDeleteTranslate(item.uid, item.strid, item.base)">
                    </locale_item_cell>
                </table>
            </div>

            <img class="go_bottom" src="/img/btn-next-10-p-default.png" @click="goBottom">
            <img class="go_top" src="/img/btn-next-10-p-default.png" @click="goTop">

        </div>
        <div v-show="showSelectLang == true" class="lang-select-container">
            <h2>다운로드 할 언어를 선택하세요</h2>
            <ul>
                <li v-for="lang in projectLanguages">
                    <input type="radio" :id="lang" :value="lang" name="langSelector" :checked="lang === selectedLang">
                    <label :for="lang">{{langTitleMap[lang]}}</label>
                    <div class="check"></div>
                </li>
            </ul>
            <div class="btn_box">
                <button class="btn_confirm btn_b" v-on:click="translateJsonDownload()">다운로드</button>
                <button class="btn_cancel btn_b" v-on:click="showSelectLang = false;">취소</button>
            </div>
        </div>
        <tr_remove_dlg
                v-if="showTrRemoveDlg"
                v-bind:deleteId="deleteId"
                v-bind:deleteStrId="deleteStrId"
                v-bind:deleteBase="deleteBase"
                v-on:destroy="onTrRemoveDlgDestroy()">
        </tr_remove_dlg>
        <all_remove_dlg
                v-if="showAllTrRemoveDlg"
                v-on:destroy="onAllTrRemoveDlgDestroy()">
        </all_remove_dlg>
        <loglist_dlg
                v-if="showLogListDlg"
                v-bind:loglist="loglist"
                v-on:destroy="onLogListDlgDestroy()">
        </loglist_dlg>
    </div>


</template>

<script>
    import tr_remove_dlg from './tr_remove_dialog';
    import all_remove_dlg from './translate_remove_dialog';
    import locale_item_cell from './locale_item_cell';
    import loglist_dlg from './loglist_dialog';
    import gEventBus from './../service/gEventBus';
    import jQuery from 'jquery';
    import config from "../config/config";

    function convertLangStrToArr (str) {
        if (!str) {
            return [];
        }
        return str.split(',');
    }

    function getUrlParameter( name, url ) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }

    export default {
        data : function() {
            return {
                showTrRemoveDlg : false,
                showSelectLang : false,
                showAllTrRemoveDlg : false,
                showLogListDlg : false,
                loglist : [],
                selectDownloadType : '',
                renderTranslateList : true,
                inputLocaleObj: {},
                action: '',
                deleteId: '',
                deleteStrId: '',
                deleteBase: '',
                selectedLang: '',
                selectSortType: '',
                tagSearch: '',
                useEmptyTag: false
            }
        },
        watch : {
            tagSearch : function (val) {
                console.log('tagSearchChanged');
                this.setUseEmptyTag(false);
            }
        },
        computed : {
            projectName : function () {
                return this.$store.state.currentProject.name;
            },
            projectUUID : function () {
                return this.$store.state.currentProject.uuid;
            },
            projectLanguages : function () {
                return convertLangStrToArr(this.$store.state.currentProject.languages);
            },
            translateList : function () {
                return this.$store.state.currentTranslateList;
            },
            supportLanguages : function () {
                return config.suportLanguages;
            },
            langTitleMap : function () {
                return config.langTitleMap;
            },
            defaultLang : function () {
                return config.baseLanguage;
            }
        },
        created : function() {
            const name = getUrlParameter('name', location.href),
                  uuid = getUrlParameter('uuid', location.href),
                  languages = getUrlParameter('languages', location.href);
            this.$store.dispatch('SET_CURRENT_PROJECT', {name, uuid, languages});
            this.selectedLang = 'all';
            this.selectSortType = this.$store.state.selectSortType;
            gEventBus.$on('UPDATE_TRANSLATE_LIST', this.onUpdateTranslateList);
            gEventBus.$on('ADD_TRANSLATE', this.onAddTranslate);
            gEventBus.$on('FETCH_LOG_LIST', this.onFetchLogList);
        },
        mounted : function() {
            this.$store.dispatch('FETCH_TRANSLATE_LIST');
            this.action = config.serverUrl + '/translates/file';
        },
        beforeDestroy : function() {
            gEventBus.$off('UPDATE_TRANSLATE_LIST');
            gEventBus.$off('ADD_TRANSLATE');
            gEventBus.$off('FETCH_LOG_LIST');
        },
        methods : {
            sortTypeChange: function(event) {
                this.$store.dispatch('SET_LOADING', true);
                setTimeout(() => {
                    this.$store.dispatch('SORT_TRANSLATE_LIST', event.target.value);
                }, 100);
            },
            showLogList: function() {
                this.$store.dispatch('FETCH_LOG_LIST');
            },
            sampleDownload: function() {
                window.location.href = config.serverUrl + '/translates/sampleFile';
            },
            setUseEmptyTag: function(value) {
                this.useEmptyTag = value;
            },
            checkForm: function(e) {
                let val = jQuery('#uploadFile').val();
                if (val.indexOf('.xlsx') != -1) {
                    this.$store.dispatch('SET_LOADING');
                    return true;
                }
                e.preventDefault();
                alert('.xlsx 파일을 업로드 해주세요.');
            },
            removeAllTranslate: function() {
                this.$store.dispatch('REMOVE_ALL_TRANSLATE', {name: this.projectName, uuid: this.projectUUID});
            },
            addTranslate: function() {
                let key, data = {};
                for (key in this.inputLocaleObj) {
                    data[key] = this.inputLocaleObj[key];
                }
                this.$store.dispatch('ADD_TRANSLATE', data);
            },
            showLangSelectDlg: function(type) {
                this.showSelectLang = true;
                this.selectDownloadType = type;
            },
            translateExcelDownload: function() {
                this.selectDownloadType = 'xlsx';
                window.location.href = config.serverUrl + "/translates/file?projectName=" + this.projectName + '&lang=' + 'ko' + '&type=' + this.selectDownloadType;
            },
            translateJsonDownload: function() {
                var selectLang = document.querySelector('input[name="langSelector"]:checked').value;
                window.location.href = config.serverUrl + "/translates/file?projectName=" + this.projectName + '&lang=' + selectLang + '&type=' + this.selectDownloadType;
                this.showSelectLang = false;
            },
            goTop: function() {
                window.scrollTo(0, 0);
            },
            goBottom: function() {
                window.scrollTo(0, document.getElementById('project_view').scrollHeight);
            },
            onFetchLogList: function(result) {
                this.loglist = result.reverse();
                this.showLogListDlg = true;
            },
            onUpdateTranslateList: function() {
                this.renderTranslateList = false;
                setTimeout(() => {
                    this.renderTranslateList = true;
                }, 0);
            },
            onDeleteTranslate: function(id, strid, base) {
                this.deleteId = id;
                this.deleteStrId = strid;
                this.deleteBase = base;
                this.showTrRemoveDlg = true;
            },
            onAddTranslate: function(result) {
                if(result) {
                    let key;
                    for (key in this.inputLocaleObj) {
                        this.inputLocaleObj[key] = '';
                    }
                    //alert("번역어 생성에 성공하였습니다.")
                } else {
                    alert("번역어 생성에 실패하였습니다.");
                }
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
        components : {
            tr_remove_dlg,
            all_remove_dlg,
            loglist_dlg,
            locale_item_cell
        }
    }
</script>

<style lang="less">
    #project_view {
        width: 100%;
        position: absolute;

        table {
            border-top: solid 2px #4a4a4a;
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            padding: 18px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            word-break: break-word;
            input {
                height:32px;
                font-size:13px;
            }
            input.checkbox {
                width:32px;
                transform:scale(1.5);
                margin-left:10px;
            }
        }
        th:nth-child(1) {
            padding-left:40px;
        }
        td:nth-child(1) {
            padding-left:40px;
        }

        .locale_item_wrap {
            position:relative;
        }

        .upload_form_cont {
            color:#000;
            overflow:hidden;
        }
        #upload_form {
            float:left;
            width:700px;
        }
        #upload_form > div {
            margin-bottom:10px;
        }
        .clear_both {
            clear:both;
        }
        input {
            border-radius:10px;
            -moz-border-radius:10px;
            -ms-border-radius:10px;
            -o-border-radius:10px;
            -webkit-border-radius:10px;

            border:1px solid #ccc;
            font-size:14pt;
            padding:5px 10px;
        }
        input[type=button] {
            background: -moz-linear-gradient(#ffffff, #dfdfdf);
            background: -ms-linear-gradient(#ffffff, #dfdfdf);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ffffff), color-stop(100%, #dfdfdf));
            background: -webkit-linear-gradient(#ffffff, #dfdfdf);
            background: -o-linear-gradient(#ffffff, #dfdfdf);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dfdfdf');
            -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dfdfdf')";
            background: linear-gradient(#ffffff, #dfdfdf);
        }
        #uploadFile {
            width:400px;
        }
        #submit_file {
            display:none;
        }
        #upload_wrap {
            display:inline-block;
        }
        #upload_wrap label {
            width:100px;
            height:26px;
            padding-top:10px;
            display:inline-block;
            text-align:center;
            vertical-align:middle;
            color: #fff;
            font-size: 16px;
            background-color: #4b96e6;
            border-radius: 22px;
            cursor: pointer;
        }
        .go_bottom {
            position:fixed;
            display:block;
            width:30px;
            height:30px;
            right:30px;
            top:30px;
            background-color:red;
            transform: rotate(90deg);
            border:1px solid red;
            border-radius:30px;
            cursor:pointer;
            z-index:999999;
        }

        .go_top {
            position:fixed;
            display:block;
            width:30px;
            height:30px;
            right:30px;
            bottom:30px;
            background-color:rgba(0.1,0.1,0.1,0.2);
            transform: rotate(270deg);
            border:1px solid gray;
            border-radius:30px;
            cursor:pointer;
            z-index:999999;
        }

        .select_title {
            margin-top: 30px;
            margin-left: 50px;
            font-size: 1.3em;
        }

        .user_input_item {
            width:1280px;
            margin-left:100px;
            margin-top:14px;
            padding-top:20px;
            padding-bottom:20px;
            height:auto;
            .title_badge {
                width:8px;
                height:8px;
                background:#4b96e6;
                border-radius:2px;
                display:inline-block;
                margin-bottom:4px;
                margin-right:6px;
            }
            h4 {
                text-align:left;
                font-size:20px;
                font-weight:400;
                display:inline-block;
                span {
                    color:#4b96e6;
                }
            }
            .info_wrap {
                position:relative;
                margin-top:20px;
                padding-top:28px;
                padding-bottom:28px;
                padding-right:188px;
                padding-left:35px;
                border-top: 2px solid #4a4a4a;
                border-bottom: 1px solid #e0e0e0;
                .lang_input_wrap {
                    display:inline-block;
                    width:265px;
                }
            }

            .ip_info {
                font-size:14px; color:#333333; font-weight:bold;
                input {
                    position: relative;
                    font-weight: 400;
                    float: right;
                    right: 2px;
                    height:19px;
                    margin-top:-4px;
                }
            }
            .ip_txt {
                width:160px;
                height:32px;
                font-size:14px;
                margin-left:4px;
                margin-right:24px;
                margin-bottom:15px;
            }
            .add_btn {
                position:absolute;
                right:110px;
                top:33px;
                width: 110px;
                display:inline-block;
                .gateway_regist {
                    width:110px;
                    height:32px;
                    margin-left:74px;
                    background: #ffffff;
                    border: solid 1px #777777;
                    font-size:14px;
                    cursor:pointer;
                    &:hover{
                        background: #444444;
                        color: #ffffff;
                        border:none;
                    }
                }
            }
            .remove_all_btn {
                background-color:maroon;
                color:white;
                font-size:14px;
                width:150px;
                height:26px;
                border-radius:30px;
                margin-left:20px;
            }
            .select_lang_name {
                color:#4b96e6;
            }
            .tag_search {
                margin-left:20px;
                font-size:14px;
            }
            .empty_tag {
                font-size: 10px;
                padding: 2px 4px;
                margin-left: 2px;
            }
            select {
                font-size:14px;
            }
        }


        .btn_wrap {
            margin: 20px 150px 30px 95px;
            display:inline-block;
            button {
                width: 120px;
                height: 50px;
                margin-right:20px;
                font-size:14px;

                /* Colors for .btn and .btn-two */
                &.btn.blue, &.btn-two.blue     {background-color: #7fb1bf;}
                &.btn.green, &.btn-two.green   {background-color: #9abf7f;}
                &.btn.red, &.btn-two.red       {background-color: #fa5a5a;}
                &.btn.purple, &.btn-two.purple {background-color: #cb99c5;}
                &.btn.cyan, &.btn-two.cyan     {background-color: #7fccde;}
                &.btn.yellow, &.btn-two.yellow {background-color: #f0d264;}

                &.rounded {
                    border-radius: 10px;
                }

                /* default button style */
                &.btn {
                    position: relative;
                    border: 0;
                    padding: 15px 25px;
                    display: inline-block;
                    text-align: center;
                    color: white;
                }
                &.btn:active {
                    top: 4px;
                }

                /* color classes for .btn */
                &.btn.blue {box-shadow: 0px 4px #74a3b0;}
                &.btn.blue:active {box-shadow: 0 0 #74a3b0; background-color: #709CA8;}

                &.btn.green {box-shadow: 0px 4px 0px #87a86f;}
                &.btn.green:active {box-shadow: 0 0 #87a86f; background-color: #87a86f;}

                &.btn.red {box-shadow:0px 4px 0px #E04342;}
                &.btn.red:active {box-shadow: 0 0 #ff4c4b; background-color: #ff4c4b;}

                &.btn.purple {box-shadow:0px 4px 0px #AD83A8;}
                &.btn.purple:active {box-shadow: 0 0 #BA8CB5; background-color: #BA8CB5;}

                &.btn.cyan {box-shadow:0px 4px 0px #73B9C9;}
                &.btn.cyan:active {box-shadow: 0 0 #73B9C9; background-color: #70B4C4;}

                &.btn.yellow {box-shadow:0px 4px 0px #D1B757;}
                &.btn.yellow:active {box-shadow: 0 0 #ff4c4b; background-color: #D6BB59;}

                &.btn_json_down {
                    width:180px;
                }
                &.btn_add_tr {

                }

            }
        }

        .lang-select-container {
            display: block;
            position: fixed;
            top: 100px;
            left: 30%;
            margin: 40px auto;
            max-height: 500px;
            width: 500px;
            padding: 20px;
            background: #222222;
            overflow-y: auto;
            h2 {
                color: #AAAAAA;
            }
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                overflow: auto;
                li {
                    color: #AAAAAA;
                    display: block;
                    position: relative;
                    float: left;
                    width: 100%;
                    height: 100px;
                    border-bottom: 1px solid #333;
                    input[type=radio]{
                        position: absolute;
                        visibility: hidden;
                    }
                    label{
                        display: block;
                        position: relative;
                        font-weight: 300;
                        font-size: 1.35em;
                        padding: 25px 25px 25px 80px;
                        margin: 10px auto;
                        height: 30px;
                        z-index: 9;
                        cursor: pointer;
                        -webkit-transition: all 0.25s linear;
                    }
                    &:hover label {
                        color: #FFFFFF;
                    }
                    .check{
                        display: block;
                        position: absolute;
                        border: 5px solid #AAAAAA;
                        border-radius: 100%;
                        height: 25px;
                        width: 25px;
                        top: 30px;
                        left: 20px;
                        z-index: 5;
                        transition: border .25s linear;
                        -webkit-transition: border .25s linear;
                        &::before {
                            display: block;
                            position: absolute;
                            content: '';
                            border-radius: 100%;
                            height: 15px;
                            width: 15px;
                            top: 5px;
                            left: 5px;
                            margin: auto;
                            transition: background 0.25s linear;
                            -webkit-transition: background 0.25s linear;
                        }
                    }
                    &:hover .check{
                        border: 5px solid #FFFFFF;
                    }
                }
            }
            input[type=radio]:checked ~ .check {
                border: 5px solid #0DFF92;
            }

            input[type=radio]:checked ~ .check::before{
                background: #0DFF92;
            }

            input[type=radio]:checked ~ label{
                color: #0DFF92;
            }

            .btn_box{
                margin-top:20px;text-align:center; clear: both;
                .btn_b{
                    height:50px;width: 150px; font-size:16px;color:#fff;border-radius: 25px; padding: 0; margin: 0 5px;cursor:pointer;
                }
                .btn_confirm {
                    background: #4b96e6; border-color: #4b96e6;
                }
                .btn_cancel {
                    background: #777; border-color: #777;
                }
            }
        }
    }
</style>