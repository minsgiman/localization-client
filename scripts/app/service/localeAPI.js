import config from "../config/config";
import axios from "axios/index";
import jquery from "jquery";
import { router } from "../main";

function axiosNoAuthCheck(error) {
    return (error.response && (error.response.status === 401 || error.response.status === 403));
}

function ajaxNoAuthCheck(error) {
    return (error.status === 401 || error.status === 403);
}

const localeAPI = {
    getLogList: (projectName, callback) => {
        axios.get(`${config.serverUrl}/projects/${projectName}/logs`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`}})
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('get logList Error : ' + error);
                axiosNoAuthCheck(error) ? router.push({path: 'loginPage'}) : callback(null);
            });
    },
    getProjects: (callback) => {
        axios.get(`${config.serverUrl}/projects`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`}})
            .then((response) => {
               callback(response.data);
            }, (error) => {
                console.log('getProjects Error : ' + error);
                axiosNoAuthCheck(error) ? router.push({path: 'loginPage'}) : callback(null);
            });
    },
    getTranslateList: (projectUUID, callback) => {
        axios.get(`${config.serverUrl}/translateList?projectUUID=${projectUUID}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`}})
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('getTranslateList Error : ' + error);
                axiosNoAuthCheck(error) ? router.push({path: 'loginPage'}) : callback(null);
            });
    },
    getSearchList: (search, callback) => {
        axios.get(`${config.serverUrl}/translates/search?search=${search}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`}})
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('searchTranslate Error : ' + error);
                axiosNoAuthCheck(error) ? router.push({path: 'loginPage'}) : callback(null);
            });
    },
    addTranslate: (strDataJSON, projectJSON, callback) => {
        let i, len, dataObj = {
            project: projectJSON.name,
            uuid: projectJSON.uuid,
            base: strDataJSON[config.baseLanguage] ? strDataJSON[config.baseLanguage] : '',
            tag: strDataJSON.tag ? strDataJSON.tag : ''
        };
        for (i = 0, len = config.suportLanguages.length; i < len; i+=1) {
            dataObj[config.suportLanguages[i]] = strDataJSON[config.suportLanguages[i]] ? strDataJSON[config.suportLanguages[i]] : '';
        }
        jquery.ajax({
            method:'post',
            url: `${config.serverUrl}/translates`,
            data: dataObj,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('addTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    updateTranslate: (strDataJSON, callback) => {
        let i, len, dataObj = {
            strid: strDataJSON.localeObj.strid,
            tag: strDataJSON.localeObj.tag,
            base: strDataJSON.localeObj.base ? strDataJSON.localeObj.base : '',
            project: strDataJSON.project
        };
        for (i = 0, len = config.suportLanguages.length; i < len; i+=1) {
            dataObj[config.suportLanguages[i]] = strDataJSON.localeObj[config.suportLanguages[i]] ? strDataJSON.localeObj[config.suportLanguages[i]] : '';
        }
        jquery.ajax({
            method: 'put',
            url: `${config.serverUrl}/translates/${strDataJSON.stringId}`,
            data: dataObj,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('updateTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    removeTranslate: (strDataJSON, projectName, callback) => {
        jquery.ajax({
            method:'delete',
            url: `${config.serverUrl}/translates/${strDataJSON.id}`,
            data: {
                strid: strDataJSON.strid,
                base: strDataJSON.base,
                project: projectName
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    removeAllTranslateInProject: (projectName, uuid, callback) => {
        jquery.ajax({
            method:'delete',
            url: `${config.serverUrl}/projects/${projectName}/translates`,
            data: {
                uuid: uuid
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeAllTranslateInProject Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    removeProject: (projectName, uuid, callback) => {
        jquery.ajax({
            method:'delete',
            url: `${config.serverUrl}/projects/${projectName}`,
            data: {
                uuid: uuid
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeProject Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    updateProject: (projectName, languages, uuid, callback) => {
        jquery.ajax({
            method: 'put',
            url: `${config.serverUrl}/projects/${projectName}`,
            data: {
                languages: languages
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('updateTranslate Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    createProject: (projectName, languages, callback) => {
        jquery.ajax({
            method:'post',
            url: `${config.serverUrl}/projects`,
            data: {
                name: projectName,
                languages: languages
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('createProject Error : ' + err);
            ajaxNoAuthCheck(err) ? router.push({path: 'loginPage'}) : callback(null);
        });
    },
    getUser: () => {
        return axios.get(`${config.serverUrl}/users/me`,
            {headers: {Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`}});
    },
    login: (id, password, callback) => {
        jquery.ajax({
            method: 'post',
            url: `${config.serverUrl}/users/login`,
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