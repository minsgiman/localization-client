<template>
    <tr class="locale_item_cell" @click="editModeStart()" @keyup.enter="saveEdit()">
        <td width="8%" class="tr_index">{{pIdx + 1}}.</td>
        <td width="10%" class="tr_key">
            <span v-show="!isEdit">{{localeObj.strid}}</span>
            <input v-show="isEdit" class="tr_key" v-model="editLocaleObj['strid']">
        </td>
        <td width="8%" class="tr_key">
            <span v-show="!isEdit">{{localeObj.tag}}</span>
            <input v-show="isEdit" class="tr_key" v-model="editLocaleObj['tag']">
        </td>
        <td :width="pSelectLang !== 'all' ? '23%' : '10%'" class="tr_key">
            <span class="translate_txt">{{localeObj[defaultLang]}}</span>
        </td>
        <td v-if="pSelectLang !== 'all'" width="28%" class="tr_kr">
            <span class="translate_txt" v-show="!isEdit">{{localeObj[pSelectLang]}}</span>
            <textarea v-show="isEdit" class="tr_kr" v-model="editLocaleObj[pSelectLang]" @keydown.enter="textEnterKey"></textarea>
        </td>
        <td v-if="pSelectLang === 'all'"  width="10%" class="tr_kr" v-for="(item, index) in projectLanguages">
            <span class="translate_txt" v-show="!isEdit">{{localeObj[item]}}</span>
            <textarea v-show="isEdit" class="tr_kr" v-model="editLocaleObj[item]" @keydown.enter="textEnterKey"></textarea>
        </td>
        <td width="17%">
            <button v-show="!isEdit" @click.stop="deleteTranslate()">삭제</button>
            <button v-show="!isEdit" @click.stop="addCopyTranslate()">복사추가</button>
            <button v-show="isEdit" @click.stop="saveEdit()">저장</button>
            <button v-show="isEdit" @click.stop="editCancel()">취소</button>
        </td>
    </tr>
</template>
<script>
    import gEventBus from '@/store/gEventBus';

    function convertLangStrToArr (str) {
        if (!str) {
            return [];
        }
        return str.split(',');
    }

    export default {
        props : {
            uid: {type: String, default: ""},
            pSelectLang: {type: String, default: ""},
            pLocaleObj: {type: Object, default: {}},
            pIdx: {type: Number, default: 0}
        },
        data : function() {
            return {
                localeObj: {},
                editLocaleObj: {}
            }
        },
        computed : {
            defaultLang : function () {
                return process.env.baseLanguage;
            },
            currentEditTranslateId : function () {
                return this.$store.state.currentEditTranslateId;
            },
            projectLanguages : function () {
                return convertLangStrToArr(this.$store.state.currentProject.languages);
            },
            isEdit: function () {
                return this.uid === this.currentEditTranslateId;
            }
        },
        created : function() {
            this.localeObj = JSON.parse(JSON.stringify(this.pLocaleObj));
            gEventBus.$on('UPDATE_TRANSLATE_' + this.uid, this.onUpdateTranslate);
        },
        mounted : function() {
        },
        beforeDestroy : function () {
            gEventBus.$off('UPDATE_TRANSLATE_' + this.uid);
            if (this.isEdit) {
                this.$store.dispatch('UPDATE_EDIT_TRANSLATE_ID', '');
            }
        },
        methods : {
            deleteTranslate: function() {
                this.$emit('deleteTranslate');
            },
            addCopyTranslate: function() {
                    let key, data = {};
                    for (key in this.localeObj) {
                        data[key] = this.localeObj[key];
                    }
                    delete data.base;
                    delete data.strid;
                    this.$store.dispatch('ADD_TRANSLATE', data);
            },
            editModeStart: function() {
                if (!this.isEdit) {
                    this.editLocaleObj = JSON.parse(JSON.stringify(this.localeObj));
                    this.$store.dispatch('UPDATE_EDIT_TRANSLATE_ID', this.uid);
                }
            },
            editCancel: function() {
                this.$store.dispatch('UPDATE_EDIT_TRANSLATE_ID', '');
            },
            saveEdit: function() {
                if (this.pSelectLang === this.defaultLang) {
                    this.editLocaleObj.base = this.editLocaleObj[this.pSelectLang];
                }
                this.$store.dispatch('UPDATE_TRANSLATE', {
                    stringId: this.uid,
                    localeObj: this.editLocaleObj,
                });
            },
            textEnterKey: function(event) {
                event.preventDefault();
            },
            onUpdateTranslate: function(result) {
                if(result) {
                    this.localeObj = JSON.parse(JSON.stringify(this.editLocaleObj));
                } else {
                    alert("번역어 업데이트에 실패하였습니다.");
                }
                this.$store.dispatch('UPDATE_EDIT_TRANSLATE_ID', '');
            },
        }
    }
</script>

<style lang="scss">
    .locale_item_cell {

        padding: 14px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        &:nth-child(1) {
            padding-left:40px;
        }

        margin-top: 10px;
        margin-left: 40px;
        padding-top: 14px;
        width:90%;
        height:34px;
        border:1px solid gray;
        cursor:pointer;
        input {
            height:20px;
            width:100%;
            font-size:12px;
        }
        button {
            display:inline-block;
            width:80px;
            height:32px;
            background: #ffffff;
            border: solid 1px #777777;
            font-size:14px;
            cursor:pointer;
            &:hover{
                background: #444444;
                color: #ffffff;
                border:none;
            }
        }
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
        .translate_txt {
            white-space: pre-wrap;
        }
        textarea {
            width: 100%;
            height: 120px;
            padding: 10px;
            box-sizing: border-box;
            border: solid 1px #ccc;
            border-radius: 5px;
            font-size:14px;
            resize: none;
        }
    }
</style>
