<template>
    <div id="cam_manage">

        <h3 class="select_title">Project를 선택하세요</h3>
        <div class="project_wrap">
            <div v-for="(item, index) in projectList">
                <button class="project_btn" v-on:click="selectProject(item)">
                    <span class="project_name">{{item.name}} 프로젝트</span>
                </button>
                <button class="lang_set_btn" v-on:click="showLanguageSelectDlg(item)">언어설정</button>
            </div>
        </div>
        <div class="create_project">
            <a class="btn-3d blue" v-on:click="showInputDlg = true;">{{projectCreateTxt}}</a>
        </div>
        <input_dlg
                v-if="showInputDlg"
                v-bind:title="projectCreateTxt"
                v-bind:input-type="projectCreateInputType"
                v-on:destroy="onInputDlgDestroy()">
        </input_dlg>
        <check_dlg
                v-if="showCheckDlg"
                v-bind:title="projectLangTxt"
                v-bind:project="selectedProject"
                v-on:destroy="onCheckDlgDestroy()">
        </check_dlg>
    </div>
</template>

<script>
    import input_dlg from './input_dialog';
    import check_dlg from './check_dialog';
    import { router } from '../main';

    export default {
        data : function() {
            return {
                showInputDlg : false,
                showCheckDlg : false,
                selectedProject : null,
                projectCreateTxt : "Project 생성",
                projectLangTxt : "언어설정",
                projectCreateInputType : 'projectname'
            }
        },
        computed : {
            projectList : function () {
                return this.$store.state.projectList;
            }
        },
        created : function() {
        },
        mounted : function() {
            this.$store.dispatch('FETCH_PROJECT_LIST');
        },
        beforeDestroy : function() {
        },
        methods : {
            selectProject: function(projectJSON) {
                this.$store.dispatch('SET_CURRENT_PROJECT', projectJSON);
                router.push({path: 'projectPage'});
            },
            showLanguageSelectDlg: function(project) {
                this.selectedProject = project;
                this.showCheckDlg = true;
            },
            onInputDlgDestroy: function (param) {
                this.showInputDlg = false;
            },
            onCheckDlgDestroy: function (param) {
                this.showCheckDlg = false;
            }
        },
        components : {
            input_dlg,
            check_dlg
        }
    }
</script>

<style lang="less">
    #cam_manage {
        width:56%;left:21%;position:absolute;
        .select_title {
            margin-top:60px;
            font-size:1.3em;
        }

        .project_wrap {
            margin-top:10px;
            width:500px;
            button.lang_set_btn {
                background:#9abf7f;
                border-radius:30px;
                color:#fff;
                border:none;
                height:35px;
                width:120px;
                font-size:1.0em;
                padding:0 2em;
                cursor:pointer;
                transition:800ms ease all;
                outline:none;
                margin-right:20px;
                margin-top:40px;
            }
            button.project_btn {
                background:#1AAB8A;
                color:#fff;
                border:none;
                position:relative;
                height:75px;
                width:300px;
                font-size:1.6em;
                padding:0 2em;
                cursor:pointer;
                transition:800ms ease all;
                outline:none;
                margin-right:20px;
                margin-top:40px;
            }
            button.project_btn:hover{
                background:#fff;
                color:#1AAB8A;
            }
            button.project_btn:before,button.project_btn:after{
                content:'';
                position:absolute;
                top:0;
                right:0;
                height:2px;
                width:0;
                background: #1AAB8A;
                transition:400ms ease all;
            }
            button.project_btn:after{
                right:inherit;
                top:inherit;
                left:0;
                bottom:0;
            }
            button.project_btn:hover:before,button.project_btn:hover:after{
                width:100%;
                transition:800ms ease all;
            }
        }

        .create_project {
            position:fixed;
            right:140px;
            bottom:80px;
            /* 3D Button */
            .btn-3d {
                position: relative;
                display: inline-block;
                width:232px;
                height:50px;
                font-size: 21px;
                padding: 13px 60px;
                color: white;
                margin: 65px 0px 10px;
                border-radius: 6px;
                text-align: center;
                transition: top .01s linear;
                text-shadow: 0 1px 0 rgba(0,0,0,0.15);
                background-color: white;
                box-sizing: border-box;
            }
            .btn-3d.blue:hover   {background-color: #699DD1;}
            .btn-3d:active {
                top: 9px;
            }
            /* 3D button color */
            .btn-3d.blue {
                background-color: #6DA2D9;
                box-shadow: 0 0 0 1px #6698cb inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 8px 0 0 rgba(110, 164, 219, .7),
                0 8px 0 1px rgba(0,0,0,.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
            }
            .btn-3d.blue:active {
                box-shadow: 0 0 0 1px #6191C2 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
            }
        }
    }
</style>