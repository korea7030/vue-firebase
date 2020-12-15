<template>
    <board-search :text="text" />
</template>
<script>
export default {
    components: { BoardSearch },
    computed: {
        text () {
            return this.$route.query.text
        }
    }
}
</script>
