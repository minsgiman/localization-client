import managePage from './../component/manage_page';
import projectPage from './../component/project_page';

export default {
    routes: [
        {path: '/managePage', component: managePage},
        {path: '/projectPage', component: projectPage}
    ],
    serverUrl: 'http://127.0.0.1:10010',
    suportLanguages: ['ko', 'ja', 'en', 'es', 'de', 'zh'],
    langTitleMap: {
        'ko' : '한국어',
        'ja' : '일본어',
        'en' : '영어',
        'es' : '스페인어',
        'de' : '독일어',
        'zh' : '중국어'
    },
    baseLanguage: 'ko'
}