<template>
    <div id="loglist_dlg">
        <div class="dimmed"></div>
        <div class="ly_pop ly_medium" style="z-index:1500;">
            <div class="content_wrap">
                <span class="logtxt" v-for="log in loglist" v-html="log"></span>
                <span v-if="!loglist.length">최근 로그가 없습니다.</span>
            </div>
            <div class="btn_box">
                <button type="button" class="btn_confirm btn_b" v-on:click="closeDlg()">확인</button>
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

<style lang="less">
    #loglist_dlg {
        position:fixed; top:100px;
        .dimmed{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:130;display: block;}
        @media only screen and (max-width:1600px) {
            .dimmed_content{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:80; display: none;}
        }
        .ly_pop{
            position:fixed;top:15%;left:25%;width:50%;padding: 10px 30px 30px 30px; z-index:200;background:#fff;box-sizing:border-box;
            .ly_tit{
                margin-top:20px;
            }
            .content_wrap{
                margin-top:40px;font-size:19px;height:210px;border:1px solid black;overflow-y:auto;
                .logtxt {
                    display:block;font-size:15px;
                }
            }
            .btn_box{
                margin-top:50px;text-align:center; clear: both;
                .btn_b{
                    height:50px;width: 150px; font-size:16px;color:#fff;border-radius: 25px; padding: 0; margin: 0 5px;cursor:pointer;
                }
                .btn_confirm {
                    background: #4b96e6;
                }
            }
        }
    }
</style>