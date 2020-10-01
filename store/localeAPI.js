import axios from "axios/index";
import jquery from "jquery";
import qs from "qs";

const api = process.env.baseUrl;
const supportLangs = process.env.suportLanguages;
const baseLang = process.env.baseLanguage;
const tokenKey = process.env.tokenKey;

function axiosNoAuthCheck(error) {
    return (error.response && (error.response.status === 401 || error.response.status === 403));
}

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
    getLogList: (projectName, callback) => {
        axios.get(`${api}/projects/${projectName}/logs`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('get logList Error : ' + error);
                axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
            });
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
    getTranslateList: (projectUUID, callback) => {
        axios.get(`${api}/translateList?projectUUID=${projectUUID}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('getTranslateList Error : ' + error);
                axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
            });
    },
    getSearchList: (search, callback) => {
        axios.get(`${api}/translates/search?search=${search}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('searchTranslate Error : ' + error);
                axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
            });
    },
    addTranslate: (strDataJSON, projectJSON, callback) => {
        let i, len, dataObj = {
            project: projectJSON.name,
            uuid: projectJSON.uuid,
            base: strDataJSON[baseLang] ? strDataJSON[baseLang] : '',
            tag: strDataJSON.tag ? strDataJSON.tag : ''
        };
        for (i = 0, len = supportLangs.length; i < len; i+=1) {
            dataObj[supportLangs[i]] = strDataJSON[supportLangs[i]] ? strDataJSON[supportLangs[i]] : '';
        }

        return axios.post(
      `${api}/translates`, qs.stringify(dataObj),
      {headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
         }})
        .then((response) => {
          callback(response.data);
        }, (error) => {
          axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
        });
    },
    updateTranslate: (strDataJSON, callback) => {
        let i, len, dataObj = {
            strid: strDataJSON.localeObj.strid,
            tag: strDataJSON.localeObj.tag,
            base: strDataJSON.localeObj.base ? strDataJSON.localeObj.base : '',
            project: strDataJSON.project
        };
        for (i = 0, len = supportLangs.length; i < len; i+=1) {
            dataObj[supportLangs[i]] = strDataJSON.localeObj[supportLangs[i]] ? strDataJSON.localeObj[supportLangs[i]] : '';
        }

        return axios.put(
        `${api}/translates/${strDataJSON.stringId}`, qs.stringify(dataObj),
        {headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
          }})
        .then((response) => {
          callback(response.data);
        }, (error) => {
          axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
        });
    },
    removeTranslate: (strDataJSON, projectName, callback) => {
        return axios.delete(
          `${api}/translates/${strDataJSON.id}`,
        {headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
          }, params: {
            project: projectName
          }})
        .then((response) => {
          callback(response.data);
        }, (error) => {
          axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
        });
    },
    removeAllTranslateInProject: (projectName, uuid, callback) => {
      return axios.delete(
        `${api}/projects/${projectName}/translates`,
        {headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem(tokenKey)}`
          }, params: { uuid }})
        .then((response) => {
          callback(response.data);
        }, (error) => {
          axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
        });
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
    }
};

export default localeAPI;
