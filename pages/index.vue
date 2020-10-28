<template>
    <div class="cam-manage-cont" v-show="renderPage">
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
                :selectable="tableProps.selectable"
            >
            </tree-table>
        </div>
        <div class="manage-btns-wrap">
            <div
                v-if="isAdmin"
                v-ripple="'rgba(255, 255, 255, 0.35)'"
                @click="showAccCreateDlg = true"
                class="btn-ripple style-blue"
            >
                계정 생성
            </div>
            <div
                v-ripple="'rgba(255, 255, 255, 0.35)'"
                @click="showSearchDlg = true"
                class="btn-ripple style-blue"
            >
                {{ searchTxt }}
            </div>
            <div
                v-ripple="'rgba(255, 255, 255, 0.35)'"
                @click="showInputDlg = true"
                class="btn-ripple style-blue"
            >
                {{ projectCreateTxt }}
            </div>
        </div>
        <input_dlg
            v-if="showInputDlg"
            v-bind:title="projectCreateTxt"
            v-bind:input-type="projectCreateInputType"
            v-on:destroy="onInputDlgDestroy()"
        >
        </input_dlg>
        <check_dlg
            v-if="showCheckDlg"
            v-bind:title="projectLangTxt"
            v-bind:project="selectedProject"
            v-on:destroy="onCheckDlgDestroy()"
        >
        </check_dlg>
        <remove_dlg
            v-if="showDeleteDlg"
            v-bind:project="selectedProject"
            v-on:destroy="onDeleteDlgDestroy()"
        >
        </remove_dlg>
        <search_dlg
            v-if="showSearchDlg"
            v-bind:title="searchTxt"
            v-on:destroy="onSearchDlgDestroy()"
        >
        </search_dlg>
        <acc_create_dlg
            v-if="showAccCreateDlg"
            v-on:destroy="onAccCreateDlgDestroy()"
        >
        </acc_create_dlg>
    </div>
</template>

<script>
import input_dlg from "@/components/input_dialog";
import check_dlg from "@/components/check_dialog";
import search_dlg from "@/components/search_dialog";
import remove_dlg from "@/components/project_remove_dialog";
import acc_create_dlg from "@/components/acc_create_dialog";

export default {
    data: function() {
        return {
            renderPage: false,
            showInputDlg: false,
            showCheckDlg: false,
            showDeleteDlg: false,
            showSearchDlg: false,
            showAccCreateDlg: false,
            selectedProject: null,
            projectCreateTxt: "Project 생성",
            searchTxt: "번역 전체 검색",
            projectLangTxt: "언어설정",
            projectCreateInputType: "projectname",
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
                    title: "프로젝트명",
                    key: "name",
                    minWidth: "120px"
                },
                {
                    title: "언어설정",
                    key: "set",
                    minWidth: "30px"
                },
                {
                    title: "삭제",
                    key: "remove",
                    minWidth: "30px"
                }
            ]
        };
    },
    computed: {
        isAdmin: function() {
            return this.$store.getters.isAdminUser;
        },
        projectList: function() {
            const tableList = [
                    { name: "aos", set: "", remove: "", children: [] },
                    { name: "ios", set: "", remove: "", children: [] },
                    { name: "web", set: "", remove: "", children: [] },
                    { name: "etc", set: "", remove: "", children: [] }
                ],
                aosList = tableList[0].children,
                iosList = tableList[1].children,
                webList = tableList[2].children,
                etcList = tableList[3].children;

            this.$store.state.projectList.forEach(project => {
                const lowerName = project.name
                        ? project.name.toLowerCase()
                        : "",
                    pushItem = {
                        name: project.name,
                        set: "Click",
                        remove: "Click",
                        uuid: project.uuid
                    };

                if (lowerName.indexOf("aos") !== -1) {
                    aosList.push(pushItem);
                } else if (lowerName.indexOf("ios") !== -1) {
                    iosList.push(pushItem);
                } else if (lowerName.indexOf("web") !== -1) {
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
    mounted: function() {
        this.$store.dispatch("FETCH_USER").then(user => {
            if (user) {
                this.renderPage = true;
                this.$store.dispatch("FETCH_PROJECT_LIST");
            } else {
                this.$router.push("/login");
            }
        });
    },
    beforeDestroy: function() {},
    methods: {
        selectProject: function(projectJSON) {
            //this.$store.dispatch('SET_CURRENT_PROJECT', projectJSON);
            this.$router.push("/project?" + "name=" + projectJSON.name);
        },
        showLanguageSelectDlg: function(project) {
            this.selectedProject = project;
            this.showCheckDlg = true;
        },
        showProjectDeleteDlg: function(project) {
            this.selectedProject = project;
            this.showDeleteDlg = true;
        },
        onInputDlgDestroy: function(param) {
            this.showInputDlg = false;
        },
        onCheckDlgDestroy: function(param) {
            this.showCheckDlg = false;
        },
        onDeleteDlgDestroy: function(param) {
            this.showDeleteDlg = false;
        },
        onSearchDlgDestroy: function(param) {
            this.showSearchDlg = false;
        },
        onAccCreateDlgDestroy: function(param) {
            this.showAccCreateDlg = false;
        },
        cellClick: function(row, rowIndex, column, columnIndex, $event) {
            if (row.uuid) {
                const selectProject = this.storeProjectList.find(
                    item => item.uuid === row.uuid
                );
                if (selectProject) {
                    if (columnIndex === 0) {
                        //go translate List
                        this.selectProject(selectProject);
                    } else if (columnIndex === 1) {
                        //Language Set
                        this.showLanguageSelectDlg(selectProject);
                    } else if (columnIndex === 2) {
                        //remove
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
        }
    },
    components: {
        input_dlg,
        check_dlg,
        remove_dlg,
        search_dlg,
        acc_create_dlg
    }
};
</script>

<style lang="scss">
.cam-manage-cont {
    width: 56%;
    left: 21%;
    position: absolute;

    .select_title {
        margin-top: 60px;
        font-size: 1.3em;
    }

    .project_wrap {
        margin-top: 20px;
        width: 700px;
    }

    .manage-btns-wrap {
        position: absolute;
        right: -260px;
        top: 600px;
        .btn-ripple {
            margin-bottom: 60px;
        }
    }
}
</style>
