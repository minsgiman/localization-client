import Vue from 'vue';
import Vuex from 'vuex';
import localeApi from './localeAPI';
import gEventBus from './gEventBus';

Vue.use(Vuex);

function checkStrIdExist(list, strId, key) {
    let isExist = false, i, len = list.length;
    for (i = 0; i < len; i+=1) {
        if (list[i].uid === key) {
            continue;
        }
        if (list[i].strid === strId) {
            isExist = true;
        }
    }
    return isExist;
}

function sortTranslateList(list, type) {
    list.sort(function (a, b) {
        var aLabel, bLabel;

        if (type.indexOf('strid') != -1) {
            aLabel = (a && a.strid) ? a.strid.toLowerCase() : '';
            bLabel = (b && b.strid) ? b.strid.toLowerCase() : '';
        } else if (type.indexOf('base') != -1) {
            aLabel = (a && a.base) ? a.base.toLowerCase() : '';
            bLabel = (b && b.base) ? b.base.toLowerCase() : '';
        } else {
            aLabel = (a && a.uid) ? a.uid.toLowerCase() : '';
            bLabel = (b && b.uid) ? b.uid.toLowerCase() : '';
        }

        if (type.indexOf('rev') != -1) {
            return aLabel > bLabel ? -1 : aLabel < bLabel ? 1 : 0;
        } else {
            return aLabel < bLabel ? -1 : aLabel > bLabel ? 1 : 0;
        }
    });
    return list;
}

