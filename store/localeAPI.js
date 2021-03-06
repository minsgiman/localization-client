import axios from "axios/index";
import jquery from "jquery";
import qs from "qs";

const api = process.env.baseUrl;
const supportLangs = process.env.suportLanguages;
const tokenKey = process.env.tokenKey;

function ajaxNoAuthCheck(error) {
    return error.status === 401 || error.status === 403;
}

function getFileName(lang, type) {
    if (type === "json" || type === "xml") {
        return `locale-${lang}.${type}`;
    }
    if (type === "xlsx") {
        return "locale.xlsx";
    }
    if (type === "ascii") {
        return `Messages_${lang}.properties`;
    }
    return "noname";
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
    getLogList: projectName => {
        return axios.get(`${api}/projects/${projectName}/logs`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        });
    },
    getSampleFile: () => {
        jquery.ajax({
            type: "GET",
            url: `${api}/translates/sampleFile`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            },
            xhrFields: {
                responseType: "blob"
            },
            success: function(blob) {
                const windowUrl = window.URL || window.webkitURL;
                const url = windowUrl.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "sample.xlsx";
                anchor.click();
                windowUrl.revokeObjectURL(url);
            },
            error: function(error) {
                ajaxNoAuthCheck(error) ? (location.href = "/login") : null;
            }
        });
    },
    getTranslateFile: ({ projectName, lang, type }) => {
        jquery.ajax({
            type: "GET",
            url: `${api}/translates/file?projectName=${projectName}&lang=${lang}&type=${type}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            },
            xhrFields: {
                responseType: "blob"
            },
            success: function(blob) {
                const windowUrl = window.URL || window.webkitURL;
                const url = windowUrl.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = getFileName(lang, type);
                anchor.click();
                windowUrl.revokeObjectURL(url);
            },
            error: function(error) {
                ajaxNoAuthCheck(error) ? (location.href = "/login") : null;
            }
        });
    },

    uploadForm: ({ projectName, elId }) => {
        const formData = new FormData();
        const inputEl = document.getElementById(elId);

        return new Promise((resolve, reject) => {
            if (!inputEl) {
                reject(new Error("wrong element Id"));
                return;
            }

            formData.append("file", inputEl.files[0]);
            jquery.ajax({
                type: "POST",
                url: `${api}/translates/file/${projectName}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
                },
                processData: false,
                contentType: false,
                data: formData,
                xhr: function() {
                    const xhr = jquery.ajaxSettings.xhr();
                    xhr.upload.onprogress = function(e) {
                        const percent = (e.loaded * 100) / e.total;
                        //console.log('percent : ' + percent);
                    };
                    return xhr;
                },
                success: function(data) {
                    resolve({ data });
                },
                error: function(error) {
                    ajaxNoAuthCheck(error) ? (location.href = "/login") : null;
                    reject(new Error("get server error"));
                }
            });
        });
    },

    getProjects: () => {
        return axios.get(`${api}/projects`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        });
    },
    getTranslateList: projectUUID => {
        return axios.get(`${api}/translateList?projectUUID=${projectUUID}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        });
    },
    getSearchList: search => {
        return axios.get(`${api}/translates/search?search=${search}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        });
    },
    addTranslate: ({ strData, projectData }) => {
        let i,
            len,
            dataObj = {
                project: projectData.name,
                uuid: projectData.uuid,
                tag: strData.tag ? strData.tag : ""
            };
        for (i = 0, len = supportLangs.length; i < len; i += 1) {
            dataObj[supportLangs[i]] = strData[supportLangs[i]]
                ? strData[supportLangs[i]]
                : "";
        }

        return axios.post(`${api}/translates`, qs.stringify(dataObj), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        });
    },
    updateTranslate: strData => {
        let i,
            len,
            dataObj = {
                strid: strData.localeObj.strid,
                tag: strData.localeObj.tag,
                project: strData.project
            };
        for (i = 0, len = supportLangs.length; i < len; i += 1) {
            dataObj[supportLangs[i]] = strData.localeObj[supportLangs[i]]
                ? strData.localeObj[supportLangs[i]]
                : "";
        }

        return axios.put(
            `${api}/translates/${strData.stringId}`,
            qs.stringify(dataObj),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
                }
            }
        );
    },
    removeTranslate: ({ id, projectName }) => {
        return axios.delete(`${api}/translates/${id}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            },
            params: {
                project: projectName
            }
        });
    },
    removeAllTranslateInProject: ({ name, uuid }) => {
        return axios.delete(`${api}/projects/${name}/translates`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            },
            params: { uuid }
        });
    },
    removeProject: ({ name, uuid }) => {
        return axios.delete(`${api}/projects/${name}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            },
            params: { uuid }
        });
    },
    updateProject: ({ name, languages, base }) => {
        return axios.put(
            `${api}/projects/${name}`,
            qs.stringify({ languages, base }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
                }
            }
        );
    },
    createProject: ({ name, languages, base }) => {
        return axios.post(
            `${api}/projects`,
            qs.stringify({ name, languages, base }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
                }
            }
        );
    },
    getUser: () => {
        return axios.get(`${api}/users/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
            }
        });
    },
    login: ({ id, password }) => {
        return axios.post(
            `${api}/users/login`,
            qs.stringify({ id, password }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
                }
            }
        );
    },
    createUser: ({ id, password }) => {
        return axios.post(
            `${api}/users/signup`,
            qs.stringify({ id, password, admin: false }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
                }
            }
        );
    }
};

export default localeAPI;
