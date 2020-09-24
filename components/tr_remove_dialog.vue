<template>
    <div id="tr_add_dlg">
        <div class="dimmed"></div>
        <div class="ly_pop ly_medium" style="z-index:1500;">
            <div class="content_wrap">
                <span>정말 삭제하시겠습니까?</span>
            </div>
            <div class="btn_box">
                <button type="button" class="btn_confirm btn_b" v-on:click="removeTranslate()">확인</button>
                <button type="button" class="btn_cancel btn_b" v-on:click="closeDlg()">취소</button>
            </div>
        </div>
    </div>
</template>

<script>
    import gEventBus from '@/store/gEventBus';

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
        }
    }
</script>

<style lang="scss">
    #tr_add_dlg {
        position:fixed; top:100px;
        .dimmed{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:130;display: block;}
        @media only screen and (max-width:1600px) {
            .dimmed_content{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:80; display: none;}
        }
        .ly_pop{
            position:fixed;top:10%;left:35%;width:25%;padding: 10px 30px 30px 30px; z-index:200;background:#fff;box-sizing:border-box;
            .ly_tit{
                margin-top:20px;
            }
            .content_wrap{
                margin-top:40px;font-size:19px;
                input{
                    font-size:19px;
                    height:30px;
                    width:90%;
                }
                .project_wrap {
                    display:inline-block;
                    margin-top:10px;
                    margin-right:20px;
                    input {
                        width:20px;
                    }
                    label {
                        border:none;
                        margin-top:-5px;
                    }
                }
            }
            .btn_box{
                margin-top:50px;text-align:center; clear: both;
                .btn_b{
                    height:50px;width: 110px; font-size:16px;color:#fff;border-radius: 25px; padding: 0; margin: 0 5px;cursor:pointer;
                }
                .btn_confirm {
                    background: #4b96e6;
                }
                .btn_cancel {
                    background: #777;
                }
            }
        }
    }
</style>
