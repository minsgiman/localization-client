import axios from "axios/index";
import jquery from "jquery";

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
    getProjects: (callback) => {
        axios.get(`${api}/projects`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}})
            .then((response) => {
               callback(response.data);
            }, (error) => {
                console.log('getProjects Error : ' + error);
                axiosNoAuthCheck(error) ? location.href = '/login' : callback(null);
            });
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
        jquery.ajax({
            method:'post',
            url: `${api}/translates`,
            data: dataObj,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('addTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
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
        jquery.ajax({
            method: 'put',
            url: `${api}/translates/${strDataJSON.stringId}`,
            data: dataObj,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('updateTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
        });
    },
    removeTranslate: (strDataJSON, projectName, callback) => {
        jquery.ajax({
            method:'delete',
            url: `${api}/translates/${strDataJSON.id}`,
            data: {
                strid: strDataJSON.strid,
                base: strDataJSON.base,
                project: projectName
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
        });
    },
    removeAllTranslateInProject: (projectName, uuid, callback) => {
        jquery.ajax({
            method:'delete',
            url: `${api}/projects/${projectName}/translates`,
            data: {
                uuid: uuid
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeAllTranslateInProject Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
        });
    },
    removeProject: (projectName, uuid, callback) => {
        jquery.ajax({
            method:'delete',
            url: `${api}/projects/${projectName}`,
            data: {
                uuid: uuid
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeProject Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
        });
    },
    updateProject: (projectName, languages, uuid, callback) => {
        jquery.ajax({
            method: 'put',
            url: `${api}/projects/${projectName}`,
            data: {
                languages: languages
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('updateTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
        });
    },
    createProject: (projectName, languages, callback) => {
        jquery.ajax({
            method:'post',
            url: `${api}/projects`,
            data: {
                name: projectName,
                languages: languages
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('createProject Error : ' + err);
            ajaxNoAuthCheck(err) ? location.href = '/login' : callback(null);
        });
    },
    getUser: () => {
        return axios.get(`${api}/users/me`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(tokenKey)}`}});
    },
    login: (id, password, callback) => {
        jquery.ajax({
            method: 'post',
            url: `${api}/users/login`,
            data: {
                id, password
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('login Error : ' + err);
            callback(null);
        });
    }
};

export default localeAPI;
