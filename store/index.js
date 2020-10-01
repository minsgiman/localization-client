import Vuex from 'vuex'
import localeApi from './localeAPI';
import gEventBus from './gEventBus';

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

async function requestMiddleware(apiMethod, param) {
  const apiRes = await apiMethod(param);
  return apiRes ? apiRes.data : null;
}

const createStore = () => {
    return new Vuex.Store({
      state: {
        projectList: [],
        currentTranslateList: [],
        currentProject: {},
        currentEditTranslateId: '',
        isLoading: false,
        user: null,
        selectSortType: 'strid' // strid, strid-rev, base, base-rev, key, key-rev
      },
      getters: {
        // installListCount: state => {
        //     return state.installList.length;
        // }
      },
      actions: {
        async REQUEST_LOGIN({ commit }, {id, password}) {
          commit('UPDATE_LOADING_STATE', true);
          const response = await requestMiddleware(localeApi.login, {id, password});
          commit('UPDATE_LOADING_STATE', false);
          return response;
        },
        REQUEST_LOGOUT: function({ commit }) {
          localStorage.removeItem(process.env.tokenKey);
          commit('UPDATE_USER', null);
          commit('UPDATE_LOADING_STATE', false);
        },
        async FETCH_USER({ commit }) {
          const response = await requestMiddleware(localeApi.getUser, null);
          commit('UPDATE_USER', response.user ? response.user : null);
          return response.user;
        },
        SORT_TRANSLATE_LIST : function({ commit, state }, sortType) {
          let translateList = sortTranslateList(state.currentTranslateList, sortType);
          commit('UPDATE_TRANSLATE_LIST', translateList);
          commit('UPDATE_SELECT_SORT_TYPE', sortType);
          gEventBus.$emit('UPDATE_TRANSLATE_LIST');
          setTimeout(function() {
            commit('UPDATE_LOADING_STATE', false);
          }, 100);
        },
        SET_LOADING : function({ commit }, param) {
          commit('UPDATE_LOADING_STATE', param);
        },
        UPDATE_EDIT_TRANSLATE_ID : function({ commit }, strId) {
          commit('UPDATE_EDIT_TRANSLATE_ID', strId);
        },
        FETCH_SAMPLE_FILE : function() {
          localeApi.getSampleFile();
        },
        FETCH_TRANSLATE_FILE : function({}, {projectName, lang, type}) {
          localeApi.getTranslateFile({projectName, lang, type});
        },
        FETCH_LOG_LIST : function({ state }) {
          localeApi.getLogList(state.currentProject.name, (response) => {
            let logList = (response && response.result) ? response.result : [];
            gEventBus.$emit('FETCH_LOG_LIST', logList);
          });
        },
        FETCH_TRANSLATE_LIST : function({ commit, state }) {
          commit('UPDATE_LOADING_STATE', true);
          localeApi.getTranslateList(state.currentProject.uuid, (response) => {
            let translateList = (response && response.result) ? response.result : [];
            translateList = sortTranslateList(translateList, state.selectSortType);
            commit('UPDATE_TRANSLATE_LIST', translateList);
            gEventBus.$emit('UPDATE_TRANSLATE_LIST');
            setTimeout(function () {
              commit('UPDATE_LOADING_STATE', false);
            }, 500);
          });
        },
        FETCH_SEARCHED_TRANSLATE_LIST : function({ commit, state }, search) {
          commit('UPDATE_LOADING_STATE', true);
          localeApi.getSearchList(search, (response) => {
            let translateList = (response && response.result) ? response.result : [];
            translateList = sortTranslateList(translateList, state.selectSortType);
            gEventBus.$emit('SEARCH_TRANSLATE_LIST', translateList);
            setTimeout(function () {
              commit('UPDATE_LOADING_STATE', false);
            }, 500);
          });
        },
        ADD_TRANSLATE : function({ commit, state }, strDataJSON) {
          commit('UPDATE_LOADING_STATE', true);
          localeApi.addTranslate(strDataJSON, state.currentProject, (response) => {
            if (response && response.code === 'ok') {
              commit('ADD_TRANSLATE_TO_CURRENT', response.data);
              setTimeout(function () {
                commit('UPDATE_LOADING_STATE', false);
              }, 0);
              gEventBus.$emit('ADD_TRANSLATE', true);
            } else {
              commit('UPDATE_LOADING_STATE', false);
              gEventBus.$emit('ADD_TRANSLATE', false);
            }
          });
        },
        UPDATE_TRANSLATE : function({ commit, state }, strDataJSON) {
          commit('UPDATE_LOADING_STATE', true);
          if (checkStrIdExist(state.currentTranslateList, strDataJSON.localeObj.strid, strDataJSON.stringId)) {
            alert('중복된 StringID입니다.');
            gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, false);
            commit('UPDATE_LOADING_STATE', false);
          } else {
            strDataJSON.project = state.currentProject.name;
            localeApi.updateTranslate(strDataJSON, (response) => {
              if (response && response.code === 'ok') {
                gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, true);
                commit('UPDATE_TRANSLATE_TO_CURRENT', response.data);
                setTimeout(function () {
                  commit('UPDATE_LOADING_STATE', false);
                }, 0);
              } else {
                gEventBus.$emit('UPDATE_TRANSLATE_' + strDataJSON.stringId, false);
                commit('UPDATE_LOADING_STATE', false);
              }
            });
          }
        },
        REMOVE_TRANSLATE : function({ commit, state }, strDataJSON) {
          commit('UPDATE_LOADING_STATE', true);
          localeApi.removeTranslate(strDataJSON, state.currentProject.name, (response) => {
            if (response && response.code === 'ok') {
              commit('REMOVE_TRANSLATE_TO_CURRENT', strDataJSON.id);
              setTimeout(function () {
                commit('UPDATE_LOADING_STATE', false);
              }, 0);
              gEventBus.$emit('REMOVE_TRANSLATE', true);
            } else {
              commit('UPDATE_LOADING_STATE', false);
              gEventBus.$emit('REMOVE_TRANSLATE', false);
            }
          });
        },
        REMOVE_ALL_TRANSLATE : function({ commit, state }, data) {
          commit('UPDATE_LOADING_STATE', true);
          localeApi.removeAllTranslateInProject(data.name, data.uuid, (response) => {
            if (response && response.code === 'ok') {
              setTimeout(function () {
                localeApi.getTranslateList(state.currentProject.uuid, (res) => {
                  let translateList = (res && res.result) ? res.result : [];
                  commit('UPDATE_LOADING_STATE', false);
                  commit('UPDATE_TRANSLATE_LIST', translateList);
                  gEventBus.$emit('UPDATE_TRANSLATE_LIST');
                });
              }, 500);
              gEventBus.$emit('REMOVE_TRANSLATE', true);
            } else {
              commit('UPDATE_LOADING_STATE', false);
              gEventBus.$emit('REMOVE_TRANSLATE', false);
            }
          });
        },
        async REMOVE_PROJECT({ commit }, {name, uuid}) {
          const response = await requestMiddleware(localeApi.removeProject, {name, uuid});
          return response;
        },
        async FETCH_PROJECT_LIST({ commit }) {
          const response = await requestMiddleware(localeApi.getProjects);
          const projectList = (response && response.list) ? response.list : [];
          commit('UPDATE_PROJECT_LIST', projectList);
          return projectList;
        },
        async UPDATE_PROJECT({ commit }, {name, languages}) {
          const response = await requestMiddleware(localeApi.updateProject, {name, languages});
          return response;
        },
        async CREATE_PROJECT({ commit }, {name, languages}) {
          const response = await requestMiddleware(localeApi.createProject, {name, languages});
          return response;
        },
        SET_CURRENT_PROJECT: function({ commit }, projectJSON) {
          commit('UPDATE_CURRENT_PROJECT', projectJSON);
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
        },
        UPDATE_USER : function(state, user) {
          state.user = user;
        }
      }
    })
}

export default createStore;
