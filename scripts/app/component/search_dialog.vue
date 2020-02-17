<template>
    <div class="search_dialog">
        <modal_dlg @close="closeDialog" :dlgStyle="dlgStyle">
            <template slot="content">
                <div class="content_wrap">
                    <h2>{{title}}</h2>
                    <div class="search_wrap">
                        <input class="search_input" v-model="searchStr" type="search" placeholder="한글 검색" @keyup.enter="searchTranslate()">
                        <button class="search_btn" @click="searchTranslate">검색</button>
                    </div>
                    <div v-if="translateList.length && !isLoading" class="locale_item_wrap">
                        <table cellpadding="30">
                            <tr>
                                <th width="4%">No.</th>
                                <th width="8%">Project</th>
                                <th width="12%">StringID</th>
                                <th width="30%">ko</th>
                                <th width="30%">ja</th>
                            </tr>
                            <tr class="locale_item_cell" v-for="(item, index) in translateList">
                                <td width="4%" class="tr_index">{{index + 1}}.</td>
                                <td width="6%" @click="selectProject(item.projectName, item.projectUuid, item.projectLanguages)" class="tr_key">{{item.projectName}}</td>
                                <td width="10%" class="tr_key">{{item.strid}}</td>
                                <td width="30%" class="tr_kr">{{item.ko}}</td>
                                <td width="30%" class="tr_key">{{item.ja}}</td>
                            </tr>
                        </table>
                    </div>
                    <div v-if="!translateList.length && !isLoading" class="no_search_result">검색 결과가 없습니다.</div>
                </div>
            </template>
        </modal_dlg>
    </div>
</template>
<script>
    import modal_dlg from './modal_dialog';
    import gEventBus from './../service/gEventBus';
    import { router } from '../main';

    export default {
        props: ['title'],
        name: '',
        data: function() {
            return {
                searchStr: '',
                dlgStyle: {
                    width: '1280px', height: '629px', padding: '20px', boxSizing: 'border-box'
                },
                translateList: []
            }
        },
        computed : {
            isLoading : function () {
                return this.$store.state.isLoading;
            }
        },
        created : function() {
            gEventBus.$on('SEARCH_TRANSLATE_LIST', this.onSearchTranslateList);
        },
        mounted : function() {

        },
        beforeDestroy : function() {
            gEventBus.$off('SEARCH_TRANSLATE_LIST');
        },
        methods: {
            searchTranslate: function() {
                if (this.searchStr) {
                    this.$store.dispatch('FETCH_SEARCHED_TRANSLATE_LIST', this.searchStr);
                } else {
                    alert('검색어를 입력해주세요.');
                }
            },
            selectProject: function(name, uuid, languages) {
                router.push({path: 'projectPage?' + 'name=' + name + '&uuid=' + uuid + '&languages=' + languages});
            },
            closeDialog: function() {
                this.$emit('destroy');
            },
            onSearchTranslateList: function(translateList) {
                this.translateList = translateList ? translateList : [];
            },
        },
        components : {
            modal_dlg
        }
    }
</script>
<style lang="less">
    .search_dialog {
        .content_wrap {
            text-align:left;
            .search_wrap {
                margin-top: 30px;
                .search_input {
                    display: inline-block;
                    width: 700px;
                    height: 50px;
                    font-size: 20px;
                }
                .search_btn {
                    width: 66px;
                    height: 24px;
                    border: 0;
                    background-color: #4a96e6;
                    color: #fff;
                    display: inline-block;
                    border-radius: 30px;
                    margin-left: 10px;
                    text-align: center;
                    padding-top: 1px;
                    cursor:pointer;
                }
            }
            .no_search_result {
                margin-top: 200px;
                text-align: center;
            }
            .locale_item_wrap {
                margin: 30px 0;
                table {
                    display: block;
                    overflow: auto;
                    height: 500px;
                    border-top: 2px solid #4a4a4a;
                    border-collapse: collapse;
                    width: 100%;
                    th, td {
                        padding: 14px;
                    }
                    .locale_item_cell {
                        text-align: left;
                        margin-top: 10px;
                        padding-top: 14px;
                        height:34px;
                        border-top:1px solid gray;
                        .tr_index {
                            color:black;
                        }
                        .tr_key {
                            color:black;
                        }
                        .tr_kr {
                            color:green;
                        }
                        .tr_jp {
                            color:red;
                        }
                        .tr_eng {
                            color:blue;
                        }
                    }
                }
            }
        }
    }
</style>