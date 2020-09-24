<template>
    <div id="input_dlg">
        <div class="dimmed"></div>
        <div class="ly_pop ly_medium" style="z-index:1500;">
            <div class="content_wrap">
                정말로 <span style="color:blue;">'{{projectName}}'</span> 프로젝트의 모든 번역어를 삭제하겠습니까?<br><span style="font-weight:bold;color:red;">확실합니까?</span>
            </div>
            <div class="btn_box">
                <button type="button" class="btn_cancel btn_b" v-on:click="removeAllTranslate()">확인</button>
                <button type="button" class="btn_confirm btn_b" v-on:click="closeDlg()">취소</button>
            </div>
        </div>
    </div>
</template>

<script>
    import gEventBus from '@/store/gEventBus';

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
        created : function () {
            gEventBus.$on('REMOVE_TRANSLATE', this.onRemoveTranslate);
        },
        beforeDestroy : function () {
            gEventBus.$off('REMOVE_TRANSLATE');
        },
        mounted : function () {
        },
        methods : {
            closeDlg: function () {
                this.$emit('destroy');
                this.$destroy();
            },
            removeAllTranslate: function () {
                if (this.projectName && this.projectUUID) {
                    this.$store.dispatch('REMOVE_ALL_TRANSLATE', {name: this.projectName, uuid: this.projectUUID});
                }
            },
            onRemoveTranslate: function(result) {
                if(result) {
                    this.closeDlg();
                } else {
                    alert("번역어 삭제에 실패하였습니다.");
                }
            }
        }
    }
</script>

<style lang="scss">
    #input_dlg {
        position:fixed; top:100px;
        .dimmed{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:130;display: block;}
        @media only screen and (max-width:1600px) {
            .dimmed_content{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:80; display: none;}
        }
        .ly_pop{
            position:fixed;top:30%;left:35%;width:34%;padding: 10px 30px 30px 30px; z-index:200;background:#fff;box-sizing:border-box;
            .ly_tit{
                margin-top:20px;
            }
            .content_wrap{
                margin-top:40px;font-size:19px;
                input{
                    font-size:19px;
                    height:30px;
                }
                .check_wrap {
                    position:relative;
                    display:inline-block;
                    width:110px;
                    margin-right:20px;
                    input {
                        position:absolute;
                        left:5px;
                    }
                    label {
                        position:absolute;
                        left:27px;
                        top:5px;
                    }
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
                .btn_cancel {
                    background: #777;
                }
            }
        }
    }
</style>
