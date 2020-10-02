import axios from "axios/index";
import jquery from "jquery";
import qs from "qs";

const api = process.env.baseUrl;
const supportLangs = process.env.suportLanguages;
const baseLang = process.env.baseLanguage;
const tokenKey = process.env.tokenKey;

function ajaxNoAuthCheck(error) {
    return (error.status === 401 || error.status === 403);
}

function getFileName(lang, type) {
  if (type === 'json' || type === 'xml') {
    return `locale-${lang}.${type}`;
  }
  if (type === 'xlsx') {
    return 'locale.xlsx';
  }
  if (type === 'ascii') {
    return `Messages_${lang}.properties`;
  }
  return 'noname';
}

function getFormData(dataObj) {
  const bodyFormData = new FormData();
  let key;
  if (dataObj) {
    for (key in dataObj) {
      bodyFormData.append(key, dataObj[key]);
    }
  }
  return bodyFormData;
}

const localeAPI = {
    getLogList: (projectName) => {
        return axios.get(`${api}/projects/${projectName}/logs`,
        {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
    },
    getSampleFile: () => {
        jquery.ajax({
          type: 'GET',
          url: `${api}/translates/sampleFile`,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
          },
          xhrFields: {
            responseType: 'blob'
          },
          success: function (blob) {
            const windowUrl = window.URL || window.webkitURL;
            const url = windowUrl.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'sample.xlsx';
            anchor.click();
            windowUrl.revokeObjectURL(url);
          },
          error: function (error) {
            ajaxNoAuthCheck(error) ? location.href = '/login' : null;
          }
        });
    },
    getTranslateFile: ({projectName, lang, type}) => {
        jquery.ajax({
          type: 'GET',
          url: `${api}/translates/file?projectName=${projectName}&lang=${lang}&type=${type}`,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
          },
          xhrFields: {
            responseType: 'blob'
          },
          success: function (blob) {
            const windowUrl = window.URL || window.webkitURL;
            const url = windowUrl.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = getFileName(lang, type);
            anchor.click();
            windowUrl.revokeObjectURL(url);
          },
          error: function (error) {
            ajaxNoAuthCheck(error) ? location.href = '/login' : null;
          }
        });
    },
    getProjects: () => {
        return axios.get(`${api}/projects`,
      {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
    },
    getTranslateList: (projectUUID) => {
        return axios.get(`${api}/translateList?projectUUID=${projectUUID}`,
        {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
    },
    getSearchList: (search) => {
        return axios.get(`${api}/translates/search?search=${search}`,
        {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
    },
    addTranslate: ({strData, projectData}) => {
      let i, len, dataObj = {
          project: projectData.name,
          uuid: projectData.uuid,
          base: strData[baseLang] ? strData[baseLang] : '',
          tag: strData.tag ? strData.tag : ''
      };
      for (i = 0, len = supportLangs.length; i < len; i+=1) {
          dataObj[supportLangs[i]] = strData[supportLangs[i]] ? strData[supportLangs[i]] : '';
      }

      return axios.post(
    `${api}/translates`, qs.stringify(dataObj),
    {headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
       }})
    },
    updateTranslate: (strData) => {
        let i, len, dataObj = {
            strid: strData.localeObj.strid,
            tag: strData.localeObj.tag,
            base: strData.localeObj.base ? strData.localeObj.base : '',
            project: strData.project
        };
        for (i = 0, len = supportLangs.length; i < len; i+=1) {
            dataObj[supportLangs[i]] = strData.localeObj[supportLangs[i]] ? strData.localeObj[supportLangs[i]] : '';
        }

        return axios.put(
      `${api}/translates/${strData.stringId}`, qs.stringify(dataObj),
      {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
        }})
    },
    removeTranslate: ({id, projectName}) => {
        return axios.delete(
        `${api}/translates/${id}`,
      {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
        }, params: {
          project: projectName
        }})
    },
    removeAllTranslateInProject: ({name, uuid}) => {
      return axios.delete(
    `${api}/projects/${name}/translates`,
    {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
      }, params: { uuid }})
    },
    removeProject: ({name, uuid}) => {
      return axios.delete(
    `${api}/projects/${name}`,
    {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
      }, params: { uuid }})
    },
    updateProject: ({name, languages}) => {
      return axios.put(
    `${api}/projects/${name}`, qs.stringify({languages}),
    {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
      }})
    },
    createProject: ({name, languages}) => {
      return axios.post(
    `${api}/projects`, qs.stringify({name, languages}),
    {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
      }})
    },
    getUser: () => {
        return axios.get(`${api}/users/me`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}});
    },
    login: ({id, password}) => {
        return axios.post(
      `${api}/users/login`, qs.stringify({id, password}),
      {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
        }})
    },
    createUser: ({id, password}) => {
        return axios.post(
      `${api}/users/signup`, qs.stringify({id, password, admin: false}),
      {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
        }})
    }
};

export default localeAPI;
