<template>
    <div id="tr_add_dlg" class="dialog">
      <modal_dialog @close="closeDlg" :dlg-style="{width:'400px', padding:'30px'}">
        <template slot="content">
          <div class="content_wrap">
            <span>정말 삭제하시겠습니까?</span>
          </div>
          <div class="btn-box">
            <button type="button" class="btn-confirm btn-b" v-on:click="removeTranslate()">확인</button>
            <button type="button" class="btn-cancel btn-b" v-on:click="closeDlg()">취소</button>
          </div>
        </template>
      </modal_dialog>
    </div>
</template>

<script>
    import gEventBus from '@/store/gEventBus';
    import modal_dialog from './modal_dialog';

    export default {
        props : {
            deleteId: {
                type: String,
                dafault: ''
            },
            deleteStrId: {
                type: String,
                dafault: ''
            },
            deleteBase: {
                type: String,
                dafault: ''
            }
        },
        data : function() {
            return {
                stringId: ''
            }
        },
        computed : {
        },
        created : function () {
            gEventBus.$on('REMOVE_TRANSLATE', this.onRemoveTranslate);
        },
        beforeDestroy : function () {
            gEventBus.$off('REMOVE_TRANSLATE');
        },
        mounted : function () {

        },
        methods : {
            removeTranslate: function () {
                if (this.deleteId) {
                    this.$store.dispatch('REMOVE_TRANSLATE', {
                        id: this.deleteId,
                        strid: this.deleteStrId,
                        base: this.deleteBase
                    });
                } else {
                    alert("string ID가 잘못되었습니다.");
                }
            },
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            },
            onRemoveTranslate: function(result) {
                if(result) {
                    this.closeDlg();
                    //alert("번역어 삭제에 성공하였습니다.")
                } else {
                    alert("번역어 삭제에 실패하였습니다.");
                }
            },
        },
        components: {
            modal_dialog
        }
    }
</script>
