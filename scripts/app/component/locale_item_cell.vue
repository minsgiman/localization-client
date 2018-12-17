<template>
    <tr class="locale_item_cell" @click="editModeStart()">
        <td width="8%" class="tr_index">{{$vnode.key + 1}}.</td>
        <td width="10%" class="tr_key">
            <span v-show="!isEdit">{{localeObj.strid}}</span>
            <input v-show="isEdit" class="tr_key" v-model="editLocaleObj['strid']">
        </td>
        <td width="8%" class="tr_key">
            <span v-show="!isEdit">{{localeObj.tag}}</span>
            <input v-show="isEdit" class="tr_key" v-model="editLocaleObj['tag']">
        </td>
        <td width="23%" class="tr_key">
            <span>{{localeObj[defaultLang]}}</span>
        </td>
        <td width="28%" class="tr_kr">
            <span v-show="!isEdit">{{localeObj[pSelectLang]}}</span>
            <input v-show="isEdit" class="tr_kr" v-model="editLocaleObj[pSelectLang]">
        </td>
        <td width="17%">
            <button v-show="!isEdit" @click.stop="deleteTranslate()">삭제</button>
            <button v-show="isEdit" @click.stop="saveEdit()">저장</button>
            <button v-show="isEdit" @click.stop="editCancel()">취소</button>
        </td>
    </tr>
</template>
<script>
    import gEventBus from './../service/gEventBus';
    import config from "../config/config";

    export default {
        props : {
            pId: {type: String, default: ""},
            pSelectLang: {type: String, default: ""},
            pLocaleObj: {type: Object, default: {}}
        },
        data : function() {
            return {
                localeObj: {},
                editLocaleObj: {},
                isEdit: false
            }
        },
        computed : {
            defaultLang : function () {
                return config.baseLanguage;
            }
        },
        created : function() {
            this.localeObj = JSON.parse(JSON.stringify(this.pLocaleObj));
            gEventBus.$on('UPDATE_TRANSLATE_' + this.pId, this.onUpdateTranslate);
        },
        mounted : function() {
        },
        beforeDestroy : function () {
            gEventBus.$off('UPDATE_TRANSLATE_' + this.pId);
        },
        methods : {
            deleteTranslate: function() {
                this.$emit('deleteTranslate');
            },
            editModeStart: function() {
                if (!this.isEdit) {
                    this.editLocaleObj = JSON.parse(JSON.stringify(this.localeObj));
                    this.isEdit = true;
                }
            },
            editCancel: function() {
                this.isEdit = false;
            },
            saveEdit: function() {
                if (this.pSelectLang === this.defaultLang) {
                    this.editLocaleObj.base = this.editLocaleObj[this.pSelectLang];
                }
                this.$store.dispatch('UPDATE_TRANSLATE', {
                    stringId: this.pId,
                    localeObj: this.editLocaleObj,
                });
            },
            onUpdateTranslate: function(result) {
                if(result) {
                    this.localeObj = JSON.parse(JSON.stringify(this.editLocaleObj));
                } else {
                    alert("번역어 업데이트에 실패하였습니다.");
                }
                this.isEdit = false;
            },
        }
    }
</script>

<style lang="less">
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
    }
</style>