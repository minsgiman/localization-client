<template>
    <div id="cam_manage">

        <h3 class="select_title">Project를 선택하세요</h3>
        <div class="project_wrap">
            <tree-table
                    ref="table"
                    sum-text="sum"
                    index-text="#"
                    :data="projectList"
                    :columns="tableColumns"
                    :stripe="tableProps.stripe"
                    :border="tableProps.border"
                    :show-header="tableProps.showHeader"
                    :show-summary="tableProps.showSummary"
                    :show-row-hover="tableProps.showRowHover"
                    :show-index="tableProps.showIndex"
                    :tree-type="tableProps.treeType"
                    :is-fold="tableProps.isFold"
                    :expand-type="tableProps.expandType"
                    expand-key="name"
                    @cell-click="cellClick"
                    @cell-dblclick="cellDbclick"
                    :selectable="tableProps.selectable">
            </tree-table>
        </div>
        <div class="create_project search_wrap">
            <a class="btn-3d blue" v-on:click="showSearchDlg = true">{{searchTxt}}</a>
        </div>
        <div class="create_project">
            <a class="btn-3d blue" v-on:click="showInputDlg = true">{{projectCreateTxt}}</a>
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
        <remove_dlg
                v-if="showDeleteDlg"
                v-bind:project="selectedProject"
                v-on:destroy="onDeleteDlgDestroy()">
        </remove_dlg>
        <search_dlg
                v-if="showSearchDlg"
                v-bind:title="searchTxt"
                v-on:destroy="onSearchDlgDestroy()">
        </search_dlg>
    </div>
</template>

<script>
    import input_dlg from '@/components/input_dialog';
    import check_dlg from '@/components/check_dialog';
    import search_dlg from '@/components/search_dialog';
    import remove_dlg from '@/components/project_remove_dialog';

    export default {
        data : function() {
            return {
                showInputDlg : false,
                showCheckDlg : false,
                showDeleteDlg : false,
                showSearchDlg : false,
                selectedProject : null,
                projectCreateTxt : "Project 생성",
                searchTxt : "번역 전체 검색",
                projectLangTxt : "언어설정",
                projectCreateInputType : 'projectname',
                tableProps: {
                    stripe: false,
                    border: true,
                    showHeader: true,
                    showSummary: false,
                    showRowHover: false,
                    showIndex: false,
                    treeType: true,
                    isFold: false,
                    expandType: false,
                    selectable: false
                },
                tableColumns: [
                    {
                        title: '프로젝트명',
                        key: 'name',
                        minWidth: '120px',
                    },
                    {
                        title: '언어설정',
                        key: 'set',
                        minWidth: '30px'
                    },
                    {
                        title: '삭제',
                        key: 'remove',
                        minWidth: '30px'
                    },
                ]
            }
        },
        computed : {
            projectList : function () {
                const tableList = [
                    {name: 'aos', set: '', remove: '', children: []},
                    {name: 'ios', set: '', remove: '', children: []},
                    {name: 'web', set: '', remove: '', children: []},
                    {name: 'etc', set: '', remove: '', children: []}
                ],
                aosList = tableList[0].children,
                iosList = tableList[1].children,
                webList = tableList[2].children,
                etcList = tableList[3].children;

                this.$store.state.projectList.forEach((project) => {
                    const lowerName = project.name ? project.name.toLowerCase() : '',
                        pushItem = {name: project.name, set: 'Click', remove: 'Click', uuid: project.uuid};

                    if (lowerName.indexOf('aos') !== -1) {
                        aosList.push(pushItem);
                    } else if (lowerName.indexOf('ios') !== -1) {
                        iosList.push(pushItem);
                    } else if (lowerName.indexOf('web') !== -1) {
                        webList.push(pushItem);
                    } else {
                        etcList.push(pushItem);
                    }
                });

                return tableList;
            },
            storeProjectList: function() {
                return this.$store.state.projectList;
            }
        },
        created : function() {
        },
        mounted : function() {
            this.$store.dispatch('FETCH_USER').then((user) => {
                if (user) {
                    this.$store.dispatch('FETCH_PROJECT_LIST');
                } else {
                    this.$router.push('/login');
                }
            });
        },
        beforeDestroy : function() {
        },
        methods : {
            selectProject: function(projectJSON) {
                //this.$store.dispatch('SET_CURRENT_PROJECT', projectJSON);
                this.$router.push('/project?' + 'name=' + projectJSON.name + '&uuid=' + projectJSON.uuid + '&languages=' + projectJSON.languages);
            },
            showLanguageSelectDlg: function(project) {
                this.selectedProject = project;
                this.showCheckDlg = true;
            },
            showProjectDeleteDlg: function(project) {
                this.selectedProject = project;
                this.showDeleteDlg = true;
            },
            onInputDlgDestroy: function (param) {
                this.showInputDlg = false;
            },
            onCheckDlgDestroy: function (param) {
                this.showCheckDlg = false;
            },
            onDeleteDlgDestroy: function (param) {
                this.showDeleteDlg = false;
            },
            onSearchDlgDestroy: function (param) {
                this.showSearchDlg = false;
            },
            cellClick: function(row, rowIndex, column, columnIndex, $event) {
                if (row.uuid) {
                    const selectProject = this.storeProjectList.find((item) => item.uuid === row.uuid);
                    if (selectProject) {
                        if (columnIndex === 0) { //go translate List
                            this.selectProject(selectProject);
                        } else if (columnIndex === 1) { //Language Set
                            this.showLanguageSelectDlg(selectProject);
                        } else if (columnIndex === 2) { //remove
                            this.showProjectDeleteDlg(selectProject);
                        }
                    }
                }
                $event.preventDefault();
                $event.stopPropagation();
            },
            cellDbclick: function(row, rowIndex, column, columnIndex, $event) {
                $event.preventDefault();
                $event.stopPropagation();
            },
        },
        components : {
            input_dlg,
            check_dlg,
            remove_dlg,
            search_dlg
        }
    }
</script>

<style lang="scss">
    #cam_manage {
        width:56%;left:21%;position:absolute;
        .select_title {
            margin-top:60px;
            font-size:1.3em;
        }

        .project_wrap {
            margin-top:20px;
            width:700px;
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
            &.search_wrap {
                bottom: 196px;
                .btn-3d {
                    font-size: 18px;
                }
            }
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

        .zk-table {
            font-size:16px;
            .zk-table__body-cell {
                cursor:pointer;
                &:hover {
                    background-color:#ebf7ff;
                }
            }

        }
    }
</style>