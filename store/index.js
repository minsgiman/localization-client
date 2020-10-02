import Vuex from 'vuex'
import localeApi from './localeAPI';

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

        SORT_TRANSLATE_LIST : function({ commit, state }, sortType) {
          let translateList = sortTranslateList(state.currentTranslateList, sortType);
          commit('UPDATE_TRANSLATE_LIST', translateList);
          commit('UPDATE_SELECT_SORT_TYPE', sortType);
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

        async FETCH_USER({ commit }) {
          const response = await requestMiddleware(localeApi.getUser, null);
          commit('UPDATE_USER', response.user ? response.user : null);

          return response.user;
        },

        async FETCH_LOG_LIST({ state }) {
          const response = await requestMiddleware(localeApi.getLogList, state.currentProject.name);

          return (response && response.result) ? response.result : [];
        },

        async FETCH_TRANSLATE_LIST({ commit, state }) {
          commit('UPDATE_LOADING_STATE', true);
          const response = await requestMiddleware(localeApi.getTranslateList, state.currentProject.uuid);
          let translateList = (response && response.result) ? response.result : [];
          translateList = sortTranslateList(translateList, state.selectSortType);
          commit('UPDATE_TRANSLATE_LIST', translateList);
          commit('UPDATE_LOADING_STATE', false);

          return response;
        },

        async FETCH_SEARCHED_TRANSLATE_LIST({ commit, state }, search) {
          commit('UPDATE_LOADING_STATE', true);
          const response = await requestMiddleware(localeApi.getSearchList, search);
          let translateList = (response && response.result) ? response.result : [];
          translateList = sortTranslateList(translateList, state.selectSortType);
          commit('UPDATE_LOADING_STATE', false);

          return translateList;
        },

        async ADD_TRANSLATE({ commit, state }, strData) {
          commit('UPDATE_LOADING_STATE', true);
          const response = await requestMiddleware(localeApi.addTranslate, {strData, projectData: state.currentProject});
          if (response && response.code === 'ok') {
            commit('ADD_TRANSLATE_TO_CURRENT', response.data);
          }
          commit('UPDATE_LOADING_STATE', false);

          return response;
        },

        async UPDATE_TRANSLATE({ commit, state }, strData) {
          commit('UPDATE_LOADING_STATE', true);
          if (checkStrIdExist(state.currentTranslateList, strData.localeObj.strid, strData.stringId)) {
            commit('UPDATE_LOADING_STATE', false);
            return {code: 'duplicated'};
          }

          strData.project = state.currentProject.name;
          const response = await requestMiddleware(localeApi.updateTranslate, strData);
          if (response && response.code === 'ok') {
            commit('UPDATE_TRANSLATE_TO_CURRENT', response.data);
          }
          commit('UPDATE_LOADING_STATE', false);

          return response;
        },

        async REMOVE_TRANSLATE({ commit, state }, id) {
          commit('UPDATE_LOADING_STATE', true);
          const response = await requestMiddleware(localeApi.removeTranslate, {id, projectName: state.currentProject.name});
          if (response && response.code === 'ok') {
            commit('REMOVE_TRANSLATE_TO_CURRENT', id);
          }
          commit('UPDATE_LOADING_STATE', false);

          return response;
        },

        async REMOVE_ALL_TRANSLATE({ commit, state }, {name, uuid}) {
          commit('UPDATE_LOADING_STATE', true);
          const response = await requestMiddleware(localeApi.removeAllTranslateInProject, {name, uuid});
          if (response && response.code === 'ok') {
            commit('UPDATE_TRANSLATE_LIST', []);
          }
          commit('UPDATE_LOADING_STATE', false);

          return response;
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