const store = new Vuex.Store({
    state: {
        projectList: [],
        currentTranslateList: [],
        currentProject: {},
        currentEditTranslateId: '',
        isLoading: false,
        selectSortType: 'strid' // strid, strid-rev, base, base-rev, key, key-rev
    },
    getters: {
        // installListCount: state => {
        //     return state.installList.length;
        // }
    },
    actions: {
        SORT_TRANSLATE_LIST : function(context, sortType) {
            let translateList = sortTranslateList(store.state.currentTranslateList, sortType);
            context.commit('UPDATE_TRANSLATE_LIST', translateList);
            context.commit('UPDATE_SELECT_SORT_TYPE', sortType);
            gEventBus.$emit('UPDATE_TRANSLATE_LIST');
            setTimeout(function() {
                context.commit('UPDATE_LOADING_STATE', false);
            }, 100);
        },
        SET_LOADING : function(context) {
            context.commit('UPDATE_LOADING_STATE', true);
        },
        UPDATE_EDIT_TRANSLATE_ID : function(context, strId) {
            context.commit('UPDATE_EDIT_TRANSLATE_ID', strId);
        },
        FETCH_LOG_LIST : function(context) {
            localeApi.getLogList(store.state.currentProject.name, (response) => {
                let logList = (response && response.result) ? response.result : [];
                gEventBus.$emit('FETCH_LOG_LIST', logList);
            });
        },
        FETCH_TRANSLATE_LIST : function(context) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.getTranslateList(store.state.currentProject.uuid, (response) => {
                let translateList = (response && response.result) ? response.result : [];
                translateList = sortTranslateList(translateList, store.state.selectSortType);
                context.commit('UPDATE_TRANSLATE_LIST', translateList);
                gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                setTimeout(function () {
                    context.commit('UPDATE_LOADING_STATE', false);
                }, 500);
            });
        },
        FETCH_SEARCHED_TRANSLATE_LIST : function(context, search) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.getSearchList(search, (response) => {
                let translateList = (response && response.result) ? response.result : [];
                translateList = sortTranslateList(translateList, store.state.selectSortType);
                gEventBus.$emit('SEARCH_TRANSLATE_LIST', translateList);
                setTimeout(function () {
                    context.commit('UPDATE_LOADING_STATE', false);
                }, 500);
            });
        },
        ADD_TRANSLATE : function(context, strDataJSON) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.addTranslate(strDataJSON, store.state.currentProject, (response) => {
                if (response && response.code === 'ok') {
                    context.commit('ADD_TRANSLATE_TO_CURRENT', response.data);
                    setTimeout(function () {
                        context.commit('UPDATE_LOADING_STATE', false);
                        // localeApi.getTranslateList(store.state.currentProject.uuid, (res) => {
                        //     let translateList = (res && res.result) ? res.result : [];
                        //     translateList = sortTranslateList(translateList, store.state.selectSortType);
                        //     context.commit('UPDATE_TRANSLATE_LIST', translateList);
                        //     gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                        //     context.commit('UPDATE_LOADING_STATE', false);
                        // });
                    }, 0);
                    gEventBus.$emit('ADD_TRANSLATE', true);
                } else {
                    context.commit('UPDATE_LOADING_STATE', false);
                    gEventBus.$emit('ADD_TRANSLATE', false);
                }
            });
        },
        UPDATE_TRANSLATE : function(context, strDataJSON) {
            context.commit('UPDATE_LOADING_STATE', true);
            if (checkStrIdExist(store.state.currentTranslateList, strDataJSON.localeObj.strid, strDataJSON.stringId)) {
                alert('중복된 StringID입니다.');
                gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, false);
                context.commit('UPDATE_LOADING_STATE', false);
            } else {
                strDataJSON.project = store.state.currentProject.name;
                localeApi.updateTranslate(strDataJSON, (response) => {
                    if (response && response.code === 'ok') {
                        gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, true);
                        context.commit('UPDATE_TRANSLATE_TO_CURRENT', response.data);
                        setTimeout(function () {
                            context.commit('UPDATE_LOADING_STATE', false);
                        }, 0);
                        // localeApi.getTranslateList(store.state.currentProject.uuid, (res) => {
                        //     let translateList = (res && res.result) ? res.result : [];
                        //     translateList = sortTranslateList(translateList, store.state.selectSortType);
                        //     context.commit('UPDATE_TRANSLATE_LIST', translateList);
                        //     gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                        //     setTimeout(function () {
                        //         context.commit('UPDATE_LOADING_STATE', false);
                        //     }, 500);
                        // });
                    } else {
                        gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, false);
                        context.commit('UPDATE_LOADING_STATE', false);
                    }
                });
            }
        },
        REMOVE_TRANSLATE : function(context, strDataJSON) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.removeTranslate(strDataJSON, store.state.currentProject.name, (response) => {
                if (response && response.code === 'ok') {
                    context.commit('REMOVE_TRANSLATE_TO_CURRENT', strDataJSON.id);
                    setTimeout(function () {
                        context.commit('UPDATE_LOADING_STATE', false);
                        // localeApi.getTranslateList(store.state.currentProject.uuid, (res) => {
                        //     let translateList = (res && res.result) ? res.result : [];
                        //     translateList = sortTranslateList(translateList, store.state.selectSortType);
                        //     context.commit('UPDATE_TRANSLATE_LIST', translateList);
                        //     gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                        //     context.commit('UPDATE_LOADING_STATE', false);
                        // });
                    }, 0);
                    gEventBus.$emit('REMOVE_TRANSLATE', true);
                } else {
                    context.commit('UPDATE_LOADING_STATE', false);
                    gEventBus.$emit('REMOVE_TRANSLATE', false);
                }
            });
        },
        REMOVE_ALL_TRANSLATE : function(context, data) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.removeAllTranslateInProject(data.name, data.uuid, (response) => {
                if (response && response.code === 'ok') {
                    setTimeout(function () {
                        localeApi.getTranslateList(store.state.currentProject.uuid, (res) => {
                            let translateList = (res && res.result) ? res.result : [];
                            context.commit('UPDATE_LOADING_STATE', false);
                            context.commit('UPDATE_TRANSLATE_LIST', translateList);
                            gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                        });
                    }, 500);
                    gEventBus.$emit('REMOVE_TRANSLATE', true);
                } else {
                    context.commit('UPDATE_LOADING_STATE', false);
                    gEventBus.$emit('REMOVE_TRANSLATE', false);
                }
            });
        },
        REMOVE_PROJECT : function(context, data) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.removeProject(data.name, data.uuid, (response) => {
                if (response && response.code === 'ok') {
                    setTimeout(function () {
                        localeApi.getProjects((response) => {
                            let projectList = (response && response.list) ? response.list : [];
                            context.commit('UPDATE_PROJECT_LIST', projectList);
                            context.commit('UPDATE_LOADING_STATE', false);
                            gEventBus.$emit('REMOVE_PROJECT', true);
                        });
                    }, 500);
                } else {
                    context.commit('UPDATE_LOADING_STATE', false);
                    gEventBus.$emit('REMOVE_PROJECT', false);
                }
            });
        },
        FETCH_PROJECT_LIST : function(context) {
            localeApi.getProjects((response) => {
                let projectList = (response && response.list) ? response.list : [];
                context.commit('UPDATE_PROJECT_LIST', projectList);
            });
        },
        UPDATE_PROJECT : function(context, data) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.updateProject(data.name, data.languages, data.uuid, (response) => {
                if (response && response.code === 'ok') {
                    setTimeout(function () {
                        localeApi.getProjects((res) => {
                            let projectList = (res && res.list) ? res.list : [];
                            context.commit('UPDATE_PROJECT_LIST', projectList);
                            gEventBus.$emit('UPDATE_PROJECT', true);
                            context.commit('UPDATE_LOADING_STATE', false);
                        });
                    }, 500);
                } else {
                    gEventBus.$emit('UPDATE_PROJECT', false);
                    context.commit('UPDATE_LOADING_STATE', false);
                }
            });
        },
        CREATE_PROJECT : function(context, data) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.createProject(data.name, data.languages, (response) => {
                if (response && response.code === 'ok') {
                    setTimeout(function () {
                        localeApi.getProjects((res) => {
                            let projectList = (res && res.list) ? res.list : [];
                            context.commit('UPDATE_PROJECT_LIST', projectList);
                            gEventBus.$emit('CREATE_PROJECT', true);
                            context.commit('UPDATE_LOADING_STATE', false);
                        });
                    }, 500);
                } else {
                    gEventBus.$emit('CREATE_PROJECT', false);
                    context.commit('UPDATE_LOADING_STATE', false);
                }
            });
        },
        SET_CURRENT_PROJECT: function(context, projectJSON) {
            context.commit('UPDATE_CURRENT_PROJECT', projectJSON);
        }
    },
    mutations: {
        UPDATE_PROJECT_LIST : function(state, list) {
            state.projectList = list;
        },
        UPDATE_CURRENT_PROJECT : function(state, projectJSON) {
            state.currentProject = projectJSON;
        },
        UPDATE_TRANSLATE_LIST : function(state, list) {
            state.currentTranslateList = list;
        },
        ADD_TRANSLATE_TO_CURRENT : function(state, data) {
            state.currentTranslateList.splice(0, 0, data);
        },
        UPDATE_TRANSLATE_TO_CURRENT : function(state, data) {
            let i, len = state.currentTranslateList.length;
            for (i = 0; i < len; i+=1) {
                if (state.currentTranslateList[i].uid === data.uid) {
                    state.currentTranslateList[i] = data;
                }
            }
        },
        REMOVE_TRANSLATE_TO_CURRENT : function(state, strid) {
            let i, len = state.currentTranslateList.length;
            for (i = 0; i < len; i+=1) {
                if (state.currentTranslateList[i] && state.currentTranslateList[i].uid === strid) {
                    state.currentTranslateList.splice(i, 1);
                }
            }
        },
        UPDATE_LOADING_STATE : function(state, isLoading) {
            state.isLoading = isLoading;
        },
        UPDATE_EDIT_TRANSLATE_ID : function(state, strid) {
            state.currentEditTranslateId = strid;
        },
        UPDATE_SELECT_SORT_TYPE : function(state, type) {
            state.selectSortType = type;
        }
    }
});

export default store