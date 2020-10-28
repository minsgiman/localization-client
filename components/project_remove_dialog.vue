<template>
    <div id="pro_remove_dlg" class="dialog">
        <modal_dialog
            @close="closeDlg"
            :dlg-style="{ width: '400px', padding: '30px' }"
        >
            <template slot="content">
                <div class="content_wrap">
                    정말로
                    <span style="color:blue;">'{{ project.name }}'</span>를
                    삭제하겠습니까?<br />저장한 모든 번역어도 같이
                    날라갑니다.<br /><span style="font-weight:bold;color:red;"
                        >함부로 지우지마세요!</span
                    >
                </div>
                <div class="btn-box">
                    <button
                        type="button"
                        class="btn-confirm btn-b"
                        v-on:click="removeProject()"
                    >
                        확인
                    </button>
                    <button
                        type="button"
                        class="btn-cancel btn-b"
                        v-on:click="closeDlg()"
                    >
                        취소
                    </button>
                </div>
            </template>
        </modal_dialog>
    </div>
</template>

<script>
import modal_dialog from "./modal_dialog";

export default {
    props: {
        project: {
            type: Object,
            default: {}
        }
    },
    data: function() {
        return {};
    },
    methods: {
        closeDlg: function() {
            this.$emit("destroy");
            this.$destroy();
        },
        async removeProject() {
            if (!this.project) {
                return;
            }

            try {
                this.$store.dispatch("SET_LOADING", true);
                const rResponse = await this.$store.dispatch("REMOVE_PROJECT", {
                    name: this.project.name,
                    uuid: this.project.uuid
                });
                if (rResponse && rResponse.code === "ok") {
                    await this.$store.dispatch("FETCH_PROJECT_LIST");
                    this.closeDlg();
                } else {
                    alert("프로젝트 삭제에 실패하였습니다.");
                }
                this.$store.dispatch("SET_LOADING", false);
            } catch (err) {
                this.axiosNoAuthCheck(err)
                    ? this.$router.push("/login")
                    : alert(`error: ${err}`);
            }
        }
    },
    components: {
        modal_dialog
    }
};
</script>
