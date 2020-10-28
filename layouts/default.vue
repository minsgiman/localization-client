<template>
    <div id="app">
        <heading></heading>
        <nuxt></nuxt>
        <loading v-if="isLoading"></loading>
    </div>
</template>

<script>
import heading from "@/components/heading.vue";
import loading from "@/components/loading.vue";

export default {
    name: "app",
    computed: {
        isLoading: function() {
            return this.$store.state.isLoading;
        }
    },
    components: {
        heading,
        loading
    }
};
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
</style>
