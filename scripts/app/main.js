import Vue from 'vue';
import VueRouter from 'vue-router';
import 'es6-promise/auto';
import config from './config/config';
import app from './app';
import store from './service/store';
import './../../style/common.less';

window.onerror = (msg, url, line) => {
    alert("Caught Error : " + msg + " from " + url + ":" + line);
    return true;
};

const util = {
    syncFor: (index, len, status, func) => {
        func(index, status, (res) => {
            if (res == "next") {
                index++;
                if (index < len) {
                    util.syncFor(index, len, "r", func);
                } else {
                    return func(index, "done", () => {});
                }
            } else if (res == "fail") {
                return func(index, "fail", () => {});
            }
        });
    }
};

Vue.use(VueRouter);
const router = new VueRouter({
    routes: config.routes
});

const vueApp = new Vue({
    el: '#main',
    router,
    store,
    template: '<app/>',
    components: { app }
});

//router.push({path: 'managePage'});

export { router, util };
