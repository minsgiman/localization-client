import Vue from 'vue';
import Vuex from 'vuex';
import localeApi from './localeAPI';
import gEventBus from './gEventBus';

Vue.use(Vuex);

function checkStrIdExist(list, strId, key) {
    let isExist = false, i, len = list.length;
    for (i = 0; i < len; i+=1) {
        if (list[i].id === key) {
            continue;
        }
        if (list[i].locale.strid === strId) {
            isExist = true;
        }
    }
    return isExist;
}

const store = new Vuex.Store({
    state: {
        projectList: [],
        currentTranslateList: [],
        currentProject: {},
        isLoading: false
    },
    getters: {
        // installListCount: state => {
        //     return state.installList.length;
        // }
    },
    actions: {
        FETCH_TRANSLATE_LIST : function(context) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.getTranslateList(store.state.currentProject.uuid, (response) => {
                let translateList = (response && response.result) ? response.result : [];
                context.commit('UPDATE_LOADING_STATE', false);
                context.commit('UPDATE_TRANSLATE_LIST', translateList);
                gEventBus.$emit('UPDATE_TRANSLATE_LIST');
            });
        },
        FETCH_TRANSLATE : function(context, strId) {
            localeApi.getTranslate(strId, (response) => {
                let translate = (response && response.result) ? response.result : null;
                gEventBus.$emit('FETCH_TRANSLATE', translate);
            });
        },
        ADD_TRANSLATE : function(context, strDataJSON) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.addTranslate(strDataJSON, store.state.currentProject, (response) => {
                if (response && response.code === 'ok') {
                    setTimeout(function () {
                        localeApi.getTranslateList(store.state.currentProject.uuid, (res) => {
                            let translateList = (res && res.result) ? res.result : [];
                            context.commit('UPDATE_LOADING_STATE', false);
                            context.commit('UPDATE_TRANSLATE_LIST', translateList);
                            gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                        });
                    }, 500);
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
                localeApi.updateTranslate(strDataJSON, (response) => {
                    if (response && response.code === 'ok') {
                        gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, true);
                    } else {
                        gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, false);
                    }
                    context.commit('UPDATE_LOADING_STATE', false);
                });
            }
        },
        REMOVE_TRANSLATE : function(context, stringId) {
            context.commit('UPDATE_LOADING_STATE', true);
            localeApi.removeTranslate(stringId, (response) => {
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
        UPDATE_LOADING_STATE : function(state, isLoading) {
            state.isLoading = isLoading;
        }
    }
});

export default store