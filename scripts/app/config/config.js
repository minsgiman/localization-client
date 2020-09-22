import managePage from './../component/manage_page';
import projectPage from './../component/project_page';
import loginPage from './../component/login_page';

export default {
    routes: [
        {path: '/', component: managePage},
        {path: '/managePage', component: managePage},
        {path: '/projectPage', component: projectPage},
        {path: '/loginPage', component: loginPage}
    ],
    serverUrl: 'http://localhost:10000',  //'http://10.161.240.93:10001',
    suportLanguages: ['ko', 'ja', 'en', 'es', 'de', 'zh'],
    langTitleMap: {
        'ko' : '한국어',
        'ja' : '일본어',
        'en' : '영어',
        'es' : '스페인어',
        'de' : '독일어',
        'zh' : '중국어'
    },
    baseLanguage: 'ko',
    tokenKey: 'local-access-token'
}