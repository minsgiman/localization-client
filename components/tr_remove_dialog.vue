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
        methods : {
            removeTranslate: function () {
                if (!this.deleteId) {
                    alert("string ID가 잘못되었습니다.");
                    return;
                }
                this.$store.dispatch('REMOVE_TRANSLATE', this.deleteId).then((res) => {
                    if (res && res.code === 'ok') {
                        this.closeDlg();
                    } else {
                        alert("번역어 삭제에 실패하였습니다.");
                    }
                }).catch((err) => {
                    this.axiosNoAuthCheck(err) ? this.$router.push('/login') : alert(`error: ${err}`);
                });
            },
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            }
        },
        components: {
            modal_dialog
        }
    }
</script>
