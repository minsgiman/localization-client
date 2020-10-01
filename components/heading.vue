<template>
  <header>
    <h2 class="main_title" @click="moveToMain">
      TOASTCAM <span>Front Localization</span> <span style="margin-left:10px;"></span>
    </h2>
    <div class="account-cont" v-if="userInfo">
      <h4 class="account-cont__name">{{userInfo.id}}</h4>
      <button class="account-cont__logout" @click="logout">Logout</button>
    </div>
  </header>
</template>

<script>
  export default {
      computed : {
          userInfo : function () {
              return this.$store.state.user;
          }
      },
      methods: {
          moveToMain: function () {
              this.$router.push('/');
          },
          logout: function () {
              this.$store.dispatch('REQUEST_LOGOUT');
              this.$router.push('/login');
          }
      }
  }
</script>
