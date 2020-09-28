<template>
    <div id="loglist_dlg" class="dialog">
      <modal_dialog @close="closeDlg" :dlg-style="{width:'800px', padding:'30px'}">
        <template slot="content">
          <div class="content_wrap">
            <span class="logtxt" v-for="log in loglist" v-html="log"></span>
            <span v-if="!loglist.length">최근 로그가 없습니다.</span>
          </div>
          <div class="btn-box">
            <button type="button" class="btn-confirm btn-b" v-on:click="closeDlg()">확인</button>
          </div>
        </template>
      </modal_dialog>
    </div>
</template>

<script>
    import modal_dialog from './modal_dialog';

    export default {
        props : {
            loglist: {
                type: Array,
                default: []
            }
        },
        data : function() {
            return {
            }
        },
        created : function () {
        },
        beforeDestroy : function () {
        },
        mounted : function () {
        },
        methods : {
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

<style lang="scss">
    #loglist_dlg.dialog {
        .content_wrap{
          height:210px;
          border:1px solid black;
          overflow-y:auto;
            .logtxt {
                display:block;font-size:15px;
            }
        }
    }
</style>
