<template>
    <div id="tr_rm_dlg" class="dialog">
        <div class="dimmed"></div>
        <div class="ly_pop ly_medium" style="z-index:1500;">
            <div class="content_wrap">
                정말로 <span style="color:blue;">'{{projectName}}'</span> 프로젝트의 모든 번역어를 삭제하겠습니까?<br><span style="font-weight:bold;color:red;">확실합니까?</span>
            </div>
            <div class="btn-box">
                <button type="button" class="btn-cancel btn-b" v-on:click="removeAllTranslate()">확인</button>
                <button type="button" class="btn-confirm btn-b" v-on:click="closeDlg()">취소</button>
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
