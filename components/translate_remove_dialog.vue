<template>
    <div id="tr_rm_dlg" class="dialog">
      <modal_dialog @close="closeDlg" :dlg-style="{width:'500px', padding:'30px'}">
        <template slot="content">
          <div class="content_wrap">
            정말로 <span style="color:blue;">'{{projectName}}'</span> 프로젝트의 모든 번역어를 삭제하겠습니까?<br><span style="font-weight:bold;color:red;">확실합니까?</span>
          </div>
          <div class="btn-box">
            <button type="button" class="btn-confirm btn-b" v-on:click="removeAllTranslate()">확인</button>
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
        },
        computed : {
            projectName: function () {
                return this.$store.state.currentProject.name;
            },
            projectUUID: function () {
                return this.$store.state.currentProject.uuid;
            }
        },
        methods : {
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            },
            removeAllTranslate: function () {
                if (this.projectName && this.projectUUID) {
                    this.$store.dispatch('REMOVE_ALL_TRANSLATE', {name: this.projectName, uuid: this.projectUUID}).then((res) => {
                      (res && res.code === 'ok') ? this.closeDlg() : alert("번역어 삭제에 실패하였습니다.");
                    }).catch((err) => {
                        this.axiosNoAuthCheck(err) ? this.$router.push('/login') : alert(`error: ${err}`);
                    })
                }
            }
        },
        components: {
            modal_dialog
        }
    }
</script>
