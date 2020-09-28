<template>
    <div id="loglist_dlg" class="dialog">
        <div class="dimmed"></div>
        <div class="ly_pop ly_medium" style="z-index:1500;">
            <div class="content_wrap">
                <span class="logtxt" v-for="log in loglist" v-html="log"></span>
                <span v-if="!loglist.length">최근 로그가 없습니다.</span>
            </div>
            <div class="btn-box">
                <button type="button" class="btn-confirm btn-b" v-on:click="closeDlg()">확인</button>
            </div>
        </div>
    </div>
</template>

<script>
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
        }
    }
</script>

<style lang="scss">
    #loglist_dlg.dialog {
        .ly_pop{
          top:15%;
          left:25%;
          width:50%;
            .ly_tit{
                margin-top:20px;
            }
            .content_wrap{
              height:210px;
              border:1px solid black;
              overflow-y:auto;
                .logtxt {
                    display:block;font-size:15px;
                }
            }
        }
    }
</style>
