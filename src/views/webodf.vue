<template>
  <div class="put_odf_div"></div>
</template>

<script>
export default {
  name: "Webodf",
  data() {},
  mounted() {
    this.$nextTick(() => {
      let putOdfDiv = document.getElementsByClassName("put_odf_div");
      let newOdf = new odf().OdfCanvas(putOdfDiv);
      console.log("newOdf", newOdf);
    });
  },
  destroyed() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
