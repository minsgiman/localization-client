import config from "../config/config";
import axios from "axios/index";
import jquery from "jquery";

const localeAPI = {
    getLogList: (projectUUID, callback) => {
        axios.get(config.serverUrl + "/logList?projectUUID=" + projectUUID)
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('get logList Error : ' + error);
                callback(null);
            });
    },
    getProjects: (callback) => {
        axios.get(config.serverUrl + "/projectList")
            .then((response) => {
               callback(response.data);
            }, (error) => {
                console.log('getProjects Error : ' + error);
                callback(null);
            });
    },
    getTranslateList: (projectUUID, callback) => {
        axios.get(config.serverUrl + "/translateList?projectUUID=" + projectUUID)
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('getTranslateList Error : ' + error);
                callback(null);
            });
    },
    getTranslate: (strId, callback) => {
        axios.get(config.serverUrl + "/translate?findKey=" + strId)
            .then((response) => {
                callback(response.data);
            }, (error) => {
                console.log('getTranslate Error : ' + error);
                callback(null);
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
            url: config.serverUrl + "/translate",
            data: dataObj
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('addTranslate Error : ' + err);
            callback(null);
        });
    },
    updateTranslate: (strDataJSON, callback) => {
        let i, len, dataObj = {
            key: strDataJSON.stringId,
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
            url: config.serverUrl + "/translate",
            data: dataObj
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('updateTranslate Error : ' + err);
            callback(null);
        });
    },
    removeTranslate: (stringId, projectName, callback) => {
        jquery.ajax({
            method:'delete',
            url: config.serverUrl + "/translate",
            data: {
                key: stringId,
                project: projectName
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeTranslate Error : ' + err);
            callback(null);
        });
    },
    removeAllTranslateInProject: (projectName, uuid, callback) => {
        jquery.ajax({
            method:'delete',
            url: config.serverUrl + "/allTranslateInProject",
            data: {
                name: projectName,
                uuid: uuid
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeAllTranslateInProject Error : ' + err);
            callback(null);
        });
    },
    removeProject: (projectName, uuid, callback) => {
        jquery.ajax({
            method:'delete',
            url: config.serverUrl + "/project",
            data: {
                name: projectName,
                uuid: uuid
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('removeProject Error : ' + err);
            callback(null);
        });
    },
    updateProject: (projectName, languages, uuid, callback) => {
        jquery.ajax({
            method: 'put',
            url: config.serverUrl + "/project",
            data: {
                name: projectName,
                languages: languages,
                uuid: uuid
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('updateTranslate Error : ' + err);
            callback(null);
        });
    },
    createProject: (projectName, languages, callback) => {
        jquery.ajax({
            method:'post',
            url: config.serverUrl + "/project",
            data: {
                name: projectName,
                languages: languages
            }
        }).done(function(res) {
            if (typeof res === "string") {
                callback(JSON.parse(res));
            } else {
                callback(res);
            }
        }).fail(function(err) {
            console.log('createProject Error : ' + err);
            callback(null);
        });
    }
};

export default localeAPI;