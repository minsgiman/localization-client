<template>
  <div id="loglist_dlg" class="dialog">
    <modal_dialog @close="closeDlg" :dlg-style="{width:'460px', padding:'30px'}">
      <template slot="content">
        <div class="ly_tit">
          <h2>계정 생성</h2>
        </div>
        <div class="input_txt_area" style="margin-top:30px">
          <input type="text" v-model="userName" placeholder="ID" maxlength="15">
          <button v-show="userName" @click="() => {this.userName = '';}" class="btn_del" tabindex="-1">
            <img src="~assets/img/btn-input-text-delete.png">
          </button>
        </div>
        <div class="input_txt_area">
          <input type="password" v-model="pw" placeholder="Password" maxlength="15">
          <button v-show="pw" @click="() => {this.pw = '';}" class="btn_del" tabindex="-1">
            <img src="~assets/img/btn-input-text-delete.png">
          </button>
        </div>
        <div class="input_txt_area">
          <input type="password" v-model="confPw" placeholder="Password confirm" maxlength="15">
          <button v-show="confPw" @click="() => {this.confPw = '';}" class="btn_del" tabindex="-1">
            <img src="~assets/img/btn-input-text-delete.png">
          </button>
        </div>
        <div class="btn-box">
          <button type="button" class="btn-confirm btn-b" v-on:click="createAccount()">확인</button>
          <button type="button" class="btn-cancel btn-b" v-on:click="closeDlg()">취소</button>
        </div>
      </template>
    </modal_dialog>
  </div>
</template>

<script>
    import modal_dialog from './modal_dialog';

    export default {
        data : function() {
            return {
                userName: '',
                pw: '',
                confPw: ''
            }
        },
        created : function () {
        },
        beforeDestroy : function () {
        },
        mounted : function () {
        },
        methods : {
            createAccount: function () {
              if (!this.userName) {
                  alert('ID를 입력해주세요.');
                  return;
              }
              if (!this.pw || !this.confPw) {
                  alert('Password를 입력해주세요.');
                  return;
              }
              const userName = this.userName.trim(),
                  pw = this.pw.trim(),
                  confPw = this.confPw.trim();

              if (pw !== confPw) {
                  alert('Password가 일치하지 않습니다.');
                  return;
              }
              this.$store.dispatch('CREATE_USER', {id: userName, password: pw}).then((res) => {
                  if (res) {
                      if (res.code === 'ok') {
                          alert(`${userName} 계정을 생성하였습니다.`);
                          this.closeDlg();
                      } else {
                          alert(`error: ${res.msg}`);
                      }
                  } else {
                      alert(`${userName} 계정생성에 실패하였습니다.`);
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
